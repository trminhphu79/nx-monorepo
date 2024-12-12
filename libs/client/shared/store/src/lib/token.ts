import { AppState } from './model';
import { createInjectionToken } from '@client/utils/di';

export const [injectAppState, provideAppState] =
  createInjectionToken<AppState>('APP_STATE');
