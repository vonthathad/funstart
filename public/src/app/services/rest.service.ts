import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs, Response, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/Rx';

@Injectable()
export class RestService {
    static BASE_URL: string = 'http://localhost:8235/api/';
    constructor(public http: Http) {

    }
    get(document: string, params?: Array<string>): Observable<any[]> {
        let url: string = `${RestService.BASE_URL}${document}`;
        if (params) {
            url = `${url}?${params.join('&')}`;
        }

        let headers = new Headers({ 'Authorization': 'Bearer CRv1o8FaogFa2SYU4F6Z9DzytqL1l4My' }); 
        let options: RequestOptionsArgs = { headers: headers };
        console.log("URL " +url);
        return this.http.request(url, options).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getGames(paramsObj?:any) {
        let paramsList: string[] = [];
        if (paramsObj) {
            paramsList = [];
            Object.keys(paramsObj).forEach(function (param) {
                paramsList.push(`${param}=${paramsObj[param]}`)
            });
        }
        return this.get('games', paramsList);
    }
    getGame(id: string): Observable<any[]> {
        return this.get(`games/${id}`);
    }
    getUser(username: string): Observable<any[]>{
        return this.get(`users/${username}`);
    }
}

export var REST_PROVIDER: Array<any> = [
    { provide: RestService, useClass: RestService }
]