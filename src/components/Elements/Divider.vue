<template>

  <div>
    <div class="divider"></div>
  </div>
  
</template>

<script>
export default {
  name: 'Divider',
  props: {
    element: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    }
  },
}
</script>