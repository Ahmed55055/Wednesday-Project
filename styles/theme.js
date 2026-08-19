// Initialize theme on page load to prevent flash-of-wrong-theme
(function() {
    var savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();
