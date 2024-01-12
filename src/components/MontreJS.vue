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
      <li class="border my-2 p-3" v-for="watch in filteredWatches" :key="watch.montreID">
        {{ watch.boitier_nom }} / {{ watch.boitier_texture }} | {{ watch.pierre_nom }} | {{ watch.bracelet_texture }} | {{ watch.pierre_prix + watch.boitier_prix + watch.bracelet_prix }}
        <RouterLink :to="`/watch/${watch.montreID}`">CLICK HERE</RouterLink>
      </li>
    </ul>
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
      prixfilter:[200, 250, 850]
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
    }
  },
  methods: {
    // Filter functions for each criterion
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
  },
};
</script>
