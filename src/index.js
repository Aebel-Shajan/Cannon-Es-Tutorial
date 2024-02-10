import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';


// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Setup
const scene = new THREE.Scene();
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
});
const cannonDebugger = new CannonDebugger(scene, world, {})


// Camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(30, 30, 30);
orbit.update();


// Objects
//  Box
const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.MeshBasicMaterial();
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);
const boxPhysMat = new CANNON.Material();
const boxBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    mass: 1,
    position: new CANNON.Vec3(0, 10, 0),
    material: boxPhysMat
});
world.addBody(boxBody);


// Sphere
const sphereGeo = new THREE.SphereGeometry(1);
const sphereMat = new THREE.MeshBasicMaterial({
    color: 0xff0000
});
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphereMesh);
const sphereBody = new CANNON.Body({
    shape: new CANNON.Sphere(1),
    mass: 5,
    position: new CANNON.Vec3(1, 5, 0)
})
world.addBody(sphereBody);
sphereBody.linearDamping = 0.5; // between 0 and 1

//  Ground
const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
})
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);
const groundPhysMat = new CANNON.Material();
const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC,
    material: groundPhysMat
})
groundBody.quaternion.setFromEuler(- Math.PI / 2, 0, 0);
world.addBody(groundBody)


// Contact material

const groundBoxContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    boxPhysMat,
    {friction: 0, restitution: 0.5}
)
world.addContactMaterial(groundBoxContactMat);

// Animation Loop
const timeStep = 1 / 60;
function animate() {
    world.step(timeStep);
    cannonDebugger.update()

    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);


// Resize renderer
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});