import {style, animate, transition, state, trigger} from '@angular/core';

export default [
    trigger('upIn', [
      state('in', style({opacity: 1, transform: 'translateY(0)'})),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(200%)'
        }),
        animate('360ms linear')
      ])
    ])
];
