export const DateTimeMixin = {
  methods: {
    formatAMPM: function (date) {
      let hours = date.getHours()
      let minutes = date.getMinutes()
      let ampm = hours >= 12 ? 'pm' : 'am'
      hours = hours % 12
      if (!hours) {
        hours = 12
      } // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes
      return hours + ':' + minutes + ' ' + ampm
    }
  }
}
