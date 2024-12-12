import { injectSocket } from '@client/utils/socket';
import { AppStore } from '@client/store/store';
import {
  withHooks,
  withMethods,
  signalStore,
  withState,
  getState,
  patchState,
} from '@ngrx/signals';
import { INITIAL_CHAT_STATE } from './chat.state';
import { inject } from '@angular/core';
import { Message } from '@shared/models/message';
import { Member } from '@shared/models/conversation';
import { SOCKET_CHAT_PATTERN } from '@shared/socket-pattern';
import { tap } from 'rxjs';

export const ChatStore = signalStore(
  { providedIn: 'root' },
  withState(INITIAL_CHAT_STATE),
  withMethods(
    (store, appState = inject(AppStore), socket = injectSocket()) => ({
      reset() {
        patchState(store, INITIAL_CHAT_STATE);
      },

      setConversation(id: number, messages: Message[], member: Member) {
        patchState(store, {
          conversationId: id,
          messages: messages || [],
          conversation: {
            id,
            receiver: member,
          },
        });
      },

      sendMessage(message: string) {
        const { conversationId, conversation } = getState(store);
        console.log('Send to: ', conversation.receiver);
        socket.sendMessage(
          conversationId,
          message,
          appState.user().profile?.id as number,
          [conversation.receiver?.id as number]
        );
      },

      subscribeMessage() {
        socket
          .listen(SOCKET_CHAT_PATTERN.NEW_MESSAGE)
          .pipe(
            tap((message: any) => {
              if (getState(store).messages?.length) {
                patchState(store, {
                  messages: [
                    ...getState(store).messages,
                    mapingMessage(
                      message,
                      appState.user()?.profile?.id as number
                    ),
                  ],
                });
              } else {
                patchState(store, {
                  messages: [
                    mapingMessage(
                      message,
                      appState.user()?.profile?.id as number
                    ),
                  ],
                });
              }
            })
          )
          .subscribe();
      },
    })
  ),
  withHooks({
    onDestroy(store) {
      store.reset();
    },
    onInit(store) {
      store.subscribeMessage();
    },
  })
);

function mapingMessage(newMessage: any, currentId: number): any {
  return {
    ...newMessage,
    isSender: newMessage.senderId == currentId,
    isReceiver: newMessage.senderId == currentId,
    timeSend: new Date().toISOString(),
  };
}
