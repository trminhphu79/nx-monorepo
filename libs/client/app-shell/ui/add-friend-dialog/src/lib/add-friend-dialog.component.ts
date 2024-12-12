import { Profile } from '@client/profile/model';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'lib-add-friend-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    AvatarModule,
    AutoCompleteModule,
  ],
  templateUrl: './add-friend-dialog.component.html',
  styleUrl: './add-friend-dialog.component.scss',
})
export class AddFriendDialogComponent {
  visible = input<boolean>(false);
  profileData = input<Profile[]>([]);

  cancelChanges = output();
  saveChanges = output<Profile>();
  searchProfileChanges = output<string>();

  searchControl = new FormControl();

  protected onCancel() {
    this.cancelChanges.emit();
  }

  protected onSave() {
    this.cancelChanges.emit();
    this.saveChanges.emit(this.searchControl.value as Profile);
    this.searchControl.reset();
  }

  protected filterProfile(event: AutoCompleteCompleteEvent) {
    this.searchProfileChanges.emit(event.query);
  }
}
