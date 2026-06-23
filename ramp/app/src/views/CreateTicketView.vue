<template>
    <div class="create-ticket-view">
        <h1>Create New Ticket</h1>

        <form @submit.prevent="submitForm" class="form">
            <div class="form-group">
                <label for="title">Title *</label>
                <input
                    id="title"
                    v-model="form.title"
                    type="text"
                    placeholder="Brief description of the issue"
                    required
                />
            </div>

            <div class="form-group">
                <label for="description">Description *</label>
                <textarea
                    id="description"
                    v-model="form.description"
                    placeholder="Detailed description of the issue"
                    rows="5"
                    required
                ></textarea>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="priority">Priority</label>
                    <select id="priority" v-model="form.priority">
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="requester">Requester *</label>
                    <select id="requester" v-model="form.requester_ID" required>
                        <option value="">Select Requester</option>
                        <option :value="authStore.user?.id">
                            {{ authStore.user?.name }}
                        </option>
                    </select>
                </div>
            </div>

            <div v-if="error" class="error-message">
                {{ error }}
            </div>

            <div class="form-actions">
                <button type="submit" :disabled="loading" class="btn btn-primary">
                    {{ loading ? 'Creating...' : 'Create Ticket' }}
                </button>
                <router-link to="/tickets" class="btn btn-secondary">
                    Cancel
                </router-link>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'
import { useTicketStore } from '../stores/useTicketStore'

const router = useRouter()
const authStore = useAuthStore()
const ticketStore = useTicketStore()

const form = ref({
    title: '',
    description: '',
    priority: 'MEDIUM',
    requester_ID: authStore.user?.id
})

const loading = ref(false)
const error = ref('')

const submitForm = async () => {
    loading.value = true
    error.value = ''

    try {
        await ticketStore.createTicket(form.value)
        router.push('/tickets')
    } catch (err: any) {
        error.value = err.message || 'Failed to create ticket'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.create-ticket-view {
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

.form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 600px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 600;
    font-size: 0.95rem;
}

input,
textarea,
select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.95rem;
    font-family: inherit;
    transition: border-color 0.2s;
}

input:focus,
textarea:focus,
select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea {
    resize: vertical;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.error-message {
    color: #e74c3c;
    padding: 0.75rem;
    background-color: #fadbd8;
    border-left: 4px solid #e74c3c;
    margin-bottom: 1rem;
    border-radius: 4px;
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
}

.btn-primary {
    background-color: #667eea;
    color: white;
    flex: 1;
}

.btn-primary:hover:not(:disabled) {
    background-color: #5568d3;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-secondary {
    background-color: #ecf0f1;
    color: #2c3e50;
    flex: 1;
    text-align: center;
}

.btn-secondary:hover {
    background-color: #d5dbdb;
}

@media (max-width: 768px) {
    .form {
        padding: 1.5rem;
    }

    .form-row {
        grid-template-columns: 1fr;
    }

    .form-actions {
        flex-direction: column;
    }
}
</style>