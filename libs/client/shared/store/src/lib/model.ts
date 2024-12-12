import { NotificationEnum } from './enum';

export type Profile = {
  id: number;
  accountId: number;
  fullName: string;
  avatarUrl: string;
  bio: string;
  dob: string;
  createdAt: string;
  updatedAt: string;
};

export interface ProfileWithFriends extends Profile {
  friends: Profile[];
}

export type UserState = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  token: string;
  isAuthenticated: boolean;
  avatarUrl?: string;
  preferences?: UserPreferences;
  profile?: ProfileWithFriends;
};

export type UserPreferences = {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
};

export type SideBarItem = {
  label: string;
  tooltip: string;
  route: string;
  icon: string;
  badgeValue?: number;
  redirect?: boolean;
  externalLink?: boolean;
};
export type System = {
  sideBar: Partial<SideBarItem>[];
};

export type UserNotification = {
  type: NotificationEnum;
  timeSend: string;
  content: string;
  read: boolean;
};

export type AppState = {
  user: Partial<UserState>;
  userNotifications: Array<UserNotification>;
  system: System;
};
