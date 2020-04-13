<template>
  <div class="group">

    <div class="current_node_container">

      <!-- button to expand or contract the node -->
      <font-awesome-icon
        icon="chevron-right"
        class="expand_button"
        v-bind:class="{chevron_open: open}"
        v-on:click="toggle_node()"/>

      <div
        class="node_name_container"
        v-on:click="$emit('selection',group)">

        <img
        class="avatar"
        v-if="group.properties.avatar_src"
        v-bind:src="group.properties.avatar_src">

        <font-awesome-icon
        icon="users"
        v-else/>

        {{group.properties.name}}
      </div>

    </div>

    <!-- The children nodes -->
    <div
      v-if="open"
      class="children_container">

      <template v-if="!loading && !error">

        <template v-if="groups.length>0">
          <group
            v-for="child in groups"
            v-bind:key="child.identity.low"
            v-bind:apiUrl="apiUrl"
            v-on:selection="$emit('selection',$event)"
            v-bind:group="child"
            v-bind:groupsOfUser="groupsOfUser"/>
          </template>

        <!-- Indicator of no groups -->
        <div class="" v-else>
          -
        </div>

      </template>

      <Loader v-if="loading && !error"/>

      <div class="" v-if="error">
        {{error}}
      </div>

    </div>

   </div>
</template>

<script>
import axios from 'axios'
import Loader from '@moreillon/vue_loader'

import Group from './Group.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUsers,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faUsers,
  faChevronRight
)
export default {
  name: 'Group',
  components: {
    Loader,
    Group,

    FontAwesomeIcon,

  },
  props: {
    apiUrl: String,
    group: Object,
    groupsOfUser: Array,
  },
  data(){
    return{
      open: false,
      groups: [],
      loading: false,
      error: null,

    }
  },
  mounted(){

    // Auto opening of user's units
    this.auto_open()
  },
  methods: {
    auto_open(){
      //console.log(this.groupsOfUser)
      let matching_group = this.groupsOfUser.find(group => {
        return group.identity.low === this.group.identity.low
      })
      if(matching_group) this.open_node()
    },

    open_node(){
      this.open = true
      this.loading = true
      axios.get(`${this.apiUrl}/groups_directly_belonging_to_group`, {
        params: {id: this.group.identity.low}
      })
      .then(response => {
        this.groups.splice(0,this.groups.length)
        response.data.forEach((record) => {
          let group = record._fields[record._fieldLookup['group']]
          this.groups.push(group)
        })
      })
      .catch( () => {
        this.error = `Error`
      })
      .finally( () => { this.loading = false })
    },
    close_node(){
      this.open = false;
    },
    toggle_node(){
      if(this.open) this.close_node();
      else this.open_node();
    }
  },
  computed: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


.current_node_container {
  display: flex;
  align-items: center;

}

.current_node_container > * {
  cursor: pointer;
}


.expand_button{
  /* center button in div */

  margin-right: 10px; /* space between button and name */

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

.node_name_container {
  flex-grow: 1;
  transition: color 0.25s;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.node_name_container:hover{
  color: #c00000;
}

.children_container{

  /* content of this is a CorporateStructureNode */

  /* compound spacing for border indicating ident */
  padding-left: 9px; /* indent for children nodes */
  margin-left: 9px; /* indent for children nodes */
  border-left: 1px solid #dddddd;
}





</style>
