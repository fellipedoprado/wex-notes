import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    ) { }

    getNotes(): Observable<Note[]> {
      return this.http.get<Note[]>(environment.apiUrl);
    }

    getNote(id: number): Observable<Note> {
      return this.http.get<Note>(`${environment.apiUrl}/${id}`);
    }

    addNote(note: Note): Observable<Note> {
      return this.http.post<Note>(environment.apiUrl, note, this.httpOptions);
    }

    updateNote(note: Note, id: number): Observable<any> {
      return this.http.put(`${environment.apiUrl}/${id}`, note, this.httpOptions);
    }

    deleteNote(id: number): Observable<Note> {
      return this.http.delete<Note>(`${environment.apiUrl}/${id}`, this.httpOptions);
    }

}
