<template>
  <div>
    <h1 class="m-5">Watch List</h1>
    
    <div class="border p-3 m-5">
      <div class="m-5 flex gap-5">
        <label for="BoitierNom">Choisir la texture du boitier</label>
        <select name="BoitierNom" v-model="boitierTextureFilter" id="boitierTextureFilter">
          <option v-for="boitier in boitiers" :key="boitier.boitierID" :value="boitier.texture">
            {{ boitier.texture }}
          </option>
        </select>

        <label for="PierreNom">Choisir l'ornement de pierres</label>
        <select name="PierreNom" v-model="pierreNomFilter" id="pierreNomFilter">
          <option v-for="pierre in pierres" :key="pierre.pierreID" :value="pierre.nom">
            {{ pierre.nom }}
          </option>
        </select>

        <label for="BraceletNom">Choisir la texture du bracelet</label>
        <select name="BraceletNom" v-model="braceletTextureFilter" id="braceletTextureFilter">
          <option v-for="bracelet in bracelets" :key="bracelet.braceletID" :value="bracelet.texture">
            {{ bracelet.texture }}
          </option>
        </select>

        <label for="PrixTotal">Choisissez votre prix maximal</label>
        <select id="totalPriceFilter" v-model="totalPriceFilter">
          <option value="" disabled>Select Price Range</option>
          <option v-for="priceRange in prixfilter" :key="priceRange" :value="priceRange">
            &lt; ou = {{ priceRange }}
          </option>
        </select>
      </div>
    </div>

    <!-- Watch List -->
    <ul class="m-5">
      <li v-for="(watch) in filteredWatches.slice(0, visibleItemCount)" :key="watch.montreID" class="border my-2 p-3">
        {{ watch.boitier_nom }} / {{ watch.boitier_texture }} | {{ watch.pierre_nom }} | {{ watch.bracelet_texture }} | {{ watch.pierre_prix + watch.boitier_prix + watch.bracelet_prix }}
        <RouterLink class="m-5" :to="`/watch/${watch.montreID}`">CLICK HERE</RouterLink>
        <button @click="deleteWatch(index, watch.montreID)">DELETE</button>
      </li>
    </ul>

    <div class="flex gap-5 m-5">
      <button class="border p-3" @click="showMore">Afficher plus</button>
      <button class="border p-3" @click="showLess">Afficher moins</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      watches: [],
      boitierTextureFilter: '',
      pierreNomFilter: '',
      braceletTextureFilter: '',
      totalPriceFilter: null,
      boitiers: [],
      pierres: [],
      bracelets: [],
      prixfilter: [200, 250, 850],
      visibleItemCount: 3,
    };
  },
  computed: {
    // Filtered watches based on the filter criteria
    filteredWatches() {
      return this.watches.filter(watch => 
        this.filterByBoitierTexture(watch) &&
        this.filterByPierreNom(watch) &&
        this.filterByBraceletTexture(watch) &&
        this.filterByTotalPrice(watch)
      );
    },
    visibleWatches() {
      return this.filteredWatches.slice(0, this.visibleItemCount);
    },
    // Indicateur pour afficher ou non le bouton "Afficher plus"
    showMoreButton() {
      return this.visibleItemCount < this.filteredWatches.length;
    },
  },
  methods: {
    // Fonctions de filtre pour chaque critère
    filterByBoitierTexture(watch) {
      return watch.boitier_texture.includes(this.boitierTextureFilter);
    },
    filterByPierreNom(watch) {
      return watch.pierre_nom.includes(this.pierreNomFilter);
    },
    filterByBraceletTexture(watch) {
      return watch.bracelet_texture.includes(this.braceletTextureFilter);
    },
    filterByTotalPrice(watch) {
      return this.totalPriceFilter === null || watch.pierre_prix + watch.boitier_prix + watch.bracelet_prix <= this.totalPriceFilter;
    },
    // Fonction pour afficher plus de montres
    showMore() {
      this.visibleItemCount += 3; // Augmentez de 3 (ou ajustez selon vos besoins)
    },
    showLess() {
      this.visibleItemCount -= 3; // Augmentez de 3 (ou ajustez selon vos besoins)
    },
    deleteWatch(index, montreID) {
      const confirmDelete = window.confirm('Are you sure you want to delete this watch?');
      if (confirmDelete) {
        axios.delete(`http://localhost:3000/montre/delete/${montreID}`)
          .then(response => {
            // Remove the deleted watch from the local watches array
            this.watches.splice(index, 1);
            console.log(response.data.message);
          })
          .catch(error => {
            console.error('Error deleting watch:', error.message);
          });
      }
    },
  },
  mounted() {
    // Make a GET request to your Express server endpoint
    axios.get('http://localhost:3000/montres')
      .then(response => {
        this.watches = response.data;
      })
      .catch(error => {
        console.error('Error fetching watches:', error.message);
      });
    axios
      .get('http://localhost:3000/boitier')
      .then((response) => {
        this.boitiers = response.data
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des boîtiers', error)
      })
    // Récupérer la liste des pierres
    axios
      .get('http://localhost:3000/pierre')
      .then((response) => {
        this.pierres = response.data
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des pierres', error)
      })
    // Récupérer la liste des bracelets
    axios
      .get('http://localhost:3000/bracelet')
      .then((response) => {
        this.bracelets = response.data
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des bracelets', error)
      })
  }
};
</script>
