import { Component, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import {Game} from "../../classes/game";
@Component({
  selector: 'app-facebook-comment',
  templateUrl: 'facebook-comment.component.html',
  styleUrls: ['facebook-comment.component.scss']
})
export class FacebookCommentComponent implements OnInit,OnChanges {
  @Input() game: Game;
  disable: boolean;
  constructor(private route: Router, private el: ElementRef) { }
  ngOnInit() {
      this.createDOM();
  };
    createDOM(){
        let commentsDom = (<HTMLElement>this.el.nativeElement).querySelector('#fb-cmts') as HTMLElement;
        commentsDom.innerHTML = '<div class="fb-comments" ' +
            'data-href="' + location.href.split('?')[0] + '" ' +
            'data-width="' + commentsDom.clientWidth + '" ' +
            'data-numposts="5" ' +
            '</div>';
        setTimeout(function(){
            window.FB.XFBML.parse(commentsDom);
        });
    }
    ngOnChanges(){
        this.createDOM();
    }

}
