<template>
    <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--3-col mdl-cell--1-col-tablet mdl-cell--hide-phone"></div>
        <div class="mdl-cell mdl-cell--6-col mdl-cell--4-col-phone">
            <div class="mdl-cell mdl-cell--12-col">
                <h1>Search for new routes</h1>
            </div>

            <div class=" mdl-grid center-items">
                <autocomplete
                  url="https://transport.opendata.ch/v1/locations"
                  anchor="name"
                  id="location_from"
                  label="null"
                  name="autocomplete"
                  param="query"
                  :classes="{ wrapper: 'mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-textfield mdl-js-textfield mdl-textfield--floating-label', input: 'mdl-textfield__input', list: 'data-list', item: 'data-list-item' }"
                  :min="0"
                  :process="processJSON"
                  :onSelect="handleSelect">
                </autocomplete>

                <autocomplete
                  url="https://transport.opendata.ch/v1/locations"
                  anchor="name"
                  id="location_to"
                  label="null"
                  name="autocomplete"
                  param="query"
                  :classes="{ wrapper: 'mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-textfield mdl-js-textfield mdl-textfield--floating-label', input: 'mdl-textfield__input', list: 'data-list', item: 'data-list-item' }"
                  :min="0"
                  :process="processJSON"
                  :onSelect="handleSelect">
                </autocomplete>

                <!-- <div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="text" pattern="[a-zA-ZñÑáéíóúü\-çÇ ]+" id="location_to">
                    <label class="mdl-textfield__label" for="location_to">To</label>
                    <span class="mdl-textfield__error">Only letters, dashes and spaces are accepted.</span>
                </div> -->
                <div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="text" pattern="[0-9]{1,2}:[0-9]{2}" id="time" v-model="time"  @keyup.enter="onSearchSubmit">
                    <label class="mdl-textfield__label" for="time">Time</label>
                    <span class="mdl-textfield__error">Use this format 9:12 or 21:14</span>
                </div>
                <div class="mdl-cell mdl-cell--12-col toolbar-section">
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" id="submitSearch" type="button" @click="onSearchSubmit" name="submit"><i class="material-icons">search</i> Search</button>
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" type="reset" @click="onReset" name="reset"><i class="material-icons">clear</i> Clear</button>
                </div>
            </div>
            <transition name="fade" mode="out-in">
                <div v-show="connections_JSON" class="mdl-cell mdl-cell--12-col">
                    <!-- <div v-show="connections">
                        <p>From : <b>{{ location_from }}</b></p>
                        <p>To : <b>{{ location_to }}</b></p>
                        <p>Time : <b>{{ time }}</b></p>
                    </div> -->
                    <h2>Search results</h2>
                    <div id="connection_results" class="table-responsive">
                        <table  class="mdl-cell mdl-cell--12-col">
                            <thead>
                                <tr>
                                    <!-- <th>
                                        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="checkbox-all">
                                            <input type="checkbox" id="checkbox-all" class="mdl-checkbox__input">
                                        </label>
                                    </th> -->
                                    <th class="mdl-data-table__cell--non-numeric">From</th>
                                    <th class="mdl-data-table__cell--non-numeric">Departure</th>
                                    <th class="mdl-data-table__cell--non-numeric">To</th>
                                    <th class="mdl-data-table__cell--non-numeric">Arrival</th>
                                    <th class="mdl-data-table__cell--non-numeric">Duration</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <div class="mdl-cell mdl-cell--12-col toolbar-section">
                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" id="submitConnection" type="button" @click="onConnectionSubmit" name="submit"><i class="material-icons">add</i> Add to favorites</button>
                    </div>
                    <pre v-if="preContent" :style="preStyle">
                        <b>Selected Data:</b>
                        {{ preContent }}
                    </pre>
                </div>
            </transition>

        </div>
    </div>
</template>

<script>
import componentHandler from 'exports-loader?componentHandler!material-design-lite/material'
import moment from 'moment'
import Autocomplete from 'vue2-autocomplete-js'
require('vue2-autocomplete-js/dist/style/vue2-autocomplete.css')

import { uuid } from 'vue-idb'

import fakedata from 'fake.json'

// import autocomplete from 'jquery-ui/ui/widgets/autocomplete'
// require('jquery-ui/ui/widgets/autocomplete')

// db.friends.put({name: 'View', shoeSize: 10})

// Permet de cocher sur le clic d'une ligne de résultat
$(document).on('click', 'tr', function () {
  $(this).toggleClass('is-selected').find('label').toggleClass('is-checked')

  // Cas de la coche "all"
  if ($(this).parent().is('thead')) {
    $('tbody tr').removeClass('is-selected').find('label').removeClass('is-checked')

    if ($(this).hasClass('is-selected')) {
      $('tbody tr').addClass('is-selected').find('label').addClass('is-checked')
    }
  }
})

