<template>
  <div class="accommodations-view">
    <!-- Header con botón de crear -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Acomodaciones</h1>
        <p class="text-gray-600">Define las configuraciones de ocupación disponibles en tu hotel</p>
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
            @keyup.enter="searchAccommodations"
            type="text"
            placeholder="Buscar acomodaciones por nombre o descripción..."
            class="form-input w-full"
          />
        </div>
        <div class="flex gap-2">
          <select v-model="filterStatus" @change="searchAccommodations" class="form-input">
            <option value="">Solo activos</option>
            <option value="deleted">Solo eliminados</option>
            <option value="all">Todos (activos y eliminados)</option>
          </select>
          <button @click="searchAccommodations" class="btn-ocean-outline">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Buscar
          </button>
          <button @click="loadAccommodations(currentPage)" class="btn-ocean-outline">
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
      <p class="text-gray-600">Cargando acomodaciones...</p>
    </div>

    <!-- Lista de acomodaciones -->
    <div v-else-if="filteredAccommodations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div
        v-for="accommodation in filteredAccommodations"
        :key="accommodation.id"
        class="card-ocean p-8 hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-start mb-6">
          <div class="flex-1 pr-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ accommodation.name }}</h3>
            <p class="text-sm text-gray-600 mb-3">{{ accommodation.description }}</p>
            <div class="space-y-2">
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Código: {{ accommodation.code }}
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Capacidad: {{ accommodation.capacity }} personas
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                Precio base: ${{ accommodation.base_price }}
              </div>
            </div>
          </div>
          <span 
            v-if="accommodation.deleted_at"
            class="px-3 py-1 text-xs rounded-full font-medium flex-shrink-0 bg-red-100 text-red-800"
          >
            Eliminado
          </span>
        </div>

        <div class="flex gap-2">
          <button @click="viewAccommodation(accommodation)" class="btn-ocean-outline flex-1 text-sm">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            Ver
          </button>
          
          <!-- Botones para acomodaciones activas -->
          <template v-if="!accommodation.deleted_at">
            <button @click="editAccommodation(accommodation)" class="btn-ocean-outline flex-1 text-sm">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Editar
            </button>
            <button @click="deleteAccommodation(accommodation)" class="btn-danger flex-1 text-sm">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16M11 5h2"></path>
              </svg>
              Eliminar
            </button>
          </template>
          
          <!-- Botón para acomodaciones eliminadas -->
          <template v-else>
            <button @click="restoreAccommodation(accommodation)" class="btn-restore-solid flex-1 text-sm">
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
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No hay acomodaciones</h3>
      <p class="text-gray-600">No se encontraron acomodaciones con los filtros actuales</p>
    </div>

    <!-- Paginación -->
    <div v-if="filteredAccommodations.length > 0 && totalPages > 1" class="card-ocean p-6 mt-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="text-sm text-gray-600 font-medium">
          Mostrando <span class="text-ocean-600 font-semibold">{{ ((currentPage - 1) * perPage) + 1 }}</span> - 
          <span class="text-ocean-600 font-semibold">{{ Math.min(currentPage * perPage, totalAccommodations) }}</span> 
          de <span class="text-ocean-600 font-semibold">{{ totalAccommodations }}</span> acomodaciones
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

    <!-- Modal para ver detalles de la acomodación -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-90vh overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Detalles de la Acomodación</h2>
            <button @click="closeViewModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div v-if="viewingAccommodation" class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 mb-2">{{ viewingAccommodation.name }}</h3>
              <span 
                v-if="viewingAccommodation.deleted_at"
                class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800"
              >
                Eliminado el {{ formatDate(viewingAccommodation.deleted_at) }}
              </span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <p class="text-gray-900">{{ viewingAccommodation.description || 'Sin descripción' }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                <p class="text-gray-900">{{ viewingAccommodation.capacity }} personas</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio Base</label>
                <p class="text-gray-900">${{ viewingAccommodation.base_price }}</p>
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <button @click="editAccommodationFromView" class="btn-ocean-solid flex-1" v-if="!viewingAccommodation.deleted_at">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Editar Acomodación
              </button>
              <button @click="closeViewModal" class="btn-ocean-outline flex-1">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar acomodación -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-90vh overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ editingAccommodation ? 'Editar Acomodación' : 'Crear Acomodación' }}
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
                <label class="form-label">Nombre de la Acomodación *</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.name }"
                  placeholder="Ej: Individual, Doble, Triple..."
                />
                <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
              </div>

              <div>
                <label class="form-label">Código *</label>
                <input
                  v-model="form.code"
                  type="text"
                  required
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.code }"
                  placeholder="Ej: SGL, DBL, TPL..."
                />
                <p v-if="errors.code" class="field-error">{{ errors.code }}</p>
              </div>
            </div>

            <div>
              <label class="form-label">Descripción</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="form-input w-full"
                :class="{ 'border-red-500': errors.description }"
                placeholder="Describe las características de esta acomodación..."
              ></textarea>
              <p v-if="errors.description" class="field-error">{{ errors.description }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Capacidad *</label>
                <input
                  v-model.number="form.capacity"
                  type="number"
                  min="1"
                  max="10"
                  required
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.capacity }"
                  placeholder="Personas"
                />
                <p v-if="errors.capacity" class="field-error">{{ errors.capacity }}</p>
              </div>

              <div>
                <label class="form-label">Precio Base *</label>
                <input
                  v-model.number="form.base_price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.base_price }"
                  placeholder="0.00"
                />
                <p v-if="errors.base_price" class="field-error">{{ errors.base_price }}</p>
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
                {{ editingAccommodation ? 'Actualizar' : 'Crear' }}
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
const accommodations = ref([])
const loading = ref(false)
const showModal = ref(false)
const showViewModal = ref(false)
const editingAccommodation = ref(null)
const viewingAccommodation = ref(null)
const submitting = ref(false)
const searchTerm = ref('')
const filterStatus = ref('')

