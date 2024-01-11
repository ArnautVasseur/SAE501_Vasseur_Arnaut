<template>
  <main>
    <h1>Page Login</h1>

    <div>
      <h2>Inscription</h2>

      <form @submit.prevent="inscription" method="post">
        <input v-model="inscriptionData.email" type="text" name="email" id="inscription-email" required placeholder="Email">
        <input v-model="inscriptionData.password" type="password" name="mdp" id="inscription-mdp" required placeholder="Mot de Passe">

        <input type="submit" value="Je m'inscris">
      </form>
    </div>

    <div>
      <h2>Connexion</h2>

      <form @submit.prevent="connexion" method="post">
        <input v-model="loginData.email" type="text" name="email" id="login-email" required placeholder="Email">
        <input v-model="loginData.password" type="password" name="mdp" id="login-mdp" required placeholder="Mot de Passe">

        <input type="submit" value="Je me connect">
      </form>
    </div>

  </main>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useGlobalStore } from '@/store/global'

// Accéder au store global
const globalStore = useGlobalStore()

// Fonction pour définir le token
const setToken = (token) => {
  globalStore.setToken(token)
}

const inscriptionData = ref({
  email: '',
  password: '',
});

const loginData = ref({
  email: '',
  password: '',
});

const connexion = async () => {
  try {
    const response = await axios.post('http://localhost:3000/connexion', loginData.value);
    // localStorage.setItem('token', JSON.stringify(response.data.userId))
      globalStore.setToken(response.data.userId)

    console.log(response.data.userId); // Handle the response as needed
    // Optionally, you can reset the form data after successful login
    loginData.value.email = '';
    loginData.value.password = '';
  } catch (error) {
    console.error('Error during login:', error);
  }
};


const inscription = async () => {
  try {
    const response = await axios.post('http://localhost:3000/inscription', inscriptionData.value);


    console.log(response.data); // You can handle the response as needed

    // Optionally, you can reset the form data after successful submission
    inscriptionData.value.email = '';
    inscriptionData.value.password = '';
  } catch (error) {
    console.error('Error during inscription:', error.message);
  }
};
</script>
