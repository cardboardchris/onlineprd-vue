<template>
  <div>
    <b-row>
      <b-col lg="6">
        <b-form-group
          label="Search"
          label-cols-sm="2"
          label-align-sm="left"
          label-size="sm"
          label-for="searchInput"
        >
          <b-input-group size="sm">
            <b-form-input
              v-model="searchLocal"
              type="search"
              id="searchInput"
              placeholder="Type to Search"
              :disabled="disableSearch"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!search" @click="clearSearch">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col lg="6">
        <b-form-group
          label="Search On"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          description="">
          <b-form-checkbox-group
            v-model="searchOnLocal"
            :options="searchOptions"
          >
          </b-form-checkbox-group>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>

import { debounce } from 'lodash'

export default {
  name: 'SearchTableControls',
  props: ['search', 'searchOn', 'searchOptions'],
  methods: {
    clearSearch: function () {
      this.searchLocal = ''
    }
  },
  computed: {
    disableSearch: function () {
      return this.searchOn.length === 0
    },

    searchLocal: {
      get: function () {
        return this.search
      },
      set: _.debounce(function (value) {
        this.$emit('update:search', value)
      }, 500)
    },

    searchOnLocal: {
      get: function () {
        return this.searchOn
      },
      set: function (value) {
        this.$emit('update:searchOn', value)
      }
    }

  } // computed
}

</script>

<style scoped>

</style>
