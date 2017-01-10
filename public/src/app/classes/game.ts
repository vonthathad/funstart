import {GameTopic} from './game-topic';
export class Game{
    constructor(
        public id: number,
        public title: string,
        public topic: GameTopic,
        public desc: string,
        public thumb: string,
        public clip: string,
        public playCount: number
    ){}
}