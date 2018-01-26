<template>
  <div class="mdl-grid">
    <div class="mdl-cell mdl-cell--3-col mdl-cell--1-col-tablet mdl-cell--hide-phone"></div>
    <div v-if="Object.keys(connectionsSorted).length > 0" class="mdl-cell mdl-cell--6-col mdl-cell--4-col-phone">

      <div class="mdl-cell mdl-cell--12-col">
        <h1>Your favorite routes</h1>
      </div>

      <div class="mdl-cell mdl-cell--12-col">
        <div class="mdl-card main-card">
          <div class="mdl-card__supporting-text">
            <!-- Boucle principale sur les villes de départ - 1er etage -->
            <div v-for="(arrival_list, departure_location) in connectionsSorted">
              <!-- Boucle sur les villes d'arrivée - 2eme etage -->
              <div v-for="(connection_list, arrival_location) in arrival_list"  class="mdl-list">
                <!-- Séparaison entre les accordéons -->
                <div class="mdl-list__item title-accordion mdl-button mdl-js-button">
                  <span><b>DE </b> {{ departure_location }} <b> A </b> {{ arrival_location }}</span>
                </div>
                <!-- Boucle sur les trajets - Feuilles -->
                <div v-for="connection in connection_list" >
                  <div v-bind:id="connection.id" class="connection mdl-list__item mdl-button mdl-js-button  mdl-js-ripple-effect accordion">
                    <!-- Titre de l'accordéon -->
                    <span class="connection-time">{{ connection.departure}} - {{ connection.arrival }}</span>
                    <span class="stamp update-stamp" v-if="Math.abs(calcTimeBetweenLastUpdateMethodCallAndLastConnectionUpdate(connection)) < 1">
                      <i class="material-icons">check_circle</i>
                    </span>
                    <span class="small-text">Updated {{calcTimeFrom(connection)}}</span>
                    <span class="mdl-chip title-chip" v-if="connection.all_others_info.from.delay > 0">
                      <span class="mdl-chip__text"><i class="material-icons">watch_later</i><span class="late_text_indication">{{connection.all_others_info.from.delay}}mn</span></span>
                    </span>
                    <i class="material-icons mdl-accordion__icon">expand_more</i>
                  </div>
                  <!-- Contenu de l'accordeon -->
                  <div class="panel">
                    <div class="toolbar-section remove-button">
                      <button type="button" @click="remove(connection)" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab">
                        <i class="material-icons">delete</i>
                      </button>
                    </div>
                    <!-- <p>From : <b>{{connection.all_others_info.from.location.name}}</b> at <b>{{getHoursMinutes(connection.all_others_info.from.departure)}}</b> in <b>platform {{connection.all_others_info.from.platform}}</b></p>
                    <p>To : <b>{{connection.all_others_info.to.location.name}}</b> at <b>{{getHoursMinutes(connection.all_others_info.to.arrival)}}</b> in <b>platform {{connection.all_others_info.to.platform}}</b></p> -->
                    <div class="travel-route">
                      <!-- Boucle sur les étapes du trajet -->
                      <ul v-for="(section, index) in connection.all_others_info.sections" class="mdl-list travel-transfer-list">
                        <!-- Départ de l'étape -->
                        <li  class="mdl-list__item mdl-list__item--two-line">
                          <span class="mdl-list__item-primary-content">
                            <i class="material-icons mdl-list__item-avatar">train</i>
                            <span>{{section.departure.location.name}}</span>
                            <span class="mdl-list__item-sub-title">At {{getHoursMinutes(section.departure.departure)}} on platform {{section.departure.platform}}</span>
                          </span>
                          <span class="mdl-list__item-secondary-content">
                            <span class="mdl-list__item-secondary-action">
                              <span class="mdl-chip" v-if="section.departure.delay > 0">
                                <span class="mdl-chip__text"><i class="material-icons">watch_later</i> {{section.departure.delay}}mn</span>
                              </span>
                            </span>
                          </span>
                        </li>
                        <!-- Arrivée de l'étape -->
                        <li  class="mdl-list__item mdl-list__item--two-line">
                          <span class="mdl-list__item-primary-content">
                            <i class="material-icons mdl-list__item-avatar">arrow_forward</i>
                            <span>{{section.arrival.location.name}}</span>
                            <span class="mdl-list__item-sub-title">At {{getHoursMinutes(section.arrival.arrival)}} on platform {{section.arrival.platform}}</span>
                          </span>
                          <span class="mdl-list__item-secondary-content">
                            <span class="mdl-list__item-secondary-action">
                              <span class="mdl-chip" v-if="section.arrival.delay > 0">
                                <span class="mdl-chip__text"><i class="material-icons">watch_later</i> {{section.arrival.delay}}mn</span>
                              </span>
                            </span>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="mdl-cell mdl-cell--6-col mdl-cell--4-col-phone">
      <div class="demo-card-wide mdl-card mdl-shadow--2dp">
        <div class="mdl-card__title">
          <h2 class="mdl-card__title-text">Welcome to NextStop</h2>
        </div>
        <div class="mdl-card__supporting-text">
          You have currently no favourite routes, you can try to add some.
        </div>
        <div class="mdl-card__actions mdl-card--border">
          <router-link to="/add" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
            Get Started
          </router-link>
        </div>
      </div>
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
      this.lastUpdateMethodCall = new Date()
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

