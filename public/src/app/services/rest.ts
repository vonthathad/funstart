
import { Http, Headers, Request, RequestOptionsArgs, Response, RequestMethod, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { QueryOptions } from '../classes/query-options'

import 'rxjs/Rx';

export class RestService {
    static BASE_URL: string = 'http://localhost:8235/';
    private loggedUserSource = new Subject<string>();
    loggedUser$ = this.loggedUserSource.asObservable();
    constructor(private http: Http) { }
    // calling request
    request(options: QueryOptions, callback) {
        // set partial url to full url
        options.url = `${RestService.BASE_URL}${options.url}`;
        // stringify body from json to string
        options.body = JSON.stringify(options.body);
        // add default header if there are no header
        if (!options.headers) options.headers = new Headers({ 'Content-Type': 'application/json' });
        // add params to query params
        if (options.queryArgs) {
            options.url = `${options.url}?${options.queryArgs.join('&')}`;
        }
        // create request object
        let reqOptions = new RequestOptions(options);
        var req = new Request(reqOptions);
        // send request
        this.http.request(req)
            .subscribe(
            res => callback(res.json()),
            error => console.error('Error: ' + error),
            () => console.log('Request completed!')
            )
    }
    post(options: QueryOptions, callback) {
        options.method = RequestMethod.Post;
        this.request(options, callback);
    }
    get(dataName: string, params?: Array<string>): Observable<any[]> {
        let url: string = `${RestService.BASE_URL}${dataName}`;
        if (params) {
            url = `${url}?${params.join('&')}`;
        }

        let headers = new Headers({ 'Authorization': 'Bearer CRv1o8FaogFa2SYU4F6Z9DzytqL1l4My' });
        let options: RequestOptionsArgs = { headers: headers };
        console.log("URL " + url);
        return this.http.request(url, options).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getGames(paramsObj?: any) {
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
    getUser(username: string): Observable<any[]> {
        return this.get(`users/${username}`);
    }
}
