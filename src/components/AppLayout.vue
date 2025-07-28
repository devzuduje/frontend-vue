<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 dashboard-brand flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-2 4h2M7 7h.01M7 11h.01M7 15h.01"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold dashboard-title">Hotel Manager</h1>
            <p class="text-xs text-gray-500">Sistema de Gestión</p>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <ul class="space-y-2">
          <li>
            <router-link to="/dashboard" class="nav-item" :class="{ 'nav-item-active': $route.name === 'dashboard' }">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              <span>Dashboard</span>
            </router-link>
          </li>
          
          <li>
            <router-link to="/hotels" class="nav-item" :class="{ 'nav-item-active': $route.path.startsWith('/hotels') }">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-2 4h2M7 7h.01M7 11h.01M7 15h.01"></path>
              </svg>
              <span>Hoteles</span>
            </router-link>
          </li>

          <li>
            <router-link to="/room-types" class="nav-item" :class="{ 'nav-item-active': $route.path.startsWith('/room-types') }">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              <span>Tipos de Habitación</span>
            </router-link>
          </li>

          <li>
            <router-link to="/accommodations" class="nav-item" :class="{ 'nav-item-active': $route.path.startsWith('/accommodations') }">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>Acomodaciones</span>
            </router-link>
          </li>

          <li>
            <router-link to="/rooms" class="nav-item" :class="{ 'nav-item-active': $route.path.startsWith('/rooms') }">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              </svg>
              <span>Habitaciones</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- User Info & Logout -->
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-ocean-100 to-teal-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-ocean-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 truncate">{{ currentUser?.name || 'Usuario' }}</div>
            </div>
          </div>
        </div>
        
        <button @click="handleLogout" class="logout-btn">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Salir
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Header -->
      <header class="top-header">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h2>
          <p class="text-gray-600">{{ pageDescription }}</p>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import authService from '@/services/authService.js'

const router = useRouter()
const route = useRoute()

const currentUser = ref(null)

// Títulos dinámicos basados en la ruta
const pageTitle = computed(() => {
  const titles = {
    'dashboard': 'Dashboard',
    'hotels': 'Gestión de Hoteles',
    'room-types': 'Tipos de Habitación',
    'accommodations': 'Acomodaciones',
    'rooms': 'Habitaciones'
  }
  return titles[route.name] || 'Panel de Administración'
})

const pageDescription = computed(() => {
  const descriptions = {
    'dashboard': 'Resumen general del sistema hotelero',
    'hotels': 'Administra los hoteles de tu cadena',
    'room-types': 'Configura los tipos de habitaciones disponibles',
    'accommodations': 'Define las acomodaciones y capacidades',
    'rooms': 'Gestiona las habitaciones individuales'
  }
  return descriptions[route.name] || 'Sistema de gestión hotelera'
})

onMounted(() => {
  currentUser.value = authService.getCurrentUser()
})

const handleLogout = async () => {
  try {
    await authService.logout()
    router.push('/login')
  } catch (error) {
    console.error('Error en logout:', error)
    router.push('/login')
  }
}
</script>