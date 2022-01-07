import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export interface User {
  id: number
  name: string
  username: string
  email: string
  address: Address
  phone: string
  website: string
  company: any
}

interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: Coordinates
}

interface Coordinates {
  lat: string
  lng: string
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly photosUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.photosUrl).pipe(
      catchError(this.handleError<User[]>('getUsers', []))
    );
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
