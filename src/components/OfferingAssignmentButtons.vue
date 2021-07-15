<template>
  <b-form-row align-h="end">
    <!-- save/saved -->

    <b-col cols="auto" v-if="!userCanVerify">
      <b-button
        v-if="!saved"
        variant="primary"
        :disabled="!stateChanged"
        @click="$emit('save')"
      >
        Save
      </b-button>
      <label
        v-if="saved && !verified && !inputsDisabled"
        class="button-spaced-label"
      >
        Saved
      </label>
    </b-col>

    <!-- verify/verified -->

    <b-col cols="auto" v-if="complete">
      <span class="disabled-wrapper" :id="'verify-button-disabled-wrapper-' + this.uid">
        <b-button
          v-if="userCanVerify && (!verified || (verified && !saved)) "
          variant="success"
          :disabled="verified && !saved && !stateChanged || !parentVerified"
          @click="$emit('verify')"
        >
          <b-icon-check></b-icon-check>
          <span v-if="type === 'assignment'">Verify</span><span v-else>Loaded</span>
        </b-button>
      </span>
      <b-tooltip v-if="!parentVerified" :target="'verify-button-disabled-wrapper-' + this.uid">
        {{ verifyButtonDisabledTooltip() }}
      </b-tooltip>
      <label
        v-if="(userCanVerify && saved && verified) || (!userCanVerify && verified && saved && stipendVerified)"
        class="button-spaced-label"
      >
        <b-icon-check></b-icon-check>
        Verified
      </label>
      <label
        v-else-if="inputsDisabled && !userCanVerify"
        class="button-spaced-label"
      >
        <b-icon-clock font-scaling="2"></b-icon-clock>
        Pending
      </label>
    </b-col>

    <!-- notified -->

    <b-col cols="auto" v-if="userCanVerify && notified">
      <b-button variant="outline-primary" @click="$emit('showLetter')">
        <b-icon-envelope></b-icon-envelope>
        Letter Sent
      </b-button>
    </b-col>

    <!-- edit -->

    <b-col cols="auto" v-if="(!userCanVerify && verified && stipendVerified) || (userCanVerify && verified)"
    >
      <b-button
        v-if="!edited && saved"
        variant="outline-secondary"
        @click="$emit('unSave')"
      >
        Edit
      </b-button>
      <b-button
        v-else
        variant="secondary"
        @click="$emit('cancel')"
      >
        Cancel
      </b-button>
    </b-col>

    <!-- confirm/pending -->

    <b-col cols="auto" v-if="!userCanVerify && !verified">
        <span class="disabled-wrapper" :id="'confirm-button-disabled-wrapper-' + this.uid">
          <b-button
            type="submit"
            v-if="!confirmed && complete"
            variant="success"
            :disabled="!parentConfirmed || !saved"
          >
            <b-icon-check></b-icon-check>
            Confirm
          </b-button>
        </span>
      <b-tooltip v-if="!parentConfirmed || !saved" :target="'confirm-button-disabled-wrapper-' + this.uid">
        {{ confirmButtonDisabledTooltip() }}
      </b-tooltip>
    </b-col>

    <b-col v-if="!complete">
      <label
        class="button-spaced-label"
      >
        Incomplete
      </label>
    </b-col>
  </b-form-row>
</template>

<script>
import { BIconCheck, BIconEnvelope } from 'bootstrap-vue'

export default {
  name: 'OfferingAssignmentButtons',
  components: { BIconCheck, BIconEnvelope },
  props: {
    userCanVerify: Boolean,
    userCanVerifyStipend: Boolean,
    stipendVerified: Boolean,
    parentConfirmed: Boolean,
    parentVerified: Boolean,
    confirmed: Boolean,
    verified: Boolean,
    edited: Boolean,
    notified: Boolean,
    complete: Boolean,
    saved: Boolean,
    stipendSaved: Boolean,
    stateChanged: Boolean,
    stipendChanged: Boolean,
    inputsDisabled: Boolean,
    updating: Boolean,
    recordObject: Object,
    type: String,
    uid: Number
  },
  methods: {
    confirmButtonDisabledTooltip: function (defaultTitle = null) {
      if (!this.parentConfirmed) {
        return 'You must confirm the section that includes this assignment before confirming this assignment.'
      } else if (!this.saved) {
        return 'You must save this ' + this.type + ' before confirming it.'
      } else {
        return defaultTitle
      }
    },
    verifyButtonDisabledTooltip: function (defaultTitle = null) {
      if (!this.parentVerified) {
        return 'You must verify the section that includes this assignment before verifying this assignment.'
      } else if (!this.saved) {
        return 'You haven\'t made any changes. Change a field or click "Cancel".'
      } else {
        return defaultTitle
      }
    }
  }
}
</script>

<style scoped>

</style>
