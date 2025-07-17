function upfLoadScript(e, t) {
  if (document.getElementById('_upf_sdk')) {
    return;
  }
  var n = document.createElement('script');
  n.id = '_upf_sdk';
  return (
    (n.type = 'text/javascript'),
    (n.async = 0),
    (n.defer = 0),
    n.readyState
      ? (n.onreadystatechange = function () {
          ('loaded' == n.readyState || 'complete' == n.readyState) &&
            ((n.onreadystatechange = null), t());
        })
      : (n.onload = function () {
          'undefined' != typeof t && t();
        }),
    (n.src = e),
    document.getElementsByTagName('head')[0].appendChild(n),
    n
  );
}

window._upf = (function () {
  var queue = [];
  var pQueue = [];

  upfLoadScript(
    'https://spn.so/js/v1/app-4abab44a-0c1e-49d2-bf54-8bb87df9346d.js?' + Math.floor(100 * Math.random()),
    function () {
      // Send stacked events
      window._upfSDK.push(...queue.splice(0));
      pQueue.forEach((ph) => {
        ph.resolve(window._upfSDK.appendVisitorUUID(ph.url));
      });
    }
  );

  return {
    push: function (...events) {
      if (window._upfSDK) {
        window._upfSDK.push(...events);
      } else {
        queue.push(...events);
      }
    },
    appendVisitorUUID: function (url) {
      if (window._upfSDK) {
        return Promise.resolve(window._upfSDK.appendVisitorUUID(url));
      }

      return new Promise((resolve) => {
        pQueue.push({ resolve: resolve, url: url });
      });
    },
  };
})();
