import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { newPlayListDetails,PlayListDetails } from '../model/user-details.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-createplaylist',
  templateUrl: './createplaylist.component.html',
  styleUrls: ['./createplaylist.component.css']
})
export class CreateplaylistComponent implements OnInit {

  constructor(private apiService: ApiService,private message:MatSnackBar) { }

  ngOnInit(): void {
  }
  userId: string = '952dkv7ldwh4o0cjhdxdwoywe';
  newPlayList:newPlayListDetails = new newPlayListDetails();
  createdPlayList: PlayListDetails;

  createPlaylist() {
    this.apiService.createPlaylist(this.userId, {
      'name' : this.newPlayList.playListName,
      'description' : this.newPlayList.playListDescription,
      'public' : this.newPlayList.playListVisible
    }).subscribe(arg => {
      if(arg){
        this.message.open("New Playlist Created","",{
          duration: 3000
        });
      }
      this.createdPlayList = arg;
    });
  }
}
