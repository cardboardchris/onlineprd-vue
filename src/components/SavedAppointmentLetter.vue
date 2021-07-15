<template>
  <div>
    <loading-placeholder v-if="loading"></loading-placeholder>
    <div v-else>
      <div v-if="sentLetters.length > 1">
        <b-row v-for="(letter, index) in sentLetters" :key="index">
          <b-col>
            <b-button @click="setActiveLetter(letter.id)">View letter sent on
              {{ new Date(letter.created_at).toDateString() }}
            </b-button>
          </b-col>
        </b-row>
      </div>
      <b-row>
        <b-col>
          <div v-html="activeLetter.body"></div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { sentLetterService } from '@/services/savedLetter.service'
import { DateTimeMixin } from '@/mixins/DateTimeMixin'
import LoadingPlaceholder from '@/components/LoadingPlaceholder'

export default {
  name: 'SavedAppointmentLetter',
  components: { LoadingPlaceholder },
  mixins: [DateTimeMixin],
  props: {
    userId: Number,
    termId: Number,
    assignmentId: Number
  },
  data () {
    return {
      loading: true,
      params: {
        assignment_id: this.assignmentId
      },
      sentLetters: [],
      activeLetter: {}
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize: async function () {
      try {
        const response = await sentLetterService.getLettersByAssignment(this.params)
        this.sentLetters = response.data
        if (this.sentLetters.length === 1) {
          this.setActiveLetter(this.sentLetters[0].id)
        }
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }

      this.loading = false
    },

    setActiveLetter: function (letterId) {
      this.activeLetter = this.sentLetters.find((letter) => {
        return letter.id === letterId
      })
    }
  }
}
</script>
