<template>
  <div class="hotels-view">
    <!-- Header con botón de crear -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Hoteles</h1>
        <p class="text-gray-600">Administra los hoteles de tu cadena hotelera</p>
      </div>
      <button @click="openCreateForm" class="btn-ocean-solid">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Nuevo
      </button>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="card-ocean p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchTerm"
            @keyup.enter="searchHotels"
            type="text"
            placeholder="Buscar hoteles por nombre, ciudad o país..."
            class="form-input w-full"
          />
        </div>
        <div class="flex gap-2">
          <select v-model="filterStatus" @change="searchHotels" class="form-input">
            <option value="">Solo activos</option>
            <option value="deleted">Solo eliminados</option>
            <option value="all">Todos (activos y eliminados)</option>
          </select>
          <button @click="searchHotels" class="btn-ocean-outline">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Buscar
          </button>
          <button @click="loadHotels(currentPage)" class="btn-ocean-outline">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Actualizar
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card-ocean p-8 text-center">
      <svg class="animate-spin w-8 h-8 text-ocean-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Cargando hoteles...</p>
    </div>

    <!-- Lista de hoteles - Vista Moderna -->
    <div v-else-if="filteredHotels.length > 0" class="space-y-4">
      <div
        v-for="hotel in filteredHotels"
        :key="hotel.id"
        class="card-ocean p-6 hover:shadow-xl transition-all duration-300 border-l-4"
        :class="hotel.deleted_at ? 'border-red-400 bg-red-50' : 'border-ocean-400'"
      >
        <div class="flex items-center justify-between">
          <!-- Información principal -->
          <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- Hotel Info -->
            <div class="space-y-1">
              <div class="flex items-center space-x-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ hotel.name }}</h3>
                <span v-if="hotel.deleted_at" class="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                  Eliminado
                </span>
              </div>
              <p class="text-sm text-gray-600">{{ hotel.city }}</p>
              <p class="text-xs text-gray-500 font-mono">NIT: {{ hotel.nit }}</p>
            </div>

            <!-- Contacto -->
            <div class="space-y-1">
              <div class="text-sm text-gray-900">
                <div class="flex items-center space-x-2" v-if="hotel.phone">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>{{ hotel.phone }}</span>
                </div>
                <div class="flex items-center space-x-2 mt-1" v-if="hotel.email">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                  <span class="truncate text-sm">{{ hotel.email }}</span>
                </div>
              </div>
            </div>

            <!-- Dirección -->
            <div class="space-y-1">
              <div class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <div class="text-sm text-gray-900">{{ hotel.address }}</div>
              </div>
              <div v-if="hotel.max_rooms" class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                </svg>
                <span class="text-sm text-gray-600">{{ hotel.max_rooms }} habitaciones max.</span>
              </div>
            </div>

            <!-- Acciones -->
            <div class="flex items-center justify-end space-x-3">
              <template v-if="!hotel.deleted_at">
                <button 
                  @click="editHotel(hotel)" 
                  class="group flex items-center px-3 py-2 text-sm font-medium text-ocean-700 bg-ocean-50 rounded-lg hover:bg-ocean-100 hover:text-ocean-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2"
                >
                  <svg class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Editar
                </button>
                <button 
                  @click="showConfirmDialog(hotel, 'delete')" 
                  class="group flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <svg class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16M11 5h2"></path>
                  </svg>
                  Eliminar
                </button>
              </template>
              <template v-else>
                <button 
                  @click="showConfirmDialog(hotel, 'restore')" 
                  class="btn-restore-solid flex-1 text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Restaurar
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="card-ocean p-8 text-center">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-2 4h2M7 7h.01M7 11h.01M7 15h.01"></path>
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No hay hoteles</h3>
      <p class="text-gray-600">No se encontraron hoteles con los filtros actuales</p>
    </div>

    <!-- Paginación Mejorada -->
    <div v-if="filteredHotels.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
      <div class="flex flex-1 justify-between items-center">
        <!-- Información de registros -->
        <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-700">
            Mostrando 
            <span class="font-medium">{{ ((currentPage - 1) * perPage) + 1 }}</span>
            a
            <span class="font-medium">{{ Math.min(currentPage * perPage, totalHotels) }}</span>
            de
            <span class="font-medium">{{ totalHotels }}</span>
            resultados
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-500">Por página:</label>
            <select v-model="perPage" @change="changePerPage" class="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <!-- Controles de paginación -->
        <div v-if="totalPages > 1" class="flex items-center space-x-1">
          <!-- Primer página -->
          <button 
            @click="changePage(1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Primera página"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
          </button>

          <!-- Página anterior -->
          <button 
            @click="changePage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Página anterior"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <!-- Números de página -->
          <div class="flex space-x-1">
            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="changePage(page)"
                class="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border focus:outline-none focus:ring-2 focus:ring-ocean-500"
                :class="page === currentPage 
                  ? 'bg-ocean-500 border-ocean-500 text-white' 
                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
              <span v-else class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700">...</span>
            </template>
          </div>

          <!-- Página siguiente -->
          <button 
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Página siguiente"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <!-- Última página -->
          <button 
            @click="changePage(totalPages)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Última página"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>


    <!-- Modal para crear/editar hotel -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-90vh overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ editingHotel ? 'Editar Hotel' : 'Crear Hotel' }}
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="form-label">Nombre del Hotel *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="form-input w-full"
                :class="{ 'border-red-500': errors.name }"
              />
              <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Ciudad *</label>
                <input
                  v-model="form.city"
                  type="text"
                  required
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.city }"
                />
                <p v-if="errors.city" class="field-error">{{ errors.city }}</p>
              </div>
              <div>
                <label class="form-label">NIT *</label>
                <input
                  v-model="form.nit"
                  type="text"
                  required
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.nit }"
                  placeholder="Ej: 900123456-7"
                />
                <p v-if="errors.nit" class="field-error">{{ errors.nit }}</p>
              </div>
            </div>

            <div>
              <label class="form-label">Dirección *</label>
              <input
                v-model="form.address"
                type="text"
                required
                class="form-input w-full"
                :class="{ 'border-red-500': errors.address }"
              />
              <p v-if="errors.address" class="field-error">{{ errors.address }}</p>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="form-label">Teléfono</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.phone }"
                />
                <p v-if="errors.phone" class="field-error">{{ errors.phone }}</p>
              </div>
              <div>
                <label class="form-label">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.email }"
                />
                <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
              </div>
              <div>
                <label class="form-label">Máximo Habitaciones *</label>
                <input
                  v-model.number="form.max_rooms"
                  type="number"
                  min="1"
                  required
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.max_rooms }"
                  placeholder="Ej: 50"
                />
                <p v-if="errors.max_rooms" class="field-error">{{ errors.max_rooms }}</p>
              </div>
            </div>


            <div class="flex gap-3 pt-4">
              <button type="button" @click="closeModal" class="btn-ocean-outline flex-1">
                Cancelar
              </button>
              <button type="submit" :disabled="submitting" class="btn-ocean-solid flex-1">
                <svg v-if="submitting" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ editingHotel ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación personalizado -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                 :class="confirmAction === 'delete' ? 'bg-red-100' : 'bg-green-100'">
              <svg class="w-5 h-5" :class="confirmAction === 'delete' ? 'text-red-600' : 'text-green-600'" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="confirmAction === 'delete'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ confirmAction === 'delete' ? 'Confirmar Eliminación' : 'Confirmar Restauración' }}
              </h3>
            </div>
          </div>
          
          <div class="mb-6">
            <p class="text-gray-600">{{ confirmMessage }}</p>
          </div>
          
          <div class="flex gap-3">
            <button @click="closeConfirmModal" class="btn-ocean-outline flex-1">
              Cancelar
            </button>
            <button @click="executeConfirmAction" 
                    :class="confirmAction === 'delete' ? 'btn-danger flex-1' : 'bg-green-500 text-white border-none rounded-lg px-4 py-2 font-medium cursor-pointer transition-all duration-300 hover:bg-green-600 flex-1'">
              {{ confirmAction === 'delete' ? 'Eliminar' : 'Restaurar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sistema de Notificaciones -->
    <div class="fixed top-4 right-4 z-50 space-y-3">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto overflow-hidden border-l-4 transform transition-all duration-300 ease-in-out"
        :class="{
          'border-green-400': notification.type === 'success',
          'border-red-400': notification.type === 'error',
          'border-blue-400': notification.type === 'info'
        }"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg v-if="notification.type === 'success'" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else-if="notification.type === 'error'" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">{{ notification.message }}</p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button @click="removeNotification(notification.id)" class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none">
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/services/api.js'

// Estado reactivo
const hotels = ref([])
const loading = ref(false)
const showModal = ref(false)
const showConfirmModal = ref(false)
const editingHotel = ref(null)
const confirmingHotel = ref(null)
const confirmAction = ref('')
const confirmMessage = ref('')
const submitting = ref(false)
const searchTerm = ref('')
const filterStatus = ref('')

// Sistema de notificaciones
const notifications = ref([])
let notificationId = 0

// Paginación
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = ref(10)
const totalHotels = ref(0)

// Formulario
const form = reactive({
  name: '',
  city: '',
  nit: '',
  address: '',
  phone: '',
  email: '',
  max_rooms: 1
})

const errors = reactive({})

// Los hoteles ya vienen filtrados desde la API
const filteredHotels = computed(() => hotels.value)

// Páginas visibles en la paginación
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})


