<template>
  <div id="app">
    <GroupPicker
      class="picker"
      v-on:selection="selected($event)"/>
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
    selected({name, _id}){
      alert(`You selected group ${name} (ID ${_id})`)
    }
  }
}
</script>

<style scoped>
.picker{
  height: 500px;
}
</style>
