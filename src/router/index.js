import { createRouter, createWebHistory } from 'vue-router'
import authService from '@/services/authService.js'
import AppLayout from '@/components/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue')
        },
        {
          path: 'hotels',
          name: 'hotels',
          component: () => import('../views/HotelsView.vue')
        },
        {
          path: 'room-types',
          name: 'room-types',
          component: () => import('../views/RoomTypesView.vue')
        },
        {
          path: 'accommodations',
          name: 'accommodations',
          component: () => import('../views/AccommodationsView.vue')
        },
        {
          path: 'rooms',
          name: 'rooms',
          component: () => import('../views/RoomsView.vue')
        }
      ]
    }
  ]
})

// Guard de navegación
router.beforeEach((to, from, next) => {
  console.log('Router guard:', { to: to.path, from: from.path })

  const isAuthenticated = authService.isAuthenticated()
  console.log('Usuario autenticado:', isAuthenticated)

  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Ruta requiere auth, redirigiendo a login')
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    console.log('Usuario ya autenticado, redirigiendo a dashboard')
    next('/dashboard')
  } else {
    console.log('Permitiendo navegación normal')
    next()
  }
})

export default router
