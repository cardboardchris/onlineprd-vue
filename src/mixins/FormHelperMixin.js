import { cloneDeep, size } from 'lodash'

export const FormHelperMixin = {
  data: function () {
    return {
      loading: true,
      saving: false,
      wait: false,
      uid: null,
      currentState: null
    }
  },

  mounted: function () {
    this.uid = this._uid // set unique id, property native to vue
  },

  methods: {
    toggleLoading: function () {
      this.loading = !this.loading
    },

    toggleSaving: function () {
      this.saving = !this.saving
    },

    toggleWait: function () {
      this.wait = !this.wait
    },

    createUniqueId: function (name) {
      return name + '_' + this.uid
    },

    saveCurrentState: function (stateObj) {
      this.currentState = _.cloneDeep(stateObj)
    },

    formatOptionsForLookupFields: function (responseArr, selectText = '- select -', noSelect = false) {
      let options = responseArr.map((field) => {
        return { value: field.id, text: field.name, disabled: field.active !== 1 }
      })

      if (!noSelect) {
        options.unshift({ value: null, text: selectText, selected: true })
      }

      return options
    },

    getValidationState: function ({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null
    },

    // https://gist.github.com/Yimiprod/7ee176597fef230d1451
    returnChangedParams: function (object, base = this.currentState) {
      function changes (object, base) {
        return _.transform(object, function (result, value, key) {
          if (!_.isEqual(value, base[key])) {
            result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value
          }
        })
      }
      return changes(object, base)
    },

    didStateChange: function (newState) {
      return _.size(this.returnChangedParams(newState)) > 0
    }
  }
}
