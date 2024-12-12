import { ChatStore } from 'libs/client/chat/data-access/src/lib/store/chat';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Message } from '@shared/models/message';
import { Conversation } from '@shared/models/conversation';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  startWith,
  take,
  tap,
  timer,
} from 'rxjs';
import { TimeAgoPipe } from '@client/pipes/time-ago';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'cwm-message-screen',
  standalone: true,
  imports: [
    DatePipe,
    CardModule,
    TimeAgoPipe,
    CommonModule,
    AvatarModule,
    TooltipModule,
    InputIconModule,
    IconFieldModule,
    ContextMenuModule,
    ReactiveFormsModule,
  ],
  templateUrl: './message-screen.component.html',
  styleUrl: './message-screen.component.scss',
})
export class MessageScreenComponent implements AfterViewInit, OnDestroy {
  @ViewChild('wrapperMessageContent', { static: true })
  protected wrapperMessageContent!: ElementRef<HTMLElement>;

  @ViewChild('messageListRef', { static: true })
  protected messageListRef!: ElementRef<HTMLElement>;

  @ViewChild('chatControlRef', { static: true })
  protected chatControlRef!: ElementRef<HTMLInputElement>;

  @ViewChild('scrollTrigger', { static: true })
  protected scrollTrigger!: ElementRef<HTMLElement>;

  private chatStore = inject(ChatStore);

  protected messages = this.chatStore.messages;
  protected sender = this.chatStore.conversation;
  protected conversationChanges$ = toObservable(this.chatStore.conversationId);

  private originalMessageContentHeight = signal<number>(0);
  private originalMessageActionHeight = signal<number>(60);
  protected showScrollBtn = signal(false);
  private observer!: IntersectionObserver;

  initIntersectionObserver() {
    timer(2000).subscribe(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          console.log('messageListRef: ...', entries);
          const entry = entries[0];
          this.showScrollBtn.set(entry.isIntersecting);
        },
        { root: this.messageListRef.nativeElement, threshold: 0.5 }
      );

      this.observer.observe(this.scrollTrigger.nativeElement);
    });
  }

  protected contextMenuItems: MenuItem[] = [
    {
      label: 'Copy',
      icon: 'pi pi-copy',
      command(event) {
        console.log('copy run...', event);
      },
    },
    {
      label: 'Edit message',
      icon: 'pi pi-file-edit',
      command(event) {
        console.log('edit run...', event);
      },
    },
  ];

  @ViewChild('cm') cm!: ContextMenu;

  protected chatControl = new FormControl('');

  private cd = inject(ChangeDetectorRef);

  protected computedMessageContentHeight = computed(() => {
    const result =
      this.originalMessageContentHeight() - this.originalMessageActionHeight();
    return `${result}px`;
  });

  private screenSize$ = fromEvent(window, 'resize').pipe(
    map(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
    })),
    debounceTime(50),
    startWith({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  );

  ngAfterViewInit() {
    this.registerValueChanges();
    this.originalMessageContentHeight.set(
      this.wrapperMessageContent.nativeElement.offsetHeight
    );
    this.scrollToBottom();
    this.initIntersectionObserver();
  }

  private registerValueChanges() {
    this.conversationChanges$
      .pipe(
        delay(100),
        tap(() => this.scrollToBottom())
      )
      .subscribe();

    fromEvent(this.chatControlRef.nativeElement, 'keyup')
      .pipe(
        debounceTime(10),
        filter((e: any) => e.keyCode === 13),
        distinctUntilChanged(),
        tap((res) => {
          this.onSendMessage(res?.target?.value);
          this.chatControlRef.nativeElement.value = '';
        })
      )
      .subscribe();

    this.screenSize$
      .pipe(
        tap(() => {
          this.originalMessageContentHeight.set(
            this.wrapperMessageContent.nativeElement.offsetHeight
          );
          this.cd.detectChanges();
          this.scrollToBottom();
        })
      )
      .subscribe();
  }

  protected scrollToBottom(): void {
    if (this.messageListRef) {
      timer(100)
        .pipe(take(1))
        .subscribe(() => {
          this.messageListRef.nativeElement.scrollTo({
            top: this.messageListRef.nativeElement.scrollHeight,
            behavior: 'smooth',
          });
        });
    }
  }

  onContextMenu(event: any, item: Message) {
    this.cm.show(event);
  }

  protected onSendMessage(message: string) {
    this.chatStore.sendMessage(message);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
