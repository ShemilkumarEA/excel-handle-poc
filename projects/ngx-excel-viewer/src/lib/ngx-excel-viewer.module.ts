import { NgModule } from '@angular/core';
import { NgxExcelViewerComponent } from './ngx-excel-viewer.component';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    NgxExcelViewerComponent,
  ],
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  exports: [
    NgxExcelViewerComponent
  ]
})
export class NgxExcelViewerModule { }
