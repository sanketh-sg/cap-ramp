<template>
    <div class="app">
        <!-- Navigation Bar -->
        <nav class="navbar">
            <div class="nav-container">
                <router-link to="/" class="nav-brand">
                    ITIL Management
                </router-link>

                <div class="nav-menu" v-if="authStore.isAuthenticated">
                    <router-link to="/tickets" class="nav-link">
                        Tickets
                    </router-link>
                    <router-link to="/assets" class="nav-link">
                        Assets
                    </router-link>

                    <div class="nav-user">
                        <span class="user-name">{{ authStore.user?.name }}</span>
                        <span class="user-role">{{ authStore.user?.role }}</span>
                        <button @click="logout" class="btn btn-logout">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/useAuthStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Initialize auth on app load
authStore.initializeAuth()

const logout = async () => {
    await authStore.logout()
    router.push('/login')
}
</script>

<style scoped>
.app {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.navbar {
    background-color: #2c3e50;
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
    color: white;
    transition: opacity 0.2s;
}

.nav-brand:hover {
    opacity: 0.8;
}

.nav-menu {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-user {
    display: flex;
    align-items: center;
    gap: 1rem;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    padding-left: 1rem;
}

.user-name {
    font-weight: 600;
}

.user-role {
    font-size: 0.85rem;
    opacity: 0.8;
}

.btn-logout {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-logout:hover {
    background-color: #c0392b;
}

.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

@media (max-width: 768px) {
    .nav-menu {
        gap: 1rem;
    }

    .nav-user {
        flex-direction: column;
        gap: 0.5rem;
        border-left: none;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        padding: 1rem 0 0 0;
    }

    .user-role {
        display: none;
    }
}
</style>