import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import {
  SOCKET_CHAT_PATTERN,
  SOCKET_CONVERSATION_PATTERN,
} from '@shared/socket-pattern';
import {
  ConnectSuccessCallBack,
  ISocketAdapter,
  DisconnectCallBack,
} from './socket.model';
import { AppConfig, injectAppConfig } from '@client/utils/app-config';

@Injectable()
export class SocketAdapterService implements ISocketAdapter {
  private socket!: Socket;
  private appConfig: AppConfig = injectAppConfig();

  private clientId!: string;

  /**
   * Connect to the socket server
   */
  connect(
    success: ConnectSuccessCallBack = function () {
      return;
    },
    disconnect: DisconnectCallBack = function () {
      return;
    }
  ): void {
    if (!this.socket || !this.socket.connected) {
      this.socket = io(this.appConfig.socketUrl, { transports: ['websocket'] });
      this.socket.on('connect', () => {
        this.clientId = this.socket.id as string;
        console.log('Connect socket success: ', this.clientId);
        success();
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected: ', this.clientId);
        this.clientId = '';
        disconnect();
      });
    }
  }

  /**
   * Disconnect from the socket server
   */
  disconnect(): void {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }
  }

  /**
   * Trigger status user online
   * @param userId profile id of user
   */
  online(userId: number): void {
    this.socket.emit(SOCKET_CONVERSATION_PATTERN.ONLINE, userId);
  }

  /**
   * Join a room
   * @param roomId Room ID to join
   */
  joinRoom(roomId: number, userId: number): void {
    this.socket.emit(SOCKET_CONVERSATION_PATTERN.JOIN_ROOM, { roomId, userId });
  }

  /**
   * Leave a room
   * @param roomId Room ID to leave
   */
  leaveRoom(roomId: number, userId: number): void {
    this.socket.emit(SOCKET_CONVERSATION_PATTERN.LEAVE_ROOM, {
      roomId,
      userId,
    });
  }

  /**
   * Send a message to a room
   * @param roomId Room ID
   * @param message Message content
   * @param senderId Sender ID
   */
  sendMessage(
    roomId: number,
    content: string,
    senderId: number,
    receiverIds: number[]
  ): void {
    this.socket.emit(SOCKET_CHAT_PATTERN.SEND_MESSAGE, {
      roomId,
      content,
      senderId,
      receiverIds,
    });
  }

  /**
   * Send interaction to a room
   * @param roomId Room ID
   * @param interactionKey Interaction type
   * @param senderId Sender ID
   */
  sendInteraction(
    roomId: string,
    interactionKey: string,
    senderId: string
  ): void {
    this.socket.emit(SOCKET_CHAT_PATTERN.SEND_INTERACTION, {
      roomId,
      interactionKey,
      senderId,
    });
  }

  /**
   * Listen for an event
   * @param eventName Name of the event
   * @returns Observable for the event
   */
  listen<T>(eventName: string): Observable<T> {
    const subject = new Subject<T>();
    this.socket.on(eventName, (data: T) => {
      subject.next(data);
    });
    return subject.asObservable();
  }

  /**
   * Remove listener for a specific event
   * @param eventName Name of the event
   */
  removeListener(eventName: string): void {
    this.socket.off(eventName);
  }
}
