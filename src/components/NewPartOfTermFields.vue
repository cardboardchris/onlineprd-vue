<template>
  <b-form>
    <b-row>
      <b-col md="2" offset-md="1">
        <b-form-group label="Name">
          <b-form-input type="text"
                        :key="'part-' + index + '-name'"
                        :name="'part-' + index + '-name'"
                        :id="'part-' + index + '-name'"
                        placeholder="Part of Term"
                        v-model="currentPart.name">
          </b-form-input>
        </b-form-group>
      </b-col>

      <b-col md="2">
        <b-form-group label="Start Date">
          <b-form-input type="text"
                        :key="'part-' + index + '-start-date'"
                        :name="'part-' + index + '-start-date'"
                        :id="'part-' + index + '-start-date'"
                        placeholder="MM/DD/YYYY"
                        v-model="currentPart.start_date">
          </b-form-input>
        </b-form-group>
      </b-col>

      <b-col md="2">
        <b-form-group label="End Date">
          <b-form-input type="text"
                        :key="'part-' + index + '-end-date'"
                        :name="'part-' + index + '-end-date'"
                        :id="'part-' + index + '-end-date'"
                        placeholder="MM/DD/YYYY"
                        v-model="currentPart.end_date">
          </b-form-input>
        </b-form-group>
      </b-col>

      <b-col md="2" class="no-label-col">
        <b-button type="submit" @click.prevent="emitPart" variant="success" :disabled="!partReady">
          Save
        </b-button>
      </b-col>

    </b-row>
  </b-form>
</template>

<script>
export default {
  name: 'NewPartOfTermFields',
  props: {
    part: Object,
    index: Number
  },
  data () {
    return {
      currentPart: {
        name: null,
        start_date: null,
        end_date: null
      }
    }
  },
  computed: {
    partReady () {
      return !!(this.currentPart.name &&
        this.currentPart.start_date &&
        this.currentPart.end_date)
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    /**
     * set the data variables from props
     */
    initialize () {
      this.currentPart = this.$props.part
      console.log(this.currentPart)
    },
    /**
     * sends the new part object to the parent component
     */
    emitPart () {
      this.$emit('savePart', this.currentPart)
    }
  }
}
</script>
