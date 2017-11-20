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
                    <a class="mdl-navigation__link" href="">
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
  methods: {
    hideMenu: function () {
      document.getElementsByClassName('mdl-layout__drawer')[0].classList.remove('is-visible')
      document.getElementsByClassName('mdl-layout__obfuscator')[0].classList.remove('is-visible')
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

    .autocomplete ul li a:hover, .autocomplete ul li.focus-list a {
        color: white;
        background: rgb(233,30,99);
    }

    h1{
      font-size: 43px;
    }

    h2{
      font-size: 36px;
    }


</style>
