import { Component } from '@angular/core';
import ProfilesList from '../componentsV2/profiles-list/profiles-list';

@Component({
  selector: 'app-v2',
  imports: [ProfilesList],
  templateUrl: './v2.html',
  styleUrl: './v2.css',
})
export default class V2 {}
