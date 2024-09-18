import { Component, inject } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { DB_NAMES } from '../common/db.name.list';

@Component({
  selector: 'app-user-detail-list-view',
  standalone: true,
  imports: [],
  templateUrl: './user-detail-list-view.component.html',
  styleUrl: './user-detail-list-view.component.scss',
})
export default class UserDetailListViewComponent {
  #fireBaseDataBase = inject(AngularFireDatabase);

  constructor() {
    this.#fireBaseDataBase
      .object(DB_NAMES.USERS)
      .valueChanges()
      .subscribe((users) => {
        console.log(users);
      });
  }
}
