'use strict'; // vf-banner
// Turn the below code snippet into a banner
// <div class="vf-banner vf-banner--fixed vf-banner--bottom vf-banner--notice"
// data-vf-js-banner
// data-vf-js-banner-state="persistent|dismissible|blocking" data-vf-js-banner-esc-close="y|n"
// data-vf-js-banner-cookie-name="{{data-service-id}}"
// data-vf-js-banner-cookie-version="{{data-protection-version}}"
// data-vf-js-banner-extra-button="<a href='#'>string1</a><a href='#'>string2</a>">
//   <div class="vf-banner__content | vf-grid">
//     <p class="vf-text vf-text--body-l">
//       This website uses cookies, and the limiting processing of your personal data to function. By using the site you are agreeing to this as outlined in our <a class="vf-link" href="JavaScript:Void(0);">Privacy Notice</a> and <a class="vf-link" href="JavaScript:Void(0);">Terms Of Use</a>.
//     </p>
//
//     <button class="vf-button vf-button--secondary">
//       {{vf-data-protection-banner__link}}
//     </button>
//   </div>
// </div>

/**
 * Clear the cooke. This is mostly a development tool.
 */

/* eslint-disable no-unused-vars */

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function vfBannerReset(vfBannerCookieNameAndVersion) {
  vfBannerSetCookie(vfBannerCookieNameAndVersion, false);
}
/* eslint-enable no-unused-vars */

/**
 * Dismiss a banner
 */


function vfBannerClose(targetBanner) {
  // remove padding added to not cover up content
  if (targetBanner.classList.contains("vf-banner--fixed")) {
    var height = targetBanner.offsetHeight || 0;
    var pagePadding;

    if (targetBanner.classList.contains("vf-banner--top")) {
      pagePadding = document.body.style.paddingTop.replace(/\D/g, "") || 0;
      pagePadding = pagePadding - height;
      document.body.style.paddingTop = pagePadding + "px";
    }

    if (targetBanner.classList.contains("vf-banner--bottom")) {
      pagePadding = document.body.style.paddingBottom.replace(/\D/g, "") || 0;
      pagePadding = pagePadding - height;
      document.body.style.paddingBottom = pagePadding + "px";
    }
  } // dismiss banner


  targetBanner.classList.add("vf-u-display-none");
}
/**
 * Confirm a banner, initiate cookie logging
 */


function vfBannerConfirm(banner, vfBannerCookieNameAndVersion) {
  vfBannerClose(banner);

  if (vfBannerCookieNameAndVersion !== "null") {
    vfBannerSetCookie(vfBannerCookieNameAndVersion, true);
  }
}
/**
 * Log a cookie
 */


function vfBannerSetCookie(c_name, value, exdays) {
  // var value = value || 'true';

  /* eslint-disable no-redeclare */
  var exdays = exdays || 90;
  /* eslint-enable no-redeclare */

  var exdate = new Date();
  var c_value;
  exdate.setDate(exdate.getDate() + exdays);
  c_value = escape(value) + (exdays === null ? "" : ";expires=" + exdate.toUTCString()) + ";domain=" + document.domain + ";path=/";
  document.cookie = c_name + "=" + c_value;
}
/**
 * See if a cookie has been set
 */


function vfBannerGetCookie(c_name) {
  var x,
    y,
    ARRcookies = document.cookie.split(";");

  for (var i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");

    if (x === c_name) {
      return unescape(y);
    }
  }
}
/**
 * Finds all vf-banner on a page and activates them
 * @param {object} [scope] - the html scope to process, optional, defaults to `document`
 * @example vfBanner(document.querySelectorAll('.vf-component__container')[0]);
 */


function vfBanner(scope) {
  /* eslint-disable no-redeclare */
  var scope = scope || document;
  /* eslint-enable no-redeclare */

  var bannerList = scope.querySelectorAll("[data-vf-js-banner]");

  if (!bannerList) {
    // exit: banners not found
    return;
  }

  if (bannerList.length == 0) {
    // exit: banner content not found
    return;
  } // generate the banner component, js events


  Array.prototype.forEach.call(bannerList, function (banner) {
    // map the JS data attributes to our object structure
    var bannerRemapped = JSON.parse(JSON.stringify(banner.dataset));

    if (typeof banner.dataset.vfJsBannerId != "undefined") {// don't reactivate an already processed banner
    } else {
      bannerRemapped.vfJsBannerText = banner.querySelectorAll("[data-vf-js-banner-text]")[0].innerHTML;
      var uniqueId = Math.round(Math.random() * 10000000); // set an id to target this banner

      banner.setAttribute("data-vf-js-banner-id", uniqueId); // preserve the classlist

      bannerRemapped.classList = banner.querySelectorAll("[data-vf-js-banner-text]")[0].classList; // Make the banner come alive

      vfBannerInsert(bannerRemapped, uniqueId);
    }
  });
}
/**
 * Takes a banner object and creates the necesary html markup, js events, and inserts
 * @example vfBannerInsert()
 * @param {object} [banner]  -
 * @param {string} [bannerId] - the id of the target div, `data-vf-js-banner-id="1"`
 * @param {object} [scope] - the html scope to process, optional, defaults to `document`
 */


function vfBannerInsert(banner, bannerId, scope) {
  /* eslint-disable no-redeclare */
  var scope = scope || document;
  /* eslint-enable no-redeclare */

  var targetBanner = scope.querySelectorAll("[data-vf-js-banner-id=\"" + bannerId + "\"]")[0];

  if (targetBanner == undefined) {
    return;
  }

  var generatedBannerHtml = "<div class=\"" + banner.classList + "\" data-vf-js-banner-text>";
  generatedBannerHtml += banner.vfJsBannerText; // What type of banner?

  if (banner.vfJsBannerState === "persistent") {// nothing more to do for persistent, you can't close it
  } else if (banner.vfJsBannerState === "dismissible") {// nothing more to do for dismissible
  } else if (banner.vfJsBannerState === "blocking") {
    console.warn("vf-banner: Note, the blocking implementation is not yet feature complete."); // escape only works when blocking

    if (banner.vfJsBannerEscClose === "y" || banner.vfJsBannerEscClose === "Y") {
      document.onkeydown = function (evt) {
        evt = evt || window.event;

        if (evt.keyCode == 27) {
          vfBannerConfirm(targetBanner, "null");
        }
      };
    }
  } // Split passed links into buttons
  // <a href='#'>string1</a>\<a href='#'>string2</a>


  if (banner.vfJsBannerExtraButton) {
    var vfBannerExtraButtons = banner.vfJsBannerExtraButton.split("</a>");
    vfBannerExtraButtons.forEach(function (button) {
      if (button.length > 1) {
        button += "</a>";
        var newButton = document.createElement("button");
        newButton.innerHTML = button;
        newButton = newButton.firstChild;
        newButton.classList.add("vf-button", "vf-button--primary");
        generatedBannerHtml += newButton.outerHTML;
      }
    });
  } // if there is a vfJsBannerButtonText and banner is blocking or dismissible,
  // add a button so user can close the banner


  if (banner.vfJsBannerButtonText && (banner.vfJsBannerState === "blocking" || banner.vfJsBannerState === "dismissible")) {
    if (banner.vfJsBannerButtonTheme == "primary") {
      generatedBannerHtml += "<button class=\"vf-button vf-button--primary\" data-vf-js-banner-close>" + banner.vfJsBannerButtonText + "</button>";
    } else if (banner.vfJsBannerButtonTheme == "secondary") {
      generatedBannerHtml += "<button class=\"vf-button vf-button--secondary\" data-vf-js-banner-close>" + banner.vfJsBannerButtonText + "</button>";
    } else if (banner.vfJsBannerButtonTheme == "tertiary") {
      generatedBannerHtml += "<button class=\"vf-button vf-button--tertiary\" data-vf-js-banner-close>" + banner.vfJsBannerButtonText + "</button>";
    } else {
      // default
      generatedBannerHtml += "<button class=\"vf-button vf-button--primary\" data-vf-js-banner-close>" + banner.vfJsBannerButtonText + "</button>";
    }
  }

  generatedBannerHtml += "</div>"; // set the html of the banner

  targetBanner.innerHTML = generatedBannerHtml; // prep for cookie

  var vfBannerCookieNameAndVersion = "null";

  if (banner.vfJsBannerCookieName && banner.vfJsBannerCookieVersion) {
    vfBannerCookieNameAndVersion = banner.vfJsBannerCookieName + "_" + banner.vfJsBannerCookieVersion;
  } // utility to reset cookie when developing
  // console.warn('vf-banner: vfBannerReset cookie reset override is on.');
  // vfBannerReset(vfBannerCookieNameAndVersion);
  // if blocking or dismissible, allow the user to close it, store a cookie (if specified)


  if (banner.vfJsBannerState === "blocking" || banner.vfJsBannerState === "dismissible") {
    // On click: close banner, pass any cookie name (or `null`)
    if (banner.vfJsBannerButtonText) {
      targetBanner.querySelectorAll("[data-vf-js-banner-close]")[0].addEventListener("click", function () {
        vfBannerConfirm(targetBanner, vfBannerCookieNameAndVersion);
      }, false);
    }
  } // add appropriate padding to the page to not cover up content


  if (targetBanner.classList.contains("vf-banner--fixed")) {
    var height = Number(targetBanner.offsetHeight || 0);
    var pagePadding;

    if (targetBanner.classList.contains("vf-banner--top")) {
      pagePadding = Number(document.body.style.paddingTop.replace(/\D/g, "") || 0);
      pagePadding = pagePadding + height;
      document.body.style.paddingTop = pagePadding + "px";
    }

    if (targetBanner.classList.contains("vf-banner--bottom")) {
      pagePadding = Number(document.body.style.paddingBottom.replace(/\D/g, "") || 0);
      pagePadding = pagePadding + height;
      document.body.style.paddingBottom = pagePadding + "px";
    }
  }

  if (vfBannerCookieNameAndVersion != "null") {
    // if banner has been previously accepted
    if (vfBannerGetCookie(vfBannerCookieNameAndVersion) === "true") {
      // banner has been accepted, close
      vfBannerClose(targetBanner); // exit, nothng more to do

      return;
    } // if banner is marked as auto-accept, set as read


    if (banner.vfJsBannerAutoAccept == "true") {
      if (banner.vfJsBannerState === "blocking" || banner.vfJsBannerState === "dismissible") {
        vfBannerSetCookie(vfBannerCookieNameAndVersion, true);
      }
    }
  }
} // By default this creates banners from HTML
// optionally you can programatically supply
// Target HTML
// `<div class="vf-banner vf-banner--fixed vf-banner--bottom vf-banner--notice"
//       data-vf-js-banner
//       data-vf-js-banner-id="32423"
//
// ></div>`
// var programaticalBanner = {
//   vfJsBanner: "",
//   vfJsBannerButtonText: "I agree, dismiss this banner",
//   vfJsBannerCookieName: "MyService",
//   vfJsBannerCookieVersion: "0.1",
//   vfJsBannerExtraButton: "<a href='#'>Optional button</a><a target='_blank' href='#'>New tab button</a>",
//   vfJsBannerId: "2352286",
//   vfJsBannerText: '<p class="vf-text vf-text--body-l">This website uses cookies, and the limiting processing of your personal data to function. By using the site you are agreeing to this as outlined in our <a class="vf-link" href="JavaScript:Void(0);">Privacy Notice</a> and <a class="vf-link" href="JavaScript:Void(0);">Terms Of Use</a>.</p>',
//   vfJsBannerState: "dismissible",
//   vfJsBannerAutoAccept: "true"
// };
// vfBannerInsert(programaticalBanner,'32423');
// vf-banner-elixir
// if you need to import any other components' JS to use here
// import { vfOthercomponent } from vfImportPrefix + '../vf-other-component/vf-other-component';

/**
 * The global function for this component
 * @example vfBanner-Elixir(scope)
 * @param {object} [scope] - the html scope to process, optional, defaults to `document`
 */


function vfBannerElixir(scope) {
  /* eslint-disable no-redeclare */
  var scope = scope || document;
  /* eslint-enable no-redeclare */

  var elixirBanner = scope.querySelectorAll("[data-vf-js-banner-elixir]");

  if (elixirBanner.length == 0) {
    // exit: banner content not found
    return;
  }

  if (elixirBanner.length > 1) {
    console.warn("vf-banner-elixir", "More than one ELIXIR banner found, only the first will be processed.");
    return;
  }

  var logo = elixirBanner[0].dataset.vfJsBannerElixirLogo;
  var name = elixirBanner[0].dataset.vfJsBannerElixirName;
  var description = elixirBanner[0].dataset.vfJsBannerElixirDescription;
  var link = elixirBanner[0].dataset.vfJsBannerElixirLink;

  if (!logo) {
    logo = "https://ebi.emblstatic.net/web_guidelines/EBI-Framework/v1.2/images/logos/assorted/elixir_kitemark-60px.png";
  }

  if (logo == "CDR" || logo == "cdr") {
    logo == "https://ebi.emblstatic.net/web_guidelines/EBI-Framework/v1.4/images/logos/ELIXIR/elixir-cdr.gif";
  }

  if (!name) {
    name = "This service";
  }

  if (!description) {
    description = "This is part of the ELIXIR distributed infrastructure for life-science information.";
  }

  if (!link || link == "default") {
    link = "http://www.elixir-europe.org";
  }

  elixirBanner[0].innerHTML = "\n    <div class=\"vf-flag vf-flag--middle vf-flag--400\">\n      <div class=\"vf-flag__media\">\n        <a href=\"".concat(link, "\" class=\"vf-banner__link\"><img src=\"").concat(logo, "\" alt=\"ELIXIR Logo\"></a>\n      </div>\n      <div class=\"vf-flag__body\">\n        <h4 class='vf-banner__text--lg'><a href=\"").concat(link, "\" class=\"vf-link\">").concat(name, " is part of the ELIXIR infrastructure</a></h4>\n        <p class=\"vf-banner__text\">").concat(description, "</p>\n      </div>\n    </div>\n  ");
} // You should also import it at ./components/vf-component-rollup/scripts.js
// import { vfBannerElixir } from 'vf-banner-elixir/vf-banner-elixir';
// Or import directly
// import { vfBannerElixir } from '../components/raw/vf-banner-elixir/vf-banner-elixir.js';
// And, if needed, invoke it
// vfBannerElixir();
// vf-analytics-google

/*
 * A note on the Visual Framework and JavaScript:
 * The VF is primarily a CSS framework so we've included only a minimal amount
 * of JS in components and it's fully optional (just remove the JavaScript selectors
 * i.e. `data-vf-js-tabs`). So if you'd rather use Angular or Bootstrap for your
 * tabs, the Visual Framework won't get in the way.
 *
 * When querying the DOM for elements that should be acted on:
 * ðŸš« Don't: const tabs = document.querySelectorAll('.vf-tabs');
 * âœ… Do:    const tabs = document.querySelectorAll('[data-vf-js-tabs]');
 *
 * This allows users who would prefer not to have this JS engage on an element
 * to drop `data-vf-js-component` and still maintain CSS styling.
 */
