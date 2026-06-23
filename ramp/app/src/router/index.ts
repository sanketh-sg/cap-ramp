import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/tickets',
        name: 'Tickets',
        component: () => import('../views/TicketListView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/tickets/:id',
        name: 'TicketDetail',
        component: () => import('../views/TicketDetailView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/tickets/create',
        name: 'CreateTicket',
        component: () => import('../views/CreateTicketView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/assets',
        name: 'Assets',
        component: () => import('../views/AssetListView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/assets/:id',
        name: 'AssetDetail',
        component: () => import('../views/AssetDetailView.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
    } else if (to.path === '/login' && authStore.isAuthenticated) {
        next('/')
    } else {
        next()
    }
})

export default router