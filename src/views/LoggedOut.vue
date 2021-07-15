<template>
  <div>
    <h1 class="text-center">You have successfully logged out.</h1>
    <LoginButton></LoginButton>
  </div>
</template>

<script>

import LoginButton from '../components/LoginButton'

export default {
  name: 'LoggedOut',
  components: { LoginButton }
}

</script>

<style scoped>

</style>
