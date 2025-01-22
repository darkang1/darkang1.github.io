(function() {
    'use strict';

    const SCROLL_AREAS = {
        SETTINGS: '.settings__content',
        LEFT_SIDEBAR: '.menu__list',
        MAIN_CONTENT: '.scroll'
    };

    function startPlugin() {
        document.addEventListener('wheel', handleScrollNavigation, { passive: false });
        Lampa.Manifest.plugins['mouse_wheel_nav'] = {
            name: 'Mouse Wheel Navigation',
            version: '1.0',
            description: 'Enables smart mouse wheel scrolling'
        };
    }

    function handleScrollNavigation(event) {
        event.preventDefault();
        
        const direction = event.deltaY > 0 ? 'down' : 'up';
        
        // Determine which area is active and should receive scroll events
        if (isSettingsOpen()) {
            handleSettingsScroll(direction, event);
        } else if (isLeftSidebarActive()) {
            handleLeftSidebarScroll(direction, event);
        } else {
            handleMainContentScroll(direction, event);
        }
    }

    function isSettingsOpen() {
        return $('.settings.open').length > 0;
    }

    function isLeftSidebarActive() {
        return $('.menu.open').length > 0 && 
               document.activeElement.closest(SCROLL_AREAS.LEFT_SIDEBAR);
    }

    function handleSettingsScroll(direction, event) {
        const settingsContent = $(SCROLL_AREAS.SETTINGS)[0];
        if (!settingsContent) return;

        const scrollAmount = 100; // Adjust this value for scroll speed
        const currentScroll = settingsContent.scrollTop;
        const newScroll = direction === 'down' ? 
            currentScroll + scrollAmount : 
            currentScroll - scrollAmount;

        settingsContent.scrollTo({
            top: newScroll,
            behavior: 'smooth'
        });
    }

    function handleLeftSidebarScroll(direction, event) {
        const sidebarList = $(SCROLL_AREAS.LEFT_SIDEBAR)[0];
        if (!sidebarList) return;

        const currentFocus = $('.menu__item.focus');
        const allItems = $('.menu__item');
        const currentIndex = allItems.index(currentFocus);

        if (direction === 'down' && currentIndex < allItems.length - 1) {
            Lampa.Controller.move('down');
        } else if (direction === 'up' && currentIndex > 0) {
            Lampa.Controller.move('up');
        }
    }

    function handleMainContentScroll(direction, event) {
        const mainContent = $(SCROLL_AREAS.MAIN_CONTENT)[0];
        if (!mainContent) return;

        const scrollAmount = 150; // Adjust this value for main content scroll speed
        const currentScroll = mainContent.scrollTop;
        const newScroll = direction === 'down' ? 
            currentScroll + scrollAmount : 
            currentScroll - scrollAmount;

        mainContent.scrollTo({
            top: newScroll,
            behavior: 'smooth'
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
