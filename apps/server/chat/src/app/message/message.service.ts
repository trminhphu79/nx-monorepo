import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from '@server/shared/dtos/message';
import { Message } from '@server/shared/entity/message';
import { Conversation } from '@server/shared/entity/conversation';
import { Profile } from '@server/shared/entity/profile';
import { InjectModel } from '@nestjs/sequelize';
import { from, Observable, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Conversation)
    private conversationModel: typeof Conversation,
    @InjectModel(Message)
    private messageModel: typeof Message,
    @InjectModel(Profile)
    private profileModel: typeof Profile
  ) {}

  send(payload: CreateMessageDto): Observable<any> {
    const { roomId, senderId, content } = payload;

    return from(this.profileModel.findByPk(senderId)).pipe(
      switchMap((sender) => {
        if (!sender) {
          return throwError(
            () => new NotFoundException(`Sender with ID ${senderId} not found`)
          );
        }

        // If roomId is provided, validate it exists
        return from(this.conversationModel.findByPk(roomId)).pipe(
          switchMap((conversation) => {
            if (!conversation) {
              return throwError(
                () =>
                  new NotFoundException(
                    `Conversation with ID ${roomId} not found`
                  )
              );
            }

            // Create the new message
            return from(
              this.messageModel.create({
                conversationId: roomId,
                senderId,
                content,
              })
            ).pipe(
              map((newMessage) => ({
                data: newMessage,
                message: 'Send message successfully!',
              }))
            );
          })
        );
      }),
      catchError((error) => throwError(() => error))
    );
  }

  async getConversationsByProfileId(
    profileId: number
  ): Promise<Conversation[]> {
    return await this.conversationModel.findAll({
      include: [
        {
          association: 'members', // Association defined in the Conversation model
          where: { id: profileId },
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    });
  }
}
