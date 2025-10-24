// Shared Components Loader
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Failed to load component ${componentPath}:`, error);
    }
}

// Load shared CSS
function loadSharedCSS() {
    if (!document.querySelector('link[href="css/shared-components.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/shared-components.css';
        document.head.appendChild(link);
    }
}

// Wrap main content for proper layout
function wrapMainContent() {
    // Get all elements between header and footer
    const header = document.getElementById('header-placeholder');
    const footer = document.getElementById('footer-placeholder');
    
    if (header && footer) {
        const mainContent = [];
        let currentElement = header.nextElementSibling;
        
        while (currentElement && currentElement !== footer) {
            if (currentElement.tagName !== 'SCRIPT' && currentElement.tagName !== 'LINK') {
                mainContent.push(currentElement);
            }
            currentElement = currentElement.nextElementSibling;
        }
        
        // Only wrap if not already wrapped
        if (mainContent.length > 0 && !document.querySelector('.main-content-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'main-content-wrapper';
            
            // Insert wrapper after header
            header.after(wrapper);
            
            // Move all main content into wrapper
            mainContent.forEach(element => {
                if (element.parentNode) {
                    wrapper.appendChild(element);
                }
            });
        }
    }
}

// Load header and footer components
async function loadSharedComponents() {
    loadSharedCSS();
    await loadComponent('header-placeholder', 'components/header.html');
    await loadComponent('footer-placeholder', 'components/footer.html');
    
    // Wrap content after components are loaded
    setTimeout(wrapMainContent, 100);
}

// Initialize shared components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadSharedComponents();
});

// Helper function to set active navigation (to be called from individual pages)
function setActiveNavigation(activeId) {
    // Wait for header to load, then set active nav
    setTimeout(() => {
        setActiveNav(activeId);
    }, 100);
}