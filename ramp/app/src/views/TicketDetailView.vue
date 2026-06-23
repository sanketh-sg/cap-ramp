<template>
    <div class="ticket-detail-view">
        <router-link to="/tickets" class="back-link">← Back to Tickets</router-link>

        <div v-if="ticketStore.loading" class="loading">Loading ticket...</div>
        <div v-else-if="!ticket" class="error-message">Ticket not found</div>

        <div v-else class="ticket-detail">
            <!-- Header -->
            <div class="detail-header">
                <div>
                    <h1>{{ ticket.title }}</h1>
                    <p class="ticket-id">ID: {{ ticket.ID }}</p>
                </div>
                <div class="status-section">
                    <span :class="['status-badge', 'status-' + ticket.status]">
                        {{ ticket.status }}
                    </span>
                    <span :class="['priority-badge', 'priority-' + ticket.priority]">
                        {{ ticket.priority }}
                    </span>
                </div>
            </div>

            <div class="detail-grid">
                <!-- Main Content -->
                <div class="main-content">
                    <!-- Description -->
                    <section class="section">
                        <h3>Description</h3>
                        <p>{{ ticket.description }}</p>
                    </section>

                    <!-- Comments -->
                    <section class="section">
                        <h3>Comments</h3>
                        <div class="comments-list">
                            <div v-if="ticket.comments?.length === 0" class="empty">
                                No comments yet
                            </div>
                            <div v-for="comment in ticket.comments" :key="comment.ID" class="comment">
                                <div class="comment-header">
                                    <strong>{{ comment.author?.firstName || 'Unknown' }}</strong>
                                    <span class="comment-date">
                                        {{ formatDate(comment.createdAt) }}
                                    </span>
                                </div>
                                <p>{{ comment.content }}</p>
                            </div>
                        </div>

                        <!-- Add Comment Form -->
                        <div v-if="canComment" class="add-comment">
                            <textarea
                                v-model="newComment"
                                placeholder="Add a comment..."
                                rows="3"
                            ></textarea>
                            <button
                                @click="submitComment"
                                :disabled="!newComment.trim() || commentLoading"
                                class="btn btn-primary"
                            >
                                {{ commentLoading ? 'Adding...' : 'Add Comment' }}
                            </button>
                        </div>
                    </section>
                </div>

                <!-- Sidebar -->
                <aside class="sidebar">
                    <div class="info-card">
                        <h4>Details</h4>
                        <div class="info-row">
                            <label>Requester:</label>
                            <span>{{ ticket.requester?.firstName || 'Unknown' }}</span>
                        </div>
                        <div class="info-row">
                            <label>Assigned To:</label>
                            <span>
                                {{ ticket.assignedAgent?.firstName || 'Unassigned' }}
                            </span>
                        </div>
                        <div class="info-row">
                            <label>Created:</label>
                            <span>{{ formatDate(ticket.createdAt) }}</span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="actions-card" v-if="canManage">
                        <h4>Actions</h4>
                        <button
                            v-if="ticket.status === 'NEW'"
                            @click="assignTicket"
                            :disabled="actionLoading"
                            class="btn btn-primary btn-block"
                        >
                            {{ actionLoading ? 'Assigning...' : 'Assign to Me' }}
                        </button>

                        <button
                            v-if="ticket.status === 'ASSIGNED'"
                            @click="openResolveModal"
                            :disabled="actionLoading"
                            class="btn btn-primary btn-block"
                        >
                            Resolve
                        </button>

                        <button
                            v-if="ticket.status === 'RESOLVED'"
                            @click="closeTicket"
                            :disabled="actionLoading"
                            class="btn btn-primary btn-block"
                        >
                            {{ actionLoading ? 'Closing...' : 'Close' }}
                        </button>
                    </div>
                </aside>
            </div>

            <!-- Resolve Modal -->
            <div v-if="showResolveModal" class="modal-overlay" @click="closeResolveModal">
                <div class="modal" @click.stop>
                    <h3>Resolve Ticket</h3>
                    <textarea
                        v-model="resolutionDetails"
                        placeholder="Enter resolution details..."
                        rows="4"
                    ></textarea>
                    <div class="modal-actions">
                        <button
                            @click="submitResolve"
                            :disabled="!resolutionDetails.trim() || actionLoading"
                            class="btn btn-primary"
                        >
                            {{ actionLoading ? 'Resolving...' : 'Resolve' }}
                        </button>
                        <button @click="closeResolveModal" class="btn btn-secondary">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTicketStore } from '../stores/useTicketStore'
