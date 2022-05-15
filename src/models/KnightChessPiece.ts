import { boardColumns } from 'src/constants/BoardColumns';
import { EChessPiece, EChessPieceColors } from 'src/enums/EChessPiece';
import { IPossibleMove } from 'src/interfaces/IPossibleMove';
import * as THREE from 'three';
import { ChessPiece } from './ChessPiece';

export class KnightChessPiece extends ChessPiece {
    public override type: EChessPiece = EChessPiece.Knight;

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
            0.1,
            this.currentField.position.z
        );
    }

    public override getPossibleMoves(): IPossibleMove {
        const id = this.fieldData.id;
        const column = id.charAt(0);
        const columnIdx = boardColumns.indexOf(column);
        const row = id.charAt(1);

        const possibleMoves: IPossibleMove = {
            ifNotBlockedByOwn: [],
        };

        if (parseInt(row) > 2) {
            if (columnIdx > 0) {
                possibleMoves.ifNotBlockedByOwn?.push(
                    boardColumns[columnIdx - 1] + (parseInt(row) - 2)
                );
            }
            if (columnIdx < 7) {
                possibleMoves.ifNotBlockedByOwn?.push(
                    boardColumns[columnIdx + 1] + (parseInt(row) - 2)
                );
            }
        }

        if (parseInt(row) < 7) {
            if (columnIdx > 0) {
                possibleMoves.ifNotBlockedByOwn?.push(
                    boardColumns[columnIdx - 1] + (parseInt(row) + 2)
                );
            }
            if (columnIdx < 7) {
                possibleMoves.ifNotBlockedByOwn?.push(
                    boardColumns[columnIdx + 1] + (parseInt(row) + 2)
                );
            }
        }

        if (columnIdx >= 1) {
            if (parseInt(row) > 1) {
                possibleMoves.ifNotBlockedByOwn?.push(
                    boardColumns[columnIdx + 2] + (parseInt(row) - 1)
                );
            }
            if (parseInt(row) < 8) {
                possibleMoves.ifNotBlockedByOwn?.push(
                    boardColumns[columnIdx + 2] + (parseInt(row) + 1)
                );
            }
        }

        if (columnIdx < 7) {
            if (parseInt(row) > 1) {
                possibleMoves.ifNotBlockedByOwn?.push(
                    boardColumns[columnIdx - 2] + (parseInt(row) - 1)
                );
            }
            if (parseInt(row) < 8) {
                possibleMoves.ifNotBlockedByOwn?.push(
                    boardColumns[columnIdx - 2] + (parseInt(row) + 1)
                );
            }
        }

        return possibleMoves;
    }
}
