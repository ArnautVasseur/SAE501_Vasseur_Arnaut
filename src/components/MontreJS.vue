<template>
  <div>
    <h1 class="m-5">Watch List</h1>
    <ul class="m-5">
      <li class="border my-2 p-3" v-for="watch in watches" :key="watch.montreID">
        {{ watch.montreID }} | {{ watch.boitier_nom }} / {{ watch.boitier_texture }} | {{ watch.pierre_nom }} | {{ watch.bracelet_texture }} | {{ watch.pierre_prix + watch.boitier_prix + watch.bracelet_prix }}
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
    };
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
  },
};
</script>
