import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [MatInputModule, MatSelectModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export default class AddProductComponent {
  productTypes = ['vegetable', 'fruit'];
}
