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
</style>
