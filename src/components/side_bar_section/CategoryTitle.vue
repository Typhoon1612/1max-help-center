<template>
  <div class="category-section">
    <div
      v-for="category in categories"
      :key="category.id"
      :class="['category-item', { selected: selectedCategory === category.id }]"
      @click="selectCategory(category.id)">
      <div class="category-header">
        <span class="category-title">{{ category.title }}</span>
        <svg
          class="chevron-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";

  const emit = defineEmits(["category-selected"]);

  const categories = ref([]);
  const selectedCategory = ref(null);
  const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_URL;

  const selectCategory = (categoryId) => {
    selectedCategory.value = categoryId;
    const category = categories.value.find((cat) => cat.id === categoryId);
    emit("category-selected", category);
  };

  const loadCategories = async () => {
    try {
      const url = `${cloudFrontUrl}/json-files/sidebar_config.json`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      categories.value = data;
    } catch (error) {
      console.error("Failed to load sidebar configuration:", error);
    }
  };

  onMounted(() => {
    loadCategories();
  });
</script>

<style scoped>
  .category-section {
    display: flex;
    flex-direction: column;
    margin-top: 1.5rem;
  }

  .category-item {
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    border-left: 3px solid transparent;
  }

  .category-item:hover {
    background-color: #6842ff;
    box-shadow:
      0 4px 6px -1px rgba(104, 66, 255, 0.3),
      0 2px 4px -1px rgba(104, 66, 255, 0.2);
  }

  .category-item.selected {
    background-color: #f3f4f6;
    border-left: 3px solid #6842ff;
  }

  .category-item.selected:hover {
    background-color: #6842ff;
  }

  .category-item.selected .category-title {
    color: #6842ff;
    font-weight: 700;
  }

  .category-item.selected .chevron-icon {
    color: #6842ff;
  }

  .category-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .category-title {
    font-family: "HarmonyOS_Sans", sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #000000;
    flex: 1;
    transition: color 0.3s ease;
  }

  .chevron-icon {
    color: #6b7280;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .category-item:hover .category-title {
    color: #ffffff;
  }

  .category-item:hover .chevron-icon {
    color: #ffffff;
  }
</style>
