+function(i,t,e){"use strict";var s={size:{min:.1,max:10,default:1},shrink:{min:.2,max:1,default:.8},regrow:{min:.2,max:1,default:.8},minRows:{min:1,max:99,default:1},maxRows:{min:1,max:99,default:2},prefixReserve:{min:0,max:.8,default:.3},prefixHide:{min:.1,max:10,default:2},alignRight:{type:"boolean",default:!1}},n=function(){var i=t.fn.jquery.split(".");return 1==i[0]&&i[1]<8}();i.rrssbConfigAll=function(i){t(".rrssb").each(function(){t(this).rrssbConfig(i)})},t.fn.rrssbConfig=function(i){if(!t(this).data("settings")||i){var e={};for(var n in s)e[n]=s[n].default,i&&("boolean"==s[n].type?e[n]=Boolean(i[n]):isNaN(parseFloat(i[n]))||(e[n]=Math.min(s[n].max,Math.max(s[n].min,i[n]))));t(this).data("settings",e),h.call(this)}};var r,a=function(){t(".rrssb").each(h)},h=function(){var i=t(this).data("orig");i||(i=function(){var i=t(".rrssb-prefix",this),e=i.length?i.clone().css({visibility:"hidden","white-space":"nowrap",display:"inline"}).appendTo(this):null;t("ul").contents().filter(function(){return this.nodeType===Node.TEXT_NODE}).remove();var s={width:0,buttons:0,height:t("li",this).innerHeight(),fontSize:parseFloat(t(this).css("font-size")),prefixWidth:e?e.innerWidth():0};return t("li",this).each(function(){s.width=Math.max(s.width,t(this).innerWidth()),s.buttons++}),t(this).data("orig",s),e&&e.remove(),s}.call(this));var e=t(this).data("settings"),s=i.width*e.size,r=i.buttons,a=t(this).innerWidth()-1,h=a<s*e.shrink?"":s;n?t("li",this).width(h):t("li",this).innerWidth(h);var o=a/e.shrink,l=i.prefixWidth*e.size;l>o*e.prefixHide?(l=0,t(".rrssb-prefix",this).css("display","none")):t(".rrssb-prefix",this).css("display","");var c=l<=a*e.prefixReserve?o-l:o,f=Math.floor(c/s);f*e.maxRows<r?(t(this).addClass("no-label"),s=i.height*e.size,f=Math.max(1,Math.floor(c/s))):t(this).removeClass("no-label");var d=e.minRows>1?Math.max(1,Math.ceil(r/(e.minRows-1))-1):r;f=Math.min(f,d),f=Math.ceil(r/Math.ceil(r/f)),d=Math.ceil(r/Math.ceil(r/d));var u=Math.floor(1e4/f)/100;t("li",this).css("max-width",u+"%");var m=s*f+l;m>o&&(m-=l,l=0);var p=f<d?e.regrow:1,g=Math.min(p,a/m),b=i.fontSize*e.size*g*.98;if(t(this).css("font-size",b+"px"),l){var x=Math.floor(1e4*l/m)/100;t(".rrssb-buttons",this).css("padding-left",x+"%"),t(".rrssb-prefix",this).css("position","absolute");var v=Math.ceil(r/f)*i.height/i.fontSize;t(".rrssb-prefix",this).css("line-height",v+"em")}else t(".rrssb-buttons",this).css("padding-left",""),t(".rrssb-prefix",this).css("position",""),t(".rrssb-prefix",this).css("line-height","");var w=e.alignRight?"padding-left":"padding-right";if(g>=.999*p){var M=Math.floor(1e4*(a-m*g*1.02)/a)/100;t(this).css(w,M+"%")}else t(this).css(w,"")},o=function(i){r&&clearTimeout(r),r=setTimeout(a,i||200)};t(document).ready(function(){t(".rrssb-buttons a.popup").click(function(e){!function(t,e,s,n){var r=void 0!==i.screenLeft?i.screenLeft:screen.left,a=void 0!==i.screenTop?i.screenTop:screen.top,h=(i.innerWidth?i.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width)/2-s/2+r,o=(i.innerHeight?i.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height)/3-n/3+a,l=i.open(t,e,"scrollbars=yes, width="+s+", height="+n+", top="+o+", left="+h);l&&l.focus&&l.focus()}(t(this).attr("href"),t(this).find(".rrssb-text").html(),580,470),e.preventDefault()}),t(i).resize(o),t(document).ready(function(){rrssbConfigAll()})})}(window,jQuery);;
/**
 * @file
 * The RRSSB Drupal Behavior to configure settings.
 */

(function ($) {
  'use strict';

  Drupal.behaviors.rrssb = {
    attach: function (context, settings) {
      for (var buttonSet in settings.rrssb) {
        $('.rrssb-bs-' + buttonSet).each(function(){
          $(this).rrssbConfig(settings.rrssb[buttonSet]);
        });
      }
    }
  };
})(jQuery);
;
/*! js-cookie v3.0.0-rc.0 | MIT */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self,function(){var r=e.Cookies,n=e.Cookies=t();n.noConflict=function(){return e.Cookies=r,n}}())}(this,function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)e[n]=r[n]}return e}var t={read:function(e){return e.replace(/%3B/g,";")},write:function(e){return e.replace(/;/g,"%3B")}};return function r(n,i){function o(r,o,u){if("undefined"!=typeof document){"number"==typeof(u=e({},i,u)).expires&&(u.expires=new Date(Date.now()+864e5*u.expires)),u.expires&&(u.expires=u.expires.toUTCString()),r=t.write(r).replace(/=/g,"%3D"),o=n.write(String(o),r);var c="";for(var f in u)u[f]&&(c+="; "+f,!0!==u[f]&&(c+="="+u[f].split(";")[0]));return document.cookie=r+"="+o+c}}return Object.create({set:o,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var r=document.cookie?document.cookie.split("; "):[],i={},o=0;o<r.length;o++){var u=r[o].split("="),c=u.slice(1).join("="),f=t.read(u[0]).replace(/%3D/g,"=");if(i[f]=n.read(c,f),e===f)break}return e?i[e]:i}},remove:function(t,r){o(t,"",e({},r,{expires:-1}))},withAttributes:function(t){return r(this.converter,e({},this.attributes,t))},withConverter:function(t){return r(e({},this.converter,t),this.attributes)}},{attributes:{value:Object.freeze(i)},converter:{value:Object.freeze(n)}})}(t,{path:"/"})});
;

(function ($, Drupal, cookies = {}) {
  Drupal.behaviors.bootstrapSiteAlert = {
    attach: function (context, drupalSettings) {

      // Since the key is updated every time the configuration form is saved,
      // we can ensure users don't miss newly added or changed alerts.
      var key = drupalSettings.bootstrap_site_alert.dismissedCookie.key;

      // Only show the alert if dismiss button has not been clicked. The
      // element is hidden by default in order to prevent it from momentarily
      // flickering onscreen. We are not working with Bootstrap's 'hide' class
      // since we don't want a dependency on Bootstrap.
      if (cookies.get('Drupal.visitor.bootstrap_site_alert_dismissed') !== key) {
        $('.bs-site-alert').css('display', 'block');
      }

      // Set the cookie value when dismiss button is clicked.
      $('.bs-site-alert .close').click(function(e) {

        // Do not perform default action.
        e.preventDefault();

        // Set cookie to the current key.
        cookies.set('Drupal.visitor.bootstrap_site_alert_dismissed', key, { path: drupalSettings.path.baseUrl });
      });
    }
  }
})(jQuery, Drupal, window.Cookies);
;
