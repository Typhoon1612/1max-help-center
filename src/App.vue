<script setup>
  import { ref } from "vue";
  import TopBar from "./components/top_bar_section/TopBar.vue";
  import SideBar from "./components/side_bar_section/SideBar.vue";
  import ContentArea from "./components/content_area_section/ContentArea.vue";

  const selectedCategory = ref(null);

  const handleCategorySelected = (category) => {
    selectedCategory.value = category;
  };
</script>

<template>
  <div class="bg-[#F1F4F9] min-h-screen">
    <div class="fixed top-0 left-0 right-0 z-50">
      <TopBar />
    </div>
    <div class="flex pt-[73px]">
      <SideBar @category-selected="handleCategorySelected" />
      <main class="flex-1 p-4 ml-[250px]">
        <ContentArea :selected-category="selectedCategory" />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
