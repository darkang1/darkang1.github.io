(function() {
    'use strict';
    
    console.log('Mouse wheel plugin script loaded');

    function startPlugin() {
        console.log('Starting mouse wheel plugin initialization');
        
        // Test if Lampa object exists
        if (typeof Lampa === 'undefined') {
            console.error('Lampa object not found!');
            return;
        }
        
        // Test if jQuery ($) is available
        if (typeof $ === 'undefined') {
            console.error('jQuery not found!');
            return;
        }

        // Attach wheel event listener to document
        document.addEventListener('wheel', function(event) {
            console.log('Wheel event detected', {
                deltaY: event.deltaY,
                target: event.target
            });
            
            // Log active elements
            console.log('Active elements:', {
                settings: $('.settings.open').length,
                menu: $('.menu.open').length,
                activeElement: document.activeElement
            });
        });

        console.log('Mouse wheel plugin initialized successfully');
    }

    // Test both initialization paths
    if (window.appready) {
        console.log('Window already ready - direct initialization');
        startPlugin();
    } else {
        console.log('Waiting for app ready event');
        if (Lampa && Lampa.Listener) {
            Lampa.Listener.follow('app', function(e) {
                console.log('App event received:', e);
                if (e.type == 'ready') {
                    startPlugin();
                }
            });
        } else {
            console.error('Lampa.Listener not available');
        }
    }
})();
