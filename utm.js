/**
 * UTM + affiliate parameter pass-through
 * Reads inbound query params from the landing URL and appends them
 * to all outbound join.anthologyrx.com CTA links, so creator-driven
 * conversions attribute correctly through to the Bask intake.
 *
 * Tracked params: utm_source, utm_medium, utm_campaign, utm_content,
 *                 utm_term, ref, affiliate, creator
 *
 * TODO(Michael): Confirm with Mason (Bask) that join.anthologyrx.com
 * preserves these parameters end-to-end through to a tracked conversion.
 */
(function () {
  var TRACKED = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','ref','affiliate','creator'];

  function getInboundParams() {
    var params = {};
    var search = window.location.search;
    if (!search) return params;
    search.slice(1).split('&').forEach(function (pair) {
      var kv = pair.split('=');
      var key = decodeURIComponent(kv[0] || '');
      var val = decodeURIComponent(kv[1] || '');
      if (TRACKED.indexOf(key) !== -1 && val) {
        params[key] = val;
      }
    });
    return params;
  }

  function appendParams(url, params) {
    if (!Object.keys(params).length) return url;
    var sep = url.indexOf('?') !== -1 ? '&' : '?';
    var qs = Object.keys(params).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
    return url + sep + qs;
  }

  function wireLinks() {
    var params = getInboundParams();
    if (!Object.keys(params).length) return;
    document.querySelectorAll('a[href*="join.anthologyrx.com"]').forEach(function (el) {
      el.href = appendParams(el.href, params);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireLinks);
  } else {
    wireLinks();
  }
})();

/**
 * GA4 funnel event firing
 * Fires: page_view (automatic via gtag config),
 *        view_product, cta_click, assessment_handoff
 *
 * TODO(Michael): Uncomment gtag calls once GA4_MEASUREMENT_ID is live.
 */
(function () {
  function safeGtag() {
    if (typeof gtag === 'function') {
      gtag.apply(null, arguments);
    }
  }

  function getProductFromUrl(url) {
    var map = {
      'wellness-nad':         'NAD+',
      'wellness-glutathione':  'Glutathione',
      'wellness-lipo-c':       'Lipo-C',
      'wellness-sermorelin':   'Sermorelin',
    };
    for (var key in map) {
      if (url.indexOf(key) !== -1) return map[key];
    }
    return 'unknown';
  }

  function getLocation(el) {
    // Walk up to find a named section
    var section = el.closest('section, header, footer, nav, .hero, .treatments, .sticky-bar');
    return section ? (section.id || section.className.split(' ')[0] || 'page') : 'page';
  }

  document.addEventListener('DOMContentLoaded', function () {
    // view_product: fires when user lands on a treatment page
    var path = window.location.pathname;
    var productMap = {
      '/treatments/nad':         'NAD+',
      '/treatments/glutathione':  'Glutathione',
      '/treatments/lipo-c':       'Lipo-C',
      '/treatments/sermorelin':   'Sermorelin',
    };
    for (var p in productMap) {
      if (path.indexOf(p) === 0) {
        safeGtag('event', 'view_product', { product_name: productMap[p] });
        break;
      }
    }

    // cta_click + assessment_handoff: fires on every join.anthologyrx.com link click
    document.querySelectorAll('a[href*="join.anthologyrx.com"], a[href*="/#treatments"]').forEach(function (el) {
      el.addEventListener('click', function () {
        var href = el.href || '';
        var isHandoff = href.indexOf('join.anthologyrx.com') !== -1;
        var product = getProductFromUrl(href);
        var location = getLocation(el);

        safeGtag('event', 'cta_click', {
          product_name: product,
          cta_location: location,
          destination: href,
        });

        if (isHandoff) {
          safeGtag('event', 'assessment_handoff', {
            product_name: product,
            cta_location: location,
            destination: href,
          });
        }
      });
    });
  });
})();
