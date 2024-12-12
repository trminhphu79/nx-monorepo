import { Conversation, MessageCategory } from '@shared/models/conversation';
import { Component, input, Input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { TimeAgoPipe } from '@client/pipes/time-ago';
import { HighLightDirective } from '@client/directives/highlight';

@Component({
  selector: 'cwm-conversation-list',
  standalone: true,
  imports: [
    TimeAgoPipe,
    CommonModule,
    AvatarModule,
    HighLightDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.scss',
})
export class ConversationListComponent {
  dataSource = input<Conversation[]>();

  searchConversationChanges = output<string | null>();
  selectConversationChanges = output<{ item: Conversation; index: number }>();
  selecteMessageCategoryChanges = output<MessageCategory>();
  turnOffHighlight = output<number>();

  protected searching = signal(false);
  protected searchControl = new FormControl<string>('');

  protected selectedConversation = signal<{
    value: Conversation | null;
    index: number;
  } | null>({ value: null, index: -1 });

  protected onSelectConversation(item: Conversation, index: number) {
    if (index == this.selectedConversation()?.index) return;
    this.selectedConversation.set({ value: item, index });
    this.selectConversationChanges.emit({ item, index });
  }
}