export default {
  components: { Autocomplete },
  data: function () {
    return {
      fakedata: fakedata,
      location_from: '',
      location_to: '',
      time: '',
      preContent: '',
      connections_JSON: '',
      searchId: 0,
      preStyle: {
        background: '#f2f2f2',
        fontFamily: 'monospace',
        fontSize: '1em',
        display: 'inline-block',
        padding: '15px 7px',
        width: '100%'
      },
      connections: []
    }
  },
  mounted: function () {
    this.update()
    this.$nextTick(function () {
      // var elements = $('#location_from')[0]
      // componentHandler.downgradeElements(elements)

      $('#location_from').after('<label class="mdl-textfield__label" for="location_from">From</label>')
      $('#location_to').after('<label class="mdl-textfield__label" for="location_to">To</label>')
      $('.autocomplete-input').attr('pattern', '[a-zA-ZñÑáéíóúüçÇ. -]+').after('<span class="mdl-textfield__error">Only letters, dashes and spaces are accepted.</span>')
      document.getElementById('location_from').focus()
      $('ul').css('z-index', '1000')

      // TODO : A remplacer avec upgradeElementS(array)
      componentHandler.upgradeElement($('#location_from').parent()[0])
      componentHandler.upgradeElement($('#location_to').parent()[0])
      componentHandler.upgradeElement($('#time').parent()[0])

      this.onReset()
    })
  },
  // Définissez les méthodes de l'objet
  methods: {
    processJSON (json) {
      return json.stations
    },
    handleSelect (data) {

    },
    onSearchSubmit () {
      this.location_from = $('#location_from').val()
      this.location_to = $('#location_to').val()

      // TODO : voir s'il y a mieux
      let self = this

      $.get('https://transport.opendata.ch/v1/connections', {from: this.location_from, to: this.location_to, time: this.time}, function (data) {
        // Import de données factices -------
        // data = self.fakedata
        // Fin import -----------------------

        self.preContent = JSON.stringify(data, null, 4)
        self.searchId += 1

        // Cas ou un tableau serait deja present
        if (self.searchId > 1) {
          self.connections_JSON = ''
          $('#connection_results > table > tbody tr').remove()
          $('#connection_results > table > thead th:first-child').remove()
          $('#connection_results > table').attr('id', 'connection_table_' + self.searchId).removeClass('is-upgraded').removeAttr('data-upgraded')
          // TODO : Delete l'ancien tableau dans la dom de mdl
          // TODO : à essayer d'enlever is-upgraded et de lancer un upgrade element
        }

        self.connections_JSON = data

        $(data.connections).each(function (i, connection) {
          var line = $('<tr></tr>').attr('id', 'connection_' + i)
          var from = $('<td></td>').text(connection.from.station.name)
          var to = $('<td></td>').text(connection.to.station.name)
          var departure = $('<td></td>').text(moment(connection.from.departure).format('HH:mm'))
          var arrival = $('<td></td>').text(moment(connection.to.arrival).format('HH:mm'))
          var duration = $('<td></td>').text(moment.utc(moment(connection.to.arrival).diff(moment(connection.from.departure))).format('HH:mm'))
          $('#connection_results > table tbody').append(line)
          $(line).append(from, departure, to, arrival, duration)
        })
        $('#connection_results > table td').addClass('mdl-data-table__cell--non-numeric')
        $('#connection_results > table').addClass('mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp')

        componentHandler.upgradeElement($('#connection_results > table')[0])
      })
    },
    onReset () {
      // TODO : La réinitisalition marche pas tiptop
      this.location_to = ''
      this.location_from = ''
      $('#location_to').val(' ')
      $('#location_from').val(' ')
      this.time = moment().format('HH:mm')
      $('#time').parent().addClass('is-dirty')
    },
    onConnectionSubmit () {
      // TODO : voir s'il y a mieux
      let self = this

      $('#connection_results > table > tbody').find('tr.is-selected').each(function () {
        var connectionData = $(this).children().map(function () {
          return $(this).text()
        }).get()
        // Récupération des infos JSON
        connectionData.push(self.connections_JSON.connections[$(this).attr('id').substr(11)])
        // alert(self.connections_JSON.connections[$(this).attr('id').substr(11)])
        self.add(connectionData)
      })
      // Redirection vers home
      this.$router.push({name: 'home'})
    },
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
        all_others_info: connectionData[6],
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

  .toolbar-section {
      margin-top: 15px;
      margin-bottom: 50px;
      text-align: right;
  }

  .center-items {
      /*justify-content: center;*/
  }

  .mdl-grid .mdl-grid{
      padding: 0px;
      margin-left:0px;
      margin-right: 0px;
  }

  #submitSearch{
      margin-right: 10px;
  }

  .above-all{
    z-index: 1000;
  }

  #connections_table{
    margin-top: 50px;
    margin-bottom: 50px;
    width: 100%;
  }





</style>
