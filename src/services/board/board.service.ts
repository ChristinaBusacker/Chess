import { Injectable } from '@angular/core';
import { boardColumns } from 'src/constants/BoardColumns';
import { EChessPieceColors } from 'src/enums/EChessPiece';
import { EMeshType } from 'src/enums/EMeshType';
import { IMeshFieldUserData } from 'src/interfaces/IMeshUserData';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { StageService } from '../stage/stage.service';

@Injectable({
    providedIn: 'root',
})
export class BoardService {
    public darkTexture?: THREE.Texture;
    public lightTexture?: THREE.Texture;
    public highlighted: Array<THREE.Mesh> = [];

    constructor(private stageService: StageService) {}

    public createBoard() {
        const tileset = new THREE.Group();
        const geometry = new THREE.BoxGeometry(1, 0.1, 1);

        for (let x = 0; x < 8; x++) {
            for (let z = 0; z < 8; z++) {
                let field;
                let color;
                if (z % 2 === 0) {
                    field = new THREE.Mesh(
                        geometry,
                        x % 2 !== 0
                            ? this.generateLightMaterial()
                            : this.generateDarkMaterial()
                    );
                    color =
                        x % 2 !== 0
                            ? EChessPieceColors.light
                            : EChessPieceColors.dark;
                } else {
                    field = new THREE.Mesh(
                        geometry,
                        x % 2 !== 0
                            ? this.generateDarkMaterial()
                            : this.generateLightMaterial()
                    );
                    color =
                        x % 2 !== 0
                            ? EChessPieceColors.dark
                            : EChessPieceColors.light;
                }
                field.position.add(new THREE.Vector3(x * -1, 0, z));

                field.userData = {
                    type: EMeshType.Field,
                    id: boardColumns[x] + (z + 1),
                    color: color,
                };

                field.name = 'field_' + boardColumns[x] + (z + 1);

                tileset.add(field);
            }
        }

        tileset.name = 'tileset';

        this.stageService.stageItems = [tileset];

        const board = new THREE.Mesh(
            new THREE.BoxGeometry(9, 0.1, 9),
            new THREE.MeshBasicMaterial({ color: 0x003555 })
        );

        board.userData = {
            type: EMeshType.Board,
        };

        board.position.add(new Vector3(-3.5, -0.1, 3.5));
        this.stageService.stageItems = [board];

        this.stageService.control?.update();
    }

    public highlightField(field: THREE.Mesh): void {
        if (field) {
            field.material = new THREE.MeshPhongMaterial({ color: 0x00aeae });

            this.highlighted.push(field);
        }
    }

    public unHighlightField(field: THREE.Mesh): void {
        const color = (field.userData as IMeshFieldUserData).color;

        if (color === EChessPieceColors.light) {
            field.material = this.generateLightMaterial();
        } else {
            field.material = this.generateDarkMaterial();
        }

        this.highlighted = this.highlighted.filter(
            (hfield) => hfield !== field
        );
    }

    public unHeighlightAll(): void {
        this.highlighted.forEach((field: THREE.Mesh) => {
            const color = (field.userData as IMeshFieldUserData).color;
            if (color === EChessPieceColors.light) {
                field.material = this.generateLightMaterial();
            } else {
                field.material = this.generateDarkMaterial();
            }
        });

        this.highlighted = [];
    }

    public isHighlighted(field: THREE.Mesh): boolean {
        return this.highlighted.includes(field);
    }

    public get fields(): THREE.Object3D<THREE.Event> | undefined {
        return this.stageService.scene?.getObjectByName('tileset') || undefined;
    }

    getFieldById(id: string): THREE.Mesh {
        return this.fields?.children.find(
            (field) => field.userData['id'] === id
        ) as THREE.Mesh;
    }

    public getFieldPosition(id: string): THREE.Vector3 {
        const x = boardColumns.indexOf(id.charAt(0));
        const z = parseInt(id.charAt(1)) - 1;

        return new THREE.Vector3(x, 0.3, z);
    }

    public async loadTextures() {
        this.darkTexture = await new THREE.TextureLoader().loadAsync(
            '../../assets/dark-2-texture.jpg'
        );
        this.lightTexture = await new THREE.TextureLoader().loadAsync(
            '../../assets/light-2-texture.jpg'
        );
    }

    public generateLightMaterial(): THREE.MeshPhongMaterial {
        const texture = this.lightTexture?.clone();

        if (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.offset = new THREE.Vector2(
                Math.floor(Math.random() * 100),
                Math.floor(Math.random() * 100)
            );
            const flip = Math.random() > 0.5;
            texture.flipY = flip;
            texture.repeat.set(0.6, 0.6);
        }

        return new THREE.MeshPhongMaterial({
            map: texture,
            opacity: 0.9,
            transparent: true,
        });
    }

    public generateDarkMaterial(): THREE.MeshPhongMaterial {
        const texture = this.darkTexture?.clone();

        if (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.offset = new THREE.Vector2(
                Math.floor(Math.random() * 1000),
                Math.floor(Math.random() * 1000)
            );
            const flip = Math.random() > 0.5;
            texture.flipY = flip;
            texture.repeat.set(0.2, 0.2);
        }

        return new THREE.MeshPhongMaterial({ map: texture });
    }

    public async initBoard() {
        await this.loadTextures();
        this.createBoard();
    }
}
