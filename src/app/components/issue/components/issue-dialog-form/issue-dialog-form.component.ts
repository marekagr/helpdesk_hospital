import { Component,Inject,ChangeDetectorRef,OnInit } from '@angular/core';
import { FormBuilder, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'issue-dialog-form',
  templateUrl: './issue-dialog-form.component.html',
  styleUrls: ['./issue-dialog-form.component.scss']
})
export class IssueDialogFormComponent implements OnInit{
  issueForm;
  constructor(private fb: FormBuilder,private ref: ChangeDetectorRef,private dialog: MatDialog,private dialogRef: MatDialogRef<IssueDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) {
    this.issueForm = this.fb.group({
      name: new FormControl(""),
      description: new FormControl()
    });

  }

  ngOnInit(): void {
    this.issueForm.patchValue(this.data.currentIssue)
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.dialogRef.close(value);
  }
}