import { useAuthStore } from '../stores/useAuthStore'

const route = useRoute()
const ticketStore = useTicketStore()
const authStore = useAuthStore()

const newComment = ref('')
const commentLoading = ref(false)
const actionLoading = ref(false)
const showResolveModal = ref(false)
const resolutionDetails = ref('')

const ticketID = route.params.id as string
const ticket = computed(() => ticketStore.selectedTicket)
const canComment = computed(
    () => authStore.isAuthenticated && ticket.value?.status !== 'CLOSED'
)
const canManage = computed(
    () =>
        (authStore.isSupportAgent || authStore.isAdmin) &&
        ticket.value?.status !== 'CLOSED'
)

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const submitComment = async () => {
    commentLoading.value = true
    try {
        await ticketStore.addComment(ticketID, newComment.value)
        newComment.value = ''
    } catch (err) {
        console.error('Error adding comment:', err)
    } finally {
        commentLoading.value = false
    }
}

const assignTicket = async () => {
    actionLoading.value = true
    try {
        await ticketStore.assignTicket(ticketID, authStore.user?.id)
    } catch (err) {
        console.error('Error assigning ticket:', err)
    } finally {
        actionLoading.value = false
    }
}

const openResolveModal = () => {
    showResolveModal.value = true
}

const closeResolveModal = () => {
    showResolveModal.value = false
    resolutionDetails.value = ''
}

const submitResolve = async () => {
    actionLoading.value = true
    try {
        await ticketStore.resolveTicket(ticketID, resolutionDetails.value)
        closeResolveModal()
    } catch (err) {
        console.error('Error resolving ticket:', err)
    } finally {
        actionLoading.value = false
    }
}

const closeTicket = async () => {
    if (confirm('Are you sure you want to close this ticket?')) {
        actionLoading.value = true
        try {
            await ticketStore.closeTicket(ticketID)
        } catch (err) {
            console.error('Error closing ticket:', err)
        } finally {
            actionLoading.value = false
        }
    }
}

onMounted(() => {
    ticketStore.fetchTicketDetail(ticketID)
})
</script>

<style scoped>
.ticket-detail-view {
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

.back-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    margin-bottom: 1.5rem;
    display: inline-block;
}

.back-link:hover {
    text-decoration: underline;
}

.loading,
.error-message {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-message {
    color: #e74c3c;
}

.detail-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.detail-header h1 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
}

.ticket-id {
    color: #7f8c8d;
    font-size: 0.9rem;
    margin: 0;
}

.status-section {
    display: flex;
    gap: 0.5rem;
}

.status-badge,
.priority-badge {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
    white-space: nowrap;
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

.detail-grid {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 2rem;
}

.section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section h3 {
    color: #2c3e50;
    margin-top: 0;
    margin-bottom: 1rem;
}

.section p {
    color: #555;
    line-height: 1.6;
    margin: 0;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.comment {
    border-left: 3px solid #667eea;
    padding-left: 1rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.comment strong {
    color: #2c3e50;
}

.comment-date {
    font-size: 0.85rem;
    color: #7f8c8d;
}

.comment p {
    margin: 0.5rem 0 0 0;
    color: #555;
}

.empty {
    text-align: center;
    color: #7f8c8d;
    padding: 1rem;
}

.add-comment {
    border-top: 1px solid #ecf0f1;
    padding-top: 1rem;
}

.add-comment textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    margin-bottom: 0.5rem;
}

.sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.info-card,
.actions-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-card h4,
.actions-card h4 {
    margin-top: 0;
    color: #2c3e50;
}

.info-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid #ecf0f1;
    font-size: 0.95rem;
}

.info-row:last-child {
    border-bottom: none;
}

.info-row label {
    font-weight: 600;
    color: #2c3e50;
}

.info-row span {
    color: #7f8c8d;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
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

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-block {
    width: 100%;
    margin-bottom: 0.5rem;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal h3 {
    color: #2c3e50;
    margin-top: 0;
}

.modal textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    margin-bottom: 1.5rem;
}

.modal-actions {
    display: flex;
    gap: 1rem;
}

.btn-secondary {
    background-color: #ecf0f1;
    color: #2c3e50;
    flex: 1;
}

.btn-secondary:hover {
    background-color: #d5dbdb;
}

@media (max-width: 768px) {
    .detail-header {
        flex-direction: column;
        gap: 1rem;
    }

    .detail-grid {
        grid-template-columns: 1fr;
    }

    .modal {
        width: 95%;
    }
}
</style>