<!-- FilterLayout.vue -->
<template>
  <div class="mb-1" style="margin-bottom: 0.4rem">
    <label
      class="form-label small fw-semibold"
      style="font-size: 0.7rem; margin-bottom: 0.1rem"
      >{{ label }}</label
    >
    <div class="d-flex flex-wrap gap-1">
      <button
        v-for="item in items"
        :key="item"
        @click="toggleFilter(category, item)"
        :class="[
          'btn btn-sm py-1 px-2',
          filterState[category]?.includes(item)
            ? 'btn-secondary'
            : 'btn-outline-secondary',
        ]"
        style="font-size: 0.65rem; line-height: 1.1; white-space: nowrap"
      >
        {{ item }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  label: String,
  items: Array,
  category: String,
  filterState: Object,
  toggleFilter: Function,
});
</script>
