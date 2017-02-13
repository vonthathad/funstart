import {style, animate, transition, state, trigger} from '@angular/core';

export default [
    trigger('flyIn', [
      state('in', style({opacity: 1, transform: 'translateX(0)'})),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(200%)'
        }),
        animate('0.2s ease-in')
      ])
    ])
];
