import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NormalExcelModificationComponent } from './normal-excel-modification/normal-excel-modification.component';
import { MicrosoftExcelModificationComponent } from './microsoft-excel-modification/microsoft-excel-modification.component';
import { DocEditorComponent } from './doc-editor/doc-editor.component';

const routes: Routes = [
  {
    path: '',
    component: NormalExcelModificationComponent
  },
  {
    path: 'microsoft',
    component: MicrosoftExcelModificationComponent
  },
  {
    path: 'editor',
    component: DocEditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
