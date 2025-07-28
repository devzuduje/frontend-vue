<template>
  <div class="rooms-view">
    <!-- Header con botón de crear -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Habitaciones</h1>
        <p class="text-gray-600">Administra las habitaciones individuales de cada hotel</p>
      </div>
      <button @click="openCreateForm" class="btn-ocean-solid">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Nueva
      </button>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="card-ocean p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchTerm"
            @keyup.enter="searchRooms"
            type="text"
            placeholder="Buscar habitaciones por número, hotel o tipo..."
            class="form-input w-full"
          />
        </div>
        <div class="flex gap-2">
          <select v-model="filterHotel" @change="searchRooms" class="form-input">
            <option value="">Todos los hoteles</option>
            <option v-for="hotel in availableHotels" :key="hotel.id" :value="hotel.id">
              {{ hotel.name }}
            </option>
          </select>
          <select v-model="filterRoomType" @change="searchRooms" class="form-input">
            <option value="">Todos los tipos</option>
            <option v-for="type in availableRoomTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
          <select v-model="filterStatus" @change="searchRooms" class="form-input">
            <option value="">Solo activos</option>
            <option value="deleted">Solo eliminados</option>
            <option value="all">Todos (activos y eliminados)</option>
          </select>
          <button @click="searchRooms" class="btn-ocean-outline">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Buscar
          </button>
          <button @click="loadRooms(currentPage)" class="btn-ocean-outline">
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
      <p class="text-gray-600">Cargando habitaciones...</p>
    </div>

    <!-- Lista de habitaciones -->
    <div v-else-if="filteredRooms.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div
        v-for="room in filteredRooms"
        :key="room.id"
        class="card-ocean p-8 hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-start mb-6">
          <div class="flex-1 pr-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Habitación {{ room.room_number }}</h3>
            <p class="text-sm text-gray-600 mb-3">{{ room.hotel?.name }}</p>
            <div class="space-y-2">
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Tipo: {{ room.room_type?.name }}
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Acomodación: {{ room.accommodation?.name }}
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                Precio: ${{ room.price }}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end space-y-2">
            <span 
              v-if="room.deleted_at"
              class="px-3 py-1 text-xs rounded-full font-medium bg-red-100 text-red-800"
            >
              Eliminado
            </span>
            <span 
              :class="getStatusColor(room.status)"
              class="px-3 py-1 text-xs rounded-full font-medium"
            >
              {{ getStatusText(room.status) }}
            </span>
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="viewRoom(room)" class="btn-ocean-outline flex-1 text-sm">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            Ver
          </button>
          
          <!-- Botones para habitaciones activas -->
          <template v-if="!room.deleted_at">
            <button @click="editRoom(room)" class="btn-ocean-outline flex-1 text-sm">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Editar
            </button>
            <button @click="deleteRoom(room)" class="btn-danger flex-1 text-sm">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16M11 5h2"></path>
              </svg>
              Eliminar
            </button>
          </template>
          
          <!-- Botón para habitaciones eliminadas -->
          <template v-else>
            <button @click="restoreRoom(room)" class="btn-restore-solid flex-1 text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Restaurar
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="card-ocean p-8 text-center">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No hay habitaciones</h3>
      <p class="text-gray-600">No se encontraron habitaciones con los filtros actuales</p>
    </div>

    <!-- Paginación -->
    <div v-if="filteredRooms.length > 0 && totalPages > 1" class="card-ocean p-6 mt-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="text-sm text-gray-600 font-medium">
          Mostrando <span class="text-ocean-600 font-semibold">{{ ((currentPage - 1) * perPage) + 1 }}</span> - 
          <span class="text-ocean-600 font-semibold">{{ Math.min(currentPage * perPage, totalRooms) }}</span> 
          de <span class="text-ocean-600 font-semibold">{{ totalRooms }}</span> habitaciones
        </div>
        
        <div class="flex items-center space-x-2">
          <!-- Botón anterior -->
          <button 
            @click="changePage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="btn-ocean-outline text-sm"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage <= 1 }"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Anterior
          </button>

          <!-- Números de página -->
          <div class="flex space-x-1">
            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="changePage(page)"
                class="px-3 py-2 text-sm rounded-lg border font-medium transition-all duration-200"
                :class="page === currentPage 
                  ? 'bg-ocean-600 text-white border-ocean-600 shadow-md' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-ocean-50 hover:text-ocean-700 hover:border-ocean-300'"
              >
                {{ page }}
              </button>
              <span v-else class="px-3 py-2 text-sm text-gray-400 font-medium">...</span>
            </template>
          </div>

          <!-- Botón siguiente -->
          <button 
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="btn-ocean-outline text-sm"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
          >
            Siguiente
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para ver detalles de la habitación -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-90vh overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Detalles de la Habitación</h2>
            <button @click="closeViewModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div v-if="viewingRoom" class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 mb-2">Habitación {{ viewingRoom.room_number }}</h3>
              <div class="flex gap-2">
                <span 
                  v-if="viewingRoom.deleted_at"
                  class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800"
                >
                  Eliminado el {{ formatDate(viewingRoom.deleted_at) }}
                </span>
                <span 
                  :class="getStatusColor(viewingRoom.status)"
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ getStatusText(viewingRoom.status) }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Hotel</label>
                <p class="text-gray-900">{{ viewingRoom.hotel?.name || 'No especificado' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Habitación</label>
                <p class="text-gray-900">{{ viewingRoom.room_type?.name || 'No especificado' }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Acomodación</label>
                <p class="text-gray-900">{{ viewingRoom.accommodation?.name || 'No especificado' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <p class="text-gray-900">${{ viewingRoom.price }}</p>
              </div>
            </div>

            <div v-if="viewingRoom.description">
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <p class="text-gray-900">{{ viewingRoom.description }}</p>
            </div>

            <div class="flex gap-3 pt-4">
              <button @click="editRoomFromView" class="btn-ocean-solid flex-1" v-if="!viewingRoom.deleted_at">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Editar Habitación
              </button>
              <button @click="closeViewModal" class="btn-ocean-outline flex-1">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar habitación -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-90vh overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ editingRoom ? 'Editar Habitación' : 'Crear Habitación' }}
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitForm" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Hotel *</label>
                <select
                  v-model="form.hotel_id"
                  required
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.hotel_id }"
                >
                  <option value="">Seleccionar hotel</option>
                  <option v-for="hotel in availableHotels" :key="hotel.id" :value="hotel.id">
                    {{ hotel.name }}
                  </option>
                </select>
                <p v-if="errors.hotel_id" class="field-error">{{ errors.hotel_id }}</p>
              </div>

              <div>
                <label class="form-label">Número de Habitación *</label>
                <input
                  v-model="form.room_number"
                  type="text"
                  required
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.room_number }"
                  placeholder="Ej: 101, A-1, Presidential..."
                />
                <p v-if="errors.room_number" class="field-error">{{ errors.room_number }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Tipo de Habitación *</label>
                <select
                  v-model="form.room_type_id"
                  required
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.room_type_id }"
                >
                  <option value="">Seleccionar tipo</option>
                  <option v-for="type in availableRoomTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
                <p v-if="errors.room_type_id" class="field-error">{{ errors.room_type_id }}</p>
              </div>

              <div>
                <label class="form-label">Acomodación *</label>
                <select
                  v-model="form.accommodation_id"
                  required
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.accommodation_id }"
                >
                  <option value="">Seleccionar acomodación</option>
                  <option v-for="accommodation in availableAccommodations" :key="accommodation.id" :value="accommodation.id">
                    {{ accommodation.name }} ({{ accommodation.capacity }} personas)
                  </option>
                </select>
                <p v-if="errors.accommodation_id" class="field-error">{{ errors.accommodation_id }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Precio *</label>
                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.price }"
                  placeholder="0.00"
                />
                <p v-if="errors.price" class="field-error">{{ errors.price }}</p>
              </div>

              <div>
                <label class="form-label">Estado</label>
                <select v-model="form.status" class="form-input w-full">
                  <option value="available">Disponible</option>
                  <option value="occupied">Ocupada</option>
                  <option value="maintenance">Mantenimiento</option>
                  <option value="out_of_order">Fuera de Servicio</option>
                </select>
              </div>
            </div>

            <div>
              <label class="form-label">Descripción</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="form-input w-full"
                :class="{ 'border-red-500': errors.description }"
                placeholder="Descripción adicional de la habitación..."
              ></textarea>
              <p v-if="errors.description" class="field-error">{{ errors.description }}</p>
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
                {{ editingRoom ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/services/api.js'

// Estado reactivo
const rooms = ref([])
const availableHotels = ref([])
const availableRoomTypes = ref([])
const availableAccommodations = ref([])
const loading = ref(false)
const showModal = ref(false)
const showViewModal = ref(false)
const editingRoom = ref(null)
const viewingRoom = ref(null)
const submitting = ref(false)
const searchTerm = ref('')
const filterStatus = ref('')
const filterHotel = ref('')
const filterRoomType = ref('')

// Paginación
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = ref(20)
const totalRooms = ref(0)

// Formulario
const form = reactive({
  hotel_id: '',
  room_number: '',
  room_type_id: '',
  accommodation_id: '',
  price: 0,
  status: 'available',
  description: ''
})

const errors = reactive({})

// Las habitaciones ya vienen filtradas desde la API
const filteredRooms = computed(() => rooms.value)

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

// Funciones de utilidad para estados
const getStatusColor = (status) => {
  const colors = {
    available: 'bg-green-100 text-green-800',
    occupied: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    out_of_order: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    available: 'Disponible',
    occupied: 'Ocupada',
    maintenance: 'Mantenimiento',
    out_of_order: 'Fuera de Servicio'
  }
  return texts[status] || status
}


// Métodos para cargar datos relacionados
const loadRelatedData = async () => {
  try {
    // Cargar hoteles, tipos y acomodaciones en paralelo
    const [hotelsResponse, roomTypesResponse, accommodationsResponse] = await Promise.all([
      api.get('/hotels?filter=active'),
      api.get('/room-types?filter=active'),
      api.get('/accommodations?filter=active')
    ])
    
    availableHotels.value = hotelsResponse.data.data || []
    availableRoomTypes.value = roomTypesResponse.data.data || []
    
    // Accommodations tiene formato de paginación diferente
    if (accommodationsResponse.data.data && accommodationsResponse.data.data.data) {
      availableAccommodations.value = accommodationsResponse.data.data.data || []
    } else {
      availableAccommodations.value = accommodationsResponse.data.data || []
    }
  } catch (error) {
    console.error('Error cargando datos relacionados:', error)
    
    // Fallback a datos mock si hay error
    availableHotels.value = [
      { id: 1, name: 'HOTEL DECAMERON Barranquilla' },
      { id: 2, name: 'HOTEL DECAMERON Cartagena' },
      { id: 3, name: 'HOTEL DECAMERON Santa Marta' }
    ]
    availableRoomTypes.value = [
      { id: 1, name: 'Suite Presidencial', code: 'STE' },
      { id: 2, name: 'Habitación Doble', code: 'DBL' }
    ]
    availableAccommodations.value = [
      { id: 1, name: 'Sencilla', code: 'SGL' },
      { id: 2, name: 'Doble', code: 'DBL' },
      { id: 3, name: 'Triple', code: 'TPL' }
    ]
  }
}

const loadRooms = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      per_page: perPage.value,
      search: searchTerm.value || undefined,
      filter: filterStatus.value || undefined,
      hotel_id: filterHotel.value || undefined,
      room_type_id: filterRoomType.value || undefined
    }
    
    const response = await api.get('/rooms', { params })
    
    // Estructura esperada de Laravel con paginación
    rooms.value = response.data.data
    currentPage.value = response.data.current_page
    totalPages.value = response.data.last_page
    totalRooms.value = response.data.total
    
  } catch (error) {
    console.error('Error cargando habitaciones:', error)
    
    // Fallback a datos mock cuando no existe endpoint
    const mockRooms = [
      {
        id: 1,
        room_number: '101',
        hotel: { id: 1, name: 'HOTEL DECAMERON Barranquilla' },
        room_type: { id: 1, name: 'Suite Presidencial' },
        accommodation: { id: 1, name: 'Sencilla' },
        price: 350000,
        status: 'available',
        description: 'Suite con vista al mar',
        deleted_at: null
      },
      {
        id: 2,
        room_number: '102',
        hotel: { id: 1, name: 'HOTEL DECAMERON Barranquilla' },
        room_type: { id: 2, name: 'Habitación Doble' },
        accommodation: { id: 2, name: 'Doble' },
        price: 250000,
        status: 'occupied',
        description: 'Habitación estándar',
        deleted_at: null
      },
      {
        id: 3,
        room_number: '201',
        hotel: { id: 2, name: 'HOTEL DECAMERON Cartagena' },
        room_type: { id: 1, name: 'Suite Presidencial' },
        accommodation: { id: 3, name: 'Triple' },
        price: 400000,
        status: 'maintenance',
        description: 'Suite presidencial en mantenimiento',
        deleted_at: null
      },
      {
        id: 4,
        room_number: '202',
        hotel: { id: 2, name: 'HOTEL DECAMERON Cartagena' },
        room_type: { id: 2, name: 'Habitación Doble' },
        accommodation: { id: 2, name: 'Doble' },
        price: 280000,
        status: 'out_of_order',
        description: 'Habitación fuera de servicio',
        deleted_at: null
      },
      {
        id: 5,
        room_number: '301',
        hotel: { id: 3, name: 'HOTEL DECAMERON Santa Marta' },
        room_type: { id: 1, name: 'Suite Presidencial' },
        accommodation: { id: 1, name: 'Sencilla' },
        price: 320000,
        status: 'available',
        description: 'Suite con balcón',
        deleted_at: '2025-01-01'
      }
    ]
    
    // Aplicar filtros básicos si están definidos
    let filteredMockRooms = mockRooms
    
    if (filterStatus.value === 'deleted') {
      filteredMockRooms = mockRooms.filter(room => room.deleted_at)
    } else if (!filterStatus.value || filterStatus.value === '') {
      filteredMockRooms = mockRooms.filter(room => !room.deleted_at)
    }
    
    if (filterHotel.value) {
      filteredMockRooms = filteredMockRooms.filter(room => room.hotel.id == filterHotel.value)
    }
    
    if (searchTerm.value) {
      filteredMockRooms = filteredMockRooms.filter(room => 
        room.room_number.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        room.hotel.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
    }
    
    rooms.value = filteredMockRooms
    currentPage.value = 1
    totalPages.value = 1
    totalRooms.value = filteredMockRooms.length
  } finally {
    loading.value = false
  }
}

