import { forOwn, concat } from 'lodash'

export const EventHandlerMixin = {
  data: function () {
    return {}
  },

  methods: {
    displaySuccess: function (message = 'Saved successfully') {
      this.$bvToast.toast(message,
        {
          variant: 'success',
          toaster: 'b-toaster-top-right'
        }
      )
    },

    displayError: function (message = 'Something bad happened.') {
      this.$bvToast.toast(message,
        {
          variant: 'danger',
          autoHideDelay: 10000,
          toaster: 'b-toaster-top-right'
        }
      )
    },

    displayErrors: function (error) {
      let errorMessages = []
      if (error.hasOwnProperty('response') && error.response.hasOwnProperty('data') && error.response.data.hasOwnProperty('error')) {
        _.forOwn(error.response.data.error, function (value, key) {
          // add error messages to array
          errorMessages = _.concat(value)
        })

        // display each error message
        errorMessages.map((message) => {
          this.$bvToast.toast(message,
            {
              variant: 'danger',
              autoHideDelay: 10000,
              toaster: 'b-toaster-top-right'
            }
          )
        })
        // a proper error message was not sent back from the server, so just do an output of whatever is received
      } else {
        if (process.env.VUE_APP_DEBUG) {
          console.log(error)
        }
        this.$bvToast.toast('A server error has occurred.',
          {
            variant: 'danger',
            autoHideDelay: 10000,
            toaster: 'b-toaster-top-right'
          }
        )
      }
    }
  }
}
