<template>
  <div class="group">

    <div class="current_node_container">

      <!-- button to expand or contract the node -->
      <chevron-right-icon
        class="expand_button"
        v-bind:class="{chevron_open: open}"
        v-on:click="toggle_node()"/>


      <span
        class="node_name_container"
        v-on:click="$emit('selection',group)">
        {{group.properties.original_name}}
      </span>

    </div>

    <!-- The children nodes -->
    <div
      v-if="open"
      class="children_container">

      <template v-if="!loading">

        <template v-if="groups.length>0">
          <group
            v-for="child in groups"
            v-bind:key="child.identity.low"
            v-bind:apiUrl="apiUrl"
            v-on:selection="$emit('selection',$event)"
            v-bind:group="child"/>
          </template>

        <!-- Indicator of no groups -->
        <div class="" v-else>
          -
        </div>

      </template>

      <Loader v-else/>

    </div>

   </div>
</template>

<script>
import axios from 'axios'
import Loader from '@moreillon/vue_loader'

import Group from './Group.vue'
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight.vue';

export default {
  name: 'Group',
  components: {
    Loader,
    Group,
    ChevronRightIcon,

  },
  props: {
    apiUrl: String,
    group: Object,
  },
  data(){
    return{
      open: false,
      groups: [],
      loading: false,

    }
  },
  mounted(){

    // Auto opening of user's units


  },
  methods: {

    open_node(){
      this.open = true
      this.loading = true
      axios.post(`${this.apiUrl}/get_groups_directly_belonging_to_group`, {
        node_id: this.group.identity.low
      })
      .then(response => {
        this.groups.splice(0,this.groups.length)
        response.data.forEach((record) => {
          let group = record._fields[record._fieldLookup['group']]
          this.groups.push(group)
        })
      })
      .catch( (error) => {
        console.log(error)
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
  margin: 1px;
}

.current_node_container > * {
  cursor: pointer;
}


.expand_button{
  /* center button in div */

  margin-right: 10px; /* space between button and name */

  width: 18px;
  height: 18px;

  font-size: 140%;

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
