<template>
  <b-form-invalid-feedback :id="id">
    <span v-for="(error, index) in errors" v-bind:key="index">
                {{ error }}<br>
    </span>
  </b-form-invalid-feedback>
</template>

<script>

export default {
  name: 'FormErrors',
  props: ['errors', 'id']
}

</script>

<style scoped>

</style>
