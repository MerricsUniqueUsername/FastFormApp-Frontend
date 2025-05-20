<template>
  <div
      class="w-1/4 h-full min-w-60 relative bg-neutral-950 text-neutral-200  overflow-auto"
  >
    <!-- Topbar tabs -->
    <Tabs value="question" style="height: 100%;">
      <TabList class="text-[14px] tab-list">
        <Tab @click="leaveCSSMenu()" value="question" class="w-1/3 tab-item">
          Question
        </Tab>
        <Tab @click="enterCSSMenu()" value="css" class="w-1/3 tab-item">CSS</Tab>
        <Tab @click="leaveCSSMenu()" value="design" class="w-1/3 tab-item">
          Design
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="question">
          <!-- Question Edit -->
          <div class="p-4">
            <!-- Question type -->
            <p class="text-neutral-400" style="margin-top: 0;">Type</p>
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
            <p class="text-neutral-400">Variable name</p>
            <input
                type="text"
                pattern="^[a-zA-Z_][a-zA-Z0-9_]*$"
                @input="updateSelectedElement"
                v-model="selectedElement.name"
                spellcheck="false"
                class="w-full bg-neutral-800 text-neutral-300 text-sm rounded-md px-3 py-2 pl-8 border !border-neutral-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />

            <!-- Required -->
            <p class="text-neutral-400">Required</p>
            <input
                type="checkbox"
                @change="updateSelectedElement"
                v-model="selectedElement.required"
                class="!h-4 !w-4 relative"
            />

            <!-- Conditions -->
            <button
                class="w-full flex justify-end text-neutral-400 hover:text-neutral-300 cursor-pointer"
                @click="$emit('openConditionEditor')"
            >
              Open condition editor
            </button>

            <!-- Divider -->
            <div class="border-b border-neutral-800 my-4"></div>

            <div
                class="placeholder-input"
                v-if="[ 'short-response', 'dropdown', 'number', 'date' ].includes(selectedElement.type)"
            >
              <p>Placeholder</p>
              <input
                  type="text"
                  @input="updateSelectedElement"
                  v-model="selectedElement.placeholder"
                  spellcheck="false"
              />
            </div>

            <!-- Multiselect -->
            <div class="multiselect" v-if="selectedElement.type === 'dropdown'">
              <p>Multiselect</p>
              <input
                  type="checkbox"
                  @change="updateSelectedElement"
                  v-model="selectedElement.multiselect"
                  class="!h-4 !w-4 relative"
              />
            </div>

            <!-- Options -->
            <div
                class="options"
                v-if="selectedElement.type === 'radio' || selectedElement.type === 'checkbox' || selectedElement.type === 'dropdown'"
            >
              <p class="text-neutral-400">Options</p>
              <div
                  class="border border-neutral-600 rounded-sm shadow-sm bg-neutral-800"
              >
                <div
                    v-for="(answer, index) in selectedElement.answers"
                    :key="index"
                    class="option-list-element flex items-center border-b border-b-neutral-700"
                >
                  <div
                      @click="removeOption(index)"
                      class="w-4 h-4 rounded-sm cursor-pointer text-neutral-200 hover:bg-neutral-100 aspect-square flex justify-center items-center mx-2 border border-neutral-500"
                  >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        fill="currentColor"
                        class="bi bi-dash-lg"
                        viewBox="0 0 16 16"
                    >
                      <path
                          fill-rule="evenodd"
                          d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"
                      />
                    </svg>
                  </div>
                  <input
                      class="!shadow-none !border-none !text-neutral-200"
                      type="text"
                      @input="updateSelectedElement"
                      v-model="selectedElement.answers[index]"
                      spellcheck="false"
                  />
                </div>
              </div>
              <div
                  @click="addOption"
                  class="w-full flex shadow-sm items-center justify-center cursor-pointer border border-neutral-600 text-neutral-500 hover:bg-neutral-800 rounded-sm p-1 mt-1"
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-plus-lg"
                    viewBox="0 0 16 16"
                >
                  <path
                      fill-rule="evenodd"
                      d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
                  />
                </svg>
              </div>
            </div>

            <!-- Min -->
            <div
                class="min"
                v-if="selectedElement.type === 'number' || selectedElement.type === 'slider'"
            >
              <p>Min</p>
              <input
                  type="number"
                  @input="updateSelectedElement"
                  v-model="selectedElement.min"
                  spellcheck="false"
              />
            </div>

            <!-- Max -->
            <div
                class="max"
                v-if="selectedElement.type === 'number' || selectedElement.type === 'slider'"
            >
              <p>Max</p>
              <input
                  type="number"
                  @input="updateSelectedElement"
                  v-model="selectedElement.max"
                  spellcheck="false"
              />
            </div>

            <!-- Step -->
            <div
                class="step"
                v-if="selectedElement.type === 'number' || selectedElement.type === 'slider'"
            >
              <p>Step</p>
              <input
                  type="number"
                  @input="updateSelectedElement"
                  v-model="selectedElement.step"
                  spellcheck="false"
              />
            </div>

            <!-- Min fraction digits -->
            <div
                class="min-fraction-digits"
                v-if="selectedElement.type === 'number'"
            >
              <p>Min fraction digits</p>
              <input
                  type="number"
                  @input="updateSelectedElement"
                  v-model="selectedElement.minFractionDigits"
                  spellcheck="false"
              />
            </div>

            <!-- Max fraction digits -->
            <div
                class="max-fraction-digits"
                v-if="selectedElement.type === 'number'"
            >
              <p>Max fraction digits</p>
              <input
                  type="number"
                  @input="updateSelectedElement"
                  v-model="selectedElement.maxFractionDigits"
                  spellcheck="false"
              />
            </div>

            <!-- Grouping -->
            <div class="grouping" v-if="selectedElement.type === 'number'">
              <p>Grouping</p>
              <input
                  type="checkbox"
                  @change="updateSelectedElement"
                  v-model="selectedElement.grouping"
                  class="!h-4 !w-4 relative"
              />
            </div>

            <!-- Prefix -->
            <div class="prefix" v-if="selectedElement.type === 'number'">
              <p>Prefix</p>
              <input
                  type="text"
                  @input="updateSelectedElement"
                  v-model="selectedElement.prefix"
                  spellcheck="false"
              />
            </div>

            <!-- Suffix -->
            <div class="suffix" v-if="selectedElement.type === 'number'">
              <p>Suffix</p>
              <input
                  type="text"
                  @input="updateSelectedElement"
                  v-model="selectedElement.suffix"
                  spellcheck="false"
              />
            </div>

            <!-- Show buttons -->
            <div class="show-buttons" v-if="selectedElement.type === 'number'">
              <p>Show buttons</p>
              <input
                  type="checkbox"
                  @change="updateSelectedElement"
                  v-model="selectedElement.showButtons"
                  class="!h-4 !w-4 relative"
              />
            </div>

            <!-- Button layout -->
            <div
                class="button-layout"
                v-if="selectedElement.type === 'number' && selectedElement.showButtons"
            >
              <p>Button layout</p>
              <Select
                  value-type="model-value"
                  input="buttonLayout"
                  v-model="selectedElement.buttonLayout"
                  :options="[
                  { 'label': 'Stacked', 'value': 'stacked' },
                  { 'label': 'Horizontal', 'value': 'horizontal' },
                  { 'label': 'Vertical', 'value': 'vertical' },
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
              <input
                  type="checkbox"
                  @change="updateSelectedElement"
                  v-model="selectedElement.showTime"
                  class="!h-4 !w-4 relative"
              />
            </div>

            <!-- Time only -->
            <div
                class="time-only"
                v-if="selectedElement.type === 'date' && selectedElement.showTime"
            >
              <p>Time only</p>
              <input
                  type="checkbox"
                  @change="updateSelectedElement"
                  v-model="selectedElement.timeOnly"
                  class="!h-4 !w-4 relative"
              />
            </div>

            <!-- Hour format -->
            <div
                class="hour-format"
                v-if="selectedElement.type === 'date' && selectedElement.showTime"
            >
              <p>Hour format</p>
              <Select
                  value-type="model-value"
                  input="hourFormat"
                  v-model="selectedElement.hourFormat"
                  :options="[
                  { 'label': '12', 'value': '12' },
                  { 'label': '24', 'value': '24' },
                ]"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full"
                  placeholder="Select a format"
                  @change="updateSelectedElement"
              />
            </div>

            <br /><br />
          </div>
        </TabPanel>

        <!-- Design -->
        <TabPanel value="design">
          <div class="p-4">
            <Accordion :value="[]" multiple>
              <!-- Color Scheme -->
              <AccordionPanel value="colors">
                <AccordionHeader>Colors</AccordionHeader>
                <AccordionContent>
                  <p><strong>Text & Background Colors</strong></p>
                  <p>Header color</p>
                  <ColorPicker v-model="form.theme.headerColor" />
                  <p>Text color</p>
                  <ColorPicker v-model="form.theme.textColor" />
                  <p>Accent color</p>
                  <ColorPicker v-model="form.theme.accentColor" />
                  <p>Background color</p>
                  <ColorPicker v-model="form.theme.backgroundColor" />

                  <p><strong>Input Elements</strong></p>
                  <p>Input background</p>
                  <ColorPicker v-model="form.theme.inputBaseBackground" />
                  <p>Border color</p>
                  <ColorPicker v-model="form.theme.borderColor" />
                  <p>Placeholder text</p>
                  <ColorPicker v-model="form.theme.placeholderColor" />
                  <p>Hover background</p>
                  <ColorPicker v-model="form.theme.hoverBackground" />
                  <p>Hover border</p>
                  <ColorPicker v-model="form.theme.hoverBorderColor" />
                  <p>Hover placeholder</p>
                  <ColorPicker v-model="form.theme.hoverPlaceholderColor" />
                  <p>Focus border</p>
                  <ColorPicker v-model="form.theme.focusBorderColor" />
                </AccordionContent>
              </AccordionPanel>
              <!-- Typography -->
              <AccordionPanel value="typography">
                <AccordionHeader>Typography</AccordionHeader>
                <AccordionContent>
                  <p>Font family</p>
                  <FontPicker v-model="form.theme.fontFamily" />
                  <p>Input font size</p>
                  <input type="number" v-model="form.theme.inputFontSize" />
                  <p>Dropdown font size</p>
                  <input
                      type="number"
                      v-model="form.theme.dropdownFontSize"
                  />
                </AccordionContent>
              </AccordionPanel>

              <!-- Spacing & Padding -->
              <AccordionPanel value="spacing">
                <AccordionHeader>Spacing & Padding</AccordionHeader>
                <AccordionContent>
                  <p>Input padding (px)</p>
                  <input type="number" v-model="form.theme.inputPadding" />
                  <p>Dropdown padding (px)</p>
                  <input type="number" v-model="form.theme.dropdownPadding" />
                  <p>Question spacing (px)</p>
                  <input type="number" v-model="form.theme.questionSpacing" />
                </AccordionContent>
              </AccordionPanel>

              <!-- Borders & Shape -->
              <AccordionPanel value="shape">
                <AccordionHeader>Borders & Shape</AccordionHeader>
                <AccordionContent>
                  <p>Border radius (px)</p>
                  <input
                      type="range"
                      min="0"
                      max="50"
                      v-model="form.theme.borderRadius"
                  />
                  <p>Input shadow size</p>
                  <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      v-model="form.theme.shadowSize"
                  />
                  <p>Dropdown shadow size</p>
                  <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      v-model="form.theme.dropdownShadowSize"
                  />
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </div>
        </TabPanel>

        <!-- CSS Edit -->
        <TabPanel value="css">
          <div class="p-4">
            <div class="p-3 border border-neutral-700 rounded-md">
              <div class="flex items-center justify-between">
                <p class="!mt-0">Select element</p>
                <div
                    class="border border-neutral-600 bg-neutral-400/20 bg-blue-100 p-1 text-neutral-500 items-center justify-center rounded-sm cursor-pointer hover:bg-neutral-500/40 transition-all duration-300"
                    :class="{ '!bg-indigo-900/60 !border-indigo-600 !text-indigo-400': picking }"
                    @click="setPickMode()"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-up-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M9.636 13.5a.5.5 0 0 1-.5.5H2.5A1.5 1.5 0 0 1 1 12.5v-10A1.5 1.5 0 0 1 2.5 1h10A1.5 1.5 0 0 1 14 2.5v6.636a.5.5 0 0 1-1 0V2.5a.5.5 0 0 0-.5-.5h-10a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h6.636a.5.5 0 0 1 .5.5"/>
                    <path fill-rule="evenodd" d="M5 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1H6.707l8.147 8.146a.5.5 0 0 1-.708.708L6 6.707V10.5a.5.5 0 0 1-1 0z"/>
                  </svg>
                </div>
              </div>

              <div v-show="highlightElement">
                <p class="!mt-2 pt-0">CLASS</p>
                <input
                    @change="updateComponent()"
                    @input="updateElement('class')"
                    ref="elementClass"
                    type="text"
                />
                <p class="!mt-2">ID</p>
                <input
                    @change="updateComponent()"
                    @input="updateElement('id')"
                    ref="elementID"
                    type="text"
                    class="mb-2"
                />
              </div>
            </div>

            <div
                ref="highlight"
                class="fixed border border-purple-500 bg-purple-200 bg-opacity-25 pointer-events-none transition-all duration-100"
                style="display: none;"
                :class="{ '!bg-orange-300 !border-orange-600 !bg-opacity-25': highlightElement }"
            ></div>

            <div class="mt-4">
              <h3 class="text-base font-medium text-neutral-300 mb-4">CSS Editor</h3>
              <AceEditor
                  @input="updateHighlighter()"
                  v-model="form.css"
                  class="rounded-md border border-neutral-600 overflow-hidden"
              />
            </div>

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
      test: 'hello',
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
      let elementNode = element.__vueParentComponent;

      // Get element node parent until it is a FormElement
      while (elementNode.type.name !== 'FormElement') {
        elementNode = elementNode.parent;
      }

      elementNode = elementNode.proxy;
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
          // Create deep copies of array properties to prevent shared references
          if (Array.isArray(this.selectedElement[key])) {
            this.form.elements[index][key] = [...this.selectedElement[key]];
          } else {
            this.form.elements[index][key] = this.selectedElement[key];
          }
        });
    
        this.$emit('select', this.getSelectedElement());

      });

    },

    /**
     * Remove option
     */
    removeOption(index) {
      if(this.selectedElement.answers.length === 1) {
        return;
      }
      
      // Create a new array without the removed option
      const newAnswers = [...this.selectedElement.answers];
      newAnswers.splice(index, 1);
      
      // Update the local selectedElement with the new answers
      this.selectedElement.answers = newAnswers;
      
      // Get and update the actual form element
      const element = this.getSelectedElement();
      if (element) {
        element.answers = [...newAnswers]; // Clone again to be extra safe
      }
      
      this.$emit('select', element);
    },

    /**
     * Add option
     */
    addOption() {
      // Create a new array instead of mutating the existing one
      const newAnswers = [...this.selectedElement.answers, 'Answer ' + (this.selectedElement.answers.length + 1)];
      
      // Update the local selectedElement with the new answers
      this.selectedElement.answers = newAnswers;
      
      // Get and update the actual form element
      const element = this.getSelectedElement();
      if (element) {
        element.answers = [...newAnswers]; // Clone again to be extra safe
      }
      
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
          // Create deep copies of array properties to prevent shared references
          if (Array.isArray(element[key])) {
            this.selectedElement[key] = [...element[key]];
          } else {
            this.selectedElement[key] = element[key];
          }
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
input[type='range'] {
  @apply shadow-none;
}

/* Accordion */
:deep(.p-accordionpanel) {
  border: none;
  padding-top: 4px;
  padding-block: 4px;
  border-bottom: 1px solid;
  @apply border-b-neutral-800;
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
  @apply border-t border-t-neutral-800;
}

/* Input style */
input {
  @apply w-full p-1.5 border rounded-sm shadow transition duration-300 bg-neutral-800 border-neutral-600 text-neutral-200 focus:outline-none;
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
  @apply text-neutral-400;
}
.p-tabpanels {
  @apply h-full;
}
.color-picker {
  @apply px-2 bg-zinc-950 py-2 rounded border-zinc-500 border-solid;
  border-width: 1px;
}

/* Tabs */
.tab-list {
  @apply flex border-b border-b-neutral-800;
}

.tab-item {
  @apply text-neutral-400 py-2 text-center cursor-pointer transition-colors duration-200 border-none;
  border-bottom: 2px solid transparent;
}

.tab-item.p-tab-active {
  @apply text-white border-b-blue-500;
}

.tab-item:hover:not(.p-tab-active) {
  @apply text-neutral-300;
}

.p-tabpanels {
  padding: 0; /* Remove default padding from tab panels */
}
</style>

<style>
/* Tabs - Global styles for PrimeVue components */
.p-tablist-content .p-tablist-tab-list {
  border: none;
}
</style>