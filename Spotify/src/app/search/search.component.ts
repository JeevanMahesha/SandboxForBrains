import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  query: string;
  type: string;
  tracksList: any;
  artistList: any;

  search() {
    this.tracksList = null;
    this.artistList = null;
    if (this.type == "track") {
      this.apiService.search(this.query, this.type).subscribe((res) => {
        this.tracksList = res.tracks.items;
      });
    }
    if(this.type == "artist") {
      this.apiService.search(this.query, this.type).subscribe((res) => {
        this.artistList = res.artists.items;
      });
    }
  }
}
