import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';

import { Rest } from './rest';

@Injectable()
export class UserService {
    private rest: Rest;
    private loggedUserSource = new Subject<string>();
    public loggedUser$ = this.loggedUserSource.asObservable();

    constructor(private http: Http) {
        this.rest = new Rest(http);
    }
    // sign up by email, username and password
    signUp(registerInfo) {
        let loggedUserSource = this.loggedUserSource;
        this.rest
            .post({
                body: registerInfo,
                url: `auth/signup`
            })
            .subscribe(userInfo => { loggedUserSource.next(userInfo.toString()) });
    }
}

export var USER_PROVIDER: Array<any> = [
    { provide: UserService, useClass: UserService }
]