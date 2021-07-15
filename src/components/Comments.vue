<template>
  <div>
    <b-row v-if="showComments">
      <b-col v-if="currentComments && currentComments.length > 0">
        <b-card v-for="comment in currentComments" :key="comment.id">
          {{ comment.body }}
          <template v-slot:footer>
            <em>Left by {{ comment.user.first_name }} {{ comment.user.last_name }} at {{ formatAMPM(new
              Date(comment.created_at)) }} on {{ new Date(comment.created_at).toDateString() }}</em>
          </template>
        </b-card>
      </b-col>
      <b-col v-else>
        <b-card>
          No comments yet.
        </b-card>
      </b-col>
    </b-row>

    <!-- comments -->

    <b-form-row>
      <b-col cols="auto">
        <b-button variant="outline-info"
                  @click="showNewCommentModal = true"
        >
          <b-icon-chat-square></b-icon-chat-square>
          Add Comment
        </b-button>
      </b-col>

      <b-col v-if="currentComments && currentComments.length > 0" cols="auto">
        <b-button variant="outline-info"
                  @click="toggleComments"
        >
          <span v-if="!showComments">Show</span><span v-else>Hide</span> Comments
        </b-button>
      </b-col>
    </b-form-row>

    <b-modal
      :id="'add-comment-modal-' + uid"
      size="l"
      v-model="showNewCommentModal"
      title="Add Comment"
      :ok-only="true"
      ok-title="Close"
    >
      <b-textarea
        :id="'new-comment-' + uid"
        v-model="newComment"
      ></b-textarea>
      <b-button
        v-if="newComment"
        variant="outline-info"
        @click="saveComment"
      >
        Save
      </b-button>
      <b-button
        v-else
        variant="outline-info"
        @click="modalCommentsShow = false"
      >
        Cancel
      </b-button>
    </b-modal>
  </div>
</template>

<script>
import { DateTimeMixin } from '../mixins/DateTimeMixin'
import { commentService } from '../services/comment.service'

export default {
  name: 'Comments',
  mixins: [DateTimeMixin],
  props: {
    uid: Number,
    parentId: Number,
    parentType: String,
    userId: Number,
    comments: Array
  },
  data () {
    return {
      newComment: null,
      showNewCommentModal: false,
      showComments: false,
      currentComments: []
    }
  },
  created () {
    this.initialize()
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    }
  },
  methods: {
    initialize: function () {
      if (this.$props.comments) {
        this.currentComments = _.cloneDeep(this.comments)
      }
    },
    addComment: function (commentObject) {
      commentObject.user = this.currentUser
      commentObject.user.first_name = this.currentUser.firstName
      commentObject.user.last_name = this.currentUser.lastName
      this.currentComments.push(commentObject)
      this.showNewCommentModal = false
    },

    saveComment: async function () {
      // console.log(this.newComment)
      let data = {
        body: this.newComment,
        commentable_id: this.$props.parentId,
        commentable_type: 'App\\Models\\' + _.upperFirst(this.$props.parentType),
        user_id: this.$props.userId
      }
      let response = await commentService.createNewComment(data)
      let savedCommentObject = response.data.comment
      this.addComment(savedCommentObject)
      this.newComment = null
    },

    toggleComments: function () {
      this.showComments = !this.showComments
    }
  }
}
</script>

<style scoped>

</style>
