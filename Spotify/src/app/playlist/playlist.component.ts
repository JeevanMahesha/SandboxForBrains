import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import {PlayListDetails} from '../model/user-details.model';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  userId: string = '952dkv7ldwh4o0cjhdxdwoywe';
  playListDetails: Array<PlayListDetails>=[];

  getPlaylist() {
    this.apiService.getPlaylist(this.userId).subscribe(arg => {

        arg.items.forEach(element => {
          let data = new PlayListDetails();
          data.playListName = element.name;
          data.playListID = element.id;
          data.playListOwner = element.owner.display_name;
          data.playListVisible = element.public;
          data.playListImage = element.images[0]?.url || 'https://images.squarespace-cdn.com/content/v1/54e14a80e4b08791c730e0a5/1425284335858-73GFIISXECU7G0M8ZPDW/ke17ZwdGBToddI8pDm48kGaHekGwP4GST6SBXsb8d557gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmgbBA9KfxWpJIziZzus6eiOT1LV0V-SQnV-p7YOIgR9VEEQXiDltBiAJYjktX3dt9/PlaylistLogo1.jpg?format=1000w';
          this.playListDetails.push(data);
        });
    });
  }
}
