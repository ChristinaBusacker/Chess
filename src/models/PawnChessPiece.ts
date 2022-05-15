import { boardColumns } from 'src/constants/BoardColumns';
import { EChessPiece, EChessPieceColors } from 'src/enums/EChessPiece';
import { IPossibleMove } from 'src/interfaces/IPossibleMove';
import * as THREE from 'three';
import { ChessPiece } from './ChessPiece';

export class PawnChessPiece extends ChessPiece {
    public override type: EChessPiece = EChessPiece.Pawn;

    constructor(
        mesh: THREE.Mesh,
        currentField: THREE.Mesh,
        color: EChessPieceColors
    ) {
        super(mesh, currentField, color);
    }

    public override getPossibleMoves(): IPossibleMove {
        const id = this.fieldData.id;
        const column = id.charAt(0);
        const row = id.charAt(1);
        const startposition = this.color === EChessPieceColors.light ? 2 : 7;

        const possibleMoves: IPossibleMove = {
            ifNotBlockedBefore: [
                column +
                    (parseInt(row) +
                        1 * (this.color === EChessPieceColors.light ? 1 : -1)),
            ],
            ifHasAnEnemy: [],
        };

        if (startposition === parseInt(row)) {
            possibleMoves?.ifNotBlockedBefore?.push(
                column +
                    (parseInt(row) +
                        2 * (this.color === EChessPieceColors.light ? 1 : -1))
            );
        }

        const columnIdx = boardColumns.indexOf(column);

        if (columnIdx > 0) {
            possibleMoves?.ifHasAnEnemy?.push(
                boardColumns[columnIdx - 1] +
                    (parseInt(row) +
                        1 * (this.color === EChessPieceColors.light ? 1 : -1))
            );
        }

        if (columnIdx < 7) {
            possibleMoves?.ifHasAnEnemy?.push(
                boardColumns[columnIdx + 1] +
                    (parseInt(row) +
                        1 * (this.color === EChessPieceColors.light ? 1 : -1))
            );
        }

        return possibleMoves;
    }
}