// Declare `ga` as a global for eslint

/* global ga */

/**
 * Utility method to invalidate prior GA check.
 */


function vfGaIndicateUnloaded() {
  var el = document.querySelector("body");
  el.setAttribute("data-vf-google-analytics-loaded", "false");
}
/**
 * Track the last time an event was sent (don't double send)
 * @param {Date} lastGaEventTime
 */


var lastGaEventTime = Date.now();
/**
 * We poll the document until we find GA has loaded, or we've tried a few times.
 * Port of https://github.com/ebiwd/EBI-Framework/blob/v1.3/js/foundationExtendEBI.js#L4
 * @param {object} [vfGaTrackOptions]
 * @param {binary} [vfGaTrackOptions.vfGaTrackPageLoad=true] If true, the function will track the initial page view. Set this to false if you track the page view in your HTML.
 * @param {number} [numberOfGaChecksLimit=2]
 * @param {number} [checkTimeout=900]
 * @example
 * let vfGaTrackOptions = {
 *  vfGaTrackPageLoad: true
 *  vfGaTrackNetwork: {
 *    serviceProvider: 'dimension2',
 *    networkDomain: 'dimension3',
 *    networkType: 'dimension4'
 *  }
 * };
 * vfGaIndicateLoaded(vfGaTrackOptions);
 */

function vfGaIndicateLoaded(vfGaTrackOptions, numberOfGaChecksLimit, numberOfGaChecks, checkTimeout) {
  /* eslint-disable no-redeclare*/
  var vfGaTrackOptions = vfGaTrackOptions || {};
  if (vfGaTrackOptions.vfGaTrackPageLoad == null) vfGaTrackOptions.vfGaTrackPageLoad = true;
  var numberOfGaChecks = numberOfGaChecks || 0;
  var numberOfGaChecksLimit = numberOfGaChecksLimit || 5;
  var checkTimeout = checkTimeout || 900;
  /* eslint-enable no-redeclare*/

  var el = document.querySelector("body"); // debug
  // console.log('checking',numberOfGaChecks,numberOfGaChecksLimit)

  numberOfGaChecks++; // If successful we set `data-vf-google-analytics-loaded` on the `body` to true.

  try {
    // unset our check
    vfGaIndicateUnloaded();

    if (ga && ga.loaded) {
      el.setAttribute("data-vf-google-analytics-loaded", "true");
      vfGaInit(vfGaTrackOptions);
    } else {
      if (numberOfGaChecks <= numberOfGaChecksLimit) {
        setTimeout(function () {
          vfGaIndicateLoaded(vfGaTrackOptions, numberOfGaChecksLimit, numberOfGaChecks, checkTimeout);
        }, 900); // give a second check if GA was slow to load
      }
    }
  } catch (err) {
    if (numberOfGaChecks <= numberOfGaChecksLimit) {
      setTimeout(function () {
        vfGaIndicateLoaded(vfGaTrackOptions, numberOfGaChecksLimit, numberOfGaChecks, checkTimeout);
      }, 900); // give a second check if GA was slow to load
    }
  }
}
/**
 * Get Meta Tag Content
 * via https://jonlabelle.com/snippets/view/javascript/get-meta-tag-content
 *
 * @param {string} metaName The meta tag name.
 * @return {string} The meta tag content value, or empty string if not found.
 */


function vfGetMeta(metaName) {
  var metas = document.getElementsByTagName("meta");
  var re = new RegExp("\\b" + metaName + "\\b", "i");
  var i = 0;
  var mLength = metas.length;

  for (i; i < mLength; i++) {
    if (re.test(metas[i].getAttribute("name"))) {
      return metas[i].getAttribute("content");
    }
  }

  return "";
}
/**
 * Hooks into common analytics tracking
 * @param {object} [vfGaTrackOptions]
 * @param {binary} [vfGaTrackOptions.vfGaTrackPageLoad=true] If true, the function will track the initial page view. Set this to false if you track the page view in your HTML.
 */


function vfGaInit(vfGaTrackOptions) {
  /* eslint-disable no-redeclare*/
  var vfGaTrackOptions = vfGaTrackOptions || {};
  /* eslint-enable no-redeclare*/

  if (vfGaTrackOptions.vfGaTrackPageLoad == null) vfGaTrackOptions.vfGaTrackPageLoad = true; // Need help
  // How to add dimension to your property
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets
  // https://support.google.com/analytics/answer/2709829?hl=en
  // standard google analytics bootstrap
  // @todo: add conditional

  ga("set", "anonymizeIp", true); // Use the more robust "beacon" logging, when available
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/sending-hits

  ga("set", "transport", "beacon"); // lookup metadata  <meta name="vf:page-type" content="category;pageTypeHere">
  // Pass your GA dimension with a `;` divider

  var pageType = vfGetMeta("vf:page-type");

  if (pageType.length > 0) {
    var toLog = pageType.split(";");
    var dimension = toLog[1];
    var pageTypeName = toLog[0];
    ga("set", dimension, pageTypeName);
  } // If you want to track the network of visitors be sure to
  // - follow the setup guide at https://ipmeta.io/instructions
  // - view the directions in README.md
  // note: this feature may be broken out as a seperate dependency if the code size needs to grow further


  if (vfGaTrackOptions.vfGaTrackNetwork != null) {
    // a copy of https://ipmeta.io/plugin.js
    // included here to simplify usage and reduce external requests

    /* eslint-disable */
    var providePlugin = function providePlugin(pluginName, pluginConstructor) {
      var ga = window[window.GoogleAnalyticsObject || 'ga'];

      if (typeof ga === 'undefined') {}

      if (typeof ga == 'function') {
        ga('provide', pluginName, pluginConstructor);
      }

      setTimeout(function () {
        var inputs = document.querySelectorAll('input');

        if (inputs) {
          for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('blur', riskCheck);
          }
        }
      }, 750);
    };

    var provideGtagPlugin = function provideGtagPlugin(config) {
      var i = 0;
      var timer = setInterval(function () {
        ++i;
        var gtag = window.gtag;

        if (typeof gtag !== "undefined" || i === 5) {
          Window.IpMeta = new IpMeta(gtag, config);
          Window.IpMeta.loadGtagNetworkFields();
          clearInterval(timer);
        }
      }, 500);
    };

    var provideGtmPlugin = function provideGtmPlugin(config) {
      Window.IpMeta = new IpMeta([], config);
      Window.IpMeta.loadGtmNetworkFields();
      return [];
    };

    var rc = function rc(d) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", 'https://risk.ipmeta.io/check', !0);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
        assoc: d
      }));
    };

    var riskCheck = function riskCheck(e) {
      var input = e.srcElement.value;

      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
        var domain = input.replace(/.*@/, "");
        rc(encr(domain));
      }
    };

    var enrichNetwork = function enrichNetwork(key, local, callback) {
      local = local || !1;
      storageKey = key + "ipmetaNetworkResponse";

      if (sessionStorage.getItem(storageKey) !== null) {
        callback(JSON.parse(sessionStorage.getItem(storageKey)), !1);
        return;
      }

      var request = new XMLHttpRequest();
      var pl = 'h=' + encodeURI(window.location.hostname);

      if (key) {
        pl += '&k=' + key;
      }

      var endpoint = 'https://ipmeta.io/api/enrich';

      if (local) {
        endpoint = 'http://ipmeta.test/api/enrich';
      }

      request.open('POST', endpoint, !0);
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      request.setRequestHeader('Accept', 'application/json');
      request.send(pl);

      request.onreadystatechange = function () {
        if (request.readyState == XMLHttpRequest.DONE) {
          if (request.status === 200) {
            sessionStorage.setItem(storageKey, request.responseText);
            callback(JSON.parse(request.responseText), !0);
            return;
          }

          if (request.status === 429) {
            console.error(JSON.parse(request.responseText)[0]);
            return !1;
          }

          console.error('IpMeta lookup failed.  Returned status of ' + request.status);
          return !1;
        }
      };
    };

    var encr = function encr(str) {
      return 'IPM' + btoa(btoa('bf2414cd32581225a82cc4fb46c67643' + btoa(str)) + 'dde9caf18a8fc7d8187f3aa66da8c6bb');
    };

    var IpMeta = function IpMeta(tracker, config) {
      this.tracker = tracker;
      this.nameDimension = config.serviceProvider || config.nameDimension || 'dimension1';
      this.domainDimension = config.networkDomain || config.domainDimension || 'dimension2';
      this.typeDimension = config.networkType || config.typeDimension || 'dimension3';
      this.gtmEventKey = config.gtmEventKey || 'pageview';
      this.isLocal = config.local || !1;
      this.apiKey = config.apiKey;
      this.isDebug = config.debug;
    };

    IpMeta.prototype.loadNetworkFields = function () {
      if (typeof Window.IpMeta === 'undefined') {
        Window.IpMeta = this;
      }

      this.debugMessage('Loading network field parameters');
      enrichNetwork(this.apiKey, this.isLocal, function (fields, wasAsync) {
        var wasAsync = wasAsync || !1;
        var nameValue = fields.name || '(not set)';
        var domainValue = fields.domain || '(not set)';
        var typeValue = fields.type || '(not set)';

        if (nameValue) {
          Window.IpMeta.tracker.set(Window.IpMeta.nameDimension, nameValue);
          Window.IpMeta.debugMessage('Loaded network name: ' + nameValue + ' into ' + Window.IpMeta.nameDimension);
        }

        if (domainValue) {
          Window.IpMeta.tracker.set(Window.IpMeta.domainDimension, domainValue);
          Window.IpMeta.debugMessage('Loaded network domain: ' + domainValue + ' into ' + Window.IpMeta.domainDimension);
        }

        if (typeValue) {
          Window.IpMeta.tracker.set(Window.IpMeta.typeDimension, typeValue);
          Window.IpMeta.debugMessage('Loaded network type: ' + typeValue + ' into ' + Window.IpMeta.typeDimension);
        }

        if (wasAsync) {
          Window.IpMeta.tracker.send('event', 'IpMeta', 'Enriched', 'IpMeta Enriched', {
            nonInteraction: !0
          });
        }
      });
    };

    IpMeta.prototype.setGtagMapping = function (fields) {
      var nameValue = fields.name || '(not set)';
      var domainValue = fields.domain || '(not set)';
      var typeValue = fields.type || '(not set)';
      var mapping = {};
      mapping[this.nameDimension] = nameValue;
      mapping[this.domainDimension] = domainValue;
      mapping[this.typeDimension] = typeValue;
      mapping.non_interaction = !0;
      Window.IpMeta.tracker('event', 'ipmeta_event', mapping);
    };

    IpMeta.prototype.loadGtagNetworkFields = function () {
      if (typeof Window.IpMeta === 'undefined') {
        Window.IpMeta = this;
      }

      this.debugMessage('Loading network field parameters');
      enrichNetwork(this.apiKey, this.isLocal, function (fields, wasAsync) {
        wasAsync = wasAsync || !1;
        Window.IpMeta.setGtagMapping(fields);
      });
    };

    IpMeta.prototype.loadGtmNetworkFields = function () {
      if (typeof Window.IpMeta === 'undefined') {
        Window.IpMeta = this;
      }

      this.debugMessage('Loading network field parameters');
      var eventKey = this.gtmEventKey;
      enrichNetwork(this.apiKey, this.isLocal, function (fields, wasAsync) {
        wasAsync = wasAsync || !1;
        var nameValue = fields.name || '(not set)';
        var domainValue = fields.domain || '(not set)';
        var typeValue = fields.type || '(not set)';
        var dataLayerObj = {};
        dataLayerObj.event = eventKey;
        dataLayerObj.nameValue = nameValue;
        dataLayerObj.domainValue = domainValue;
        dataLayerObj.typeValue = typeValue;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(dataLayerObj);
      });
    };

    IpMeta.prototype.setDebug = function (enabled) {
      this.isDebug = enabled;
    };

    IpMeta.prototype.debugMessage = function (message) {
      if (!this.isDebug) return;
      if (console) console.debug(message);
    };

    providePlugin('ipMeta', IpMeta);
    /* eslint-enable */
    // Track the network

    ga("require", "ipMeta", {
      serviceProvider: vfGaTrackOptions.vfGaTrackNetwork.serviceProvider,
      networkDomain: vfGaTrackOptions.vfGaTrackNetwork.networkDomain,
      networkType: vfGaTrackOptions.vfGaTrackNetwork.networkType
    });
    ga("ipMeta:loadNetworkFields");
  } // standard google analytics bootstrap


  if (vfGaTrackOptions.vfGaTrackPageLoad) {
    ga("send", "pageview");
  } // If we want to send metrics in one go
  // ga('set', {
  //   'dimension5': 'custom dimension data'
  //   // 'metric5': 'custom metric data'
  // });


  vfGaLinkTrackingInit();
}
/**
 * Track clicks as events
 */


function vfGaLinkTrackingInit() {
  document.body.addEventListener("mousedown", function (evt) {
    // Debug event type clicked
    // console.log(evt.target.tagName, evt.target);
    // we only track clicks on interactive elements (links, buttons, forms)
    if (evt.target) {
      if (evt.target.tagName) {
        var clickedElementTag = evt.target.tagName.toLowerCase();
        var actionElements = ["a", "button", "label", "input", "select", "textarea", "details"];

        if (actionElements.indexOf(clickedElementTag) > -1) {
          vfGaTrackInteraction(evt.target);
          return;
        }
      }
    } // In the case that elements such as `span` are wrapped in action elements (e.g. `a`),
    // we need to find the latter and supply them for tracking


    var ancestors = ["a", "details", "label"];

    for (var i = 0; i < ancestors.length; i++) {
      var from = findParent(ancestors[i], evt.target || evt.srcElement);

      if (from) {
        vfGaTrackInteraction(from);
        return;
      }
    }
  }, false); //find first parent with tagName [tagname]

  function findParent(tagname, el) {
    while (el) {
      if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()) {
        return el;
      }

      el = el.parentNode;
    }

    return null;
  }
} // /*
//  * Find closest element that has GA attribute
//  * @returns {el} the closest element with GA attribute
//  */
// function getClosestGa(elem, selector) {
//   // Element.matches() polyfill
//   // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
//   if (!Element.prototype.matches) {
//     Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
//   }
// 	// Get the closest matching element
//   for ( ; elem && elem !== document; elem = elem.parentNode ) {
//     if ( elem.matches( selector ) ) return elem;
//   }
//   return null;
// }

/**
 * Utility method to get the last in an array
 * @returns {var} the last item in the array
 * @example linkName = actedOnItem.src.split('/').vfGaLinkLast();
 */


if (!Array.prototype.vfGaLinkLast) {
  Array.prototype.vfGaLinkLast = function () {
    return this[this.length - 1];
  };
} // Catch any use cases that may have been existing
// To be removed in 2.0.0

