<template>
  <div class="room-types-view">
    <!-- Header con botón de crear -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Tipos de Habitación</h1>
        <p class="text-gray-600">Configura los tipos de habitaciones disponibles en tu hotel</p>
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
            @keyup.enter="searchRoomTypes"
            type="text"
            placeholder="Buscar tipos de habitación por nombre o descripción..."
            class="form-input w-full"
          />
        </div>
        <div class="flex gap-2">
          <select v-model="filterStatus" @change="searchRoomTypes" class="form-input">
            <option value="">Solo activos</option>
            <option value="deleted">Solo eliminados</option>
            <option value="all">Todos (activos y eliminados)</option>
          </select>
          <button @click="searchRoomTypes" class="btn-ocean-outline">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Buscar
          </button>
          <button @click="loadRoomTypes(currentPage)" class="btn-ocean-outline">
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
      <p class="text-gray-600">Cargando tipos de habitación...</p>
    </div>

    <!-- Lista de tipos de habitación -->
    <div v-else-if="filteredRoomTypes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div
        v-for="roomType in filteredRoomTypes"
        :key="roomType.id"
        class="card-ocean p-8 hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-start mb-6">
          <div class="flex-1 pr-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ roomType.name }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ roomType.description }}</p>
            <div class="space-y-1">
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Código: {{ roomType.code }}
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Capacidad: {{ roomType.max_capacity }} personas
              </div>
            </div>
          </div>
          <span
            v-if="roomType.deleted_at"
            class="px-3 py-1 text-xs rounded-full font-medium flex-shrink-0 bg-red-100 text-red-800"
          >
            Eliminado
          </span>
        </div>

        <div class="flex gap-2">
          <button @click="viewRoomType(roomType)" class="btn-ocean-outline flex-1 text-sm">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            Ver
          </button>

          <!-- Botones para tipos activos -->
          <template v-if="!roomType.deleted_at">
            <button @click="editRoomType(roomType)" class="btn-ocean-outline flex-1 text-sm">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Editar
            </button>
            <button @click="deleteRoomType(roomType)" class="btn-danger flex-1 text-sm">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16M11 5h2"></path>
              </svg>
              Eliminar
            </button>
          </template>

          <!-- Botón para tipos eliminados -->
          <template v-else>
            <button @click="restoreRoomType(roomType)" class="btn-restore-solid flex-1 text-sm">
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
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No hay tipos de habitación</h3>
      <p class="text-gray-600">No se encontraron tipos de habitación con los filtros actuales</p>
    </div>

    <!-- Paginación -->
    <div v-if="filteredRoomTypes.length > 0 && totalPages > 1" class="card-ocean p-6 mt-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="text-sm text-gray-600 font-medium">
          Mostrando <span class="text-ocean-600 font-semibold">{{ ((currentPage - 1) * perPage) + 1 }}</span> - 
          <span class="text-ocean-600 font-semibold">{{ Math.min(currentPage * perPage, totalRoomTypes) }}</span> 
          de <span class="text-ocean-600 font-semibold">{{ totalRoomTypes }}</span> tipos de habitación
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

    <!-- Modal para ver detalles del tipo de habitación -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-90vh overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Detalles del Tipo de Habitación</h2>
            <button @click="closeViewModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div v-if="viewingRoomType" class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 mb-2">{{ viewingRoomType.name }}</h3>
              <span
                v-if="viewingRoomType.deleted_at"
                class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800"
              >
                Eliminado el {{ formatDate(viewingRoomType.deleted_at) }}
              </span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <p class="text-gray-900">{{ viewingRoomType.description || 'Sin descripción' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Capacidad Máxima</label>
              <p class="text-gray-900">{{ viewingRoomType.max_capacity }} personas</p>
            </div>

            <div class="flex gap-3 pt-4">
              <button @click="editRoomTypeFromView" class="btn-ocean-solid flex-1" v-if="!viewingRoomType.deleted_at">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Editar Tipo
              </button>
              <button @click="closeViewModal" class="btn-ocean-outline flex-1">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar tipo de habitación -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-90vh overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ editingRoomType ? 'Editar Tipo de Habitación' : 'Crear Tipo de Habitación' }}
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
                <label class="form-label">Nombre del Tipo *</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="form-input w-full"
                  :class="{ 'border-red-500': errors.name }"
                  placeholder="Ej: Suite, Doble, Individual..."
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
                  placeholder="Ej: STE, DBL, IND..."
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
                placeholder="Describe las características de este tipo de habitación..."
              ></textarea>
              <p v-if="errors.description" class="field-error">{{ errors.description }}</p>
            </div>

            <div>
              <label class="form-label">Capacidad Máxima *</label>
              <input
                v-model.number="form.max_capacity"
                type="number"
                min="1"
                max="20"
                required
                class="form-input w-full"
                :class="{ 'border-red-500': errors.max_capacity }"
                placeholder="Número máximo de personas"
              />
              <p v-if="errors.max_capacity" class="field-error">{{ errors.max_capacity }}</p>
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
                {{ editingRoomType ? 'Actualizar' : 'Crear' }}
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
const roomTypes = ref([])
const loading = ref(false)
const showModal = ref(false)
const showViewModal = ref(false)
const editingRoomType = ref(null)
const viewingRoomType = ref(null)
const submitting = ref(false)
const searchTerm = ref('')
const filterStatus = ref('')

