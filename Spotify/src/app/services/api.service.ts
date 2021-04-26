import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  myToken: string = 'Bearer BQCHaHXe8zV6kbq0LAyyBs9JHgwlBgTJhL5ftDfcioj65QmthCHYDxpW9sTShbINqBKa0xrd5vZJG7C6liyllegiv3V7g7Tv4uews153fBzRF1KalLFJIQsGZ4zfqsJS0ihte5Q08ZgVBsIUAV-sn9oLPxgGfl9Ch5A7RioSsskuF98ob72ariPoq9_oChjkpHUsRfM3anbIuF1rHtJdOhmsfe82E9nFLeHN7AnRJ9bat7-WRrdmrJlCHDgjq18hz3ogR6ZmfSFwvcOorDVNpSIZVDBfc6465xWC2065';
  headers = new HttpHeaders().set('Authorization', `${this.myToken}`)

  getUserInfo(userID: string): any {
    return this.http.get(`https://api.spotify.com/v1/users/${userID}`,  {headers: this.headers} );
  }
  search(query: string, type: string): any {
    return this.http.get(`https://api.spotify.com/v1/search?q=${query}&type=${type}`, {headers: this.headers});
  }
  getPlaylist(userID: string): any {
    return this.http.get(`https://api.spotify.com/v1/users/${userID}/playlists`, {headers: this.headers});
  }
  createPlaylist(userID: string, data: any): any {
    return this.http.post(`https://api.spotify.com/v1/users/${userID}/playlists`, data, {headers: this.headers});
  }
  updatePlaylist(playListID: string, data: any): any {
    return this.http.put(`https://api.spotify.com/v1/playlists/${playListID}`, data, {headers: this.headers});
  }
  getTracks(id: string): any {
    const params = new HttpParams().set('market', 'IN').set('limit', '10');
    return this.http.get(`https://api.spotify.com/v1/playlists/${id}/tracks`, { headers: this.headers, params });
  }

}
