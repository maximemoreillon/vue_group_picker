<template>
  <div id="app">
    <GroupPicker
      class="picker"
      :selectedGroupId="selectedGroupId"
      @selection="selected($event)"
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
  data(){
    return {
      selectedGroupId: null,
    }
  },
  methods: {
    selected({ _id}){
      alert(`You selected group ${_id}`)
      this.selectedGroupId = _id
    }
  }
}
</script>

<style scoped>
.picker{
  height: 500px;
}
</style>
