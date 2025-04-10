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
  background-color: #111827; /* Matches bg-gray-900 from Vue component */
  color: #e5e7eb; /* Matches text-gray-200 from Vue component */
}

:deep(.ace_gutter) {
  background-color: #0f172a; /* Slightly darker than editor for contrast */
  color: #6b7280; /* Matches text-gray-500 from Vue component */
  border-right: 1px solid #1f2937; /* Matches border-gray-800 */
}

:deep(.ace_print-margin) {
  width: 1px;
  background: #1f2937; /* Matches border-gray-800 */
}

:deep(.ace_cursor) {
  color: #60a5fa; /* Matches text-blue-400 from Vue component */
  border-left: 2px solid; /* Thicker cursor */
}

:deep(.ace_marker-layer .ace_selection) {
  background: rgba(37, 99, 235, 0.2); /* Matches bg-blue-600/20 */
}

:deep(.ace_marker-layer .ace_step) {
  background: rgb(198, 219, 174);
}

:deep(.ace_marker-layer .ace_stack) {
  background: rgb(164, 229, 184);
}

:deep(.ace_marker-layer .ace_bracket) {
  margin: -1px 0 0 -1px;
  border: 1px solid #3b82f6; /* Matches border-blue-500 */
}

:deep(.ace_marker-layer .ace_active-line) {
  background: #1e293b; /* Slightly lighter than base background */
}

:deep(.ace_marker-layer .ace_selected-word) {
  background-color: rgba(37, 99, 235, 0.15); /* Lighter blue highlight */
  border: 1px solid #60a5fa; /* Matches text-blue-400 */
}

:deep(.ace_invisible) {
  color: #4b5563; /* Matches text-gray-600 */
}

/* Syntax highlighting - Vue-style palette */
:deep(.ace_entity.ace_name.ace_tag) {
  color: #93c5fd; /* Matches text-blue-300 */
}

:deep(.ace_entity.ace_other.ace_attribute-name) {
  color: #a5b4fc; /* Light indigo */
}

:deep(.ace_entity.ace_name.ace_function) {
  color: #fcd34d; /* Amber/gold for functions */
}

:deep(.ace_keyword) {
  color: #c4b5fd; /* Purple - matches Vue's style */
}

:deep(.ace_constant) {
  color: #5eead4; /* Teal for constants */
}

:deep(.ace_constant.ace_numeric) {
  color: #86efac; /* Light green for numbers */
}

:deep(.ace_variable) {
  color: #bfdbfe; /* Light blue for variables */
}

:deep(.ace_variable.ace_parameter) {
  color: #fca5a5; /* Light red for parameters */
}

:deep(.ace_string) {
  color: #fca5a5; /* Light red for strings */
}

:deep(.ace_comment) {
  color: #6b7280; /* Matches text-gray-500 */
  font-style: italic;
}

:deep(.ace_support.ace_function) {
  color: #fcd34d; /* Amber/gold for support functions */
}

:deep(.ace_support.ace_class) {
  color: #5eead4; /* Teal for classes */
}

:deep(.ace_storage) {
  color: #93c5fd; /* Light blue for storage keywords */
}

:deep(.ace_operator) {
  color: #e5e7eb; /* Matches text-gray-200 */
}

:deep(.ace_indent-guide) {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHB3d/8PAAOIAdULw8qMAAAAAElFTkSuQmCC) right repeat-y;
  opacity: 0.15;
}

:deep(.ace_gutter-cell.ace_gutter-active-line) {
  background-color: #1f2937; /* Matches bg-gray-800 */
  color: #9ca3af; /* Brighter text for active line */
}

:deep(.ace_content) {
  background: #111827; /* Matches bg-gray-900 */
  color: #e5e7eb; /* Matches text-gray-200 */
}

/* Improved scrollbar to match Vue component style */
:deep(.ace_scrollbar) {
  background-color: #111827; /* Matches bg-gray-900 */
  width: 10px;
}

:deep(.ace_scrollbar-inner) {
  background-color: #374151; /* Matches bg-gray-700 */
}
</style>