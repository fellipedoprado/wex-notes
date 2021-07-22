import { Note } from './../models/note.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.scss']
})
export class NoteDialogComponent implements OnInit {

  noteForm;
  textareaRows;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Note,
    private noteService: NoteService
    ) { }

  ngOnInit(): void {
    this.textareaRows = window.innerWidth < 420 ? 21 : 19;
    this.initializeForm(this.data);
  }

  initializeForm(note: Note) {
    this.noteForm = new FormGroup({
      title: new FormControl(note ? note.title : ''),
      content: new FormControl(note ? note.content : ''),
    });
  }

  save() {
    const note: Note = {
      title: this.noteForm.controls['title'].value,
      content: this.noteForm.controls['content'].value
    }

    if (this.data && this.data.id) {
      this.noteService.updateNote(note, this.data.id)
      .subscribe(() => {
        this.dialogRef.close({message: 'changes saved successfully', action: 'close'});
      },
      error => {
        this.dialogRef.close({message: 'can\'t save your changes right now. please try again later', action: 'close'});
      });
    } else {
      this.noteService.addNote(note)
      .subscribe(() => {
        this.dialogRef.close({message: 'note created successfully', action: 'close'});
      },
      error => {
        this.dialogRef.close({message: 'can\'t save your note right now. please try again later', action: 'close'});
      });
    }
  }

  close() {
    this.dialogRef.close({message: '', action: ''});

  }

}
