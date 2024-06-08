import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalExcelModificationComponent } from './normal-excel-modification.component';

describe('NormalExcelModificationComponent', () => {
  let component: NormalExcelModificationComponent;
  let fixture: ComponentFixture<NormalExcelModificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalExcelModificationComponent]
    });
    fixture = TestBed.createComponent(NormalExcelModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