// Paginación
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = ref(20)
const totalRoomTypes = ref(0)

// Formulario
const form = reactive({
  name: '',
  code: '',
  description: '',
  max_capacity: 1
})

const errors = reactive({})

// Los tipos ya vienen filtrados desde la API
const filteredRoomTypes = computed(() => roomTypes.value)

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
const loadRoomTypes = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      per_page: perPage.value,
      search: searchTerm.value || undefined,
      filter: filterStatus.value || undefined
    }

    const response = await api.get('/room-types', { params })

    // Estructura esperada de Laravel con paginación
    roomTypes.value = response.data.data
    currentPage.value = response.data.current_page
    totalPages.value = response.data.last_page
    totalRoomTypes.value = response.data.total

  } catch (error) {
    console.error('Error cargando tipos de habitación:', error)

    // Sin datos disponibles
    roomTypes.value = []
    currentPage.value = 1
    totalPages.value = 1
    totalRoomTypes.value = 0
  } finally {
    loading.value = false
  }
}

const viewRoomType = (roomType) => {
  viewingRoomType.value = roomType
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  viewingRoomType.value = null
}

const editRoomTypeFromView = () => {
  if (viewingRoomType.value) {
    editingRoomType.value = viewingRoomType.value
    Object.assign(form, viewingRoomType.value)
    closeViewModal()
    showModal.value = true
  }
}

const openCreateForm = () => {
  editingRoomType.value = null
  resetForm()
  showModal.value = true
}

const editRoomType = (roomType) => {
  editingRoomType.value = roomType
  Object.assign(form, roomType)
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
    max_capacity: 1
  })
}

const submitForm = async () => {
  submitting.value = true
  Object.keys(errors).forEach(key => delete errors[key])

  try {
    if (editingRoomType.value) {
      // Actualizar tipo existente
      await api.put(`/room-types/${editingRoomType.value.id}`, form)
    } else {
      // Crear nuevo tipo
      await api.post('/room-types', form)
    }

    closeModal()
    // Recargar la lista para mostrar cambios
    await loadRoomTypes(currentPage.value)

  } catch (error) {
    console.error('Error guardando tipo de habitación:', error)
    if (error.response?.status === 422) {
      Object.assign(errors, error.response.data.errors || {})
    } else {
      alert('Error al guardar el tipo de habitación. Por favor intenta nuevamente.')
    }
  } finally {
    submitting.value = false
  }
}

const deleteRoomType = async (roomType) => {
  const confirmMessage = `¿Estás seguro de que deseas eliminar el tipo "${roomType.name}"?\n\nEsta acción no se puede deshacer.`

  if (!confirm(confirmMessage)) {
    return
  }

  loading.value = true
  try {
    // Eliminar tipo con la API real
    await api.delete(`/room-types/${roomType.id}`)

    // Recargar la lista para mostrar cambios
    await loadRoomTypes(currentPage.value)

    alert(`Tipo de habitación "${roomType.name}" eliminado correctamente`)
  } catch (error) {
    console.error('Error eliminando tipo de habitación:', error)
    alert('Error al eliminar el tipo de habitación. Por favor intenta nuevamente.')
  } finally {
    loading.value = false
  }
}

const restoreRoomType = async (roomType) => {
  const confirmMessage = `¿Estás seguro de que deseas restaurar el tipo "${roomType.name}"?`

  if (!confirm(confirmMessage)) {
    return
  }

  loading.value = true
  try {
    // Restaurar tipo con la API real
    await api.post(`/room-types/${roomType.id}/restore`)

    // Recargar la lista para mostrar cambios
    await loadRoomTypes(currentPage.value)

    alert(`Tipo de habitación "${roomType.name}" restaurado correctamente`)
  } catch (error) {
    console.error('Error restaurando tipo de habitación:', error)
    alert('Error al restaurar el tipo de habitación. Por favor intenta nuevamente.')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES')
}

// Funciones de búsqueda y filtros
const searchRoomTypes = () => {
  currentPage.value = 1
  loadRoomTypes(1)
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    loadRoomTypes(page)
  }
}

// Inicialización
onMounted(() => {
  loadRoomTypes()
})
</script>
