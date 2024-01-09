<template>
  <div>
    <h1>Inscription</h1>
    <form @submit.prevent="inscrire">
      <label>Nom d'utilisateur:</label>
      <input v-model="inscriptionNom" required />

      <label>Mot de passe:</label>
      <input type="password" v-model="inscriptionMotDePasse" required />

      <button type="submit">S'inscrire</button>
    </form>

    <h1>Connexion</h1>
    <form @submit.prevent="connecter">
      <label>Nom d'utilisateur:</label>
      <input v-model="connexionNom" required />

      <label>Mot de passe:</label>
      <input type="password" v-model="connexionMotDePasse" required />

      <button type="submit">Se connecter</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      inscriptionNom: '',
      inscriptionMotDePasse: '',
      connexionNom: '',
      connexionMotDePasse: ''
    }
  },
  methods: {
    inscrire() {
      axios
        .post('http://localhost:3000/login', {
          NomUser: this.inscriptionNom,
          MotDePasse: this.inscriptionMotDePasse
        })
        .then((response) => {
          console.log('Inscription réussie, ID utilisateur:', response.data.UserID)
        })
        .catch((error) => {
          console.error("Erreur lors de l'inscription", error)
        })
    },
    connecter() {
      axios
        .post('http://localhost:3000/login', {
          NomUser: this.connexionNom,
          MotDePasse: this.connexionMotDePasse
        })
        .then((response) => {
          console.log('Connexion réussie, ID utilisateur:', response.data.UserID)
          // Stocker le token dans le stockage local
          localStorage.setItem('token', response.data.token)
        })
        .catch((error) => {
          console.error('Erreur lors de la connexion', error)
        })
    }
  }
}
</script>

<style></style>