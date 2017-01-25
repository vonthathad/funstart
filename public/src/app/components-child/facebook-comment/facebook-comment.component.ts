import { Component, OnInit, ElementRef, Input } from '@angular/core';
@Component({
  selector: 'app-facebook-comment',
  templateUrl: 'facebook-comment.component.html',
  styleUrls: ['facebook-comment.component.scss']
})
export class FacebookCommentComponent implements OnInit {
  // @Input() url: string;
  constructor(private el: ElementRef) { }

  ngOnInit() {
    let commentsDom = (<HTMLElement>this.el.nativeElement).querySelector('#fb-comments') as HTMLElement;
    commentsDom.innerHTML = '<div class="fb-comments" ' +
        'data-href="' + location.href.split('?') + '" ' +
        'data-width="' + commentsDom.clientWidth + '" ' +
        'data-numposts="5" ' +
        '</div>';

  }

}
