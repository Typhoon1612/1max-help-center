<script setup>
  import { ref } from "vue";
  import TopBar from "./components/top_bar_section/TopBar.vue";
  import SideBar from "./components/side_bar_section/SideBar.vue";
  import ContentArea from "./components/content_area_section/ContentArea.vue";

  const selectedCategory = ref(null);
  const isSidebarOpen = ref(false);

  const handleCategorySelected = (category) => {
    selectedCategory.value = category;
  };

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  const closeSidebar = () => {
    isSidebarOpen.value = false;
  };
</script>

<template>
  <div class="bg-[#F1F4F9] min-h-screen">
    <div class="fixed top-0 left-0 right-0 z-50">
      <TopBar @toggle-sidebar="toggleSidebar" />
    </div>
    <div class="flex pt-[73px]">
      <SideBar
        :is-open="isSidebarOpen"
        @category-selected="handleCategorySelected"
        @close-sidebar="closeSidebar" />
      <main class="main-content">
        <ContentArea :selected-category="selectedCategory" />
      </main>
    </div>
  </div>
</template>

<style scoped>
  .main-content {
    flex: 1;
    padding: 1rem;
    margin-left: 250px;
  }

  @media (max-width: 767px) {
    .main-content {
      margin-left: 0;
    }
  }
</style>
