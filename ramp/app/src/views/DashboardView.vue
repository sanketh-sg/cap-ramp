<template>
    <div class="dashboard">
        <h1>Welcome, {{ authStore.user?.name }}!</h1>

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">{{ ticketStore.openTickets.length }}</div>
                <div class="stat-label">Open Tickets</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{{ ticketStore.resolvedTickets.length }}</div>
                <div class="stat-label">Resolved Tickets</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{{ assetStore.availableAssets.length }}</div>
                <div class="stat-label">Available Assets</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{{ assetStore.assignedAssets.length }}</div>
                <div class="stat-label">Assigned Assets</div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="button-group">
                <router-link to="/tickets/create" class="btn btn-primary">
                    + Create Ticket
                </router-link>
                <router-link to="/tickets" class="btn btn-secondary">
                    View All Tickets
                </router-link>
                <router-link to="/assets" class="btn btn-secondary">
                    Manage Assets
                </router-link>
            </div>
        </div>

        <!-- Recent Tickets -->
        <div class="recent-section">
            <h2>Recent Tickets</h2>
            <div v-if="ticketStore.loading" class="loading">Loading...</div>
            <div v-else-if="ticketStore.tickets.length === 0" class="empty-state">
                No tickets yet. <router-link to="/tickets/create">Create one</router-link>
            </div>
            <div v-else class="ticket-list">
                <div
                    v-for="ticket in ticketStore.tickets.slice(0, 5)"
                    :key="ticket.ID"
                    class="ticket-item"
                >
                    <div class="ticket-header">
                        <h3>{{ ticket.title }}</h3>
                        <span :class="['status-badge', 'status-' + ticket.status]">
                            {{ ticket.status }}
                        </span>
                    </div>
                    <p class="ticket-description">{{ ticket.description }}</p>
                    <div class="ticket-footer">
                        <span :class="['priority-badge', 'priority-' + ticket.priority]">
                            {{ ticket.priority }}
                        </span>
                        <router-link :to="`/tickets/${ticket.ID}`" class="link">
                            View Details →
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/useAuthStore'
import { useTicketStore } from '../stores/useTicketStore'
import { useAssetStore } from '../stores/useAssetStore'

const authStore = useAuthStore()
const ticketStore = useTicketStore()
const assetStore = useAssetStore()

onMounted(() => {
    ticketStore.fetchTickets()
    assetStore.fetchAssets()
})
</script>

<style scoped>
.dashboard {
    animation: slideIn 0.3s ease-in-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

h1 {
    color: #2c3e50;
    margin-bottom: 2rem;
}

h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.stat-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 0.5rem;
}

.stat-label {
    color: #7f8c8d;
    font-size: 0.9rem;
}

.quick-actions {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s;
    display: inline-block;
}

.btn-primary {
    background-color: #667eea;
    color: white;
}

.btn-primary:hover {
    background-color: #5568d3;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
    background-color: #ecf0f1;
    color: #2c3e50;
}

.btn-secondary:hover {
    background-color: #d5dbdb;
}

.recent-section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading {
    text-align: center;
    padding: 2rem;
    color: #7f8c8d;
}

.empty-state {
    text-align: center;
    padding: 2rem;
    color: #7f8c8d;
}

.empty-state a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
}

.ticket-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.ticket-item {
    border: 1px solid #ecf0f1;
    border-radius: 6px;
    padding: 1.5rem;
    transition: all 0.2s;
}

.ticket-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.ticket-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 0.5rem;
}

.ticket-header h3 {
    margin: 0;
    color: #2c3e50;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.status-NEW {
    background-color: #e3f2fd;
    color: #1976d2;
}

.status-ASSIGNED {
    background-color: #fff3e0;
    color: #f57c00;
}

.status-IN_PROGRESS {
    background-color: #f3e5f5;
    color: #7b1fa2;
}

.status-RESOLVED {
    background-color: #e8f5e9;
    color: #388e3c;
}

.status-CLOSED {
    background-color: #f5f5f5;
    color: #616161;
}

.ticket-description {
    color: #7f8c8d;
    margin: 0.5rem 0;
    font-size: 0.95rem;
}

.ticket-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
}

.priority-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
}

.priority-LOW {
    background-color: #c8e6c9;
    color: #1b5e20;
}

.priority-MEDIUM {
    background-color: #fff9c4;
    color: #f57f17;
}

.priority-HIGH {
    background-color: #ffccbc;
    color: #d84315;
}

.priority-CRITICAL {
    background-color: #ef9a9a;
    color: #b71c1c;
}

.link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
}

.link:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    .button-group {
        flex-direction: column;
    }

    .btn {
        width: 100%;
    }
}
</style>