import axios from 'axios'

const API_BASE = '/odata/v4'

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Add response error handler
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// ============ TICKETS ============

export const ticketAPI = {
    // Get all tickets
    getTickets(filter?: any) {
        const params = new URLSearchParams()
        if (filter?.status) params.append('$filter', `status eq '${filter.status}'`)
        if (filter?.priority) params.append('$filter', `priority eq '${filter.priority}'`)
        return api.get(`/ticketing-service/ServiceRequests?${params.toString()}`)
    },

    // Get single ticket with related data
    getTicket(ticketID: string) {
        return api.get(`/ticketing-service/ServiceRequests('${ticketID}')?$expand=comments,attachments,audits`)
    },

    // Create new ticket
    createTicket(data: any) {
        return api.post('/ticketing-service/ServiceRequests', {
            title: data.title,
            description: data.description,
            priority: data.priority,
            requester_ID: data.requester_ID
        })
    },

    // Assign ticket
    assignTicket(ticketID: string, agentID: string) {
        return api.post(`/ticketing-service/ServiceRequests('${ticketID}')/assignTicket`, {
            ticketID,
            agentID
        })
    },

    // Resolve ticket
    resolveTicket(ticketID: string, resolutionDetails: string) {
        return api.post(`/ticketing-service/ServiceRequests('${ticketID}')/resolveTicket`, {
            ticketID,
            resolutionDetails
        })
    },

    // Close ticket
    closeTicket(ticketID: string) {
        return api.post(`/ticketing-service/ServiceRequests('${ticketID}')/closeTicket`, {
            ticketID
        })
    },

    // Add comment
    addComment(ticketID: string, content: string) {
        return api.post(`/ticketing-service/ServiceRequests('${ticketID}')/addComment`, {
            ticketID,
            content
        })
    }
}

// ============ ASSETS ============

export const assetAPI = {
    // Get all assets
    getAssets(filter?: any) {
        const params = new URLSearchParams()
        if (filter?.status) params.append('$filter', `status eq '${filter.status}'`)
        return api.get(`/asset-service/Assets?${params.toString()}`)
    },

    // Get single asset with assignments
    getAsset(assetID: string) {
        return api.get(`/asset-service/Assets('${assetID}')?$expand=assignments`)
    },

    // Create new asset
    createAsset(data: any) {
        return api.post('/asset-service/Assets', {
            assetTag: data.assetTag,
            serialNumber: data.serialNumber,
            name: data.name,
            status: 'AVAILABLE',
            category_ID: data.category_ID,
            vendor_ID: data.vendor_ID,
            purchaseDate: data.purchaseDate
        })
    },

    // Assign asset to user
    assignAsset(assetID: string, userID: string) {
        return api.post(`/asset-service/Assets('${assetID}')/assignAssetToUser`, {
            assetID,
            userID
        })
    },

    // Return asset
    returnAsset(assignmentID: string) {
        return api.post(`/asset-service/AssetAssignments('${assignmentID}')/returnAsset`, {
            assignmentID
        })
    },

    // Get asset categories
    getCategories() {
        return api.get('/asset-service/AssetCategories')
    },

    // Get vendors
    getVendors() {
        return api.get('/asset-service/Vendors')
    }
}

// ============ USERS & IDENTITY ============

export const identityAPI = {
    // Get current user (mocked for now)
    getCurrentUser() {
        const mockUser = {
            id: localStorage.getItem('user_id') || 'emp-001',
            name: localStorage.getItem('user_name') || 'John Employee',
            role: localStorage.getItem('user_role') || 'EMPLOYEE',
            email: localStorage.getItem('user_email') || 'john@company.com'
        }
        return Promise.resolve({ data: mockUser })
    },

    // Get all users
    getUsers() {
        return api.get('/identity-service/Users')
    },

    // Get departments
    getDepartments() {
        return api.get('/identity-service/Departments')
    }
}

// ============ AUDIT LOGS ============

export const auditAPI = {
    // Get audit logs for a ticket
    getAuditLogs(ticketID: string) {
        return api.get(`/audit-service/AuditLogs?$filter=request_ID eq '${ticketID}'`)
    }
}

// ============ AUTHENTICATION ============

export const authAPI = {
    // Mock login for local development
    login(username: string, password: string, role: string) {
        // Store user info locally
        localStorage.setItem('auth_token', `mock-token-${Date.now()}`)
        localStorage.setItem('user_id', username)
        localStorage.setItem('user_name', username)
        localStorage.setItem('user_role', role)
        localStorage.setItem('user_email', `${username}@company.com`)

        return Promise.resolve({
            data: {
                success: true,
                user: {
                    id: username,
                    name: username,
                    role: role,
                    email: `${username}@company.com`
                }
            }
        })
    },

    logout() {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('user_name')
        localStorage.removeItem('user_role')
        localStorage.removeItem('user_email')
        return Promise.resolve()
    }
}

export default api