/* eslint-disable */


function analyticsTrackInteraction(actedOnItem, customEventName) {
  console.warn("vfGa", "As of 1.0.0-rc.3 analyticsTrackInteraction() is now vfGaTrackInteraction(). You function call is being proxied. You should update your code.");
  vfGaTrackInteraction(actedOnItem, customEventName);
}
/* eslint-enable */

/**
 * Analytics tracking
 * ---
 * This code tracks the user's clicks in various parts of the site and logs them as GA events.
 *
 * Dev note:
 * add class verbose-analytics to your body for a readout to console on clicks.
 *
 * @param {element} actedOnItem
 * @param {string} customEventName Event action
 * @example
 * jQuery(".analytics-content-footer").on('mousedown', 'a, button', function(e) {
 *   vfGaTrackInteraction(e.target,'Content footer');
 * });
 */


function vfGaTrackInteraction(actedOnItem, customEventName) {
  /* eslint-disable no-redeclare*/
  var customEventName = customEventName || []; // you can pass some custom text as a 3rd param

  /* eslint-enable no-redeclare*/

  var linkName;

  if (customEventName.length > 0) {
    linkName = customEventName;
  } else if (actedOnItem.dataset.vfAnalyticsLabel) {
    // if an explicit label, use that
    linkName = actedOnItem.dataset.vfAnalyticsLabel;
  } else {
    // otherwise derive a value
    // Fix for when tags have undefined .innerText
    if (typeof actedOnItem.innerText === "undefined") {
      actedOnItem.innerText = "";
    }

    linkName = actedOnItem.innerText; // console.log('linkName',linkName);
    // if there's no text, it's probably and image

    if (linkName.length == 0 && actedOnItem.hasAttribute("src")) linkName = actedOnItem.src.split("/").vfGaLinkLast();
    if (linkName.length == 0 && actedOnItem.value) linkName = actedOnItem.value; // is there an inner image?

    if (linkName.length == 0 && actedOnItem.getElementsByTagName("img")) {
      if (actedOnItem.getElementsByTagName("img")[0]) {
        // if alt text, use that
        if (actedOnItem.getElementsByTagName("img")[0].hasAttribute("alt")) {
          linkName = actedOnItem.getElementsByTagName("img")[0].alt;
        } else if (actedOnItem.getElementsByTagName("img")[0].hasAttribute("src")) {
          linkName = actedOnItem.getElementsByTagName("img")[0].src.split("/").vfGaLinkLast();
        }
      }
    } // fallback to an href value


    if (linkName.length == 0 && actedOnItem.href) linkName = actedOnItem.href; // special things for gloabl search box
    // if (parentContainer == 'Global search') {
    //   linkName = 'query: ' + jQuery('#global-search input#query').value;
    // }
  } // Get closest parent container
  // Track the region of the link clicked (global nav, masthead, hero, main content, footer, etc)
  //data-vf-google-analytics-region="main-content-area-OR-SOME-OTHER-NAME"


  var parentContainer = actedOnItem.closest("[data-vf-google-analytics-region]");

  if (parentContainer) {
    parentContainer = parentContainer.dataset.vfGoogleAnalyticsRegion;
  } else {
    parentContainer = "No container specified";
  } // send to GA
  // Only if more than 100ms has past since last click.
  // Due to our structure, we fire multiple events, so we only send to GA the most specific event resolution


  if (Date.now() - lastGaEventTime > 150) {
    // track link name and region
    // note that we've stored an event(s)
    lastGaEventTime = Date.now(); // What type of element? `a` `button` etc.

    var elementType = "none";

    if (actedOnItem.tagName) {
      elementType = actedOnItem.tagName.toLowerCase();
    } // Track file type (PDF, DOC, etc) or if mailto
    // adapted from https://www.blastanalytics.com/blog/how-to-track-downloads-in-google-analytics


    var filetypes = /\.(zip|exe|pdf|doc*|xls*|ppt*|mp3|txt|fasta)$/i;
    var href = actedOnItem.href; // log emails and downloads to seperate event "buckets"

    /* eslint-disable no-useless-escape */

    if (href && href.match(/^mailto\:/i)) {
      // email click
      var mailLink = href.replace(/^mailto\:/i, "");
      ga && ga("send", "event", "Email", "Region / " + parentContainer, mailLink);
      vfGaLogMessage("Email", "Region / " + parentContainer, mailLink, lastGaEventTime, actedOnItem);
    } else if (href && href.match(filetypes)) {
      // download event
      var extension = /[.]/.exec(href) ? /[^.]+$/.exec(href) : undefined;
      var filePath = href;
      ga && ga("send", "event", "Download", "Type / " + extension + " / " + parentContainer, filePath);
      vfGaLogMessage("Download", "Type / " + extension + " / " + parentContainer, filePath, lastGaEventTime, actedOnItem);
    }
    /* eslint-enable no-useless-escape */
    // If link and is external, log it as an external link


    if (href && href.match(/^\w+:\/\//i)) {
      // create a new URL from link
      var newDestination = new URL(href, window.location);

      if (newDestination.hostname != window.location.hostname) {
        ga && ga("send", "event", "External links", "External link / " + linkName + " / " + parentContainer, href);
        vfGaLogMessage("External links", "External link / " + linkName + " / " + parentContainer, href, lastGaEventTime, actedOnItem);
      }
    } // is it a form interaction or something with text?


    var formElementTypes = ["label", "input", "select", "textarea"];

    if (formElementTypes.indexOf(elementType) > -1) {
      // create a label for form elements
      // derive a form label
      linkName = ""; // If an explicit label has been provided, use that
      // <label for="radio-3" class="vf-form__label" data-vf-google-analytics-label="A special form option">Form Label</label>

      if (actedOnItem.dataset.vfAnalyticsLabel) {
        linkName = actedOnItem.dataset.vfAnalyticsLabel;
      } else {
        linkName = elementType + ": ";

        if (actedOnItem.getAttribute("name")) {
          // if element has a "name"
          linkName = actedOnItem.getAttribute("name");
        } else if (actedOnItem.getAttribute("for")) {
          // if element has a "for"
          linkName = actedOnItem.getAttribute("for");
        } else {
          // get the text of a label
          linkName = actedOnItem.textContent;
        }
      } // track a selected value


      if (elementType == "select") {
        linkName = linkName + ", " + actedOnItem.value;
      }

      ga && ga("send", "event", "UI", "UI Element / " + parentContainer, linkName);
      vfGaLogMessage("UI", "UI Element / " + parentContainer, linkName, lastGaEventTime, actedOnItem);
    } else {
      // generic catch all
      ga && ga("send", "event", "UI", "UI Element / " + parentContainer, linkName);
      vfGaLogMessage("UI", "UI Element / " + parentContainer, linkName, lastGaEventTime, actedOnItem);
    }
  }
}
/**
 * Helper function to log debug console messages.
 *
 * @param {string} eventCategory
 * @param {string} eventAction
 * @param {string} eventLabel
 * @param {string} lastGaEventTime
 * @param {element} actedOnItem
 */


function vfGaLogMessage(eventCategory, eventAction, eventLabel, lastGaEventTime, actedOnItem) {
  // conditional logging
  var conditionalLoggingCheck = document.querySelector("body"); // debug: always turn on verbose analytics
  // conditionalLoggingCheck.setAttribute("data-vf-google-analytics-verbose", "true");

  if (conditionalLoggingCheck.dataset.vfGoogleAnalyticsVerbose) {
    if (conditionalLoggingCheck.dataset.vfGoogleAnalyticsVerbose == "true") {
      /* eslint-disable */
      console.log("%c Verbose analytics on ", "color: #FFF; background: #111; font-size: .75rem;");
      console.log("clicked on: %o ", actedOnItem);
      console.log("sent to GA: ", "event ->", eventCategory + " ->", eventAction + " ->", eventLabel, "; at: ", lastGaEventTime);
      /* eslint-enable */
    }
  }
} // vf-tabs

/**
 * Finds all tabs on a page and activates them
 * @param {object} [scope] - the html scope to process, optional, defaults to `document`
 * @param {boolean} [activateDeepLinkOnLoad] - if deep linked tabs should be activated on page load, defaults to true
 * @example vfTabs(document.querySelectorAll('.vf-component__container')[0]);
 */


function vfTabs(scope, activateDeepLinkOnLoad) {
  /* eslint-disable no-redeclare */
  var scope = scope || document;
  var activateDeepLinkOnLoad = activateDeepLinkOnLoad || true;
  /* eslint-enable no-redeclare */
  // Get relevant elements and collections

  var tabsList = scope.querySelectorAll("[data-vf-js-tabs]");
  var panelsList = scope.querySelectorAll("[data-vf-js-tabs-content]");
  var panels = scope.querySelectorAll("[data-vf-js-tabs-content] [id^=\"vf-tabs__section\"]");
  var tabs = scope.querySelectorAll("[data-vf-js-tabs] .vf-tabs__link");

  if (!tabsList || !panels || !tabs) {
    // exit: either tabs or tabbed content not found
    return;
  }

  if (tabsList.length == 0 || panels.length == 0 || tabs.length == 0) {
    // exit: either tabs or tabbed content not found
    return;
  } // Add semantics are remove user focusability for each tab


  Array.prototype.forEach.call(tabs, function (tab, i) {
    var tabId = tab.href.split("#")[1]; // calculate an ID based off the tab href (todo: add support for a data-vf-js-tab-id, and if set use that)

    tab.setAttribute("role", "tab");
    tab.setAttribute("id", tabId);
    tab.setAttribute("data-tabs__item", tabId);
    tab.setAttribute("tabindex", "-1");
    tab.parentNode.setAttribute("role", "presentation"); // Reset any active tabs from a previous JS call

    tab.removeAttribute("aria-selected");
    tab.setAttribute("tabindex", "-1");
    tab.classList.remove("is-active"); // Handle clicking of tabs for mouse users

    tab.addEventListener("click", function (e) {
      e.preventDefault();
      vfTabsSwitch(e.currentTarget, panels);
    }); // Handle keydown events for keyboard users

    tab.addEventListener("keydown", function (e) {
      // Get the index of the current tab in the tabs node list
      var index = Array.prototype.indexOf.call(tabs, e.currentTarget); // Work out which key the user is pressing and
      // Calculate the new tab's index where appropriate

      var dir = e.which === 37 ? index - 1 : e.which === 39 ? index + 1 : e.which === 40 ? "down" : null;

      if (dir !== null) {
        e.preventDefault(); // If the down key is pressed, move focus to the open panel,
        // otherwise switch to the adjacent tab

        dir === "down" ? panels[i].focus({
          preventScroll: true
        }) : tabs[dir] ? vfTabsSwitch(tabs[dir], panels) : void 0;
      }
    });
  }); // Add tab panel semantics and hide them all

  Array.prototype.forEach.call(panels, function (panel) {
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("tabindex", "-1"); // let id = panel.getAttribute("id");

    panel.setAttribute("aria-labelledby", panel.id);
    panel.hidden = true;
  }); // Add the tabsList role to the first <ul> in the .tabbed container

  Array.prototype.forEach.call(tabsList, function (tabsListset) {
    tabsListset.setAttribute("role", "tabsList"); // Initially activate the first tab

    var firstTab = tabsListset.querySelectorAll(".vf-tabs__link")[0];
    firstTab.removeAttribute("tabindex");
    firstTab.setAttribute("aria-selected", "true");
    firstTab.classList.add("is-active");
  });
  Array.prototype.forEach.call(panelsList, function (panel) {
    // Initially reveal the first tab panel
    var firstPanel = panel.querySelectorAll(".vf-tabs__section")[0];
    firstPanel.hidden = false;
  }); // activate any deeplinks to a specific tab

  if (activateDeepLinkOnLoad) {
    vfTabsDeepLinkOnLoad(tabs, panels);
  }
} // The tab switching function


var vfTabsSwitch = function vfTabsSwitch(newTab, panels) {
  // get the parent ul of the clicked tab
  var parentTabSet = newTab.closest(".vf-tabs__list");
  var oldTab = parentTabSet.querySelector("[aria-selected]");

  if (oldTab) {
    oldTab.removeAttribute("aria-selected");
    oldTab.setAttribute("tabindex", "-1");
    oldTab.classList.remove("is-active");

    for (var item = 0; item < panels.length; item++) {
      var panel = panels[item];

      if (panel.id === oldTab.id) {
        panel.hidden = true;
        break;
      }
    }
  }

  newTab.focus({
    preventScroll: true
  }); // Make the active tab focusable by the user (Tab key)

  newTab.removeAttribute("tabindex"); // Set the selected state

  newTab.setAttribute("aria-selected", "true");
  newTab.classList.add("is-active"); // Get the indices of the new tab to find the correct
  // tab panel to show

  for (var _item = 0; _item < panels.length; _item++) {
    var _panel = panels[_item];

    if (_panel.id === newTab.id) {
      _panel.hidden = false;
      break;
    }
  }
};

function vfTabsDeepLinkOnLoad(tabs, panels) {
  // 1. See if there is a `#vf-tabs__section--88888`
  if (window.location.hash) {
    var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
  } else {
    // No hash found
    return false;
  }

  console.log("vfTabs: will activate tab", hash); // 2. loop through all tabs, if a match then activate

  Array.prototype.forEach.call(tabs, function (tab) {
    var tabId = tab.getAttribute("data-tabs__item");

    if (tabId == hash) {
      vfTabsSwitch(tab, panels);
    }
  });
} // vf-tree

/*
 * A note on the Visual Framework and JavaScript:
 * The VF is primairly a CSS framework so we've included only a minimal amount
 * of JS in components and it's fully optional (just remove the JavaScript selectors
 * i.e. `data-vf-js-tabs`). So if you'd rather use Angular or Bootstrap for your
 * tabs, the Visual Framework won't get in the way.
 *
 * When querying the DOM for elements that should be acted on:
 * ðŸš« Don't: const tabs = document.querySelectorAll('.vf-tabs');
 * âœ… Do:    const tabs = document.querySelectorAll('[data-vf-js-tabs]');
 *
 * This allows users who would prefer not to have this JS engange on an element
 * to drop `data-vf-js-component` and still maintain CSS styling.
 */
// if you need to import any other components' JS to use here
// import { vfOthercomponent } from 'vf-other-component/vf-other-component';

/**
 * The global function for this component
 * @example vfTree(firstPassedVar)
 * @param {object} [scope] - the html scope to process, optional, defaults to `document`
 */


function vfTree(scope) {
  /* eslint-disable no-redeclare */
  var scope = scope || document;
  /* eslint-enable no-redeclare */
  // Get relevant elements and collections

  var treelist = scope.querySelectorAll("[data-vf-js-tree]"); // const panelsList = scope.querySelectorAll('[data-vf-js-tabs-content]');
  // const panels = scope.querySelectorAll('[data-vf-js-tabs-content] [id^="vf-tabs__section"]');
  // const tabs = scope.querySelectorAll('[data-vf-js-tabs] .vf-tabs__link');
  // if (!tablist || !panels || !tabs) {

  if (!treelist) {
    // exit: either trees or tabbed content not found
    return;
  } // if (tablist.length == 0 || panels.length == 0 || tabs.length == 0) {


  if (treelist.length == 0) {
    // exit: either trees or tabbed content not found
    return;
  } // Get screen-reader only text from root tree node data attributes


  var treeNodeOpenText = treelist[0].dataset.vfJsButtonHiddenOpenText;
  var treeNodeCloseText = treelist[0].dataset.vfJsButtonHiddenCloseText; // Receive a target scope and toggle if it is active

  function vfTreeToggleActive(target) {
    var collpasedState = target.dataset["vfJsTree-Collapsed"];

    if (collpasedState === "true") {
      collpasedState = false;
      target.classList.remove("vf-tree--collapsed");
      target.classList.add("vf-tree__item--expanded");
      target.setAttribute("aria-expanded", true);
    } else {
      collpasedState = true;
      target.classList.add("vf-tree--collapsed");
      target.classList.remove("vf-tree__item--expanded");
      target.setAttribute("aria-expanded", false);
    } // set screen reader text based on tree state


    target.querySelector("[data-vf-js-tree-button-hidden-text]").innerText = collpasedState ? treeNodeOpenText : treeNodeCloseText;
    target.dataset["vfJsTree-Collapsed"] = collpasedState;
  } // Logic to show/hide section of tree


  function vfTreeButtonHandler(target) {
    // if want to only get the direct children matches
    // this future proofs but also adds and edge case, so we won't use for now
    // let targetButton = Array.prototype.filter.call(target.children, function (item) {
    //   return item.matches('[data-vf-js-tree--button]');
    // });
    var targetButton = target.querySelectorAll("[data-vf-js-tree--button]");

    if (targetButton.length == 0) {
      // if no tree buttons found, nothing to do
      return;
    } // Handle clicking
    // Target the closest item


    targetButton[0].addEventListener("click", function (e) {
      console.log(target);
      e.preventDefault();
      vfTreeToggleActive(target);
    });
  } // For each treelist section, invoke handlers


  Array.prototype.forEach.call(treelist, function (treelistset) {
    // Handle hide/show for tree sets
    vfTreeButtonHandler(treelistset);
  });
} // vf-search-client-side
// if you need to import any other components' JS to use here
// import { vfOthercomponent } from 'vf-other-component/vf-other-component';

/* global lunr */

/* global searchIndex */

/**
 * The global function for this component
 * @example vfcomponentName()
 */


function vfSearchClientSide() {
  var searchTerm;
  var searchQueryInput = document.querySelectorAll("[data-vf-search-client-side-input]"); // where we put the query

  var searchResultsContainer = document.querySelectorAll("[data-vf-search-client-side-results]"); // where we put the search results
  // some tips
  // https://lunrjs.com/guides/customising.html
  // https://davidwalsh.name/adding-search-to-your-site-with-javascript
  // this lunr pipeline disregards hyphens by breaking up words
  // It's particularly good if users might type `vf-tabs` or `tabs` to find `vf-tabs`

  var customPipelineWithoutHyphens = function customPipelineWithoutHyphens(builder) {
    var pipelineFunction = function pipelineFunction(token) {
      var tokenStr = token.toString(); // if there are no hyphens then skip this logic

      if (tokenStr.indexOf("-") < 0) return token; // split the token by hyphens, returning a clone of the original token with the split
      // e.g. 'anti-virus' -> 'anti', 'virus'

      var tokens = tokenStr.split("-").map(function (s) {
        return token.clone(function () {
          return s;
        });
      }); // var tokens = [];
      // clone the token and replace any hyphens
      // e.g. 'anti-virus' -> 'antivirus'
      // tokens.push(token.clone(function(s) {
      //   return s.replace('-', '');
      // }));
      // finally push the original token into the list
      // 'anti-virus' -> 'anti-virus'

      tokens.push(token);
      return tokens;
    };

    lunr.Pipeline.registerFunction(pipelineFunction, "customPipelineWithoutHyphens");
    builder.pipeline.before(lunr.stemmer, pipelineFunction);
    builder.searchPipeline.before(lunr.stemmer, pipelineFunction);
  }; // set up lunr search index


  var idx = lunr(function () {
    this.tokenizer.separator = /[\s]+/;
    this.use(customPipelineWithoutHyphens);
    this.field("title", {
      boost: 100
    });
    this.field("text", {
      boost: 0.1
    });
    this.field("url");
    this.metadataWhitelist = ["position"];
    searchIndex.pages.forEach(function (page) {
      this.add(page);
    }, this);
  });

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");

      if (pair[0] === variable) {
        var temp = decodeURIComponent(pair[1].replace(/\+/g, "%20"));
        temp = temp.replace(/(<([^>]+)>)/ig, ""); // "strip tags"
        // console.log("Found query", temp);

        return temp;
      }
    }
  } // Grab any query from the URL on bootstrap


  searchTerm = getQueryVariable("search_query"); // set the input box to the search query

  if (typeof searchTerm !== "undefined") {
    searchQueryInput[0].value = searchTerm;
  } // get search box query string


  function getValueFromSearchBox() {
    searchTerm = searchQueryInput[0].value.replace(/(<([^>]+)>)/ig, ""); // "strip tags"

    renderResults();
  } // watch search box for changes


  var searchQueryInputTimeout;
  searchQueryInput[0].addEventListener("keypress", function () {
    if (searchQueryInputTimeout) {
      clearTimeout(searchQueryInputTimeout);
      searchQueryInputTimeout = null;
    }

    searchQueryInputTimeout = setTimeout(getValueFromSearchBox, 600);
  });

  function renderResults() {
    // strip out searches for `vf-` as it's a junk term
    var searchTermTrimmed = searchTerm.replace("vf-", ""); // run the search

    var results = idx.search(searchTermTrimmed);

    if (results.length === 0) {
      searchResultsContainer[0].innerHTML = "No results found";
      return false;
    }

    var searchDestinationPrefix = searchQueryInput[0].dataset.vfSearchClientSideDestinationPrefix; // console.log("searchTermTrimmed", searchTermTrimmed);
    // map the search hits to the search pages

    var resultPages = results.map(function (match) {
      return searchIndex.pages[match.ref];
    }); // generate the HTML markup for the results

    var renderedResults = ""; // if search term, generate output

    if (searchTermTrimmed != "") {
      resultPages.forEach(function (element) {
        if (typeof element !== "undefined") {
          element.text = element.text || "";
          renderedResults += "<a class='result' href='" + searchDestinationPrefix + element.url + "?q=" + searchTerm + "'><h3>" + element.title + "</h3></a>";
          renderedResults += "<p class='snippet'>" + element.text.substring(0, 200) + "</p>";
          renderedResults += "<p><code>" + element.url + "</code></p>";
        }
      });
    } else {// renderedResults = "<p class='snippet'>Enter a search query.</p>";
    } // put the results on the page


    searchResultsContainer[0].innerHTML = renderedResults;
  } // default invocation


  getValueFromSearchBox();
} // You should import this js file at ./components/vf-core/scripts.js
// import { vfcomponentName } from '../components/raw/vf-component/vf-component.js';
// And, if needed, invoke it
// vfSearchClientSide();
// vf-show-more

