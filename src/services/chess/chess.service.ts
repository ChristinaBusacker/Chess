import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EChessPieceColors } from 'src/enums/EChessPiece';
import { EMeshType } from 'src/enums/EMeshType';
import { IChessPieceMeshCollection } from 'src/interfaces/IChessPieceMeshCollection';
import { IMeshFieldUserData } from 'src/interfaces/IMeshUserData';
import { IMove } from 'src/interfaces/IMove';
import { BishopChessPiece } from 'src/models/BishopChessPice';
import { ChessPiece } from 'src/models/ChessPiece';
import { KingChessPiece } from 'src/models/KingChessPiece';
import { KnightChessPiece } from 'src/models/KnightChessPiece';
import { PawnChessPiece } from 'src/models/PawnChessPiece';
import { QueenChessPiece } from 'src/models/QueenChessPiece';
import { RookChessPiece } from 'src/models/RookChessPiece';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BoardService } from '../board/board.service';
import { StageService } from '../stage/stage.service';

@Injectable({
    providedIn: 'root',
})
export class ChessService {
    private $moves: Array<IMove> = [];

    public loader = new GLTFLoader();
    public columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    public chessPieceMeshes?: IChessPieceMeshCollection;
    public chessPieces: Array<ChessPiece> = [];
    public victims: Array<ChessPiece> = [];
    public selectedPiece?: ChessPiece;
    public moves = new BehaviorSubject<Array<IMove>>([]);

    public turn = new BehaviorSubject<EChessPieceColors>(
        EChessPieceColors.light
    );
    public turnColor: EChessPieceColors = EChessPieceColors.light;

    constructor(
        private stageService: StageService,
        private boardService: BoardService
    ) {}

