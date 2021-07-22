import { NoteDialogComponent } from "./../../note-dialog/note-dialog.component";
import { Component, HostListener, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Note } from "src/app/models/note.model";
import { NoteService } from "src/app/services/note.service";
import { MatSnackBar } from "@angular/material/snack-bar";

interface Option {
  value: string;
  viewValue: string;
}
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  public innerWidth: any;
  public innerHeight: any;

  filteredNotes: Note[] = [];
  staticNotes: Note[] = [];

  searchTerm = "";

  orderOptions: Option[] = [
    { value: "0", viewValue: "newest to oldest" },
    { value: "1", viewValue: "oldest to newest" },
    { value: "2", viewValue: "A-Z" },
    { value: "3", viewValue: "Z-A" },
  ];
  selectedOrder = this.orderOptions[0].value;

  constructor(
    private noteService: NoteService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
    ) {}

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    this.getNotes();
  }

  getNotes(): void {
    this.noteService.getNotes().subscribe((notes) => {
      this.filteredNotes = this.staticNotes = notes;
      this.sortNotes({ value: "0" });
    },
    error => {
      this.openSnackBar('can\'t load your notes right now. please try again later', 'close')
    });
  }

  deleteNote(id: number, index: number) {
    this.noteService.deleteNote(id).subscribe((data) => {
      this.filteredNotes.splice(index, 1);
      this.staticNotes = this.filteredNotes;

      this.openSnackBar('note excluded successfully', 'close')
    },
    error => {
      this.openSnackBar('can\'t delete your note right now. please try again later', 'close')
    });
  }

  editNote(index: number) {
    this.openDialog(this.filteredNotes[index]);
  }

  createNote() {
    this.openDialog();
  }

  openDialog(note?: Note) {

    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.data = note;

    if (this.innerWidth < 420) {
      matDialogConfig.width = "100%";
      matDialogConfig.height = "100%";
      matDialogConfig.minWidth = "100%";
      matDialogConfig.minHeight = "100%";
    } else {
      matDialogConfig.width = "615px";
      matDialogConfig.height = "615px";
    }

    const dialogRef = this.dialog.open(NoteDialogComponent, matDialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      if (data.message.length > 0) {
        this.openSnackBar(data.message, data.action);
        this.getNotes();
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  /* Searcing notes */

  showClearBtn(): boolean {
    if (this.searchTerm.length > 0) {
      return true;
    }

    this.filteredNotes = this.staticNotes;
    return false;
  }

  searchNotes(e?): void {
    const term = this.searchTerm.toLocaleLowerCase();

    if (term.length > 0) {
      this.filteredNotes = this.staticNotes.filter(
        (note) =>
          note.title.toLowerCase().indexOf(term) > -1 ||
          note.content.toLowerCase().indexOf(term) > -1
      );
    } else {
      this.filteredNotes = this.staticNotes;
    }
  }

  /* Sorting functions */

  sortNotes(e?) {
    const option = e.value;

    switch (option) {
      case "0": {
        this.filteredNotes.sort(this.dynamicSort("-createdAt"));
        this.staticNotes.sort(this.dynamicSort("-createdAt"));
        break;
      }
      case "1": {
        this.filteredNotes.sort(this.dynamicSort("createdAt"));
        this.staticNotes.sort(this.dynamicSort("createdAt"));
        break;
      }
      case "2": {
        this.filteredNotes.sort(this.dynamicSort("title"));
        this.staticNotes.sort(this.dynamicSort("title"));
        break;
      }
      case "3": {
        this.filteredNotes.sort(this.dynamicSort("-title"));
        this.staticNotes.sort(this.dynamicSort("-title"));
        break;
      }
      default: {
        this.filteredNotes.sort(this.dynamicSort("createdAt"));
        this.staticNotes.sort(this.dynamicSort("createdAt"));
        break;
      }
    }
  }

  dynamicSort(property: string) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result =
        a[property].toLowerCase() < b[property].toLowerCase()
          ? -1
          : a[property].toLowerCase() > b[property].toLowerCase()
          ? 1
          : 0;
      return result * sortOrder;
    };
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }
}
