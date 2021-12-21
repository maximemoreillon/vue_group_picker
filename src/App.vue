<template>
  <div id="app">
    <GroupPicker
      class="picker"
      v-on:selection="selected($event)"
      usersWithNoGroup/>
  </div>
</template>

<script>
import GroupPicker from './GroupPicker.vue'

export default {
  name: 'App',
  components: {
    GroupPicker
  },
  methods: {
    selected({ _id}){
      alert(`You selected group ${_id}`)
    }
  }
}
</script>

<style scoped>
.picker{
  height: 500px;
}
</style>
