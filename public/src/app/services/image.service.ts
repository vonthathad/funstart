import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
@Injectable()
export class ImageService {
    private uploadUrl = '/api/shooting';
    constructor(private http: Http) { }
    createImage(gameId, obj): Observable<any> {
        // alert(1234);
        let headers = new Headers({ 'Content-Type': 'application/json',
         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNpcmRhdDE5OTNAZ21haWwuY29tIiwiaWF0IjoxNDg0NzMyNDYyfQ.gvsYyH1-d_foTZEjVzCZLIol1gaNHVv5TURTIp1YSqE' });
        let options = new RequestOptions({ headers: headers });
        // let body = {html : html};
        return this.http.post(this.uploadUrl + '/' + gameId, obj, options)
            .map((res: Response) => res.json())
            .catch((error: Response | any) => Observable.throw(error.json().error || 'Server error'));
    }
    // createImageFromHtml(html: string): Observable<any> {
    //     let headers = new Headers({ 'Content-Type': 'application/json' });
    //     let options = new RequestOptions({ headers: headers });
    //     let body = { html: html };
    //     return this.http.post(this.uploadUrl, body, options)
    //         .map((res: Response) => res.json().data)
    //         .catch((error: Response | any) => Observable.throw(error.json().error || 'Server error'));
    // }
}


export var IMAGE_PROVIDER: Array<any> = [
    { provide: ImageService, useClass: ImageService }
]