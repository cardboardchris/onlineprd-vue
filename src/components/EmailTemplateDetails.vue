<template>
  <div>
    <b-form-group
      v-if="$can('update', subject.ACCEPTANCE_LETTERS)" label="Template Name">
      <b-form-input type="text"
                    :name="'template-' + uid + '-name'"
                    :id="'template-' + uid + '-name'"
                    placeholder="name"
                    v-model="currentTemplate.name"
                    debounce="500"
                    @keyup="unSave">
      </b-form-input>
    </b-form-group>
    <b-form-group label="Template Content">
<!--      <quill-text-editor-->
<!--        :initial-content="currentTemplate.body"-->
<!--        :ref="'templateEditor-' + uid"-->
<!--        @unSave="unSave"-->
<!--      ></quill-text-editor>-->
      <quill-editor
        ref="myQuillEditor"
        v-model="currentTemplate.body"
        @change="onEditorChange"
      />
    </b-form-group>
    <b-row align-h="between">
      <b-col cols="auto">
        <b-button v-if="!saved" variant="primary" size="sm" @click="updateTemplate">Save</b-button>
        <label v-else class="button-spaced-label">Saved</label>
      </b-col>
      <b-col cols="auto" v-if="currentTemplate.id">
        <b-button variant="danger" size="sm" @click="deleteTemplate">
          <b-icon-trash-fill></b-icon-trash-fill>
          Delete this template
        </b-button>
      </b-col>
      <b-col cols="auto">
        <b-button v-if="currentTemplate.name" @click="$emit('done')" size="sm">
          Done
        </b-button>
        <b-button v-else @click="[showAddTemplate = false, $emit('done')]" size="sm">
          Done
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { emailTemplateService } from '../services/emailTemplate.service'
import { EmailTemplate } from '../models/emailtemplate'
import { PermissionSubject } from '../permission-subject'
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'EmailTemplateDetails',
  components: {
    quillEditor
  },
  props: {
    template: Object
  },
  data: function () {
    return {
      subject: PermissionSubject,
      saved: true,
      editorLoading: true,
      currentTemplate: new EmailTemplate({}),
      editorContent: null,
      uid: null
    }
  },
  mounted () {
    this.initialize()
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    initialize: function () {
      if (this.$props.template) {
        this.currentTemplate = this.$props.template
      }

      this.uid = this._uid
    },

    updateTemplate: async function () {
      if (this.currentTemplate.id) {
        try {
          emailTemplateService.updateTemplate(this.currentTemplate.id, this.currentTemplate)
          this.saved = true
          this.$emit('saved')
        } catch (error) {
          this.$emit('error', error)
          console.log(error)
        }
      } else {
        try {
          emailTemplateService.createTemplate(this.currentTemplate)
          this.saved = true
          this.$emit('saved')
        } catch (error) {
          this.$emit('error', error)
        }
      }
    },

    deleteTemplate: async function () {
      try {
        emailTemplateService.deleteTemplate(this.currentTemplate.id)
        this.$emit('deleted')
      } catch (error) {
        this.$emit('error', error)
      }
    },

    onEditorChange: function () {
      // this.content = html
      this.unSave()
    },
    //
    // getNewContent: function () {
    //   return this.content
    // },
    //
    unSave: function () {
      this.saved = false
    }
  }
}
</script>

<style scoped>

</style>
