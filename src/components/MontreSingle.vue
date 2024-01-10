<template>
  <div>
    <h1 class="m-5">Détails des montres</h1>
    <!-- Display details for the selected watch using the id parameter -->
    <div v-if="watch" class="border m-5 p-3 flex flex-col gap-3">
      <p>Id de la montre = {{ montres.montreID }}</p>
      <p>Id du boitier = {{ montres.boitierID }}</p>
      <p>Forme du boitier = {{ watch.boitier_nom }}</p>
      <p>Texture boitier = {{ watch.boitier_texture }}</p>
      <p>Id de l'ornement = {{ montres.pierreID }}</p>
      <p>Ornement pierres = {{ watch.pierre_nom }}</p>
      <p>Id du bracelet = {{ montres.braceletID }}</p>
      <p>Texture du bracelet = {{ watch.bracelet_texture }}</p>
    </div>
    <div v-else>
      Loading...
    </div>

    <!-- Edit form -->
    <form @submit.prevent="modifierMontre" method="put" class="flex flex-col gap-3 m-5">
      <!-- Add your form fields here -->
      <label for="boitier">Boitier:</label>
      <select v-model="montres.boitierID" id="boitier" name="boitier" class="w-[350px]">
        <option v-for="boitier in boitiers" :key="boitier.boitierID" :value="boitier.nom">
          {{ boitier.nom }}  /  {{ boitier.texture }}  /  {{ boitier.prix }}€
        </option>
      </select>

      <label for="pierre">Ornement de pierres:</label>
      <select v-model="montres.pierreID" id="pierre" name="pierre" class="w-[175px]">
        <option v-for="pierre in pierres" :key="pierre.pierreID" :value="pierre.nom">
          {{ pierre.nom }} / {{ pierre.prix }}€
        </option>
      </select>

      <label for="bracelet">Texture de bracelet:</label>
      <select v-model="montres.braceletID" id="bracelet" name="bracelet" class="w-[250px]">
        <option v-for="bracelet in bracelets" :key="bracelet.braceletID" :value="bracelet.texture">
          {{ bracelet.texture }} / {{ bracelet.prix }}€
        </option>
      </select>

      <button type="submit" class="border p-5 m-3">Enregistrer les Modifications</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  props: ['id'],
  data() {
    return {
      watch : [],
      montres : [],
      boitiers : [],
      pierres : [],
      bracelets : []
    };
  },
  mounted() {
    // Use Promise.all to make multiple axios.get requests concurrently
    Promise.all([
      axios.get(`http://localhost:3000/montres/${this.id}`),
      axios.get(`http://localhost:3000/rawmontres/${this.id}`),
      axios.get(`http://localhost:3000/boitier`),
      axios.get(`http://localhost:3000/pierre`),
      axios.get(`http://localhost:3000/bracelet`),
      // Add more axios.get requests here
    ])
      .then(responses => {
        // Extract data from each response
        this.watch = responses[0].data[0];
        this.montres = responses[1].data[0];
        this.boitiers = responses[2].data;
        this.pierres = responses[3].data;
        this.bracelets = responses[4].data;
      })
      .catch(error => {
        console.error('Error fetching data:', error.message);
      });
  },
  methods: {
    modifierMontre() {
      // Add logic to handle form submission
    },
  },
};
</script>
