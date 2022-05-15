import * as THREE from "three"

export interface IChessPieceMeshCollection {
    King: THREE.Mesh,
    Queen: THREE.Mesh,
    Rook: THREE.Mesh,
    Bishop: THREE.Mesh,
    Knight: THREE.Mesh,
    Pawn: THREE.Mesh
}