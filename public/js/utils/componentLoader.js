/**
 * Component Loader Script
 * Dynamically loads the header and footer components into the page.
 */

async function loadComponent(elementSelector, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentPath}: ${response.statusText}`);
        }
        const html = await response.text();
        const element = document.querySelector(elementSelector);
        if (element) {
            element.innerHTML = html;
        } else {
            console.warn(`Element with selector "${elementSelector}" not found.`);
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Load Header and Footer
    // Using absolute paths starting from root
    loadComponent('header', '/components/header.html');
    loadComponent('footer', '/components/footer.html');
});
