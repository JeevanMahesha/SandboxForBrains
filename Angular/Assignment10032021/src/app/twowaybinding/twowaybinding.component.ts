import { Component, OnInit } from '@angular/core';
import { APIcallsService } from '../apicalls.service';
@Component({
  selector: 'app-twowaybinding',
  templateUrl: './twowaybinding.component.html',
  styleUrls: ['./twowaybinding.component.css']
})
export class TwowaybindingComponent implements OnInit {


  userData: string
  userName: string
  constructor(private getUserName: APIcallsService) { }

  ngOnInit(): void {
  }

  getNameFun() {
    this.userName = this.getUserName.getName()
  }

}
