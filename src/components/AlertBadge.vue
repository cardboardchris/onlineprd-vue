<template>
  <span v-if="showBadge">
    <b-badge :variant="variant" :id="'tooltip-'+id">{{count}} <span class="sr-only">{{message}}</span></b-badge>
            <b-tooltip :target="'tooltip-'+id" triggers="hover">
              {{count}} {{message}}
            </b-tooltip>
  </span>
</template>

<script>

export default {
  name: 'AlertBadge',
  props: {
    count: {
      type: Number,
      default: 0
    },
    message: {
      type: String,
      default: 'item(s) need attention'
    },
    variant: {
      type: String,
      default: 'danger'
    }
  },
  data () {
    return {
      id: null
    }
  },
  mounted: function () {
    this.id = this._uid
  },
  computed: {
    showBadge: function () {
      return this.count !== 0
    }
  }
}
</script>

<style scoped>

</style>
