import { EChessPiece, EChessPieceColors } from 'src/enums/EChessPiece';
import { ChessPiece } from 'src/models/ChessPiece';

export interface IMove {
    color: EChessPieceColors;
    piece: EChessPiece;
    from: string;
    to: string;
    victim?: ChessPiece;
}
