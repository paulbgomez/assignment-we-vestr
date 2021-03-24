import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EnterprisesDetailsComponent} from './enterprises-details.component';

describe('EnterprisesDetailsComponent', () => {
  let component: EnterprisesDetailsComponent;
  let fixture: ComponentFixture<EnterprisesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterprisesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterprisesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