/**
 * Finds show more containers `data-vf-js-show-more`
 * Finds all "show" buttons on a page and activates them `data-vf-js-show-more-button`
 * Also find options "show less" buttons `data-vf-js-show-more-button--less`
 * Receives number of items to show `data-vf-js-show-more-pager-size`
 * Will add an `.is-active` to the targetList, the display is left to the CSS
 * @param {object} [scope] - the html scope to process, optional, defaults to `document`
 * @example vfShowMore(document.querySelectorAll('.vf-component__container')[0]);
 */


function vfShowMore(scope) {
  /* eslint-disable no-redeclare */
  var scope = scope || document;
  /* eslint-enable no-redeclare */
  // Get relevant elements and collections

  var buttonList = scope.querySelectorAll("[data-vf-js-show-more-button]");
  var buttonHideList = scope.querySelectorAll("[data-vf-js-show-more-button--less]");
  var targetList = scope.querySelectorAll("[data-vf-js-show-more]");
  var pagerSize = scope.querySelectorAll("[data-vf-js-show-more-pager-size]");

  if (pagerSize.length > 0) {
    console.warn("vfShowMore", "Your pager size of " + pagerSize + " was received but this option is currently not supported.");
  }

  if (!buttonList || !targetList) {
    // exit: either buttons or target content not found
    return;
  }

  if (buttonList.length == 0 || targetList.length == 0) {
    // exit: either buttons or target content not found
    return;
  } // initialize


  targetList.forEach(function (targetContent) {
    var itemsToShow = Math.round(targetContent.dataset.vfJsShowMorePagerSize);
    var itemsAvailable = targetContent.querySelectorAll(".vf-show-more__item");

    for (var index = 0; index < itemsAvailable.length; index++) {
      var element = itemsAvailable[index];

      if (index >= itemsToShow) {
        element.classList.add("vf-show-more__item-overflow"); // console.log(element);
      }
    }
  }); // The showing function

  var showIt = function showIt(targetContent) {
    // get the parent of the clicked item
    targetContent = targetContent.closest("[data-vf-js-show-more]");
    targetContent.focus(); // Make the active item focusable by the user (Tab key)

    targetContent.removeAttribute("tabindex"); // Set the selected state

    targetContent.setAttribute("aria-selected", "true");
    targetContent.classList.add("is-active");
  }; // The hiding function


  var hideIt = function hideIt(targetContent) {
    // get the parent of the clicked item
    targetContent = targetContent.closest("[data-vf-js-show-more]");
    targetContent.focus(); // Make the active item focusable by the user (Tab key)

    targetContent.removeAttribute("tabindex"); // Set the selected state

    targetContent.setAttribute("aria-selected", "false");
    targetContent.classList.remove("is-active");
  }; // Add semantics


  Array.prototype.forEach.call(buttonList, function (button) {
    button.parentNode.setAttribute("role", "presentation"); // Reset any active items from a previous JS call

    button.classList.remove("is-active"); // Handle clicking of show more for mouse users

    button.addEventListener("click", function (e) {
      e.preventDefault();
      showIt(e.currentTarget);
    }); // this code is working but seems to not be needed (space and return also invoke)
    // ---
    // Handle keydown events for keyboard users
    // button.addEventListener('keydown', e => {
    //   // Get the index of the current tab in the tabs node list
    //   let index = Array.prototype.indexOf.call(tabs, e.currentTarget);
    //   // Work out which key the user is pressing and
    //   // Calculate the new tab's index where appropriate
    //   let dir = e.which === 37 ? index - 1 : e.which === 39 ? index + 1 : e.which === 40 ? 'down' : null;
    //   if (dir !== null) {
    //     e.preventDefault();
    //     // If the down key is pressed, move focus to the open panel,
    //     // otherwise switch to the adjacent tab
    //     dir === 'down' ? showIt(tabs[dir]) : void 0;
    //   }
    // });
  });

  if (buttonHideList) {
    if (buttonHideList.length != 0) {
      Array.prototype.forEach.call(buttonHideList, function (button) {
        button.parentNode.setAttribute("role", "presentation"); // Reset any active items from a previous JS call

        button.classList.remove("is-active"); // Handle clicking of hide/show less for mouse users

        button.addEventListener("click", function (e) {
          e.preventDefault();
          hideIt(e.currentTarget);
        });
      });
    }
  }
} // // You should also import it at ./components/vf-core/scripts.js
// // import { vfShowMore } from '../components/raw/vf-show-more/vf-show-more.js';
// // And, if needed, invoke it
// // vfShowMore();
// vf-location-nearest

/**
 * Utility method to invalidate prior check.
 * @example vfLocationNearest('load')
 * @param {string} [type] - 'load' or 'unload' to set or unset
 */


function vfLocationNearestIndicate(type) {
  var el = document.querySelector("body");

  if (type == "unload") {
    el.setAttribute("data-vf-location-nearest-loaded", "false");
  } else if (type == "load") {
    el.setAttribute("data-vf-location-nearest-loaded", "true");
    vfLocationNearestDomActions();
  }
}
/**
 * Use the browser location API to try to atuodetct location.
 * @example vfLocationNearestDetect(locationsList)
 * @param {object} [locationsList] - An object of locations
 */


function vfLocationNearestDetect(locationsList) {
  // Via: https://developers.google.com/web/fundamentals/native-hardware/user-location#dont_keep_the_user_waiting_set_a_timeout
  var startPos;
  var geoOptions = {
    enableHighAccuracy: false,
    timeout: 4 * 1000
  };

  var geoSuccess = function geoSuccess(position) {
    startPos = position;
    vfLocationNearestResolve(locationsList, startPos.coords);
  };

  var geoError = function geoError(error) {
    console.warn("vfLocationNearest", "Geolocation error code: " + error.code); // error.code can be:
    //   0: unknown error
    //   1: permission denied
    //   2: position unavailable (error response from location provider)
    //   3: timed out
    // if no match return false

    vfLocationNearestResolve(locationsList, false);
  }; // Bootstrap browserapi


  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
}
/**
 * Receive a location and process it against a user location if any.
 * @example vfLocationNearestResolve(locationsList, userLocation)
 * @param {object} [locationsList] - An object of locations
 * @param {object} [userLocation] - An object with .latitude and .longitude
 */


function vfLocationNearestResolve(locationsList, userLocation) {
  // console.log(locationsList, userLocation);
  // console.log("user at",userLocation.latitude + ", " + userLocation.longitude);
  // Determine which location is closest using circles
  // https://stackoverflow.com/questions/21279559/geolocation-closest-locationlat-long-from-my-position/21297385#21297385
  function calculateNearestCity(latitude, longitude) {
    // Convert Degrees to Radians
    function Deg2Rad(deg) {
      return deg * Math.PI / 180;
    }

    function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
      lat1 = Deg2Rad(lat1);
      lat2 = Deg2Rad(lat2);
      lon1 = Deg2Rad(lon1);
      lon2 = Deg2Rad(lon2);
      var R = 6371; // km

      var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
      var y = lat2 - lat1;
      var d = Math.sqrt(x * x + y * y) * R;
      return d;
    }

    var minDif = 99999;
    var closest = locationsList.default; // loop through each location, matching a close city then the next closest and so on

    for (var key in locationsList) {
      /* eslint-disable no-prototype-builtins */
      if (locationsList.hasOwnProperty(key)) {
        /* eslint-enable no-prototype-builtins */
        if (key != "default") {
          var evalutedLocation = locationsList[key];
          var dif = PythagorasEquirectangular(latitude, longitude, evalutedLocation.latlon.split(", ")[0], evalutedLocation.latlon.split(", ")[1]);

          if (dif < minDif) {
            closest = evalutedLocation;
            closest.id = key;
            minDif = dif;
          }
        }
      }
    }

    return closest;
  }

  if (userLocation == false) {
    // if no match, use the default location
    console.warn("vfLocationNearest", "No user location detected, will use default");
    vfLocationNearestSave(locationsList["default"].name, "default");
  } else {
    // geo diameter matching
    var closestCity = calculateNearestCity(userLocation.latitude, userLocation.longitude);
    vfLocationNearestSave(closestCity.name, closestCity.id);
  }
}
/**
 * Receive a resolved location and assign it to the DOM
 * @example vfLocationNearestSave(locationsList, userLocation)
 * @param {object} [locationName] - A user-facing string
 * @param {string} [locationId] - The ID
 */


