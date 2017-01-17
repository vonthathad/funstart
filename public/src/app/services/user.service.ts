import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';

import { Rest } from './rest';

@Injectable()
export class UserService {
    private loggedUserSource = new Subject<string>();
    private rest: Rest;
    public loggedUser$ = this.loggedUserSource.asObservable();

    constructor(private http: Http) {
        this.rest = new Rest(http);
    }
    signUp(registerInfo) {
        let loggedUserSource = this.loggedUserSource;
        this.rest.post(
            {
                body: registerInfo,
                url: `auth/signup`
            },
            function (userInfo) {
                loggedUserSource.next(userInfo);
            }
        );
    }
}

export var USER_PROVIDER: Array<any> = [
    { provide: UserService, useClass: UserService }
]