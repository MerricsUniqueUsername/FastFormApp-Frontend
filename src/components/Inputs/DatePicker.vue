<template>
  <div class="relative w-full">
    <!-- Input field that displays the selected date/time -->
    <div
      class="input w-full flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white cursor-pointer transition-all duration-150"
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
          class="time-menu fixed z-[550] rounded-md shadow-lg bg-white border border-gray-200 flex flex-col p-2"
          :class="{
            'w-56': !timeOnly,
            'w-48': timeOnly
          }"
          :style="calendarPosition"
        >
          <!-- Calendar and Time Pickers Container -->
          <div class="flex-grow">
            <!-- Show calendar only if not in timeOnly mode -->
            <template v-if="!timeOnly">
              <!-- Calendar header with month/year navigation -->
              <div class="time-header flex justify-between items-center p-2">
                <button @click="previousYear" class="p-1 rounded-full time-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>

                <button @click="previousMonth" class="p-1 rounded-full time-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <span class="mx-1 text-xs">
                  {{ monthNames[currentMonth] }} {{ currentYear }}
                </span>

                <button @click="nextMonth" class="p-1 rounded-full time-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button @click="nextYear" class="p-1 rounded-full time-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7m-8-14l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <!-- Days of the week -->
              <div class="grid grid-cols-7 text-center text-sm opacity-80 py-1">
                <div v-for="day in daysOfWeek" :key="day" class="py-1">{{ day }}</div>
              </div>

              <!-- Calendar days -->
              <div class="grid grid-cols-7 text-center">
                <div
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  @click="selectDate(day)"
                  class="rounded-full p-1 text-xs cursor-pointer aspect-square flex items-center justify-center"
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
            <div v-if="showTime" :class="{ 'py-2': !timeOnly, 'pt-2': timeOnly }">
              <div class="flex justify-center items-center gap-2">
                <!-- Hours -->
                <div class="flex flex-col items-center">
                  <button
                    @click="incrementHour"
                    class="p-1 rounded-full time-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <div class="text-center py-1 w-10 text-sm">{{ formatHour(selectedHour) }}</div>
                  <button
                    @click="decrementHour"
                    class="p-1 rounded-full time-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <div class="text-center py-1 w-10 text-sm">{{ selectedMinute.toString().padStart(2, '0') }}</div>
                  <button
                    @click="decrementMinute"
                    class="p-1 rounded-full time-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          </div>

          <div class="flex justify-center pt-2 mt-2">
            <button
              @click="clearDate"
              class="time-btn px-3 text-sm rounded mr-2"
            >
              Clear
            </button>
            <button
              @click="updateTime(); closeCalendar();"
              class="time-btn px-3 text-sm rounded"
            >
              Done
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
      calendarPosition: {}, // Will contain { top: 'Xpx', left: 'Ypx' }
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
          // When cleared, reset to current hour/minute to avoid stale values
          if (this.showTime) {
              const now = new Date();
              this.selectedHour = now.getHours();
              this.selectedMinute = now.getMinutes();
              if (this.hourFormat === '12') {
                  this.ampm = this.selectedHour >= 12 ? 'PM' : 'AM';
                  this.selectedHour = this.selectedHour % 12 || 12;
              }
          }
        }
      },
      immediate: true
    },
    showCalendar(isVisible) {
      if (isVisible) {
        // Use nextTick to ensure the calendar is rendered and dimensions are available
        this.$nextTick(() => {
          this.calculatePosition();
          window.addEventListener('click', this.handleOutsideClick);
          window.addEventListener('resize', this.calculatePosition);
          window.addEventListener('scroll', this.calculatePosition, true); // true for capture phase to catch scroll events on any element
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
      if (this.showCalendar && this.showTime && !this.selectedDate) {
        // If opening and showing time, but no date is selected yet,
        // initialize time fields with current time
        const now = new Date();
        this.selectedHour = now.getHours();
        this.selectedMinute = now.getMinutes();
        if (this.hourFormat === '12') {
          this.ampm = this.selectedHour >= 12 ? 'PM' : 'AM';
          this.selectedHour = this.selectedHour % 12 || 12;
        }
      }
    },
    calculatePosition() {
      if (!this.$refs.calendar || !this.$refs.inputField) return;

      const inputRect = this.$refs.inputField.getBoundingClientRect();
      const calendarRect = this.$refs.calendar.getBoundingClientRect();

      const calendarHeight = calendarRect.height;
      const calendarWidth = calendarRect.width;

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const spaceBelow = viewportHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;

      let top, left;
      const offset = 8; // Desired distance from the input field (e.g., 8px for 0.5rem)

      // Determine dropdown direction (up or down)
      // Go up if not enough space below AND enough space above
      const shouldGoUp = spaceBelow < (calendarHeight + offset) && spaceAbove >= (calendarHeight + offset);

      if (shouldGoUp) {
        top = inputRect.top + window.scrollY - calendarHeight - offset; // Position above input
      } else {
        top = inputRect.bottom + window.scrollY + offset; // Position below input
      }

      // Calculate left position (aligned with input's left edge initially)
      left = inputRect.left + window.scrollX;

      // Adjust if calendar goes off-screen to the right
      if (left + calendarWidth > viewportWidth - 5) { // 5px buffer from right edge
        left = viewportWidth - calendarWidth - 5;
      }
      // Adjust if calendar goes off-screen to the left
      if (left < 5) { // 5px buffer from left edge
        left = 5;
      }

      // Ensure top doesn't go negative, respecting vertical bounds
      if (top < 0) {
          top = 0;
      }
      if (top + calendarHeight > viewportHeight + window.scrollY) {
          top = viewportHeight + window.scrollY - calendarHeight;
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

      // If a date was already selected and time is enabled, preserve the time
      if (this.selectedDate && this.showTime) {
        const hours = this.getHours();
        const minutes = this.selectedMinute;
        newDate.setHours(hours, minutes);
      } else if (this.showTime && !this.selectedDate) {
          // If no date was selected but time is enabled, use current time
          const now = new Date();
          newDate.setHours(now.getHours(), now.getMinutes());
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
      // For 12-hour format, selectedHour is already 1-12
      // For 24-hour format, selectedHour is 0-23
      return hour.toString().padStart(2, '0');
    },
    getHours() {
      if (this.hourFormat === '12') {
        let hours = this.selectedHour;
        if (this.ampm === 'PM' && hours !== 12) {
          hours += 12;
        } else if (this.ampm === 'AM' && hours === 12) {
          hours = 0; // Midnight (12 AM) is 0 hours
        }
        return hours;
      }
      return this.selectedHour;
    },
    incrementHour() {
      if (this.hourFormat === '12') {
        if (this.selectedHour === 11 && this.ampm === 'AM') this.ampm = 'PM';
        else if (this.selectedHour === 11 && this.ampm === 'PM') this.ampm = 'AM';
        this.selectedHour = this.selectedHour % 12 + 1;
      } else {
        this.selectedHour = (this.selectedHour + 1) % 24;
      }
      this.updateTime();
    },
    decrementHour() {
      if (this.hourFormat === '12') {
        if (this.selectedHour === 12 && this.ampm === 'AM') this.ampm = 'PM';
        else if (this.selectedHour === 12 && this.ampm === 'PM') this.ampm = 'AM';
        this.selectedHour = (this.selectedHour - 1 + 12) % 12 || 12;
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
        // If no date is selected (e.g., timeOnly mode), create a new date with today's date
        const now = new Date();
        this.selectedDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          this.getHours(),
          this.selectedMinute
        );
      } else {
        // Update the time of the currently selected date
        this.selectedDate.setHours(this.getHours(), this.selectedMinute);
      }
      this.emitDate();
    }
  },
  mounted() {
    // Initial call to set time based on modelValue if provided and showTime is true
    if (this.modelValue && this.showTime) {
        const date = new Date(this.modelValue);
        this.selectedHour = date.getHours();
        this.selectedMinute = date.getMinutes();
        if (this.hourFormat === '12') {
            this.ampm = this.selectedHour >= 12 ? 'PM' : 'AM';
            this.selectedHour = this.selectedHour % 12 || 12;
        }
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
/* Transition for fading in/out */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Base styles for selected days and unselected days */
.selected-day {
  background-color: #3B82F6; /* blue-500 */
  color: white;
}

.unselected-day:hover {
  background-color: #E5E7EB; /* gray-200 */
}

.not-day-in-month {
  color: #9CA3AF; /* gray-400 */
  cursor: default;
}

/* Styles for navigation buttons */
.time-btn:hover {
  background-color: #F3F4F6; /* gray-100 */
}


.am-pm-btn:hover {
  background-color: #E5E7EB; /* gray-200 */
}

/* Input field placeholder color */
.input .placeholder {
  color: #9CA3AF; /* gray-400 */
}
</style>