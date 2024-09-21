import { inject, Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  DocumentData,
  Firestore,
} from '@angular/fire/firestore';
import { DB_NAMES } from '../common/db.name.list';

@Injectable()
export class DBService {
  #fireBaseDatabase = inject(Firestore);

  getCollection(
    collectionName: DB_NAMES
  ): CollectionReference<DocumentData, DocumentData> {
    return collection(this.#fireBaseDatabase, collectionName);
  }
}
