import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { assetAPI } from '../services/api'

export const useAssetStore = defineStore('asset', () => {
    const assets = ref<any[]>([])
    const categories = ref<any[]>([])
    const vendors = ref<any[]>([])
    const selectedAsset = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Computed
    const assetCount = computed(() => assets.value.length)
    const availableAssets = computed(() =>
        assets.value.filter(a => a.status === 'AVAILABLE')
    )
    const assignedAssets = computed(() =>
        assets.value.filter(a => a.status === 'ASSIGNED')
    )

    // Actions
    const fetchAssets = async (filter?: any) => {
        loading.value = true
        error.value = null
        try {
            const response = await assetAPI.getAssets(filter)
            assets.value = response.data.value || []
        } catch (err: any) {
            error.value = err.message
            console.error('Error fetching assets:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchAssetDetail = async (assetID: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await assetAPI.getAsset(assetID)
            selectedAsset.value = response.data
        } catch (err: any) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await assetAPI.getCategories()
            categories.value = response.data.value || []
        } catch (err: any) {
            console.error('Error fetching categories:', err)
        }
    }

    const fetchVendors = async () => {
        try {
            const response = await assetAPI.getVendors()
            vendors.value = response.data.value || []
        } catch (err: any) {
            console.error('Error fetching vendors:', err)
        }
    }

    const createAsset = async (data: any) => {
        loading.value = true
        try {
            const response = await assetAPI.createAsset(data)
            assets.value.push(response.data)
            return response.data
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const assignAsset = async (assetID: string, userID: string) => {
        try {
            await assetAPI.assignAsset(assetID, userID)
            await fetchAssetDetail(assetID)
            return true
        } catch (err: any) {
            error.value = err.message
            throw err
        }
    }

    const returnAsset = async (assignmentID: string) => {
        try {
            await assetAPI.returnAsset(assignmentID)
            await fetchAssets()
            return true
        } catch (err: any) {
            error.value = err.message
            throw err
        }
    }

    return {
        assets,
        categories,
        vendors,
        selectedAsset,
        loading,
        error,
        assetCount,
        availableAssets,
        assignedAssets,
        fetchAssets,
        fetchAssetDetail,
        fetchCategories,
        fetchVendors,
        createAsset,
        assignAsset,
        returnAsset
    }
})