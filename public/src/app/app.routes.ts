// - Routes instead of RouteConfig
// - RouterModule instead of provideRoutes
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { TopicComponent } from './components/topic/topic.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'topic/:id', component: TopicComponent },
  { path: 'game/:id', component: GameComponent },
  { path: 'user/:username', component: UserComponent }
];

// - Updated Export
export const routing = RouterModule.forRoot(routes);