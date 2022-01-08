import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: any;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Coordinates;
}

interface Coordinates {
  lat: string;
  lng: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly photosUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.photosUrl)
      .pipe(catchError(this.handleError<User[]>('getUsers', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error);
      return of(result as T);
    };
  }
}
