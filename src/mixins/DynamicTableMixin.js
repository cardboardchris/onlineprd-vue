export const DynamicTableMixin = {
  data: function () {
    return {
      params: {},
      currentPage: 1,
      totalRows: 0,
      perPage: 10,
      pageOptions: [5, 10, 15, 20, 25],
      sortBy: null,
      sortDesc: false,
      search: null,
      searchOn: [],
      searchOptions: []
    }
  },

  methods: {

    updateParams: function (params) {
      // update sort properties to the correct properties used by the api and delete the original ones
      if (params.hasOwnProperty('sortBy') && params.sortBy !== '') {
        params.sort_by = params.sortBy
        params.sort_direction = params.sortDesc ? 'desc' : 'asc'

        delete params.sortBy
        delete params.sortDesc
      } else {
        delete params.sortDesc
        delete this.params.sort_by
        delete this.params.sort_direction
      }

      // convert pagination properties to skip and take to match api
      if (params.hasOwnProperty('perPage') && params.perPage !== '' && params.hasOwnProperty('currentPage') && params.currentPage !== '') {
        params.take = params.perPage
        params.skip = (params.currentPage - 1) * params.take

        delete params.perPage
        delete params.currentPage
      } else {
        delete this.params.skip
        delete this.params.take
      }

      // change filter param to search param to match api
      if (params.hasOwnProperty('filter') && params.filter !== '' && params.filter !== null) {
        params.search = params.filter
        delete params.filter
      } else {
        delete this.params.search
        delete this.params.searchOn
        delete this.params.search_on
      }

      if (params.hasOwnProperty('search')) {
        params.search_on = this.searchOn.join(',')
      }

      // merge params properties into the this.params
      this.params = Object.assign(this.params, params)

      // remove any properties that have null or empty values
      this.cleanObj(this.params)
    },

    // remove any properties that have null or empty values
    cleanObj: function (obj) {
      for (let propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
          delete obj[propName]
        }
      }
    },

    searchOnOptionsChange: function () {
      this.$nextTick(() => {
        // if search is empty, don't call for table refresh
        if (this.searchOn.length === 0 && this.search !== null) {
          this.search = null
          this.refreshTable()
        } else if (this.search !== null && this.search !== '') {
          this.refreshTable()
        }
      })
    },

    refreshTable: function () {
      this.$nextTick(() => {
        this.$refs.table.refresh()
      })
    }

  } // methods
}