// Métodos
const loadHotels = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      per_page: perPage.value,
      search: searchTerm.value || undefined,
      filter: filterStatus.value || undefined
    }
    
    console.log('Cargando hoteles con parámetros:', params)
    const response = await api.get('/hotels', { params })
    console.log('Respuesta de hoteles:', response.data)
    
    // Estructura esperada de Laravel con paginación
    hotels.value = response.data.data || response.data || []
    currentPage.value = response.data.current_page || 1
    totalPages.value = response.data.last_page || 1
    totalHotels.value = response.data.total || hotels.value.length
    
    console.log(`Cargados ${hotels.value.length} hoteles`)
    
  } catch (error) {
    console.error('Error cargando hoteles:', error)
    console.error('Response status:', error.response?.status)
    console.error('Response data:', error.response?.data)
    
    // Sin datos disponibles
    hotels.value = []
    currentPage.value = 1
    totalPages.value = 1
    totalHotels.value = 0
  } finally {
    loading.value = false
  }
}


const openCreateForm = () => {
  editingHotel.value = null
  resetForm()
  showModal.value = true
}

const editHotel = (hotel) => {
  editingHotel.value = hotel
  Object.assign(form, hotel)
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
  Object.keys(errors).forEach(key => delete errors[key])
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    city: '',
    nit: '',
    address: '',
    phone: '',
    email: '',
    max_rooms: 1
  })
}