function vfLocationNearestSave(locationName, locationId) {
  // console.log('vfLocationNearestSave location',locationName,locationId)
  // assign to the body
  var el = document.querySelector("body");
  el.setAttribute("data-vf-location-nearest-location", locationId);
  el.setAttribute("data-vf-location-nearest-name", locationName); // indicate we've loaded

  vfLocationNearestIndicate("load");
}
/**
 * Observe an element for changes to specify a manual location
 * This may support a "type" but for now it's only a select list
 * @param {object} [locationsList] - An object of locations
 * @param {object} [scope] - the html scope to process, optional, defaults to `document`
 * @example vfLocationNearestOverridePopulate(locationsList, document.vfLocationNearestDomActions('.vf-component__container')[0]);
 */


function vfLocationNearestOverridePopulate(locationsList, scope) {
  /* eslint-disable no-redeclare */
  var scope = scope || document;
  /* eslint-enable no-redeclare */

  var locationWidget = scope.querySelectorAll("[data-vf-js-location-nearest-override-widget]");

  if (!locationWidget) {
    // exit: container not found
    return;
  }

  if (locationWidget.length == 0) {
    // exit: content not found
    return;
  }

  var widget = "<label class=\"vf-form__label\" for=\"vf-form__select\"></label>" + "<select class=\"vf-form__select\" id=\"vf-form__select\">"; // Create the markup for a dropdown

  for (var key in locationsList) {
    /* eslint-disable no-prototype-builtins */
    if (locationsList.hasOwnProperty(key)) {
      /* eslint-enable no-prototype-builtins */
      // const element = locationsList[key];
      widget = widget + "<option value=\"".concat(key, "\">").concat(locationsList[key].name, "</option>");
    }
  }

  widget = widget + "</select>"; // assign values to widget

  locationWidget[0].innerHTML = widget;
}
/**
 * Observe an element for changes to specify a manual location
 * @param {object} [scope] - the html scope to process, optional, defaults to `document`
 * @example vfLocationNearestOverrideActivate(locationsList, document.vfLocationNearestDomActions('.vf-component__container')[0]);
 */


function vfLocationNearestOverrideActivate(scope) {
  /* eslint-disable no-redeclare */
  var scope = scope || document;
  /* eslint-enable no-redeclare */

  var overrideElement = scope.querySelectorAll("[data-vf-js-location-nearest-override-widget]");

  if (!overrideElement) {
    // exit: container not found
    return;
  }

  if (overrideElement.length == 0) {
    // exit: content not found
    return;
  }

  overrideElement[0].addEventListener("change", function (e) {
    var activeItem = e.target; // console.log('You selected: ', activeItem.options[activeItem.target.selectedIndex].text);

    vfLocationNearestSave(activeItem.options[activeItem.selectedIndex].text, activeItem.value);
  });
}
/**
 * With attributes saved to the dom, we can take further action
 * <body data-vf-location-nearest-loaded="true"
 *   data-vf-location-nearest-location="default"
 *   data-vf-location-nearest-name="Heidelberg"
 * @param {object} [scope] - the html scope to process, optional, defaults to `document`
 * @example vfLocationNearestDomActions(document.vfLocationNearestDomActions('.vf-component__container')[0]);
 */


function vfLocationNearestDomActions(scope) {
  /* eslint-disable no-redeclare */
  var scope = scope || document;
  /* eslint-enable no-redeclare */
  // Get items from dom

  var el = document.querySelector("body");
  var locationId = el.getAttribute("data-vf-location-nearest-location");
  var locationName = el.getAttribute("data-vf-location-nearest-name"); // push the active location to the dom

  function assignName() {
    var locationNameHolder = scope.querySelectorAll("[data-vf-js-location-nearest-name]");

    if (!locationNameHolder) {
      // exit: container not found
      return;
    }

    if (locationNameHolder.length == 0) {
      // exit: content not found
      return;
    } // console.log('assignName','pushing the active location to the dom')


    locationNameHolder[0].innerHTML = locationName;
  } // simple activation of any elements/components through simple click simulation


  function activateElements() {
    var locationActivationTargets = scope.querySelectorAll("[data-vf-js-location-nearest-activation-target]");

    if (!locationActivationTargets) {
      // exit: container not found
      return;
    }

    if (locationActivationTargets.length == 0) {
      // exit: content not found
      return;
    }

    locationActivationTargets.forEach(function (element) {
      // console.log(element.getAttribute('data-vf-js-location-nearest-activation-target'));
      if (element.getAttribute("data-vf-js-location-nearest-activation-target") == locationId) {
        element.click();
      }
    });
  }

  assignName();
  activateElements();
}
/**
 * The global function for this component
 * @example vfLocationNearest(locationsList)
 * @param {object} [locationsList] - An object of locations
 */


function vfLocationNearest(locationsList) {
  locationsList = locationsList || {
    default: {
      name: "Heidelberg",
      latlon: "49.4076, 8.6907"
    }
  }; // console.log('vfLocationNearest locationsList',locationsList)
  // unset any prior check

  vfLocationNearestIndicate("unload"); // Insert a widget of selectable locations

  vfLocationNearestOverridePopulate(locationsList); // get the current users location

  vfLocationNearestDetect(locationsList); // enable a manual override widget

  vfLocationNearestOverrideActivate();
} // You should also import it at ./components/vf-component-rollup/scripts.js
// import { vfLocationNearest } from 'vf-location-nearest/vf-location-nearest';
// Or import directly
// import { vfLocationNearest } from '../components/raw/vf-location-nearest/vf-location-nearest.js';
// And, if needed, invoke it
// vfLocationNearest();
// embl-content-hub-loader__html-imports
// A trimmed down version of
// https://github.com/AshleyScirra/html-imports-polyfill/blob/master/htmlimports.js
// mostly we dropped CSS and sub-imports


function emblContentHubLoaderHtmlImports() {
  // Map a script URL to its import document for GetImportDocument()
  // const scriptUrlToImportDoc = new Map();
  function GetPathFromURL(url) {
    if (!url.length) return url; // empty string

    var lastCh = url.charAt(url.length - 1);
    if (lastCh === "/" || lastCh === "\\") return url; // already a path terminated by slash

    var last_slash = url.lastIndexOf("/");
    if (last_slash === -1) last_slash = url.lastIndexOf("\\");
    if (last_slash === -1) return ""; // neither slash found, assume no path (e.g. "file.ext" returns "" as path)

    return url.substr(0, last_slash + 1);
  } // Determine base URL of document.


  var baseElem = document.querySelector("base");
  var baseHref = baseElem && baseElem.hasAttribute("href") ? baseElem.getAttribute("href") : ""; // If there is a base href, ensure it is of the form 'path/' (not '/path', 'path' etc)

  if (baseHref) {
    if (baseHref.startsWith("/")) baseHref = baseHref.substr(1);
    if (!baseHref.endsWith("/")) baseHref += "/";
  }

  function GetBaseURL() {
    return GetPathFromURL(location.origin + location.pathname) + baseHref;
  }

  function FetchAs(url, responseType) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error("Failed to fetch '" + url + "': " + xhr.status + " " + xhr.statusText));
        }
      };

      xhr.onerror = reject;
      xhr.open("GET", url);
      xhr.responseType = responseType;
      xhr.send();
    });
  }

  function _AddImport(url, preFetchedDoc, rootContext, progressObject) {
    /* eslint-disable no-unused-vars */
    var isRoot = false;
    /* eslint-enable no-unused-vars */
    // The initial import creates a root context, which is passed along to all sub-imports.

    if (!rootContext) {
      isRoot = true;
      rootContext = {
        alreadyImportedUrls: new Set(),
        // for deduplicating imports
        stylePromises: [],
        scriptPromises: [],
        progress: progressObject || {} // progress written to this object (loaded, total)

      };
      rootContext.progress.loaded = 0;
      rootContext.progress.total = 1; // add root import
    } // Each import also tracks its own state with its own context.

    /* eslint-disable no-unused-vars */


    var context = {
      importDoc: null,
      baseUrl: GetPathFromURL(url),
      dependencies: []
    };
    /* eslint-enable no-unused-vars */
    // preFetchedDoc is passed for sub-imports which pre-fetch their documents as an optimisation. If it's not passed,
    // fetch the URL to get the document.

    var loadDocPromise;
    if (preFetchedDoc) loadDocPromise = Promise.resolve(preFetchedDoc);else loadDocPromise = FetchAs(url, "document");
    return loadDocPromise.then(function (doc) {
      // HACK: in Edge, due to this bug: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12458748/
      // the fetched document URL is incorrect. doc.URL is also read-only so cannot directly be assigned. To work around this,
      // calculate the correct URL and use Object.defineProperty to override the returned document URL.
      Object.defineProperty(doc, "URL", {
        value: new URL(url, GetBaseURL()).toString()
      }); // we don't need the `body` wrapper, so return the first child

      return doc.body.firstChild;
    });
  }

  function AddImport(url, async, progressObject) {
    // Note async attribute ignored (was only used for old native implementation).
    return _AddImport(url, null, null, progressObject);
  }

  window["addImport"] = AddImport;
} // embl-conditional-edit

/**
 * Invoke emblConditionalEditDetectParam scopped to objects where
 * data-embl-js-conditional-edit is present
 * This will be dynamically run once emblContentHubSignalFinished is triggered.
 */


function emblConditionalEdit() {
  var emblConditionalEditItems = document.querySelectorAll("[data-embl-js-conditional-edit]");

  if (!emblConditionalEditItems) {
    // exit: lists not found
    return;
  }

  if (emblConditionalEditItems.length == 0) {
    // exit: lists not found
    return;
  }

  Array.prototype.forEach.call(emblConditionalEditItems, function (element) {
    emblConditionalEditDetectParam(location.href, element);
  });
}
/**
 * Detects `?embl-conditional-edit=enabled` or `?embl-conditional-edit=1` or ?embl-conditional-edit=true`
 * and adds `.embl-coditional-edit__enabled` to display the edit links
 * @param {string} [url] - the url to check for an enabling param
 * @param {element} [element] - the scopped element to be processed
 * @param {string} [referrer] - what part of the page is asking for a check, we pass this to avoid recursion
 */


function emblConditionalEditDetectParam(url, element, referrer) {
  var captured = /embl-conditional-edit=([^&]+)/.exec(url);

  if (captured == null && referrer != "iframe") {
    // value not found
    // also try against any parent iframe url
    if (window.self !== window.top) {
      console.log(url, parent.window.location.href);
      emblConditionalEditDetectParam(parent.window.location.href, element, "iframe");
    }

    return;
  }

  captured = captured || false; // avoid null

  captured = captured[1];

  if (captured == "1" || captured == "enabled" || captured == "true") {
    element.className += " " + "embl-coditional-edit__enabled";
  }
} // embl-notifications

/**
 * After a notifications has been chosen, build it and insert into the document
 * @example emblNotificationsInject(notification)
 * @param {object} [message] - An object to be show on a page
 */


function emblNotificationsInject(message) {
  var output = document.createElement("div"); // @todo:
  // - add support in contentHub for extra button text, link
  // preparation

  message.body = message.body.replace(/<[/]?[p>]+>/g, " "); // no <p> tags allowed in inline messages, preserve a space to not collide words
  // add vf-link to link

  message.body = message.body.replaceAll("<a href=", "<a class=\"vf-banner__link\" href="); // we might need a more clever regex, but this should also avoid links that already have a class
  // Learn more link is conditionally shown

  if (message.field_notification_link) {
    message.body = "".concat(message.body, " <a class=\"vf-banner__link\" href=\"").concat(message.field_notification_link, "\">Learn more</a>");
  } // custom button text


  message.field_notification_button_text = message.field_notification_button_text || "Close notice"; // notification memory and cookie options

  if (message.field_notification_cookie == "True") {
    output.dataset.vfJsBannerCookieName = message.cookieName;
    output.dataset.vfJsBannerCookieVersion = message.cookieVersion;

    if (message.field_notification_auto_accept == "True") {
      output.dataset.vfJsBannerAutoAccept = true;
    }
  }

  if (message.field_notification_position == "fixed") {
    output.classList.add("vf-banner", "vf-banner--fixed", "vf-banner--bottom", "vf-banner--notice");
    output.dataset.vfJsBanner = true;
    output.dataset.vfJsBannerState = message.field_notification_presentation;
    output.dataset.vfJsBannerButtonText = message.field_notification_button_text; // These features are not yet supported by the notification content type in the EMBL contentHub
    // output.dataset.vfJsBannerExtraButton = "<a href='#'>Optional button</a><a target='_blank' href='#'>New tab button</a>";

    output.innerHTML = "\n      <div class=\"vf-banner__content | vf-grid\" data-vf-js-banner-text>\n        <p class=\"vf-text vf-text-body--2\">".concat(message.body, "</p>\n      </div>");
    var target = document.body.firstChild;
    target.parentNode.prepend(output);
    vfBanner();
  } else if (message.field_notification_position == "inline") {
    output.classList.add("vf-grid", "vf-u-margin__top--400"); // we wrap in vf-grid for layout
    // we use vf-u-margin__top--400 as this element is usually inserted inside a contentHub wrapper and not affected by body.vf-stack
    // if vf-stack is set, this will have no practical affect

    output.innerHTML = "\n      <div class=\"vf-banner vf-banner--alert vf-banner--info | vf-content\">\n        <div class=\"vf-banner__content\">\n          <p class=\"vf-banner__text\">".concat(message.body, "</p>\n        </div>\n      </div>"); // insert after `vf-header` or at after `vf-body`
    // @todo: add support for where "inline" message should be shown
    // @todo: don't rely on the presence of vf-header to show inline notification, maybe <div data-notifications-go-here>

    var _target = document.getElementsByClassName("vf-header");

    if (_target.length > 0) {
      _target[0].parentNode.insertBefore(output, _target[0].nextSibling);
    } else {
      // if no vf-header, perhaps there's a masthead-black-bar?
      var _target2 = document.getElementsByClassName("masthead-black-bar");

      if (_target2.length > 0) {
        _target2[0].parentNode.insertBefore(output, _target2[0].nextSibling);
      } else {
        // if no vf-header, show at vf-body
        // @thought: we might instead make this show as "top"
        var _target3 = document.getElementsByClassName("vf-body");

        if (_target3.length > 0) {
          // output.classList.add('vf-u-grid--reset');
          _target3[0].prepend(output);
        } // if still no success, we soft fail

      }
    }
  } else if (message.field_notification_position == "top") {
    output.classList.add("vf-banner", "vf-banner--fixed", "vf-banner--top", "vf-banner--phase");
    output.dataset.vfJsBanner = true;
    output.dataset.vfJsBannerState = message.field_notification_presentation;
    output.dataset.vfJsBannerButtonText = message.field_notification_button_text; // These features are not yet supported by the notification content type in the EMBL contentHub
    // output.dataset.vfJsBannerExtraButton = "<a href='#'>Optional button</a><a target='_blank' href='#'>New tab button</a>";

    output.innerHTML = "\n      <div class=\"vf-banner__content\" data-vf-js-banner-text>\n        <p class=\"vf-banner__text\">".concat(message.body, "</p>\n      </div>");
    var _target4 = document.body.firstChild;

    _target4.parentNode.prepend(output);

    vfBanner();
  } // console.log('emblNotifications, showing:', message);

}
/**
 * The global function for this component
 * Note: if you use embl-content-hub-loader, it will automatically invoke emblNotifications
 * @example emblNotifications(currentHost, currentPath)
 * @param {string} [currentHost] - a host url www.embl.org
 * @param {string} [currentPath] - a path /people/name
 */


