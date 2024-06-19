import { NgModule } from '@angular/core';
import { NgxExcelViewerComponent } from './ngx-excel-viewer.component';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { CommentDialogComponent } from './dialog/comment-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommentListDialogComponent } from './comments-list-dialog/comments-list-dialog.component';


@NgModule({
  declarations: [
    NgxExcelViewerComponent,
    CommentDialogComponent,
    CommentListDialogComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule
  ],
  exports: [
    NgxExcelViewerComponent,
    CommentDialogComponent,
    CommentListDialogComponent
  ]
})
export class NgxExcelViewerModule { }
