import { NgModule } from '@angular/core';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

import { CommonModule } from '@angular/common';
import { MV15Component } from './m-v15/m-v15.component';

@NgModule({
  declarations: [
    MV15Component
  ],
  imports: [CommonModule, MatCheckboxModule],
})
export class MaterialV15CompModule {}
