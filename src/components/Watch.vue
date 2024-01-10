<template>
  <div>
    <canvas ref="canvas" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";
import * as THREE from "three";

// Ajoutez cette ligne pour charger des textures
import { TextureLoader } from "three/src/loaders/TextureLoader.js";

const canvas = ref(null);
let controls = null;
let clock = new THREE.Clock();
let scene = null;
let camera = null;
let renderer = null;
let animationId = null;
let aiguilleHeures,
  aiguilleMinutes,
  aiguilleSecondes,
  boitierRond,
  boitierCarre,
  iPierre,
  iBracelet,
  iFermoir,
  iBouton;

const initScene = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value });
  renderer.setSize(800, 500);
  renderer.setClearColor(0x222222, 1);
  controls = new OrbitControls(camera, renderer.domElement);

  var loader = new ColladaLoader();
  loader.load("/models/montre.dae", onLoaded, onProgress, onError);
};

const updateClockHands = () => {
  const now = new Date();
  const hours = now.getHours() % 12; // Convertir en format 12 heures
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Rotation des aiguilles en radians
  const hoursRotation = (hours + minutes / 60) * (Math.PI / 6);
  const minutesRotation = (minutes + seconds / 60) * (Math.PI / 30);
  const secondsRotation = seconds * (Math.PI / 30);

  // Appliquer la rotation aux objets des aiguilles
  if (aiguilleHeures) aiguilleHeures.rotation.z = -hoursRotation;
  if (aiguilleMinutes) aiguilleMinutes.rotation.z = -minutesRotation;
  if (aiguilleSecondes) aiguilleSecondes.rotation.z = -secondsRotation;
};

const animate = () => {
  let dt = clock.getDelta();
  updateClockHands(); // Mettre à jour la rotation des aiguilles
  animationId = requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

function onLoaded(collada) {
  let objects = collada.scene;

  // Récupérez les objets des aiguilles
  aiguilleHeures = objects.getObjectByName("aiguille_heures");
  aiguilleHeures.material = new THREE.MeshBasicMaterial({
    color: 0xf0f0f0,
  });
  aiguilleMinutes = objects.getObjectByName("aiguille_minutes");
  aiguilleMinutes.material = new THREE.MeshBasicMaterial({
    color: 0x0f0f0f,
  });
  aiguilleSecondes = objects.getObjectByName("aiguille_secondes");
  aiguilleSecondes.material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
  });

  const textureLoader = new TextureLoader();
  const textureboitier1 = textureLoader.load("/images/background_white01.png");

  const boitierRond = objects.getObjectByName("boitier_rond");
  boitierRond.material = new THREE.MeshBasicMaterial({ map: textureboitier1 });

  // const textureboitier2 = textureLoader.load("/images/background_mickey.png");

  // const boitierCarre = objects.getObjectByName("boitier_carre");
  // boitierCarre.material = new THREE.MeshBasicMaterial({ map: textureboitier2 });

  const iBouton = objects.getObjectByName("bouton");
  iBouton.material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
  });

  const iPierre = objects.getObjectByName("pierre");
  iPierre.material = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
  });

  const iBracelet = objects.getObjectByName("bracelet");
  // Utilisez THREE.TextureLoader pour charger la texture
  
  const texture = textureLoader.load("/images/texture-tissus-marron.jpg");

  // Appliquez la texture au matériau de l'objet "bracelet"
  iBracelet.material = new THREE.MeshBasicMaterial({ map: texture });

  const iFermoir = objects.getObjectByName("fermoir");
  iFermoir.material = new THREE.MeshBasicMaterial({
    color: 0xf000ff,
  });
  // Ajoutez les objets des aiguilles à la scène
  scene.add(
    aiguilleHeures,
    aiguilleMinutes,
    aiguilleSecondes,
    boitierCarre,
    boitierRond,
    iPierre,
    iBracelet,
    iFermoir,
    iBouton
  );

  // ... (ajoutez le reste de votre code pour charger le modèle)

  // Mettez à jour la position initiale de la caméra
  controls.target.set(0, 0, 0);
  camera.position.set(0, 0, 100);
  controls.update();
}

var onProgress = function (data) {
  if (data.lengthComputable) {
    var percentComplete = (data.loaded / data.total) * 100;
    console.log(Math.round(percentComplete, 2) + "% downloaded");
  }
};

var onError = function (data) {
  console.error(data);
};

onMounted(() => {
  initScene();
  animate();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
});
</script>