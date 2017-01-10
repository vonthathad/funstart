import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs, Response, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/Rx';

@Injectable()
export class RestService {
    static BASE_URL: string = 'http://localhost:8235/api/';
    constructor(public http: Http) {

    }
    query(URL: string, params?: Array<string>): Observable<any[]> {
        let queryURL: string = `&{RestService.BASE_URL}${URL}`;
        if (params) {
            queryURL = `${queryURL}?${params.join('&')}`;
        }
        return this.http.request(queryURL).map((res: any) => res.json());
    }
    // getGames() {
    //     // return this.query(`/games`);

    //     let headers: Headers = new Headers();
    //     headers.append('X-API-TOKEN', 'ng-book');

    //     let opts: RequestOptions = new RequestOptions();
    //     opts.headers = headers;
    //     headers.append('Authorization', 'Bearer CRv1o8FaogFa2SYU4F6Z9DzytqL1l4My');
    //     this.http.get('http://jsonplaceholder.typicode.com/posts/1', opts);
    // }
    getGames() {
      let headers      = new Headers({ 'Authorization': 'Bearer CRv1o8FaogFa2SYU4F6Z9DzytqL1l4My' }); // ... Set content type to JSON
        let options: RequestOptionsArgs ={ headers: headers, method :RequestMethod.Get };
        return this.http.get('http://localhost:8235/api/games', options) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
    getGame(id: string): Observable<any[]> {
        return this.query(`/games/${id}`);
    }
}

export var REST_PROVIDER: Array<any> = [
    { provide: RestService, useClass: RestService }
]