<template>
  <div class="relative w-full">
    <!-- Input field that displays the selected date/time -->
    <div 
      class="input w-full flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white cursor-pointer"
      @click="toggleCalendar"
      ref="inputField"
    >
      <span v-if="displayValue" class="flex-grow">{{ displayValue }}</span>
      <span v-else class="flex-grow placeholder">{{ placeholder }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path v-if="timeOnly" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>

    <!-- Dropdown - Using teleport to move it to body to avoid positioning issues -->
    <Teleport to="body">
      <transition name="fade">
        <div 
          v-if="showCalendar" 
          ref="calendar"
          class="time-menu fixed z-[550] my-1"
          :class="timeOnly ? 'w-64' : 'w-72'"
          :style="calendarPosition"
        >
          <!-- Show calendar only if not in timeOnly mode -->
          <template v-if="!timeOnly">
            <!-- Calendar header with month/year navigation -->
            <div class="time-header flex justify-between items-center p-2">
              <button @click="previousYear" class="p-1 rounded-full time-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              
              <button @click="previousMonth" class="p-1 rounded-full time-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <span class="mx-1 font-medium">
                {{ monthNames[currentMonth] }} {{ currentYear }}
              </span>
              
              <button @click="nextMonth" class="p-1 rounded-full time-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button @click="nextYear" class="p-1 rounded-full time-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7m-8-14l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Days of the week -->
            <div class="grid grid-cols-7 text-center text-xs opacity-80 py-1">
              <div v-for="day in daysOfWeek" :key="day" class="py-1">{{ day }}</div>
            </div>

            <!-- Calendar days -->
            <div class="grid grid-cols-7 text-center time-header p-1">
              <div 
                v-for="(day, index) in calendarDays" 
                :key="index" 
                @click="selectDate(day)" 
                class="rounded-full p-1 text-sm cursor-pointer aspect-square flex items-center justify-center"
                :class="{
                  'not-day-in-month': !day.currentMonth,
                  'selected-day': isSelectedDate(day),
                  'unselected-day': !isSelectedDate(day) && day.currentMonth
                }"
              >
                {{ day.day }}
              </div>
            </div>
          </template>

          <!-- Time selection (only show if showTime is true) -->
          <div v-if="showTime" class="py-2">
            <div class="flex justify-center items-center gap-2 time-header">
              <!-- Hours -->
              <div class="flex flex-col items-center">
                <button 
                  @click="incrementHour" 
                  class="p-1 rounded-full time-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <div class="text-center py-1 w-10">{{ formatHour(selectedHour) }}</div>
                <button 
                  @click="decrementHour" 
                  class="p-1 rounded-full time-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              <div class="text-xl">:</div>
              
              <!-- Minutes -->
              <div class="flex flex-col items-center">
                <button 
                  @click="incrementMinute" 
                  class="p-1 rounded-full time-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <div class="text-center py-1 w-10">{{ selectedMinute.toString().padStart(2, '0') }}</div>
                <button 
                  @click="decrementMinute" 
                  class="p-1 rounded-full time-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              <!-- AM/PM toggle for 12-hour format -->
              <div v-if="hourFormat === '12'" class="flex flex-col items-center">
                <button 
                  @click="toggleAmPm" 
                  class="px-2 py-1 rounded text-sm am-pm-btn"
                >
                  {{ ampm }}
                </button>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="p-2 flex justify-end gap-2">
            <button 
              @click="clearDate" 
              class="time-btn px-3 py-1 text-sm rounded"
            >
              Clear
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    modelValue: {
      type: [Date, String],
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
  emits: ['update:modelValue'],
  data() {
    return {
      showCalendar: false,
      currentDate: new Date(),
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      selectedDate: this.modelValue ? new Date(this.modelValue) : null,
      selectedHour: 0,
      selectedMinute: 0,
      ampm: 'AM',
      calendarPosition: {},
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    };
  },
  computed: {
    displayValue() {
      if (!this.modelValue) return '';
      
      const date = new Date(this.modelValue);
      
      if (this.timeOnly) {
        // Format time only
        if (this.hourFormat === '12') {
          return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
        } else {
          return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
        }
      }
      
      // Format date
      let result = date.toLocaleDateString();
      
      // Add time if showTime is true
      if (this.showTime) {
        let timeStr = '';
        if (this.hourFormat === '12') {
          timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
        } else {
          timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
        }
        result = `${result} ${timeStr}`;
      }
      
      return result;
    },
    calendarDays() {
      const days = [];
      const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
      const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
      
      // Add days from previous month
      const firstDayOfWeek = firstDayOfMonth.getDay();
      const lastDayPrevMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
      
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        days.push({
          day: lastDayPrevMonth - i,
          month: this.currentMonth === 0 ? 11 : this.currentMonth - 1,
          year: this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear,
          currentMonth: false
        });
      }
      
      // Add days of current month
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        days.push({
          day: i,
          month: this.currentMonth,
          year: this.currentYear,
          currentMonth: true
        });
      }
      
      // Add days from next month
      const remainingCells = 42 - days.length;
      for (let i = 1; i <= remainingCells; i++) {
        days.push({
          day: i,
          month: this.currentMonth === 11 ? 0 : this.currentMonth + 1,
          year: this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear,
          currentMonth: false
        });
      }
      
      return days;
    }
  },
  watch: {
    modelValue: {
      handler(newVal) {
        if (newVal) {
          const date = new Date(newVal);
          this.selectedDate = date;
          
          if (!this.timeOnly) {
            this.currentMonth = date.getMonth();
            this.currentYear = date.getFullYear();
          }
          
          // Only update time-related fields if showTime is true
          if (this.showTime) {
            this.selectedHour = date.getHours();
            this.selectedMinute = date.getMinutes();
            
            if (this.hourFormat === '12') {
              this.ampm = this.selectedHour >= 12 ? 'PM' : 'AM';
              this.selectedHour = this.selectedHour % 12 || 12;
            }
          }
        } else {
          this.selectedDate = null;
        }
      },
      immediate: true
    },
    showCalendar(isVisible) {
      if (isVisible) {
        this.$nextTick(() => {
          this.calculatePosition();
          window.addEventListener('click', this.handleOutsideClick);
          window.addEventListener('resize', this.calculatePosition);
          window.addEventListener('scroll', this.calculatePosition, true);
        });
      } else {
        window.removeEventListener('click', this.handleOutsideClick);
        window.removeEventListener('resize', this.calculatePosition);
        window.removeEventListener('scroll', this.calculatePosition, true);
      }
    }
  },
  methods: {
    toggleCalendar() {
      this.showCalendar = !this.showCalendar;
      if (this.showCalendar) {
        // Initialize time fields if showTime is true
        if (this.showTime) {
          const dateToUse = this.selectedDate || new Date();
          this.selectedHour = dateToUse.getHours();
          this.selectedMinute = dateToUse.getMinutes();
          
          if (this.hourFormat === '12') {
            this.ampm = this.selectedHour >= 12 ? 'PM' : 'AM';
            this.selectedHour = this.selectedHour % 12 || 12;
          }
        }
      }
    },
    calculatePosition() {
      if (!this.$refs.calendar || !this.$refs.inputField) return;
      
      const inputRect = this.$refs.inputField.getBoundingClientRect();
      const calendarHeight = this.$refs.calendar.offsetHeight;
      const calendarWidth = this.$refs.calendar.offsetWidth;
      
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - inputRect.bottom;
      
      let top, left;
      
      // Position below the input if there's space, otherwise above
      if (spaceBelow >= calendarHeight || spaceBelow > inputRect.top) {
        top = inputRect.bottom + window.scrollY;
      } else {
        top = inputRect.top + window.scrollY - calendarHeight;
      }
      
      left = inputRect.left + window.scrollX;
      
      // Adjust if calendar would go off-screen to the right
      if (left + calendarWidth > window.innerWidth) {
        left = Math.max(0, window.innerWidth - calendarWidth);
      }
      
      this.calendarPosition = {
        top: `${top}px`,
        left: `${left}px`
      };
    },
    previousYear() {
      this.currentYear--;
    },
    nextYear() {
      this.currentYear++;
    },
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    selectDate(day) {
      if (this.timeOnly) return;
      
      const newDate = new Date(day.year, day.month, day.day);
      
      if (this.selectedDate && this.showTime) {
        // Keep the time from the existing selection
        const hours = this.getHours();
        const minutes = this.selectedMinute;
        newDate.setHours(hours, minutes);
      }
      
      this.selectedDate = newDate;
      this.emitDate();
      
      // Close the calendar if not showing time
      if (!this.showTime) {
        this.closeCalendar();
      }
    },
    clearDate() {
      this.selectedDate = null;
      this.emitDate();
      this.closeCalendar();
    },
    closeCalendar() {
      this.showCalendar = false;
    },
    emitDate() {
      this.$emit('update:modelValue', this.selectedDate);
    },
    isSelectedDate(day) {
      if (!this.selectedDate) return false;
      
      return (
        day.day === this.selectedDate.getDate() &&
        day.month === this.selectedDate.getMonth() &&
        day.year === this.selectedDate.getFullYear()
      );
    },
    handleOutsideClick(event) {
      if (this.$refs.calendar && !this.$refs.calendar.contains(event.target) && 
          this.$refs.inputField && !this.$refs.inputField.contains(event.target)) {
        this.closeCalendar();
      }
    },
    formatHour(hour) {
      if (this.hourFormat === '12') {
        return hour.toString().padStart(2, '0');
      }
      return hour.toString().padStart(2, '0');
    },
    getHours() {
      if (this.hourFormat === '12') {
        let hours = this.selectedHour;
        if (hours === 12) {
          hours = this.ampm === 'AM' ? 0 : 12;
        } else if (this.ampm === 'PM') {
          hours += 12;
        }
        return hours;
      }
      return this.selectedHour;
    },
    incrementHour() {
      if (this.hourFormat === '12') {
        this.selectedHour = this.selectedHour === 12 ? 1 : this.selectedHour + 1;
      } else {
        this.selectedHour = (this.selectedHour + 1) % 24;
      }
      this.updateTime();
    },
    decrementHour() {
      if (this.hourFormat === '12') {
        this.selectedHour = this.selectedHour === 1 ? 12 : this.selectedHour - 1;
      } else {
        this.selectedHour = (this.selectedHour - 1 + 24) % 24;
      }
      this.updateTime();
    },
    incrementMinute() {
      this.selectedMinute = (this.selectedMinute + 1) % 60;
      this.updateTime();
    },
    decrementMinute() {
      this.selectedMinute = (this.selectedMinute - 1 + 60) % 60;
      this.updateTime();
    },
    toggleAmPm() {
      this.ampm = this.ampm === 'AM' ? 'PM' : 'AM';
      this.updateTime();
    },
    updateTime() {
      if (!this.selectedDate) {
        // If no date is selected (timeOnly mode), create a new date with today's date
        const now = new Date();
        this.selectedDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          this.getHours(),
          this.selectedMinute
        );
      } else {
        // Update the time of the selected date
        this.selectedDate.setHours(this.getHours(), this.selectedMinute);
      }
      this.emitDate();
    }
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleOutsideClick);
    window.removeEventListener('resize', this.calculatePosition);
    window.removeEventListener('scroll', this.calculatePosition, true);
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>