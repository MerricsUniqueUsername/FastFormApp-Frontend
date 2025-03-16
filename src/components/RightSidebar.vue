<template>
  <div class="w-1/4 h-full min-w-60 relative bg-gray-50 border-l border-l-gray-300 overflow-auto">

    <!-- Topbar tabs -->
    <Tabs value="question" style="height: 100%;">
      <TabList class="text-[14px]">
        <Tab @click="leaveCSSMenu()" value="question" class="w-1/3">Question</Tab>
        <Tab @click="enterCSSMenu()" value="css" class="w-1/3">CSS</Tab>
        <Tab @click="leaveCSSMenu()" value="design" class="w-1/3">Design</Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="question">

          <!-- Question Edit -->
          <div class="p-4">

            <!-- Question type -->
            <p style="margin-top: 0;">Type</p>
            <Select 
              value-type="model-value"
              input="type"
              v-model="selectedElement.type"
              :options="questionTypes" 
              optionLabel="label" 
              optionValue="value" 
              class="w-full" 
              placeholder="Select a type"
              @change="updateSelectedElement($event.value)"
            />

            <!-- Variable name -->
            <p>Variable name</p>
            <input type="text" pattern="^[a-zA-Z_][a-zA-Z0-9_]*$" @input="updateSelectedElement" v-model="selectedElement.name" spellcheck="false">

            <!-- Required -->
            <p>Required</p>
            <input type="checkbox" @change="updateSelectedElement" v-model="selectedElement.required" class="!h-4 !w-4 relative" />

            <!-- Conditions -->
            <button class="w-full flex justify-end text-gray-500 hover:text-gray-700 cursor-pointer"
                    @click="$emit('openConditionEditor')">
              Open condition editor
            </button>

            <!-- Divider -->
            <div class="border-b border-gray-300 my-4"></div>

            <div class="placeholder-input" v-if="[ 'short-response', 'dropdown', 'number', 'date' ].includes(selectedElement.type)">
              <p>Placeholder</p>
              <input type="text" @input="updateSelectedElement" v-model="selectedElement.placeholder" spellcheck="false">
            </div>

            
            <!-- Multiselect -->
            <div class="multiselect" v-if="selectedElement.type === 'dropdown'">
              <p>Multiselect</p>
              <input type="checkbox" @change="updateSelectedElement" v-model="selectedElement.multiselect" class="!h-4 !w-4 relative" />
            </div>

            <!-- Options -->
            <div class="options" v-if="selectedElement.type === 'radio' || selectedElement.type === 'checkbox' || selectedElement.type === 'dropdown'">
              <p>Options</p>
              <div class="border border-gray-400 rounded-sm shadow-sm">
                <div v-for="(answer, index) in selectedElement.answers" :key="index" class="flex items-center border-b border-b-gray-300">
                  <div @click="removeOption(index)" class="w-4 h-4 rounded-sm cursor-pointer text-gray-500 hover:bg-gray-100 aspect-square flex justify-center items-center mx-2 border border-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
                    </svg>
                  </div>
                  <input class="!shadow-none !border-none !text-gray-500" type="text" @input="updateSelectedElement" v-model="selectedElement.answers[index]" spellcheck="false">
                </div>
              </div>
              <div @click="addOption" class="w-full flex shadow-sm items-center justify-center cursor-pointer border border-gray-400 text-gray-500 hover:bg-gray-100 rounded-sm p-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>
              </div>
            </div>

            <!-- Min -->
            <div class="min" v-if="selectedElement.type === 'number' || selectedElement.type === 'slider'">
              <p>Min</p>
              <input type="number" @input="updateSelectedElement" v-model="selectedElement.min" spellcheck="false">
            </div>

            <!-- Max -->
            <div class="max" v-if="selectedElement.type === 'number' || selectedElement.type === 'slider'">
              <p>Max</p>
              <input type="number" @input="updateSelectedElement" v-model="selectedElement.max" spellcheck="false">
            </div>

            <!-- Step -->
            <div class="step" v-if="selectedElement.type === 'number' || selectedElement.type === 'slider'">
              <p>Step</p>
              <input type="number" @input="updateSelectedElement" v-model="selectedElement.step" spellcheck="false">
            </div>

            <!-- Min fraction digits -->
            <div class="min-fraction-digits" v-if="selectedElement.type === 'number'">
              <p>Min fraction digits</p>
              <input type="number" @input="updateSelectedElement" v-model="selectedElement.minFractionDigits" spellcheck="false">
            </div>
          
            <!-- Max fraction digits -->
            <div class="max-fraction-digits" v-if="selectedElement.type === 'number'">
              <p>Max fraction digits</p>
              <input type="number" @input="updateSelectedElement" v-model="selectedElement.maxFractionDigits" spellcheck="false">
            </div>

            <!-- Grouping -->
            <div class="grouping" v-if="selectedElement.type === 'number'">
              <p>Grouping</p>
              <input type="checkbox" @change="updateSelectedElement" v-model="selectedElement.grouping" class="!h-4 !w-4 relative" />
            </div>

            <!-- Prefix -->
            <div class="prefix" v-if="selectedElement.type === 'number'">
              <p>Prefix</p>
              <input type="text" @input="updateSelectedElement" v-model="selectedElement.prefix" spellcheck="false">
            </div>

            <!-- Suffix -->
            <div class="suffix" v-if="selectedElement.type === 'number'">
              <p>Suffix</p>
              <input type="text" @input="updateSelectedElement" v-model="selectedElement.suffix" spellcheck="false">
            </div>

            <!-- Show buttons -->
            <div class="show-buttons" v-if="selectedElement.type === 'number'">
              <p>Show buttons</p>
              <input type="checkbox" @change="updateSelectedElement" v-model="selectedElement.showButtons" class="!h-4 !w-4 relative" />
            </div>

            <!-- Button layout -->
            <div class="button-layout" v-if="selectedElement.type === 'number' && selectedElement.showButtons">
              <p>Button layout</p>
              <Select 
                value-type="model-value"
                input="buttonLayout"
                v-model="selectedElement.buttonLayout"
                :options="[
                  {'label': 'Stacked', 'value': 'stacked'},
                  {'label': 'Horizontal', 'value': 'horizontal'},
                  {'label': 'Vertical', 'value': 'vertical'},
                ]" 
                optionLabel="label" 
                optionValue="value" 
                class="w-full" 
                placeholder="Select a layout"
                @change="updateSelectedElement"
              />
            </div>

            <!-- Show time -->
            <div class="show-time" v-if="selectedElement.type === 'date'">
              <p>Show time</p>
              <input type="checkbox" @change="updateSelectedElement" v-model="selectedElement.showTime" class="!h-4 !w-4 relative" />
            </div>

            <!-- Time only -->
            <div class="time-only" v-if="selectedElement.type === 'date' && selectedElement.showTime">
              <p>Time only</p>
              <input type="checkbox" @change="updateSelectedElement" v-model="selectedElement.timeOnly" class="!h-4 !w-4 relative" />
            </div>

            <!-- Hour format -->
            <div class="hour-format" v-if="selectedElement.type === 'date' && selectedElement.showTime">
              <p>Hour format</p>
              <Select 
                value-type="model-value"
                input="hourFormat"
                v-model="selectedElement.hourFormat"
                :options="[
                  {'label': '12', 'value': '12'},
                  {'label': '24', 'value': '24'},
                ]" 
                optionLabel="label" 
                optionValue="value" 
                class="w-full" 
                placeholder="Select a format"
                @change="updateSelectedElement"
              />
            </div>

            <br><br>

          </div>

        </TabPanel>

        <!-- Conditions -->
        <TabPanel value="design">
          <div class="p-4">

            <Accordion :value="[]" multiple>

              <!-- Other -->
              <AccordionPanel value="other">

                <!-- Text edit -->
                <AccordionHeader>Other</AccordionHeader>
                  <AccordionContent>
                    <p>Background color</p>
                    <ColorPicker v-model="form.theme.backgroundColor" />
                    
                    <p>Divider color</p>
                    <ColorPicker v-model="form.theme.dividerColor" />

                    <p>Border radius</p>
                    <input type="range" min="0" max="50" v-model="form.theme.borderRadius" />

                    <p>Shadow scale</p>
                    <input type="range" min="0" max="10" step="0.5" v-model="form.theme.shadowSize" />

                  </AccordionContent>
                </AccordionPanel>

              <AccordionPanel value="text">

                <!-- Text edit -->
                <AccordionHeader>Text</AccordionHeader>
                <AccordionContent>
                  <p>Font family</p>
                  <FontPicker v-model="form.theme.fontFamily" />

                  <p>Header color</p>
                  <ColorPicker v-model="form.theme.headerColor" />

                  <p>Paragraph color</p>
                  <ColorPicker v-model="form.theme.paragraphColor" />

                  <p>Question color</p>
                  <ColorPicker v-model="form.theme.questionColor" />
                </AccordionContent>
              </AccordionPanel>

              <!-- Input boxes -->
              <AccordionPanel value="input">
                <AccordionHeader>Input boxes</AccordionHeader>
                <AccordionContent>

                  <p>Font size</p>
                  <input type="number" v-model="form.theme.inputFontSize" />

                  <p>Background color</p>
                  <ColorPicker v-model="form.theme.inputBackgroundColor" />

                  <p>Border color</p>
                  <ColorPicker v-model="form.theme.inputBorderColor" />

                  <p>Text color</p>
                  <ColorPicker v-model="form.theme.inputTextColor" />

                  <p>Placeholder color</p>
                  <ColorPicker v-model="form.theme.inputPlaceholderColor" />

                  <p>Background color (hover)</p>
                  <ColorPicker v-model="form.theme.inputBackgroundColorHover" />

                  <p>Border color (hover)</p>
                  <ColorPicker v-model="form.theme.inputBorderColorHover" />

                  <p>Text color (hover)</p>
                  <ColorPicker v-model="form.theme.inputTextColorHover" />

                  <p>Placeholder color (hover)</p>
                  <ColorPicker v-model="form.theme.inputPlaceholderColorHover" />

                  <p>Focus border color</p>
                  <ColorPicker v-model="form.theme.inputFocusBorderColor" />

                  <p>Focus background color</p>
                  <ColorPicker v-model="form.theme.inputFocusBackgroundColor" />

                  <p>Focus text color</p>
                  <ColorPicker v-model="form.theme.inputFocusTextColor" />

                  <p>Input padding (px)</p>
                  <input type="number" v-model="form.theme.inputPadding" />
                </AccordionContent>
              </AccordionPanel>

              <!-- Dropdown menus -->
              <AccordionPanel value="dropdown">
                <AccordionHeader>Menus</AccordionHeader>
                <AccordionContent>
                  <p>Font size</p>
                  <input type="number" v-model="form.theme.dropdownFontSize" />

                  <p>Background color</p>
                  <ColorPicker v-model="form.theme.dropdownBackgroundColor" />

                  <p>Border color</p>
                  <ColorPicker v-model="form.theme.dropdownBorderColor" />

                  <p>Text color</p>
                  <ColorPicker v-model="form.theme.dropdownTextColor" />

                  <p>Background color (hover)</p>
                  <ColorPicker v-model="form.theme.dropdownBackgroundColorHover" />

                  <p>Border color (hover)</p>
                  <ColorPicker v-model="form.theme.dropdownBorderColorHover" />

                  <p>Text color (hover)</p>
                  <ColorPicker v-model="form.theme.dropdownTextColorHover" />

                  <p>Padding (px)</p>
                  <input type="number" v-model="form.theme.dropdownPadding" />
                </AccordionContent>
              </AccordionPanel>

            </Accordion>
          </div>
        </TabPanel>

        <!-- CSS Edit -->
        <TabPanel value="css">
          <div class="p-4">

            <div class="p-3 border border-gray-300 rounded-sm">
              <p class="!mt-0">Select element</p>
              <div class="border border-blue-600 bg-blue-100 p-1 text-blue-600 flex items-center justify-center rounded-sm cursor-pointer hover:bg-blue-200 transition-all duration-300"
                  :class="{'!bg-green-300 !border-green-600 text-green-600 !bg-opacity-25' : picking}"
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
            
            <AceEditor @input="updateHighlighter()" v-model="form.css" class="shadow-sm border rounded-sm mt-4" />

            <p>Color picker</p>
            <ColorPicker />

          </div>
        </TabPanel>

      </TabPanels>
    </Tabs>

  </div>
