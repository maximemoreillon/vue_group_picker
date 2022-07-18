# Group picker

[![npm version](https://badge.fury.io/js/@moreillon%2Fvue_group_picker.svg)](https://badge.fury.io/js/@moreillon%2Fvue_group_picker)

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
import GroupPicker from '@moreillon/vue_group_picker'

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

