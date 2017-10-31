<template>
    <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--3-col mdl-cell--1-col-tablet mdl-cell--hide-phone"></div>
        <div class="mdl-cell mdl-cell--6-col mdl-cell--4-col-phone">
            <div class="mdl-cell mdl-cell--12-col">
                <h1>Add</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
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
                    <input class="mdl-textfield__input" type="text" pattern="[0-9]{1,2}:[0-9]{2}" id="time" v-model="time">
                    <label class="mdl-textfield__label" for="time">Time</label>
                    <span class="mdl-textfield__error">Use this format 9:12 or 21:14</span>
                </div>
                <div class="mdl-cell mdl-cell--12-col toolbar-section">
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" id="submit" type="button" @click="onSubmit" name="submit">OK</button>
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" type="reset" @click="onReset" name="reset">Cancel</button>
                </div>
            </div>
            <div class="mdl-cell mdl-cell--12-col">
                <p>Choix de départ : <b>{{ location_from }}</b></p>
                <p>Choix de départ : <b>{{ location_to }}</b></p>
                <p>Choix de l'heure : <b>{{ time }}</b></p>
                <pre v-if="preContent" :style="preStyle">
                    <b>Selected Data:</b>
                    {{ preContent }}
                </pre>
            </div>


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
      preStyle: {
        background: '#f2f2f2',
        fontFamily: 'monospace',
        fontSize: '1em',
        display: 'inline-block',
        padding: '15px 7px'
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      componentHandler.upgradeDom()
      this.onReset()
      $('#location_from').after('<label class="mdl-textfield__label" for="location_from">From</label>')
      $('#location_to').after('<label class="mdl-textfield__label" for="location_to">To</label>')
      $('.autocomplete-input').attr('pattern', '[a-zA-ZñÑáéíóúüçÇ. -]+').after('<span class="mdl-textfield__error">Only letters, dashes and spaces are accepted.</span>')
      document.getElementById('location_from').focus()
      $('ul').css('z-index', '1000')

      // TODO : Ajouter le pattern html5 et le span error
    })
  },
  // Définissez les méthodes de l'objet
  methods: {
    processJSON (json) {
      this.preContent = json
      return json.stations
    },
    handleSelect (data) {
      this.preContent = JSON.stringify(data, null, 4)
    },
    onSubmit () {
      this.location_from = $('#location_from').val()
      this.location_to = $('#location_to').val()
    },
    onReset () {
      // La réinitisalition marche pas tiptop
      this.location_to = ''
      this.location_from = ''
      $('#location_to').val(' ')
      $('#location_from').val(' ')
      this.time = moment().format('HH:mm')
      $('#time').parent().addClass('is-dirty')
    }
  }
}
</script>

<style scoped>

  .toolbar-section {
      margin-top: 15px;
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




</style>
