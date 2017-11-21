<template>
    <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--3-col mdl-cell mdl-cell--1-col-tablet mdl-cell--hide-phone"></div>
        <div class="mdl-cell mdl-cell--6-col mdl-cell--4-col-phone">
            <h1>Home</h1>
            <div>
              <h2>List</h2>
              <hr>
              <div>
                <ul>
                  <li v-for="connection in connections">
                    FROM {{ connection.location_from }} TO {{ connection.location_to }} - DEPARTURE AT {{ connection.departure }} - ARRIVAL AT {{ connection.arrival }}<button type="button" @click="remove(connection)">&times;</button>
                  </li>
                </ul>
              </div>
            </div>
        </div>
    </div>

</template>

<script>
import { uuid } from 'vue-idb'

export default {
  data: function () {
    return {
      connections: []
    }
  },
  mounted: function () {
    this.update()
  },
  // Définissez les méthodes de l'objet
  methods: {
    update () {
      this.$db.connections.toArray().then(connections => (this.connections = connections))
    },
    add (connectionData) {
      this.$db.connections.add({
        id: uuid(),
        location_from: connectionData[1],
        location_to: connectionData[3],
        departure: connectionData[2],
        arrival: connectionData[4],
        created_at: new Date(),
        updated_at: new Date()
      }).then(() => this.update())
    },
    remove (connection) {
      this.$db.connections.where('id').equals(connection.id).delete().then(() => this.update())
    }
  }
}

</script>

<style scoped>

</style>