function emblNotifications(currentHost, currentPath) {
  currentHost = currentHost || window.location.hostname;
  currentPath = currentPath || window.location.pathname; // don't treat `wwwdev` as distinct from `www`

  currentHost = currentHost.replace(/wwwdev/g, "www"); // console.log('emblNotifications','Checking for notifications.');
  // console.log('emblNotifications, Current url info:', currentHost + "," + currentPath);
  // Process each message against a URLs

  function matchNotification(message, targetUrl) {
    var matchFound = false;

    if (message.hasBeenShown == true) {
      // console.warn('emblNotifications', 'This message has already been displayed on the page.')
      return;
    } // console.log('emblNotifications, targetUrl:', targetUrl);
    // console.log('emblNotifications, matching:', currentHost+currentPath);
    // Is there an exact match?


    matchFound = compareUrls(currentHost + currentPath, targetUrl); // Handle wildcard matches like `/about/*`

    if (targetUrl.slice(-1) == "*") {
      matchFound = compareUrls(currentHost + currentPath, targetUrl, true);
    } // if a match has been made on the current url path, show the message


    if (matchFound == true) {
      // console.log('emblNotifications: MATCH FOUND ðŸŽ‰', targetUrl, currentHost, currentPath);
      message.hasBeenShown = true;
      emblNotificationsInject(message);
    }
  } // Handle string comparisons for URLs


  function compareUrls(url1, url2, isWildCard) {
    isWildCard = isWildCard || false; // we ignore case
    // we could probably optimise by moving this higher in the logic, but it's more maintainable to have it here

    url1 = url1.toLowerCase();
    url2 = url2.toLowerCase(); // don't allow matches to end in `*`

    if (url1.slice(-1) == "*") url1 = url1.substring(0, url1.length - 1);
    if (url2.slice(-1) == "*") url2 = url2.substring(0, url2.length - 1); // don't allow matches to end in `/`

    if (url1.slice(-1) == "/") url1 = url1.substring(0, url1.length - 1);
    if (url2.slice(-1) == "/") url2 = url2.substring(0, url2.length - 1); // console.log('emblNotifications, comparing:', url1 + "," + url2);

    if (url1 == url2) {
      return true;
    } else if (isWildCard) {
      // console.log('emblNotifications, wildcard comparison:', url1, url2)
      if (url1.indexOf(url2) == 0) {
        // only success if match found from beginning of string
        // we only support wildcards on the right side
        // console.log('emblNotifications: WILDCARD MATCH FOUND ðŸŽ‰');
        return true;
      }
    }

    return false;
  } // Process each message, and its URL fragments


  function processNotifications(messages) {
    // console.log('emblNotifications', messages);
    // Process each message
    for (var index = 0; index < messages.length; index++) {
      var currentMessage = messages[index]; // track if a message has already been show on the page
      // we want to be sure a message isn't accidently shown twice

      currentMessage.hasBeenShown = false; // Process the URLs for each path in a message

      var currentUrls = currentMessage.field_notification_urls.split(",");

      for (var indexUrls = 0; indexUrls < currentUrls.length; indexUrls++) {
        var url = currentUrls[indexUrls].trim();
        matchNotification(currentMessage, url); // pass the notification and active url to compare
      }
    }
  } // Utility to fetch a file, process the JSON


  function loadRemoteNotifications(file) {
    // console.log('emblNotifications','Opening URL :' + file);
    if (window.XMLHttpRequest) {
      var xmlhttp = new XMLHttpRequest();
    }

    xmlhttp.open("GET", file, true);

    xmlhttp.onload = function () {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          // eval(xmlhttp.responseText);
          // var m = m || ''; // make sure the message isn't null
          processNotifications(eval(xmlhttp.responseText));
        } else {
          console.error(xmlhttp.statusText);
        }
      }
    };

    xmlhttp.onerror = function () {
      console.error(xmlhttp.statusText);
    };

    xmlhttp.send(null);
  } // Bootstrap the message fetching
  // If on dev, reference dev server


  if (window.location.hostname.indexOf("wwwdev.") === 0) {
    loadRemoteNotifications("https://wwwdev.embl.org/api/v1/notifications?_format=json&source=contenthub");
  } else if (window.location.hostname.indexOf("localhost") === 0) {
    loadRemoteNotifications("https://wwwdev.embl.org/api/v1/notifications?_format=json&source=contenthub");
  } else {
    loadRemoteNotifications("https://www.embl.org/api/v1/notifications?_format=json&source=contenthub");
  } // Check fallback notifications


  loadRemoteNotifications("https://embl-communications.github.io/embl-notifcations-fallback/notifications.js");
} // Add this to your ./components/vf-component-rollup/scripts.js
// import { emblNotifications } from '../components/raw/embl-notifications/embl-notifications.js';
// And invoke it
// Note: if you use embl-content-hub-loader, it will automatically invoke emblNotifications
// emblNotifications();
// embl-content-hub-loader__fetch

/**
 * Fetch html links from content.embl.org
 */


function emblContentHubFetch() {
  // Some JS utilities
  // via https://stackoverflow.com/a/32135318
  Element.prototype.appendBefore = function (element) {
    element.parentNode.insertBefore(this, element);
  }, false;
  Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
  }, false;
  /**
   * Get the number of days between two dates.
   */

  function days_between(date1, date2) {
    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24; // Convert both dates to milliseconds

    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime(); // Calculate the difference in milliseconds

    var difference_ms = Math.abs(date1_ms - date2_ms); // Convert back to days and return

    return Math.round(difference_ms / ONE_DAY) + 1;
  } // A list of all the links


  var emblContentHubLinks = document.querySelectorAll("[data-embl-js-content-hub-loader]");
  var emblContentHubLinkLoadingProgress = {};
  var emblContentHubShowTimers = false; // Handle the import of each element

  for (var i = 0; i < emblContentHubLinks.length; ++i) {
    (function () {
      var linkPosition = i; // track time it takes for link to be shown

      if (emblContentHubShowTimers) {
        console.time("timer for import " + linkPosition);
      } // await the load of the html import from the polyfill
      // note: we use polyfill in all cases; see https://github.com/visual-framework/vf-core/issues/508


      emblContentHubAwaitLoading(emblContentHubLinks[linkPosition], linkPosition);
    })();
  } // If nothing to import


  if (emblContentHubLinks.length == 0) {
    emblContentHubSignalFinished();
  } // Add a class to the body once the last item has been processed


  function emblContentHubSignalFinished() {
    // @todo, shouldn't require the body element
    document.querySelectorAll("body")[0].classList.add("embl-content-hub-loaded"); // if the JS to run embl-conditional-edit is present, run it now

    if (typeof emblConditionalEdit === "function") {
      emblConditionalEdit();
    } // if the JS to run embl-notifications is present, run it now


    if (typeof emblNotifications === "function") {
      emblNotifications();
    }
  } // Dispatch load to the pollyfill


  function emblContentHubAwaitLoading(targetLink, position) {
    /* global addImport */
    // Docs: https://github.com/AshleyScirra/html-imports-polyfill#usage
    addImport(targetLink.href, null, emblContentHubLinkLoadingProgress).then(function (value) {
      emblContentHubGrabTheContent(targetLink, position, value);

      if (position + 1 == emblContentHubLinks.length) {
        emblContentHubSignalFinished();
      }
    });
  } // Generate a unique ID for the target element on the page


  function emblContentHubGenerateID(position) {
    return "contentDbItem" + ("0000" + position).slice(-5);
  } // Show the remote content


  function emblContentHubGrabTheContent(targetLink, position, exportedContent) {
    // pickup the "meat" of the exported content
    exportedContent = exportedContent || targetLink.import.querySelector(".vf-content-hub-html"); // make sure we have something

    if (!exportedContent) {
      console.log("No content found for this import, exiting. The import may have already been preformed.", targetLink);
      return;
    } // if there is just one child element and it is a div, use that
    // (this helps with css grid layout)


    if (exportedContent.childElementCount === 1 && exportedContent.firstElementChild.innerHTML.trimLeft().substr(0, 4) === "<div") {
      exportedContent = exportedContent.firstElementChild;
      exportedContent.classList.add("vf-content-hub-html");
      exportedContent.classList.add("vf-content-hub-html__derived-div");
    } else if (exportedContent.childNodes.length <= 3) {
      // if there are three or fewer child nodes this is likely a no-results reply
      // We'll still inject the content from the contentHub along with any passed "no matches" text
      var noContentMessage = targetLink.getAttribute("data-embl-js-content-hub-loader-no-content");

      if (noContentMessage !== "null") {
        if (noContentMessage == "true") {
          // use a default
          noContentMessage = "No content was found found for this query.";
        }

        var noContentMessageElement = document.createElement("div");
        noContentMessageElement.classList.add("vf-text");
        noContentMessageElement.classList.add("embl-content-hub-html__no-content-found");
        noContentMessageElement.innerHTML = noContentMessage;
        exportedContent.appendChild(noContentMessageElement.firstChild);
      } // if data-embl-js-content-hub-loader-no-content-hide is true or has a class, hide accordingly


      var noContentHideBehavior = targetLink.getAttribute("data-embl-js-content-hub-loader-no-content-hide");

      if (noContentHideBehavior) {
        if (noContentHideBehavior == "true") {
          // if true, just hide the response
          exportedContent.classList.add("vf-u-display-none");
        } else {
          // otherwise hide any element specified
          document.querySelector(noContentHideBehavior).classList.add("vf-u-display-none");
        }
      } // END noContentHideBehavior

    } // END exportedContent.childElementCount


    var contentID = emblContentHubGenerateID(position); // where does the content go?

    if (targetLink.dataset.target === "self") {
      // if element already exists, remove it
      var oldElement = document.getElementById(contentID);

      if (oldElement) {
        oldElement.innerHTML = exportedContent.innerHTML;
      } else {
        // give content an ID
        exportedContent.setAttribute("id", contentID);
        exportedContent.classList.add(contentID); // just insert the new content

        exportedContent.appendAfter(targetLink);
      } // end if oldElement

    } else {
      var targetLocation = document.querySelector("." + targetLink.dataset.target); // exportedContent.appendAfter(targetLocation);

      targetLocation.classList.add(contentID);
      targetLocation.innerHTML = exportedContent.innerHTML;
    } // display how long it took to load


    if (emblContentHubShowTimers) {
      console.timeEnd("timer for import " + position);
    }

    emblContentHubAssignClasses(targetLink, position);
    emblContentHubUpdateDatesFormat(position); // run JS for some components on content, if they exist
    // note: why do we use "try" here?
    // we would use `typeof(vfBanner)` but if the function is not present it becomes aliased as `vfBanner.vfBanner`,
    // so this `try` method is more reliable

    try {
      vfBanner(targetLocation);
    } catch (error) {
      console.warn("emblContentHubLoader", "vfBanner not found, any contentHub banner-based content will not correctly render.");
    }

    try {
      vfTabs(targetLocation);
    } catch (error) {
      console.warn("emblContentHubLoader", "vfTabs not found, any contentHub tabs-based content will not correctly render.");
    } // don't run breadcrumbs as part of contenthub, use case is different
    // if (typeof(emblBreadcrumbs) === 'function') {
    //   emblBreadcrumbs(); // no scope for emblBreadcrumbs
    // }

  } // Enable class injection after loading contents
  // ... for all those edge cases
  // Background: https://gitlabci.ebi.ac.uk/emblorg/backlog/issues/82
  // Sample:
  //  <link rel="import" href="url" data-target="self"
  //        data-inject-class="vf-grid vf-grid__col-2"
  //        data-inject-class-target="ul"
  //        data-embl-js-content-hub-loader>
  //  This would make the ul a two-column grid.


  function emblContentHubAssignClasses(targetLink, position) {
    // var injectRequests = document.querySelectorAll('[data-inject-class][data-inject-class-target]');
    //
    // for (var i = 0; i < injectRequests.length; ++i) {
    var classesToInject = targetLink.getAttribute("data-inject-class");
    var targetSelectorToInject = targetLink.getAttribute("data-inject-class-target");

    if (classesToInject && targetSelectorToInject) {
      // Limit scope to the imported element
      var targetElement = document.querySelector("." + emblContentHubGenerateID(position)).querySelector(targetSelectorToInject); // We can't inject space separated classes to we need to split it into arrays and add one by one.

      classesToInject = classesToInject.split(" ");

      for (var classNumber = 0; classNumber < classesToInject.length; classNumber++) {
        targetElement.classList.add(classesToInject[classNumber]);
      }
    }
  }
  /**
   * Update the format of close date.
   */


  function emblContentHubUpdateDatesFormat(position) {
    var dateRemainingList = document.querySelector("." + emblContentHubGenerateID(position)).querySelectorAll(".date-days-remaining");
    var todayDate = new Date();

    if (dateRemainingList.length > 0) {
      for (var dateRemainingIndex = 0; dateRemainingIndex < dateRemainingList.length; dateRemainingIndex++) {
        var dateValue = parseInt(dateRemainingList[dateRemainingIndex].getAttribute("data-datetime")) * 1000;
        dateValue = new Date(dateValue);
        var numberOfDiffDays = days_between(dateValue, todayDate); // Update to 'Closes in 6 Days.' format if number of days is less than 30 days.

        if (numberOfDiffDays < 30 && numberOfDiffDays > 1) {
          dateRemainingList[dateRemainingIndex].innerHTML = "Closes in " + "<span>" + numberOfDiffDays + " Days.</span>";
        }

        if (numberOfDiffDays == 1) {
          dateRemainingList[dateRemainingIndex].innerHTML = "Closes in " + "<span>" + numberOfDiffDays + " Day.</span>";
        }
      }
    }
  }
} // embl-content-hub-loader