    public async getMeshesFromGltf(
        path: string,
        scale?: number
    ): Promise<Array<THREE.Mesh>> {
        const gltf = await this.loader.loadAsync(path);
        const meshes: Array<THREE.Mesh> = [];
        gltf.scene.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if ((child as THREE.Mesh).isMesh) {
                if (scale) {
                    mesh.scale.multiplyScalar(scale);
                }
                mesh.userData['type'] = EMeshType.Piece;

                meshes.push(mesh);
            }
        });
        return meshes;
    }

    public async initChessPieceMeshes() {
        this.chessPieceMeshes = {
            Pawn: (
                await this.getMeshesFromGltf('../assets/models/Pawn.gltf', 0.5)
            )[0],
            Bishop: (
                await this.getMeshesFromGltf(
                    '../assets/models/Bishop.gltf',
                    0.5
                )
            )[0],
            King: (
                await this.getMeshesFromGltf('../assets/models/King.gltf', 0.5)
            )[0],
            Knight: (
                await this.getMeshesFromGltf(
                    '../assets/models/Knight.gltf',
                    0.5
                )
            )[0],
            Queen: (
                await this.getMeshesFromGltf('../assets/models/Queen.gltf', 0.5)
            )[0],
            Rook: (
                await this.getMeshesFromGltf('../assets/models/Rook.gltf', 0.5)
            )[0],
        };
    }

    public handleFieldInteraction(field: THREE.Mesh) {
        if (this.boardService.isHighlighted(field) && this.selectedPiece) {
            this.move(this.selectedPiece, field);
        } else {
            this.boardService.unHeighlightAll();
            const piece = this.chessPieces.find(
                (piece) =>
                    piece.currentField === field &&
                    piece.color === this.turnColor
            );
            this.selectedPiece = piece;

            if (piece) {
                const moves = piece.getPossibleMoves();

                if (moves.ifNotBlocked) {
                    moves.ifNotBlocked.forEach((fieldId) => {
                        const field = this.boardService.getFieldById(fieldId);
                        if (field) {
                            const targetPiece = this.chessPieces.find(
                                (piece) => piece.currentField === field
                            );
                            if (!targetPiece) {
                                this.boardService.highlightField(field);
                            }
                        }
                    });
                }

                if (moves.ifHasAnEnemy) {
                    moves.ifHasAnEnemy.forEach((fieldId) => {
                        const field = this.boardService.getFieldById(fieldId);
                        if (field) {
                            const targetPiece = this.chessPieces.find(
                                (piece) => piece.currentField === field
                            );
                            if (
                                targetPiece &&
                                targetPiece.color !== piece.color
                            ) {
                                this.boardService.highlightField(field);
                            }
                        }
                    });
                }

                if (moves.ifNotBlockedByOwn) {
                    moves.ifNotBlockedByOwn.forEach((fieldId) => {
                        const field = this.boardService.getFieldById(fieldId);
                        if (field) {
                            const targetPiece = this.chessPieces.find(
                                (piece) => piece.currentField === field
                            );
                            if (
                                !targetPiece ||
                                targetPiece.color !== piece.color
                            ) {
                                this.boardService.highlightField(field);
                            }
                        }
                    });
                }

                if (moves.ifNotBlockedBefore) {
                    let isBlocked = false;
                    moves.ifNotBlockedBefore.forEach((fieldId) => {
                        const field = this.boardService.getFieldById(fieldId);
                        if (field && !isBlocked) {
                            const targetPiece = this.chessPieces.find(
                                (piece) => piece.currentField === field
                            );
                            if (targetPiece) {
                                isBlocked = true;
                            } else {
                                this.boardService.highlightField(field);
                            }
                        }
                    });
                }

                if (moves.untilIsBlocked) {
                    moves.untilIsBlocked.forEach((direction) => {
                        let blockedBefore = false;

                        direction.map((fieldId) => {
                            const field =
                                this.boardService.getFieldById(fieldId);
                            const targetPiece = this.chessPieces.find(
                                (piece) => piece.currentField === field
                            );

                            if (targetPiece && !blockedBefore) {
                                blockedBefore = true;

                                if (targetPiece.color !== piece.color) {
                                    this.boardService.highlightField(field);
                                }
                            } else {
                                if (!blockedBefore) {
                                    this.boardService.highlightField(field);
                                }
                            }
                        });

                        if (field) {
                            const targetPiece = this.chessPieces.find(
                                (piece) => piece.currentField === field
                            );
                            if (
                                !targetPiece ||
                                targetPiece.color !== piece.color
                            ) {
                                this.boardService.highlightField(field);
                            }
                        }
                    });
                }
            }
        }
    }

    public endTurn() {
        this.turnColor =
            this.turnColor === EChessPieceColors.light
                ? EChessPieceColors.dark
                : EChessPieceColors.light;
        this.turn.next(this.turnColor);
        if (this.turnColor === EChessPieceColors.light) {
            this.stageService.moveCamera(-3.5, 8, -12);
        } else {
            this.stageService.moveCamera(-3.5, 8, 20);
        }
    }

    public move(piece: ChessPiece, field: THREE.Mesh) {
        this.boardService.unHeighlightAll();

        const victim = this.chessPieces.find(
            (piece) => piece.currentField === field
        );

        const move: IMove = {
            color: piece.color,
            from: (piece.currentField.userData as IMeshFieldUserData).id || '',
            to: (field.userData as IMeshFieldUserData).id || '',
            piece: piece.type,
        };

        if (victim) {
            move.victim = victim;

            this.chessPieces = this.chessPieces.filter(
                (piece) => piece != victim
            );

            this.victims.push(victim);

            victim.mesh.position.x =
                victim.color === EChessPieceColors.dark ? 2 : -9;
            victim.mesh.position.z = Math.random() * 10;
        }

        this.$moves.push(move);
        this.moves.next(this.$moves);

        this.endTurn();

        piece.currentField = field;
        piece.dirty = true;
    }

    public undo(): void {
        const lastMove = this.$moves.pop();

        if (lastMove) {
            const current = this.boardService.getFieldById(lastMove.to);
            const piece = this.chessPieces.find(
                (piece) => piece.currentField === current
            );

            if (lastMove.victim) {
                this.chessPieces.push(lastMove.victim);
                lastMove.victim.dirty = true;
            }

            if (piece) {
                const origin = this.boardService.getFieldById(lastMove.from);
                piece.currentField = origin;
                piece.dirty = true;
            }

            this.moves.next(this.$moves);
            this.endTurn();
        }
    }

    public reset() {
        [...this.chessPieces, ...this.victims].forEach((piece) => {
            piece.mesh.geometry.dispose();
            this.stageService.scene.remove(piece.mesh);
        });

        this.chessPieces = [];
        this.$moves = [];
        this.moves.next(this.$moves);
        this.setChessPiecesStartFormation();
    }

    public setChessPiecesStartFormation() {
        this.columns.forEach((column) => {
            if (this.chessPieceMeshes) {
                this.chessPieces.push(
                    new PawnChessPiece(
                        this.chessPieceMeshes.Pawn.clone(),
                        this.boardService.getFieldById(column + 2),
                        EChessPieceColors.light
                    ),
                    new PawnChessPiece(
                        this.chessPieceMeshes.Pawn.clone(),
                        this.boardService.getFieldById(column + 7),
                        EChessPieceColors.dark
                    )
                );
            }
        });

        ['A', 'H'].forEach((column) => {
            if (this.chessPieceMeshes) {
                this.chessPieces.push(
                    new RookChessPiece(
                        this.chessPieceMeshes.Rook.clone(),
                        this.boardService.getFieldById(column + 1),
                        EChessPieceColors.light
                    ),
                    new RookChessPiece(
                        this.chessPieceMeshes.Rook.clone(),
                        this.boardService.getFieldById(column + 8),
                        EChessPieceColors.dark
                    )
                );
            }
        });

        ['B', 'G'].forEach((column) => {
            if (this.chessPieceMeshes) {
                this.chessPieces.push(
                    new KnightChessPiece(
                        this.chessPieceMeshes.Knight.clone(),
                        this.boardService.getFieldById(column + 1),
                        EChessPieceColors.light
                    ),
                    new KnightChessPiece(
                        this.chessPieceMeshes.Knight.clone(),
                        this.boardService.getFieldById(column + 8),
                        EChessPieceColors.dark
                    )
                );
            }
        });

        ['C', 'F'].forEach((column) => {
            if (this.chessPieceMeshes) {
                this.chessPieces.push(
                    new BishopChessPiece(
                        this.chessPieceMeshes.Bishop.clone(),
                        this.boardService.getFieldById(column + 1),
                        EChessPieceColors.light
                    ),
                    new BishopChessPiece(
                        this.chessPieceMeshes.Bishop.clone(),
                        this.boardService.getFieldById(column + 8),
                        EChessPieceColors.dark
                    )
                );
            }
        });

        if (this.chessPieceMeshes) {
            this.chessPieces.push(
                new QueenChessPiece(
                    this.chessPieceMeshes.Queen.clone(),
                    this.boardService.getFieldById('D1'),
                    EChessPieceColors.light
                ),
                new QueenChessPiece(
                    this.chessPieceMeshes.Queen.clone(),
                    this.boardService.getFieldById('D8'),
                    EChessPieceColors.dark
                )
            );

            this.chessPieces.push(
                new KingChessPiece(
                    this.chessPieceMeshes.King.clone(),
                    this.boardService.getFieldById('E1'),
                    EChessPieceColors.light
                ),
                new KingChessPiece(
                    this.chessPieceMeshes.King.clone(),
                    this.boardService.getFieldById('E8'),
                    EChessPieceColors.dark
                )
            );
        }

        this.chessPieces.forEach((piece) => {
            this.stageService.scene?.add(piece.mesh);
        });

        this.stageService.appendRenderFunction(() => {
            const dir = new THREE.Vector3();

            this.chessPieces.forEach((piece) => {
                if (piece.dirty) {
                    dir.subVectors(
                        piece.currentField.position,
                        piece.mesh.position
                    ).normalize();

                    if (dir.x > 0.01 || dir.x < 0.05) {
                        piece.mesh.position.x += 0.05 * dir.x;
                    }

                    if (dir.z > 0.01 || dir.z < 0.05) {
                        piece.mesh.position.z += 0.05 * dir.z;
                    }

                    if (
                        dir.z > 0.1 &&
                        dir.x > 0.1 &&
                        dir.z < 0.1 &&
                        dir.x < 0.1
                    ) {
                        piece.setMeshToField();
                        piece.dirty = false;
                    }
                }
            });
        });
    }
}
