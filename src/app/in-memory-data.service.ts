import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 11, name: 'Dr Nice' },
      { id: 12, name: 'Dr Narco' },
      { id: 13, name: 'Dr Bombasto' },
      { id: 14, name: 'Dr Celeritas' },
      { id: 15, name: 'Dr Magneta' },
      { id: 16, name: 'Dr RubberMan' },
      { id: 17, name: 'Dr Dynama' },
      { id: 18, name: 'Dr Dr IQ' },
      { id: 19, name: 'Dr Magma' },
      { id: 20, name: 'Dr Tornado' },
    ];
    return { heroes }
  }
  
  // Overrides the genId method to ensure that a hero always has an id 
  // If the heroes array is empty
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(heroes: Hero[]):number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
  }
}