function emblContentHub() {
  // 1. make sure we have imports or a polyfill
  emblContentHubLoaderHtmlImports(); // 2. import the content

  emblContentHubFetch();
} // embl-content-meta-properties
// In addition to being queried by other components' JS, this could
// also add classes to a page to affect the overall look of a page.

/**
 * Read metaProperties from page's metatags
 * @example emblContentMetaProperties_Read()
 */


function emblContentMetaProperties_Read() {
  var metaProperties = {}; // <!-- Content descriptors -->
  // <meta name="embl:who" content="{{ meta-who }}"> <!-- the people, groups and teams involved -->
  // <meta name="embl:what" content="{{ meta-what }}"> <!-- the activities covered -->
  // <meta name="embl:where" content="{{ meta-where }}"> <!-- at which EMBL sites the content applies -->
  // <meta name="embl:active" content="{{ meta-active }}"> <!-- which of the who/what/where is active -->

  metaProperties.who = metaProperties.who || document.querySelector("meta[name='embl:who']");
  metaProperties.what = metaProperties.what || document.querySelector("meta[name='embl:what']");
  metaProperties.where = metaProperties.where || document.querySelector("meta[name='embl:where']");
  metaProperties.active = metaProperties.active || document.querySelector("meta[name='embl:active']"); // <!-- Content role -->
  // <meta name="embl:utility" content="-8"> <!-- if content is task and work based or if is meant to inspire -->
  // <meta name="embl:reach" content="-5"> <!-- if content is externally (public) or internally focused (those that work at EMBL) -->

  metaProperties.utility = metaProperties.utility || document.querySelector("meta[name='embl:utility']");
  metaProperties.reach = metaProperties.reach || document.querySelector("meta[name='embl:reach']"); // <!-- Page infromation -->
  // <meta name="embl:maintainer" content="{{ meta-maintainer }}"> <!-- the contact person or group responsible for the page -->
  // <meta name="embl:last-review" content="{{ meta-last-review }}"> <!-- the last time the page was reviewed or updated -->
  // <meta name="embl:review-cycle" content="{{ meta-review-cycle }}"> <!-- how long in days before the page should be checked -->
  // <meta name="embl:expiry" content="{{ meta-expiry }}"> <!-- if there is a fixed point in time when the page is no longer relevant -->

  metaProperties.maintainer = metaProperties.maintainer || document.querySelector("meta[name='embl:maintainer']");
  metaProperties.lastReview = metaProperties.lastReview || document.querySelector("meta[name='embl:last-review']");
  metaProperties.reviewCycle = metaProperties.reviewCycle || document.querySelector("meta[name='embl:review-cycle']");
  metaProperties.expiry = metaProperties.expiry || document.querySelector("meta[name='embl:expiry']");

  for (var key in metaProperties) {
    if (metaProperties[key] != null && metaProperties[key].getAttribute("content").length != 0) {
      metaProperties[key] = metaProperties[key].getAttribute("content");
    } else {
      metaProperties[key] = "notSet";
    }
  }

  return metaProperties;
} // embl-breadcrumbs-lookup
// to hold the EMBL taxonomy


var emblTaxonomy = {}; // placeholders for our new breadcrumbs

var emblBreadcrumbPrimary = document.createElement("ul");
emblBreadcrumbPrimary.classList.add("vf-breadcrumbs__list", "vf-list", "vf-list--inline");
var emblBreadcrumbRelated = document.createElement("ul");
emblBreadcrumbRelated.classList.add("vf-breadcrumbs__list", "vf-breadcrumbs__list--related", "vf-list", "vf-list--inline"); // we store the primarily breadcrumb so it can be accessed by related crumbs, if needed

var primaryBreadcrumb;
/**
 * Look up a breadcrumb by its uuid and return the entry
 * @example emblBreadcrumbLookupByUuid(uuid)
 * @param {string} [uuid]  - the uuid of a term
 */

function emblBreadcrumbLookupByUuid(uuid) {
  // console.log('emblBreadcrumbLookupByUuid',uuid);
  if (emblTaxonomy.terms[uuid]) {
    // console.log('emblBreadcrumbLookupByUuid',emblTaxonomy.terms[uuid]);
    return emblTaxonomy.terms[uuid];
  }
}
/**
 * Take any appropriate actions depending on present metaTags
 * @example emblBreadcrumbsLookup()
 * @param {object} [metaProperties] - if you do not have meta tags on the page,
 *                                    you can explicitly pass options
 */


function emblBreadcrumbsLookup(metaProperties) {
  var emblBreadcrumbTarget = document.querySelectorAll("[data-embl-js-breadcrumbs-lookup]");

  if (emblBreadcrumbTarget.length === 0) {
    // console.warn('There is no `[data-embl-js-breadcrumbs-lookup]` in which to insert the breadcrumbs; exiting');
    return false;
  }

  if (emblBreadcrumbTarget.length > 1) {
    console.warn("There is more than one `[data-embl-js-breadcrumbs-lookup]` in which to insert the breadcrumbs; continuing but only the first element will be updated.");
  }

  if (metaProperties.active == "notSet") {
    // @todo: we could infer the active breadcrumb if only one is passed
    console.warn("There is no active EMBL breadcrumb specified, cannot proceed looking up breadcrumbs.");
    return false;
  }

  var majorFacets = ["who", "what", "where"]; // do the primary breadcrumb first

  emblBreadcrumbAppend(emblBreadcrumbTarget, metaProperties[metaProperties.active], metaProperties.active, "primary"); // do the non-primary meta terms
  // @todo: we probably shouldn't do related if there is no primary

  for (var i = 0; i < majorFacets.length; i++) {
    if (majorFacets[i] != metaProperties.active) {
      emblBreadcrumbAppend(emblBreadcrumbTarget, metaProperties[majorFacets[i]], majorFacets[i], "related");
    }
  } // make a 'related' label


  var relatedLabel = document.createElement("span");
  relatedLabel.innerHTML = "Related:";
  relatedLabel.classList.add("vf-breadcrumbs__heading"); // If no related terms were found, hide the related label
  // we only hide it as we could add related terms later

  if (emblBreadcrumbRelated.childNodes.length == 0) {
    relatedLabel.classList.add("vf-u-display-none");
  } // now that we've processed all the meta properties, insert our rendered breadcrumbs


  emblBreadcrumbTarget[0].innerHTML = emblBreadcrumbPrimary.outerHTML + relatedLabel.outerHTML + emblBreadcrumbRelated.outerHTML;
}
/**
 * Get the EMBL taxonomy json from the ContentHub
 * @example emblGetTaxonomy()
 * @param {string} [url] - URL to pull the taxonomy from
 */


function emblGetTaxonomy(url) {
  /* eslint-disable no-redeclare */
  var url = url || "https://www.embl.org/api/v1/pattern.json?pattern=embl-ontology&source=contenthub";
  /* eslint-disable no-redeclare */

  return new Promise(function (resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open("GET", url);

    req.onload = function () {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // @todo: some sort of caching here, perhaps we write to local storage.
        // @todo: abstract this out into its own `embl-taxonomy` component?
        // capture the taxonomy in the global var
        emblTaxonomy = JSON.parse(req.response); // Resolve

        resolve();
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    }; // Handle network errors


    req.onerror = function () {
      reject(Error("Error loading ontology"));
    }; // Make the request


    req.send();
  });
}
/**
 * Receive a term and its context and create a breadcrumb
 * @example emblBreadcrumbAppend(breadcrumbTarget,term,facet,type)
 * @param {dom elements} [breadcrumbTarget]  - elements with data-embl-js-breadcrumbs-lookup
 * @param {string} [termName]  - the taxonomy item found, e.g. `Cancer`
 * @param {string} [facet] - the facet of the taxonomy (`who`, `what` or `where`)
 * @param {string} [type]  - if this is a `primary` or `related` path
 */


function emblBreadcrumbAppend(breadcrumbTarget, termName, facet, type) {
  // console.log('Processing breadcrumb for:', termName + ', ' + facet + ', ' + type);
  function getCurrentTerm(termName) {
    var termObject; // store the match

    if (termName === "EMBL") termName = "All EMBL sites"; // hack as we're not using IDs
    // if a term has not been passed, attempt to use the primary term's parent information
    // @todo: add a flag to explicitly "dontLookup" or "doLookup"

    if (termName == "notSet") {
      termName = ""; // we'll either find a positive termObject or not show anything
      // console.log('here',primaryBreadcrumb)

      if (primaryBreadcrumb.parents) {
        if (primaryBreadcrumb.parents[facet]) {
          termName = primaryBreadcrumb.parents[facet];
        }
      }
    } // if using a `string/NameOfThing` value, not accordingly


    if (termName.indexOf("string/") >= 0) {
      console.warn("embl-js-breadcrumbs-lookup: using a passed string value to make breadcrumbs " + termName);
      termName = termName.replace("string/", "");
    } // scan through all terms and find a match, if any


    function emblBreadcrumbLookup(termName) {
      // @todo: if a UUID meta property is set, use that
      // if it's UUID match we use that
      termObject = emblBreadcrumbLookupByUuid(termName);

      if (typeof termObject != "undefined") {
        return; //exit
      } // We prefer profiles


      Array.prototype.forEach.call(Object.keys(emblTaxonomy.terms), function (termId) {
        var term = emblTaxonomy.terms[termId];

        if (term.type == "profile") {
          if (term.name === termName) {
            termObject = term;
            return; //exit
          }
        }
      }); // If no profile found, match other types of taxonomy entries

      if (typeof termObject === "undefined") {
        Array.prototype.forEach.call(Object.keys(emblTaxonomy.terms), function (termId) {
          var term = emblTaxonomy.terms[termId];

          if (term.type != "profile") {
            if (term.name === termName) {
              termObject = term;
              return; //exit
            }
          }
        });
      } // If there's still no match, see if we can find a matching display name
      // @todo: this is an easy win but creates messy matching, but maybe that's ok if you're not using UUID
      // There's a risk of multiple "training" entries
      // We prefer profiles


      Array.prototype.forEach.call(Object.keys(emblTaxonomy.terms), function (termId) {
        var term = emblTaxonomy.terms[termId];

        if (term.type == "profile") {
          if (term.name_display === termName) {
            termObject = term;
            return; //exit
          }
        }
      }); // If no profile found, match other types of taxonomy entries

      if (typeof termObject === "undefined") {
        Array.prototype.forEach.call(Object.keys(emblTaxonomy.terms), function (termId) {
          var term = emblTaxonomy.terms[termId];

          if (term.type != "profile") {
            if (term.name_display === termName) {
              termObject = term;
              return; //exit
            }
          }
        });
      }
    } // don't scan for junk matches


    if (termName != "notSet" && termName != "" && termName != "none") {
      emblBreadcrumbLookup(termName);
    } // Validation and protection
    // we never want to return undefined


    if (termObject == undefined || termObject == null) {
      termObject = {}; // generate fallback links
      // console.warn('embl-js-breadcrumbs-lookup: No matching breadcrumb found for `' + termName + '`; Will formulate a URL.');

      if (facet == "who") {
        // fallback for people: search people directory
        termObject.url = "https://www.embl.org/search/?searchQuery=" + termName.replace(/[\W_]+/g, " ").replace(/\s+/g, "-").toLowerCase() + "&activeFacet=People%20directory&origin=breadcrumbTermNotFound";
      } else {
        // otherwise try and search
        termObject.url = "https://www.embl.org/search/#stq=" + termName + "&taxonomyFacet=" + facet + "&origin=breadcrumbTermNotFound"; // if no link specified, do a search
      }

      termObject.name_display = termName;
      termObject.uuid = "null";
      termObject.uuid = [];
    } else if (typeof termObject.url == "undefined") {
      // if entry was found but no link specified, generate a url for a search
      var urlFacet = "";

      if (termObject.primary != undefined) {
        // prepare a search facet if available
        urlFacet = "&taxonomyFacet=" + termObject.primary;
      }

      termObject.url = "https://www.embl.org/search/#stq=" + termObject.name + urlFacet + "&origin=breadcrumbTaxonomy";
    }

    return termObject;
  }
  /**
   * Take a term and get its parent term UUID
   * todo: this lookup is, perhaps, flawed as it gives us each ancestor, irregardless
   *       of it's who/what/where path, but maybe this will provide an interesting
   *       "odeur d'information"
   * @example getBreadcrumbParentTerm(parents,context)
   * @param {array} [parents]  - array of UUIDs
   * @param {string} [facet] - who, what, where
   * @param {object} [lastParent] - term object to prevent recursion, optional
   */


  function getBreadcrumbParentTerm(parents, facet, lastParent) {
    // var parentTodos = {
    //   // 1: 'Respect the parent term context: who/what/where'
    //   // 2: 'scan the taxonomy and get any parent IDs',
    //   // 3: 'if there are parent IDs, add breadcrumb and set URL',
    //   // 4: 'if parent was found, does the parent have a parent?'
    // };
    // console.log('Todos for getBreadcrumbParentTerm():',parentTodos);

    /* eslint-disable no-redeclare */
    var lastParent = lastParent || {}; // track last insertion to prevent recursion

    /* eslint-enable no-redeclare */

    if (parents == undefined || parents == null) {
      // no parent breadcrumb preset, exiting
      return;
    }

    function insertParent(activeParent) {
      if (activeParent == undefined || activeParent == null) {
        console.warn("embl-js-breadcrumbs-lookup: No matching parent found; Stopping parent lookup.");
        return;
      }

      activeParent.url = activeParent.url || "#no_url_specified";

      if (activeParent.name.indexOf(" root term") > 0) {
        // if we've reached a root term, abort lookups and don't insert a root term as a crumb
        return;
      }

      if (activeParent.primary == facet) {
        // only insert crumb if it respects the original term context: who/what/where
        if (activeParent.uuid != lastParent.uuid) {
          // no recursive output
          emblBreadcrumbPrimary.innerHTML = formatBreadcrumb(activeParent.name_display, activeParent.url, false) + emblBreadcrumbPrimary.innerHTML;
        }
      } // get parents of parent


      if (activeParent.parents) {
        if (activeParent.uuid != lastParent.uuid) {
          lastParent = activeParent;
          getBreadcrumbParentTerm(activeParent.parents, facet, lastParent);
        } else {
          console.log("embl-js-breadcrumbs-lookup", "Recursion in parent lookup. Check the EMBL.org Profile. Aborting lookup.");
          console.log("embl-js-breadcrumbs-lookup", "activeParent", activeParent);
          console.log("embl-js-breadcrumbs-lookup", "lastParent", lastParent);
        }
      }
    }

    var activeParent;

    if (parents[facet]) {
      // if a parent has structured who/what/where parents
      activeParent = emblTaxonomy.terms[parents[facet]];
      insertParent(activeParent);
    } else {
      // otherwise lookup each parent
      parents.forEach(function (parentId) {
        // recursive test
        // parentId = '0c79d36e-ed33-482d-a396-15a0b2bc4540';
        activeParent = emblTaxonomy.terms[parentId];
        insertParent(activeParent);
      });
    }

    return;
  }
  /**
   * Generate HTML for a new breadcrumb
   * @example formatBreadcrumb(term,breadcrumbUrl)
   * @param {string} [termName]  - the taxonomy string of the item, e.g. `Cancer`
   * @param {string} [breadcrumbUrl] - a fully formed URL, or 'null' to not make a link
   * @param {boolean} [current] - if the breadcrumb is the current page
   */


  function formatBreadcrumb(termName, breadcrumbUrl, current) {
    if (termName == "" || termName == "none") {
      // if no term, do nothing
      return "";
    }

    if (current) {
      current = " aria-current=\"location\"";
    }

    var newBreadcrumb = "<li class=\"vf-breadcrumbs__item\"" + current + ">";

    if (breadcrumbUrl && breadcrumbUrl !== "null" && breadcrumbUrl !== "#no_url_specified") {
      newBreadcrumb += "<a href=\"" + breadcrumbUrl + "\" class=\"vf-breadcrumbs__link\">" + termName + "</a>";
    } else {
      newBreadcrumb += termName;
    }

    newBreadcrumb += "</li>";
    return newBreadcrumb;
  }

  var currentTerm = getCurrentTerm(termName);
  /* eslint-disable no-unused-vars */

  var breadcrumbId = currentTerm.uuid,
    breadcrumbUrl = currentTerm.url,
    breadcrumbParents = currentTerm.parents,
    breadcrumbCurrent = false;
  /* eslint-enable no-unused-vars */
  // narrow down to the first matching element

  breadcrumbTarget = breadcrumbTarget[0];

  if (type == "primary") {
    // save it
    primaryBreadcrumb = currentTerm;
    var breadcrumbPath = new URL(breadcrumbUrl).pathname;
    var breadcrumbPathPrefix = ""; // if a crumb does or does not end in a "/" account for that

    if (breadcrumbPath.slice(-1) == "/") {
      breadcrumbPathPrefix == breadcrumbPath.slice(0, -1);
    } else {
      breadcrumbPathPrefix = breadcrumbPath + "/";
    } // check if the current breadcrumb is the current url


    if (breadcrumbPath == window.location.pathname || breadcrumbPathPrefix == window.location.pathname) {
      breadcrumbUrl = null;
      breadcrumbCurrent = true;
    } // add breadcrumb


    emblBreadcrumbPrimary.innerHTML += formatBreadcrumb(currentTerm.name_display, breadcrumbUrl, breadcrumbCurrent); // fetch parents for primary path

    getBreadcrumbParentTerm(breadcrumbParents, facet);
  } else if (type == "related") {
    // add breadcrumb
    emblBreadcrumbRelated.innerHTML += formatBreadcrumb(currentTerm.name_display, breadcrumbUrl, breadcrumbCurrent);
  }
}

