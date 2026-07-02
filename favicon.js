// AnthologyRX — canonical favicon injection
// Single source of truth for all favicon tags sitewide.
// Update the version string below to bust browser cache when the favicon changes.
(function () {
  var v = '5';
  // Remove any existing favicon/apple-touch-icon links first
  document.querySelectorAll(
    'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
  ).forEach(function (el) { el.parentNode.removeChild(el); });
  // Inject single canonical favicon
  var link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = '/favicon.png?v=' + v;
  document.head.appendChild(link);
})();
