<template>
  <div class="faq-content text-sm leading-relaxed">
    <template v-for="(block, index) in blocks" :key="index">
      
      <!-- Text Block -->
      <p 
        v-if="block.type === 'text'" 
        class="mb-4 text-gray-600 last:mb-0"
      >
        {{ block.value }}
      </p>

      <!-- List Block -->
      <ul 
        v-else-if="block.type === 'list'" 
        class="mb-4 pl-4 space-y-2 list-none"
      >
        <li 
          v-for="(item, itemIndex) in block.value" 
          :key="itemIndex"
          class="relative pl-5 text-gray-600"
        >
          <span class="absolute left-0 top-2 w-1.5 h-1.5 bg-[#6842FF] rounded-full"></span>
          {{ item }}
        </li>
      </ul>

      <!-- Image Block -->
      <div v-else-if="block.type === 'image'" class="my-4">
        <img 
          :src="getImageUrl(block.value)" 
          alt="Guide image" 
          class="rounded-lg w-full border border-gray-200 shadow-sm object-cover max-h-[500px]"
          loading="lazy"
        />
      </div>

    </template>
  </div>
</template>

<script setup>
/**
 * FaqRenderer.vue
 * Renders structured content blocks (text, lists, images) for an FAQ answer.
 */

const props = defineProps({
  blocks: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Helper to resolve image paths dynamically
const getImageUrl = (path) => {
  if (path.startsWith('http')) return path;
  
  // Clean up path - remove 'images/' prefix if it exists since we'll map it relative to assets
  const filename = path.replace(/^images\//, '');
  
  // In a real Vite app, we should use new URL(..., import.meta.url).href
  // Assuming images are in public/faq_data_master/images/ or similar.
  // Ideally, images should be moved to public/ for dynamic serving or imported if static.
  // For this implementation, we assume they are served from /faq_data_master/images/
  return `/faq_data_master/images/${filename}`;
};
</script>
