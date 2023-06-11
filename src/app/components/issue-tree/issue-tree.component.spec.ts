import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueTreeComponent } from './issue-tree.component';

describe('IssueTreeComponent', () => {
  let component: IssueTreeComponent;
  let fixture: ComponentFixture<IssueTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
