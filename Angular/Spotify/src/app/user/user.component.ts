import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import {UserDetails} from '../model/user-details.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }
  avater: string = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
  userID: string='952dkv7ldwh4o0cjhdxdwoywe' ;
  userDetails:UserDetails  ;

  getUserInfo() {
    console.log("print");

    this.apiService.getUserInfo(this.userID).subscribe(
      (res) => {
        this.userDetails = new UserDetails();
        this.userDetails.userName = res.display_name;
        this.userDetails.userProfileLink = res.external_urls.spotify;
        this.userDetails.userFolloers = res.followers.total;
        if(!res.images[0]){
        this.userDetails.userProfileAvatar = this.avater;
        }else{
          this.userDetails.userProfileAvatar = res.images[0];
        }
      });
    }

}
