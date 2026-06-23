<template>
    <div class="ticket-list-view">
        <div class="header">
            <h1>Tickets</h1>
            <router-link to="/tickets/create" class="btn btn-primary">
                + Create New Ticket
            </router-link>
        </div>

        <!-- Filters -->
        <div class="filters">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search tickets..."
                class="search-input"
            />
            <select v-model="statusFilter" class="filter-select">
                <option value="">All Status</option>
                <option value="NEW">New</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
            </select>
            <select v-model="priorityFilter" class="filter-select">
                <option value="">All Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
            </select>
        </div>

        <!-- Loading & Empty States -->
        <div v-if="ticketStore.loading" class="loading">Loading tickets...</div>
        <div v-else-if="filteredTickets.length === 0" class="empty-state">
            No tickets found
        </div>

        <!-- Tickets Table -->
        <div v-else class="tickets-container">
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Requester</th>
                            <th>Assigned To</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="ticket in filteredTickets" :key="ticket.ID">
                            <td>{{ ticket.title }}</td>
                            <td>
                                <span :class="['status-badge', 'status-' + ticket.status]">
                                    {{ ticket.status }}
                                </span>
                            </td>
                            <td>
                                <span :class="['priority-badge', 'priority-' + ticket.priority]">
                                    {{ ticket.priority }}
                                </span>
                            </td>
                            <td>{{ ticket.requester?.firstName || 'N/A' }}</td>
                            <td>{{ ticket.assignedAgent?.firstName || 'Unassigned' }}</td>
                            <td>
                                <router-link :to="`/tickets/${ticket.ID}`" class="link">
                                    View
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useTicketStore } from '../stores/useTicketStore'

const ticketStore = useTicketStore()
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

const filteredTickets = computed(() => {
    let filtered = ticketStore.tickets

    if (searchQuery.value) {
        filtered = filtered.filter(t =>
            t.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    }

    if (statusFilter.value) {
        filtered = filtered.filter(t => t.status === statusFilter.value)
    }

    if (priorityFilter.value) {
        filtered = filtered.filter(t => t.priority === priorityFilter.value)
    }

    return filtered
})

onMounted(() => {
    ticketStore.fetchTickets()
})
</script>

<style scoped>
.ticket-list-view {
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

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

h1 {
    color: #2c3e50;
    margin: 0;
}

.btn {
    padding: 0.75rem 1.5rem;
    background-color: #667eea;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s;
}

.btn:hover {
    background-color: #5568d3;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.filters {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input,
.filter-select {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.95rem;
}

.search-input {
    flex: 1;
    min-width: 200px;
}

.filter-select {
    min-width: 150px;
}

.loading {
    text-align: center;
    padding: 2rem;
    color: #7f8c8d;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-state {
    text-align: center;
    padding: 2rem;
    color: #7f8c8d;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tickets-container {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-responsive {
    overflow-x: auto;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table thead {
    background-color: #f8f9fa;
}

.table th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #2c3e50;
    border-bottom: 2px solid #ecf0f1;
}

.table td {
    padding: 1rem;
    border-bottom: 1px solid #ecf0f1;
}

.table tbody tr:hover {
    background-color: #f8f9fa;
}

.status-badge,
.priority-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.85rem;
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
    cursor: pointer;
}

.link:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    .filters {
        flex-direction: column;
    }

    .search-input,
    .filter-select {
        width: 100%;
    }

    .table {
        font-size: 0.9rem;
    }

    .table th,
    .table td {
        padding: 0.75rem;
    }
}
</style>