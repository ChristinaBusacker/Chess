import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GameStageComponent } from './game-stage.component';

@NgModule({
    declarations: [GameStageComponent],
    imports: [CommonModule],
    exports: [GameStageComponent],
})
export class GameStageModule {}
