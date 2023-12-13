import { NgModule } from '@angular/core';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

import { CommonModule } from '@angular/common';
import { MV15Component } from './m-v15/m-v15.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MV15Component],
  imports: [CommonModule, MatCheckboxModule, RouterModule],
})
export class MaterialV15CompModule {}
