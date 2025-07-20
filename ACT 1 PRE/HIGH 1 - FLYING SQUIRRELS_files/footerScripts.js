/*!
 * Glide.js v3.6.0
 * (c) 2013-2022 Jędrzej Chałubek (https://github.com/jedrzejchalubek/)
 * Released under the MIT License.
 */
!function (t, e) { "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).Glide = e() }(this, (function () { "use strict"; function t(e) { return t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t }, t(e) } function e(t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") } function n(t, e) { for (var n = 0; n < e.length; n++) { var i = e[n]; i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i) } } function i(t, e, i) { return e && n(t.prototype, e), i && n(t, i), t } function r(t) { return r = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) { return t.__proto__ || Object.getPrototypeOf(t) }, r(t) } function o(t, e) { return o = Object.setPrototypeOf || function (t, e) { return t.__proto__ = e, t }, o(t, e) } function s(t, e) { if (e && ("object" == typeof e || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return function (t) { if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return t }(t) } function a(t) { var e = function () { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }))), !0 } catch (t) { return !1 } }(); return function () { var n, i = r(t); if (e) { var o = r(this).constructor; n = Reflect.construct(i, arguments, o) } else n = i.apply(this, arguments); return s(this, n) } } function u(t, e) { for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = r(t));); return t } function c() { return c = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) { var i = u(t, e); if (i) { var r = Object.getOwnPropertyDescriptor(i, e); return r.get ? r.get.call(arguments.length < 3 ? t : n) : r.value } }, c.apply(this, arguments) } var l = { type: "slider", startAt: 0, perView: 1, focusAt: 0, gap: 10, autoplay: !1, hoverpause: !0, keyboard: !0, bound: !1, swipeThreshold: 80, dragThreshold: 120, perSwipe: "", touchRatio: .5, touchAngle: 45, animationDuration: 400, rewind: !0, rewindDuration: 800, animationTimingFunc: "cubic-bezier(.165, .840, .440, 1)", waitForTransition: !0, throttle: 10, direction: "ltr", peek: 0, cloningRatio: 1, breakpoints: {}, classes: { swipeable: "glide--swipeable", dragging: "glide--dragging", direction: { ltr: "glide--ltr", rtl: "glide--rtl" }, type: { slider: "glide--slider", carousel: "glide--carousel" }, slide: { clone: "glide__slide--clone", active: "glide__slide--active" }, arrow: { disabled: "glide__arrow--disabled" }, nav: { active: "glide__bullet--active" } } }; function f(t) { console.error("[Glide warn]: ".concat(t)) } function d(t) { return parseInt(t) } function h(t) { return "string" == typeof t } function v(e) { var n = t(e); return "function" === n || "object" === n && !!e } function p(t) { return "function" == typeof t } function m(t) { return void 0 === t } function g(t) { return t.constructor === Array } function y(t, e, n) { var i = {}; for (var r in e) p(e[r]) ? i[r] = e[r](t, i, n) : f("Extension must be a function"); for (var o in i) p(i[o].mount) && i[o].mount(); return i } function b(t, e, n) { Object.defineProperty(t, e, n) } function w(t, e) { var n = Object.assign({}, t, e); return e.hasOwnProperty("classes") && (n.classes = Object.assign({}, t.classes, e.classes), e.classes.hasOwnProperty("direction") && (n.classes.direction = Object.assign({}, t.classes.direction, e.classes.direction)), e.classes.hasOwnProperty("type") && (n.classes.type = Object.assign({}, t.classes.type, e.classes.type)), e.classes.hasOwnProperty("slide") && (n.classes.slide = Object.assign({}, t.classes.slide, e.classes.slide)), e.classes.hasOwnProperty("arrow") && (n.classes.arrow = Object.assign({}, t.classes.arrow, e.classes.arrow)), e.classes.hasOwnProperty("nav") && (n.classes.nav = Object.assign({}, t.classes.nav, e.classes.nav))), e.hasOwnProperty("breakpoints") && (n.breakpoints = Object.assign({}, t.breakpoints, e.breakpoints)), n } var _ = function () { function t() { var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; e(this, t), this.events = n, this.hop = n.hasOwnProperty } return i(t, [{ key: "on", value: function (t, e) { if (!g(t)) { this.hop.call(this.events, t) || (this.events[t] = []); var n = this.events[t].push(e) - 1; return { remove: function () { delete this.events[t][n] } } } for (var i = 0; i < t.length; i++)this.on(t[i], e) } }, { key: "emit", value: function (t, e) { if (g(t)) for (var n = 0; n < t.length; n++)this.emit(t[n], e); else this.hop.call(this.events, t) && this.events[t].forEach((function (t) { t(e || {}) })) } }]), t }(), k = function () { function t(n) { var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; e(this, t), this._c = {}, this._t = [], this._e = new _, this.disabled = !1, this.selector = n, this.settings = w(l, i), this.index = this.settings.startAt } return i(t, [{ key: "mount", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; return this._e.emit("mount.before"), v(t) ? this._c = y(this, t, this._e) : f("You need to provide a object on `mount()`"), this._e.emit("mount.after"), this } }, { key: "mutate", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : []; return g(t) ? this._t = t : f("You need to provide a array on `mutate()`"), this } }, { key: "update", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; return this.settings = w(this.settings, t), t.hasOwnProperty("startAt") && (this.index = t.startAt), this._e.emit("update"), this } }, { key: "go", value: function (t) { return this._c.Run.make(t), this } }, { key: "move", value: function (t) { return this._c.Transition.disable(), this._c.Move.make(t), this } }, { key: "destroy", value: function () { return this._e.emit("destroy"), this } }, { key: "play", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0]; return t && (this.settings.autoplay = t), this._e.emit("play"), this } }, { key: "pause", value: function () { return this._e.emit("pause"), this } }, { key: "disable", value: function () { return this.disabled = !0, this } }, { key: "enable", value: function () { return this.disabled = !1, this } }, { key: "on", value: function (t, e) { return this._e.on(t, e), this } }, { key: "isType", value: function (t) { return this.settings.type === t } }, { key: "settings", get: function () { return this._o }, set: function (t) { v(t) ? this._o = t : f("Options must be an `object` instance.") } }, { key: "index", get: function () { return this._i }, set: function (t) { this._i = d(t) } }, { key: "type", get: function () { return this.settings.type } }, { key: "disabled", get: function () { return this._d }, set: function (t) { this._d = !!t } }]), t }(); function S() { return (new Date).getTime() } function H(t, e, n) { var i, r, o, s, a = 0; n || (n = {}); var u = function () { a = !1 === n.leading ? 0 : S(), i = null, s = t.apply(r, o), i || (r = o = null) }, c = function () { var c = S(); a || !1 !== n.leading || (a = c); var l = e - (c - a); return r = this, o = arguments, l <= 0 || l > e ? (i && (clearTimeout(i), i = null), a = c, s = t.apply(r, o), i || (r = o = null)) : i || !1 === n.trailing || (i = setTimeout(u, l)), s }; return c.cancel = function () { clearTimeout(i), a = 0, i = r = o = null }, c } var O = { ltr: ["marginLeft", "marginRight"], rtl: ["marginRight", "marginLeft"] }; function T(t) { if (t && t.parentNode) { for (var e = t.parentNode.firstChild, n = []; e; e = e.nextSibling)1 === e.nodeType && e !== t && n.push(e); return n } return [] } function x(t) { return !!(t && t instanceof window.HTMLElement) } function A(t) { return Array.prototype.slice.call(t) } var j = '[data-glide-el="track"]'; var R = function () { function t() { var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; e(this, t), this.listeners = n } return i(t, [{ key: "on", value: function (t, e, n) { var i = arguments.length > 3 && void 0 !== arguments[3] && arguments[3]; h(t) && (t = [t]); for (var r = 0; r < t.length; r++)this.listeners[t[r]] = n, e.addEventListener(t[r], this.listeners[t[r]], i) } }, { key: "off", value: function (t, e) { var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2]; h(t) && (t = [t]); for (var i = 0; i < t.length; i++)e.removeEventListener(t[i], this.listeners[t[i]], n) } }, { key: "destroy", value: function () { delete this.listeners } }]), t }(); var P = ["ltr", "rtl"], C = { ">": "<", "<": ">", "=": "=" }; function L(t, e) { return { modify: function (t) { return e.Direction.is("rtl") ? -t : t } } } function M(t, e) { return { modify: function (t) { var n = Math.floor(t / e.Sizes.slideWidth); return t + e.Gaps.value * n } } } function z(t, e) { return { modify: function (t) { return t + e.Clones.grow / 2 } } } function E(t, e) { return { modify: function (n) { if (t.settings.focusAt >= 0) { var i = e.Peek.value; return v(i) ? n - i.before : n - i } return n } } } function D(t, e) { return { modify: function (n) { var i = e.Gaps.value, r = e.Sizes.width, o = t.settings.focusAt, s = e.Sizes.slideWidth; return "center" === o ? n - (r / 2 - s / 2) : n - s * o - i * o } } } var B = !1; try { var W = Object.defineProperty({}, "passive", { get: function () { B = !0 } }); window.addEventListener("testPassive", null, W), window.removeEventListener("testPassive", null, W) } catch (t) { } var q = B, I = ["touchstart", "mousedown"], V = ["touchmove", "mousemove"], G = ["touchend", "touchcancel", "mouseup", "mouseleave"], F = ["mousedown", "mousemove", "mouseup", "mouseleave"]; var N = '[data-glide-el^="controls"]', Y = "".concat(N, ' [data-glide-dir*="<"]'), X = "".concat(N, ' [data-glide-dir*=">"]'); function K(t) { return v(t) ? (e = t, Object.keys(e).sort().reduce((function (t, n) { return t[n] = e[n], t[n], t }), {})) : (f("Breakpoints option must be an object"), {}); var e } var J = { Html: function (t, e, n) { var i = { mount: function () { this.root = t.selector, this.track = this.root.querySelector(j), this.collectSlides() }, collectSlides: function () { this.slides = A(this.wrapper.children).filter((function (e) { return !e.classList.contains(t.settings.classes.slide.clone) })) } }; return b(i, "root", { get: function () { return i._r }, set: function (t) { h(t) && (t = document.querySelector(t)), x(t) ? i._r = t : f("Root element must be a existing Html node") } }), b(i, "track", { get: function () { return i._t }, set: function (t) { x(t) ? i._t = t : f("Could not find track element. Please use ".concat(j, " attribute.")) } }), b(i, "wrapper", { get: function () { return i.track.children[0] } }), n.on("update", (function () { i.collectSlides() })), i }, Translate: function (t, e, n) { var i = { set: function (n) { var i = function (t, e, n) { var i = [M, z, E, D].concat(t._t, [L]); return { mutate: function (r) { for (var o = 0; o < i.length; o++) { var s = i[o]; p(s) && p(s().modify) ? r = s(t, e, n).modify(r) : f("Transformer should be a function that returns an object with `modify()` method") } return r } } }(t, e).mutate(n), r = "translate3d(".concat(-1 * i, "px, 0px, 0px)"); e.Html.wrapper.style.mozTransform = r, e.Html.wrapper.style.webkitTransform = r, e.Html.wrapper.style.transform = r }, remove: function () { e.Html.wrapper.style.transform = "" }, getStartIndex: function () { var n = e.Sizes.length, i = t.index, r = t.settings.perView; return e.Run.isOffset(">") || e.Run.isOffset("|>") ? n + (i - r) : (i + r) % n }, getTravelDistance: function () { var n = e.Sizes.slideWidth * t.settings.perView; return e.Run.isOffset(">") || e.Run.isOffset("|>") ? -1 * n : n } }; return n.on("move", (function (r) { if (!t.isType("carousel") || !e.Run.isOffset()) return i.set(r.movement); e.Transition.after((function () { n.emit("translate.jump"), i.set(e.Sizes.slideWidth * t.index) })); var o = e.Sizes.slideWidth * e.Translate.getStartIndex(); return i.set(o - e.Translate.getTravelDistance()) })), n.on("destroy", (function () { i.remove() })), i }, Transition: function (t, e, n) { var i = !1, r = { compose: function (e) { var n = t.settings; return i ? "".concat(e, " 0ms ").concat(n.animationTimingFunc) : "".concat(e, " ").concat(this.duration, "ms ").concat(n.animationTimingFunc) }, set: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "transform"; e.Html.wrapper.style.transition = this.compose(t) }, remove: function () { e.Html.wrapper.style.transition = "" }, after: function (t) { setTimeout((function () { t() }), this.duration) }, enable: function () { i = !1, this.set() }, disable: function () { i = !0, this.set() } }; return b(r, "duration", { get: function () { var n = t.settings; return t.isType("slider") && e.Run.offset ? n.rewindDuration : n.animationDuration } }), n.on("move", (function () { r.set() })), n.on(["build.before", "resize", "translate.jump"], (function () { r.disable() })), n.on("run", (function () { r.enable() })), n.on("destroy", (function () { r.remove() })), r }, Direction: function (t, e, n) { var i = { mount: function () { this.value = t.settings.direction }, resolve: function (t) { var e = t.slice(0, 1); return this.is("rtl") ? t.split(e).join(C[e]) : t }, is: function (t) { return this.value === t }, addClass: function () { e.Html.root.classList.add(t.settings.classes.direction[this.value]) }, removeClass: function () { e.Html.root.classList.remove(t.settings.classes.direction[this.value]) } }; return b(i, "value", { get: function () { return i._v }, set: function (t) { P.indexOf(t) > -1 ? i._v = t : f("Direction value must be `ltr` or `rtl`") } }), n.on(["destroy", "update"], (function () { i.removeClass() })), n.on("update", (function () { i.mount() })), n.on(["build.before", "update"], (function () { i.addClass() })), i }, Peek: function (t, e, n) { var i = { mount: function () { this.value = t.settings.peek } }; return b(i, "value", { get: function () { return i._v }, set: function (t) { v(t) ? (t.before = d(t.before), t.after = d(t.after)) : t = d(t), i._v = t } }), b(i, "reductor", { get: function () { var e = i.value, n = t.settings.perView; return v(e) ? e.before / n + e.after / n : 2 * e / n } }), n.on(["resize", "update"], (function () { i.mount() })), i }, Sizes: function (t, e, n) { var i = { setupSlides: function () { for (var t = "".concat(this.slideWidth, "px"), n = e.Html.slides, i = 0; i < n.length; i++)n[i].style.width = t }, setupWrapper: function () { e.Html.wrapper.style.width = "".concat(this.wrapperSize, "px") }, remove: function () { for (var t = e.Html.slides, n = 0; n < t.length; n++)t[n].style.width = ""; e.Html.wrapper.style.width = "" } }; return b(i, "length", { get: function () { return e.Html.slides.length } }), b(i, "width", { get: function () { return e.Html.track.offsetWidth } }), b(i, "wrapperSize", { get: function () { return i.slideWidth * i.length + e.Gaps.grow + e.Clones.grow } }), b(i, "slideWidth", { get: function () { return i.width / t.settings.perView - e.Peek.reductor - e.Gaps.reductor } }), n.on(["build.before", "resize", "update"], (function () { i.setupSlides(), i.setupWrapper() })), n.on("destroy", (function () { i.remove() })), i }, Gaps: function (t, e, n) { var i = { apply: function (t) { for (var n = 0, i = t.length; n < i; n++) { var r = t[n].style, o = e.Direction.value; r[O[o][0]] = 0 !== n ? "".concat(this.value / 2, "px") : "", n !== t.length - 1 ? r[O[o][1]] = "".concat(this.value / 2, "px") : r[O[o][1]] = "" } }, remove: function (t) { for (var e = 0, n = t.length; e < n; e++) { var i = t[e].style; i.marginLeft = "", i.marginRight = "" } } }; return b(i, "value", { get: function () { return d(t.settings.gap) } }), b(i, "grow", { get: function () { return i.value * e.Sizes.length } }), b(i, "reductor", { get: function () { var e = t.settings.perView; return i.value * (e - 1) / e } }), n.on(["build.after", "update"], H((function () { i.apply(e.Html.wrapper.children) }), 30)), n.on("destroy", (function () { i.remove(e.Html.wrapper.children) })), i }, Move: function (t, e, n) { var i = { mount: function () { this._o = 0 }, make: function () { var t = this, i = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0; this.offset = i, n.emit("move", { movement: this.value }), e.Transition.after((function () { n.emit("move.after", { movement: t.value }) })) } }; return b(i, "offset", { get: function () { return i._o }, set: function (t) { i._o = m(t) ? 0 : d(t) } }), b(i, "translate", { get: function () { return e.Sizes.slideWidth * t.index } }), b(i, "value", { get: function () { var t = this.offset, n = this.translate; return e.Direction.is("rtl") ? n + t : n - t } }), n.on(["build.before", "run"], (function () { i.make() })), i }, Clones: function (t, e, n) { var i = { mount: function () { this.items = [], t.isType("carousel") && (this.items = this.collect()) }, collect: function () { var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], i = e.Html.slides, r = t.settings, o = r.perView, s = r.classes, a = r.cloningRatio; if (0 !== i.length) for (var u = +!!t.settings.peek, c = o + u + Math.round(o / 2), l = i.slice(0, c).reverse(), f = i.slice(-1 * c), d = 0; d < Math.max(a, Math.floor(o / i.length)); d++) { for (var h = 0; h < l.length; h++) { var v = l[h].cloneNode(!0); v.classList.add(s.slide.clone), n.push(v) } for (var p = 0; p < f.length; p++) { var m = f[p].cloneNode(!0); m.classList.add(s.slide.clone), n.unshift(m) } } return n }, append: function () { for (var t = this.items, n = e.Html, i = n.wrapper, r = n.slides, o = Math.floor(t.length / 2), s = t.slice(0, o).reverse(), a = t.slice(-1 * o).reverse(), u = "".concat(e.Sizes.slideWidth, "px"), c = 0; c < a.length; c++)i.appendChild(a[c]); for (var l = 0; l < s.length; l++)i.insertBefore(s[l], r[0]); for (var f = 0; f < t.length; f++)t[f].style.width = u }, remove: function () { for (var t = this.items, n = 0; n < t.length; n++)e.Html.wrapper.removeChild(t[n]) } }; return b(i, "grow", { get: function () { return (e.Sizes.slideWidth + e.Gaps.value) * i.items.length } }), n.on("update", (function () { i.remove(), i.mount(), i.append() })), n.on("build.before", (function () { t.isType("carousel") && i.append() })), n.on("destroy", (function () { i.remove() })), i }, Resize: function (t, e, n) { var i = new R, r = { mount: function () { this.bind() }, bind: function () { i.on("resize", window, H((function () { n.emit("resize") }), t.settings.throttle)) }, unbind: function () { i.off("resize", window) } }; return n.on("destroy", (function () { r.unbind(), i.destroy() })), r }, Build: function (t, e, n) { var i = { mount: function () { n.emit("build.before"), this.typeClass(), this.activeClass(), n.emit("build.after") }, typeClass: function () { e.Html.root.classList.add(t.settings.classes.type[t.settings.type]) }, activeClass: function () { var n = t.settings.classes, i = e.Html.slides[t.index]; i && (i.classList.add(n.slide.active), T(i).forEach((function (t) { t.classList.remove(n.slide.active) }))) }, removeClasses: function () { var n = t.settings.classes, i = n.type, r = n.slide; e.Html.root.classList.remove(i[t.settings.type]), e.Html.slides.forEach((function (t) { t.classList.remove(r.active) })) } }; return n.on(["destroy", "update"], (function () { i.removeClasses() })), n.on(["resize", "update"], (function () { i.mount() })), n.on("move.after", (function () { i.activeClass() })), i }, Run: function (t, e, n) { var i = { mount: function () { this._o = !1 }, make: function (i) { var r = this; t.disabled || (!t.settings.waitForTransition || t.disable(), this.move = i, n.emit("run.before", this.move), this.calculate(), n.emit("run", this.move), e.Transition.after((function () { r.isStart() && n.emit("run.start", r.move), r.isEnd() && n.emit("run.end", r.move), r.isOffset() && (r._o = !1, n.emit("run.offset", r.move)), n.emit("run.after", r.move), t.enable() }))) }, calculate: function () { var e = this.move, n = this.length, r = e.steps, o = e.direction, s = 1; if ("=" === o) return t.settings.bound && d(r) > n ? void (t.index = n) : void (t.index = r); if (">" !== o || ">" !== r) if ("<" !== o || "<" !== r) { if ("|" === o && (s = t.settings.perView || 1), ">" === o || "|" === o && ">" === r) { var a = function (e) { var n = t.index; if (t.isType("carousel")) return n + e; return n + (e - n % e) }(s); return a > n && (this._o = !0), void (t.index = function (e, n) { var r = i.length; if (e <= r) return e; if (t.isType("carousel")) return e - (r + 1); if (t.settings.rewind) return i.isBound() && !i.isEnd() ? r : 0; if (i.isBound()) return r; return Math.floor(r / n) * n }(a, s)) } if ("<" === o || "|" === o && "<" === r) { var u = function (e) { var n = t.index; if (t.isType("carousel")) return n - e; return (Math.ceil(n / e) - 1) * e }(s); return u < 0 && (this._o = !0), void (t.index = function (e, n) { var r = i.length; if (e >= 0) return e; if (t.isType("carousel")) return e + (r + 1); if (t.settings.rewind) return i.isBound() && i.isStart() ? r : Math.floor(r / n) * n; return 0 }(u, s)) } f("Invalid direction pattern [".concat(o).concat(r, "] has been used")) } else t.index = 0; else t.index = n }, isStart: function () { return t.index <= 0 }, isEnd: function () { return t.index >= this.length }, isOffset: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0; return t ? !!this._o && ("|>" === t ? "|" === this.move.direction && ">" === this.move.steps : "|<" === t ? "|" === this.move.direction && "<" === this.move.steps : this.move.direction === t) : this._o }, isBound: function () { return t.isType("slider") && "center" !== t.settings.focusAt && t.settings.bound } }; return b(i, "move", { get: function () { return this._m }, set: function (t) { var e = t.substr(1); this._m = { direction: t.substr(0, 1), steps: e ? d(e) ? d(e) : e : 0 } } }), b(i, "length", { get: function () { var n = t.settings, i = e.Html.slides.length; return this.isBound() ? i - 1 - (d(n.perView) - 1) + d(n.focusAt) : i - 1 } }), b(i, "offset", { get: function () { return this._o } }), i }, Swipe: function (t, e, n) { var i = new R, r = 0, o = 0, s = 0, a = !1, u = !!q && { passive: !0 }, c = { mount: function () { this.bindSwipeStart() }, start: function (e) { if (!a && !t.disabled) { this.disable(); var i = this.touches(e); r = null, o = d(i.pageX), s = d(i.pageY), this.bindSwipeMove(), this.bindSwipeEnd(), n.emit("swipe.start") } }, move: function (i) { if (!t.disabled) { var a = t.settings, u = a.touchAngle, c = a.touchRatio, l = a.classes, f = this.touches(i), h = d(f.pageX) - o, v = d(f.pageY) - s, p = Math.abs(h << 2), m = Math.abs(v << 2), g = Math.sqrt(p + m), y = Math.sqrt(m); if (!(180 * (r = Math.asin(y / g)) / Math.PI < u)) return !1; i.stopPropagation(), e.Move.make(h * parseFloat(c)), e.Html.root.classList.add(l.dragging), n.emit("swipe.move") } }, end: function (i) { if (!t.disabled) { var s = t.settings, a = s.perSwipe, u = s.touchAngle, c = s.classes, l = this.touches(i), f = this.threshold(i), d = l.pageX - o, h = 180 * r / Math.PI; this.enable(), d > f && h < u ? e.Run.make(e.Direction.resolve("".concat(a, "<"))) : d < -f && h < u ? e.Run.make(e.Direction.resolve("".concat(a, ">"))) : e.Move.make(), e.Html.root.classList.remove(c.dragging), this.unbindSwipeMove(), this.unbindSwipeEnd(), n.emit("swipe.end") } }, bindSwipeStart: function () { var n = this, r = t.settings, o = r.swipeThreshold, s = r.dragThreshold; o && i.on(I[0], e.Html.wrapper, (function (t) { n.start(t) }), u), s && i.on(I[1], e.Html.wrapper, (function (t) { n.start(t) }), u) }, unbindSwipeStart: function () { i.off(I[0], e.Html.wrapper, u), i.off(I[1], e.Html.wrapper, u) }, bindSwipeMove: function () { var n = this; i.on(V, e.Html.wrapper, H((function (t) { n.move(t) }), t.settings.throttle), u) }, unbindSwipeMove: function () { i.off(V, e.Html.wrapper, u) }, bindSwipeEnd: function () { var t = this; i.on(G, e.Html.wrapper, (function (e) { t.end(e) })) }, unbindSwipeEnd: function () { i.off(G, e.Html.wrapper) }, touches: function (t) { return F.indexOf(t.type) > -1 ? t : t.touches[0] || t.changedTouches[0] }, threshold: function (e) { var n = t.settings; return F.indexOf(e.type) > -1 ? n.dragThreshold : n.swipeThreshold }, enable: function () { return a = !1, e.Transition.enable(), this }, disable: function () { return a = !0, e.Transition.disable(), this } }; return n.on("build.after", (function () { e.Html.root.classList.add(t.settings.classes.swipeable) })), n.on("destroy", (function () { c.unbindSwipeStart(), c.unbindSwipeMove(), c.unbindSwipeEnd(), i.destroy() })), c }, Images: function (t, e, n) { var i = new R, r = { mount: function () { this.bind() }, bind: function () { i.on("dragstart", e.Html.wrapper, this.dragstart) }, unbind: function () { i.off("dragstart", e.Html.wrapper) }, dragstart: function (t) { t.preventDefault() } }; return n.on("destroy", (function () { r.unbind(), i.destroy() })), r }, Anchors: function (t, e, n) { var i = new R, r = !1, o = !1, s = { mount: function () { this._a = e.Html.wrapper.querySelectorAll("a"), this.bind() }, bind: function () { i.on("click", e.Html.wrapper, this.click) }, unbind: function () { i.off("click", e.Html.wrapper) }, click: function (t) { o && (t.stopPropagation(), t.preventDefault()) }, detach: function () { if (o = !0, !r) { for (var t = 0; t < this.items.length; t++)this.items[t].draggable = !1; r = !0 } return this }, attach: function () { if (o = !1, r) { for (var t = 0; t < this.items.length; t++)this.items[t].draggable = !0; r = !1 } return this } }; return b(s, "items", { get: function () { return s._a } }), n.on("swipe.move", (function () { s.detach() })), n.on("swipe.end", (function () { e.Transition.after((function () { s.attach() })) })), n.on("destroy", (function () { s.attach(), s.unbind(), i.destroy() })), s }, Controls: function (t, e, n) { var i = new R, r = !!q && { passive: !0 }, o = { mount: function () { this._n = e.Html.root.querySelectorAll('[data-glide-el="controls[nav]"]'), this._c = e.Html.root.querySelectorAll(N), this._arrowControls = { previous: e.Html.root.querySelectorAll(Y), next: e.Html.root.querySelectorAll(X) }, this.addBindings() }, setActive: function () { for (var t = 0; t < this._n.length; t++)this.addClass(this._n[t].children) }, removeActive: function () { for (var t = 0; t < this._n.length; t++)this.removeClass(this._n[t].children) }, addClass: function (e) { var n = t.settings, i = e[t.index]; i && i && (i.classList.add(n.classes.nav.active), T(i).forEach((function (t) { t.classList.remove(n.classes.nav.active) }))) }, removeClass: function (e) { var n = e[t.index]; n && n.classList.remove(t.settings.classes.nav.active) }, setArrowState: function () { if (!t.settings.rewind) { var n = o._arrowControls.next, i = o._arrowControls.previous; this.resetArrowState(n, i), 0 === t.index && this.disableArrow(i), t.index === e.Run.length && this.disableArrow(n) } }, resetArrowState: function () { for (var e = t.settings, n = arguments.length, i = new Array(n), r = 0; r < n; r++)i[r] = arguments[r]; i.forEach((function (t) { A(t).forEach((function (t) { t.classList.remove(e.classes.arrow.disabled) })) })) }, disableArrow: function () { for (var e = t.settings, n = arguments.length, i = new Array(n), r = 0; r < n; r++)i[r] = arguments[r]; i.forEach((function (t) { A(t).forEach((function (t) { t.classList.add(e.classes.arrow.disabled) })) })) }, addBindings: function () { for (var t = 0; t < this._c.length; t++)this.bind(this._c[t].children) }, removeBindings: function () { for (var t = 0; t < this._c.length; t++)this.unbind(this._c[t].children) }, bind: function (t) { for (var e = 0; e < t.length; e++)i.on("click", t[e], this.click), i.on("touchstart", t[e], this.click, r) }, unbind: function (t) { for (var e = 0; e < t.length; e++)i.off(["click", "touchstart"], t[e]) }, click: function (t) { q || "touchstart" !== t.type || t.preventDefault(); var n = t.currentTarget.getAttribute("data-glide-dir"); e.Run.make(e.Direction.resolve(n)) } }; return b(o, "items", { get: function () { return o._c } }), n.on(["mount.after", "move.after"], (function () { o.setActive() })), n.on(["mount.after", "run"], (function () { o.setArrowState() })), n.on("destroy", (function () { o.removeBindings(), o.removeActive(), i.destroy() })), o }, Keyboard: function (t, e, n) { var i = new R, r = { mount: function () { t.settings.keyboard && this.bind() }, bind: function () { i.on("keyup", document, this.press) }, unbind: function () { i.off("keyup", document) }, press: function (n) { var i = t.settings.perSwipe; "ArrowRight" === n.code && e.Run.make(e.Direction.resolve("".concat(i, ">"))), "ArrowLeft" === n.code && e.Run.make(e.Direction.resolve("".concat(i, "<"))) } }; return n.on(["destroy", "update"], (function () { r.unbind() })), n.on("update", (function () { r.mount() })), n.on("destroy", (function () { i.destroy() })), r }, Autoplay: function (t, e, n) { var i = new R, r = { mount: function () { this.enable(), this.start(), t.settings.hoverpause && this.bind() }, enable: function () { this._e = !0 }, disable: function () { this._e = !1 }, start: function () { var i = this; this._e && (this.enable(), t.settings.autoplay && m(this._i) && (this._i = setInterval((function () { i.stop(), e.Run.make(">"), i.start(), n.emit("autoplay") }), this.time))) }, stop: function () { this._i = clearInterval(this._i) }, bind: function () { var t = this; i.on("mouseover", e.Html.root, (function () { t._e && t.stop() })), i.on("mouseout", e.Html.root, (function () { t._e && t.start() })) }, unbind: function () { i.off(["mouseover", "mouseout"], e.Html.root) } }; return b(r, "time", { get: function () { var n = e.Html.slides[t.index].getAttribute("data-glide-autoplay"); return d(n || t.settings.autoplay) } }), n.on(["destroy", "update"], (function () { r.unbind() })), n.on(["run.before", "swipe.start", "update"], (function () { r.stop() })), n.on(["pause", "destroy"], (function () { r.disable(), r.stop() })), n.on(["run.after", "swipe.end"], (function () { r.start() })), n.on(["play"], (function () { r.enable(), r.start() })), n.on("update", (function () { r.mount() })), n.on("destroy", (function () { i.destroy() })), r }, Breakpoints: function (t, e, n) { var i = new R, r = t.settings, o = K(r.breakpoints), s = Object.assign({}, r), a = { match: function (t) { if (void 0 !== window.matchMedia) for (var e in t) if (t.hasOwnProperty(e) && window.matchMedia("(max-width: ".concat(e, "px)")).matches) return t[e]; return s } }; return Object.assign(r, a.match(o)), i.on("resize", window, H((function () { t.settings = w(r, a.match(o)) }), t.settings.throttle)), n.on("update", (function () { o = K(o), s = Object.assign({}, r) })), n.on("destroy", (function () { i.off("resize", window) })), a } }, Q = function (t) { !function (t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), e && o(t, e) }(s, t); var n = a(s); function s() { return e(this, s), n.apply(this, arguments) } return i(s, [{ key: "mount", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; return c(r(s.prototype), "mount", this).call(this, Object.assign({}, J, t)) } }]), s }(k); return Q }));
const mobileNav = document.querySelector('.mobile-navigation-open');
const mainNav = document.querySelector('.site-navigation'); 
const navLinkAnchor = document.querySelectorAll('.has-drop-anchor');
const navLink = document.querySelectorAll('.has-drop.first-level-li');
const navLinkSecondLevel = document.querySelectorAll('.has-drop.second-level-li');
 
