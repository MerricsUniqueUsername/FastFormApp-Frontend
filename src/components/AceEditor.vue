<template>
  <div class="editor-container">
    <div id="editor" ref="aceEditor"></div>
  </div>
</template>

<script>
import ace from 'ace-builds'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/ext-language_tools'

export default {
  name: 'AceEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: 'monokai'
    },
    mode: {
      type: String,
      default: 'css'
    }
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.initAceEditor()
  },
  methods: {
    initAceEditor() {
      this.editor = ace.edit(this.$refs.aceEditor, {
        mode: `ace/mode/${this.mode}`,
        theme: `ace/theme/${this.theme}`,
        fontSize: 14,
        showPrintMargin: true,
        showGutter: true,
        highlightActiveLine: true,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        tabSize: 2
      })

      this.editor.setValue(this.modelValue, 1)
      
      this.editor.on('change', () => {
        this.$emit('update:modelValue', this.editor.getValue())
      })
    }
  },
  watch: {
    modelValue(newValue) {
      if (this.editor && this.editor.getValue() !== newValue) {
        this.editor.setValue(newValue, 1)
      }
    },
    theme(newTheme) {
      this.editor.setTheme(`ace/theme/${newTheme}`)
    },
    mode(newMode) {
      this.editor.session.setMode(`ace/mode/${newMode}`)
    }
  },
  beforeUnmount() {
    if (this.editor) {
      this.editor.destroy()
      this.editor.container.remove()
    }
  }
}
</script>

<style scoped>
  .editor-container {
    width: 100%;
    height: 400px;
    position: relative;
  }

  #editor {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>