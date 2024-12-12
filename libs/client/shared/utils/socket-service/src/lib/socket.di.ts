import { ISocketAdapter } from './socket.model';
import { createInjectionToken } from '@client/utils/di';
import { SocketAdapterService } from './socket.service';
import { APP_CONFIG_TOKEN } from '@client/utils/app-config';

export const [injectSocket, provideSocket, token] =
  createInjectionToken<ISocketAdapter>('SocketAdapterService');

export const provideSocketAdapter = () => {
  return provideSocket([APP_CONFIG_TOKEN as any], {
    factory: () => {
      return new SocketAdapterService();
    },
  });
};