// Paginación
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = ref(20)
const totalAccommodations = ref(0)

// Formulario
const form = reactive({
  name: '',
  code: '',
  description: '',
  capacity: 1,
  base_price: 0
})

const errors = reactive({})

// Las acomodaciones ya vienen filtradas desde la API
const filteredAccommodations = computed(() => accommodations.value)

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
const loadAccommodations = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      per_page: perPage.value,
      search: searchTerm.value || undefined,
      filter: filterStatus.value || undefined
    }
    
    const response = await api.get('/accommodations', { params })
    
    // Estructura esperada de Laravel con paginación
    if (response.data.data && response.data.data.data) {
      // Formato de paginación completa
      accommodations.value = response.data.data.data
      currentPage.value = response.data.data.current_page
      totalPages.value = response.data.data.last_page
      totalAccommodations.value = response.data.data.total
    } else {
      // Formato simple
      accommodations.value = response.data.data || []
      currentPage.value = response.data.current_page || 1
      totalPages.value = response.data.last_page || 1
      totalAccommodations.value = response.data.total || 0
    }
    
  } catch (error) {
    console.error('Error cargando acomodaciones:', error)
    
    // Sin datos disponibles
    accommodations.value = []
    currentPage.value = 1
    totalPages.value = 1
    totalAccommodations.value = 0
  } finally {
    loading.value = false
  }
}

const viewAccommodation = (accommodation) => {
  viewingAccommodation.value = accommodation
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  viewingAccommodation.value = null
}

const editAccommodationFromView = () => {
  if (viewingAccommodation.value) {
    editingAccommodation.value = viewingAccommodation.value
    Object.assign(form, viewingAccommodation.value)
    closeViewModal()
    showModal.value = true
  }
}

const openCreateForm = () => {
  editingAccommodation.value = null
  resetForm()
  showModal.value = true
}

const editAccommodation = (accommodation) => {
  editingAccommodation.value = accommodation
  Object.assign(form, accommodation)
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
    code: '',
    description: '',
    capacity: 1,
    base_price: 0
  })
}

const submitForm = async () => {
  submitting.value = true
  Object.keys(errors).forEach(key => delete errors[key])

  try {
    if (editingAccommodation.value) {
      // Actualizar acomodación existente
      await api.put(`/accommodations/${editingAccommodation.value.id}`, form)
    } else {
      // Crear nueva acomodación
      await api.post('/accommodations', form)
    }

    closeModal()
    // Recargar la lista para mostrar cambios
    await loadAccommodations(currentPage.value)
    
  } catch (error) {
    console.error('Error guardando acomodación:', error)
    if (error.response?.status === 422) {
      Object.assign(errors, error.response.data.errors || {})
    } else {
      alert('Error al guardar la acomodación. Por favor intenta nuevamente.')
    }
  } finally {
    submitting.value = false
  }
}

const deleteAccommodation = async (accommodation) => {
  const confirmMessage = `¿Estás seguro de que deseas eliminar la acomodación "${accommodation.name}"?\n\nEsta acción no se puede deshacer.`
  
  if (!confirm(confirmMessage)) {
    return
  }

  loading.value = true
  try {
    // Eliminar acomodación con la API real
    await api.delete(`/accommodations/${accommodation.id}`)
    
    // Recargar la lista para mostrar cambios
    await loadAccommodations(currentPage.value)
    
    alert(`Acomodación "${accommodation.name}" eliminada correctamente`)
  } catch (error) {
    console.error('Error eliminando acomodación:', error)
    alert('Error al eliminar la acomodación. Por favor intenta nuevamente.')
  } finally {
    loading.value = false
  }
}

const restoreAccommodation = async (accommodation) => {
  const confirmMessage = `¿Estás seguro de que deseas restaurar la acomodación "${accommodation.name}"?`
  
  if (!confirm(confirmMessage)) {
    return
  }

  loading.value = true
  try {
    // Restaurar acomodación con la API real
    await api.post(`/accommodations/${accommodation.id}/restore`)
    
    // Recargar la lista para mostrar cambios
    await loadAccommodations(currentPage.value)
    
    alert(`Acomodación "${accommodation.name}" restaurada correctamente`)
  } catch (error) {
    console.error('Error restaurando acomodación:', error)
    alert('Error al restaurar la acomodación. Por favor intenta nuevamente.')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES')
}

// Funciones de búsqueda y filtros
const searchAccommodations = () => {
  currentPage.value = 1
  loadAccommodations(1)
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    loadAccommodations(page)
  }
}

// Inicialización
onMounted(() => {
  loadAccommodations()
})
</script>