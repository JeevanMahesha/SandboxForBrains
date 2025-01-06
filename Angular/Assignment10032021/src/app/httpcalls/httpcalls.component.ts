import { Component, OnInit } from '@angular/core';
import { APIcallsService } from '../apicalls.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-httpcalls',
  templateUrl: './httpcalls.component.html',
  styleUrls: ['./httpcalls.component.css']
})
export class HttpcallsComponent implements OnInit {


  displayedColumns: string[] = ['id', 'title', 'completed'];
  dataSource : any
  constructor(private apicall:APIcallsService,private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.getData()
  }

  getData(){
    if (this.route.snapshot.params['id']){
     this.apicall.getAPIcall(this.route.snapshot.params['id']).subscribe(val=> {
       this.dataSource = [val]
     } )
    }else{
      this.dataSource = this.apicall.getAPIcall()

    }

  }

}
