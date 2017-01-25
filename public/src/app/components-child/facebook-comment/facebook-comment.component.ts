import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
@Component({
  selector: 'app-facebook-comment',
  templateUrl: 'facebook-comment.component.html',
  styleUrls: ['facebook-comment.component.scss']
})
export class FacebookCommentComponent implements OnInit {
  // @Input() url: string;
  constructor(private route: Router, private el: ElementRef) { }

  ngOnInit() {
      this.route.events.subscribe(event => {
          if (event instanceof NavigationStart) {
              let commentsDom = (<HTMLElement>this.el.nativeElement).querySelector('#fb-comments') as HTMLElement;
              commentsDom.innerHTML = '<div class="fb-comments" ' +
                  'data-href="' + event.url + '" ' +
                  'data-width="' + commentsDom.clientWidth + '" ' +
                  'data-numposts="5" ' +
                  '</div>';

          }
      });
  }

}
