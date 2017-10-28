<template>
    <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--3-col mdl-cell--1-col-tablet mdl-cell--hide-phone"></div>
        <div class="mdl-cell mdl-cell--6-col mdl-cell--4-col-phone">
            <div class="mdl-cell mdl-cell--12-col">
                <h1>Add</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
            <form action="#" method="get">
                <div class=" mdl-grid center-items">
                    <div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" pattern="[a-zA-ZñÑáéíóúü\-çÇ ]+" id="location_from">
                        <label class="mdl-textfield__label" for="location_from">From</label>
                        <span class="mdl-textfield__error">Only letters, dashes and spaces are accepted.</span>
                    </div>
                    <div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" pattern="[a-zA-ZñÑáéíóúü\-çÇ ]+" id="location_to">
                        <label class="mdl-textfield__label" for="location_to">To</label>
                        <span class="mdl-textfield__error">Only letters, dashes and spaces are accepted.</span>
                    </div>
                    <div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" pattern="[0-9]{1,2}:[0-9]{2}" id="time">
                        <label class="mdl-textfield__label" for="time">Time</label>
                        <span class="mdl-textfield__error">Use this format 9:12 or 21:14</span>
                    </div>
                    <div class="mdl-cell mdl-cell--12-col toolbar-section">
                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" id="submit" type="submit" name="submit">OK</button>
                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" type="reset" name="reset">Cancel</button>
                    </div>

                </div>
            </form>
        </div>
    </div>

</template>

<script>
import componentHandler from 'exports-loader?componentHandler!material-design-lite/material'

export default {
  mounted: function () {
    this.$nextTick(function () {
      componentHandler.upgradeDom()
      // Pas du tout le fonctionnement de Vue.js, mais pour tester...
      document.getElementById('location_from').focus()
      var currentdate = new Date()
      var timeInput = document.getElementById('time')
      timeInput.value = currentdate.getHours() + ':' + currentdate.getMinutes()
      timeInput.parentElement.className += ' is-dirty'
    })
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

</style>
