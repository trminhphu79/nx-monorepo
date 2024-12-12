import { AppConfig } from './app-config.model';
import { createInjectionToken } from '@client/utils/di';

export const [injectAppConfig, provideAppConfig, APP_CONFIG_TOKEN] =
  createInjectionToken<AppConfig>('APP_CONFIG');