const submitForm = async () => {
  submitting.value = true
  Object.keys(errors).forEach(key => delete errors[key])

  try {
    console.log('Enviando datos del hotel:', form)
    
    if (editingHotel.value) {
      // Actualizar hotel existente
      const response = await api.put(`/hotels/${editingHotel.value.id}`, form)
      console.log('Hotel actualizado:', response.data)
      showNotification(`Hotel "${form.name}" actualizado correctamente`, 'success')
    } else {
      // Crear nuevo hotel
      const response = await api.post('/hotels', form)
      console.log('Hotel creado:', response.data)
      showNotification(`Hotel "${form.name}" creado correctamente`, 'success')
    }

    closeModal()
    // Recargar la lista para mostrar cambios
    await loadHotels(currentPage.value)
    
  } catch (error) {
    console.error('Error guardando hotel:', error)
    console.error('Response data:', error.response?.data)
    console.error('Response status:', error.response?.status)
    
    if (error.response?.status === 422) {
      // Errores de validación
      const validationErrors = error.response.data.errors || {}
      Object.assign(errors, validationErrors)
      console.log('Errores de validación:', validationErrors)
    } else if (error.response?.status === 500) {
      showNotification('Error interno del servidor. Verifica que el backend esté funcionando.', 'error')
    } else if (error.response) {
      showNotification(`Error del servidor: ${error.response.data.message || 'Error desconocido'}`, 'error')
    } else {
      showNotification('Error de conexión. Verifica que el backend esté accesible.', 'error')
    }
  } finally {
    submitting.value = false
  }
}

// Sistema de notificaciones
const showNotification = (message, type = 'info') => {
  const id = ++notificationId
  const notification = {
    id,
    message,
    type
  }
  
  notifications.value.push(notification)
  
  // Auto-remove después de 5 segundos
  setTimeout(() => {
    removeNotification(id)
  }, 5000)
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// Funciones del modal de confirmación
const showConfirmDialog = (hotel, action) => {
  confirmingHotel.value = hotel
  confirmAction.value = action
  
  if (action === 'delete') {
    confirmMessage.value = `¿Estás seguro de que deseas eliminar el hotel "${hotel.name}"? Esta acción no se puede deshacer.`
  } else {
    confirmMessage.value = `¿Estás seguro de que deseas restaurar el hotel "${hotel.name}"?`
  }
  
  showConfirmModal.value = true
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  confirmingHotel.value = null
  confirmAction.value = ''
  confirmMessage.value = ''
}

const executeConfirmAction = async () => {
  if (!confirmingHotel.value) return
  
  if (confirmAction.value === 'delete') {
    await deleteHotel(confirmingHotel.value)
  } else {
    await restoreHotel(confirmingHotel.value)
  }
  
  closeConfirmModal()
}

const deleteHotel = async (hotel) => {
  loading.value = true
  try {
    await api.delete(`/hotels/${hotel.id}`)
    await loadHotels(currentPage.value)
    showNotification(`Hotel "${hotel.name}" eliminado correctamente`, 'success')
  } catch (error) {
    console.error('Error eliminando hotel:', error)
    showNotification('Error al eliminar el hotel. Por favor intenta nuevamente.', 'error')
  } finally {
    loading.value = false
  }
}

const restoreHotel = async (hotel) => {
  loading.value = true
  try {
    await api.post(`/hotels/${hotel.id}/restore`)
    await loadHotels(currentPage.value)
    showNotification(`Hotel "${hotel.name}" restaurado correctamente`, 'success')
  } catch (error) {
    console.error('Error restaurando hotel:', error)
    showNotification('Error al restaurar el hotel. Por favor intenta nuevamente.', 'error')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES')
}

// Funciones de búsqueda y filtros
const searchHotels = () => {
  currentPage.value = 1
  loadHotels(1)
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    loadHotels(page)
  }
}

const changePerPage = () => {
  currentPage.value = 1
  loadHotels(1)
}

// Inicialización
onMounted(() => {
  loadHotels()
})
</script>