import { Inject, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  SOCKET_CHAT_PATTERN,
  SOCKET_CONVERSATION_PATTERN,
} from '@shared/socket-pattern';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERN_CHAT } from '@server/shared/message-pattern';
import { catchError, EMPTY, tap } from 'rxjs';
import {
  CreateMessageDto,
  CreateMessageDtoWithReceiver,
  InteractionMessageDto,
} from '@server/shared/dtos/message';
import { JoinRoomDto, LeaveRoomDto } from '@server/shared/dtos/conversation';
import { RoomConnectionStatus, UserConnectionStatus } from './chat.enum';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(
    @Inject('NATS_SERVICE')
    private natsClient: ClientProxy
  ) {}

  private userChatRooms: Map<string, string[]> = new Map();

  private roomsMaps: Map<string, string[]> = new Map();
  private conversationRooms: Map<string, string[]> = new Map();

  private usersOnline: Map<number, { userId: number; clientId: string }> =
    new Map();

  handleConnection(client: Socket) {
    Logger.log(`Socket --- Client connected: ${client.id}`);
    this.userChatRooms.set(client.id, []);
  }

  handleDisconnect(client: Socket) {
    Logger.log(`Socket --- Client disconnected: ${client.id}`);
    this.userChatRooms.delete(client.id);
    Array.from(this.usersOnline).forEach((u) => {
      if (u[1].clientId == client.id) {
        this.usersOnline.delete(u[1].userId);
        this.removeClientFromConversationRoom(
          client,
          SOCKET_CONVERSATION_PATTERN.CONVERSATION_ROOM
        );
        Logger.log(`Socket --- User Ofline: ${u[1].userId}`);
      }
    });

    Logger.log(`Socket --- number user online: ${this.usersOnline.size}`);
    Logger.log(`Socket --- number roomsMaps: ${this.roomsMaps.size}`);
  }

  @SubscribeMessage(SOCKET_CONVERSATION_PATTERN.ONLINE)
  handleUserOnline(client: Socket, userId: number) {
    Logger.log(`Socket --- User Online: ${userId}`);
    this.usersOnline.set(userId, { userId, clientId: client.id });
    this.addClientToConversationRoom(
      client,
      SOCKET_CONVERSATION_PATTERN.CONVERSATION_ROOM + '__' + userId
    );
  }

  @SubscribeMessage(SOCKET_CONVERSATION_PATTERN.JOIN_ROOM)
  handleJoinRoom(client: Socket, { roomId }: JoinRoomDto) {
    Logger.log(`Socket --- Client ${client.id} joining room: ${roomId}`);
    client.join(roomId);
    const rooms = this.userChatRooms.get(client.id) || [];
    this.userChatRooms.set(client.id, [...rooms, roomId]);
    client.to(roomId).emit(SOCKET_CONVERSATION_PATTERN.USER_JOINED, {
      roomId,
    });

    this.addClientToChatRoom(client, roomId);
  }

  @SubscribeMessage(SOCKET_CONVERSATION_PATTERN.LEAVE_ROOM)
  handleLeaveRoom(client: Socket, { roomId }: LeaveRoomDto) {
    client.leave(roomId);
    const rooms = this.userChatRooms.get(client.id) || [];
    this.userChatRooms.set(
      client.id,
      rooms.filter((r) => r !== roomId)
    );
    client.to(roomId).emit(SOCKET_CONVERSATION_PATTERN.USER_LEFT, {
      roomId,
    });
    this.removeClientFromChatRoom(client, roomId);
    Logger.log(`Socket --- Client ${client.id} leaving room: ${roomId}`);
  }

  @SubscribeMessage(SOCKET_CHAT_PATTERN.SEND_MESSAGE)
  handleSendMessage(client: Socket, input: CreateMessageDtoWithReceiver) {
    const isSendGroup = input.receiverIds?.length > 1;
    if (isSendGroup) {
      this.handleSendGroupMessage(input);
      return;
    }
    this.handleSendPersonalMessage(client, input);
  }

  @SubscribeMessage(SOCKET_CHAT_PATTERN.SEND_INTERACTION)
  handleInteractMessage(
    client: Socket,
    { roomId, interactionKey, senderId }: InteractionMessageDto
  ) {
    Logger.log(
      `Socket --- Interaction from ${client.id} to room ${roomId}: ${interactionKey}`
    );
    const resposne = {
      roomId,
      interactionKey,
      senderId: senderId,
      clientId: client.id,
    };
    this.natsClient
      .emit(MESSAGE_PATTERN_CHAT.INTERACTION, {})
      .pipe(
        catchError((error) => {
          this.server
            .to(roomId)
            .emit(SOCKET_CHAT_PATTERN.SEND_INTERACTION_FAIL, resposne);
          return EMPTY;
        }),
        tap((response) => {
          this.server
            .to(roomId)
            .emit(SOCKET_CHAT_PATTERN.NEW_INTERACTION, resposne);
        })
      )
      .subscribe();
  }

  private handleSendPersonalMessage(
    client: Socket,
    input: CreateMessageDtoWithReceiver
  ) {
    const receiverId = input.receiverIds[0]; // because chat one by one only has a receiver
    Logger.log(
      `Socket --- Message from ${client.id} to room ${input.roomId}: ${input.content} -- receiver: ${receiverId}`
    );
    switch (this.checkReceiverStatus(receiverId, input.roomId)) {
      case UserConnectionStatus.ONLINE:
        this.handleSendMessageOnline(input);
        break;
      case UserConnectionStatus.OFFLINE:
        this.handleSendMessageUserOffline(input);
        Logger.warn(`Socket --- Send Message To User Offline....: `);
        break;
      case RoomConnectionStatus.RECEIVER_OFF_ROOM:
        this.handleSendMessageUserOffRoom(input);
        Logger.warn(`Socket --- Send message but user has off room!!: `);
        break;
    }
  }

  //TODO: Need to send message for current receiver
  private handleSendMessageOnline(payload: CreateMessageDtoWithReceiver) {
    console.log('handleSendMessageOnline');
    this.natsClient
      .emit(MESSAGE_PATTERN_CHAT.SEND_MESSAGE, payload)
      .pipe(
        catchError((error) => {
          this.server
            .to(payload.roomId)
            .emit(SOCKET_CHAT_PATTERN.SEND_MESSAGE_FAIL, payload);
          return EMPTY;
        }),
        tap(() => {
          this.server.to(payload.roomId).emit(SOCKET_CHAT_PATTERN.NEW_MESSAGE, {
            ...payload,
            content: payload.content,
          });
        })
      )
      .subscribe();
  }

  //TODO: Need to create message for conversation
  private handleSendMessageUserOffline(payload: CreateMessageDtoWithReceiver) {
    console.log('handleSendMessageUserOffline');
  }

  //TODO: Need to send message up lastmessage of conversation
  private handleSendMessageUserOffRoom(payload: CreateMessageDtoWithReceiver) {
    this.natsClient
      .emit(MESSAGE_PATTERN_CHAT.SEND_MESSAGE, payload)
      .pipe(
        catchError((error) => {
          this.server
            .to(payload.roomId)
            .emit(SOCKET_CHAT_PATTERN.SEND_MESSAGE_FAIL, payload);
          return EMPTY;
        }),
        tap(() => {
          const roomId =
            SOCKET_CONVERSATION_PATTERN.CONVERSATION_ROOM +
            '__' +
            payload.receiverIds[0];
          this.server.emit(roomId, {
            content: payload.content,
            conversationId: payload.roomId,
            senderId: payload.senderId,
            receiverId: payload.receiverIds[0],
            unread: true,
            timeSend: new Date().toISOString(),
          });
        })
      )
      .subscribe();
  }

  private handleSendGroupMessage(payload: CreateMessageDtoWithReceiver) {
    console.log('handleSendGroupMessage: ', payload);
  }

  private isUserOnline(userId: number) {
    return !!this.usersOnline.get(userId);
  }

  private addClientToChatRoom(client: Socket, roomId: string) {
    if (!this.roomsMaps.has(roomId)) {
      this.roomsMaps.set(roomId, [client.id]);
    } else {
      const clientIds = [...this.roomsMaps.get(roomId), client.id];
      this.roomsMaps.set(roomId, clientIds);
    }
  }

  private removeClientFromChatRoom(client: Socket, roomId: string) {
    if (!this.roomsMaps.has(roomId)) {
      return;
    }
    console.log('Current Client: ', client.id);
    const clientIds = this.roomsMaps
      .get(roomId)
      .filter((clientId) => clientId !== client.id);
    console.log('clientIds: ', clientIds);
    this.roomsMaps.set(roomId, clientIds);
    console.log('removeClientFromChatRoom: ', this.roomsMaps.entries());
  }

  private addClientToConversationRoom(client: Socket, roomId: string) {
    if (!this.conversationRooms.has(roomId)) {
      this.conversationRooms.set(roomId, [client.id]);
    } else {
      const clientIds = [...this.conversationRooms.get(roomId), client.id];
      this.conversationRooms.set(roomId, clientIds);
    }
    Logger.log(`Socket --- ADD User Conversation ROOM: ${roomId}`);
  }

  private removeClientFromConversationRoom(client: Socket, roomId: string) {
    if (!this.conversationRooms.has(roomId)) {
      return;
    }
    Logger.log(`Socket --- Remove User Conversation ROOM: ${roomId}`);
    const clientIds = this.conversationRooms
      .get(roomId)
      .filter((clientId) => clientId !== client.id);
    this.conversationRooms.set(roomId, clientIds);
  }

  private checkReceiverStatus(
    userId: number,
    roomId: string
  ): UserConnectionStatus | RoomConnectionStatus {
    const isOnl = this.isUserOnline(userId);
    const lengthOfRoom = this.roomsMaps.get(roomId)?.length;
    const isRoomOnlyClient = lengthOfRoom == 1;
    console.log('lengthOfRoom: ', lengthOfRoom);
    console.log('isOnl: ', isOnl);
    console.log('isRoomOnlyClient: ', isRoomOnlyClient);
    if (!isOnl) return UserConnectionStatus.OFFLINE;
    if (isRoomOnlyClient) return RoomConnectionStatus.RECEIVER_OFF_ROOM;
    return isOnl && UserConnectionStatus.ONLINE;
  }
}
