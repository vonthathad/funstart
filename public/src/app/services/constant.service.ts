import {Injectable} from '@angular/core'
import {Topic} from '../classes/topic'
@Injectable()
export class ConstantService{
    static TOPICS: Topic[] = [
        new Topic(0, "Quickness","ion-ios-bolt"),
        new Topic(1, "Flexibility","ion-ios-infinite"),
        new Topic(2, "Memory","ion-ios-lightbulb"),
        new Topic(3, "Concentration","ion-ios-eye"),
        new Topic(4, "Intelligence","ion-ios-cog"),
    ]
}

export var CONSTANT_SERVICE: Array<any> = [
    {provide: ConstantService, useClass: ConstantService}
]