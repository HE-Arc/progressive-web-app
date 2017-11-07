<template>
    <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--3-col mdl-cell--1-col-tablet mdl-cell--hide-phone"></div>
        <div class="mdl-cell mdl-cell--6-col mdl-cell--4-col-phone">
            <div class="mdl-cell mdl-cell--12-col">
                <h1>Search for new routes</h1>
            </div>
            <div class=" mdl-grid center-items">
                <autocomplete
                  url="http://transport.opendata.ch/v1/locations"
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
                  url="http://transport.opendata.ch/v1/locations"
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
                    <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" id="submitSearch" type="button" @click="onSearchSubmit" name="submit"><i class="material-icons">search</i></button>
                    <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect" type="reset" @click="onReset" name="reset"><i class="material-icons">clear</i></button>
                </div>
            </div>
            <transition name="fade">
                <div v-show="connections" class="mdl-cell mdl-cell--12-col">
                    <!-- <div v-show="connections">
                        <p>From : <b>{{ location_from }}</b></p>
                        <p>To : <b>{{ location_to }}</b></p>
                        <p>Time : <b>{{ time }}</b></p>
                    </div> -->
                    <h2>Search results</h2>
                    <div id="connection_results" class="table-responsive">
                        <table>
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
                        <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" id="submitConnection" type="button" @click="onConnectionSubmit" name="submit"><i class="material-icons">add</i></button>
                    </div>
                    <!-- <pre v-if="preContent" :style="preStyle">
                        <b>Selected Data:</b>
                        {{ preContent }}
                    </pre> -->
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

// import autocomplete from 'jquery-ui/ui/widgets/autocomplete'
// require('jquery-ui/ui/widgets/autocomplete')

export default {
  components: { Autocomplete },
  data: function () {
    return {
      location_from: '',
      location_to: '',
      time: '',
      preContent: '',
      connections: '',
      searchId: 0,
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

      let self = this

      $.get('http://transport.opendata.ch/v1/connections', {from: this.location_from, to: this.location_to, time: this.time}, function (data) {
        self.preContent = JSON.stringify(data, null, 4)
        self.connections = data
        self.searchId += 1

        // Cas ou un tableau serait deja present
        if (self.searchId > 1) {
          $('#connection_results > table > tbody tr').remove()
          $('#connection_results > table > thead th:first-child').remove()
          $('#connection_results > table').attr('id', 'connection_table_' + self.searchId).removeClass('is-upgraded').removeAttr('data-upgraded')
        }
        $(data.connections).each(function (i, connection) {
          var line = $('<tr></tr>').attr('id', 'connection_' + i)
          // var lblChk = $('<label></label>').addClass('mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select').attr('for', 'checkbox_' + i)
          // var inputChk = $('<input />').addClass('mdl-checkbox__input').attr({type: 'checkbox', id: 'checkbox' + i})
          // $(lblChk).append(inputChk)
          // var checkbox = $('<td></td>').append(lblChk)
          var from = $('<td></td>').text(self.location_from)
          var to = $('<td></td>').text(self.location_to)
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
      $('#connection_results > table > tbody').find('tr.is-selected').each(function () {
        var text = $(this).children().map(function () {
          return $(this).text()
        }).get()
        alert(text)
      })
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

  #submit{
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

  .table-responsive {
      min-height: .01%;
      overflow-x: auto;
  }
  @media screen and (max-width: 767px) {
      .table-responsive {
          width: 100%;
          margin-bottom: 15px;
          overflow-y: hidden;
          -ms-overflow-style: -ms-autohiding-scrollbar;
          border: 1px solid #ddd;
      }
      .table-responsive > .table {
          margin-bottom: 0;
      }
      .table-responsive > .table > thead > tr > th,
      .table-responsive > .table > tbody > tr > th,
      .table-responsive > .table > tfoot > tr > th,
      .table-responsive > .table > thead > tr > td,
      .table-responsive > .table > tbody > tr > td,
      .table-responsive > .table > tfoot > tr > td {
          white-space: nowrap;
      }
      .table-responsive > .table-bordered {
          border: 0;
      }
      .table-responsive > .table-bordered > thead > tr > th:first-child,
      .table-responsive > .table-bordered > tbody > tr > th:first-child,
      .table-responsive > .table-bordered > tfoot > tr > th:first-child,
      .table-responsive > .table-bordered > thead > tr > td:first-child,
      .table-responsive > .table-bordered > tbody > tr > td:first-child,
      .table-responsive > .table-bordered > tfoot > tr > td:first-child {
          border-left: 0;
      }
      .table-responsive > .table-bordered > thead > tr > th:last-child,
      .table-responsive > .table-bordered > tbody > tr > th:last-child,
      .table-responsive > .table-bordered > tfoot > tr > th:last-child,
      .table-responsive > .table-bordered > thead > tr > td:last-child,
      .table-responsive > .table-bordered > tbody > tr > td:last-child,
      .table-responsive > .table-bordered > tfoot > tr > td:last-child {
          border-right: 0;
      }
      .table-responsive > .table-bordered > tbody > tr:last-child > th,
      .table-responsive > .table-bordered > tfoot > tr:last-child > th,
      .table-responsive > .table-bordered > tbody > tr:last-child > td,
      .table-responsive > .table-bordered > tfoot > tr:last-child > td {
          border-bottom: 0;
      }
  }



</style>
