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
        this.$nextTick(() => { // Ensure the DOM is updated before emitting
          this.$emit('input', this.editor.getValue())
        })
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

:deep(.ace_editor) {
  font-family: 'Fira Code', monospace;
  line-height: 1.5;
  background-color: #1e1e1e; /* VS Code Dark theme background */
  color: #d4d4d4; /* VS Code Dark theme default text color */
}

:deep(.ace_gutter) {
  background-color: #1e1e1e; /* VS Code Dark theme gutter background */
  color: #606060; /* VS Code Dark theme gutter number color */
  border-right: 1px solid #2d2d2d; /* Slightly darker border */
}

:deep(.ace_print-margin) {
  width: 1px;
  background: #3b3b3b; /* VS Code Dark theme print margin */
}

:deep(.ace_cursor) {
  color: #aeafad; /* VS Code Dark theme cursor color */
  border-left: 2px solid; /* Thicker cursor */
}

/* VS Code Dark theme selection background */
:deep(.ace_marker-layer .ace_selection) {
  background: rgba(38, 79, 120, 0.5);
}

/* Generic markers - keeping these simple */
:deep(.ace_marker-layer .ace_step) {
  background: rgba(100, 100, 100, 0.3);
}

:deep(.ace_marker-layer .ace_stack) {
  background: rgba(120, 120, 120, 0.3);
}

/* VS Code Dark theme bracket match border */
:deep(.ace_marker-layer .ace_bracket) {
  margin: -1px 0 0 -1px;
  border: 1px solid #515151;
}

/* VS Code Dark theme active line background */
:deep(.ace_marker-layer .ace_active-line) {
  background: #2d2d2d;
}

/* VS Code Dark theme selected word background and border */
:deep(.ace_marker-layer .ace_selected-word) {
  background-color: rgba(38, 79, 120, 0.3);
  border: 1px solid #515151;
}

:deep(.ace_invisible) {
  color: #404040; /* VS Code Dark theme invisible characters */
}

/* Syntax highlighting - VS Code Dark Theme Palette (same as before) */
:deep(.ace_entity.ace_name.ace_tag) {
  color: #569cd6; /* Blue for tags */
}

:deep(.ace_entity.ace_other.ace_attribute-name) {
  color: #9cdcb0; /* Light green for attribute names */
}

:deep(.ace_entity.ace_name.ace_function) {
  color: #dcdcaa; /* Yellow for functions */
}

:deep(.ace_keyword) {
  color: #c586c0; /* Purple for keywords */
}

:deep(.ace_constant) {
  color: #4fc1ff; /* Light blue for constants */
}

:deep(.ace_constant.ace_numeric) {
  color: #b5cea8; /* Green for numbers */
}

:deep(.ace_variable) {
  color: #9cdcb0; /* Light green for variables */
}

:deep(.ace_variable.ace_parameter) {
  color: #fcd34d; /* Yellow for parameters (slight variation from VS Code) */
}

:deep(.ace_string) {
  color: #ce9178; /* Orange for strings */
}

:deep(.ace_comment) {
  color: #6a9955; /* Green for comments */
  font-style: italic;
}

:deep(.ace_support.ace_function) {
  color: #dcdcaa; /* Yellow for support functions */
}

:deep(.ace_support.ace_class) {
  color: #4fc1ff; /* Light blue for support classes */
}

:deep(.ace_storage) {
  color: #c586c0; /* Purple for storage keywords */
}

:deep(.ace_operator) {
  color: #d4d4d4; /* VS Code Dark theme default text color */
}

:deep(.ace_indent-guide) {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHB3d/8PAAOIAdULw8qMAAAAAElFTkSuQmCC) right repeat-y;
  opacity: 0.15;
}

/* VS Code Dark theme active line gutter background and text */
:deep(.ace_gutter-cell.ace_gutter-active-line) {
  background-color: #2d2d2d;
  color: #c6c6c6;
}

:deep(.ace_content) {
  background: #1e1e1e; /* VS Code Dark theme background */
  color: #d4d4d4; /* VS Code Dark theme default text color */
}

/* Scrollbar to match VS Code Dark theme (same as before) */
:deep(.ace_scrollbar) {
  background-color: #1e1e1e;
  width: 10px;
}

:deep(.ace_scrollbar-inner) {
  background-color: #5a5a5a;
}

:deep(.ace_scrollbar-inner:hover) {
  background-color: #7a7a7a;
}
</style>