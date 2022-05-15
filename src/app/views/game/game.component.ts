import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EChessPieceColors } from 'src/enums/EChessPiece';
import { IMove } from 'src/interfaces/IMove';
import { ChessService } from 'src/services/chess/chess.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
    @HostBinding('class.dark') public dark = false;

    private turnColorSubscription = new Subscription();
    public turnColor: EChessPieceColors = EChessPieceColors.light;
    public move?: IMove;

    constructor(private chessService: ChessService) {}

    public ngOnInit(): void {
        this.turnColorSubscription.add(
            this.chessService.turn.subscribe((color) => {
                this.turnColor = color;
                this.dark = this.turnColor === EChessPieceColors.dark;
            })
        );

        this.turnColorSubscription.add(
            this.chessService.moves.subscribe((moves) => {
                this.move = moves[moves.length - 1];
            })
        );
    }

    public ngOnDestroy(): void {
        this.turnColorSubscription?.unsubscribe();
    }

    public get lastTurn(): string | undefined {
        if (this.move) {
            const color =
                this.move.color === EChessPieceColors?.light
                    ? 'White'
                    : 'Black';
            const piece = this.move?.piece?.toLowerCase();

            return `${color} moves ${piece} from ${this.move.from} to ${this.move.to}`;
        }

        return undefined;
    }
}
