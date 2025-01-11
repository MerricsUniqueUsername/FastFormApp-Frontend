<template>
  <div class="my-6">
    <p @input="handleChange" ref="question" class="edit-text parent" v-text="element.question"/>
    
    <div class="flex gap-2">
      <!-- Country code selector -->
      <select 
        v-model="selectedCountry" 
        class="w-64 parent text-white"
        @change="handleCountryChange"
      >
        <option 
          v-for="country in countries" 
          :key="country.code" 
          :value="country"
        >
          {{ country.name }} (+{{ country.dialCode }})
        </option>
      </select>

      <!-- Phone number input -->
      <InputMask
        v-model="phoneNumber"
        :mask="selectedCountry.mask"
        :placeholder="element.placeholder || selectedCountry.placeholder"
        class="parent flex-1"
        @complete="handleComplete"
        @input="handlePhoneInput"
      />
    </div>
  </div>
</template>

<script>
import InputMask from 'primevue/inputmask';

// Common phone number formats by country
const COUNTRY_CONFIGS = [
  {
    code: 'US',
    name: 'United States',
    dialCode: '1',
    mask: '(999) 999-9999',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    dialCode: '44',
    mask: '99 9999 9999',
  },
  {
    code: 'FR',
    name: 'France',
    dialCode: '33',
    mask: '9 99 99 99 99',
  },
];

export default {
  name: 'InternationalPhoneNumber',
  components: {
    InputMask,
  },
  props: {
    element: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
    defaultCountry: {
      type: String,
      default: 'US'
    }
  },
  emits: ['change', 'validation'],
  
  data() {
    return {
      countries: COUNTRY_CONFIGS,
      selectedCountry: null,
      phoneNumber: '',
      validationError: '',
      isValid: false
    };
  },

  created() {
    // Set initial country based on prop or default to US
    this.selectedCountry = this.countries.find(c => c.code === this.defaultCountry) || this.countries[0];
  },

  methods: {
    handleChange() {
      const value = this.$refs.question.innerText;
      this.element.question = value;
      this.$emit('change');
    },

    handleCountryChange() {
      // Reset phone number when country changes
      this.phoneNumber = '';
      this.validatePhone();
    },

    handlePhoneInput() {
      this.validatePhone();
    },

    handleComplete() {
      this.validatePhone();
    },

    validatePhone() {
      const fullNumber = this.phoneNumber;
      
      if (!fullNumber) {
        this.validationError = 'Phone number is required';
        this.isValid = false;
      } else if (!this.selectedCountry.pattern.test(fullNumber)) {
        this.validationError = `Invalid format for ${this.selectedCountry.name}`;
        this.isValid = false;
      } else {
        this.validationError = '';
        this.isValid = true;
      }

      // Emit formatted number with country code
      const formattedNumber = this.isValid ? 
        `+${this.selectedCountry.dialCode} ${this.phoneNumber}` : '';
      
      this.$emit('change', {
        isValid: this.isValid,
        phoneNumber: formattedNumber,
        countryCode: this.selectedCountry.code
      });
    }
  },

  watch: {
    // Watch for external changes to element
    'element': {
      deep: true,
      handler() {
        this.validatePhone();
      }
    }
  }
};
</script>

<style scoped>
.parent {
  /* Inherit existing parent styles */
}
</style>