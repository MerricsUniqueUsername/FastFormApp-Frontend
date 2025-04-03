<template>
  <div class="relative">
    <!-- Input field -->
    <div 
      @click="toggleCalendar" 
      class="flex items-center justify-between w-full p-3 border border-gray-300 rounded-lg cursor-pointer bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 input"
    >
      <span v-if="formattedValue" class="truncate text-sm sm:text-base">{{ formattedValue }}</span>
      <span v-else class="text-gray-400 truncate text-sm sm:text-base placeholder">{{ placeholder }}</span>
      <div class="flex">
        <svg v-if="!timeOnly" class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
        </svg>
        <svg v-if="showTime || timeOnly" class="w-5 h-5 text-gray-400 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    
    <!-- Calendar dropdown -->
    <div 
      v-show="isOpen" 
      class="absolute z-10 mt-1 bg-white border border-gray-300 shadow-lg rounded-lg p-3 w-full max-w-xs sm:max-w-md"
    >
      <!-- Calendar header with month/year navigation -->
      <div v-if="!timeOnly" class="flex justify-between items-center mb-3">
        <button @click="prevYear" class="p-2 hover:bg-gray-100 rounded-full">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <button @click="prevMonth" class="p-2 hover:bg-gray-100 rounded-full">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <div class="text-center font-medium text-sm sm:text-base">
          {{ monthNames[currentMonth] }} {{ currentYear }}
        </div>
        <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-full">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <button @click="nextYear" class="p-2 hover:bg-gray-100 rounded-full">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <!-- Days of week - Fixed alignment -->
      <div v-if="!timeOnly" class="grid grid-cols-7 gap-1 mb-2">
        <div v-for="day in daysOfWeek" :key="day" class="text-center text-xs font-medium text-gray-500 h-6 flex items-center justify-center">
          {{ day }}
        </div>
      </div>
      
      <!-- Calendar days -->
      <div v-if="!timeOnly" class="grid grid-cols-7 gap-1 mb-3">
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index"
          @click="selectDate(day)"
          class="h-8 flex items-center justify-center text-sm rounded-full cursor-pointer"
          :class="{
            'text-gray-400': !day.currentMonth,
            'bg-blue-500 text-white': isSelectedDate(day),
            'hover:bg-gray-100': !isSelectedDate(day)
          }"
        >
          {{ day.number }}
        </div>
      </div>
      
      <!-- Time selector -->
      <div v-if="showTime || timeOnly" class="flex justify-center space-x-3 items-center">
        <!-- Hours -->
        <div class="flex flex-col items-center">
          <button @click="incrementHour" class="p-1 hover:bg-gray-100 rounded-full">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <input 
            v-model="hours" 
            type="text" 
            class="w-12 text-center border rounded-lg py-1 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @change="validateTime"
            @input="updateTimeImmediately"
          >
          <button @click="decrementHour" class="p-1 hover:bg-gray-100 rounded-full">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <span class="text-xl">:</span>
        
        <!-- Minutes -->
        <div class="flex flex-col items-center">
          <button @click="incrementMinute" class="p-1 hover:bg-gray-100 rounded-full">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <input 
            v-model="minutes" 
            type="text" 
            class="w-12 text-center border rounded-lg py-1 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @change="validateTime"
            @input="updateTimeImmediately"
          >
          <button @click="decrementMinute" class="p-1 hover:bg-gray-100 rounded-full">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <!-- AM/PM toggle if 12-hour format -->
        <div v-if="hourFormat === '12'" class="flex flex-col space-y-2 ml-2">
          <button 
            @click="toggleAmPm"
            class="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 transition-colors"
            :class="{'bg-blue-500 text-white hover:bg-blue-600': ampm === 'AM'}"
          >
            AM
          </button>
          <button 
            @click="toggleAmPm"
            class="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 transition-colors"
            :class="{'bg-blue-500 text-white hover:bg-blue-600': ampm === 'PM'}"
          >
            PM
          </button>
        </div>
      </div>
      
      <!-- Clear button only -->
      <div class="flex justify-end mt-3 pt-3 border-t">
        <button @click="clearValue" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          Clear
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    modelValue: {
      type: [Date, String, null],
      default: null
    },
    placeholder: {
      type: String,
      default: 'Select date'
    },
    showTime: {
      type: Boolean,
      default: false
    },
    timeOnly: {
      type: Boolean,
      default: false
    },
    hourFormat: {
      type: String,
      default: '24',
      validator: (value) => ['12', '24'].includes(value)
    }
  },
  data() {
    return {
      isOpen: false,
      currentDate: new Date(),
      selectedDate: null,
      hours: '00',
      minutes: '00',
      ampm: 'AM',
      daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  },
  computed: {
    currentMonth() {
      return this.currentDate.getMonth();
    },
    currentYear() {
      return this.currentDate.getFullYear();
    },
    calendarDays() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      
      // Get first day of month
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const daysInMonth = lastDay.getDate();
      const startDayOfWeek = firstDay.getDay();
      
      // Previous month's days
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      
      const days = [];
      
      // Add days from previous month
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        days.push({
          number: prevMonthLastDay - i,
          currentMonth: false,
          date: new Date(year, month - 1, prevMonthLastDay - i)
        });
      }
      
      // Add days from current month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push({
          number: i,
          currentMonth: true,
          date: new Date(year, month, i)
        });
      }
      
      // Add days from next month to complete the grid (6 rows x 7 days = 42)
      const remainingDays = 42 - days.length;
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          number: i,
          currentMonth: false,
          date: new Date(year, month + 1, i)
        });
      }
      
      return days;
    },
    formattedValue() {
      if (!this.modelValue) return '';
      
      let dateObj;
      if (typeof this.modelValue === 'string') {
        dateObj = new Date(this.modelValue);
      } else {
        dateObj = this.modelValue;
      }
      
      if (isNaN(dateObj.getTime())) return '';
      
      let result = '';
      
      if (!this.timeOnly) {
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();
        result += `${month}/${day}/${year}`;
      }
      
      if (this.showTime || this.timeOnly) {
        let hours = dateObj.getHours();
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        let ampm = '';
        
        if (this.hourFormat === '12') {
          ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12 || 12;
        }
        
        hours = hours.toString().padStart(2, '0');
        
        if (result) {
          result += ' ';
        }
        
        result += `${hours}:${minutes}${this.hourFormat === '12' ? ' ' + ampm : ''}`;
      }
      
      return result;
    }
  },
  methods: {
    toggleCalendar() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.initFromValue();
      }
    },
    initFromValue() {
      if (this.modelValue) {
        let dateObj;
        if (typeof this.modelValue === 'string') {
          dateObj = new Date(this.modelValue);
        } else {
          dateObj = this.modelValue;
        }
        
        if (!isNaN(dateObj.getTime())) {
          this.currentDate = new Date(dateObj);
          this.selectedDate = new Date(dateObj);
          
          let hours = dateObj.getHours();
          if (this.hourFormat === '12') {
            this.ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
          }
          
          this.hours = hours.toString().padStart(2, '0');
          this.minutes = dateObj.getMinutes().toString().padStart(2, '0');
        }
      } else {
        const now = new Date();
        this.currentDate = new Date();
        this.selectedDate = null;
        
        let hours = now.getHours();
        if (this.hourFormat === '12') {
          this.ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12 || 12;
        }
        
        this.hours = hours.toString().padStart(2, '0');
        this.minutes = now.getMinutes().toString().padStart(2, '0');
      }
    },
    prevMonth() {
      const newDate = new Date(this.currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      this.currentDate = newDate;
    },
    nextMonth() {
      const newDate = new Date(this.currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      this.currentDate = newDate;
    },
    prevYear() {
      const newDate = new Date(this.currentDate);
      newDate.setFullYear(newDate.getFullYear() - 1);
      this.currentDate = newDate;
    },
    nextYear() {
      const newDate = new Date(this.currentDate);
      newDate.setFullYear(newDate.getFullYear() + 1);
      this.currentDate = newDate;
    },
    isSelectedDate(day) {
      if (!this.selectedDate || !day.date) return false;
      
      return (
        day.date.getDate() === this.selectedDate.getDate() &&
        day.date.getMonth() === this.selectedDate.getMonth() &&
        day.date.getFullYear() === this.selectedDate.getFullYear()
      );
    },
    selectDate(day) {
      this.selectedDate = new Date(day.date);
      this.currentDate = new Date(day.date);
      this.updateValueImmediately();
    },
    incrementHour() {
      let hour = parseInt(this.hours);
      const maxHour = this.hourFormat === '12' ? 12 : 23;
      const minHour = this.hourFormat === '12' ? 1 : 0;
      
      hour = (hour + 1) > maxHour ? minHour : hour + 1;
      this.hours = hour.toString().padStart(2, '0');
      this.updateTimeImmediately();
    },
    decrementHour() {
      let hour = parseInt(this.hours);
      const maxHour = this.hourFormat === '12' ? 12 : 23;
      const minHour = this.hourFormat === '12' ? 1 : 0;
      
      hour = (hour - 1) < minHour ? maxHour : hour - 1;
      this.hours = hour.toString().padStart(2, '0');
      this.updateTimeImmediately();
    },
    incrementMinute() {
      let minute = parseInt(this.minutes);
      minute = (minute + 1) > 59 ? 0 : minute + 1;
      this.minutes = minute.toString().padStart(2, '0');
      this.updateTimeImmediately();
    },
    decrementMinute() {
      let minute = parseInt(this.minutes);
      minute = (minute - 1) < 0 ? 59 : minute - 1;
      this.minutes = minute.toString().padStart(2, '0');
      this.updateTimeImmediately();
    },
    toggleAmPm() {
      this.ampm = this.ampm === 'AM' ? 'PM' : 'AM';
      this.updateTimeImmediately();
    },
    validateTime() {
      let hour = parseInt(this.hours);
      let minute = parseInt(this.minutes);
      
      const maxHour = this.hourFormat === '12' ? 12 : 23;
      const minHour = this.hourFormat === '12' ? 1 : 0;
      
      if (isNaN(hour)) {
        hour = minHour;
      } else if (hour < minHour) {
        hour = minHour;
      } else if (hour > maxHour) {
        hour = maxHour;
      }
      
      if (isNaN(minute) || minute < 0) {
        minute = 0;
      } else if (minute > 59) {
        minute = 59;
      }
      
      this.hours = hour.toString().padStart(2, '0');
      this.minutes = minute.toString().padStart(2, '0');
      this.updateTimeImmediately();
    },
    updateValueImmediately() {
      let newDate;
      
      if (this.timeOnly) {
        newDate = new Date();
        newDate.setHours(0, 0, 0, 0); // Reset to midnight
      } else if (this.selectedDate) {
        newDate = new Date(this.selectedDate);
      } else {
        newDate = null;
      }
      
      if (newDate && (this.showTime || this.timeOnly)) {
        let hours = parseInt(this.hours);
        const minutes = parseInt(this.minutes);
        
        if (this.hourFormat === '12' && this.ampm === 'PM' && hours < 12) {
          hours += 12;
        } else if (this.hourFormat === '12' && this.ampm === 'AM' && hours === 12) {
          hours = 0;
        }
        
        newDate.setHours(hours, minutes, 0, 0);
      }
      
      this.$emit('update:modelValue', newDate);
    },
    updateTimeImmediately() {
      if (this.selectedDate || this.timeOnly) {
        this.updateValueImmediately();
      }
    },
    clearValue() {
      this.selectedDate = null;
      this.$emit('update:modelValue', null);
      this.isOpen = false;
    },
    handleClickOutside(event) {
      if (this.$el && !this.$el.contains(event.target)) {
        this.isOpen = false;
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.initFromValue();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  watch: {
    modelValue() {
      this.initFromValue();
    }
  }
}
</script>