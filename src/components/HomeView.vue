<template>
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--3-col mdl-cell--1-col-tablet mdl-cell--hide-phone"></div>
      <div class="mdl-cell mdl-cell--6-col mdl-cell--4-col-phone">

        <div class="mdl-cell mdl-cell--12-col">
            <h1>Home</h1>
        </div>

        <div class="mdl-cell mdl-cell--12-col">

          <div class="space"></div>
          <div class="mdl-card main-card">
            <!-- <div class="mdl-card__title">
              <h2 class="mdl-card__title-text">Your favourite routes</h2>
            </div> -->
            <div class="mdl-card__supporting-text">

              <div v-for="(arrival_list, departure_location) in connectionsSorted">
                <div v-for="(connection_list, arrival_location) in arrival_list"  class="mdl-list">

                  <div class="mdl-list__item title-accordion mdl-button mdl-js-button">
                    <span><b>DE </b> {{ departure_location }} <b> A </b> {{ arrival_location }}</span>
                  </div>
                  <div v-for="connection in connection_list" >
                    <div v-bind:id="connection.id" class="mdl-list__item mdl-button mdl-js-button  mdl-js-ripple-effect accordion">
                      {{ connection.departure}} - {{ connection.arrival }}<i class="material-icons mdl-accordion__icon">expand_more</i>
                    </div>
                    <div class="panel">
                      <button type="button" @click="remove(connection)" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect">
                        <i class="material-icons">delete</i>
                      </button>
                      <ul class="mdl-list">
                        <li v-for="value in connection" class="mdl-list__item"><span class="mdl-list__item-primary-content">{{value}}</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="connection_results" class="table-responsive">
            <table  class="mdl-data-table mdl-js-data-table mdl-shadow--2dp mdl-cell mdl-cell--12-col">
                <thead>
                    <tr>
                        <th class="mdl-data-table__cell--non-numeric">From</th>
                        <th class="mdl-data-table__cell--non-numeric">Departure</th>
                        <th class="mdl-data-table__cell--non-numeric">To</th>
                        <th class="mdl-data-table__cell--non-numeric">Arrival</th>
                        <th class="mdl-data-table__cell--non-numeric"></th>
                    </tr>
                </thead>
                <tbody>
                  <tr v-for="connection in connections">
                    <td class="mdl-data-table__cell--non-numeric">{{ connection.location_from }}</td>
                    <td class="mdl-data-table__cell--non-numeric">{{ connection.departure }}</td>
                    <td class="mdl-data-table__cell--non-numeric">{{ connection.location_to }}</td>
                    <td class="mdl-data-table__cell--non-numeric">{{ connection.arrival }}</td>
                    <td class="mdl-data-table__cell--non-numeric"><button type="button" @click="remove(connection)">&times;</button></td>
                  </tr>
                </tbody>
            </table>
        </div>

        <h1>Sorted</h1>
        <pre v-if="connectionsSorted" :style="preStyle">
            <b>Selected Data:</b>
            {{ connectionsSorted }}
        </pre>

        <h1>Raw</h1>
        <pre v-if="connections" :style="preStyle">
            <b>Selected Data:</b>
            {{ connections }}
        </pre>


      </div>
    </div>
</template>

<script>
import { uuid } from 'vue-idb'

$(document.body).on('click', '.accordion', function () {
  $(this).toggleClass('active')
  $(this).next().toggleClass('show')
})

export default {
  data: function () {
    return {
      connections: [],
      connectionsSorted: {},
      preStyle: {
        background: '#f2f2f2',
        fontFamily: 'monospace',
        fontSize: '1em',
        display: 'inline-block',
        padding: '15px 7px',
        width: '100%'
      }
    }
  },
  mounted: function () {
    this.update()
  },
  // Définissez les méthodes de l'objet
  methods: {
    update () {
      var self = this
      this.$db.connections.orderBy('location_from').toArray().then(function (tab) {
        self.connectionsSorted = {}
        self.connections = tab
        $(tab).each(function (i, connection) {
          var from = connection.location_from
          var to = connection.location_to

          if (self.connectionsSorted[from] == null) {
            self.connectionsSorted[from] = {}
          }
          if (self.connectionsSorted[from][to] == null) {
            self.connectionsSorted[from][to] = []
          }
          self.connectionsSorted[from][to].push(connection)

          // TODO : tri effectué à chaque fois... pas terrible
          self.connectionsSorted[from][to].sort(function (a, b) { return (a.departure > b.departure) ? 1 : ((b.departure > a.departure) ? -1 : 0) })
        })
      })
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
      // Pour éviter que l'accordéon suivant celui supprimé s'ouvre à sa place
      $('#' + connection.id).toggleClass('active').next().toggleClass('show')
      this.$db.connections.where('id').equals(connection.id).delete().then(() => this.update())
    }
  }
}

</script>

<style scoped>

.mdl-card__title{
  padding-bottom: 0px;
}

.title-accordion{
  background-color: white;
}

.mdl-list__item{
  text-transform: none;
}

.mdl-list .mdl-list__item{
  margin-top: 10px;
}


.mdl-card, .mdl-card__supporting-text{
  width: auto;
}

.accordion .mdl-accordion__icon {
  transition-property: transform;
  transition-duration: 0.2s;
  /*color: rgba(0, 0, 0, 0.3);*/
  position: absolute;
  right: 6px;
  margin-top: -3px;
}

.accordion.active .mdl-accordion__icon {
  transform: rotate(-180deg);
}

.space {
	height: 30px;
}

.main-card {
	margin: 0 auto;
	background-color: #e5e5e5;
}

.accordion {
	background-color: white;
	cursor: pointer;
	padding: 10px;
	width: 100%;
	border: none;
	text-align: center;
	outline: none;
	font-size: 15px;
	transition: 0.4s;
}

.accordion.active {
	background-color: rgb(233,30,99);
  color:white;
}

.accordion:hover {
	background-color: rgb(233,30,99);
  color:white;
}

div.panel {
	padding: 0 18px;
	background-color: #fff;
	max-height: 0;
	overflow: hidden;
	transition: 0.4s ease-in-out;
	opacity: 0;
}

div.panel.show {
	opacity: 1;
	max-height: 500px;
}

</style>
