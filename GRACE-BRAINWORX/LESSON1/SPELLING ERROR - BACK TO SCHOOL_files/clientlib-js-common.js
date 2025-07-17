var isEdit;
// $(document).on("click", '.cmp-accordion__button', function() {
// var buttonval = $(this).hasClass("cmp-accordion__button--expanded");
//     if(buttonval == true){
// 	$(this).children('hr').css("display", "none");
// 	$(this).children('i').addClass('up');
//      $(this).children('i').removeClass('down');
//     } else {
// 		$(this).children('hr').css("display", "block");
//         $(this).children('i').addClass('down');
//         $(this).children('i').removeClass('up');

//     }

// });


$(document).ready(function() {
	$('.accButt').click(function() {
		me = $(this).attr('id');
		drop = '#accDrop'+me.substring(7);
		butt = '#accButt'+me.substring(7);
		if($(drop).css('display')=='none') {
			$(drop).css('display','block');
			$(butt).addClass('openButt').attr('aria-expanded','true');
		}
		else {
			$(drop).css('display','none');
			$(butt).removeClass('openButt').attr('aria-expanded','false');
		}
	});
});
function linkFlunky(thatLink, thatParam, thatCode) {
  var thisLink = new URL(thatLink); // urlify the link for processing
  thisLink.searchParams.delete(thatParam); // check if param already exists and remove it
  var ourLink = thisLink.toString(); // back to a string for the rest

  var hashFinder = ourLink.indexOf("#"); // check for anchor

  if (hashFinder != -1) {
    var newLink = ourLink.substr(0, hashFinder);
    var theHash = ourLink.substr(hashFinder);
  } else {
    var newLink = ourLink;
    var theHash = "";
  }

  if (newLink.indexOf("?") != -1) {
    // has ?
    var joiner = "&";
  } else {
    var joiner = "?";
  }

  window.open(
    newLink + joiner + thatParam + "=" + thatCode + theHash,
    "_blank"
  );
}

$(document).ready(function () {
  $("#reviewedByTop a").click(function (event) {
    event.preventDefault();
    linkFlunky(this.href, "external_id", "RE2350801010600"); // link, param, code
  });

  $("#departmentSpecialty a").click(function (event) {
    event.preventDefault();
    linkFlunky(this.href, "external_id", "RE2350830010600");
  });

  $("#reviewedBy a").click(function (event) {
    event.preventDefault();
    linkFlunky(this.href, "external_id", "RE2350801010600");
  });

  $("#kh-nemours-footer-logo a").click(function (event) {
    event.preventDefault();
    linkFlunky(this.href, "external_id", "RE2350803010600");
  });

  $("#kh-brightstart-footer-logo a").click(function (event) {
    event.preventDefault();
    linkFlunky(this.href, "external_id", "RE2350803010600");
  });
});


