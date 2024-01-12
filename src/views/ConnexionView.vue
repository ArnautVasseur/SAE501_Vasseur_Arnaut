<template>
  <main class="m-10">
    <div class="flex w-full justify-evenly border border-black p-5">
      <div>
        <h2 class="text-lg">Inscription</h2>

        <form @submit.prevent="inscription" method="post" class="flex flex-col gap-7">
          <input class="p-2 border" v-model="inscriptionData.email" type="text" name="email" id="inscription-email" required placeholder="Email">
          <input class="p-2 border" v-model="inscriptionData.password" type="password" name="mdp" id="inscription-mdp" required placeholder="Mot de Passe">

          <input class="border border-black hover:bg-black hover:text-white py-3 duration-300" type="submit" value="Inscription">
        </form>
      </div>

      <div>
        <h2 class="text-lg">Connexion</h2>

        <form @submit.prevent="connexion" method="post" class="flex flex-col gap-7">
          <input class="p-2 border" v-model="loginData.email" type="text" name="email" id="login-email" required placeholder="Email">
          <input class="p-2 border" v-model="loginData.password" type="password" name="mdp" id="login-mdp" required placeholder="Mot de Passe">

          <input class="border border-black hover:bg-black hover:text-white py-3 duration-300" type="submit" value="Connexion">
        </form>
      </div>
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
