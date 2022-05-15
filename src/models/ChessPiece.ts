import { EChessPiece, EChessPieceColors } from 'src/enums/EChessPiece';
import { IMeshFieldUserData } from 'src/interfaces/IMeshUserData';
import { IPossibleMove } from 'src/interfaces/IPossibleMove';
import * as THREE from 'three';

export class ChessPiece {
    public dirty: boolean = false;
    public type = EChessPiece.Default;

    constructor(
        public mesh: THREE.Mesh,
        public currentField: THREE.Mesh,
        public color: EChessPieceColors
    ) {
        this.setMeshToField();
        this.setMaterial();

        if (this.color === EChessPieceColors.dark) {
            this.mesh.rotateY(Math.PI);
        }
    }

    protected get fieldData(): IMeshFieldUserData {
        return this.currentField.userData as IMeshFieldUserData;
    }

    private setMaterial(): void {
        switch (this.color) {
            case EChessPieceColors.light:
                this.mesh.material = new THREE.MeshPhongMaterial({
                    color: 0xcecece,
                    shininess: 100,
                });
                break;
            case EChessPieceColors.dark:
                this.mesh.material = new THREE.MeshPhongMaterial({
                    color: 0x222222,
                    shininess: 100,
                });
                break;
        }
    }

    public setMeshToField(): void {
        this.mesh.position.set(
            this.currentField.position.x,
            0.3,
            this.currentField.position.z
        );
    }

    public getPossibleMoves(): IPossibleMove {
        return {};
    }
}
