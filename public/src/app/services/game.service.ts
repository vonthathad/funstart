import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { Rest } from './rest';

import { Game } from '../classes/game';
@Injectable()
export class GameService {
    private rest: Rest;
    // public gameChangeSource = new Subject<Game>();
    // public gameChange$ = this.gameChangeSource.asObservable();

    constructor(private http: Http) {
        this.rest = new Rest(http);
    }

    getGames(queryArgs?: Object): Observable<any[]> {
        var token = this.rest.getToken();
        let headers = new Headers({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.rest.get({
            queryArgs: queryArgs,
            url: `api/games`,
            headers: headers
        });
    }
    getGame(id: string): Observable<any[]> {
        var token = this.rest.getToken();
        let headers = new Headers({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
        return this.rest.get({
            url: `api/games/${id}`,
            headers: headers
        });
    }
}

export var GAME_PROVIDER: Array<any> = [
    { provide: GameService, useClass: GameService }
]