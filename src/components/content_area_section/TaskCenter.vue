<template>
  <CategoryContent
    :category="category"
    :data-url="dataUrl || 'json-files/task_center.json'" />
</template>

<script setup>
  import CategoryContent from "./CategoryContent.vue";

  defineProps({
    category: {
      type: Object,
      default: null,
    },
    dataUrl: {
      type: String,
      default: null,
    },
  });
</script>
