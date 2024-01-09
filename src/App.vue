<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="flex flex-row gap-10 border border-black m-10 p-5">
      <RouterLink to="/">Page d'accueil</RouterLink>
      <RouterLink to="/watch">Montres Prédéfinies</RouterLink>
      <RouterLink to="/watch">Personnalisation</RouterLink>
      <RouterLink to="/auth">Compte</RouterLink>
      <RouterLink to="/panier">Votre panier</RouterLink>
    </nav>
  </header>
  <RouterView />
  <footer>

  </footer>
</template>

<style scoped>

</style>