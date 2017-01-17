import { Headers, RequestMethod } from '@angular/http';
export class QueryOptions {
    constructor(
         public url?: string,
        public body?: Object,
        public headers?: Headers,
        public queryArgs?:Array<string>,
        public method?: RequestMethod
    ){}
}