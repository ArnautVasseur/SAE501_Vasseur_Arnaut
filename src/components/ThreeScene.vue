<template>
  <div>
    <canvas ref="canvas" />
    <div class="mt-2">
      <div>
        <h2 class="font-bold">Texture du Bracelet :</h2>
      </div>
      <div class="flex gap-2">
        <button
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          @click="changeTexture('texture-cuir-blanc.jpg')"
        >
          Cuir Blanc
        </button>
        <button
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          @click="changeTexture('texture-tissus-or.jpg')"
        >
          Tissu Or
        </button>
        <button
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          @click="changeTexture('texture-tissus-marron.jpg')"
        >
          Tissu Marron
        </button>
      </div>
    </div>
    <div class="mt-2">
      <div>
        <h2 class="font-bold">Texture du Boitier Rond</h2>
      </div>
      <div class="flex gap-2">
        <button
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          @click="changeTextureBoitierRond('background_black01.png')"
        >
          Black 01
        </button>
        <button
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          @click="changeTextureBoitierRond('background_black02.png')"
        >
          Black 02
        </button>
        <button
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          @click="changeTextureBoitierRond('background_fluo01.png')"
        >
          Fluo
        </button>
        <button
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          @click="changeTextureBoitierRond('background_mickey.png')"
        >
          Mickey
        </button>
        <button
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          @click="changeTextureBoitierRond('background_white01.png')"
        >
          White 01
        </button>
        <button
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          @click="changeTextureBoitierRond('background_white02.png')"
        >
          White 02
        </button>
        <button
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          @click="changeTextureBoitierRond('background_white03.png')"
        >
          White 03
        </button>
        <button
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          @click="changeTextureBoitierRond('background_white04.png')"
        >
          White 04
        </button>
        <button
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          @click="changeTextureBoitierRond('background_white05.png')"
        >
          White 05
        </button>
      </div>
    </div>
    <div class="flex gap-2 my-2">
      <div>
        <h2 class="font-bold">Couleur du Fermoir</h2>
      </div>
      <input type="color" @input="handleColorChange" />
    </div>
    <div class="mt-2">
      <div>
        <h2 class="font-bold">Type de Pierre Précieuse</h2>
      </div>
      <div class="flex gap-2">
        <button
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          @click="changePierreColor('rubis')"
        >
          Rubis
        </button>
        <button
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          @click="changePierreColor('diamant')"
        >
          Diamant
        </button>
        <button
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          @click="changePierreColor('émeraude')"
        >
          Émeraude
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";
import * as THREE from "three";
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
  iPierre2,
  iBracelet,
  iFermoir,
  iBouton;

let currentTexture = "texture-cuir-blanc.jpg";
let currentTextureBoitierRond = "background_black01.png";

const initScene = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value });
  renderer.setSize(1300, 700);
  renderer.setClearColor(0x222222, 1);
  controls = new OrbitControls(camera, renderer.domElement);

  var loader = new ColladaLoader();
  loader.load("/models/montre.dae", onLoaded, onProgress, onError);
};

const updateClockHands = () => {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hoursRotation = (hours + minutes / 60) * (Math.PI / 6);
  const minutesRotation = (minutes + seconds / 60) * (Math.PI / 30);
  const secondsRotation = seconds * (Math.PI / 30);

  if (aiguilleHeures) aiguilleHeures.rotation.z = -hoursRotation;
  if (aiguilleMinutes) aiguilleMinutes.rotation.z = -minutesRotation;
  if (aiguilleSecondes) aiguilleSecondes.rotation.z = -secondsRotation;
};

const animate = () => {
  let dt = clock.getDelta();
  updateClockHands();
  animationId = requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

const changePierreColor = (type) => {
  let color;

  switch (type) {
    case "rubis":
      color = 0xff0000; // Rouge
      break;
    case "diamant":
      color = 0x0000ff; // Bleu
      break;
    case "émeraude":
      color = 0x00ff00; // Vert
      break;
    default:
      color = 0xffffff; // Blanc par défaut
  }

  if (iPierre) iPierre.material.color.set(color);
};

const handleColorChange = (event) => {
  const newColor = event.target.value;
  changeFermoirColor(newColor);
};
const changeFermoirColor = (color) => {
  // Convertir la couleur hexadécimale en décimal
  const decimalColor = parseInt(color.slice(1), 16);

  // Mettre à jour la couleur du matériau iFermoir
  if (iFermoir) iFermoir.material.color.set(decimalColor);
};

const changeTexture = (texture) => {
  currentTexture = texture;
  // Charger la nouvelle texture et l'appliquer au matériau du bracelet
  const textureLoader = new TextureLoader();
  const newTexture = textureLoader.load(`public/images/${texture}`);
  iBracelet.material.map = newTexture;
  iBracelet.material.needsUpdate = true;
};
const changeTextureBoitierRond = (textureBoitierRond) => {
  currentTextureBoitierRond = textureBoitierRond;
  // Charger la nouvelle texture et l'appliquer au matériau du bracelet
  const textureLoader = new TextureLoader();
  const newTexture = textureLoader.load(`public/images/${textureBoitierRond}`);
  boitierRond.material.map = newTexture;
  boitierRond.material.needsUpdate = true;
};

function onLoaded(collada) {
  let objects = collada.scene;

  aiguilleHeures = objects.getObjectByName("aiguille_heures");
  aiguilleHeures.material = new THREE.MeshBasicMaterial({
    color: 0xf0f0f0,
  });
  aiguilleMinutes = objects.getObjectByName("aiguille_minutes");
  aiguilleMinutes.material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  aiguilleSecondes = objects.getObjectByName("aiguille_secondes");
  aiguilleSecondes.material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
  });

  boitierRond = objects.getObjectByName("boitier_rond");
  // boitierRond.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const textureLoaderBoitierRond = new TextureLoader();
  const textureBoitierRond = textureLoaderBoitierRond.load(
    `public/images/${currentTextureBoitierRond}`
  );
  boitierRond.material = new THREE.MeshBasicMaterial({
    map: textureBoitierRond,
  });

  boitierCarre = objects.getObjectByName("boitier_carre");
  boitierCarre.material = new THREE.MeshBasicMaterial({ color: 0x00ffff });

  iBouton = objects.getObjectByName("bouton");
  iBouton.material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });

  iPierre = objects.getObjectByName("pierre");
  iPierre.material = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
  });

  let iPierre2 = iPierre.clone();
  iPierre2.position.y -= 38;

  let iPierre3 = iPierre.clone();
  iPierre3.position.x -= 18.5;
  iPierre3.position.y -= 18.75;

  let iPierre4 = iPierre.clone();
  iPierre4.position.x += 18.5;
  iPierre4.position.y -= 18.75;

  iBracelet = objects.getObjectByName("bracelet");
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load(`public/images/${currentTexture}`);
  iBracelet.material = new THREE.MeshBasicMaterial({ map: texture });

  iFermoir = objects.getObjectByName("fermoir");
  iFermoir.material = new THREE.MeshBasicMaterial({
    color: 0x000000,
  });

  scene.add(
    aiguilleHeures,
    aiguilleMinutes,
    aiguilleSecondes,
    // boitierCarre,
    boitierRond,
    iBouton,
    iPierre,
    iPierre2,
    iPierre3,
    iPierre4,
    iBracelet,
    iFermoir
  );

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