import { Injectable } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { inject } from '@angular/core';

@Injectable()
export class ToastService {
  private messageService = inject(MessageService);

  showMessage(type: 'success' | 'error', msg: string, options?: Message) {
    let summary = 'Success Message';
    switch (type) {
      case 'success':
        break;
      case 'error':
        summary = 'Error Message';
        break;
    }

    this.messageService.add({
      ...{
        severity: type,
        summary,
        detail: msg,
        key: 'my-toast',
        life: 2000,
      },
      ...options,
    });
  }
}
