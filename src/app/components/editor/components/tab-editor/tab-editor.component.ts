import { Component } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormControl } from "@angular/forms";

@Component({
  selector: 'tab-editor',
  templateUrl: './tab-editor.component.html',
  styleUrls: ['./tab-editor.component.css']
})
export class TabEditorComponent {
  frm;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
};

constructor(private fb: FormBuilder) {
  this.frm = this.fb.group({
    htmlContent: new FormControl("")
  });
}


}
