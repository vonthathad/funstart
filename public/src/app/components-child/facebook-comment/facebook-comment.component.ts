import { Component, OnInit, ElementRef, Input, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
@Component({
  selector: 'app-facebook-comment',
  templateUrl: 'facebook-comment.component.html',
  styleUrls: ['facebook-comment.component.scss']
})
export class FacebookCommentComponent implements OnInit,OnDestroy {
  // @Input() url: string;
  constructor(private route: Router, private el: ElementRef) { }

  ngOnInit() {
      this.route.events.subscribe(event => {
          if (event instanceof NavigationStart) {
              console.log('change url',event.url);
              let commentsDom = (<HTMLElement>this.el.nativeElement).querySelector('#fb-comments') as HTMLElement;
              commentsDom.innerHTML = '';
              setTimeout(function(){
                  commentsDom.innerHTML = '<div class="fb-comments" ' +
                      'data-href="' + event.url + '" ' +
                      'data-width="' + commentsDom.clientWidth + '" ' +
                      'data-numposts="5" ' +
                      '</div>';
              });


          }
      });
  };
    ngOnDestroy(){
        let commentsDom = (<HTMLElement>this.el.nativeElement).querySelector('#fb-comments') as HTMLElement;
        commentsDom.innerHTML = '';
    }

}
