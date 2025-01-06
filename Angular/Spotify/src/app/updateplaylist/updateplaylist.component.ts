import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { newPlayListDetails } from '../model/user-details.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-updateplaylist',
  templateUrl: './updateplaylist.component.html',
  styleUrls: ['./updateplaylist.component.css']
})
export class UpdateplaylistComponent implements OnInit {

  playListID: string ;
  updatePlayList:newPlayListDetails = new newPlayListDetails();
  constructor(private apiService: ApiService,private message:MatSnackBar) { }

  ngOnInit(): void {
  }


  updatePlaylist() {
    this.apiService.updatePlaylist(this.playListID, {
      'name' : this.updatePlayList.playListName,
      'description' : this.updatePlayList.playListDescription,
      'public' : this.updatePlayList.playListVisible
    }).subscribe(() => {
      this.message.open('Playlist Updated...!','',{
        duration:2000
      })
    }, () => {
      this.message.open('Something went wrong...!','',{
        duration:2000
      })
    });
  }
}
