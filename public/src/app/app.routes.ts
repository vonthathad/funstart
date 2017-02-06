import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './components/home/home.component';
import {GameComponent} from './components/game/game.component';
import {TopicComponent} from './components/topic/topic.component';
import {UserComponent} from './components/user/user.component';
import {SignupComponent} from './components/signup/signup.component';

const routes: Routes = [
   {path: '', component: HomeComponent, pathMatch: 'full'},
   {path: 'topic/:id', component: TopicComponent},
   {path: 'game/:id', component: GameComponent},
   {path: 'user/:username', component: UserComponent},
   {path: 'signup', component: SignupComponent}
];

export const routing = RouterModule.forRoot(routes);