var site = { 
    init: function () {
        site.initNavigation();
        site.mobileSharedSidebarToggle();
        site.initTabs();
        site.initAccordion(); 
        site.buttonOpeners(); 
        site.singleSlider();
        site.topSearch(); 
        site.identificationSlider();
        site.categoryIdentificationSlider();
        site.faqScroll();
        site.modalOpener();
        site.logoCarousel();
    },
    initNavigation: function () {
        mobileNav.addEventListener('click', () => {
            mainNav.classList.toggle('show');
        }); 

        navLinkAnchor.forEach((n) => {
            n.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopImmediatePropagation(); 
                site.handleClick(e);
            });
        });
    }, 
    handleClick: function (e) {
        var parentNode = e.target.closest('LI'),
            parentNodeId = parentNode.getAttribute('data-id'); 

        if (parentNode.classList.contains('first-level-li')) {
            navLink.forEach((n) => {
                if (n.getAttribute('data-id') !== parentNodeId) {
                    n.classList.remove('show-nav');
                }
            });
        }
        else { 
            navLinkSecondLevel.forEach((n) => {
                if (n.getAttribute('data-id') !== parentNodeId) {
                    n.classList.remove('show-nav');
                }
            });
        }

        parentNode.classList.toggle('show-nav');
    },

    mobileSharedSidebarToggle: function() { 
        const searchToggles = document.querySelectorAll('.mobile-sidebar-opener');  
 
        if (searchToggles) {
            searchToggles.forEach((s) => { 
                var sidebarItem = document.querySelector('.' + s.dataset.sidebarName); 
                s.addEventListener('click', (e) => { 
                    sidebarItem.classList.toggle('show-sidebar');
                });
            }); 
        } 
    },

    initAccordion: function () {
        const accordions = document.querySelectorAll('.accordion-container');
        if (accordions) { 
            accordions.forEach((a) => {
                let accordionOpener = a.querySelector('.accordion-opener'); 
                if (accordionOpener) {
                    accordionOpener.addEventListener('click', (e) => { 
                        a.classList.toggle('show-accordion');
                    });
                } 
            });
        }
    },

    initTabs: function () { 
        const tabs = document.querySelectorAll('.tabs');  
        if (tabs) { 

            tabs.forEach((t) => {
                let tabMobileOpener = t.querySelector('.tab-opener'); 
                let tabItems = t.querySelectorAll('.tab');  
                let tabContentItems = t.querySelectorAll('.content-tab'); 

                if (tabMobileOpener) {
                    tabMobileOpener.addEventListener('click', (e) => {
                        t.classList.toggle('show-tabs');
                    }); 
                }
                if (tabItems) {
                    tabItems.forEach((i) => {
                        i.addEventListener('click', (e) => {
                            site.updateActiveTab(tabItems, tabContentItems, i.getAttribute('data-tab-name'));
                        });
                    });
                } 
            }); 
        }
    },
    updateActiveTab: function (tabItems, tabContentItems, activeTabName) { 
        tabItems.forEach((t) => { 
            if (t.getAttribute('data-tab-name') !== activeTabName) {
                t.classList.remove('active-tab');
            }
            else {
                t.classList.add('active-tab');
            }
        });
        tabContentItems.forEach((t) => {
            if (t.getAttribute('data-tab-name') !== activeTabName) {
                t.classList.remove('active-tab');
            }
            else { 
                t.classList.add('active-tab');
            }
        });
    },
    buttonOpeners: function () {
        const openers = document.querySelectorAll('.button-opener');
        if (openers) { 
            openers.forEach((o) => {

                o.addEventListener('click', (e) => {
                    var relatedId = o.getAttribute('data-related-id');
                    var hide = o.getAttribute('data-hide-after-show') == 'true';
                    var relatedEl = document.getElementById(relatedId);
                    if (hide) {
                        o.classList.add('hidden');
                    }
                    else {
                        o.classList.toggle('open');
                    }
                    if (relatedEl) {
                        relatedEl.classList.toggle('show-content');
                    }
                }); 
            });
        }
    }, 

    modalOpener: function () {
        const openers = document.querySelectorAll('.modal-opener');
        const closers = document.querySelectorAll('.modal-close');
        if (openers) {
            openers.forEach((o) => {

                o.addEventListener('click', (e) => {
                    var relatedId = o.getAttribute('data-related-id'); 
                    var relatedEl = document.getElementById(relatedId);

                    if (relatedEl) {
                        relatedEl.classList.add('show');
                    }
                });

            });
        }
        if (closers) {
            closers.forEach((c) => {

                c.addEventListener('click', (e) => {
                    var modalId = c.getAttribute('data-modal-id');
                    var modalEl = document.getElementById(modalId);

                    if (modalEl) {
                        modalEl.classList.remove('show');
                    }
                });

            });
        }
    }, 

    singleSlider: function () { 
        const sliders = document.querySelectorAll('.standard-slider');  
        if (sliders) {
            sliders.forEach(s => {
                let glide = new Glide(s, { gap: 20 });
                glide.mount(); 
            })
        }
    },

    identificationSlider: function() {
        const slider = document.getElementById('identification-slider');
        if (slider) {
            let glide = new Glide('#identification-slider', {
                gap: 50,
                peek: 0,
                perView: 2, 
                breakpoints: {
                    767: {

                        perView: 1,
                        peek: {
                            before: 0,
                            after: 140
                        }
                    }
                }
            });
            glide.mount();
        }
    },
    categoryIdentificationSlider: function () {
        const slider = document.getElementById('category-identification-slider');
        if (slider) {
            let glide = new Glide('#category-identification-slider', {
                gap: 15,
                peek: 0,
                perView: 3, 
                breakpoints: { 
                    1024: {
                        perView: 2
                    },
                    767: {
                        perView: 1 
                    }
                }
            });
            glide.mount();
        }
    },

    logoCarousel: function () {
        const carousels = document.querySelectorAll('.logo-carousel'); 
        if (carousels) { 
            carousels.forEach(x => {
                let glide = new Glide(x, {
                    gap: 100,
                    peek: 0,
                    perView: 4,
                    breakpoints: {
                        1024: {
                            perView: 4,
                            gap: 40
                        },
                        767: {
                            perView: 1,
                            gap: 40,
                            peek: {
                                before: 0,
                                after: 140
                            }
                        }
                    }
                });
                glide.mount();
            })
            
        }
    },
    topSearch: function () {
        const searchBtn = document.getElementById('top-search-button');
        const searchForm = document.getElementById('header-search-form');
        if (searchBtn && searchForm) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (searchForm.classList.contains('show-form')) {
                    searchForm.submit();
                }
                else {
                    searchForm.classList.add('show-form');
                } 
            }); 
        }
    },
    faqScroll: function () {
        const scrolls = document.querySelectorAll('.faq-scroll-button');
        if (scrolls) {
            const faqQ = document.getElementById('faq-questions');
            scrolls.forEach((s) => {
                s.addEventListener('click', () => {
                    let position = faqQ.offsetTop - 25;

                    window.scroll({
                        top: position,
                        left: 0,
                        behavior: 'smooth'
                    });
                });
            }); 
        }
    } 

}

