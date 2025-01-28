<template>
  <div class="w-1/6 bg-gray-50 border-r border-r-gray-300 overflow-auto">
    <div class="p-4">

      <!-- Add element button -->
      <button @click="$emit('openMenu')" class="text-gray-500 text-sm border border-gray-400 w-full h-8 flex justify-center items-center 
                     hover:bg-black hover:text-white hover:border-black transition duration-150 mb-6 sticky">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
        </svg>
        Add element
      </button>

      <!-- Element list -->
      <div class="h-full">
        <div
          v-for="(element, index) in form.elements"
          :key="element.id"
          class="element bg-white p-4 mb-2 border border-gray-300 flex items-center cursor-pointer select-none"
          :class="{ '!border-blue-500 !bg-blue-50': selectedId === element.id }"
          draggable="true"
          @dragstart="startDrag(index)"
          @dragover.prevent="dragOver(index)"
          @drop="dropElement(index)"
          @mousedown="$emit('select', element)"
        >
          <ElementLogo :type="element.type" />
          <p class="text-sm text-ellipsis text-nowrap overflow-hidden ml-1 text-gray-700 user-select-none">
            {{ element.question || element.content }}
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import ElementLogo from './ElementLogo.vue';

export default {
  emits: ['openMenu', 'select'],
  components: {
    ElementLogo,
  },
  props: {
    form: {
      type: Object,
      required: true,
    },
    selectedId: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      draggedElementIndex: null,
    };
  },
  methods: {
    startDrag(index) {
      this.draggedElementIndex = index; // Save the index of the dragged item
    },
    dragOver(targetIndex) {
      if (this.draggedElementIndex === null || this.draggedElementIndex === targetIndex) {
        return;
      }

      // Move the dragged item in the array
      const draggedElement = this.form.elements[this.draggedElementIndex];
      this.form.elements.splice(this.draggedElementIndex, 1);
      this.form.elements.splice(targetIndex, 0, draggedElement);

      // Update the index of the dragged element
      this.draggedElementIndex = targetIndex;
      this.$emit('select', draggedElement);
    },
    dropElement() {
      // Clear the dragged index after dropping
      this.draggedElementIndex = null;
    },
  },
};
</script>
