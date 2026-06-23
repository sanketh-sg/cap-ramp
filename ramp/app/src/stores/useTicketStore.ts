import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ticketAPI } from '../services/api'

export const useTicketStore = defineStore('ticket', () => {
    const tickets = ref<any[]>([])
    const selectedTicket = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Computed
    const ticketCount = computed(() => tickets.value.length)
    const openTickets = computed(() => 
        tickets.value.filter(t => ['NEW', 'ASSIGNED', 'IN_PROGRESS'].includes(t.status))
    )
    const resolvedTickets = computed(() => 
        tickets.value.filter(t => t.status === 'RESOLVED')
    )

    // Actions
    const fetchTickets = async (filter?: any) => {
        loading.value = true
        error.value = null
        try {
            const response = await ticketAPI.getTickets(filter)
            tickets.value = response.data.value || []
        } catch (err: any) {
            error.value = err.message
            console.error('Error fetching tickets:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchTicketDetail = async (ticketID: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await ticketAPI.getTicket(ticketID)
            selectedTicket.value = response.data
        } catch (err: any) {
            error.value = err.message
            console.error('Error fetching ticket:', err)
        } finally {
            loading.value = false
        }
    }

    const createTicket = async (data: any) => {
        loading.value = true
        error.value = null
        try {
            const response = await ticketAPI.createTicket(data)
            tickets.value.push(response.data)
            return response.data
        } catch (err: any) {
            error.value = err.message
            console.error('Error creating ticket:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const assignTicket = async (ticketID: string, agentID: string) => {
        try {
            await ticketAPI.assignTicket(ticketID, agentID)
            // Refresh the ticket
            await fetchTicketDetail(ticketID)
            return true
        } catch (err: any) {
            error.value = err.message
            console.error('Error assigning ticket:', err)
            throw err
        }
    }

    const resolveTicket = async (ticketID: string, details: string) => {
        try {
            await ticketAPI.resolveTicket(ticketID, details)
            await fetchTicketDetail(ticketID)
            return true
        } catch (err: any) {
            error.value = err.message
            throw err
        }
    }

    const closeTicket = async (ticketID: string) => {
        try {
            await ticketAPI.closeTicket(ticketID)
            await fetchTicketDetail(ticketID)
            return true
        } catch (err: any) {
            error.value = err.message
            throw err
        }
    }

    const addComment = async (ticketID: string, content: string) => {
        try {
            await ticketAPI.addComment(ticketID, content)
            await fetchTicketDetail(ticketID)
            return true
        } catch (err: any) {
            error.value = err.message
            throw err
        }
    }

    return {
        tickets,
        selectedTicket,
        loading,
        error,
        ticketCount,
        openTickets,
        resolvedTickets,
        fetchTickets,
        fetchTicketDetail,
        createTicket,
        assignTicket,
        resolveTicket,
        closeTicket,
        addComment
    }
})