site.init();

document.addEventListener('lazybeforeunveil', function (e) {
    var bg = e.target.getAttribute('data-bg');
    if (bg) {
        e.target.style.backgroundImage = 'url(' + bg + ')';
    } 
}); 

 
/*! lazysizes - v5.3.2 */

!function (e) { var t = function (u, D, f) { "use strict"; var k, H; if (function () { var e; var t = { lazyClass: "lazyload", loadedClass: "lazyloaded", loadingClass: "lazyloading", preloadClass: "lazypreload", errorClass: "lazyerror", autosizesClass: "lazyautosizes", fastLoadedClass: "ls-is-cached", iframeLoadMode: 0, srcAttr: "data-src", srcsetAttr: "data-srcset", sizesAttr: "data-sizes", minSize: 40, customMedia: {}, init: true, expFactor: 1.5, hFac: .8, loadMode: 2, loadHidden: true, ricTimeout: 0, throttleDelay: 125 }; H = u.lazySizesConfig || u.lazysizesConfig || {}; for (e in t) { if (!(e in H)) { H[e] = t[e] } } }(), !D || !D.getElementsByClassName) { return { init: function () { }, cfg: H, noSupport: true } } var O = D.documentElement, i = u.HTMLPictureElement, P = "addEventListener", $ = "getAttribute", q = u[P].bind(u), I = u.setTimeout, U = u.requestAnimationFrame || I, o = u.requestIdleCallback, j = /^picture$/i, r = ["load", "error", "lazyincluded", "_lazyloaded"], a = {}, G = Array.prototype.forEach, J = function (e, t) { if (!a[t]) { a[t] = new RegExp("(\\s|^)" + t + "(\\s|$)") } return a[t].test(e[$]("class") || "") && a[t] }, K = function (e, t) { if (!J(e, t)) { e.setAttribute("class", (e[$]("class") || "").trim() + " " + t) } }, Q = function (e, t) { var a; if (a = J(e, t)) { e.setAttribute("class", (e[$]("class") || "").replace(a, " ")) } }, V = function (t, a, e) { var i = e ? P : "removeEventListener"; if (e) { V(t, a) } r.forEach(function (e) { t[i](e, a) }) }, X = function (e, t, a, i, r) { var n = D.createEvent("Event"); if (!a) { a = {} } a.instance = k; n.initEvent(t, !i, !r); n.detail = a; e.dispatchEvent(n); return n }, Y = function (e, t) { var a; if (!i && (a = u.picturefill || H.pf)) { if (t && t.src && !e[$]("srcset")) { e.setAttribute("srcset", t.src) } a({ reevaluate: true, elements: [e] }) } else if (t && t.src) { e.src = t.src } }, Z = function (e, t) { return (getComputedStyle(e, null) || {})[t] }, s = function (e, t, a) { a = a || e.offsetWidth; while (a < H.minSize && t && !e._lazysizesWidth) { a = t.offsetWidth; t = t.parentNode } return a }, ee = function () { var a, i; var t = []; var r = []; var n = t; var s = function () { var e = n; n = t.length ? r : t; a = true; i = false; while (e.length) { e.shift()() } a = false }; var e = function (e, t) { if (a && !t) { e.apply(this, arguments) } else { n.push(e); if (!i) { i = true; (D.hidden ? I : U)(s) } } }; e._lsFlush = s; return e }(), te = function (a, e) { return e ? function () { ee(a) } : function () { var e = this; var t = arguments; ee(function () { a.apply(e, t) }) } }, ae = function (e) { var a; var i = 0; var r = H.throttleDelay; var n = H.ricTimeout; var t = function () { a = false; i = f.now(); e() }; var s = o && n > 49 ? function () { o(t, { timeout: n }); if (n !== H.ricTimeout) { n = H.ricTimeout } } : te(function () { I(t) }, true); return function (e) { var t; if (e = e === true) { n = 33 } if (a) { return } a = true; t = r - (f.now() - i); if (t < 0) { t = 0 } if (e || t < 9) { s() } else { I(s, t) } } }, ie = function (e) { var t, a; var i = 99; var r = function () { t = null; e() }; var n = function () { var e = f.now() - a; if (e < i) { I(n, i - e) } else { (o || r)(r) } }; return function () { a = f.now(); if (!t) { t = I(n, i) } } }, e = function () { var v, m, c, h, e; var y, z, g, p, C, b, A; var n = /^img$/i; var d = /^iframe$/i; var E = "onscroll" in u && !/(gle|ing)bot/.test(navigator.userAgent); var _ = 0; var w = 0; var M = 0; var N = -1; var L = function (e) { M--; if (!e || M < 0 || !e.target) { M = 0 } }; var x = function (e) { if (A == null) { A = Z(D.body, "visibility") == "hidden" } return A || !(Z(e.parentNode, "visibility") == "hidden" && Z(e, "visibility") == "hidden") }; var W = function (e, t) { var a; var i = e; var r = x(e); g -= t; b += t; p -= t; C += t; while (r && (i = i.offsetParent) && i != D.body && i != O) { r = (Z(i, "opacity") || 1) > 0; if (r && Z(i, "overflow") != "visible") { a = i.getBoundingClientRect(); r = C > a.left && p < a.right && b > a.top - 1 && g < a.bottom + 1 } } return r }; var t = function () { var e, t, a, i, r, n, s, o, l, u, f, c; var d = k.elements; if ((h = H.loadMode) && M < 8 && (e = d.length)) { t = 0; N++; for (; t < e; t++) { if (!d[t] || d[t]._lazyRace) { continue } if (!E || k.prematureUnveil && k.prematureUnveil(d[t])) { R(d[t]); continue } if (!(o = d[t][$]("data-expand")) || !(n = o * 1)) { n = w } if (!u) { u = !H.expand || H.expand < 1 ? O.clientHeight > 500 && O.clientWidth > 500 ? 500 : 370 : H.expand; k._defEx = u; f = u * H.expFactor; c = H.hFac; A = null; if (w < f && M < 1 && N > 2 && h > 2 && !D.hidden) { w = f; N = 0 } else if (h > 1 && N > 1 && M < 6) { w = u } else { w = _ } } if (l !== n) { y = innerWidth + n * c; z = innerHeight + n; s = n * -1; l = n } a = d[t].getBoundingClientRect(); if ((b = a.bottom) >= s && (g = a.top) <= z && (C = a.right) >= s * c && (p = a.left) <= y && (b || C || p || g) && (H.loadHidden || x(d[t])) && (m && M < 3 && !o && (h < 3 || N < 4) || W(d[t], n))) { R(d[t]); r = true; if (M > 9) { break } } else if (!r && m && !i && M < 4 && N < 4 && h > 2 && (v[0] || H.preloadAfterLoad) && (v[0] || !o && (b || C || p || g || d[t][$](H.sizesAttr) != "auto"))) { i = v[0] || d[t] } } if (i && !r) { R(i) } } }; var a = ae(t); var S = function (e) { var t = e.target; if (t._lazyCache) { delete t._lazyCache; return } L(e); K(t, H.loadedClass); Q(t, H.loadingClass); V(t, B); X(t, "lazyloaded") }; var i = te(S); var B = function (e) { i({ target: e.target }) }; var T = function (e, t) { var a = e.getAttribute("data-load-mode") || H.iframeLoadMode; if (a == 0) { e.contentWindow.location.replace(t) } else if (a == 1) { e.src = t } }; var F = function (e) { var t; var a = e[$](H.srcsetAttr); if (t = H.customMedia[e[$]("data-media") || e[$]("media")]) { e.setAttribute("media", t) } if (a) { e.setAttribute("srcset", a) } }; var s = te(function (t, e, a, i, r) { var n, s, o, l, u, f; if (!(u = X(t, "lazybeforeunveil", e)).defaultPrevented) { if (i) { if (a) { K(t, H.autosizesClass) } else { t.setAttribute("sizes", i) } } s = t[$](H.srcsetAttr); n = t[$](H.srcAttr); if (r) { o = t.parentNode; l = o && j.test(o.nodeName || "") } f = e.firesLoad || "src" in t && (s || n || l); u = { target: t }; K(t, H.loadingClass); if (f) { clearTimeout(c); c = I(L, 2500); V(t, B, true) } if (l) { G.call(o.getElementsByTagName("source"), F) } if (s) { t.setAttribute("srcset", s) } else if (n && !l) { if (d.test(t.nodeName)) { T(t, n) } else { t.src = n } } if (r && (s || l)) { Y(t, { src: n }) } } if (t._lazyRace) { delete t._lazyRace } Q(t, H.lazyClass); ee(function () { var e = t.complete && t.naturalWidth > 1; if (!f || e) { if (e) { K(t, H.fastLoadedClass) } S(u); t._lazyCache = true; I(function () { if ("_lazyCache" in t) { delete t._lazyCache } }, 9) } if (t.loading == "lazy") { M-- } }, true) }); var R = function (e) { if (e._lazyRace) { return } var t; var a = n.test(e.nodeName); var i = a && (e[$](H.sizesAttr) || e[$]("sizes")); var r = i == "auto"; if ((r || !m) && a && (e[$]("src") || e.srcset) && !e.complete && !J(e, H.errorClass) && J(e, H.lazyClass)) { return } t = X(e, "lazyunveilread").detail; if (r) { re.updateElem(e, true, e.offsetWidth) } e._lazyRace = true; M++; s(e, t, r, i, a) }; var r = ie(function () { H.loadMode = 3; a() }); var o = function () { if (H.loadMode == 3) { H.loadMode = 2 } r() }; var l = function () { if (m) { return } if (f.now() - e < 999) { I(l, 999); return } m = true; H.loadMode = 3; a(); q("scroll", o, true) }; return { _: function () { e = f.now(); k.elements = D.getElementsByClassName(H.lazyClass); v = D.getElementsByClassName(H.lazyClass + " " + H.preloadClass); q("scroll", a, true); q("resize", a, true); q("pageshow", function (e) { if (e.persisted) { var t = D.querySelectorAll("." + H.loadingClass); if (t.length && t.forEach) { U(function () { t.forEach(function (e) { if (e.complete) { R(e) } }) }) } } }); if (u.MutationObserver) { new MutationObserver(a).observe(O, { childList: true, subtree: true, attributes: true }) } else { O[P]("DOMNodeInserted", a, true); O[P]("DOMAttrModified", a, true); setInterval(a, 999) } q("hashchange", a, true);["focus", "mouseover", "click", "load", "transitionend", "animationend"].forEach(function (e) { D[P](e, a, true) }); if (/d$|^c/.test(D.readyState)) { l() } else { q("load", l); D[P]("DOMContentLoaded", a); I(l, 2e4) } if (k.elements.length) { t(); ee._lsFlush() } else { a() } }, checkElems: a, unveil: R, _aLSL: o } }(), re = function () { var a; var n = te(function (e, t, a, i) { var r, n, s; e._lazysizesWidth = i; i += "px"; e.setAttribute("sizes", i); if (j.test(t.nodeName || "")) { r = t.getElementsByTagName("source"); for (n = 0, s = r.length; n < s; n++) { r[n].setAttribute("sizes", i) } } if (!a.detail.dataAttr) { Y(e, a.detail) } }); var i = function (e, t, a) { var i; var r = e.parentNode; if (r) { a = s(e, r, a); i = X(e, "lazybeforesizes", { width: a, dataAttr: !!t }); if (!i.defaultPrevented) { a = i.detail.width; if (a && a !== e._lazysizesWidth) { n(e, r, i, a) } } } }; var e = function () { var e; var t = a.length; if (t) { e = 0; for (; e < t; e++) { i(a[e]) } } }; var t = ie(e); return { _: function () { a = D.getElementsByClassName(H.autosizesClass); q("resize", t) }, checkElems: t, updateElem: i } }(), t = function () { if (!t.i && D.getElementsByClassName) { t.i = true; re._(); e._() } }; return I(function () { H.init && t() }), k = { cfg: H, autoSizer: re, loader: e, init: t, uP: Y, aC: K, rC: Q, hC: J, fire: X, gW: s, rAF: ee } }(e, e.document, Date); e.lazySizes = t, "object" == typeof module && module.exports && (module.exports = t) }("undefined" != typeof window ? window : {});