function emblBreadcrumbs() {
  //clear existing breadcrumbs
  emblBreadcrumbPrimary.innerText = "";
  emblBreadcrumbRelated.innerText = ""; // We start the breadcrumbs by first getting the EMBL taxonomy.

  emblGetTaxonomy().then(function () {
    // console.log('emblTaxonomy', emblTaxonomy);
    // Preprocess the emblTaxonomy for some cleanup tasks
    Array.prototype.forEach.call(Object.keys(emblTaxonomy.terms), function (termId) {
      var term = emblTaxonomy.terms[termId]; // If `name_display` is not set, use the internal name

      if (term.name_display === "") term.name_display = term.name; // handle null URL

      if (term.url === "") term.url = "#no_url_specified";
    }); // Invoke embl-content-meta-properties function to pull tags from page

    emblBreadcrumbsLookup(emblContentMetaProperties_Read());
  }, function (error) {
    console.warn("Failed to get EMBL ontology", error);
    var emblBreadcrumbTarget = document.querySelectorAll("[data-embl-js-breadcrumbs-lookup]");

    if (emblBreadcrumbTarget.length > 0) {
      emblBreadcrumbTarget[0].innerHTML = "<!-- Breadcrumbs failed to render due to network issue -->";
    }
  });
} // Prepend polyfill for IE
// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md


(function (arr) {
  arr.forEach(function (item) {
    /* eslint-disable no-prototype-builtins */
    if (item.hasOwnProperty("prepend")) {
      return;
    }
    /* eslint-enable no-prototype-builtins */


    Object.defineProperty(item, "prepend", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function prepend() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();
        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });
        this.insertBefore(docFrag, this.firstChild);
      }
    });
  });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]); // Run it on default
// emblBreadcrumbs();
// vf-back-to-top

/**
 * Function for JS scroll to top functionality
 * That must be executed exactly once
 * @example vfBackToTop()
 */


function vfBackToTop() {
  // add click handler on ALL of the "Back to top" links on page
  var links = document.querySelectorAll("[data-vf-js-back-to-top]");

  var _iterator = _createForOfIteratorHelper(links),
    _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var link = _step.value;
      link.addEventListener("click", function (event) {
        // if target element has href defined, prevent it from navigating. Href is a non-js fallback
        event.preventDefault(); // we get scroll target if from data param of element

        var scrollToId = event.target.dataset.scrollToId; // Get the element with given id or body if no id provided

        var targetElement = scrollToId ? document.getElementById(scrollToId) : document.body; // Scroll to the element

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth"
          });
        }
      });
    } // On scrolling, show or hide "Back to top" link when scroll is past one full screen height

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  window.addEventListener("DOMContentLoaded", function () {
    //only handle first floating element, ignore additional elements
    var floatingElement = document.querySelector("[data-vf-js-back-to-top-floating]");

    if (!floatingElement) {
      //exit, no floating button element found
      return;
    } //hide initially


    setVisible(floatingElement, false); // Add handler only if floating element present

    if (floatingElement) {
      window.addEventListener("scroll", function () {
        // current scrollY value is past one full screen height?
        var isScrollPastWindowHeight = window.scrollY >= window.innerHeight; // toggle visibility

        setVisible(floatingElement, isScrollPastWindowHeight);
      });
    }
  });
}

function setVisible(element, isVisible) {
  element.style.visibility = isVisible ? "visible" : "hidden";
} // vf-dropdown

/**
 * Function for JS scroll to top functionality
 * That must be executed exactly once
 * @example vfDropdown()
 */


function vfDropdown() {
  var components = document.querySelectorAll("[data-vf-js-dropdown]");

  var _iterator2 = _createForOfIteratorHelper(components),
    _step2;

  try {
    var _loop = function _loop() {
      var component = _step2.value;
      component.addEventListener("click", function () {
        component.classList.toggle("vf-dropdown--open");
      });
    };

    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
} // vf-navigation
// only required for vf-navigation--on-this-page

/**
 * Function for JS scroll to top functionality
 * That must be executed exactly once
 * @example vfNavigationOnThisPage()
 */


function vfNavigationOnThisPage() {
  var sectionList = document.querySelectorAll("[data-vf-js-navigation-on-this-page-container='true'],[data-vf-js-navigation-on-this-page-container='1']")[0];
  var section = document.querySelectorAll("[id]");
  var sectionPositions = {};
  var i = 0;

  if (!sectionList || !section) {
    // exit: either sections or section content not found
    return;
  }

  if (sectionList.length == 0 || section.length == 0) {
    // exit: either sections or section content not found
    return;
  }

  section.forEach(function (e) {
    sectionPositions[e.id] = e.offsetTop;
  });

  function activateNavigationItem() {
    var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

    for (i in sectionPositions) {
      // this implements a scrollspy concept based on https://codepen.io/zchee/pen/ogzvZZ
      if (sectionPositions[i] <= scrollPosition + 70) {
        // we activate the section 70 pixels before coming into view, as the sticky bar will cover it
        // only add remove the class if there is a new section to activate
        if (sectionList.querySelector("a[href*=" + i + "]") != null) {
          sectionList.querySelector("[aria-selected]").removeAttribute("aria-selected");
          sectionList.querySelector("a[href*=" + i + "]").setAttribute("aria-selected", "true");
        }
      }
    }
  }

  window.onscroll = function () {
    // we could introduce throttling, but as this is a fairly simple repaint, throttling is not likely required
    window.requestAnimationFrame(activateNavigationItem);
  };
} // vf-mega-menu
// Don't need JS? Then feel free to delete this file.

/*
 * A note on the Visual Framework and JavaScript:
 * The VF is primarily a CSS framework so we've included only a minimal amount
 * of JS in components and it's fully optional (just remove the JavaScript selectors
 * i.e. `data-vf-js-tabs`). So if you'd rather use Angular or Bootstrap for your
 * tabs, the Visual Framework won't get in the way.
 *
 * When querying the DOM for elements that should be acted on:
 * ðŸš« Don't: const tabs = document.querySelectorAll('.vf-tabs');
 * âœ… Do:    const tabs = document.querySelectorAll('[data-vf-js-tabs]');
 *
 * This allows users who would prefer not to have this JS engage on an element
 * to drop `data-vf-js-component` and still maintain CSS styling.
 */
// Uncomment this boilerplate
// // if you need to import any other components' JS to use here
// import { vfOthercomponent } from vfImportPrefix + '../vf-other-component/vf-other-component';
//


function initMegaMenu(megaMenuComponent) {
  //add activated class to this mega menu. This will help us differentiate when menu is processed with JS and when its not.
  megaMenuComponent.classList.add("vf-mega-menu__activated");
  var previousMenuLinkComponent, previousExpandedSectionComponent;

  function getWidth() {
    return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
  }

  megaMenuComponent.querySelectorAll("[data-vf-js-mega-menu-section-id]").forEach(function (item) {
    item.addEventListener('click', function (event) {
      // For now we do not show the mega menu on mobile.
      // We still need to decide on approach for mobile support.
      if (getWidth() > 768) {
        event.preventDefault();
        event.vfMegaMenuLink = true;
        var linkComponent = event.target;
        var newReferences = handleMenuClick(linkComponent, previousMenuLinkComponent, previousExpandedSectionComponent);
        previousMenuLinkComponent = newReferences === null || newReferences === void 0 ? void 0 : newReferences.previousMenuLinkComponent;
        previousExpandedSectionComponent = newReferences === null || newReferences === void 0 ? void 0 : newReferences.previousExpandedSectionComponent;
      } else {
        console.warn("vf-mega-menu: No mega menu shown. Mega menu is currently alpha and not supported on small screen sizes. Your screens size is ".concat(getWidth()));
      } // console.log({ linkComponent });
      // console.log({ previousMenuLinkComponent });
      // const associatedSection = linkComponent.getAttribute(
      //   "data-vf-js-mega-menu-section-id"
      // );

    });
  });
}

function handleMenuClick(menuItemComponent, previousMenuLinkComponent, previousExpandedSectionComponent) {
  // console.log("expand / collapse");
  // debugger;
  var sectionAttribute = menuItemComponent.getAttribute("data-vf-js-mega-menu-section-id");
  var section = document.querySelector("[data-vf-js-mega-menu-section=\"".concat(sectionAttribute, "\"]")); // console.log("section", section, sectionAttribute);

  if (!section) {
    return;
  } // Capture clicks on things other than mega menu elements
  // https://www.blustemy.io/detecting-a-click-outside-an-element-in-javascript/


  document.addEventListener("click", function (evt) {
    var targetElement = evt.target; // clicked element

    do {
      if (targetElement == section || evt.vfMegaMenuLink == true) {
        // This is a click inside. Do nothing, just return.
        // console.log("Clicked inside!")
        return;
      } // Go up the DOM


      targetElement = targetElement.parentNode;
    } while (targetElement); // This is a click outside.
    // console.log("Clicked outside!")


    if (section.getAttribute("aria-hidden") === "false") {
      // console.log("hiding!")
      section.setAttribute("aria-hidden", "true");
    }
  }); //0. if section is visible, just hide it

  if (section.getAttribute("aria-hidden") === "false") {
    section.setAttribute("aria-hidden", "true");
    menuItemComponent.classList.remove("is-expanded");
    return;
  } //1. section is hidden. Hide all sections


  if (previousExpandedSectionComponent) {
    previousExpandedSectionComponent.setAttribute("aria-hidden", "true");
  } //2. remove highlight from previous link


  if (previousMenuLinkComponent) {
    previousMenuLinkComponent.classList.remove("is-expanded");
  } //3. show new section and add class to new link


  section.setAttribute("aria-hidden", "false");
  menuItemComponent.classList.add("is-expanded"); //4. return new link and section components to be stored as previous

  return {
    previousMenuLinkComponent: menuItemComponent,
    previousExpandedSectionComponent: section
  };
} // function createMenuSectionMap(megaMenuComponent) {
//   const allMenuComponents = megaMenuComponent.querySelectorAll(
//     "[data-vf-js-mega-menu-section-id]"
//   );
//   const menuSectionsMap = new Map();
//   allMenuComponents.forEach((component) => {
//     const sectionAttribute = component.getAttribute(
//       "data-vf-js-mega-menu-section-id"
//     );
//     const section = megaMenuComponent.querySelector(
//       `[data-vf-js-mega-menu-section="${sectionAttribute}"]`
//     );
//     menuSectionsMap.set(component, section);
//   });
//   return menuSectionsMap;
// }

/**
 * The global function for this component
 * @example vfMegaMenu(firstPassedVar)
 * @param {string} [firstPassedVar]  - An option to be passed
 */


function vfMegaMenu(firstPassedVar) {
  firstPassedVar = firstPassedVar || 'defaultVal';
  var allMegaMenuComponents = document.querySelectorAll("[data-vf-js-mega-menu]") || []; //for each mega-menu

  allMegaMenuComponents.forEach(initMegaMenu);
} // You should also import it at ./components/vf-component-rollup/scripts.js
// import { vfMegaMenu } from 'vf-mega-menu/vf-mega-menu';
// Or import directly
// import { vfMegaMenu } from '../components/raw/vf-mega-menu/vf-mega-menu.js';
// And, if needed, invoke it
// vfMegaMenu();

/*
 *
 * scripts.js
 * The Visual Framework kitchen sink of JavaScript.
 * Import this as a quick way to get *everything*,
 *
 */


vfBanner();
vfBannerElixir();
var vfGaTrackOptions = {
  vfGaTrackPageLoad: true
};
vfGaIndicateLoaded(vfGaTrackOptions);
vfTabs();
vfTree();
vfShowMore();
emblContentHub();
emblBreadcrumbs();
vfBackToTop();
vfDropdown();
vfNavigationOnThisPage();
vfMegaMenu(); // No default invokation
