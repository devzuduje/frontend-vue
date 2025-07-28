<template>
  <div class="login-container">
    <div class="login-card">

      <!-- Header -->
      <div class="login-header">
        <div class="login-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-2 4h2M7 7h.01M7 11h.01M7 15h.01"></path>
          </svg>
        </div>
        <h1 class="login-title">Hotel Manager</h1>
        <p class="login-subtitle">Ingresa tus credenciales para acceder a la aplicación</p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleLogin" class="login-form">

        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :disabled="isLoading"
            class="form-input"
            placeholder="admin@hotel.com"
            autocomplete="email"
          />
          <div v-if="errors.email" class="field-error">
            {{ errors.email }}
          </div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password" class="form-label">Clave de Acceso</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            :disabled="isLoading"
            class="form-input"
            placeholder="••••••••"
            autocomplete="current-password"
          />
          <div v-if="errors.password" class="field-error">
            {{ errors.password }}
          </div>
        </div>

        <!-- Mensajes (error o éxito) -->
        <div v-if="generalError" :class="[isSuccess ? 'success-message' : 'error-message']">
          <!-- Ícono de éxito -->
          <svg v-if="isSuccess" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>

          <!-- Ícono de error -->
          <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>

          <span>{{ generalError }}</span>
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="btn-primary w-full"
        >
          <svg v-if="isLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isLoading ? 'Ingresando...' : 'Ingresar' }}</span>
        </button>
      </form>

      <!-- Footer -->
      <div class="login-footer">
        <p>Aplicación de gestión hotelera • Acceso restringido</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService.js'

const router = useRouter()

// Estado reactivo
const isLoading = ref(false)
const generalError = ref('')
const isSuccess = ref(false) // ✅ Nueva variable

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

// Función de login
const handleLogin = async () => {
  // Limpiar errores
  generalError.value = ''
  isSuccess.value = false // ✅ Reset
  errors.email = ''
  errors.password = ''

  // ... resto de validaciones igual ...

  try {
    isLoading.value = true

    const result = await authService.login({
      email: form.email,
      password: form.password
    })

    if (result.success) {
      console.log('Login exitoso:', result.user)

      isSuccess.value = true
      generalError.value = `¡Bienvenido ${result.user.name}! Redirigiendo...`

      // Redirección inmediata
      console.log('Navegando al dashboard...')
      await router.push('/dashboard')
      console.log('Redirección completada')
    } else {
      // ✅ Marcar como error
      isSuccess.value = false
      generalError.value = result.message
    }

  } catch (error) {
    console.error('Error inesperado:', error)
    isSuccess.value = false // ✅ Error
    generalError.value = 'Error inesperado. Verifica la conexión con el servidor.'
  } finally {
    isLoading.value = false
  }
}
</script>
