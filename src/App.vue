<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useGlobalStore } from '@/store/global'
import { onMounted } from 'vue';

// Accéder au store global
const globalStore = useGlobalStore()

onMounted(() => {
  const token = localStorage.getItem("token")
  globalStore.setToken(JSON.parse(token))
})
</script>

<template>
  <header>
    <nav class="flex flex-row justify-center gap-10 border border-black m-10 p-5">
      <RouterLink to="/">Page d'accueil</RouterLink>
      <RouterLink to="/watch">Montres Prédéfinies</RouterLink>
      <RouterLink to="/create">Créez votre montre</RouterLink>
      <RouterLink to="/login">Inscription/Connexion</RouterLink>
    </nav>
  </header>
  <RouterView />
  <footer>

  </footer>
</template>
