import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCollapsetreeComponent } from './app-collapsetree.component';

describe('AppCollapsetreeComponent', () => {
  let component: AppCollapsetreeComponent;
  let fixture: ComponentFixture<AppCollapsetreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppCollapsetreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppCollapsetreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
