import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { Profile } from '../profile/profile';

interface Product {
  code: string;
  name: string;
  category: string;
  quantity: number;
}

@Component({
  selector: 'app-profiles-list',
  imports: [
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    SplitButtonModule,
    ToolbarModule,
    InputTextModule,
    ToggleButtonModule,
    FormsModule,
    SelectModule,
    TableModule,
    Profile,
    PopoverModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  templateUrl: './profiles-list.html',
  styleUrl: './profiles-list.css',
})
export default class ProfilesList {
  checked = signal<boolean>(false);
  products = signal<Product[]>([
    { code: '1', name: 'Product 1', category: 'Category 1', quantity: 10 },
    { code: '2', name: 'Product 2', category: 'Category 2', quantity: 20 },
    { code: '3', name: 'Product 3', category: 'Category 3', quantity: 30 },
  ]);
}
