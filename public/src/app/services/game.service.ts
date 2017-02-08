import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { Rest } from './rest';

import { Game } from '../classes/game';
@Injectable()
export class GameService {
    private rest: Rest;
    public game: Game;
    public gameSource = new Subject<Game>();
    public game$ = this.gameSource.asObservable();

    public gameResult: any;
    public gameResultSource = new Subject<Object>();
    public gameResult$ = this.gameResultSource.asObservable();

    constructor(private http: Http) {
        this.rest = new Rest(http);
        this.game$.subscribe(game => { this.game = game;
        // console.log("game service " + JSON.stringify(game))
        });
        this.gameResult$.subscribe(gameResult => { this.gameResult = gameResult; console.log("game result service " + JSON.stringify(gameResult)) });
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