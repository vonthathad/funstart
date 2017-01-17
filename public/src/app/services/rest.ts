
import { Http, Headers, Request, Response, RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { QueryOptions } from '../classes/query-options'

import 'rxjs/Rx';

export class Rest {
    // set base url of api backend
    static BASE_URL: string = 'http://localhost:8235/';

    constructor(private http: Http) { }

    // send request
    request(options: QueryOptions): Observable<any[]> {
        // set partial url to full url
        options.url = `${Rest.BASE_URL}${options.url}`;
        // stringify body from json to string
        options.body = JSON.stringify(options.body);
        // add default header if there are no header
        if (!options.headers) options.headers = new Headers({ 'Content-Type': 'application/json' });
        // add params to query params
        if (options.queryArgs) {
            // pour object properties to array
            let queryArgsArray: string[] = [];
            Object.keys(options.queryArgs).forEach(function (param) {
                queryArgsArray.push(`${param}=${options.queryArgs[param]}`)
            });
            // connect array componet with '&' then connect with full url
            options.url = `${options.url}?${queryArgsArray.join('&')}`;
        }
        console.log("URL " + options.url);
        console.log(JSON.stringify(options))
        let headers = new Headers({ 'Authorization': 'Bearer CRv1o8FaogFa2SYU4F6Z9DzytqL1l4My' });
        let _options: RequestOptionsArgs = { headers: headers };
        // create request object
        let reqOptions = new RequestOptions(options);
        var req = new Request(reqOptions);
        // send request and return observable
        return this.http.request(req)
            .map((res: Response) => { console.log(JSON.stringify(res)); return res.json() })
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    // create post 
    post(options: QueryOptions): Observable<any[]> {
        options.method = RequestMethod.Post;
        return this.request(options);
    }
    // create get
    get(options: QueryOptions): Observable<any[]> {
        options.method = RequestMethod.Get;
        return this.request(options);
    }
}
