(function() {
    'use strict';

    const DEBUG = true;

    const SCROLL_AREAS = {
        SETTINGS: '.settings__content',
        LEFT_SIDEBAR: '.menu__list',
        MAIN_CONTENT: '.scroll'
    };

    function debugLog(area, message, data = null) {
        if (!DEBUG) return;
        
        const styles = {
            settings: 'background: #7B68EE; color: white; padding: 2px 5px;',
            sidebar: 'background: #20B2AA; color: white; padding: 2px 5px;',
            main: 'background: #FF6347; color: white; padding: 2px 5px;',
            error: 'background: #FF0000; color: white; padding: 2px 5px;',
            info: 'background: #4682B4; color: white; padding: 2px 5px;'
        };

        const style = styles[area] || styles.info;
        
        if (data) {
            console.log(`%c[${area.toUpperCase()}] ${message}`, style, data);
        } else {
            console.log(`%c[${area.toUpperCase()}] ${message}`, style);
        }
    }

    function startPlugin() {
        debugLog('info', 'Plugin initialization started');
        
        try {
            document.addEventListener('wheel', handleScrollNavigation, { passive: false });
            debugLog('info', 'Wheel event listener attached successfully');
            
            Lampa.Manifest.plugins['mouse_wheel_nav'] = {
                name: 'Mouse Wheel Navigation',
                version: '1.0',
                description: 'Enables smart mouse wheel scrolling'
            };
            debugLog('info', 'Plugin registered in Lampa.Manifest');
        } catch (error) {
            debugLog('error', 'Failed to initialize plugin', error);
        }
    }

    function handleScrollNavigation(event) {
        event.preventDefault();
        
        const direction = event.deltaY > 0 ? 'down' : 'up';
        debugLog('info', 'Scroll direction detected', {
            direction: direction,
            deltaY: event.deltaY,
            target: event.target
        });
        
        try {
            if (isSettingsOpen()) {
                debugLog('settings', 'Settings panel is active');
                handleSettingsScroll(direction, event);
            } else if (isLeftSidebarActive()) {
                debugLog('sidebar', 'Left sidebar is active');
                handleLeftSidebarScroll(direction, event);
            } else {
                debugLog('main', 'Main content area is active');
                handleMainContentScroll(direction, event);
            }
        } catch (error) {
            debugLog('error', 'Error in scroll handling', error);
        }
    }

    function isSettingsOpen() {
        const isOpen = $('.settings.open').length > 0;
        debugLog('settings', `Settings open state: ${isOpen}`, {
            settingsElements: $('.settings.open').length
        });
        return isOpen;
    }

    function isLeftSidebarActive() {
        const isOpen = $('.menu.open').length > 0;
        const isActive = document.activeElement.closest(SCROLL_AREAS.LEFT_SIDEBAR);
        debugLog('sidebar', 'Sidebar state check', {
            isOpen: isOpen,
            isActive: !!isActive,
            activeElement: document.activeElement
        });
        return isOpen && isActive;
    }

    function handleSettingsScroll(direction, event) {
        const settingsContent = $(SCROLL_AREAS.SETTINGS)[0];
        if (!settingsContent) {
            debugLog('error', 'Settings content element not found');
            return;
        }

        const scrollAmount = 100;
        const currentScroll = settingsContent.scrollTop;
        const newScroll = direction === 'down' ? 
            currentScroll + scrollAmount : 
            currentScroll - scrollAmount;

        debugLog('settings', 'Scrolling settings', {
            currentScroll: currentScroll,
            newScroll: newScroll,
            scrollAmount: scrollAmount
        });

        settingsContent.scrollTo({
            top: newScroll,
            behavior: 'smooth'
        });
    }

    function handleLeftSidebarScroll(direction, event) {
        const sidebarList = $(SCROLL_AREAS.LEFT_SIDEBAR)[0];
        if (!sidebarList) {
            debugLog('error', 'Sidebar list element not found');
            return;
        }

        const currentFocus = $('.menu__item.focus');
        const allItems = $('.menu__item');
        const currentIndex = allItems.index(currentFocus);

        debugLog('sidebar', 'Sidebar navigation state', {
            currentIndex: currentIndex,
            totalItems: allItems.length,
            direction: direction
        });

        if (direction === 'down' && currentIndex < allItems.length - 1) {
            debugLog('sidebar', 'Moving down in sidebar');
            Lampa.Controller.move('down');
        } else if (direction === 'up' && currentIndex > 0) {
            debugLog('sidebar', 'Moving up in sidebar');
            Lampa.Controller.move('up');
        }
    }

    function handleMainContentScroll(direction, event) {
        const mainContent = $(SCROLL_AREAS.MAIN_CONTENT)[0];
        if (!mainContent) {
            debugLog('error', 'Main content element not found');
            return;
        }

        const scrollAmount = 150;
        const currentScroll = mainContent.scrollTop;
        const newScroll = direction === 'down' ? 
            currentScroll + scrollAmount : 
            currentScroll - scrollAmount;

        debugLog('main', 'Scrolling main content', {
            currentScroll: currentScroll,
            newScroll: newScroll,
            scrollAmount: scrollAmount,
            maxScroll: mainContent.scrollHeight - mainContent.clientHeight
        });

        mainContent.scrollTo({
            top: newScroll,
            behavior: 'smooth'
        });
    }

    // Plugin initialization
    if (window.appready) {
        debugLog('info', 'Window already ready, starting plugin immediately');
        startPlugin();
    } else {
        debugLog('info', 'Waiting for app ready event');
        Lampa.Listener.follow('app', function(e) {
            if (e.type == 'ready') {
                debugLog('info', 'App ready event received');
                startPlugin();
            }
        });
    }
})();
