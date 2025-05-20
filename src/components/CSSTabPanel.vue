<template>
  <div class="p-4">
    <div class="p-3 border border-neutral-700 rounded-sm">
      <p class="!mt-0">Select element</p>
      <div class="border border-blue-600 bg-blue-600/20 bg-blue-100 p-1 text-blue-500 flex items-center justify-center rounded-sm cursor-pointer hover:bg-blue-500/30 transition-all duration-300"
          :class="{'!bg-green-900 !border-green-600 text-green-400' : picking}"
          @click="setPickMode()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-index" viewBox="0 0 16 16">
          <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 1 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 0 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.035a.5.5 0 0 1-.416-.223l-1.433-2.15a1.5 1.5 0 0 1-.243-.666l-.345-3.105a.5.5 0 0 1 .399-.546L5 8.11V9a.5.5 0 0 0 1 0V1.75A.75.75 0 0 1 6.75 1M8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v5.34l-1.2.24a1.5 1.5 0 0 0-1.196 1.636l.345 3.106a2.5 2.5 0 0 0 .405 1.11l1.433 2.15A1.5 1.5 0 0 0 6.035 16h6.385a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5 5 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.6 2.6 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046zm2.094 2.025"/>
        </svg>
      </div>

      <div v-show="highlightElement">
        <p class="!mt-2 pt-0">CLASS</p>
        <input @change="updateComponent()" @input="updateElement('class')" ref="elementClass" type="text">
        <p class="!mt-2">ID</p>
        <input @change="updateComponent()" @input="updateElement('id')" ref="elementID" type="text" class="mb-2">
      </div>
    </div>

    <div ref="highlight" class="fixed border border-purple-500 bg-purple-200 bg-opacity-25 pointer-events-none" style="display: none;"
          :class="{'!bg-orange-300 !border-orange-600 !bg-opacity-25' : highlightElement}"></div>
    
    <AceEditor @input="updateHighlighter()" v-model="cssValue" class="shadow-sm rounded-md mt-4" />

    <p>Color picker</p>
    <ColorPicker />
  </div>
</template>

<script>
import AceEditor from './AceEditor.vue';
import ColorPicker from './ColorPicker.vue';

export default {
  name: 'CSSTabPanel',
  components: {
    AceEditor,
    ColorPicker
  },
  inject: ['formInteract'],
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      highlightElement: null,
      picking: false,
      classPrevValue: '',
      idPrevValue: ''
    };
  },
  computed: {
    cssValue: {
      get() {
        return this.form.css;
      },
      set(value) {
        this.$emit('update:form', { ...this.form, css: value });
      }
    }
  },
  methods: {
    updateComponent() {
      const element = this.highlightElement;

      // Get the Vue element the selected element is in
      let elementNode = element.__vueParentComponent;
      
      // Get element node parent until it is a FormElement
      while (elementNode.type.name !== 'FormElement') {
        elementNode = elementNode.parent;
      }

      elementNode = elementNode.proxy;
      elementNode.updateHTMLStructure();
    },

    updateElement(tag) {
      const element = this.highlightElement;
      const elementClass = this.$refs.elementClass.value;
      const elementID = this.$refs.elementID.value;

      if (element) {
        if (tag === 'class') {
          if (elementClass) {
            element.setAttribute('givenClass', elementClass);
          } else {
            element.removeAttribute('givenClass');
          }

          if (this.classPrevValue === '') {
            element.classList.add(elementClass);
          } else {
            let regex = new RegExp(this.classPrevValue + '$');
            element.className = element.className.replace(regex, elementClass);
          }
          
          this.classPrevValue = elementClass;
        }
        
        if (tag === 'id') {
          if (elementID) {
            element.setAttribute('givenId', elementID);
          } else {
            element.removeAttribute('givenId');
          }

          if (this.idPrevValue === '') {
            element.id = elementID;
          } else {
            let regex = new RegExp(this.idPrevValue + '$');
            element.id = element.id.replace(regex, elementID);
          }
          
          this.idPrevValue = elementID;
        }
      }
    },

    setPickMode() {
      this.highlightElement = null;
      this.picking = true;
      this.$refs.highlight.style.display = 'none';

      // Store bound function references
      this.handleMouseMove = (event) => this.highlight(event);
      this.handleClick = (event) => this.pickSelect(event);
      this.highlightUpdate = (event) => this.updateHighlighter(event);

      // Add listeners with stored references
      addEventListener("resize", this.highlightUpdate);
      document.querySelector('#content').addEventListener("scroll", this.highlightUpdate);
      document.addEventListener('mousemove', this.handleMouseMove);
      
      this.$nextTick(() => {
        document.addEventListener('mousedown', this.handleClick);
      });
    },

    highlight(event) {
      const target = event.target;
      const highlighter = this.$refs.highlight;

      // Check if element hovered over is in the form
      if (target.closest('.formContainer')) {
        highlighter.style.display = 'block';
        // Move highlighter to target
        highlighter.style.top = target.getBoundingClientRect().top + 'px';
        highlighter.style.left = target.getBoundingClientRect().left + 'px';
        highlighter.style.width = target.offsetWidth + 'px';
        highlighter.style.height = target.offsetHeight + 'px';
        highlighter.style.zIndex = 100; // Ensure it's on top
      }
      // If not make highlight invisible
      else {
        highlighter.style.display = 'none';
      }
    },

    updateHighlighter() {
      const highlighter = this.$refs.highlight;
      if (this.highlightElement) {
        highlighter.style.top = this.highlightElement.getBoundingClientRect().top + 'px';
        highlighter.style.left = this.highlightElement.getBoundingClientRect().left + 'px';
        highlighter.style.width = this.highlightElement.offsetWidth + 'px';
        highlighter.style.height = this.highlightElement.offsetHeight + 'px';
      }
    },

    pickSelect(event) {
      // Remove listeners
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('click', this.handleClick);

      // Get target
      const target = event.target;

      // Check if highlight element has parent of class formContainer
      if (target.closest('.formContainer') && this.picking) {
        this.highlightElement = target;

        // Set values inside of class and id input
        this.$refs.elementClass.value = this.highlightElement.getAttribute('givenClass');
        this.$refs.elementID.value = this.highlightElement.getAttribute('givenId');
        this.classPrevValue = this.$refs.elementClass.value;
        this.idPrevValue = this.$refs.elementID.value;
      }

      // Turn picking mode off
      this.picking = false;
    }
  },
  mounted() {
    // Initialize any needed setup
  },
  beforeUnmount() {
    // Clean up event listeners
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mousedown', this.handleClick);
    removeEventListener("resize", this.highlightUpdate);
    if (document.querySelector('#content')) {
      document.querySelector('#content').removeEventListener("scroll", this.highlightUpdate);
    }
  }
}
</script>

<style scoped>
/* Input style */
input {
  @apply
  w-full
  p-1.5
  border
  rounded-sm
  shadow
  transition
  duration-300
  bg-neutral-800
  border-neutral-600
  text-neutral-200
  focus:outline-none
}

p {
  margin-top: 20px;
  font-size: 16px !important;
  @apply text-neutral-400;
}
</style>
