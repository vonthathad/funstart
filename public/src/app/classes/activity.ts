import { User } from '../classes/user';
import { Game } from '../classes/game';

export class Activity {
    constructor(
        public user: User,
        public game: Game,
        public created: Date,
        public score: number
    ) { }
}