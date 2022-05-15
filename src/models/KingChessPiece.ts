import { boardColumns } from 'src/constants/BoardColumns';
import { EChessPiece, EChessPieceColors } from 'src/enums/EChessPiece';
import { IPossibleMove } from 'src/interfaces/IPossibleMove';
import * as THREE from 'three';
import { ChessPiece } from './ChessPiece';

export class KingChessPiece extends ChessPiece {
    public override type: EChessPiece = EChessPiece.King;

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
            0.45,
            this.currentField.position.z
        );
    }

    public override getPossibleMoves(): IPossibleMove {
        const id = this.fieldData.id;
        const column = id.charAt(0);
        const columnIdx = boardColumns.indexOf(column);
        const row = parseInt(id.charAt(1));

        const possibleMoves: IPossibleMove = {
            ifNotBlocked: [],
        };

        if (columnIdx > 0) {
            possibleMoves.ifNotBlocked?.push(boardColumns[columnIdx - 1] + row);

            if (row > 1) {
                possibleMoves.ifNotBlocked?.push(
                    boardColumns[columnIdx - 1] + (row - 1)
                );
            }

            if (row < 8) {
                possibleMoves.ifNotBlocked?.push(
                    boardColumns[columnIdx - 1] + (row + 1)
                );
            }
        }

        if (columnIdx < 7) {
            possibleMoves.ifNotBlocked?.push(boardColumns[columnIdx + 1] + row);

            if (row > 1) {
                possibleMoves.ifNotBlocked?.push(
                    boardColumns[columnIdx + 1] + (row - 1)
                );
            }

            if (row < 8) {
                possibleMoves.ifNotBlocked?.push(
                    boardColumns[columnIdx + 1] + (row + 1)
                );
            }
        }

        if (row > 1) {
            possibleMoves.ifNotBlocked?.push(
                boardColumns[columnIdx] + (row - 1)
            );
        }

        if (row < 8) {
            possibleMoves.ifNotBlocked?.push(
                boardColumns[columnIdx] + (row + 1)
            );
        }

        return possibleMoves;
    }
}
