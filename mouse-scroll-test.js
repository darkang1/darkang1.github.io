(function() {
    'use strict';

    function startPlugin() {
        var manifest = {
            name: 'Mouse Wheel Navigation',
            version: '1.0',
            description: 'Enables mouse wheel scrolling support',
            component: 'mouse_wheel_scroll'
        };

        // Track scroll areas and states
        var scrollState = {
            settings: false,
            leftMenu: false,
            mainContent: true
        };

        function initializeScrollHandlers() {
            document.addEventListener('wheel', handleWheel, { passive: false });
            
            // Track active areas
            Lampa.Listener.follow('activity', function(e) {
                if (e.component === 'settings') {
                    scrollState.settings = true;
                    scrollState.mainContent = false;
                } else {
                    scrollState.settings = false;
                    scrollState.mainContent = true;
                }
            });

            // Track menu state
            $('.menu').on('hover:focus', function() {
                scrollState.leftMenu = true;
                scrollState.mainContent = false;
            });

            $('.menu').on('hover:blur', function() {
                scrollState.leftMenu = false;
                scrollState.mainContent = true;
            });
        }

        function handleWheel(event) {
            event.preventDefault();

            const scrollAmount = 100;
            const direction = event.deltaY > 0 ? 'down' : 'up';

            // Settings panel scroll
            if (scrollState.settings) {
                const settingsContent = $('.settings__content')[0];
                if (settingsContent) {
                    handleSmoothScroll(settingsContent, direction, scrollAmount);
                }
            }
            // Left menu scroll
            else if (scrollState.leftMenu) {
                const menuList = $('.menu__list')[0];
                if (menuList) {
                    const currentItem = $('.menu__item.focus');
                    const allItems = $('.menu__item');
                    const currentIndex = allItems.index(currentItem);

                    if (direction === 'down' && currentIndex < allItems.length - 1) {
                        Lampa.Controller.move('down');
                    } else if (direction === 'up' && currentIndex > 0) {
                        Lampa.Controller.move('up');
                    }
                }
            }
            // Main content scroll
            else if (scrollState.mainContent) {
                const mainContent = $('.scroll')[0];
                if (mainContent) {
                    handleSmoothScroll(mainContent, direction, scrollAmount);
                }
            }
        }

        function handleSmoothScroll(element, direction, amount) {
            const currentScroll = element.scrollTop;
            const newScroll = direction === 'down' ? 
                currentScroll + amount : 
                currentScroll - amount;

            element.scrollTo({
                top: newScroll,
                behavior: 'smooth'
            });
        }

        // Initialize plugin
        initializeScrollHandlers();

        // Add settings toggle
        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: {
                name: 'enable_mouse_wheel',
                type: 'toggle',
                default: true
            },
            field: {
                name: 'Mouse Wheel Scrolling',
                description: 'Enable/disable mouse wheel navigation'
            },
            onChange: function(value) {
                if (value) {
                    initializeScrollHandlers();
                } else {
                    document.removeEventListener('wheel', handleWheel);
                }
            }
        });
    }

    // Plugin initialization
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type == 'ready') startPlugin();
        });
    }
})();
