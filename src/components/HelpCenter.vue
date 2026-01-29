<template>
  <div class="min-h-screen bg-[#F1F4F9] font-sans">
    
    <!-- Top Navigation Placeholder (Optional) -->
    <nav class="bg-white border-b border-gray-200 px-6 py-4 shadow-sm mb-8">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">1MAX Help Center</h1>
        <div class="relative">
          <input 
            type="text" 
            placeholder="Search for answers..." 
            class="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6842FF] focus:ring-1 focus:ring-[#6842FF] text-sm w-64 transition-all"
            v-model="searchQuery"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Left Column: Categories Sidebar -->
        <aside class="w-full lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-sm p-4 sticky top-8">
            <h2 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Categories</h2>
            <nav class="space-y-1">
              <button
                v-for="cat in categories"
                :key="cat.id"
                @click="selectCategory(cat)"
                class="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out flex items-center justify-between group"
                :class="[
                  selectedCategory?.id === cat.id 
                    ? 'bg-[#6842FF]/10 text-[#6842FF]' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                ]"
              >
                <span>{{ cat.name }}</span>
                <span 
                  v-if="selectedCategory?.id === cat.id" 
                  class="w-1.5 h-1.5 rounded-full bg-[#6842FF]"
                ></span>
              </button>
            </nav>
          </div>
        </aside>

        <!-- Right Column: Content Area -->
        <main class="flex-1 min-w-0">
          
          <!-- Category Header -->
          <div class="mb-6">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">
              {{ selectedCategory ? selectedCategory.name : 'Select a Category' }}
            </h2>
            <p class="text-gray-500 text-sm">
              Find answers and step-by-step guides for {{ selectedCategory ? selectedCategory.name.toLowerCase() : 'our platform' }}.
            </p>
          </div>

          <!-- FAQ List Accordion -->
          <div v-if="loading" class="space-y-4">
            <div v-for="n in 3" :key="n" class="bg-white p-6 rounded-lg shadow-sm animate-pulse h-24"></div>
          </div>

          <div v-else-if="faqs.length > 0" class="space-y-4">
            <div 
              v-for="faq in filteredFaqs" 
              :key="faq.id"
              class="bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-200 transition-all duration-200 overflow-hidden"
            >
              <!-- Accordion Header -->
              <button
                @click="toggleFaq(faq.id)"
                class="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
              >
                <span class="font-semibold text-gray-900 pr-8">{{ faq.question }}</span>
                <span 
                  class="flex-shrink-0 ml-2 transform transition-transform duration-200 text-gray-400"
                  :class="{ 'rotate-180': openFaqId === faq.id }"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </button>

              <!-- Accordion Content -->
              <div 
                v-show="openFaqId === faq.id"
                class="px-6 pb-6 pt-0 border-t border-gray-50/50"
              >
                <div class="pt-4">
                  <FaqRenderer :blocks="faq.blocks" />
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12 bg-white rounded-lg shadow-sm">
            <div class="text-gray-400 text-5xl mb-4">📂</div>
            <h3 class="text-lg font-medium text-gray-900">No FAQs found</h3>
            <p class="text-gray-500 mt-1">Select a category or try a different search.</p>
          </div>

        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import FaqRenderer from './FaqRenderer.vue';

// --- State ---
const selectedCategory = ref(null);
const faqs = ref([]);
const loading = ref(false);
const openFaqId = ref(null);
const searchQuery = ref('');

// --- Category Config ---
// Maps friendly names to the JSON filenames we found in your workspace
const categories = [
  { id: 'account', name: 'Account & Security', file: 'account_security.json' },
  { id: 'deposit', name: 'Deposit & Withdrawal', file: 'deposit_withdrawal.json' },
  { id: 'spot', name: 'Spot Trading', file: 'spot_trading.json' },
  { id: 'futures', name: 'Futures Trading', file: 'futures_trading.json' },
  { id: 'copy_spot', name: 'Spot Copy Trading', file: 'spot_copy_trading.json' },
  { id: 'copy_future', name: 'Futures Copy Trading', file: 'futures_copy_trading.json' },
  { id: 'grid', name: 'Grid Trading', file: 'grid_trading.json' },
  { id: 'task', name: 'Task Center', file: 'task_center.json' },
  { id: 'staking', name: 'Staking', file: 'staking.json' },
  { id: 'margin', name: 'Margin', file: 'margin.json' },
  { id: 'fiat', name: 'Fiat 2 Crypto', file: 'fiat_crypto.json' },
  { id: 'aml', name: 'Anti Money Laundering', file: 'aml.json' },
  { id: 'app', name: 'Download App', file: 'download_app.json' },
  { id: 'crypto', name: 'Market Info', file: 'all_cryptocurrency.json' },
  { id: 'promo', name: 'Promotions', file: 'promotion_program.json' },
];

/**
 * Fetch FAQs for a specific JSON file
 */
const fetchFaqs = async (filename) => {
  loading.value = true;
  faqs.value = [];
  openFaqId.value = null; // Reset open accordion
  
  try {
    // In strict Vite dev, we need to ensure the path is correct. 
    // Assuming /faq_data_master is in the public folder or served at root.
    // Based on workspace, it seems `faq_data_master` is at root. 
    // We might need to move it to `public/` or import dynamically if using standard Vite assets.
    // For now, attempting relative fetch assuming asset serving configuration.
    const response = await fetch(`/faq_data_master/json-files/${filename}`);
    
    if (!response.ok) throw new Error('Failed to load FAQs');
    
    const data = await response.json();
    faqs.value = data.faqs || [];
  } catch (err) {
    console.error(`Error loading ${filename}:`, err);
    faqs.value = []; 
  } finally {
    loading.value = false;
  }
};

/**
 * Handle Category Selection
 */
const selectCategory = (category) => {
  if (selectedCategory.value?.id === category.id) return;
  selectedCategory.value = category;
  fetchFaqs(category.file);
};

/**
 * Toggle Accordion
 */
const toggleFaq = (id) => {
  openFaqId.value = openFaqId.value === id ? null : id;
};

// --- Computed ---
const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs.value;
  const q = searchQuery.value.toLowerCase();
  return faqs.value.filter(f => 
    f.question.toLowerCase().includes(q) || 
    // Simple block search content
    f.blocks.some(b => 
      (typeof b.value === 'string' && b.value.toLowerCase().includes(q)) ||
      (Array.isArray(b.value) && b.value.some(s => s.toLowerCase().includes(q)))
    )
  );
});

// --- Init ---
onMounted(() => {
  // Default to first category
  if (categories.length > 0) {
    selectCategory(categories[0]);
  }
});
</script>

<style scoped>
/* Custom Scrollbar for Sidebar if needed */
aside nav::-webkit-scrollbar {
  width: 4px;
}
aside nav::-webkit-scrollbar-track {
  background: transparent;
}
aside nav::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}
</style>
