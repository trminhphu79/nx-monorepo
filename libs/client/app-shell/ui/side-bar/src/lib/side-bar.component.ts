import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastService } from '@client/utils/toast';
import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockModule } from 'primeng/dock';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { AppStore } from '@client/store/store';
import { Router } from '@angular/router';
import { AddFriendDialogComponent } from '@client/app-shell/add-friend-dialog';
import { SideBarItem } from '@client/store/model';
import { ProfileService } from '@client/profile/service';
import { catchError, interval, tap, timer } from 'rxjs';
import { Profile } from '@client/profile/model';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ScrollerModule } from 'primeng/scroller';
import { TimeAgoPipe } from '@client/pipes/time-ago';
import { NotificationEnum } from '@client/store/enum';
import { ConversationStore } from '@client/chat/data-access/conversation';
import { ChatStore } from '@client/chat/data-access';

@Component({
  selector: 'lib-side-bar',
  standalone: true,
  imports: [
    TimeAgoPipe,
    CommonModule,
    DockModule,
    MenuModule,
    AvatarModule,
    TooltipModule,
    BadgeModule,
    ToastModule,
    ScrollerModule,
    OverlayPanelModule,
    AddFriendDialogComponent,
  ],
  providers: [MessageService, ToastService],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  private router = inject(Router);
  private appState = inject(AppStore);
  private chatStore = inject(ChatStore);
  private toastService = inject(ToastService);
  private profileService = inject(ProfileService);
  private conversationStore = inject(ConversationStore);

  protected sideBarItems = this.appState.system.sideBar;
  protected currentUser = this.appState.user;
  protected profile = this.appState.user.profile;

  @ViewChild('op') private overlayNotification!: OverlayPanel;
  protected overlayStyle = {
    width: '400px',
    'min-height': '500px',
    height: '70vh',
    'overflow-y': 'auto',
  };

  protected avatarUrl = computed(() => {
    return this.appState.user().profile?.avatarUrl;
  });

  protected notifications = this.appState.userNotifications;
  protected unreadCountNotis = this.appState.unreadCountNotis;

  protected toggleAddFriendDialog = signal(false);
  protected profileData = signal<Profile[]>([]);
  protected selectedSideBar = signal<{
    value: Partial<SideBarItem> | null;
    index: number;
  }>({
    value: null,
    index: 0,
  });

  signOut() {
    this.conversationStore.leaveAllRoom();
    this.conversationStore.resotreMessageToConversation(
      this.chatStore.conversationId(),
      this.chatStore.messages()
    );
    this.appState.signOut();
    this.router.navigate(['/user']);
  }

  onSelect(
    $event: any = null,
    value: Partial<SideBarItem> | null,
    index: number
  ) {
    if (value?.label == 'Notification') {
      this.overlayNotification.toggle($event);
      return;
    }
    if (value?.label == 'Add friends') {
      this.toggleAddFriendDialog.set(true);
      return;
    }

    if (value?.externalLink) {
      window.open(value.route, '_blank');
      return;
    }

    this.selectedSideBar.set({
      value,
      index,
    });

    if (value?.redirect) {
      this.router.navigate([value?.route]);
    }
  }

  onCancelDialog() {
    this.toggleAddFriendDialog.set(false);
  }

  onSaveFriend(data: Profile) {
    this.profileService
      .addFriend({
        profileId: this.currentUser().profile?.id as number,
        friendId: data.id,
      })
      .pipe(
        catchError((e) => {
          this.toastService.showMessage('error', 'Add friend failed!');
          return e;
        }),
        tap((response) => {
          this.toggleAddFriendDialog.set(false);
          this.toastService.showMessage(
            'success',
            `Add ${data?.fullName || ''} success!`
          );
        })
      )
      .subscribe();
  }

  onSearchProfile(keyword: string) {
    this.profileService
      .search({
        keyword,
        offset: 0,
        limit: 100,
      })
      .pipe(
        tap((response) => {
          this.profileData.set(response.data);
          console.log('onSearchProfile: ', response);
        })
      )
      .subscribe();
  }
}
