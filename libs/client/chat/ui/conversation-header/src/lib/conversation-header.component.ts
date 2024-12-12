import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageCategory } from '@shared/models/conversation';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'cwm-conversation-header',
  standalone: true,
  imports: [ChipModule, CommonModule],
  templateUrl: './conversation-header.component.html',
  styleUrl: './conversation-header.component.scss',
})
export class ConversationHeaderComponent {
  groups = input<MessageCategory[]>();
  unreadConversation = input<number>(10);
  selectGroupChanges = output<{ item: MessageCategory; index: number }>();

  protected selectedIndex = signal(-1);

  protected onSelectMessageCategory(item: MessageCategory, index: number) {
    this.selectGroupChanges.emit({ item, index });
    this.selectedIndex.set(index);
  }
}
