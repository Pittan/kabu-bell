import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditRoutingModule } from './edit-routing.module';
import { EditComponent } from './edit/edit.component';
import { FormsModule } from '@angular/forms'
import { SharedModule } from '../../shared/shared.module'


@NgModule({
  declarations: [EditComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    EditRoutingModule
  ]
})
export class EditModule { }
