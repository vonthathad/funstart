import {style, animate, transition, state, trigger} from '@angular/core';

export default [
  trigger('zoomIn', [
    state('in', style({ transform: 'scale(1,1)' })),
    transition('void => *', [
      style({ transform: 'scale(0,0)' }),
      animate(300)
    ])
  ])
]
