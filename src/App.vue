<template>
  <div id="app" class="h-screen w-screen flex flex-col relative overflow-hidden">

    <!-- Element list -->
    <ElementList ref="element_list" v-show="elementListOpen" @addElement="handleAddElement" class="z-50" />

    <!-- Topbar -->
    <Topbar class="relative" />

    <!-- Body -->
    <div class="flex flex-col relative" style="height: calc(100% - 4rem);">
      <div class="flex flex-row relative overflow-hidden h-full">

        <!-- Left sidebar -->
        <LeftSidebar ref="left_sidebar" @select="selectElement" @openMenu="openMenu" :form="form" :selectedId="selectedId" />

        <!-- Main Content -->
        <FormPreview ref="form_preview" :form="form" @select="setSelectedId" />

        <!-- Right Sidebar -->
        <RightSidebar ref="right_sidebar" :form="form" @select="selectElement" :selectedId="selectedId" />
        
      </div>
    </div>

  </div>
</template>

<script>
import RightSidebar from './components/RightSidebar.vue';
import LeftSidebar from './components/LeftSidebar.vue';
import Topbar from './components/Topbar.vue';
import FormPreview from './components/FormPreview.vue';
import ElementList from './components/ElementList.vue';
import AddQuestions from './components/AddQuestions.vue';

export default {
  name: 'App',
  components: {
    RightSidebar,
    LeftSidebar,
    Topbar,
    FormPreview,
    AddQuestions,
    ElementList,
  },

  methods: {

    /**
     * Set selected ID to highlight element in leftbar
     * @param element 
     */
    setSelectedId(element) {
      this.selectedId = element.id;
      this.$refs.right_sidebar.loadSelectedElement(element);
    },

    /**
     * Select element in form preview
     * @param element
     */
    selectElement(element) {
      this.$nextTick(() => {
        this.$refs.form_preview.selectElement(element);
        this.$refs.form_preview.updateSelector();
      });
    },

    /**
     * Add element to form
     * @param element 
     */
    handleAddElement(element) {
      const newElement = { ...element };
      newElement.id = this.form.highestId;
      newElement.name = '',
      newElement.conditions = [];
      this.form.highestId++;
      this.form.elements.push(newElement);
      this.closeMenu();
    },

    /**
     * Open element list menu
     */
    openMenu() {
      const elementList = this.$refs.element_list;
      const leftSidebar = this.$refs.left_sidebar;

      // Get rect of left sidebar
      const sidebarRect = leftSidebar.$el.getBoundingClientRect();

      // Move element list to the rect of the left sidebar
      elementList.$el.style.top = `${sidebarRect.top}px`;
      elementList.$el.style.left = `${sidebarRect.right}px`;

      this.elementListOpen = true;
    },

    /**
     * Close element list menu
     */
    closeMenu() {
      this.elementListOpen = false;
    },
  },

  data() {
    return {

      elementListOpen: false,
      selectedId: null,

      // Form data
      form: {
        title: 'Untitled form',
        description: '',
        highestId: 0,
        elements: [],
      }

    }
  },

  mounted() {
    
    // Add event listener to close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$refs.left_sidebar.$el.contains(e.target) && !this.$refs.element_list.$el.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Add event listener to close menu when resizing window
    window.addEventListener('resize', () => {
      this.closeMenu();
    });

  }
}
</script>



