import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameStageModule } from 'src/app/components/game-stage/game-stage.module';
import { GameComponent } from './game/game.component';
import { StartComponent } from './start/start.component';

@NgModule({
    declarations: [GameComponent, StartComponent],
    imports: [CommonModule, GameStageModule, RouterModule],
    exports: [],
    providers: [],
})
export class ViewsModule {}
