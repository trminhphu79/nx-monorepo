import { ConversationStore } from '@client/chat/data-access/conversation';
import { AppStore } from './../../../../../shared/store/src/lib/store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Conversation,
  Member,
  MessageCategory,
} from '@shared/models/conversation';
import { ChipModule } from 'primeng/chip';
import { CardModule } from 'primeng/card';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { AvatarModule } from 'primeng/avatar';
import { ConversationListComponent } from '@client/chat/ui/conversation-list';
import { ChatStore } from 'libs/client/chat/data-access/src/lib/store/chat';
import { ProfileWithFriends } from '@client/store/model';
import { ConversationHeaderComponent } from '@client/chat/ui/conversation-header';
import { InputSearchComponent } from '@client/ui/input-search';

@Component({
  selector: 'cwm-conversation',
  standalone: true,
  imports: [
    ChipModule,
    CardModule,
    CommonModule,
    AvatarModule,
    InputIconModule,
    IconFieldModule,
    ReactiveFormsModule,
    InputSearchComponent,
    ConversationListComponent,
    ConversationHeaderComponent,
  ],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss',
})
export class ConversationComponent {
  protected searching = signal(false);
  protected searchControl = new FormControl<string>('');

  protected selectedConversation = signal<{
    value: Conversation | null;
    index: number;
  } | null>({ value: null, index: -1 });

  protected selectedMessageCategory = signal<{
    value: MessageCategory | null;
    index: number;
  } | null>({ value: null, index: -1 });

  private appState = inject(AppStore);
  private chatStore = inject(ChatStore);
  private conversationStore = inject(ConversationStore);

  protected messages = this.chatStore.messages;
  protected conversations = this.conversationStore.conversations;

  protected isSearching = signal(false);
  protected conversation = this.conversationStore.selectedConversation;
  protected messageCategories = signal<MessageCategory[]>([
    {
      label: 'All',
      selected: true,
    },
    {
      label: 'Unread',
      selected: false,
    },
    {
      label: 'Groups',
      selected: false,
    },
  ]);

  protected onSearchChanges(keyword: string | null) {
    console.log('onSearchChanges: ', keyword);
  }

  protected onSelectConversation(input: { item: Conversation; index: number }) {
    this.conversationStore.setReadMessage(input.item.id);
    const { id } = this.appState.user()?.profile as ProfileWithFriends;
    if (this.chatStore.conversationId()) {
      this.conversationStore.resotreMessageToConversation(
        this.chatStore.conversationId(),
        this.chatStore.messages()
      );
      this.conversationStore.leaveRoom(
        this.chatStore.conversationId(),
        id as number
      );
      this.chatStore.reset();
    }

    this.conversationStore.setSelectedConversation(input.item);
    this.conversationStore.joinRoom(input.item.id, id);
    this.chatStore.setConversation(
      input.item.id,
      this.conversationStore.getConversationMessages(input.item.id),
      input.item?.receiver as Member
    );
  }

  protected onSelectMessageCategory(input: {
    item: MessageCategory;
    index: number;
  }) {
  }

  protected onTurnOffHighlight(conversationId: number) {
    this.conversationStore.setTurnOffHighlight(conversationId)
  }
}
