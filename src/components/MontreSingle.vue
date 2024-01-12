<template>
  <div>
    <h1 class="m-5">Détails des montres</h1>
    <div v-if="watch" class="border m-5 p-3 flex flex-col gap-3">
      <p>Texture boitier = {{ watch.boitier_texture }}</p>
      <p>Ornement pierres = {{ watch.pierre_nom }}</p>
      <p>Texture du bracelet = {{ watch.bracelet_texture }}</p>
    </div>
    <div v-else>
      Loading...
    </div>
    <button @click="ajouterAuPanier">Ajouter celle-ci à votre panier</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import axios from 'axios';
import { useGlobalStore } from '@/store/global';
const globalStore = useGlobalStore()

const props = defineProps(['id']);

const watch = ref({});
const montres = ref([]);
const boitiers = ref([]);
const pierres = ref([]);
const bracelets = ref([]);

onMounted(async () => {
  try {
    const [
      { data: watchData },
      { data: montresData },
      { data: boitiersData },
      { data: pierresData },
      { data: braceletsData },
    ] = await Promise.all([
      axios.get(`http://localhost:3000/montres/${props.id}`),
      axios.get(`http://localhost:3000/rawmontres/${props.id}`),
      axios.get(`http://localhost:3000/boitier`),
      axios.get(`http://localhost:3000/pierre`),
      axios.get(`http://localhost:3000/bracelet`),
    ]);

    watch.value = watchData[0];
    montres.value = montresData[0];
    boitiers.value = boitiersData;
    pierres.value = pierresData;
    bracelets.value = braceletsData;
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
});

const ajouterAuPanier = () => {
  const token = globalStore.token

  const valeur = ref({});
  valeur.value.UserID = token;
  valeur.value.MontreID = watch.value.montreID;

  console.log(valeur.value);

  axios
    .post('http://localhost:3000/panier/ajout', valeur.value)
    .then((response) => {
      console.log(response.data.message);
      alert('Montre ajoutée au panier avec succès!');
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout de la montre au panier", error.response.data.error);
      alert("Erreur lors de l'ajout de la montre au panier. Veuillez réessayer.");
    });
};
</script>