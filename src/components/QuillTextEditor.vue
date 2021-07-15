<template>
  <quill-editor
    ref="myQuillEditor"
    v-model="content"
    @change="onEditorChange($event)"
  />
</template>

<script>
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  props: {
    initialContent: String
  },
  data () {
    return {
      content: this.$props.initialContent
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    onEditorChange: function ({ quill, html, text }) {
      this.content = html
      this.$emit('unSave')
    }
  }
}
</script>
