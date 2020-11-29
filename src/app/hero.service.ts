import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes'; 
import { Observable, of} from 'rxjs'; 
import { MessageService } from './message.service';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  // Get heroes from the server
  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  // Get hero by id. will 404 if id not found
  getHero(id: Number): Observable<Hero> {
    // TODO: send the message _after_ fetching the hero
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id = ${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  } 

  // get hero by id, return `undefined` when id not found
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url).pipe(
      map(heroes => heroes[0]), // returns a {0 | 1} element array
      tap(h => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`${outcome} hero id=${id}`);
      }),
      catchError(this.handleError<Hero>(`getHero id = ${id}`))
    );
  }

  // PUT update the hero on the server
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

  // POST add a new hero to the server
  addHero(hero: Hero): Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  // Delete the hero from the server
  deleteHero(hero: Hero | number):Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`delete hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    )
  }

  // GET heroes whose name contains search item 
  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()) {
      // if not search item, return empty hero array
      return of([]);
    } 
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ? this.log(`found heroes matching "${term}"`) : this.log(`no heroes matchinng "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    )
  }

  // Log a HeroService message with the MessageService
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /* Handle Http operation that failed.
     Let the app continue
     @param operation - name of the operation that failed 
     @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); 

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // let the app keep running by returning an empty result
      return of(result as T);
    }
  }
}