</template>

<script>
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import AceEditor from './AceEditor.vue';
import Checkbox from 'primevue/checkbox';
import ColorPicker from './ColorPicker.vue';
import FontPicker from './FontPicker.vue';


export default {
  name: 'RightSidebar',
  inject: ['formInteract'],
  components: {
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Select,
    InputText,
    AceEditor,
    ColorPicker,
    Checkbox,
    ColorPicker,
    FontPicker,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
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

      // Highlighted HTML element for CSS editor
      highlightElement: null,
      picking: false,
      classPrevValue: '',
      idPrevValue: '',

      // Store data from element in here to update the form
      selectedElement: {
        name: '',
        type: '',
        required: '',
        placeholder: '',
        answers: [],
        multiselect: null,
        min: null,
        max: null,
        step: null,
        minFractionDigits: null,
        maxFractionDigits: null,
        grouping: false,
        prefix: '',
        suffix: '',
        showButtons: false,
        buttonLayout: '',
        showTime: false,
        timeOnly: false,
        hourFormat: '24',
      },
      questionTypes: [
        {'label': 'Short response', 'value': 'short-response'},
        {'label': 'Long response', 'value': 'long-response'},
        {'label': 'Multiple choice', 'value': 'radio'},
        {'label': 'Checkbox', 'value': 'checkbox'},
        {'label': 'Dropdown', 'value': 'dropdown'},
        {'label': 'Number', 'value': 'number'},
        {'label': 'Linear scale', 'value': 'linear-scale'},
        {'label': 'Star rating', 'value': 'rating'},
        {'label': 'Slider', 'value': 'slider'},
        {'label': 'Date and time', 'value': 'date'}
      ],
    };
  },
  emits: ['select', 'openConditionEditor'],
  methods: {

    /**
     * Update selected element component to keep HTML structure correct
     */
    updateComponent() {
      const element = this.highlightElement;

      // Get the Vue element the selected element is in
      var elementNode = element.__vueParentComponent;
      
      // Get element node parent until it is a FormElement
      while (elementNode.type.name !== 'FormElement') {
        elementNode = elementNode.parent;
      }

      var elementNode = elementNode.proxy;
      elementNode.updateHTMLStructure();
    },

    /**
     * Leave CSS Menu
     */
    leaveCSSMenu() {
      // Remove listeners
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mousedown', this.handleClick);
      removeEventListener("resize", this.highlightUpdate);
      document.querySelector('#content').removeEventListener("scroll", this.highlightUpdate);
      this.formInteract = true;
      this.picking = false;
      this.highlightElement = null;
      this.$refs.highlight.style.display = 'none';
    },

    /**
     * Enter CSS menu
     */
    enterCSSMenu() {
      this.formInteract = false;
    },

    /**
     * Update highlighted element when class or id is changed
     */
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


    /**
     * Set mode to pick HTML element
     */
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

    /**
     * Highlight element in pick mode
     */
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

    /**
     * Update highlighter position based on current target
     */
    updateHighlighter() {
      const highlighter = this.$refs.highlight;
      if (this.highlightElement) {
        highlighter.style.top = this.highlightElement.getBoundingClientRect().top + 'px';
        highlighter.style.left = this.highlightElement.getBoundingClientRect().left + 'px';
        highlighter.style.width = this.highlightElement.offsetWidth + 'px';
        highlighter.style.height = this.highlightElement.offsetHeight + 'px';
      }
    },

    /**
     * Pick select
     */
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
    },

    /**
     * Get the selected element
     */
    getSelectedElement() {
      return this.form.elements.find((element) => element.id === this.selectedId);
    },

    /**
     * Update form selected element
     */
    updateSelectedElement(type) {

      // Next tick
      this.$nextTick(() => {

        // Get element
        const element = this.getSelectedElement();

        // If change type
        if(type) {
          this.changeType(type);
        }

        // Get element from form and keys
        const index = this.form.elements.findIndex((element) => element.id === this.selectedId);
        const keys = Object.keys(this.selectedElement);

        // Update selected form for each key
        keys.forEach((key) => {
          this.form.elements[index][key] = this.selectedElement[key];
        });

        this.$emit('select', element);
      });

    },

    /**
     * Remove option
     */
    removeOption(index) {
      if(this.selectedElement.answers.length === 1) {
        return;
      }
      this.selectedElement.answers.splice(index, 1);
      const element = this.getSelectedElement();
      this.$emit('select', element);
    },

    /**
     * Add option
     */
    addOption() {
      this.selectedElement.answers.push('Answer ' + (this.selectedElement.answers.length + 1));
      const element = this.getSelectedElement();
      this.$emit('select', element);
    },

    /**
     * Load selected element into sidebar
     */
    loadSelectedElement() {

      // Next tick
      this.$nextTick(() => {
        const element = this.getSelectedElement();
        const keys = Object.keys(this.selectedElement);

        // Update selected element
        keys.forEach((key) => {
          this.selectedElement[key] = element[key];
        });
      });      

    },

    /**
     * Change element type
     */
    changeType(type) {

      // Next tick
      this.$nextTick(() => {
        const el = this.getSelectedElement();

        // Give attributes to the right element types
        if((type === 'radio' || type === 'checkbox' || type === 'dropdown') && !el.answers) {
          el.answers = ['Answer 1', 'Answer 2'];
        }
        if(type === 'linear-scale' && !el.num) {
          el.num = 5;
        }
        if(type === 'rating' && !el.num) {
          el.num = 5;
        }
        if(type === 'slider' && !el.min) {
          el.min = 0;
        }
        if(el === 'slider' && !el.max) {
          element.max = 100;
        }
        if(type === 'slider' && !el.step) {
          el.step = 1;
        }
        if(type == 'slider' && !el.min) {
          el.min = 0;
        }
        if(type == 'slider' && !el.max) {
          el.max = 100;
        }
        if(['number', 'slider'].includes(type) && !el.step) {
          el.step = 1;
        }
        if(type === 'number' && !el.minFractionDigits) {
          el.minFractionDigits = 0;
        }
        if(type === 'number' && !el.maxFractionDigits) {
          el.maxFractionDigits = 0;
        }
        if(type === 'number' && !el.grouping) {
          el.grouping = false;
        }
        if(type === 'number' && !el.showButtons) {
          el.showButtons = true;
        }
        if(type === 'number' && !el.buttonLayout) {
          el.buttonLayout = 'stacked';
        }
        if(type === 'date' && !el.showTime) {
          el.showTime = false;
        }
        if(type === 'date' && !el.timeOnly) {
          el.timeOnly = false;
        }
        if(type === 'date' && !el.hourFormat) {
          el.hourFormat = '24';
        }
      });
    },
  }
}
</script>

