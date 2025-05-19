<template>
  <div class="w-1/5 bg-neutral-900 border-r border-neutral-800 overflow-auto h-screen flex flex-col">
    <div class="p-4 flex-1">
      <!-- Header with Add button -->
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <h2 class="text-gray-200 font-medium">Form Elements</h2>
        <button 
          @click="$emit('openMenu')" 
          class="text-white bg-blue-600 rounded-full w-8 h-8 flex justify-center items-center 
                 hover:bg-blue-500 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Add new element"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
          </svg>
        </button>
      </div>

      <!-- Search box -->
      <div class="relative mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search elements..."
          class="w-full bg-neutral-800 text-gray-300 text-sm rounded-md px-3 py-2 pl-8 border border-neutral-700
                 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <svg class="absolute left-2.5 top-2.5 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      <!-- Elements list -->
      <div class="space-y-2">
        <div
          v-for="(element, index) in filteredElements"
          :key="element.id"
          class="element p-3 flex items-center cursor-pointer rounded-md select-none transition-all duration-150"
          :class="[selectedId === element.id 
              ? 'bg-blue-600/20 border border-blue-500' 
              : 'bg-neutral-800 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/70']"
          draggable="true"
          @dragstart="startDrag(index)"
          @dragover.prevent="dragOver(index)"
          @drop="dropElement(index)"
          @mousedown="$emit('select', element)"
        >
          <div class="flex-shrink-0 !text-gray-300">
            <ElementLogo :type="element.type" :class="selectedId === element.id ? 'text-blue-400' : 'text-gray-400'" />
          </div>
          <div class="ml-3 flex-1 min-w-0">
            <p class="text-sm truncate font-medium" :class="selectedId === element.id ? 'text-blue-100' : 'text-gray-300'">
              {{ element.question || element.content || `Untitled Element` }}
            </p>
            <p class="text-xs truncate text-gray-500 mt-0.5">{{ element.type }}</p>
          </div>
          <div v-if="selectedId === element.id" class="ml-2 flex-shrink-0">
            <div class="h-4 w-1 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredElements.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
        <div class="bg-gray-800 p-3 rounded-full mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="9"></line>
            <line x1="9" y1="12" x2="15" y2="12"></line>
            <line x1="9" y1="15" x2="13" y2="15"></line>
          </svg>
        </div>
        <p class="text-gray-400 text-sm">No elements</p>
        <button 
          @click="$emit('openMenu')" 
          class="mt-3 text-blue-500 text-xs flex items-center hover:text-blue-400"
        >
          <span>Add a new element</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="ml-1" viewBox="0 0 16 16">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-auto py-3 px-4 border-t border-gray-800 bg-gray-900/50">
      <p class="text-xs text-gray-500">{{ form.elements ? form.elements.length : 0 }} elements</p>
    </div>
  </div>
</template>

<script>
import ElementLogo from './ElementLogo.vue';

export default {
  emits: ['openMenu', 'select'],
  name: 'LeftSidebar',
  inject: ['formInteract'],
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
      searchQuery: '',
    };
  },
  computed: {
    filteredElements() {
      if (!this.searchQuery) {
        return this.form.elements || [];
      }

      const query = this.searchQuery.toLowerCase();
      return this.form.elements.filter((el) => {
        const label = (el.question || el.content || 'Untitled Element').toLowerCase();
        const type = el.type.toLowerCase();
        return label.includes(query) || type.includes(query);
      });
    },
  },
  methods: {
    startDrag(index) {
      if (!this.formInteract) return;
      this.draggedElementIndex = index;
    },
    dragOver(targetIndex) {
      if (this.draggedElementIndex === null || this.draggedElementIndex === targetIndex) return;

      const dragged = this.form.elements[this.draggedElementIndex];
      this.form.elements.splice(this.draggedElementIndex, 1);
      this.form.elements.splice(targetIndex, 0, dragged);
      this.draggedElementIndex = targetIndex;
      this.$emit('select', dragged);
    },
    dropElement() {
      this.draggedElementIndex = null;
    },
  },
};
</script>
