<template>
  <div id="app" class="h-screen w-screen flex flex-col">

    <!-- Topbar -->
    <Topbar />

    <!-- Body -->
    <div class="flex flex-col h-full">
      <div class="flex flex-row flex-1">

        <div class="w-1/6 bg-gray-200">
          <div class="p-4">
            <h1 class="text-black text-sm">{{ form }}</h1>
          </div>
        </div>

        <!-- Main Content -->
        <FormPreview :form="form" />

        <!-- Right Sidebar -->
        <RightSidebar />
        
      </div>
    </div>

  </div>
</template>

<script>
import RightSidebar from './components/RightSidebar.vue';
import Topbar from './components/Topbar.vue';
import FormPreview from './components/FormPreview.vue';
import AddQuestions from './components/AddQuestions.vue';

export default {
  name: 'App',
  components: {
    RightSidebar,
    Topbar,
    FormPreview,
    AddQuestions,
  },

  methods: {
  },

  data() {
    return {

      // Form data
      form: {
        title: 'Dox yourself',
        description: 'Gemme all your fuckin data',
        elements: [
          // {
          //   id: 1,
          //   type: 'h1',
          //   content: 'Welcome to the greatest form ever'
          // },
          // {
          //   id: 2,
          //   type: 'p',
          //   content: 'This is a paragraph!'
          // },
          // {
          //   id: 3,
          //   type: 'short-response',
          //   question: 'Tell me how stupid you are',
          // },
          // {
          //   id: 4,
          //   type: 'number',
          //   question: 'Tell me how much of a bitch you are.',
          //   integer: false,
          //   grouping: false,
          //   min: -100,
          //   max: 100,
          //   minFractionDigits: 2,
          //   maxFractionDigits: 4,
          //   prefix: '',
          //   suffix: '',
          //   placeholder: 'Choose a fucking number',
          //   showButtons: true,
          //   buttonLayout: 'horizontal'
          // },
          // {
          //   id: 5,
          //   type: 'dropdown',
          //   multiselect: false,
          //   question: 'Choose your favorite color',
          //   placeholder: 'Choose your favorite color',
          //   options: ['red', 'green', 'blue', 'purple']
          // },
          // {
          //   id: 6,
          //   type: 'email',
          //   question: 'Gimme your email',
          //   placeholder: 'Enter email'
          // },
          // {
          //   id: 7,
          //   type: 'phone-number',
          //   question: 'Gimme your phone number',
          //   placeholder: 'Enter phone number'
          // },
          // {
          //   id: 8,
          //   type: 'date',
          //   question: 'Choose your birthday',
          //   placeholder: 'Choose your birthday',
          //   showTime: true,
          //   timeOnly: false,
          //   hourFormat: '12',
          // },
          // {
          //   id: 9,
          //   type: 'linear-scale',
          //   question: 'Choose your favorite number',
          //   num: 5,
          //   labelMax: 'Love',
          //   labelMin: 'Hate'
          // },
          {
            id: 10,
            type: 'slider',
            question: 'Choose your favorite number',
            min: 0,
            max: 100,
            step: 1,
            value: 50,
          },
          {
            id: 11,
            type: 'rating',
            question: 'Rate this form',
            stars: 10,
          }

        ],
      }

    }
  }
}
</script>