<style scoped>

/* input range have no shadow */
input[type="range"] {
  @apply shadow-none;
}

/* Accordion */
:deep(.p-accordionpanel) {
  border: none;
  padding-top: 4px;
  padding-block: 4px;
  border-bottom: 1px solid #d7d7d7;
}
:deep(.p-accordionheader) {
  border: none;
  font-weight: 500;
  font-size: 18px;
}
:deep(.p-accordioncontent-content) {
  border: none;
}
:deep(.p-accordion) {
  border-top: 1px solid #d7d7d7;
}

/* Input style */
input {
  @apply
  w-full
  p-1.5
  bg-gray-50
  border
  border-gray-400
  rounded-sm
  shadow
  transition
  duration-300
  text-gray-500;
}

.custom-tabs .p-tabview-nav {
  border: none; /* Remove border from the tab navigation */
}
.custom-tabs .p-tabview-nav li {
  border: none; /* Remove border from individual tabs */
}
p {
  margin-top: 20px;
  font-size: 16px !important;
}
.p-tabpanels {
  @apply h-full;
}
.color-picker {
  @apply px-2 bg-zinc-950 py-2 rounded border-zinc-500 border-solid;
  border-width: 1px;
}
</style>

<style scoped>

/* Tabs */
.p-tab {
  @apply
  border-none
  !border-r-gray-300
  !border-l-gray-300
  !border-b-gray-300
  transition
  duration-150;
  border-left-style: solid !important;
  border-bottom-style: solid !important;
  border-right-style: solid !important;
  border-left-width: 0.25px;
  border-bottom-width: 0.25px;
  border-right-width: 0.25px;
}
.p-tab:hover {
  @apply
  border-none
  !border-r-gray-300
  !border-l-gray-300
  !border-b-gray-300;
}
.p-tab-active {
  @apply
  bg-black
  text-white
  !border-b-black
  !border-l-black
  !border-t-black
  !border-r-black;
}


</style>

<style>

/* Tabs */
.p-tablist-content .p-tablist-tab-list {
  border: none;
}

</style>