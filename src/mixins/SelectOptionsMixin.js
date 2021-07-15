export const SelectOptions = {
  methods: {
    /**
     * sends an object of options for filtering if the property to filter on is in the form_fields sub-object
     * @param {string} propertyName
     * @param {string/number} propertyValue
     * @param {object} optionsObject
     * @param {boolean} isInFormFields
     */
    getOptions: function (propertyName, propertyValue, optionsObject, isInFormFields = true) {
      if (isInFormFields) {
        return this.formatOptions(propertyValue, this.filterFormFields(propertyName, propertyValue, optionsObject))
      } else {
        return this.formatOptions(propertyValue, optionsObject)
      }
    },
    /**
     * get options for a specific property from the object with all options
     * @param {string} propertyName
     * @param {string/number} propertyValue
     * @param {object} optionsObject
     */
    filterFormFields: function (propertyName, propertyValue, optionsObject) {
      return optionsObject.filter(function (obj) {
        return obj[propertyName] === propertyValue
      })
    },
    /**
     * formats select options as { value: 'value', text: 'text' } objects
     * @param {string} propertyName
     * @param {object} unformattedOptions
     */
    formatOptions: function (propertyName, unformattedOptions, selectTextForNull = '-select-') {
      let options = []

      // if selectTextForNull is null, no select text is needed for options
      if (selectTextForNull != null) {
        options.push({ value: null, text: selectTextForNull })
      }

      for (let i = 0; i < unformattedOptions.length; i++) {
        options.push(
          {
            value: unformattedOptions[i].id,
            text: this.formatOptionText(propertyName, unformattedOptions[i]),
            // if the active property is not present, assume option is enabled. and if present, check active state
            disabled: unformattedOptions[i].hasOwnProperty('active') && unformattedOptions[i].active !== 1
          }
        )
      }
      return options
    },
    /**
     * formats select option text depending on field
     * @param {string} propertyName
     * @param {object} optionObject
     */
    formatOptionText: function (propertyName, optionObject) {
      if (propertyName === 'partOfTerm') {
        return optionObject.name + ' (' + new Date(optionObject.start_date).toLocaleDateString() + ' - ' + new Date(optionObject.end_date).toLocaleDateString() + ')'
      } else if (propertyName === 'subject') {
        return optionObject.abbreviation
      } else if (propertyName === 'campus') {
        return optionObject.abbreviation + ' - ' + optionObject.name
      } else if (propertyName === 'eclass') {
        return optionObject.abbreviation + ' - ' + optionObject.description
      } else if (propertyName === 'position' || propertyName === 'college') {
        return this.decodeEntities(optionObject.name)
      } else if (propertyName === 'prefix' ||
        propertyName === 'department' ||
        propertyName === 'role' ||
        propertyName === 'course_type' ||
        propertyName === 'meeting_start_end_times') {
        return optionObject.name
      } else {
        console.log('warning: there is no format for select options with propertyName: "' + propertyName)
      }
    },
    /**
     * gets the text of a formatted select option from its option_id
     */
    getTextValueFromOptions: function (id, formOptionsObject) {
      if (id) {
        return formOptionsObject.find(function (obj) {
          return obj.value === id
        }).text
      } else {
        return false
      }
    },
    /**
     * translate true/false boolean into yes/no string
     */
    getYesNoString: function (value) {
      if (value) {
        return 'yes'
      } else if (typeof (value) !== 'undefined') {
        return 'no'
      } else {
        return ''
      }
    },
    /**
     * decodes html entities
     */
    decodeEntities: function (encodedString) {
      let translateRe = /&(nbsp|amp|quot|lt|gt);/g
      let translate = {
        'nbsp': ' ',
        'amp': '&',
        'quot': '"',
        'lt': '<',
        'gt': '>'
      }
      return encodedString.replace(translateRe, function (match, entity) {
        return translate[entity]
      }).replace(/&#(\d+);/gi, function (match, numStr) {
        let num = parseInt(numStr, 10)
        return String.fromCharCode(num)
      })
    }
  }
}
