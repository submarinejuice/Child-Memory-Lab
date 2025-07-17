window._upfSDK = (function () {
  const _UPF_TRACKER_UUID = '4abab44a-0c1e-49d2-bf54-8bb87df9346d';
  const _UPF_VISITOR = '_upf_visitor';
  const _UPF_FINGERPRINT = '_upf_fingerprint';
  const _UPF_CONFIDENCE_THRESHOLD = 0.6;

  function _upfStorageAvailable() {
    try {
      localStorage.setItem('_test', 'test');
      localStorage.removeItem('_test');
      return true;
    } catch (e) {
      return false;
    }
  }

  var storage = (function () {
    if (_upfStorageAvailable()) {
      return localStorage;
    }

    const data = {};

    return {
      setItem: (k, v) => (data[k] = v),
      getItem: (k) => data[k],
    };
  })();

  function _getProperty(prop) {
    var data = storage.getItem(prop) || '';

    if (data[0] === '{') {
      decoded = JSON.parse(data);

      return decoded.value || '';
    }

    return '';
  }

  function _setProperty(prop, value) {
    storage.setItem(prop, JSON.stringify({ value: value, at: Date.now() }));
  }

  function _upfEventsFormatter(events) {
    var formatted = [];

    events.forEach((e) => {
      formatted.push({
        event_type: e[0],
        data: e[1],
      });
    });

    return formatted;
  }

  function _generateHash(visitorUUID) {
    if (crypto && (!visitorUUID || visitorUUID === '')) {
      return crypto.randomUUID();
    }

    return visitorUUID;
  }

  function _getVisitorUUID(searchParams) {
    var visitorUUID = _getProperty(_UPF_VISITOR);

    if (visitorUUID === '') {
      visitorUUID = searchParams.getAll(_UPF_VISITOR)[0] || '';
    }

    // Store only if defined
    if (visitorUUID !== '') {
      _setProperty(_UPF_VISITOR, visitorUUID);
    }

    return visitorUUID;
  }

  function _generateFingerprint(visitorUUID, cb) {
    var uuid = '';
    var fcache = _getProperty(_UPF_FINGERPRINT);

    // invalidate low confidence uuid
    if (fcache.confidence && fcache.confidence > _UPF_CONFIDENCE_THRESHOLD) {
      uuid = fcache.uuid;
    }

    return new Promise((resolve) => {
      if (uuid !== '') {
        resolve();
        return;
      }

      var uuidConfidence = 0;

      import('https://openfpcdn.io/fingerprintjs/v3')
        .then((FingerprintJS) => FingerprintJS.load())
        .then((fp) => fp.get())
        .then((result) => {
          fingerprintConfidence = result.confidence.score;

          if (result.confidence.score > _UPF_CONFIDENCE_THRESHOLD) {
            uuidConfidence = result.confidence.score;
            uuid = result.visitorId;
          }
        })
        .catch(() => {
          /* silent */
        })
        .finally(() => {
          if (uuid === '') {
            uuidConfidence = 1;
            uuid = _generateHash(visitorUUID);
          }

          _setProperty(_UPF_FINGERPRINT, {
            uuid: uuid,
            confidence: uuidConfidence,
          });
          resolve();
        });
    }).finally(() => {
      cb(uuid);
    });
  }

  function _updateLinks(visitorUUID) {
    if (visitorUUID === '') {
      return;
    }

    document
      .querySelectorAll('a[data-upfluence-tracking="forward"]')
      .forEach((el) => {
        el.setAttribute('href', _appendVisitorUUID(el.href, visitorUUID));
      });
  }

  function _appendVisitorUUID(url, visitorUUID) {
    try {
      // use location href to handle related path
      url = new URL(url, window.location.href);
      url.searchParams.set(_UPF_VISITOR, visitorUUID);

      return url.toString();
    } catch {
      return url;
    }
  }

  // tempory events queue
  var isReady = false;
  var queue = [];
  var searchParams = new URLSearchParams(window.location.search);
  var visitorUUID = _getVisitorUUID(searchParams);
  var linkFollow = parseInt(searchParams.getAll('_upf_link')[0]);
  var visitorFingerprint = '';
  var fingerprintConfidence;

  if (linkFollow) {
    queue.push(['link_follow', { link_id: linkFollow }]);
  }

  // user extra metadata
  const metadata = {
    user_agent: navigator.userAgent,
    language: navigator.language,
  };

  if (navigator.userAgentData) {
    metadata.mobile = navigator.userAgentData.mobile;
    metadata.plateform = navigator.userAgentData.plateform;
  }

  const sendEvents = function (...events) {
    // ensure that stacked events are sent
    if (queue.length > 0) {
      events.push(...queue.splice(0));
    }

    if (events.length === 0) {
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    if (visitorFingerprint !== '') {
      headers['X-UPF-Fingerprint'] = visitorFingerprint;
    }

    if (visitorUUID !== '') {
      headers['X-UPF-VisitorUUID'] = visitorUUID;
    }

    if (fingerprintConfidence) {
      headers['X-UPF-Confidence'] = fingerprintConfidence;
    }

    fetch('https://spn.so/events/' + _UPF_TRACKER_UUID, {
      method: 'POST',
      headers: headers,
      // send cookies
      credentials: 'include',
      // encode the payload ?
      body: JSON.stringify({
        events: _upfEventsFormatter(events),
        metadata: metadata,
        ts: Math.floor(Date.now() / 1000),
      }),
    });
  };

  _generateFingerprint(visitorUUID, (uuid) => {
    visitorFingerprint = uuid;
    isReady = true;
    sendEvents();
    _updateLinks(visitorUUID);
  });

  return {
    push: function (...events) {
      if (events.length === 0) {
        return;
      }

      if (isReady) {
        sendEvents(...events);
      } else {
        queue.push(...events);
      }
    },
    appendVisitorUUID: function (url) {
      if (visitorUUID.trim() === '') {
        return url;
      }

      return _appendVisitorUUID(url, visitorUUID);
    },
  };
})();
