// - Routes instead of RouteConfig
// - RouterModule instead of provideRoutes
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent, routes as homeChildRoutes } from './components/home/home.component';
import { GameComponent, routes as gameChildRoutes } from './components/game/game.component';
import { TopicComponent, routes as topicChildRoutes } from './components/topic/topic.component';
import { UserComponent, routes as userChildRoutes } from './components/user/user.component';

const routes: Routes = [
  { path: '', component: HomeComponent, children: homeChildRoutes, pathMatch: 'full' },
  { path: 'topic', component: TopicComponent, children: topicChildRoutes },
  { path: 'game', component: GameComponent, children: gameChildRoutes },
  { path: 'user', component: UserComponent, children: userChildRoutes }
];

// - Updated Export
export const routing = RouterModule.forRoot(routes);