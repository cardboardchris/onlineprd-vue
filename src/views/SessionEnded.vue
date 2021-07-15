<template>
  <div>
    <h1 class="text-center">Your session has expired.  Please login again.</h1>
    <LoginButton></LoginButton>
  </div>
</template>

<script>

import LoginButton from '../components/LoginButton'

export default {
  name: 'SessionEnded',
  components: { LoginButton }
}

</script>

<style scoped>

</style>
