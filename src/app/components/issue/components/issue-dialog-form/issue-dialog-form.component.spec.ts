import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssueDialogFormComponent } from './issue-dialog-form.component';

describe('IssueDialogFormComponent', () => {
  let component: IssueDialogFormComponent;
  let fixture: ComponentFixture<IssueDialogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueDialogFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
