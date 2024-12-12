export class SearchFriendDto {
  keyword: string;
  offset: number;
  limit: number;
  sortField?: string;
  sortOrder?: string;
  profileId?:number
}
