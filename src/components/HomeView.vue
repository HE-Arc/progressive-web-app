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
                    <div v-bind:id="connection.id" class="connection mdl-list__item mdl-button mdl-js-button  mdl-js-ripple-effect accordion">
                      <span class="connection-time">{{ connection.departure}} - {{ connection.arrival }}</span>
                      <span class="stamp update-stamp" v-if="Math.abs(calcTimeBetweenLastUpdateMethodCallAndLastConnectionUpdate(connection)) < 1">
                        <i class="material-icons">check_circle</i>
                      </span>
                      <span class="small-text">Updated {{calcTimeFrom(connection)}}</span>
                      <span class="stamp late-stamp" v-if="connection.all_others_info.from.delay > 0">
                        <i class="material-icons">watch_later</i> {{connection.all_others_info.from.delay}}mn
                      </span>
                      <i class="material-icons mdl-accordion__icon">expand_more</i>
                    </div>
                    <div class="panel">

                      <p>From : <b>{{connection.all_others_info.from.location.name}}</b> at <b>{{getHoursMinutes(connection.all_others_info.from.departure)}}</b> in <b>platform {{connection.all_others_info.from.platform}}</b></p>
                      <p>To : <b>{{connection.all_others_info.to.location.name}}</b> at <b>{{getHoursMinutes(connection.all_others_info.to.arrival)}}</b> in <b>platform {{connection.all_others_info.to.platform}}</b></p>
                      <hr>
                      <div v-for="(section, index) in connection.all_others_info.sections">
                        <p>
                          {{index+1}}.A / Departure from {{section.departure.location.name}} at {{getHoursMinutes(section.departure.departure)}} in platform {{section.departure.platform}}
                          <span class="stamp late-stamp" v-if="section.departure.delay > 0">
                            <i class="material-icons">watch_later</i> {{section.departure.delay}}mn
                          </span>
                        </p>
                        <p>
                          {{index+1}}.B / Arrival in {{section.arrival.location.name}} at {{getHoursMinutes(section.arrival.arrival)}} in platform {{section.arrival.platform}}
                          <span class="stamp late-stamp" v-if="section.arrival.delay > 0">
                            <i class="material-icons">watch_later</i> {{section.arrival.delay}}mn
                          </span>
                        </p>
                      </div>

                      <!-- <ul class="mdl-list">
                        <li v-for="value in connection" class="mdl-list__item"><span class="mdl-list__item-primary-content">{{value}}</span></li>
                      </ul> -->
                      <button type="button" @click="remove(connection)" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect">
                        <i class="material-icons">delete</i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="mdl-cell mdl-cell--12-col toolbar-section">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" id="submitConnection" type="button" @click="onTest" name="submit"><i class="material-icons">add</i> Add to favorites</button>
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
        </div> -->

        <!-- <h1>Sorted</h1>
        <pre v-if="connectionsSorted" :style="preStyle">
            <b>Selected Data:</b>
            {{ connectionsSorted }}
        </pre> -->

        <!-- <h1>Update</h1>
        <pre v-if="connectionsUpdate" :style="preStyle">
            <b>Selected Data:</b>
            {{ connectionsUpdate }}
        </pre> -->

        <!-- <h1>Raw</h1>
        <pre v-if="connections" :style="preStyle">
            <b>Selected Data:</b>
            {{ connections }}
        </pre> -->



      </div>
    </div>
</template>

<script>
// import { uuid } from 'vue-idb'
import moment from 'moment'

$(document.body).on('click', '.accordion', function () {
  $(this).toggleClass('active')
  $(this).next().toggleClass('show')
})

