import { EChessPiece, EChessPieceColors } from "src/enums/EChessPiece";
import { EMeshType } from "src/enums/EMeshType";

export interface IMeshUserData {
    type: EMeshType,
}

export interface IMeshFieldUserData extends IMeshUserData {
    id: string,
    color: string
}

export interface IMeshPieceUserData extends IMeshUserData {
    color: EChessPieceColors,
    chessPiece: EChessPiece,
    position: string
}