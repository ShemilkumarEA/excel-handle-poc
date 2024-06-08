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

@NgModule({
  declarations: [
    AppComponent,
    MicrosoftExcelModificationComponent,
    NormalExcelModificationComponent,
    TestComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxExcelViewerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
