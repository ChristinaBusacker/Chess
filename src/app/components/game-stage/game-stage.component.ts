import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    ViewChild,
} from '@angular/core';
import { BoardService } from 'src/services/board/board.service';
import { ChessService } from 'src/services/chess/chess.service';
import { StageService } from 'src/services/stage/stage.service';
import * as THREE from 'three';

@Component({
    selector: 'app-game-stage',
    templateUrl: './game-stage.component.html',
    styleUrls: ['./game-stage.component.scss'],
})
export class GameStageComponent implements AfterViewInit {
    @ViewChild('canvasElement')
    public canvasElement?: ElementRef<HTMLCanvasElement>;

    public currentField?: THREE.Mesh;
    public possibleMoves?: Array<THREE.Mesh>;

    public constructor(
        private chessService: ChessService,
        private stageService: StageService,
        private boardService: BoardService
    ) {}

    private get tileset(): THREE.Object3D<THREE.Event> | undefined {
        return this.stageService.scene?.getObjectByName('tileset') || undefined;
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event: Event) {
        if (this.stageService.camera) {
            this.stageService.camera.aspect =
                window.innerWidth / window.innerHeight;
            this.stageService.camera.updateProjectionMatrix();
            this.stageService.camera.updateMatrixWorld();
        }

        if (this.stageService.renderer) {
            this.stageService.renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );
        }
    }

    @HostListener('document:click', ['$event'])
    public onClick(event: MouseEvent) {
        event.preventDefault();
        const field = this.stageService.getClickEventTargetField(event);
        if (field) {
            this.chessService.handleFieldInteraction(
                field.object as THREE.Mesh
            );
        }
    }

    @HostListener('document:keydown', ['$event'])
    public keydown(event: KeyboardEvent) {
        if (event.ctrlKey && event.key === 'z') {
            this.chessService.undo();
        }
    }

    public async ngAfterViewInit(): Promise<void> {
        if (this.canvasElement?.nativeElement) {
            this.stageService.init(this.canvasElement?.nativeElement);
            await this.boardService.initBoard();
            await this.chessService.initChessPieceMeshes();
            this.chessService.setChessPiecesStartFormation();
        }

        if (this.stageService.control) {
            this.stageService.control.update();
        }
    }
}