const viewRoom = (room) => {
  viewingRoom.value = room
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  viewingRoom.value = null
}

const editRoomFromView = () => {
  if (viewingRoom.value) {
    editingRoom.value = viewingRoom.value
    Object.assign(form, viewingRoom.value)
    closeViewModal()
    showModal.value = true
  }
}

const openCreateForm = () => {
  editingRoom.value = null
  resetForm()
  showModal.value = true
}

const editRoom = (room) => {
  editingRoom.value = room
  Object.assign(form, room)
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
  Object.keys(errors).forEach(key => delete errors[key])
}

const resetForm = () => {
  Object.assign(form, {
    hotel_id: '',
    room_number: '',
    room_type_id: '',
    accommodation_id: '',
    price: 0,
    status: 'available',
    description: ''
  })
}

const submitForm = async () => {
  submitting.value = true
  Object.keys(errors).forEach(key => delete errors[key])

  try {
    if (editingRoom.value) {
      // Actualizar habitación existente
      await api.put(`/rooms/${editingRoom.value.id}`, form)
    } else {
      // Crear nueva habitación
      await api.post('/rooms', form)
    }

    closeModal()
    // Recargar la lista para mostrar cambios
    await loadRooms(currentPage.value)
    
  } catch (error) {
    console.error('Error guardando habitación:', error)
    
    // Mock success para demostración
    if (editingRoom.value) {
      alert('Habitación actualizada correctamente (modo demo)')
    } else {
      alert('Habitación creada correctamente (modo demo)')
    }
    
    closeModal()
    await loadRooms(currentPage.value)
  } finally {
    submitting.value = false
  }
}

