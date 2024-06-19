import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxExcelViewerModule } from '../../projects/ngx-excel-viewer/src/public-api';
import { MicrosoftExcelModificationComponent } from './microsoft-excel-modification/microsoft-excel-modification.component';
import { NormalExcelModificationComponent } from './normal-excel-modification/normal-excel-modification.component';
import { HttpClientModule } from '@angular/common/http';
import { TestComponentComponent } from './test-component/test-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import HttpClientModule
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { CommentListDialogComponent } from './comments-list-dialog/comments-list-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    MicrosoftExcelModificationComponent,
    NormalExcelModificationComponent,
    TestComponentComponent,
    CommentListDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxExcelViewerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
