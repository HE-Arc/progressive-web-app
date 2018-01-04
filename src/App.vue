<template>
    <div id="app" class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header class="mdl-layout__header">
            <div class="mdl-layout__header-row">
                <span class="mdl-layout-title"><router-link id="btn_home" to="/">NextStop</router-link></span>
                <!-- Add spacer, to align navigation to the right -->
                <div class="mdl-layout-spacer"></div>
                <nav class="mdl-navigation">
                    <router-link class="mdl-navigation__link" to="/add">
                        <i id="btn_add" class="material-icons">add</i>
                        <span class="mdl-tooltip" data-mdl-for="btn_add">
                            Add a new travel
                        </span>
                    </router-link>
                    <a href="" id="refresh_button_link" class="mdl-navigation__link" v-on:click="refreshPage">
                        <i id="btn_refresh" class="material-icons">refresh</i>
                        <span class="mdl-tooltip" data-mdl-for="btn_refresh">
                            Refresh data
                        </span>
                    </a>
                    <router-link class="mdl-navigation__link" to="/settings">
                        <i id="btn_settings" class="material-icons">settings</i>
                        <span class="mdl-tooltip" data-mdl-for="btn_settings">
                            Update settings
                        </span>
                    </router-link>
                </nav>
            </div>
        </header>
        <div class="mdl-layout__drawer">
            <span class="mdl-layout-title">NextStop</span>
            <nav class="mdl-navigation">
                <router-link class="mdl-navigation__link" to="/" @click.native="hideMenu"><i class="material-icons">home</i>  Home</router-link>
                <router-link class="mdl-navigation__link" to="/add" @click.native="hideMenu"><i class="material-icons">add</i>  Add</router-link>
                <router-link class="mdl-navigation__link" to="/settings" @click.native="hideMenu"><i class="material-icons">settings</i>  Settings</router-link>
            </nav>
        </div>
        <main class="mdl-layout__content">
            <div class="page-content">
                <transition name="fade"  mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </main>
        <footer>
            <div aria-live="assertive" aria-atomic="true" aria-relevant="text" class="mdl-snackbar mdl-js-snackbar">
                <div class="mdl-snackbar__text"></div>
                <button type="button" class="mdl-snackbar__action"></button>
            </div>
        </footer>
    </div>
</template>

<script>
require('material-design-lite')

export default {
  name: 'app',
  mounted: function () {

  },
  methods: {
    hideMenu: function () {
      document.getElementsByClassName('mdl-layout__drawer')[0].classList.remove('is-visible')
      document.getElementsByClassName('mdl-layout__obfuscator')[0].classList.remove('is-visible')
    },
    refreshPage: function (event) {
      // Empêche la redirection vers l'accueil
      event.preventDefault()
      // Redirige vers la page courante (reload)
      this.$router.go()
    }
  }
}

</script>

<style>
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
    @import url('https://code.getmdl.io/1.3.0/material.pink-blue.min.css');

    #btn_home {
        font-size: 20px;
        color:#FFF;
        text-decoration: none;

    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0
    }

    /* TODO : Important pas bien */
    .autocomplete ul li a:hover, .autocomplete ul li.focus-list a {
        color: white !important;
        background: rgb(233,30,99) !important;
    }

    h1{
      font-size: 43px;
    }

    h2{
      font-size: 36px;
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
