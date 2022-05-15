import { Injectable } from '@angular/core';
import { EMeshType } from 'src/enums/EMeshType';
import * as THREE from 'three';
import { Object3D } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Injectable({
    providedIn: 'root',
})
export class StageService {
    public scene = new THREE.Scene();
    public camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    public renderer?: THREE.WebGLRenderer;
    public control?: OrbitControls;
    public loader = new GLTFLoader();
    public raycaster = new THREE.Raycaster();
    public onRender: Array<() => void> = [];
    public targetCameraPosition?: THREE.Vector3;

    constructor() {}

    public get stageItems(): Array<Object3D<THREE.Event>> {
        return this.scene?.children || [];
    }

    public set stageItems(items: Array<THREE.Object3D<THREE.Event>>) {
        if (this.scene) {
            this.scene.add(...items);
        }
    }

    public appendRenderFunction(fnc: () => void): number {
        this.onRender.push(fnc);
        return this.onRender.length - 1;
    }

    public updateControl(): void {
        if (this.control) {
            this.control.update();
        }
    }

    public render() {
        requestAnimationFrame(() => {
            this.render();
        });

        if (this.renderer) {
            this.onRender.forEach((fnc) => fnc());
            this.renderer.render(this.scene, this.camera);
        }
    }

    private initControl(canvas: HTMLCanvasElement): OrbitControls | undefined {
        if (this.camera) {
            this.control = new OrbitControls(this.camera, canvas);
            this.control.target.set(-3.5, 0, 3.5);
            this.control.maxPolarAngle = Math.PI / 2.5;
            this.control.enableDamping = true;
            this.control.rotateSpeed = 0.1;
        }

        return this.control;
    }

    private initLights(): void {
        if (this.scene) {
            const light = new THREE.AmbientLight(0x404040); // soft white light
            light.intensity = 3;
            this.scene.add(light);

            const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
            dirLight.position.set(10, 20, 0); // x, y, z
            this.scene.add(dirLight);
        }
    }

    public getClickEventTargetField(
        event: MouseEvent
    ): THREE.Intersection<THREE.Object3D<THREE.Event>> | undefined {
        if (this.renderer) {
            const mouse = new THREE.Vector2(
                (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
                -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1
            );

            this.raycaster.setFromCamera(mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(
                this.scene.children
            );
            if (intersects.length > 0) {
                return intersects.find(
                    (intersect) =>
                        intersect.object.userData['type'] === EMeshType.Field
                );
            }
        }

        return undefined;
    }

    public moveCamera(x: number, y: number, z: number) {
        this.targetCameraPosition = new THREE.Vector3(x, y, z);
    }

    public init(canvas: HTMLCanvasElement): void {
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setClearColor(0xffffff, 0);

        this.camera.position.set(-3.5, 8, 12);
        this.camera.castShadow = true;

        //this.camera.rotateX(Math.PI);
        this.camera.position.set(-3.5, 8, -12);

        this.initControl(canvas);
        this.initLights();

        this.scene.fog = new THREE.FogExp2(0xaeaeae, 0.02);

        this.render();
    }
}
