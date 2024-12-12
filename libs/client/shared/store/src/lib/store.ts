import {
  withHooks,
  withMethods,
  signalStore,
  withState,
  patchState,
  withComputed,
  getState,
} from '@ngrx/signals';
import { INITIAL_APP_STATE } from './state';
import { AppState, UserState } from './model';
import { injectAppState } from './token';
import { injectSocket } from '@client/utils/socket';
import { computed, inject } from '@angular/core';

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(() => injectAppState()),
  withComputed((store, socket = injectSocket()) => ({
    unreadCountNotis: computed(() => {
      return store.userNotifications().filter((ite) => !ite.read)?.length;
    }),
  })),
  withMethods((store, socket = injectSocket()) => ({
    setState(newState: AppState) {
      patchState(store, { ...newState });
    },
    setUser(data: Partial<UserState>) {
      patchState(store, {
        user: {
          ...store.user(),
          ...data,
        },
      });
      socket.connect(() => {
        socket.online(data.profile?.id as number);
      });
    },
    resetState() {
      patchState(store, INITIAL_APP_STATE);
    },
    signOut() {
      patchState(store, {
        user: {
          isAuthenticated: false,
        },
      });
    },
    pushNotification(notification: any) {
      const userNotifications = [
        notification,
        ...getState(store).userNotifications,
      ];
      patchState(store, {
        userNotifications,
      });
    },
  })),
  withHooks({
    onDestroy(store) {
      store.resetState();
    },
  })
);