export default {
  data: function () {
    return {
      connections: [],
      connectionsUpdate: [],
      connectionsSorted: {},
      lastUpdateMethodCall: new Date(),
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
  // updated: function () {
  //   alert('call updated')
  //   var self = this
  //   for (var id in self.connectionsUpdated) {
  //     if (self.connectionsUpdated.hasOwnProperty(id)) {
  //       alert('Key is ' + id + ', value is' + self.connectionsUpdated[id])
  //       $('#' + id + ' .update-stamp').delay(1000).fadeOut(400)
  //     }
  //   }
  //   self.connectionsUpdated = []
  // },
  // Définissez les méthodes de l'objet
  methods: {
    onTest () {
      alert('dedans')
      this.connectionsSorted[0].location_from = 'Bonjour'
    },
    sortConnections (connectionArray) {
      var connectionsSorted = {}
      $(connectionArray).each(function (i, connection) {
        var from = connection.location_from
        var to = connection.location_to

        if (connectionsSorted[from] == null) {
          connectionsSorted[from] = {}
        }
        if (connectionsSorted[from][to] == null) {
          connectionsSorted[from][to] = []
        }
        connectionsSorted[from][to].push(connection)

        // TODO : tri effectué à chaque fois... pas terrible
        connectionsSorted[from][to].sort(function (a, b) { return (a.departure > b.departure) ? 1 : ((b.departure > a.departure) ? -1 : 0) })
      })
      return connectionsSorted
    },
    update () {
      var self = this
      this.lastUpdate = new Date()
      this.$db.connections.orderBy('location_from').toArray().then(function (tab) {
        // UPDATE DES TRAJETS
        // Si on est connecté à Internetl
        if (navigator.onLine) {
          // Parcourt les trajets favoris
          $(tab).each(function (i, connection) {
            var timeSinceLastUpdate = self.calcTimeSinceLastConnectionUpdate(connection)
            var timeBetweenUpdates = self.calcTimeBetweenConnectionUpdates(connection)

            // Si la derniere update date d'assez longtemps
            if (timeSinceLastUpdate > timeBetweenUpdates) {
              // Requete pour update sur trajet
              $.get('https://transport.opendata.ch/v1/connections', {limit: 1, from: connection.location_from, to: connection.location_to, time: connection.departure}, function (data) {
                self.connectionsUpdate = JSON.stringify(data, null, 4)
                data = data.connections[0]
                // Mise à jour des informations dans l'objet
                connection.location_from = data.from.station.name
                connection.location_to = data.to.station.name
                connection.departure = moment(data.from.departure).format('HH:mm')
                connection.arrival = moment(data.to.arrival).format('HH:mm')
                connection.all_others_info = data
                connection.updated_at = new Date()

                // Remplace l'objet dans IDB si l'id est deja présente dans la table, sinon ajoute un nouveau
                self.$db.connections.put(connection).then(function (updated) {
                  if (updated) {
                    console.log('Updated')
                    // $('#' + connection.id + ' .update-stamp').delay(1000).fadeOut(400)
                  } else {
                    console.log('Not updated')
                  }
                })
              })
            }
          })
        }
        // Sauvegarde le tableau de trajet avant les tris
        self.connections = tab
        // Trie le tableau de trajets et le réécrit en JSON
        self.connectionsSorted = self.sortConnections(tab)
      })
    },
    remove (connection) {
      // Pour éviter que l'accordéon suivant celui supprimé s'ouvre à sa place
      $('#' + connection.id).toggleClass('active').next().toggleClass('show')
      this.$db.connections.where('id').equals(connection.id).delete().then(() => this.update())
    },
    calcTimeBetweenConnectionUpdates (connection) {
      // Temps restant avant le départ
      var timeLeft = moment.duration(moment(connection.departure, 'HH:mm').diff(moment(moment(), 'HH:mm'))).asMinutes()
      // Temps du trajet
      var travelDuration = moment.duration(moment(connection.arrival, 'HH:mm').diff(moment(connection.departure, 'HH:mm'))).asMinutes()

      if (timeLeft > 60) {
        // Temps d'attente par défaut entre les updates
        var timeBetweenUpdate = 60
      } else if (timeLeft <= 60 && timeLeft > 20) {
        // Entre 60 et 20mn à l'avance
        timeBetweenUpdate = 10
      } else if (timeLeft <= 20 && timeLeft > -travelDuration - 5) {
        // Entre 20mn d'avance et la durée du trajet un peu augmentée
        timeBetweenUpdate = 1
      } else {
        // Le trajet est terminé et arrivé
        timeBetweenUpdate = Number.MAX_SAFE_INTEGER
      }

      // alert(moment(connection.departure, 'HH:mm'))
      // alert(timeBetweenUpdate)
      // alert(timeLeft)
      // alert(travelDuration)
      // alert(moment.duration(moment().diff(moment(connection.updated_at))).asMinutes())
      return timeBetweenUpdate
    },
    calcTimeSinceLastConnectionUpdate (connection) {
      return moment.duration(moment().diff(moment(connection.updated_at))).asMinutes()
    },
    calcTimeBetweenLastUpdateMethodCallAndLastConnectionUpdate (connection) {
      return moment.duration(moment(connection.updated_at).diff(moment(this.lastUpdateMethodCall))).asMinutes()
    },
    calcTimeFrom (connection) {
      return moment(connection.updated_at).fromNow()
    },
    getHoursMinutes (time) {
      return moment(time).format('HH:mm')
    }
  }
}

</script>

<style scoped>



.stamp{
  margin-left: 10px;
}

.connection:first-child .stamp{
  margin-left: 5px;
}

.small-text{
  font-size: 13px;
  color: rgb(171, 171, 171);
  padding-left: 5px;
}

.connection-time{
  margin-right: 10px;
}

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

.accordion:hover .small-text, .accordion.active .small-text{
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
 padding: 15px 18px;
}

</style>
