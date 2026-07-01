// AnthologyRX — canonical favicon injection
// Single source of truth for all favicon tags sitewide.
// Update the version string below to bust browser cache when the favicon changes.
(function () {
  var v = '3';
  var tags = [
    '<link rel="icon" type="image/x-icon" href="/favicon.ico?v=' + v + '">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=' + v + '">',
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=' + v + '">',
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=' + v + '">'
  ];
  // Remove any existing favicon/apple-touch-icon links first
  document.querySelectorAll(
    'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
  ).forEach(function (el) { el.parentNode.removeChild(el); });
  // Inject canonical tags into <head>
  tags.forEach(function (html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    document.head.appendChild(tmp.firstChild);
  });
})();
