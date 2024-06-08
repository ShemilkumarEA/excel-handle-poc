import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NormalExcelModificationComponent } from './normal-excel-modification/normal-excel-modification.component';
import { MicrosoftExcelModificationComponent } from './microsoft-excel-modification/microsoft-excel-modification.component';
import { TestComponentComponent } from './test-component/test-component.component';

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
    path: 'test',
    component: TestComponentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
