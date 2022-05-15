import * as THREE from 'three';

export const fieldColor = {
    light: new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        wireframe: true,
        wireframeLinewidth: 30,
    }),
    dark: new THREE.MeshBasicMaterial({ color: 0x351301 }),
};
