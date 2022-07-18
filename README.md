# Group picker

A Vue.js component to select a group from those managed by the [group management microservice](https://github.com/maximemoreillon/group_manager)

## Usage

```
<template>
  <div id="app">
    <GroupPicker
      @selection="selected($event)"
      groupManagerApiUrl="http://api.groups.example.com"/>
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
```

