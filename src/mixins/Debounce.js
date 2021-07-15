// from https://techformist.com/reusable-debounce-function-vue/
export const Debounce = {
  methods: {
    debounce (func, delay = 500) {
      let debounceTimer
      return function () {
        // console.log('debouncing call..')
        const context = this
        const args = arguments
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => func.apply(context, args), delay)
        // console.log('..done')
      }
    }
  }
}
