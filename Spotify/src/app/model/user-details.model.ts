export class UserDetails {
  userName:string;
    userProfileLink:string;
    userFolloers:number;
    userProfileAvatar:string;
}

export class newPlayListDetails {
    playListName:string;
    playListDescription:string;
    playListVisible:boolean = false;
}

export class PlayListDetails {
 playListName:string;
 playListDescription:string;
 playListOwner:string;
 playListVisible:boolean;
 playListID:string;
 playListImage:string;
}
