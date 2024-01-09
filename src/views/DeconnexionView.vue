<template>
  <div>
    <h1>Déconnections</h1>
    <button @click="deconnecter">Se déconnecter</button>
    <!-- Reste du contenu de la page -->
  </div>
</template>

<script>
import { deconnecter } from '../utils/authService'

export default {
  methods: {
    deconnecter() {
      deconnecter()
      // Redirige l'utilisateur vers la page de connexion ou toute autre page appropriée
      this.$router.push('/connexion')
    }
    // Reste des méthodes du composant
  }
}
</script>

<style></style>