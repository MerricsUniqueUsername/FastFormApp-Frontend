<template>

  <div id="app" class="h-screen w-screen flex flex-col relative overflow-hidden dark bg-neutral-950">

    <!-- View form -->
    <Form ref="form" @close="formPreviewOpen = false" v-if="formPreviewOpen" :form="form" />

    <!-- Element list -->
    <ElementList ref="element_list" v-show="elementListOpen" @addElement="handleAddElement" class="z-[200]" />

    <!-- Conditional builder -->
    <ConditionBuilder v-show="conditionBuilderOpen" @close="conditionBuilderOpen = false" :variables="variables" :form="form" :selectedId="selectedId" ref="condition_builder" class="absolute z-50" />

    <!-- Topbar -->
    <Topbar @openPreview="formPreviewOpen = true" class="relative" :form="form" />

    <!-- Body -->
    <div class="flex flex-col relative" style="height: calc(100% - 4rem);">
      <div class="flex flex-row relative overflow-hidden h-full">

        <!-- Left sidebar -->
        <LeftSidebar ref="left_sidebar" @select="selectElement" @openMenu="openMenu" :form="form" :selectedId="selectedId" />

        <!-- Main Content -->
        <FormPreview ref="form_preview" :form="form" @select="setSelectedId" />

        <!-- Right Sidebar -->
        <RightSidebar ref="right_sidebar" :form="form" @select="selectElement" @openConditionEditor="openConditionEditor" :selectedId="selectedId" />
        
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
import ConditionBuilder from './components/ConditionBuilder.vue';
import Form from './components/Form.vue';
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios';
import { debounce } from 'lodash';

export default {
  name: 'App',
  components: {
    RightSidebar,
    LeftSidebar,
    Topbar,
    FormPreview,
    ElementList,
    ConditionBuilder,
    Form,
  },

  // Provide
  provide() {
    return {
      formInteract: ref(this.formInteract),
    }
  },

  methods: {

    /**
     * Update variable list
     */
    getVariables() {
      const variables = new Set();

      this.form.elements.forEach((element) => {
        if(element.name)
          variables.add(element.name);
      });

      this.variables = Array.from(variables);
    },

    /**
     * Open condition builder
     * @param element 
     */
    openConditionEditor() {
      this.conditionBuilderOpen = true;
      this.$refs.condition_builder.loadConditions();
    },

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
      newElement.classIdPaths = [],

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

    /**
     * Load data from URL parameter
     */
    loadFromRouteParam() {
      if (this.routeVariable) {
        axios.get(`http://127.0.0.1:8000/form/${this.routeVariable}/`)
        .then(response => {
          const data = response.data;
          const formData = data.data;
          if(Object.keys(formData).length !== 0) {
            this.form = formData;
            this.formId = data.id;
            this.getVariables();
          }
        })
      }
    },

    /**
     * Save the form to the backend
     */
    save() {
      if (!this.formId) {
        console.error("Form ID is not set. Cannot save.");
        return;
      }

      axios.put(`http://127.0.0.1:8000/updateform/${this.formId}/`, this.form)
        .then(response => {
          console.log("Form saved successfully:", response.data);
        })
        .catch(error => {
          console.error("Error saving form:", error.response?.data || error.message);
        });
    },

    /**
     * Initialize the debounced save function
     */
    initAutosave() {
      // Create a debounced version of the save function that waits 2000ms (2 seconds)
      this.debouncedSave = debounce(() => {
        this.save();
      }, 2000);
      
      // Optionally add a visual indicator that changes are pending
      this.debouncedSave.pending = () => {
        return this.debouncedSave.isScheduled(); // This is a lodash debounce method
      };
    },
    
    /**
     * Trigger the autosave
     */
    triggerAutosave() {
      this.debouncedSave();
    },
    
    /**
     * Force an immediate save regardless of debounce timer
     */
    forceSave() {
      this.debouncedSave.flush(); // This immediately executes the save
    },
  },

  data() {
    return {
      debouncedSave: null,
      saveStatus: 'idle', // Can be 'idle', 'saving', 'saved', 'error'
      routeVariable: null,
      elementListOpen: false,
      selectedId: null,
      conditionBuilderOpen: false,
      formPreviewOpen: false,
      formInteract: true,
      formId: null,

      // Form data
      form: {
        title: 'Untitled form',
        description: '',
        highestId: 0,
        elements: [],
        css: '',
        theme: {
          "textColor": "5e5e5e",
          "headerColor": "000000",
          "accentColor": "4C9EFF",
          "inputBaseBackground": "ffffff",
          "borderColor": "cccccc",
          "placeholderColor": "888888",
          "hoverBackground": "f4f4f4",
          "hoverBorderColor": "666666",
          "hoverPlaceholderColor": "616161",
          "focusBorderColor": "1A73E8",
          "backgroundColor": "ffffff",
          "fontFamily": "Verdana",
          "inputFontSize": 16,
          "inputPadding": 12,
          "dropdownFontSize": 15,
          "dropdownPadding": 10,
          "dropdownShadowSize": "2.5",
          "questionSpacing": 16,
          "borderRadius": "5",
          "shadowSize": "0.5"
        },

      },

      // Variables in elements
      variables: [],

    }
  },

  setup() {
    // Get route in the setup function
    const route = useRoute();
    return { route };
  },

  mounted() {
    // Get the route parameter and store it
    this.routeVariable = this.route.params.variable;
    this.loadFromRouteParam();
    
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

    // Autosave
    this.initAutosave();

    // Also save before the user leaves the page
    window.addEventListener('beforeunload', () => {
      this.forceSave();
    });
    
  },

  // Watch for form changing and route changes
  watch: {
    form: {
      handler() {
        this.getVariables();
        this.triggerAutosave();
      },
      deep: true,
    },
    '$route.params.variable': {
      handler(newValue) {
        this.routeVariable = newValue;
        this.loadFromRouteParam();
      }
    }
  }

}
</script>