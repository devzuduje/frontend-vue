<template>
  <div>

      <!-- Título de sección -->
      <div class="mb-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Estadísticas Generales</h3>
        <p class="text-gray-600">Resumen de tu cadena hotelera en tiempo real</p>
      </div>

      <!-- Tarjetas de estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        <!-- Total Hoteles -->
        <div class="card-ocean stat-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-3">Total Hoteles</p>
              <p class="text-3xl font-bold stat-number mb-2">{{ stats.totalHotels }}</p>
              <p class="text-xs text-green-600 flex items-center">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 17H7V7"></path>
                </svg>
                +2 este mes
              </p>
            </div>
            <div class="stat-icon-ocean rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-2 4h2M7 7h.01M7 11h.01M7 15h.01"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Habitaciones -->
        <div class="card-ocean stat-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-3">Total Habitaciones</p>
              <p class="text-3xl font-bold stat-number mb-2">{{ stats.totalRooms }}</p>
              <p class="text-xs text-blue-600 flex items-center">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                85% ocupación
              </p>
            </div>
            <div class="stat-icon-teal rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Tipos de Habitación -->
        <div class="card-ocean stat-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-3">Tipos de Habitación</p>
              <p class="text-3xl font-bold stat-number mb-2">{{ stats.roomTypes }}</p>
              <p class="text-xs text-gray-500">Configurados</p>
            </div>
            <div class="stat-icon-blue rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Acomodaciones -->
        <div class="card-ocean stat-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-3">Acomodaciones</p>
              <p class="text-3xl font-bold stat-number mb-2">{{ stats.accommodations }}</p>
              <p class="text-xs text-gray-500">Tipos disponibles</p>
            </div>
            <div class="stat-icon-green rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Estado reactivo
const stats = ref({
  totalHotels: 0,
  totalRooms: 0,
  roomTypes: 0,
  accommodations: 0
})

// Obtener estadísticas
onMounted(() => {
  loadStats()
})

// Cargar estadísticas (simuladas por ahora)
const loadStats = () => {
  // Aquí conectaremos con tu API real después
  stats.value = {
    totalHotels: 12,
    totalRooms: 245,
    roomTypes: 3,
    accommodations: 4
  }
}
</script>
