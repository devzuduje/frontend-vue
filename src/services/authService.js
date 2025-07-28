import api from './api.js'

class AuthService {
  // Login del usuario
  async login(credentials) {
    try {
      console.log('Intentando login con API Laravel...')

      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      })

      console.log('Respuesta de API:', response.data)

      // Verificar si la respuesta es exitosa - ajustado para tu API
      if (response.data.token && response.data.user) {
        const { token, user } = response.data

        // Guardar token y datos del usuario
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_data', JSON.stringify(user))

        console.log('Login exitoso, token guardado:', {
          tokenLength: token.length,
          userName: user.name,
          tokenStored: !!localStorage.getItem('auth_token')
        })

        return {
          success: true,
          user,
          token,
          message: response.data.message || 'Login exitoso'
        }
      } else {
        return {
          success: false,
          message: response.data.message || 'Credenciales incorrectas'
        }
      }

    } catch (error) {
      console.error('Error en login:', error)

      // Manejar diferentes tipos de errores
      if (error.response?.status === 422) {
        // Errores de validación
        const errors = error.response.data.errors
        if (errors) {
          const firstError = Object.values(errors)[0][0]
          return { success: false, message: firstError }
        }
      }

      if (error.response?.status === 401) {
        return { success: false, message: 'Credenciales incorrectas' }
      }

      if (error.response?.data?.message) {
        return { success: false, message: error.response.data.message }
      }

      // Error de conexión
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        return {
          success: false,
          message: 'Error de conexión. Verifica que el servidor Laravel esté funcionando.'
        }
      }

      return {
        success: false,
        message: 'Error inesperado. Intenta nuevamente.'
      }
    }
  }

  // Logout del usuario
  async logout() {
    try {
      console.log('Cerrando sesión...')

      // Intentar cerrar sesión en el servidor
      await api.post('/auth/logout')
      console.log('Logout exitoso en servidor')

    } catch (error) {
      console.error('Error en logout:', error)
      // Continuar con limpieza local aunque falle el servidor
    } finally {
      // Limpiar datos locales siempre
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      console.log('Datos locales limpiados')
    }
  }

  // Verificar si está autenticado
  // Verificar si está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')

    console.log('Verificando autenticación:', {
      hasToken: !!token,
      hasUserData: !!userData,
      token: token ? token.substring(0, 20) + '...' : null
    })

    return !!(token && userData)
  }

  // Obtener usuario actual
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('user_data')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }

  // Obtener token
  getToken() {
    return localStorage.getItem('auth_token')
  }

  // Verificar token con el servidor
  async checkToken() {
    try {
      const response = await api.get('/user')
      return { success: true, user: response.data }
    } catch (error) {
      return { success: false }
    }
  }
}

export default new AuthService()
