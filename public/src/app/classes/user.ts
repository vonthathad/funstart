export class User {
    constructor(
        public _id?:string,
        public avatar?: string,
        public username?: string,
        public displayName?: string,
        public email?: string,
        public password?: string,
        public token?: string,
        public score?:number
    ) { }
}