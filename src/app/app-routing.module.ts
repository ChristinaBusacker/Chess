import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './views/game/game.component';
import { StartComponent } from './views/start/start.component';

const routes: Routes = [
    { path: '', component: StartComponent },
    { path: 'game', component: GameComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
