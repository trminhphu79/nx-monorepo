export type BaseResposne<T> = {
  message: string;
  data: T;
};

export type SearchProfilePayload = {
  keyword: string;
  offset: number;
  limit: number;
};

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

export type AddFriendPayload = {
  profileId: number;
  friendId: number;
};

export type UserFriend = Profile & {
  friends: Profile[];
};
