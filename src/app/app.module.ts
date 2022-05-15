import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChessService } from 'src/services/chess/chess.service';
import { StageService } from 'src/services/stage/stage.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewsModule } from './views/views.module';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AppRoutingModule, ViewsModule],
    providers: [ChessService, StageService],
    bootstrap: [AppComponent],
})
export class AppModule {}
