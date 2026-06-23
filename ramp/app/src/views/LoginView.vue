<template>
    <div class="login-container">
        <div class="login-card">
            <h1>ITIL Management System</h1>
            <p class="subtitle">Local Development Login</p>

            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input
                        id="username"
                        v-model="username"
                        type="text"
                        placeholder="e.g., emp-001"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="role">Role</label>
                    <select v-model="role" id="role" required>
                        <option value="EMPLOYEE">Employee</option>
                        <option value="SUPPORT_AGENT">Support Agent</option>
                        <option value="ASSET_MANAGER">Asset Manager</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                <div class="test-accounts">
                    <p class="label">Quick Test Accounts:</p>
                    <div class="button-group">
                        <button
                            type="button"
                            @click="quickLogin('emp-001', 'EMPLOYEE')"
                            class="quick-btn"
                        >
                            👤 Employee
                        </button>
                        <button
                            type="button"
                            @click="quickLogin('agt-001', 'SUPPORT_AGENT')"
                            class="quick-btn"
                        >
                            🎟️ Support Agent
                        </button>
                        <button
                            type="button"
                            @click="quickLogin('mgr-001', 'ASSET_MANAGER')"
                            class="quick-btn"
                        >
                            📦 Asset Manager
                        </button>
                        <button
                            type="button"
                            @click="quickLogin('adm-001', 'ADMIN')"
                            class="quick-btn admin"
                        >
                            👨‍💼 Admin
                        </button>
                    </div>
                </div>

                <div v-if="error" class="error-message">
                    {{ error }}
                </div>

                <button
                    type="submit"
                    :disabled="loading"
                    class="btn btn-primary btn-block"
                >
                    {{ loading ? 'Logging in...' : 'Login' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('emp-001')
const role = ref('EMPLOYEE')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
    loading.value = true
    error.value = ''

    try {
        await authStore.login(username.value, 'password', role.value)
        router.push('/')
    } catch (err: any) {
        error.value = err.message || 'Login failed'
    } finally {
        loading.value = false
    }
}

const quickLogin = async (user: string, userRole: string) => {
    username.value = user
    role.value = userRole
    await handleLogin()
}
</script>

<style scoped>
.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
}

h1 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.subtitle {
    text-align: center;
    color: #7f8c8d;
    margin-bottom: 2rem;
    font-size: 0.9rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 600;
    font-size: 0.9rem;
}

input,
select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.95rem;
    transition: border-color 0.2s;
}

input:focus,
select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.test-accounts {
    margin: 1.5rem 0;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 4px;
    border: 1px solid #e9ecef;
}

.label {
    font-size: 0.85rem;
    color: #495057;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.button-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
}

.quick-btn {
    padding: 0.6rem 0.8rem;
    border: 1px solid #dee2e6;
    background-color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s;
}

.quick-btn:hover {
    background-color: #f1f3f5;
    border-color: #667eea;
}

.quick-btn.admin {
    background-color: #fff3cd;
    border-color: #ffc107;
}

.quick-btn.admin:hover {
    background-color: #ffe69c;
}

.error-message {
    color: #e74c3c;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background-color: #fadbd8;
    border-left: 4px solid #e74c3c;
}

.btn {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary {
    background-color: #667eea;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: #5568d3;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-block {
    width: 100%;
}
</style>