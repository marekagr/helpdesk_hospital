import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsetreeComponent } from './collapsetree.component';

describe('CollapsetreeComponent', () => {
  let component: CollapsetreeComponent;
  let fixture: ComponentFixture<CollapsetreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollapsetreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsetreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
