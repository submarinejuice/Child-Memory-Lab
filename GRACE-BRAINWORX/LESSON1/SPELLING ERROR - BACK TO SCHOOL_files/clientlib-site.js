(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Component = /*#__PURE__*/function () {
  function Component(componentClass) {
    _classCallCheck(this, Component);

    this.componentClass = componentClass;
  }

  _createClass(Component, [{
    key: "exists",
    value: function exists() {
      return !!document.querySelector(".".concat(this.componentClass));
    }
  }]);

  return Component;
}();

exports.Component = Component;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoPlayer = void 0;

var _component = require("../component");

var _videoPlaylist = require("./video-playlist");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var selector = {
  "class": {
    main: 'video-playlist-container',
    videoPlaylistItem: 'video-playlist-item',
    iframe: 'video-iframe',
    audioDescBtn: 'khad-button',
    audioDescBtnContainer: 'khad-container'
  }
};

var VideoPlayer = /*#__PURE__*/function (_Component) {
  _inherits(VideoPlayer, _Component);

  var _super = _createSuper(VideoPlayer);

  function VideoPlayer() {
    _classCallCheck(this, VideoPlayer);

    return _super.call(this, selector["class"].main);
  }

  _createClass(VideoPlayer, [{
    key: "loadPlayer",
    value: function loadPlayer(videoId, videoSource, audioId, videoPlayer) {
      this.setVideoPlayer(videoId, videoSource, videoPlayer);
      this.setAudioDescriptionPlayer(audioId, videoSource, videoPlayer);
      this.loadVideo(videoId, videoSource, videoPlayer);

      if (this.$audioDescBtnContainer != null) {
        this.$audioDescBtnContainer.setAttribute('ad-enabled', 'false');
      } else {
        this.$videoPlayer = videoPlayer;
        this.$audioDescBtnContainer = this.$videoPlayer.querySelector('.khad-container');
        this.$audioDescBtnContainer.setAttribute('ad-enabled', 'false');
      }
    }
  }, {
    key: "setVideoPlayer",
    value: function setVideoPlayer(videoId, videoSource, videoPlayer) {
      if (videoId != null && this.$audioDescBtn != null) {
        this.$audioDescBtn.setAttribute('data-video-id', videoId);
        this.$audioDescBtn.setAttribute('data-video-source', videoSource);
      }

      if (this.$audioDescBtn == null) {
        this.$videoPlayer = videoPlayer;
        this.$audioDescBtn = this.$videoPlayer.querySelector('.khad-button');

        if (videoId != null && this.$audioDescBtn != null) {
          this.$audioDescBtn.setAttribute('data-video-id', videoId);
          this.$audioDescBtn.setAttribute('data-video-source', videoSource);
        }
      }
    }
  }, {
    key: "setAudioDescriptionPlayer",
    value: function setAudioDescriptionPlayer(audioId, videoSource, videoPlayer) {

      if(this.$audioDescBtnContainer == null) {
        this.$videoPlayer = videoPlayer;
        this.$audioDescBtnContainer = this.$videoPlayer.querySelector('.khad-container');
      }

      if (audioId != null) {
        this.$audioDescBtn.setAttribute('style', 'display: block');
        this.$audioDescBtn.setAttribute('data-video-audiodesc', audioId);
        this.$audioDescBtn.setAttribute('data-video-source', videoSource);
        this.$audioDescBtn.setAttribute('data-hasDesc','true');
        this.$audioDescBtnContainer.setAttribute('style','display: block');
      } else {
        this.$audioDescBtnContainer.setAttribute('style','display: none');
        this.$audioDescBtn.setAttribute('style','display: none');
        this.$audioDescBtn.removeAttribute('data-video-audiodesc');
        this.$audioDescBtn.setAttribute('data-hasDesc','false');
      }

      if (this.$audioDescBtn == null) {
        this.$videoPlayer = videoPlayer;
        this.$audioDescBtn = this.$videoPlayer.querySelector('.khad-button');
        this.$audioDescBtnContainer = this.$videoPlayer.querySelector('.khad-container');

        if (audioId != null) {
          this.$audioDescBtnContainer.setAttribute('style', 'display: block');
          this.$audioDescBtn.setAttribute('data-video-audiodesc', audioId);
          this.$audioDescBtn.setAttribute('data-video-source', videoSource);
        } else {
          this.$audioDescBtnContainer.setAttribute('style', 'display: none');
          this.$audioDescBtn.removeAttribute('data-video-audiodesc');
          this.$audioDescBtn.removeAttribute('data-video-source');
        }
      }
    }
  }, {
    key: "loadVideo",
    value: function loadVideo(videoId, videoSource, videoPlayer) {
      if (this.$iframe != null) {
        this.setVideoType(videoId, videoSource);
        $('li[data-video-id="' + videoId + '"]').addClass('currentVideo'); // set current class
      } else {
        this.$videoPlayer = videoPlayer;
        this.$iframe = this.$videoPlayer.querySelector('.video-iframe');
        this.setVideoType(videoId, videoSource);
        $('.video-playlist-item').each(function () {
          $(this).removeClass('currentVideo');
        });
        $('li[data-video-id="' + videoId + '"]').addClass('currentVideo'); // set current class
      }
    }
  }, {
    key: "setVideoType",
    value: function setVideoType(videoId, videoSource) {
      if (videoSource == 'vimeo') {
        var videoUrl = videoId ? "https://player.vimeo.com/video/".concat(videoId) : '';
        this.$iframe.setAttribute('src', videoUrl);
      } else if (videoSource == 'youtube') {
        var _videoUrl = videoId ? "https://www.youtube.com/embed/".concat(videoId) : '';

        this.$iframe.setAttribute('src', _videoUrl);
      } else {
        console.log('Error missing video type');
      }
    }
  }, {
    key: "audioDescSwap",
    value: function audioDescSwap() {
      if (this.$audioDescBtn.hasAttribute('data-video-audiodesc')) {
        var videoId = this.$audioDescBtn.getAttribute('data-video-id');
        ;
        var videoAdId = this.$audioDescBtn.getAttribute('data-video-audiodesc');
        var videoSource = this.$audioDescBtn.getAttribute('data-video-source');

        if (this.$audioDescBtnContainer.getAttribute('ad-enabled') == 'false') {
          this.$audioDescBtnContainer.setAttribute('ad-enabled', 'true');
          this.$audioDescBtn.setAttribute('aria-label', 'Toggle Audio Description. Audio description is on');
          this.loadVideo(videoAdId, videoSource);
        } else {
          videoId = this.$audioDescBtn.getAttribute('data-video-id');
          this.$audioDescBtnContainer.setAttribute('ad-enabled', 'false');
          this.$audioDescBtn.setAttribute('aria-label', 'Toggle Audio Description. Audio description is off');
          this.loadVideo(videoId, videoSource);
        }
      }
    }
  }, {
    key: "initClickListener",
    value: function initClickListener() {
      this.$audioDescBtn.addEventListener('click', this.audioDescSwap.bind(this));
    }
  }, {
    key: "init",
    value: function init($video) {
      var _selector$class = selector["class"],
          main = _selector$class.main,
          videoPlaylistItem = _selector$class.videoPlaylistItem,
          iframe = _selector$class.iframe,
          audioDescBtnContainer = _selector$class.audioDescBtnContainer,
          audioDescBtn = _selector$class.audioDescBtn;
      this.$videoContainer = $video.querySelector(".".concat(main));
      this.$iframe = this.$videoContainer.querySelector(".".concat(iframe));
      this.$audioDescBtnContainer = this.$videoContainer.querySelector(".".concat(audioDescBtnContainer));
      this.$audioDescBtn = this.$audioDescBtnContainer.querySelector(".".concat(audioDescBtn));
      this.initClickListener(); //load first video from the videoPlaylist

      this.$firstVideo = $video.querySelectorAll(".".concat(videoPlaylistItem))[0];
      var videoId = this.$firstVideo.getAttribute('data-video-id');
      var videoSource = this.$firstVideo.getAttribute('data-video-source');
      var audioId = this.$firstVideo.getAttribute('data-video-audiodesc');

      if (audioId == null) {
        this.$audioDescBtn.setAttribute('style', 'display: none');
      }

      this.loadPlayer(videoId, videoSource, audioId);
    }
  }]);

  return VideoPlayer;
}(_component.Component);

exports.VideoPlayer = VideoPlayer;

},{"../component":1,"./video-playlist":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoPlaylist = void 0;

var _component = require("../component");

var _videoPlayer = require("./video-player");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var selector = {
  "class": {
    main: 'video-playlist-container',
    videoPlaylist: 'video-playlist',
    videoPlaylistItem: 'video-playlist-item',
    videoPlayer: 'video-player'
  },
  data: {
    videoId: 'data-video-id',
    videoSource: 'data-video-source',
    audioId: 'data-video-audiodesc'
  }
};

var VideoPlaylist = /*#__PURE__*/function (_Component) {
  _inherits(VideoPlaylist, _Component);

  var _super = _createSuper(VideoPlaylist);

  function VideoPlaylist() {
    _classCallCheck(this, VideoPlaylist);

    return _super.call(this, selector["class"].main);
  }

  _createClass(VideoPlaylist, [{
    key: "loadVideoPlayer",
    value: function loadVideoPlayer(videoId, videoSource, audioId) {
      this.videoPlayer = new _videoPlayer.VideoPlayer();
      this.videoPlayer.loadPlayer(videoId, videoSource, audioId, this.$videoPlayer);
    }
  }, {
    key: "init",
    value: function init($video) {
      var _this = this;

      var _selector$class = selector["class"],
          main = _selector$class.main,
          videoPlaylist = _selector$class.videoPlaylist,
          videoPlaylistItem = _selector$class.videoPlaylistItem,
          videoPlayer = _selector$class.videoPlayer,
          _selector$data = selector.data,
          videoId = _selector$data.videoId,
          videoSource = _selector$data.videoSource,
          audioId = _selector$data.audioId;
      this.videoPlayer = new _videoPlayer.VideoPlayer();
      this.$video = $video;
      this.$mainVideoPlaylist = $video.querySelector(".".concat(main));
      this.$videoList = this.$video.querySelector(".".concat(videoPlaylist));
      this.$videoPlayer = this.$mainVideoPlaylist.querySelector(".".concat(videoPlayer));
      this.$videos = Array.prototype.slice.call(this.$videoList.querySelectorAll(".".concat(videoPlaylistItem)));

      if (this.$videos.length == 1) {
        this.$videoList.setAttribute('style', 'display: none');
        this.$videoPlayer.setAttribute('style', 'width: 100%');
      }

      this.videosMeta = this.$videos.map(function ($videoPlaylistItem) {
        return {
          $video: $videoPlaylistItem,
          videoId: $videoPlaylistItem.getAttribute(videoId),
          videoSource: $videoPlaylistItem.getAttribute(videoSource),
          audioId: $videoPlaylistItem.getAttribute(audioId)
        };
      });
      this.videosMeta.forEach(function (_ref) {
        var $video = _ref.$video,
            videoId = _ref.videoId,
            videoSource = _ref.videoSource,
            audioId = _ref.audioId;
        return $video.addEventListener('click', _this.loadVideoPlayer.bind(_this, videoId, videoSource, audioId));
      });
    }
  }]);

  return VideoPlaylist;
}(_component.Component);

exports.VideoPlaylist = VideoPlaylist;

},{"../component":1,"./video-player":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Video = void 0;

var _component = require("../component");

var _videoPlaylist = require("./video-playlist");

var _videoPlayer = require("./video-player");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var selector = {
  "class": {
    video: 'videoPlaylist',
    videoPlaylist: 'video-playlist'
  }
};

var Video = /*#__PURE__*/function (_Component) {
  _inherits(Video, _Component);

  var _super = _createSuper(Video);

  function Video() {
    var _this;

    _classCallCheck(this, Video);

    _this = _super.call(this, selector["class"].video);
    var _selector$class = selector["class"],
        video = _selector$class.video,
        videoPlaylist = _selector$class.videoPlaylist;
    return _this;
  }

  _createClass(Video, [{
    key: "setVideoPlaylist",
    value: function setVideoPlaylist() {
      var _this2 = this;

      this.$videos.forEach(function (video) {
        _this2.videoPlayer = new _videoPlayer.VideoPlayer();

        _this2.videoPlayer.init(video);

        _this2.videoPlaylist = new _videoPlaylist.VideoPlaylist();

        _this2.videoPlaylist.init(video);
      });
    }
  }, {
    key: "init",
    value: function init() {
      this.$videos = Array.prototype.slice.call(document.querySelectorAll(".".concat(selector["class"].video)));
      this.setVideoPlaylist();
    }
  }]);

  return Video;
}(_component.Component);

exports.Video = Video;

},{"../component":1,"./video-player":2,"./video-playlist":3}],5:[function(require,module,exports){
"use strict";

var _video = require("./components/content/video");

var video = new _video.Video();
if (video.exists()) video.init(); // Remove pre load js class after js initialization

var $body = document.querySelector('body');
$body.classList.remove('loading');

},{"./components/content/video":4}]},{},[5])
// this
