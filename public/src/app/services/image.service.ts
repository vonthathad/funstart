import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

import { Rest } from './rest';

@Injectable()
export class ImageService {
    private rest: Rest;
    constructor(private http: Http) { }
    createImage(gameId, obj): Observable<any> {
        alert("1245");
        var token = this.rest.getToken();
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        return this.rest.post({
            body: obj,
            url: `api/createPicture`,
            headers: headers
        });
    }
    // createImageFromHtml(html: string): Observable<any> {
    // let headers = new Headers({ 'Content-Type': 'application/json' });
    // let options = new RequestOptions({ headers: headers });
    // let body = { html: html };
    // return this.http.post(this.uploadUrl, body, options)
    //     .map((res: Response) => res.json().data)
    //     .catch((error: Response | any) => Observable.throw(error.json().error || 'Server error'));
    // }
}


export var IMAGE_PROVIDER: Array<any> = [
    { provide: ImageService, useClass: ImageService }
]