const deleteRoom = async (room) => {
  const confirmMessage = `¿Estás seguro de que deseas eliminar la habitación "${room.room_number}"?\n\nEsta acción no se puede deshacer.`
  
  if (!confirm(confirmMessage)) {
    return
  }

  loading.value = true
  try {
    // Eliminar habitación con la API real
    await api.delete(`/rooms/${room.id}`)
    
    // Recargar la lista para mostrar cambios
    await loadRooms(currentPage.value)
    
    alert(`Habitación "${room.room_number}" eliminada correctamente`)
  } catch (error) {
    console.error('Error eliminando habitación:', error)
    
    // Mock success para demostración
    alert(`Habitación "${room.room_number}" eliminada correctamente (modo demo)`)
    await loadRooms(currentPage.value)
  } finally {
    loading.value = false
  }
}

const restoreRoom = async (room) => {
  const confirmMessage = `¿Estás seguro de que deseas restaurar la habitación "${room.room_number}"?`
  
  if (!confirm(confirmMessage)) {
    return
  }

  loading.value = true
  try {
    // Restaurar habitación con la API real
    await api.post(`/rooms/${room.id}/restore`)
    
    // Recargar la lista para mostrar cambios
    await loadRooms(currentPage.value)
    
    alert(`Habitación "${room.room_number}" restaurada correctamente`)
  } catch (error) {
    console.error('Error restaurando habitación:', error)
    
    // Mock success para demostración
    alert(`Habitación "${room.room_number}" restaurada correctamente (modo demo)`)
    await loadRooms(currentPage.value)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES')
}

// Funciones de búsqueda y filtros
const searchRooms = () => {
  currentPage.value = 1
  loadRooms(1)
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    loadRooms(page)
  }
}

// Inicialización
onMounted(async () => {
  await loadRelatedData()
  await loadRooms()
})
</script>