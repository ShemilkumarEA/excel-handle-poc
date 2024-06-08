import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrosoftExcelModificationComponent } from './microsoft-excel-modification.component';

describe('MicrosoftExcelModificationComponent', () => {
  let component: MicrosoftExcelModificationComponent;
  let fixture: ComponentFixture<MicrosoftExcelModificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MicrosoftExcelModificationComponent]
    });
    fixture = TestBed.createComponent(MicrosoftExcelModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
