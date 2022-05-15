import { boardColumns } from 'src/constants/BoardColumns';
import { EChessPiece, EChessPieceColors } from 'src/enums/EChessPiece';
import { IPossibleMove } from 'src/interfaces/IPossibleMove';
import * as THREE from 'three';
import { ChessPiece } from './ChessPiece';

export class BishopChessPiece extends ChessPiece {
    public override type: EChessPiece = EChessPiece.Bishop;

    constructor(
        mesh: THREE.Mesh,
        currentField: THREE.Mesh,
        color: EChessPieceColors
    ) {
        super(mesh, currentField, color);
    }

    public override setMeshToField(): void {
        this.mesh.position.set(
            this.currentField.position.x,
            0.4,
            this.currentField.position.z
        );
    }

    public override getPossibleMoves(): IPossibleMove {
        const id = this.fieldData.id;
        const column = id.charAt(0);
        const columnIdx = boardColumns.indexOf(column);
        const row = id.charAt(1);

        const possibleMoves: IPossibleMove = {
            untilIsBlocked: [[], [], [], []],
        };

        if (possibleMoves.untilIsBlocked) {
            for (let i = 1; i < 8; i++) {
                if (parseInt(row) + i <= 8) {
                    if (columnIdx + i <= 7) {
                        possibleMoves.untilIsBlocked[0].push(
                            boardColumns[columnIdx + i] + (parseInt(row) + i)
                        );
                    }

                    if (columnIdx - i >= 0) {
                        possibleMoves.untilIsBlocked[1].push(
                            boardColumns[columnIdx - i] + (parseInt(row) + i)
                        );
                    }
                }

                if (parseInt(row) - i >= 0) {
                    if (columnIdx + i <= 7) {
                        possibleMoves.untilIsBlocked[2]?.push(
                            boardColumns[columnIdx + i] + (parseInt(row) - i)
                        );
                    }

                    if (columnIdx - i >= 0) {
                        possibleMoves.untilIsBlocked[3]?.push(
                            boardColumns[columnIdx - i] + (parseInt(row) - i)
                        );
                    }
                }
            }
        }

        return possibleMoves;
    }
}
