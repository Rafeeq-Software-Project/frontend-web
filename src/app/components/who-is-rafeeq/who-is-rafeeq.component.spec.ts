import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoIsRafeeqComponent } from './who-is-rafeeq.component';

describe('WhoIsRafeeqComponent', () => {
  let component: WhoIsRafeeqComponent;
  let fixture: ComponentFixture<WhoIsRafeeqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhoIsRafeeqComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WhoIsRafeeqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
