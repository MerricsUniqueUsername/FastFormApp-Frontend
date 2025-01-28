<template>
  <div>
    <!-- Accept slot content -->
    <slot v-if="!innerHtml"></slot>

    <!-- Render iframe with reactive content -->
    <iframe
      v-if="innerHtml"
      ref="iframe"
      style="width: 100%; height: 100%; border: none;"
      :srcdoc="innerHtml"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "ReactiveIframe",
  props: {
    // Optional: default content if no slot is provided
    defaultHtml: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      innerHtml: null, // The content for the iframe
    };
  },
  watch: {
    // Watch for changes to slot content
    $slots: {
      handler() {
        this.updateIframeContent();
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // Parse slot content on mount
    this.updateIframeContent();
  },
  methods: {
    updateIframeContent() {
      // Extract slot content dynamically
      const slotContent = this.$slots.default
        ? this.$slots.default()
            .map((vnode) => vnode.el?.outerHTML || "")
            .join("")
        : this.defaultHtml;

      // Update the iframe's content
      this.innerHtml = slotContent || null;
    },
  },
};
</script>

<style scoped>
/* Optional: Adjust iframe container styling */
iframe {
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
