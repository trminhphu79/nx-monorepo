import { ConversationStore } from '@client/chat/data-access/conversation';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppStore } from '@client/store/store';
import { ChipModule } from 'primeng/chip';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ConversationComponent } from '@client/chat/conversation';
import { MessageScreenComponent } from '@client/chat/message-screen';
import { Conversation, MessageCategory } from '@shared/models/conversation';
import { ChatStore } from 'libs/client/chat/data-access/src/lib/store/chat';
import { ProfileWithFriends } from '@client/store/model';

@Component({
  selector: 'lib-chatting-screen',
  standalone: true,
  imports: [
    ChipModule,
    CardModule,
    CommonModule,
    RouterModule,
    AvatarModule,
    MessageScreenComponent,
    ReactiveFormsModule,
    ConversationComponent,
  ],
  providers: [ChatStore],
  templateUrl: './chatting-screen.component.html',
  styleUrl: './chatting-screen.component.scss',
})
export class ChattingScreenComponent {}
