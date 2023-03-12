import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectiveCompositionAPIComponent } from './directive-composition-api.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DirectiveCompositionAPIComponent,
  },
];

@NgModule({
  declarations: [DirectiveCompositionAPIComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class DirectiveCompositionAPIModule {}
