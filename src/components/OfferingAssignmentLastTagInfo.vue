<template>
  <div>
    <div v-if="loading">Loading details . . .</div>
    <div v-else-if="tagDate">
      <p>{{ tagAction }} at {{ formatAMPM(tagDate) }} on {{ tagDate.toDateString() }}</p>
    </div>
  </div>
</template>

<script>
import { DateTimeMixin } from '../mixins/DateTimeMixin'

export default {
  name: 'OfferingAssignmentLastTagInfo',
  props: {
    parentObject: Object
  },
  mixins: [DateTimeMixin],
  data () {
    return {
      // taggingUser: {},
      tagDate: null,
      tagNames: [
        'confirmed',
        'verified',
        'stipend_verified',
        'edited',
        'approved',
        'notified',
        'superseded',
        'accepted',
        'prorate_accepted'
      ],
      loading: true
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    initialize: function () {
      // console.log(this.parentObject)
      this.getTagDetails()
    },

    latestTag: function () {
      let objectTags = []
      _.forEach(this.tagNames, (tagName) => {
        if (this.parentObject[tagName] !== undefined && this.parentObject[tagName] !== null) {
          objectTags.push({ name: tagName, date: this.parentObject[tagName] })
        }
      })
      return objectTags.sort(this.dateSortDesc)[0]
    },

    dateSortDesc: function (a, b) {
      if (new Date(a.date) > new Date(b.date)) return -1
      if (new Date(a.date) < new Date(b.date)) return 1
      return 0
    },

    getTagDetails: function () {
      let latestTag = this.latestTag()
      // console.log(latestTag)
      if (latestTag) {
        this.tagDate = new Date(latestTag.date)
        this.tagAction = _.capitalize(latestTag.name.replace('_', ' '))
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
