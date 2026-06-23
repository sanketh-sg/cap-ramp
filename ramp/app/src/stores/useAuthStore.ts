import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI, identityAPI } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null)
    const isAuthenticated = ref(false)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Computed
    const isAdmin = computed(() => user.value?.role === 'ADMIN')
    const isSupportAgent = computed(() => user.value?.role === 'SUPPORT_AGENT')
    const isAssetManager = computed(() => user.value?.role === 'ASSET_MANAGER')

    // Check if user is logged in on app load
    const initializeAuth = async () => {
        const token = localStorage.getItem('auth_token')
        if (token) {
            try {
                const response = await identityAPI.getCurrentUser()
                user.value = response.data
                isAuthenticated.value = true
            } catch (err) {
                localStorage.removeItem('auth_token')
            }
        }
    }

    // Login action
    const login = async (username: string, password: string, role: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await authAPI.login(username, password, role)
            user.value = response.data.user
            isAuthenticated.value = true
            return response.data
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // Logout action
    const logout = async () => {
        try {
            await authAPI.logout()
            user.value = null
            isAuthenticated.value = false
        } catch (err: any) {
            error.value = err.message
        }
    }

    return {
        user,
        isAuthenticated,
        loading,
        error,
        isAdmin,
        isSupportAgent,
        isAssetManager,
        initializeAuth,
        login,
        logout
    }
})