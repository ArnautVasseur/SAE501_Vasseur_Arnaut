<template>
  <div>
    <h1>Edit Watch</h1>
    <form @submit.prevent="updateWatch">
      <label for="boitier">Boitier Texture:</label>
      <select v-model="selectedBoitier" id="boitier">
        <option v-for="boitier in boitiers" :key="boitier.boitierID" :value="boitier.texture">
          {{ boitier.texture }}
        </option>
      </select>

      <label for="pierre">Pierre Nom:</label>
      <select v-model="selectedPierre" id="pierre">
        <option v-for="pierre in pierres" :key="pierre.pierreID" :value="pierre.nom">
          {{ pierre.nom }}
        </option>
      </select>

      <label for="bracelet">Bracelet Texture:</label>
      <select v-model="selectedBracelet" id="bracelet">
        <option v-for="bracelet in bracelets" :key="bracelet.braceletID" :value="bracelet.texture">
          {{ bracelet.texture }}
        </option>
      </select>

      <button type="submit">Update Watch</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['watchID'],
  data() {
    return {
      selectedBoitier: '',
      selectedPierre: '',
      selectedBracelet: '',
      boitiers: [],
      pierres: [],
      bracelets: []
    };
  },
  methods: {
    updateWatch() {
      const data = {
        BoitierID: { texture: this.selectedBoitier },
        PierreID: { nom: this.selectedPierre },
        BraceletID: { texture: this.selectedBracelet }
      };

      // Make the HTTP request to update the watch
      axios.put(`http://localhost:3000/modification/${this.watchID}`, data)
        .then(response => {
          console.log(response.data.message);
          // Handle success
        })
        .catch(error => {
          console.error('Error updating watch:', error);
          // Handle error
        });
    },
    fetchBoitiers() {
      // Fetch Boitier data from the server
      axios.get('http://localhost:3000/boitier') // Replace with the actual API endpoint for Boitier data
        .then(response => {
          this.boitiers = response.data;
        })
        .catch(error => {
          console.error('Error fetching Boitier data:', error);
        });
    },
    fetchPierres() {
      // Fetch Pierre data from the server
      axios.get('http://localhost:3000/pierre') // Replace with the actual API endpoint for Pierre data
        .then(response => {
          this.pierres = response.data;
        })
        .catch(error => {
          console.error('Error fetching Pierre data:', error);
        });
    },
    fetchBracelets() {
      // Fetch Bracelet data from the server
      axios.get('http://localhost:3000/bracelet') // Replace with the actual API endpoint for Bracelet data
        .then(response => {
          this.bracelets = response.data;
        })
        .catch(error => {
          console.error('Error fetching Bracelet data:', error);
        });
    }
  },
  mounted() {
    // Fetch data when the component is mounted
    this.fetchBoitiers();
    this.fetchPierres();
    this.fetchBracelets();
  }
};
</script>
