import {
  inject,
  InjectionToken,
  InjectOptions,
  Provider,
  Type,
} from '@angular/core';

export interface InjectFn<T> {
  (): T;
  (options: InjectOptions & { optional?: false }): T;
  (options: InjectOptions & { optional?: true }): T | null;
}

export interface ProvideFn<T> {
  (value: T): Provider;
  (
    value: Array<Type<any>>,
    options: {
      factory?: (...args: any[]) => T;
      useClass?: Type<T>;
      useExisting?: InjectionToken<T>;
    }
  ): Provider;
}

export type InjectionTokenCreatorReturn<T> = [
  InjectFn<T>,
  ProvideFn<T>,
  InjectionToken<T>
];

function provideFn<T>(token: InjectionToken<T>) {
  return (
    valueOrDeps: T | Array<Type<any>>,
    options?: {
      factory?: (...args: any[]) => T;
      useClass?: Type<T>;
      useExisting?: InjectionToken<T>;
    }
  ): Provider => {
    if (options?.factory) {
      return {
        provide: token,
        useFactory: options.factory,
        deps: valueOrDeps as Array<Type<any>>,
      };
    }
    if (options?.useClass) {
      return {
        provide: token,
        useClass: options.useClass,
      };
    }
    if (options?.useExisting) {
      return {
        provide: token,
        useExisting: options.useExisting,
      };
    }
    return {
      provide: token,
      useValue: valueOrDeps as T,
    };
  };
}

export function createInjectionToken<T>(
  description: string,
  options?: {
    providedIn?: Type<any> | 'root' | 'platform' | 'any' | null | undefined;
    factory: () => T;
  }
): InjectionTokenCreatorReturn<T> {
  const token = new InjectionToken<T>(description, options);

  function injectFn(options: InjectOptions = {}) {
    return inject(token, options);
  }
  return [injectFn as InjectFn<T>, provideFn<T>(token), token];
}
