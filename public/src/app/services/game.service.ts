import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { Rest } from './rest';

@Injectable()
export class GameService {
    private rest: Rest;

    constructor(private http: Http) {
        this.rest = new Rest(http);
    }

    getGames(queryArgs?: Object): Observable<any[]> {
        let headers = new Headers({
            'Authorization': 'Bearer CRv1o8FaogFa2SYU4F6Z9DzytqL1l4My',
            'Content-Type': 'application/json'
        });
        return this.rest.get({
            queryArgs: queryArgs,
            url: `api/games`,
            headers: headers
        });
    }
    getGame(id: string): Observable<any[]> {
        let headers = new Headers({
            'Authorization': 'Bearer CRv1o8FaogFa2SYU4F6Z9DzytqL1l4My',
            'Content-Type': 'application/json'
        });
        return this.rest.get({
            url: `games/${id}`,
            headers: headers
        });
    }
}

export var GAME_PROVIDER: Array<any> = [
    { provide: GameService, useClass: GameService }
]