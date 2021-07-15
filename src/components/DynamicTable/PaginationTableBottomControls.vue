<template>
  <div>
    <b-row>
      <b-col>
        <b-form-group
          label="Per page"
          label-cols-sm="3"
          align="left"
          label-size="sm"
          label-for="perPageSelect"
        >
          <b-form-select
            v-model="perPageLocal"
            id="perPageSelect"
            size="sm"
            :options="pageOptions"
            align="left"
          ></b-form-select>
        </b-form-group>
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
  name: 'PaginationTableBottomControls',
  props: ['perPage', 'pageOptions', 'totalRows', 'currentPage'],
  computed: {
    perPageLocal: {
      get: function () {
        return this.perPage
      },
      set: function (value) {
        this.$emit('update:perPage', value)
      }
    },

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
