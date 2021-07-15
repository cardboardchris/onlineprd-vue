<template>
  <b-form-row align-h="end">
    <!-- stipend verified label -->
    <b-col v-if="userCanVerify && stipendSaved && stipendVerified && !updating">
      <label
        class="button-spaced-label"
      >
        <b-icon-check></b-icon-check>
        Stipend Verified
      </label>
    </b-col>

    <!-- verify stipend -->

    <b-col cols="auto" v-if="userCanVerifyStipend">
      <span class="disabled-wrapper" :id="'verify-stipend-button-disabled-wrapper-' + this.uid">
        <b-button
          v-if="(!stipendSaved || (stipendSaved && !stipendVerified))"
          variant="success"
          :disabled="(!stipendChanged && !stipendSaved) || !parentVerified"
          @click="$emit('verifyStipend')"
        >
          Verify Stipend
        </b-button>
      </span>
      <b-tooltip v-if="(!stipendChanged && !stipendSaved) || !parentVerified" :target="'verify-stipend-button-disabled-wrapper-' + this.uid">
        {{ verifyButtonDisabledTooltip() }}
      </b-tooltip>
    </b-col>

    <!-- edit stipend -->

    <b-col cols="auto" v-if="userCanVerifyStipend && stipendVerified">
      <b-button
        v-if="!edited && stipendSaved"
        variant="outline-secondary"
        @click="$emit('unSaveStipend')"
      >
        Edit Stipend
      </b-button>

      <b-button
        v-else
        variant="secondary"
        @click="$emit('cancelStipend')"
      >
        Cancel
      </b-button>
    </b-col>
  </b-form-row>
</template>

<script>

export default {
  name: 'StipendButtons',
  props: {
    userCanVerify: Boolean,
    userCanVerifyStipend: Boolean,
    edited: Boolean,
    verified: Boolean,
    parentVerified: Boolean,
    stipendVerified: Boolean,
    stipendSaved: Boolean,
    stateChanged: Boolean,
    stipendChanged: Boolean,
    inputsDisabled: Boolean,
    updating: Boolean,
    recordObject: Object,
    uid: Number
  },
  methods: {
    verifyButtonDisabledTooltip: function (defaultTitle = null) {
      if (!this.parentVerified) {
        return 'You must confirm the section that includes this assignment before confirming this stipend.'
      } else if (!this.stipendChanged) {
        return 'You haven\'t made any changes. Change the stipend value or click "Cancel".'
      } else {
        return defaultTitle
      }
    }
  }
}
</script>

<style scoped>

</style>
