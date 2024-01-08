<template>
  <div ref="scene"></div>
</template>

<script>
import * as THREE from 'three';

export default {
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // Create a scene
      const scene = new THREE.Scene();

      // Create a camera
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      // Create a renderer
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      this.$refs.scene.appendChild(renderer.domElement);

      // Create a cube
      const geometry = new THREE.BoxGeometry();
      // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      // const cube = new THREE.Mesh(geometry, material);
      var aiguilles;
      aiguilles = object.getObjectByName("aiguilles");

      // Add the cube to the scene
      // scene.add(cube);

      // Animation
      const animate = () => {
        requestAnimationFrame(animate);

        // Rotate the cube
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        // Render the scene
        renderer.render(scene, camera);
      };

      // Start the animation
      animate();
    },
  },
};
</script>

<style scoped>
#scene {
  width: 100%;
  height: 100vh;
}
</style>
