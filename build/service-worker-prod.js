(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors.
  const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );
//lol
    function showUpdateReady(worker) {
      var notification = document.querySelector('.mdl-js-snackbar');
      var data = {
        message: "New version available",
        actionHandler: function(event) { worker.postMessage({action: 'skipWaiting'});},
        actionText: 'REFRESH',
        timeout: 10000
      };
      notification.MaterialSnackbar.showSnackbar(data);
    };

  window.addEventListener('load', function() {
      if ('serviceWorker' in navigator &&
          (window.location.protocol === 'https:' || isLocalhost)) {
        navigator.serviceWorker.register('service-worker.js')
        .then(function(registration) {
          // updatefound is fired if service-worker.js changes.
          registration.onupdatefound = function() {
            // updatefound is also fired the very first time the SW is installed,
            // and there's no need to prompt for a reload at that point.
            // So check here to see if the page is already controlled,
            // i.e. whether there's an existing service worker.

            //alert('sw.onupdatefound');

            if (navigator.serviceWorker.controller) {

              // TODO : Marche pas
              if (registration.waiting) {
                alert('waiting');
                showUpdateReady(registration.waiting);
                return;
              }

              // The updatefound event implies that registration.installing is set
              const installingWorker = registration.installing;

              installingWorker.onstatechange = function() {
                switch (installingWorker.state) {
                  case 'installed':
                    // At this point, the old content will have been purged and the
                    // fresh content will have been added to the cache.
                    // It's the perfect time to display a "New content is
                    // available; please refresh." message in the page's interface.

                    //alert('sw.installed');

                    // En cas de changement de service worker
                    showUpdateReady(installingWorker);

                    break;

                  case 'redundant':
                    throw new Error('The installing ' +
                                    'service worker became redundant.');

                  default:
                    // Ignore
                }
              };

              // Rafraichit la page si le controller change
              var refreshing
              navigator.serviceWorker.addEventListener('controllerchange', function () {
                if (refreshing) return
                window.location.reload()
                refreshing = true
              });
            }
            // Shell mis en cache
            else{
              var notification = document.querySelector('.mdl-js-snackbar');
              var data = {
                message: "Content is now available offline!",
                timeout: 10000
              };
              notification.MaterialSnackbar.showSnackbar(data);
            }
          };
        }).catch(function(e) {
          console.error('Error during service worker registration:', e);
        });
      }

      // Permet d'indiquer le statut de connexion à l'utilisateur
      function updateOnlineStatus(event) {
        var condition = navigator.onLine ? "Live" : "Currently offline";

        var notification = document.querySelector('.mdl-js-snackbar');
        var data = {
          message: condition,
          actionHandler: function(event) { notification.classList.remove('mdl-snackbar--active');},
          actionText: 'DISMISS',
          timeout: 10000
        };
        notification.MaterialSnackbar.showSnackbar(data);
      }

      window.addEventListener('online',  updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
    });
})();
