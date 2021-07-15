<template>
  <div>
    <b-row>
      <b-col>
        <div class="records-returned" align="left"><b-button @click="$emit('refresh:table')" variant="outline-primary">Refresh Table</b-button> Records: {{totalRows}}</div>
      </b-col>
      <b-col>
        <b-pagination
          v-model="currentPageLocal"
          :total-rows="totalRows"
          :per-page="perPage"
          align="right"
          aria-controls="results-table"
        ></b-pagination>
      </b-col>
    </b-row>
  </div>
</template>

<script>

export default {
  name: 'PaginationTableTopControls',
  props: ['perPage', 'totalRows', 'currentPage'],
  computed: {
    currentPageLocal: {
      get: function () {
        return this.currentPage
      },
      set: function (value) {
        this.$emit('update:currentPage', value)
      }
    }
  } // computed
}

</script>

<style scoped>

</style>
