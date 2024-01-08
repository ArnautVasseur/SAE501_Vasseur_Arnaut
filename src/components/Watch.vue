<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import * as THREE from 'three'
const canvas = ref(null)
var controls = null
var clock = new THREE.Clock();
let scene = null
let camera = null
let cube = null
let renderer = null
let animationId = null

const initScene = () => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({color: 0x00FF00})
  cube = new THREE.Mesh(geometry, material)
  cube.position.x = 1
  cube.position.y = -1

  cube.rotation.x = 2 
  
  // scene.add(cube)

  camera.position.z=1

  renderer = new THREE.WebGLRenderer({canvas: canvas.value})
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x222222,1);
  controls = new OrbitControls(camera,renderer.domElement);
  var pointLight = new THREE.PointLight(0xffffff,1);
  		pointLight.position.set(0, 1, 0);

	scene.add(pointLight);
  clock.start();
  var loader = new ColladaLoader();
  loader.load('/models/montre.dae', onLoaded, onProgress, onError );
}
const animate = () => {
  let dt=clock.getDelta();
  // console.log('animation is running')
  animationId = requestAnimationFrame(animate)
  // cube.rotation.x += 0.1
  renderer.render(scene, camera)
  // animations.forEach(object => { // mettre à jour l'animation sur tous les objects cliquables
  //     object.updateAnimation(dt);
  //   });
}

 function onLoaded(collada) {
	  let objects = collada.scene;
      scene.add(objects);
    let dt = clock.getElapsedTime();
    console.log("Loading completed after "+dt+" s.");
  }

var onProgress = function(data) {
  	if ( data.lengthComputable ) {
  			var percentComplete = data.loaded / data.total * 100;
  			console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
		}
	};

	var onError = function(data) {
		console.error(data);
	};

const onClick = () => {
    console.log('document cliqué')
}

onMounted(() => {
  initScene()
  animate()
document.addEventListener('click', onClick)
})

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
    document.removeEventListener('click', onClick)
})

</script>
    
<template>
    <div>
        <canvas ref="canvas"/>
    </div>
</template>
