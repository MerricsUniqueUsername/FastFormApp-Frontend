<template>
  <div class="h-16 w-full bg-neutral-950 border-b border-neutral-800 flex items-center justify-between px-4">
    <div class="flex items-center space-x-4">
      <input 
        v-model="form.title" 
        type="text" 
        class="bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-md px-4 py-1 text-base shadow-sm 
               focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out 
               placeholder-neutral-500"
        placeholder="Form Title"
      />
    </div>

    <div class="flex items-center space-x-4">
      <!-- Preview button -->
      <button 
        @click="$emit('openPreview')" 
        class="bg-neutral-800 border border-neutral-700 text-neutral-300 p-2 rounded-md 
               hover:bg-orange-500/10 hover:border-orange-400 hover:text-orange-400 
               transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
        </svg>
      </button>
    </div>
  </div>
</template>



<script>
export default {
	name: 'Topbar',
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
}
</script>