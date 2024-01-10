<template>
  <div>
    <h1 class="m-5">Votre Panier</h1>
    <div v-if="cart" class="border m-5 p-3 flex flex-col gap-3">
      <p>Nombre de montres dans le panier: {{ cart.montreCount }}</p>
      <ul>
        <li class="border p-3" v-for="watchItem in watch" :key="watchItem.montreID">
          <p>Id de la montre = {{ watchItem.montreID }}</p>
          <p>Forme du boitier = {{ watchItem.boitier_nom }}</p>
          <p>Texture boitier = {{ watchItem.boitier_texture }}</p>
          <p>Ornement pierres = {{ watchItem.pierre_nom }}</p>
          <p>Texture du bracelet = {{ watchItem.bracelet_texture }}</p>
        </li>
      </ul>
    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['id'],
  data() {
    return {
      cart: null,
      watch: null
    };
  },
  mounted() {
    // Use Promise.all to make multiple axios.get requests concurrently
    Promise.all([
      axios.get(`http://localhost:3000/panier/${this.id}`),
      // Add more axios.get requests here if needed
    ])
      .then(responses => {
        // Extract data from each response
        this.cart = responses[0].data;
        this.watch = responses[0].data.montreData
      })
      .catch(error => {
        console.error('Error fetching data:', error.message);
      });
  },
};
</script>
