<template>
    <div class="asset-detail-view">
        <router-link to="/assets" class="back-link">← Back to Assets</router-link>
        <div v-if="assetStore.loading" class="loading">Loading asset...</div>
        <div v-else-if="!asset" class="error-message">Asset not found</div>
        <div v-else class="asset-detail">
            <h1>{{ asset.name }}</h1>
            <div class="info-grid">
                <div>
                    <p><strong>Asset Tag:</strong> {{ asset.assetTag }}</p>
                    <p><strong>Serial:</strong> {{ asset.serialNumber }}</p>
                    <p><strong>Status:</strong> 
                        <span :class="['status-badge', 'status-' + asset.status]">
                            {{ asset.status }}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAssetStore } from '../stores/useAssetStore'

const route = useRoute()
const assetStore = useAssetStore()
const assetID = route.params.id as string
const asset = computed(() => assetStore.selectedAsset)

onMounted(() => {
    assetStore.fetchAssetDetail(assetID)
})
</script>

<style scoped>
.back-link {
    color: #667eea;
    text-decoration: none;
    display: inline-block;
    margin-bottom: 1.5rem;
}

h1 {
    color: #2c3e50;
}

.asset-detail {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 1.5rem;
}

p {
    margin: 0.75rem 0;
    color: #555;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
}

.status-AVAILABLE {
    background-color: #c8e6c9;
    color: #1b5e20;
}

.status-ASSIGNED {
    background-color: #fff3e0;
    color: #f57c00;
}
</style>