$(document).ready(function() {
	if (isEdit != undefined) {
		if (isEdit == 'true') {
			$('img').each(function() {
				if ($(this).hasClass('left')) {
					$(this).removeClass('left');
				} else if ($(this).hasClass('right')) {
					$(this).removeClass('right');
				}

			});
		}
}
});
/*******************************************************************************
 * Copyright 2018 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    var NS = "cmp";
    var IS = "carousel";

    var keyCodes = {
        SPACE: 32,
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };

    var selectors = {
        self: "[data-" +  NS + '-is="' + IS + '"]'
    };

    var properties = {
        /**
         * Determines whether the Carousel will automatically transition between slides
         *
         * @memberof Carousel
         * @type {Boolean}
         * @default false
         */
        "autoplay": {
            "default": false,
            "transform": function(value) {
                return !(value === null || typeof value === "undefined");
            }
        },
        /**
         * Duration (in milliseconds) before automatically transitioning to the next slide
         *
         * @memberof Carousel
         * @type {Number}
         * @default 5000
         */
        "delay": {
            "default": 5000,
            "transform": function(value) {
                value = parseFloat(value);
                return !isNaN(value) ? value : null;
            }
        },
        /**
         * Determines whether automatic pause on hovering the carousel is disabled
         *
         * @memberof Carousel
         * @type {Boolean}
         * @default false
         */
        "autopauseDisabled": {
            "default": false,
            "transform": function(value) {
                return !(value === null || typeof value === "undefined");
            }
        }
    };

    /**
     * Carousel Configuration
     *
     * @typedef {Object} CarouselConfig Represents a Carousel configuration
     * @property {HTMLElement} element The HTMLElement representing the Carousel
     * @property {Object} options The Carousel options
     */

    /**
     * Carousel
     *
     * @class Carousel
     * @classdesc An interactive Carousel component for navigating a list of generic items
     * @param {CarouselConfig} config The Carousel configuration
     */
    function Carousel(config) {
        var that = this;

        if (config && config.element) {
            init(config);
        }

        /**
         * Initializes the Carousel
         *
         * @private
         * @param {CarouselConfig} config The Carousel configuration
         */
        function init(config) {
            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");

            setupProperties(config.options);
            cacheElements(config.element);

            that._active = 0;
            that._paused = false;

            if (that._elements.item) {
                refreshActive();
                bindEvents();
                resetAutoplayInterval();
                refreshPlayPauseActions();
            }

            if (window.Granite && window.Granite.author && window.Granite.author.MessageChannel) {
                /*
                 * Editor message handling:
                 * - subscribe to "cmp.panelcontainer" message requests sent by the editor frame
                 * - check that the message data panel container type is correct and that the id (path) matches this specific Carousel component
                 * - if so, route the "navigate" operation to enact a navigation of the Carousel based on index data
                 */
                new window.Granite.author.MessageChannel("cqauthor", window).subscribeRequestMessage("cmp.panelcontainer", function(message) {
                    if (message.data && message.data.type === "cmp-carousel" && message.data.id === that._elements.self.dataset["cmpPanelcontainerId"]) {
                        if (message.data.operation === "navigate") {
                            navigate(message.data.index);
                        }
                    }
                });
            }
        }

        /**
         * Caches the Carousel elements as defined via the {@code data-carousel-hook="ELEMENT_NAME"} markup API
         *
         * @private
         * @param {HTMLElement} wrapper The Carousel wrapper element
         */
        function cacheElements(wrapper) {
            that._elements = {};
            that._elements.self = wrapper;
            var hooks = that._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                var capitalized = IS;
                capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
                var key = hook.dataset[NS + "Hook" + capitalized];
                if (that._elements[key]) {
                    if (!Array.isArray(that._elements[key])) {
                        var tmp = that._elements[key];
                        that._elements[key] = [tmp];
                    }
                    that._elements[key].push(hook);
                } else {
                    that._elements[key] = hook;
                }
            }
        }

        /**
         * Sets up properties for the Carousel based on the passed options.
         *
         * @private
         * @param {Object} options The Carousel options
         */
        function setupProperties(options) {
            that._properties = {};

            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    var property = properties[key];
                    var value = null;

                    if (options && options[key] != null) {
                        value = options[key];

                        // transform the provided option
                        if (property && typeof property.transform === "function") {
                            value = property.transform(value);
                        }
                    }

                    if (value === null) {
                        // value still null, take the property default
                        value = properties[key]["default"];
                    }

                    that._properties[key] = value;
                }
            }
        }

        /**
         * Binds Carousel event handling
         *
         * @private
         */
        function bindEvents() {
            if (that._elements["previous"]) {
                that._elements["previous"].addEventListener("click", function() {
                    navigate(getPreviousIndex());
                });
            }

            if (that._elements["next"]) {
                that._elements["next"].addEventListener("click", function() {
                    navigate(getNextIndex());
                });
            }

            var indicators = that._elements["indicator"];
            if (indicators) {
                for (var i = 0; i < indicators.length; i++) {
                    (function(index) {
                        indicators[i].addEventListener("click", function(event) {
                            navigateAndFocusIndicator(index);
                        });
                    })(i);
                }
            }

            if (that._elements["pause"]) {
                if (that._properties.autoplay) {
                    that._elements["pause"].addEventListener("click", onPauseClick);
                }
            }

            if (that._elements["play"]) {
                if (that._properties.autoplay) {
                    that._elements["play"].addEventListener("click", onPlayClick);
                }
            }

            that._elements.self.addEventListener("keydown", onKeyDown);

            if (!that._properties.autopauseDisabled) {
                that._elements.self.addEventListener("mouseenter", onMouseEnter);
                that._elements.self.addEventListener("mouseleave", onMouseLeave);
            }
        }

        /**
         * Handles carousel keydown events
         *
         * @private
         * @param {Object} event The keydown event
         */
        function onKeyDown(event) {
            var index = that._active;
            var lastIndex = that._elements["indicator"].length - 1;

            switch (event.keyCode) {
                case keyCodes.ARROW_LEFT:
                case keyCodes.ARROW_UP:
                    event.preventDefault();
                    if (index > 0) {
                        navigateAndFocusIndicator(index - 1);
                    }
                    break;
                case keyCodes.ARROW_RIGHT:
                case keyCodes.ARROW_DOWN:
                    event.preventDefault();
                    if (index < lastIndex) {
                        navigateAndFocusIndicator(index + 1);
                    }
                    break;
                case keyCodes.HOME:
                    event.preventDefault();
                    navigateAndFocusIndicator(0);
                    break;
                case keyCodes.END:
                    event.preventDefault();
                    navigateAndFocusIndicator(lastIndex);
                    break;
                case keyCodes.SPACE:
                    if (that._properties.autoplay && (event.target !== that._elements["previous"] && event.target !== that._elements["next"])) {
                        event.preventDefault();
                        if (!that._paused) {
                            pause();
                        } else {
                            play();
                        }
                    }
                    if (event.target === that._elements["pause"]) {
                        that._elements["play"].focus();
                    }
                    if (event.target === that._elements["play"]) {
                        that._elements["pause"].focus();
                    }
                    break;
                default:
                    return;
            }
        }

        /**
         * Handles carousel mouseenter events
         *
         * @private
         * @param {Object} event The mouseenter event
         */
        function onMouseEnter(event) {
            clearAutoplayInterval();
        }

        /**
         * Handles carousel mouseleave events
         *
         * @private
         * @param {Object} event The mouseleave event
         */
        function onMouseLeave(event) {
            resetAutoplayInterval();
        }

        /**
         * Handles pause element click events
         *
         * @private
         * @param {Object} event The click event
         */
        function onPauseClick(event) {
            pause();
            that._elements["play"].focus();
        }

        /**
         * Handles play element click events
         *
         * @private
         * @param {Object} event The click event
         */
        function onPlayClick() {
            play();
            that._elements["pause"].focus();
        }

        /**
         * Pauses the playing of the Carousel. Sets {@code Carousel#_paused} marker.
         * Only relevant when autoplay is enabled
         *
         * @private
         */
        function pause() {
            that._paused = true;
            clearAutoplayInterval();
            refreshPlayPauseActions();
        }

        /**
         * Enables the playing of the Carousel. Sets {@code Carousel#_paused} marker.
         * Only relevant when autoplay is enabled
         *
         * @private
         */
        function play() {
            that._paused = false;

            // If the Carousel is hovered, don't begin auto transitioning until the next mouse leave event
            var hovered = false;
            if (that._elements.self.parentElement) {
                hovered = that._elements.self.parentElement.querySelector(":hover") === that._elements.self;
            }
            if (that._properties.autopauseDisabled || !hovered) {
                resetAutoplayInterval();
            }

            refreshPlayPauseActions();
        }

        /**
         * Refreshes the play/pause action markup based on the {@code Carousel#_paused} state
         *
         * @private
         */
        function refreshPlayPauseActions() {
            setActionDisabled(that._elements["pause"], that._paused);
            setActionDisabled(that._elements["play"], !that._paused);
        }

        /**
         * Refreshes the item markup based on the current {@code Carousel#_active} index
         *
         * @private
         */
        // removed function to stop error on home page - test
        function refreshActive() {
            // empty version to prevent another error
        }
        // function refreshActive() {
        //     var items = that._elements["item"];
        //     var indicators = that._elements["indicator"];

        //     if (items) {
        //         if (Array.isArray(items)) {
        //             for (var i = 0; i < items.length; i++) {
        //                 if (i === parseInt(that._active)) {
        //                     items[i].classList.add("cmp-carousel__item--active");
        //                     items[i].removeAttribute("aria-hidden");
        //                     indicators[i].classList.add("cmp-carousel__indicator--active");
        //                     indicators[i].setAttribute("aria-selected", true);
        //                     indicators[i].setAttribute("tabindex", "0");
        //                 } else {
        //                     items[i].classList.remove("cmp-carousel__item--active");
        //                     items[i].setAttribute("aria-hidden", true);
        //                     indicators[i].classList.remove("cmp-carousel__indicator--active");
        //                     indicators[i].setAttribute("aria-selected", false);
        //                     indicators[i].setAttribute("tabindex", "-1");
        //                 }
        //             }
        //         } else {
        //             // only one item
        //             items.classList.add("cmp-carousel__item--active");
        //             indicators.classList.add("cmp-carousel__indicator--active");
        //         }
        //     }
        // }

        /**
         * Focuses the element and prevents scrolling the element into view
         *
         * @param {HTMLElement} element Element to focus
         */
        function focusWithoutScroll(element) {
            var x = window.scrollX || window.pageXOffset;
            var y = window.scrollY || window.pageYOffset;
            element.focus();
            window.scrollTo(x, y);
        }

        /**
         * Retrieves the next active index, with looping
         *
         * @private
         * @returns {Number} Index of the next carousel item
         */
        function getNextIndex() {
            return that._active === (that._elements["item"].length - 1) ? 0 : that._active + 1;
        }

        /**
         * Retrieves the previous active index, with looping
         *
         * @private
         * @returns {Number} Index of the previous carousel item
         */
        function getPreviousIndex() {
            return that._active === 0 ? (that._elements["item"].length - 1) : that._active - 1;
        }

        /**
         * Navigates to the item at the provided index
         *
         * @private
         * @param {Number} index The index of the item to navigate to
         */
        function navigate(index) {
            if (index < 0 || index > (that._elements["item"].length - 1)) {
                return;
            }

            that._active = index;
            refreshActive();

            // reset the autoplay transition interval following navigation, if not already hovering the carousel
            if (that._elements.self.parentElement) {
                if (that._elements.self.parentElement.querySelector(":hover") !== that._elements.self) {
                    resetAutoplayInterval();
                }
            }
        }

        /**
         * Navigates to the item at the provided index and ensures the active indicator gains focus
         *
         * @private
         * @param {Number} index The index of the item to navigate to
         */
        function navigateAndFocusIndicator(index) {
            navigate(index);
            focusWithoutScroll(that._elements["indicator"][index]);
        }

        /**
         * Starts/resets automatic slide transition interval
         *
         * @private
         */
        function resetAutoplayInterval() {
            if (that._paused || !that._properties.autoplay) {
                return;
            }
            clearAutoplayInterval();
            that._autoplayIntervalId = window.setInterval(function() {
                if (document.visibilityState && document.hidden) {
                    return;
                }
                var indicators = that._elements["indicators"];
                if (indicators !== document.activeElement && indicators.contains(document.activeElement)) {
                    // if an indicator has focus, ensure we switch focus following navigation
                    navigateAndFocusIndicator(getNextIndex());
                } else {
                    navigate(getNextIndex());
                }
            }, that._properties.delay);
        }

        /**
         * Clears/pauses automatic slide transition interval
         *
         * @private
         */
        function clearAutoplayInterval() {
            window.clearInterval(that._autoplayIntervalId);
            that._autoplayIntervalId = null;
        }

        /**
         * Sets the disabled state for an action and toggles the appropriate CSS classes
         *
         * @private
         * @param {HTMLElement} action Action to disable
         * @param {Boolean} [disable] {@code true} to disable, {@code false} to enable
         */
        function setActionDisabled(action, disable) {
            if (!action) {
                return;
            }
            if (disable !== false) {
                action.disabled = true;
                action.classList.add("cmp-carousel__action--disabled");
            } else {
                action.disabled = false;
                action.classList.remove("cmp-carousel__action--disabled");
            }
        }
    }

    /**
     * Reads options data from the Carousel wrapper element, defined via {@code data-cmp-*} data attributes
     *
     * @private
     * @param {HTMLElement} element The Carousel element to read options data from
     * @returns {Object} The options read from the component data attributes
     */
    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    /**
     * Document ready handler and DOM mutation observers. Initializes Carousel components as necessary.
     *
     * @private
     */
    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Carousel({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body             = document.querySelector("body");
        var observer         = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new Carousel({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

}());


$( document ).ready(function() {

    if($(".kh-slideshow-kids") != undefined && $(".kh-slideshow-kids").length > 0){

        toggleButton(1);
    }

});

function toggleSlide(n) {
    var a = parseInt(n)
    var index = parseInt($(".cmp-carousel__item--active").attr("data-slidenumber"));
    var k = a + index;
    toggleButton(k);
}

function toggleButton(item){
    itemCount = $("#counting").attr("data-slidestotalcount");
    $("#slidenumber").html(item);
    $("#totalcount").html(itemCount);

       if(item==1){
          $("#firstslide").hide();
          $("#nextslide").show();
       }else if(item==itemCount){
         $("#nextslide").hide();
           $("#firstslide").show();
       } else{
      $("#nextslide").show();
          $("#firstslide").show();
      }
    if(itemCount==1){
          $("#firstslide").hide();
          $("#nextslide").hide();
      }
  }
// New SPLATS
// Author: Marcos Drake
/* 	This new SPLAT functionality pulls the title and description from the existing SPLAT
		definition as defined via Alfresco, then presents it in a new accessible container
*/
$(document).ready(function () {
	defMaker();
	if($('body').attr('id')==='licensee' && $('#subCatHeaderLink').length>0) {
			if(isItMobile==='1') {
				var oneWita = 40;
				var witPad = 6;
			}
			else {
				var oneWita = 29;
				var witPad = 6;
			}
		var witaHeight = Number((($("#subCatLinks li").length)*oneWita)-witPad);
		
		}
	else if($('body').attr('id')==='licensee') {
		var witaHeight = 3;
	}
	else { // mothership
		var witaHeight = 0;
	}
	if($('body').attr('id')==='mothership' && ($("#mobad_in_if"))) { // need to add check for collapsed ad
		 if($("#mobad_in_if").css('display')==="none") {
			 	witaHeight = 250;
		// alert('witaHeight9: '+witaHeight);
		 }
		else {
			witaHeight = 0;
		//	alert('else');
		}

	}
	
	defPos(witaHeight);
	$(window).resize(function () {
		defPos(0);
	});

	$(window).scroll(function () {
		defPos(0); // recalculate defintion position
	});
	
	$("a.definition").click(function(event) { // added because IA recommend an empty href instead of tabindex="0" and I don't want random jumps if somebody clicks the SPLAT word
		event.preventDefault();
	});
	
	$("#subCatHeaderLink").click(function(){ // reset defpos when wita clicked
		defPos(0);
	});
});




$(document).keydown(function (e) {
	if (e.key === "Escape") {
		$('.aSplat').remove();
	}
});

function defMaker() { // goes through existing SPLAT definitions on page and adds some attributes for the new SPLAT
	$(".definition").attr({
		//tabindex: '0',
		//role: 'button',
		href: '#', // I preferred tabindex:0 and role:button but IA recommends href:# and aria-disabled:true
		'aria-disabled': 'true',
		'aria-describedby': function () {
			return $(this).attr("onfocus").slice(16, -1)
		},
		id: function () {
			return $(this).attr("onfocus").slice(20, -1)
		}
	});
}

function defPos(witaOffset) { // location only part of defMaker for resize & scroll
	$(".definition").attr({
		'data-left': function () {
			return $(this).offset().left
		},
		'data-top': function () {
				return (($(this).offset().top)-witaOffset)
		
		}
	});
}

function doTooltip(e, msg) {
	defPos(0);
	var splatID = e.srcElement.getAttribute('aria-describedby');
	var splatTitle = $(msg).find('.splatHeader').text();
	var splatBody = $(msg).find('.innerDef').text();
	var splatTitleLength = splatTitle.length;
	var splatDef = splatBody.substr(splatTitleLength);
	var triggerID = e.srcElement.getAttribute('id');
	var splatLocX = e.pageX;
	var splatLocY = e.pageY;
	
	
	
	var dOL = e.srcElement.getAttribute('data-left'); // definition offset left
	var dOT = e.srcElement.getAttribute('data-top'); // definition offset top

	
	createSplat(splatTitle, splatDef, splatLocX, splatLocY, splatID, triggerID, dOL, dOT);
}

function createSplat(st, sd, posX, posY, sID, tID, dOL, dOT) {
	var splatC = document.createElement('div');
	splatC.id = sID;
	splatC.className = 'aSplat';


	splatC.setAttribute('role', 'tooltip');
	var splatH = document.createElement('p');
	splatH.className = 'splatH';
	splatH.innerHTML = st;
	var splatX = document.createElement('button');
	splatX.className = 'splatX';
	splatX.setAttribute('onclick', 'hideTip()');
	splatX.setAttribute('tabindex', '0');
	splatX.innerHTML = '<span class="hideOffScreen">Press Escape to close</span>';
	var splatD = document.createElement('p');
	splatD.className = 'splatD';
	splatD.innerHTML = sd;
	splatC.appendChild(splatH);
	splatC.appendChild(splatD);
	splatC.appendChild(splatX);



	$(splatC).css('left', (Math.round(dOL) + 20)); // set splat position based on cursor position
	$(splatC).css('top', (Math.round(dOT) + 20));


	displaySplat(splatC, sID, dOL, dOT);
}

function displaySplat(sc, sID, dOL, dOT) {

	$('body').append(sc); // add the SPLAT to the page
	/* Next we need to work out the screen position and position the SPLAT accordingly, ensuring that it doesn't 
	go beyond the screen */
	var sH = '';
	var sOT = '';
	var wH = '';
	var sT = '';
	var sL = '';
	var newST = '';
	var sH = $('.aSplat').height() + 20; // SPLAT height
	var sW = $('.aSplat').width() + 20; // SPLAT width
	var sOT = $('.aSplat').offset().top; // SPLAT offset from top
	var wH = $(window).height(); // window height
	var wW = $(window).width(); // window width
	var sOL = $('.aSplat').offset().left; // SPLAT offset left
	var wST = $(window).scrollTop();
	// I found some inconsistancy using the vars straight up, so now will go through converting them to numbers
	var nSH = Number(sH);
	var nSW = Number(sW);
	var nSOT = Number(sOT);
	var nWH = Number(wH);
	var nWW = Number(wW);
	var nSOL = Number(sOL);
	var nWST = Number(wST);
	var nDOL = Number(dOL);
	var nDOT = Number(dOT);
	
	

	

	/* Default alignment (CSS) aligns left of SPLAT to .definition word
		 But we'll need to avoid any overflow */
		
	/* Next the offset to make sure we don't go beyond the screen */
	
	if (nWW < 560) { // Screen too narrow to worry about horizontal alignment 
		$('.aSplat').css({
			left: '20px',
			width: (nWW - 70) + 'px'
		});
	} else { // okay, we need to care if there will be overflow
		if ((nDOL + (nSW + 20)) > nWW) { // SPLAT will overflow right
			if ((nDOL > (nWW / 2)) || (nDOL < sW / 2)) { // can't center, push further left
				if ((nDOL < nSW)) { // can't go left, will overflow there
					$('.aSplat').css({ // align with left of screen (+20)
						left: '20px'
					});
				} else { // align right of .definition
					var newSOL = ((nDOL - nSW) + 20);
					$('.aSplat').css({
						left: newSOL + 'px'
					});
				}
			} else { // center on definition
				var newSOL = (nDOL - (nSW / 2) + 20);
				//  center on dol
				$('.aSplat').css({
					left: newSOL + 'px'
				});
			}
		}
	}

	/* Now top/bottom overflow protection */
	// First let's check that the screen is tall enough to worry about vertical alignment
	
	if (nWH < (nSH + 140) || nWH < 300) {
		$(".aSplat").css('top', (nDOT-(nSH/2))+'px');
	//	$(".aSplat").css('border','5px solid red');
		
	} else {
		if (((nDOT - nWST) - nSH) < 105) { // will overlap top
			if (((nDOT - nWST) + nSH) > (nWH - 30)) { // will overlap the bottom too! (short screen)
				$(".aSplat").css('top', nDOT - (nSH / 2) + 'px');
			//	$(".aSplat").css('border','5px solid purple');

			} else {
				$(".aSplat").css('top', nSOT + 'px'); // push Down
			//	$(".aSplat").css('border','5px solid green');
			}
		} else if (((nDOT - nWST) + nSH) > (nWH - 30)) { // will overflow bottom
			$(".aSplat").css('top', ((nDOT - (nSH))) + 'px'); // push up
		//	$(".aSplat").css('border','5px solid pink');
		} else { // no up/down overflow issues
			$(".aSplat").css('top', ((nDOT)+20) + 'px'); // push Down
		//	$(".aSplat").css('border','5px solid orange');

		}
	}
}

function getSplatHeight(sID) {
	var splatHeight = $('.aSplat').height();
}


function hideTip() {
	$('.aSplat').remove();
	
}

$(document).ready(function() {

$("div.rte-image ul span.kh_longline_list").each(function(){
   var $ul = $(this).parents("ul");
   $ul.addClass("kh_longline_list");
   $(this).removeClass("kh_longline_list");
});

$("div.rte-image ol span.kh_longline_list").each(function(){
   var $ol = $(this).parents("ol");
   $ol.addClass("kh_longline_list");
   $(this).removeClass("kh_longline_list");
});

    if($("div#khcontent_article div.cmp-container div:first-child.rte-image img.right").length > 0){
        var index = 1; 
        $("div#khcontent_article div.cmp-container div:first-child.rte-image").children().each(function(){
            if($(this).html() !=""){
                if($(this).find("img.right").length > 0 && index == 1){
                    if($($(this).find("img.right")[0]).parents("p").length == 0){
					$("div#languagePairLink").addClass("languagePair_with_image ");
                    }
                              return false;
                }
                if(index > 1){
                   return false;
                }
                index++;
            }
        });
    }else{
       if($($("div#khcontent_article div.cmp-container").children()[1]).find("img.right").length > 0){
          var index = 1; 
          $($("div#khcontent_article div.cmp-container").children()[1]).children().each(function(){
            if($(this).html() !=""){
                var isValidCondition = true;
                if($($($("div#khcontent_article div.cmp-container").children()[0])).find("h3,h4,h5,h6").length == 1){
                    isValidCondition = false;
                }
                if($(this).find("img.right").length > 0 && index == 1 && isValidCondition){
                                                                                $("div#languagePairLink").addClass("languagePair_with_image ");
                             return false;
                }
                if(index > 1){
                   return false;
                }
                index++;
            }
        });

       }
    }  
});
/* removed as part of switch from fragment identifier to session storage
function customCreateCookie(catName,$this){
var $ul = $($this).parents("ul");
	if($ul != undefined){
		var $ulValue = $ul.attr("id").replace("cat","").replace("List","");
		createCookie('khStickierCat',$ulValue);
	}
}
*/
$(document).ready(function() {

  $( ".singlevideo .khad-button" ).click(function() {
   var videoUrl = '';
   if (this.hasAttribute('data-video-audiodesc')) {
        var videoId = this.getAttribute('data-video-id');
        var videoAdId = this.getAttribute('data-video-audiodesc');
        var videoSource = this.getAttribute('data-video-source').toLowerCase();
        if(videoSource=='youtube') {
          var videoHost = 'https://www.youtube.com/embed/';
        } else if (videoSource=='vimeo') {
          var videoHost = 'https://player.vimeo.com/video/';
        }

        if (this.closest('.khad-container').getAttribute('ad-enabled') == 'false') {
          this.closest('.khad-container').setAttribute('ad-enabled', 'true');
          this.setAttribute('aria-label', 'Toggle Audio Description. Audio description is on');
          this.classList.add('ad-on');
          videoUrl = videoAdId ? videoHost.concat(videoAdId) : '';
        } else {
          videoId = this.getAttribute('data-video-id');
          this.closest('.khad-container').setAttribute('ad-enabled', 'false');
          this.setAttribute('aria-label', 'Toggle Audio Description. Audio description is off');
          this.classList.remove('ad-on');
          videoUrl = videoId ? videoHost.concat(videoId) : '';
        }
         this.closest('.video').querySelector('.video-iframe').setAttribute('src', videoUrl);
      }
});
  
   
});
$(document).ready(function() {
    $(".Tilevideo .khad-button" ).click(function() {
        var videoUrl = '';
        if (this.hasAttribute('data-video-audiodesc')) {
            var videoId = this.getAttribute('data-video-id');
            var videoAdId = this.getAttribute('data-video-audiodesc');
            var videoSource = this.getAttribute('data-video-source');
            var videoSource = this.getAttribute('data-video-source').toLowerCase();
            if(videoSource=='youtube') {
                var videoHost = 'https://www.youtube.com/embed/';
            } else if (videoSource=='vimeo') {
                var videoHost = 'https://player.vimeo.com/video/';
            }

            if (this.closest('.khad-container').getAttribute('ad-enabled') == 'false') {
                this.closest('.khad-container').setAttribute('ad-enabled', 'true');
                this.setAttribute('aria-label', 'Toggle Audio Description. Audio description is on');
                this.classList.add('ad-on');
                videoUrl = videoAdId ? videoHost.concat(videoAdId) : '';
            } else {
                videoId = this.getAttribute('data-video-id');
                this.closest('.khad-container').setAttribute('ad-enabled', 'false');
                this.setAttribute('aria-label', 'Toggle Audio Description. Audio description is off');
                this.classList.remove('ad-on');
                videoUrl = videoId ? videoHost.concat(videoId) : '';
            }
            this.closest('.Tilevideo').querySelector('.video-iframe').setAttribute('src', videoUrl);
        }
    });
});

