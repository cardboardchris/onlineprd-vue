<template>
  <div>
    <SearchTableControls
      :search="search"
      :searchOn="searchOn"
      :searchOptions="searchOptions"
      v-on:update:search="$emit('update:search', $event)"
      v-on:update:searchOn="$emit('update:searchOn', $event)"
    ></SearchTableControls>

    <PaginationTableTopControls
      :currentPage="currentPage"
      :perPage="perPage"
      :totalRows="totalRows"
      v-on:update:currentPage="$emit('update:currentPage', $event)"
      v-on:refresh:table="$emit('refresh:table')"
    ></PaginationTableTopControls>

    <slot></slot>

    <PaginationTableBottomControls
      :currentPage="currentPage"
      :perPage="perPage"
      :pageOptions="pageOptions"
      :totalRows="totalRows"
      v-on:update:currentPage="$emit('update:currentPage', $event)"
      v-on:update:perPage="$emit('update:perPage', $event)"
    ></PaginationTableBottomControls>
  </div>
</template>

<script>

import SearchTableControls from '../SearchTableControls'
import PaginationTableTopControls from './PaginationTableTopControls'
import PaginationTableBottomControls from './PaginationTableBottomControls'
export default {
  name: 'DynamicTableWrapper',
  components: { PaginationTableBottomControls, PaginationTableTopControls, SearchTableControls },
  props: [
    'search',
    'searchOn',
    'searchOptions',
    'currentPage',
    'perPage',
    'pageOptions',
    'totalRows'
  ]
}

</script>

<style scoped>

</style>
