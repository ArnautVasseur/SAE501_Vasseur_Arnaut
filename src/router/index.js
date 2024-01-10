import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ConnexionView from '../views/ConnexionView.vue'
import DeconnexionView from '../views/DeconnexionView.vue'
import WatchView from '../views/WatchesView.vue'
import WatchDetails from '../views/WatchDetails.vue'
import PanierView from '../views/CartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: ConnexionView
    },
    {
      path: '/watch',
      name: 'watch',
      component: WatchView
    },
    {
    path: '/watch/:id',
    name: 'watch-details',
    component: WatchDetails,
    props: true,
  },
    {
      path: '/signout',
      name: 'signout',
      component: DeconnexionView,
    },
    {
      path: '/panier/:id',
      name: 'panier',
      component: PanierView,
      props: true,
    },
  ]
})

export default router
