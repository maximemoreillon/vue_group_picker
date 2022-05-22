<template>
  <div 
    class="group">

    <div 
      :class="{selected}"
      class="group_picker_group_container">

      <!-- button to expand or contract the group -->
      <ChevronRightIcon
        v-if="!empty"
        class="group_picker_expand_button"
        :class="{chevron_open: open}"
        @click="toggle_node()"/>

      <MinusIcon
        class="group_picker_cannot_expand"
        v-else/>

      <div
        class="group_picker_name_container"
        @click="$emit('selection',group)">

        <img
          class="group_picker_avatar"
          v-if="group.avatar_src"
          v-bind:src="group.avatar_src">

        <AccountMultipleIcon
          class="group_picker_avatar"
          v-else />

        <span>
          {{group.name || 'Unnamed group'}}
        </span>

      </div>

      <!-- Link to the group page -->
      <a
        v-if="groupManagerFrontUrl"
        :href="`${groupManagerFrontUrl}/groups/${group_id}`"
        @click.stop>
        <OpenInNewIcon/>
      </a>

    </div>

    <!-- The children groups -->
    <div
      v-if="open"
      class="children_container">

      <template v-if="!loading && !error">

        <group
          v-for="(child, child_index) in groups"
          :key="`${group_id}_child_${child_index}`"
          :groupManagerApiUrl="groupManagerApiUrl"
          :groupsOfUser="groupsOfUser"
          :group="child"
          :selectedGroup="selectedGroup"
          @selection="$emit('selection', $event)"
          />

      </template>

      <Loader
        class="group_picker_loader"
        v-if="loading && !error"/>

      <div
        class="group_picker_error"
        v-if="error">
        {{error}}
      </div>

    </div>

   </div>
</template>

<script>
import axios from 'axios'
import Loader from '@moreillon/vue_loader'

import Group from './Group.vue'

import AccountMultipleIcon from 'vue-material-design-icons/AccountMultiple.vue'
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight.vue'
import MinusIcon from 'vue-material-design-icons/Minus.vue'
import OpenInNewIcon from 'vue-material-design-icons/OpenInNew.vue'


export default {
  name: 'Group',
  components: {
    Loader,
    Group,

    AccountMultipleIcon,
    ChevronRightIcon,
    MinusIcon,
    OpenInNewIcon,

  },
  props: {
    groupManagerApiUrl: {
      type: String,
      default() { return process.env.VUE_APP_GROUP_MANAGER_URL },
    },
    groupManagerFrontUrl: {
      type: String,
      default() { return process.env.VUE_APP_GROUP_MANAGER_FRONT_URL },
    },

    group: Object,
    groupsOfUser: Array,
    selectedGroup: String,
  },
  data(){
    return{
      open: false,
      groups: [],
      loading: false,
      error: null,
      empty: false,

    }
  },
  mounted(){
    this.auto_open()
  },
  methods: {

    auto_open(){
      if(this.groupsOfUser.some( ({_id}) => _id === this.group_id)) this.open_node()
    },

    open_node(){
      this.open = true
      this.loading = true
      const url = `${this.groupManagerApiUrl}/v3/groups/${this.group_id}/groups`
      const params = {direct: true}
      axios.get(url, {params})
      .then( ({data}) => {
        this.groups = data.items
        if(!data.count) this.empty = true
       })
      .catch( () => { this.error = `Error` })
      .finally( () => { this.loading = false })
    },
    close_node(){
      this.open = false;
    },
    toggle_node(){
      if(this.open) this.close_node()
      else this.open_node()
    }
  },
  computed: {
    group_id(){
      return this.group._id
    },
    selected(){
      return this.group_id === this.selectedGroup
    }
  }
}
</script>

<style scoped>

.group {
  /* vertical margin between groups */
  margin: 0.25em 0;
}


.selected {
  background-color: #eeeeee;
}

.group_picker_expand_button:hover {
  color: #c00000;
}

.chevron_open{
  transform: rotate(90deg);
}


.children_container {

  /* compound spacing for border indicating ident */
  padding-left: 0.75em; /* indent for children nodes */
  margin-left: 0.75em; /* indent for children nodes */

  /* Vertical line to show indent */
  border-left: 1px solid #dddddd;
}

/* Links to group page */

a {
  opacity: 0;
  text-decoration: none;
  color: currentColor;
  transition:
    color 0.25s,
    opacity 0.25s;
}

a:hover {
  color: #c00000;
}

.group_picker_group_container:hover a {
  opacity: 1;
}





</style>
