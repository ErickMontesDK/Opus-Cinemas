function loadComponent(file, elementId) {
    if (!elementId) return
    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Could not load ${file}`);
            return response.text();
        })
        .then(data => {
            const element = document.querySelector(elementId);
            if (element) {
                element.innerHTML = data;
                // Since user might need bootstrap functionality on the loaded header:
                // We don't need to re-initialize bootstrap usually as long as the scripts are already charged in the main page.
            }
        })
        .catch(error => console.error(`Error loading component: ${error}`));
}

document.addEventListener("DOMContentLoaded", function () {
    loadComponent('/components/header.html', 'header');
    loadComponent('/components/footer.html', '.main-footer');
    // Note: Some pages use <footer> tag directly, others might use class .main-footer
    // We should be robust.
    const footerTag = document.querySelector('footer');
    if (footerTag && footerTag.childNodes.length <= 1) { // Load if empty
        loadComponent('/components/footer.html', 'footer');
    }
});
