<template>
  <div class="sidebar-item-wrapper">
    <!-- Flat item (no children) -->
    <div
      v-if="!item.children || item.children.length === 0"
      :class="['category-item', { selected: selectedCategory === item.id }]"
      @click="selectItem(item)">
      <div class="category-header">
        <span class="category-title">{{ item.title }}</span>
      </div>
    </div>

    <!-- Group item (has children) - Accordion -->
    <div
      v-else
      class="category-group">
      <div
        :class="['category-item', 'category-parent', { expanded: isExpanded }]"
        @click="toggleExpand">
        <div class="category-header">
          <span class="category-title">{{ item.title }}</span>
          <svg
            class="chevron-icon"
            :class="{ rotated: isExpanded }"
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

      <!-- Children items -->
      <transition name="accordion">
        <div
          v-show="isExpanded"
          class="category-children">
          <div
            v-for="child in item.children"
            :key="child.id"
            :class="[
              'category-item',
              'category-child',
              { selected: selectedCategory === child.id },
            ]"
            @click.stop="selectItem(child)">
            <div class="category-header">
              <span class="category-title">{{ child.title }}</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    selectedCategory: {
      type: String,
      default: null,
    },
  });

  const emit = defineEmits(["select-item"]);

  const isExpanded = ref(false);

  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
  };

  const selectItem = (item) => {
    emit("select-item", item);
  };
</script>

<style scoped>
  .sidebar-item-wrapper {
    margin-bottom: 0.5rem;
  }

  .category-item {
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
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

  .category-item:hover .category-title {
    color: #ffffff;
  }

  /* Parent (accordion trigger) styling */
  .category-parent {
    font-weight: 600;
  }

  .chevron-icon {
    color: #6b7280;
    transition:
      transform 0.3s ease,
      color 0.3s ease;
    flex-shrink: 0;
  }

  .chevron-icon.rotated {
    transform: rotate(180deg);
  }

  .category-item:hover .chevron-icon {
    color: #ffffff;
  }

  /* Children container */
  .category-children {
    overflow: hidden;
  }

  .category-child {
    margin-left: 1rem;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  /* Accordion transition */
  .accordion-enter-active,
  .accordion-leave-active {
    transition: all 0.3s ease;
    max-height: 500px;
  }

  .accordion-enter-from,
  .accordion-leave-to {
    max-height: 0;
    opacity: 0;
  }
</style>
