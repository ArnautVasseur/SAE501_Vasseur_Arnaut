<template>
  <div>
    <h1>Ajouter une Montre</h1>

    <form @submit.prevent="addWatch">

      <!-- Champ pour le boitier -->
      <label for="BoitierID">Boitier :</label>
      <select v-model="newBoitierID" required>
        <option v-for="boitier in boitiers" :key="boitier.boitierID" :value="boitier.boitierID">
          {{ boitier.texture }}
        </option>
      </select>

      <br />

      <!-- Champ pour la pierre -->
      <label for="PierreID">Pierre :</label>
      <select v-model="newPierreID" required>
        <option v-for="pierre in pierres" :key="pierre.pierreID" :value="pierre.pierreID">
          {{ pierre.nom }}
        </option>
      </select>

      <br />

      <!-- Champ pour le bracelet -->
      <label for="BraceletID">Bracelet :</label>
      <select v-model="newBraceletID" required>
        <option
          v-for="bracelet in bracelets"
          :key="bracelet.braceletID"
          :value="bracelet.braceletID"
        >
          {{ bracelet.texture }}
        </option>
      </select>

      <br />

      <button type="submit">Ajouter la Montre</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      newBoitierID: null,
      newPierreID: null,
      newBraceletID: null,
      boitiers: [],
      pierres: [],
      bracelets: [],
    }
  },
  mounted() {
    // Récupérer la liste des boîtiers
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
  methods: {
    addWatch() {
      axios
        .post(
          'http://localhost:3000/montre/ajout',
          {
            BoitierID: this.newBoitierID,
            PierreID: this.newPierreID,
            BraceletID: this.newBraceletID,
          },
        )
        .then((response) => {
          console.log(response.data.message)
          // Rediriger l'utilisateur vers la page des montres qu'il a configuré après l'ajout réussi
          this.$router.push('/watch')
        })
        .catch((error) => {
          console.error("Erreur lors de l'ajout de la montre", error.response.data.error)
        })
    }
  }
}
</script>