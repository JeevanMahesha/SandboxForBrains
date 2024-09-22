import { inject, Injectable } from '@angular/core';
import { addDoc, collectionData } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { INewProduct } from '../add-product/add-product.model';
import { DB_NAMES } from '../common/db.name.list';
import { DBService } from '../db/db.service';

@Injectable()
export class ProductService {
  #dbService = inject(DBService);
  addNewProduct(newProduct: Partial<INewProduct>) {
    return from(
      addDoc(this.#dbService.getCollection(DB_NAMES.PRODUCTS), newProduct)
    );
  }

  getProducts(): Observable<INewProduct[]> {
    return from(
      collectionData(this.#dbService.getCollection(DB_NAMES.PRODUCTS))
    );
  }
}
