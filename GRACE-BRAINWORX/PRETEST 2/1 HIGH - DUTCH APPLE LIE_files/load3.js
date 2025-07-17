"use strict";
(function() {
	var x = function() {
		var afterTclkEquals = (window.location.search.substring(0, 6) === "?tclk=")
			? window.location.search.substring(6)
			: window.location.search.split("&tclk=")[1];
		if (typeof afterTclkEquals === "string") {
			var dblEncTclk = encodeURIComponent(afterTclkEquals.split("&")[0]);
			var elements = document.getElementsByTagName("*");
			for (var i = 0, max = elements.length; i < max; i++) {
				if (elements[i].nodeName === "A" || elements[i].nodeName === "AREA") {
					var href = elements[i].getAttribute("href");
					if (typeof href === "string" && href.indexOf("/c/", 0) >= 0) {
						elements[i].setAttribute("href", href + "/t," + dblEncTclk);
					}
				} else if (elements[i].nodeName === "FORM") {
					var action = elements[i].getAttribute("action");
					if (typeof action === "string" && action.indexOf("/c/", 0) >= 0) {
						elements[i].setAttribute("action", action + "/t," + dblEncTclk);
					}
				} else if (elements[i].nodeName === "INPUT" || elements[i].nodeName === "BUTTON") {
					var formaction = elements[i].getAttribute("formaction");
					if (typeof formaction === "string" && formaction.indexOf("/c/", 0) >= 0) {
						elements[i].setAttribute("formaction", formaction + "/t," + dblEncTclk);
					}
				}
			}
			if (typeof connextra_scenes !== "undefined") {
				for (var scene in connextra_scenes) {
					if (typeof connextra_scenes[scene]["frames"] !== "undefined") {
						for (var frame in connextra_scenes[scene]["frames"]) {
							if (typeof connextra_scenes[scene]["frames"][frame]["clickthrough"] === "string") {
								connextra_scenes[scene]["frames"][frame]["clickthrough"] += "/t," + dblEncTclk
								if (typeof connextra_scenes[scene]["frames"][frame]["fields"] !== "undefined") {
									for (var field in connextra_scenes[scene]["frames"][frame]["fields"]) {
										if (typeof connextra_scenes[scene]["frames"][frame]["fields"][field]["frames"] !== "undefined") {
											for (var subframe in connextra_scenes[scene]["frames"][frame]["fields"][field]["frames"]) {
												if (typeof connextra_scenes[scene]["frames"][frame]["fields"][field]["frames"][subframe]["clickthrough"] === "string") {
													connextra_scenes[scene]["frames"][frame]["fields"][field]["frames"][subframe]["clickthrough"] += "/t," + dblEncTclk
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};
	if (window.addEventListener) {
		window.addEventListener("load", x, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", x);
	}
}());