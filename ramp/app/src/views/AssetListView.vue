<template>
    <div class="asset-list-view">
        <div class="header">
            <h1>Assets</h1>
        </div>

        <div v-if="assetStore.loading" class="loading">Loading assets...</div>
        <div v-else-if="assetStore.assets.length === 0" class="empty-state">
            No assets found
        </div>

        <div v-else class="assets-grid">
            <div v-for="asset in assetStore.assets" :key="asset.ID" class="asset-card">
                <h3>{{ asset.name }}</h3>
                <p>Tag: {{ asset.assetTag }}</p>
                <p>Serial: {{ asset.serialNumber }}</p>
                <span :class="['status-badge', 'status-' + asset.status]">
                    {{ asset.status }}
                </span>
                <router-link :to="`/assets/${asset.ID}`" class="link">
                    View Details →
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAssetStore } from '../stores/useAssetStore'

const assetStore = useAssetStore()

onMounted(() => {
    assetStore.fetchAssets()
})
</script>

<style scoped>
.asset-list-view {
    animation: slideIn 0.3s ease-in-out;
}

h1 {
    color: #2c3e50;
    margin-bottom: 2rem;
}

.loading {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 8px;
}

.empty-state {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    color: #7f8c8d;
}

.assets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}

.asset-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
}

.asset-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.asset-card h3 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
}

.asset-card p {
    margin: 0.5rem 0;
    color: #7f8c8d;
    font-size: 0.9rem;
}

.status-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
    margin: 1rem 0;
}

.status-AVAILABLE {
    background-color: #c8e6c9;
    color: #1b5e20;
}

.status-ASSIGNED {
    background-color: #fff3e0;
    color: #f57c00;
}

.status-IN_MAINTENANCE {
    background-color: #ffccbc;
    color: #d84315;
}

.status-RETIRED {
    background-color: #f5f5f5;
    color: #616161;
}

.link {
    display: block;
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    margin-top: 1rem;
}

.link:hover {
    text-decoration: underline;
}
</style>