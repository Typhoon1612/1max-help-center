<template>
  <div class="category-section">
    <SidebarItem
      v-for="item in categories"
      :key="item.id"
      :item="item"
      :selected-category="selectedCategory"
      @select-item="selectCategory" />
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import SidebarItem from "./SidebarItem.vue";

  const emit = defineEmits(["category-selected"]);

  const categories = ref([]);
  const selectedCategory = ref(null);
  const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_URL;

  const selectCategory = (category) => {
    selectedCategory.value = category.id;
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

      // Auto-select Account & Security on initial load
      const defaultCategory = findCategoryById(data, "acc_sec");
      if (defaultCategory) {
        selectCategory(defaultCategory);
      }
    } catch (error) {
      console.error("Failed to load sidebar configuration:", error);
    }
  };

  // Helper function to find category by id (handles nested children)
  const findCategoryById = (items, id) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findCategoryById(item.children, id);
        if (found) return found;
      }
    }
    return null;
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
</style>
