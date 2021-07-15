<template>
  <div class="loading-wrapper">
    <b-button variant="primary" disabled>
      <b-spinner small type="grow"></b-spinner>
      Loading...
    </b-button>
  </div>
</template>

<script>

export default {
  name: 'LoadingPlaceholder'
}

</script>

<style>
  .loading-wrapper {
    margin: 0 auto;
    text-align: center;
  }
</style>
