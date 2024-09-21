import { inject, Injectable } from '@angular/core';
import { INewProduct } from '../add-product/add-product.model';
import { DBService } from '../db/db.service';
import { addDoc } from '@angular/fire/firestore';
import { DB_NAMES } from '../common/db.name.list';
import { from } from 'rxjs';

@Injectable()
export class ProductService {
  #dbService = inject(DBService);
  addNewProduct(newProduct: Partial<INewProduct>) {
    return from(
      addDoc(this.#dbService.getCollection(DB_NAMES.PRODUCTS), newProduct)
    );
  }
}
