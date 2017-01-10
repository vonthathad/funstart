import {Topic} from './topic';
export class Game{
    constructor(
        public _id: number,
        public title: string,
        public topic: Topic,
        public desc: string,
        public thumb: string,
        public clip?: string,
        public plays?: number
    ){}
}