/* SMARTPHONE ADJUSTEMENTS */
@media screen and (max-width: 479px) {
  .remove-button.toolbar-section{
    float:none;
  }

  .late_text_indication{
    display: none;
  }

  .connection .mdl-chip__text .material-icons{
    padding-right: 0px;
  }

  .mdl-list .mdl-list__item{
    overflow: initial;
  }

  .mdl-list div.panel.show{
    padding: 15px 10px;
  }

  .connection.accordion .mdl-accordion__icon{
    position: initial;
  }

  .connection .connection-time{
    margin-right: 0px;
  }
}

.title-chip{
  margin-left: 5px;
  color : rgb(233,30,99);
}

.mdl-chip__text{
  display: inline-flex;
  line-height: 15px;
}

.mdl-chip__text .material-icons{
  line-height: 15px;
  padding-right: 4px;
}

.demo-card-wide.mdl-card {
  width: 100%;
}
.demo-card-wide > .mdl-card__title {
  color: #fff;
  height: 110px;
  background-color : rgb(233,30,99);
  padding-bottom: 12px;
}
.demo-card-wide > .mdl-card__menu {
  color: #fff;
}

.mdl-chip__text .material-icons{
  vertical-align: middle;
}

.mdl-list__item-secondary-content{
  align-items: flex-start;
}

.toolbar-section {
    margin-top: 15px;
    text-align: right;
    float: right;
}

.mdl-list__item-secondary-content{
  color: rgb(233,30,99);
}

.travel-transfer-list{
  padding: 0px;
}

.travel-transfer-list:last-child .mdl-list__item:last-child,
.travel-transfer-list:last-child .mdl-list__item:last-child .mdl-list__item-sub-title,
.travel-transfer-list:first-child .mdl-list__item:first-child,
.travel-transfer-list:first-child .mdl-list__item:first-child .mdl-list__item-sub-title {
  font-weight: bold;
}


.mdl-list .mdl-list__item.mdl-list__item--two-line{
  margin-top: 0px;
  padding: 2px;
  height: 60px;
}

.mdl-list__item-avatar{
  border-radius: 15%;
}

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

.mdl-card{
  min-height: 100px;
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

.accordion.active, .accordion:hover {
	background-color: rgb(233,30,99);
  color:white;
}


.accordion:hover .small-text, .accordion.active .small-text{
  color:white;
}

.accordion:hover .title-chip,  .accordion.active .title-chip{
	background-color: white;
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
	max-height: 800px;
 padding: 15px 18px;
}

</style>
