import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(20, 0, 20);
orbit.update();

const groundGeo = new THREE.PlaneGeometry(10, 10);
const groundMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
})
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
});

const timeStep = 1 / 60;

function animate() {
    world.step(timeStep)
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});