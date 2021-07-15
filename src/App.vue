<template>
  <div>
    <navbar></navbar>
    <main class='container'>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>

import navbar from './components/Navbar'

export default {
  name: 'App',
  components: { navbar }
}
</script>

<style scoped>

</style>
