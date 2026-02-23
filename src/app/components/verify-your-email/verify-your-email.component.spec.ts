import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyYourEmailComponent } from './verify-your-email.component';

describe('VerifyYourEmailComponent', () => {
  let component: VerifyYourEmailComponent;
  let fixture: ComponentFixture<VerifyYourEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyYourEmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifyYourEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
