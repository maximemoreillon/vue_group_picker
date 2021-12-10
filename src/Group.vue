<template>
  <div class="group">

    <div class="current_group_container">

      <!-- button to expand or contract the node -->
      <font-awesome-icon
        icon="chevron-right"
        v-if="!empty"
        class="expand_button"
        v-bind:class="{chevron_open: open}"
        v-on:click="toggle_node()"/>

      <font-awesome-icon
        icon="minus"
        v-else/>


      <div
        class="group_name_container"
        v-on:click="$emit('selection',group)">

        <img
          class="avatar"
          v-if="group.properties.avatar_src"
          v-bind:src="group.properties.avatar_src">

        <font-awesome-icon
          icon="users"
          v-else/>

        <span>
          {{group.properties.name || 'Unnamed group'}}
        </span>

      </div>

      <!-- Link to the group page -->
      <a
        v-if="groupManagerFrontUrl"
        :href="`${groupManagerFrontUrl}/groups/${group_id}`"
        v-on:click.stop>
        <font-awesome-icon
          icon="external-link-alt"/>
      </a>

    </div>

    <!-- The children nodes -->
    <div
      v-if="open"
      class="children_container">

      <template v-if="!loading && !error">

        <group
          v-for="(child, child_index) in groups"
          v-bind:key="`${group_id}_child_${child_index}`"
          v-bind:groupManagerApiUrl="groupManagerApiUrl"
          v-on:selection="$emit('selection', $event)"
          v-bind:group="child"
          v-bind:groupsOfUser="groupsOfUser"/>

      </template>

      <Loader v-if="loading && !error"/>

      <div class="error_message" v-if="error">
        {{error}}
      </div>

    </div>

   </div>
</template>

<script>
import axios from 'axios'
//import VueCookies from 'vue-cookies'
import Loader from '@moreillon/vue_loader'

import Group from './Group.vue'


import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUsers,
  faChevronRight,
  faMinus,
  faInfoCircle,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faUsers,
  faChevronRight,
  faInfoCircle,
  faMinus,
  faExternalLinkAlt,
)
export default {
  name: 'Group',
  components: {
    Loader,
    Group,

    FontAwesomeIcon,

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

    // Auto opening of user's units
    this.auto_open()
  },
  methods: {
    auto_open(){
      // Dirty but needs to account usage of new UUID
      const matching_group = this.groupsOfUser.find(group_of_user => {

        const group_id = group_of_user._id
          || group_of_user.properties._id
          || group_of_user.identity // delete when done

        return group_id === this.group_id
      })
      if(matching_group) this.open_node()
    },

    open_node(){
      this.open = true
      this.loading = true
      const url = `${this.groupManagerApiUrl}/v2/groups/${this.group_id}/groups`
      const params = {direct: true}
      axios.get(url, {params})
      .then( ({data}) => {
        this.groups = data
        if(!this.groups.length) this.empty = true
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
        || this.group.properties._id
        || this.group.identity // delete when done
    }
  }
}
</script>

<style scoped>

.group {
  /* vertical margin between groups */
  margin: 0.25em 0;
}

.current_group_container {
  display: flex;
  align-items: center;
  transition: background-color 0.25s;
}

.current_group_container:hover {
  background-color: #eeeeee;
}

.current_group_container > * {
  cursor: pointer;
}


.expand_button{
  /* center button in div */


  /* make container square for proper rotation */
  width: 1em;
  height: 1em;


  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;


  transition:
    transform 0.25s,
    color 0.25s;
}

.expand_button:hover {
  color: #c00000;
}

.chevron_open{
  transform: rotate(90deg);
}

.group_name_container {
  margin-left: 0.5em;
  flex-grow: 1;
  transition: color 0.25s;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.group_name_container > *:not(:last-child) {
  margin-right: 0.5em;
}

.children_container{

  /* content of this is a CorporateStructureNode */

  /* compound spacing for border indicating ident */
  padding-left: 0.5em; /* indent for children nodes */
  margin-left: 0.5em; /* indent for children nodes */
  border-left: 1px solid #dddddd;
}

a {
  text-decoration: none;
  color: currentColor;
  transition: color 0.25s;
}

a:hover {
  color: #c00000;
}

.avatar {
  height: 1em;
  width: 1em;
  object-fit: contain;
}


</style>
