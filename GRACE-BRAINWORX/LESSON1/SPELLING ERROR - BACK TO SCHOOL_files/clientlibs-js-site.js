/*
 * easy-autocomplete
 * jQuery plugin for autocompletion
 * 
 * @author Łukasz Pawełczak (http://github.com/pawelczak)
 * @version 1.3.5
 * Copyright  License: 
 */

/*
 * EasyAutocomplete - Configuration 
 */
var EasyAutocomplete = (function(scope){

	scope.Configuration = function Configuration(options) {
		var defaults = {
			data: "list-required",
			url: "list-required",
			dataType: "json",

			listLocation: function(data) {
				return data;
			},

			xmlElementName: "",

			getValue: function(element) {
				return element;
			},

			autocompleteOff: true,

			placeholder: false,

			ajaxCallback: function() {},

			matchResponseProperty: false,

			list: {
				sort: {
					enabled: false,
					method: function(a, b) {
						a = defaults.getValue(a);
						b = defaults.getValue(b);
						if (a < b) {
							return -1;
						}
						if (a > b) {
							return 1;
						}
						return 0;
					}
				},

				maxNumberOfElements: 6,

				hideOnEmptyPhrase: true,

				match: {
					enabled: false,
					caseSensitive: false,
					method: function(element, phrase) {

						if (element.search(phrase) > -1) {
							return true;
						} else {
							return false;
						}
					}
				},

				showAnimation: {
					type: "normal", //normal|slide|fade
					time: 400,
					callback: function() {}
				},

				hideAnimation: {
					type: "normal",
					time: 400,
					callback: function() {}
				},

				/* Events */
				onClickEvent: function() {},
				onSelectItemEvent: function() {},
				onLoadEvent: function() {},
				onChooseEvent: function() {},
				onKeyEnterEvent: function() {},
				onMouseOverEvent: function() {},
				onMouseOutEvent: function() {},	
				onShowListEvent: function() {},
				onHideListEvent: function() {}
			},

			highlightPhrase: true,

			theme: "",

			cssClasses: "",

			minCharNumber: 0,

			requestDelay: 0,

			adjustWidth: false,

			ajaxSettings: {},

			preparePostData: function(data, inputPhrase) {return data;},

			loggerEnabled: true,

			template: "",

			categoriesAssigned: false,

			categories: [{
				maxNumberOfElements: 4
			}]

		};
		
		var externalObjects = ["ajaxSettings", "template"];

		this.get = function(propertyName) {
			return defaults[propertyName];
		};

		this.equals = function(name, value) {
			if (isAssigned(name)) {
				if (defaults[name] === value) {
					return true;
				}
			} 
			
			return false;
		};

		this.checkDataUrlProperties = function() {
			if (defaults.url === "list-required" && defaults.data === "list-required") {
				return false;
			}
			return true;
		};
		this.checkRequiredProperties = function() {
			for (var propertyName in defaults) {
				if (defaults[propertyName] === "required") {
					logger.error("Option " + propertyName + " must be defined");
					return false;
				}
			}
			return true;
		};

		this.printPropertiesThatDoesntExist = function(consol, optionsToCheck) {
			printPropertiesThatDoesntExist(consol, optionsToCheck);
		};


		prepareDefaults();

		mergeOptions();

		if (defaults.loggerEnabled === true) {
			printPropertiesThatDoesntExist(console, options);	
		}

		addAjaxSettings();

		processAfterMerge();
		function prepareDefaults() {

			if (options.dataType === "xml") {
				
				if (!options.getValue) {

					options.getValue = function(element) {
						return $(element).text();
					};
				}

				
				if (!options.list) {

					options.list = {};
				} 

				if (!options.list.sort) {
					options.list.sort = {};
				}


				options.list.sort.method = function(a, b) {
					a = options.getValue(a);
					b = options.getValue(b);
					if (a < b) {
						return -1;
					}
					if (a > b) {
						return 1;
					}
				
					return 0;
				};

				if (!options.list.match) {
					options.list.match = {};
				}

				options.list.match.method = function(element, phrase) {

					if (element.search(phrase) > -1) {
						return true;
					} else {
						return false;
					}
				};

			}
			if (options.categories !== undefined && options.categories instanceof Array) {

				var categories = [];

				for (var i = 0, length = options.categories.length; i < length; i += 1) { 

					var category = options.categories[i];

					for (var property in defaults.categories[0]) {

						if (category[property] === undefined) {
							category[property] = defaults.categories[0][property];
						}
					}

					categories.push(category);
				}

				options.categories = categories;
			}
		}

		function mergeOptions() {

			defaults = mergeObjects(defaults, options);

			function mergeObjects(source, target) {
				var mergedObject = source || {};

				for (var propertyName in source) {
					if (target[propertyName] !== undefined && target[propertyName] !== null) {

						if (typeof target[propertyName] !== "object" || 
								target[propertyName] instanceof Array) {
							mergedObject[propertyName] = target[propertyName];
						} else {
							mergeObjects(source[propertyName], target[propertyName]);
						}
					}
				}
			
				/* If data is an object */
				if (target.data !== undefined && target.data !== null && typeof target.data === "object") {
					mergedObject.data = target.data;
				}

				return mergedObject;
			}
		}	


		function processAfterMerge() {
		
			if (defaults.url !== "list-required" && typeof defaults.url !== "function") {
				var defaultUrl = defaults.url;
				defaults.url = function() {
					return defaultUrl;
				};
			}

			if (defaults.ajaxSettings.url !== undefined && typeof defaults.ajaxSettings.url !== "function") {
				var defaultUrl = defaults.ajaxSettings.url;
				defaults.ajaxSettings.url = function() {
					return defaultUrl;
				};
			}

			if (typeof defaults.listLocation === "string") {
				var defaultlistLocation = defaults.listLocation;

				if (defaults.dataType.toUpperCase() === "XML") {
					defaults.listLocation = function(data) {
						return $(data).find(defaultlistLocation);
						
					};
				} else {
					defaults.listLocation = function(data) {
						return data[defaultlistLocation];
					};	
				}
			}

			if (typeof defaults.getValue === "string") {
				var defaultsGetValue = defaults.getValue;
				defaults.getValue = function(element) {
					return element[defaultsGetValue];
				};
			}

			if (options.categories !== undefined) {
				defaults.categoriesAssigned = true;
			}

		}

		function addAjaxSettings() {

			if (options.ajaxSettings !== undefined && typeof options.ajaxSettings === "object") {
				defaults.ajaxSettings = options.ajaxSettings;
			} else {
				defaults.ajaxSettings = {};	
			}
			
		}

		function isAssigned(name) {
			if (defaults[name] !== undefined && defaults[name] !== null) {
				return true;
			} else {
				return false;
			}
		}
		function printPropertiesThatDoesntExist(consol, optionsToCheck) {
			
			checkPropertiesIfExist(defaults, optionsToCheck);

			function checkPropertiesIfExist(source, target) {
				for(var property in target) {
					if (source[property] === undefined) {
						consol.log("Property '" + property + "' does not exist in EasyAutocomplete options API.");		
					}

					if (typeof source[property] === "object" && $.inArray(property, externalObjects) === -1) {
						checkPropertiesIfExist(source[property], target[property]);
					}
				}	
			}
		}
	};

	return scope;

})(EasyAutocomplete || {});


/*
 * EasyAutocomplete - Logger 
 */
var EasyAutocomplete = (function(scope){
	
	scope.Logger = function Logger() {

		this.error = function(message) {
			//console.log("ERROR: " + message);
		};

		this.warning = function(message) {
			//console.log("WARNING: " + message);
		};
	};

	return scope;

})(EasyAutocomplete || {});
	

/*
 * EasyAutocomplete - Constans
 */
var EasyAutocomplete = (function(scope){	
	
	scope.Constans = function Constans() {
		var constants = {
			CONTAINER_CLASS: "easy-autocomplete-container",
			CONTAINER_ID: "eac-container-",

			WRAPPER_CSS_CLASS: "easy-autocomplete"
		};

		this.getValue = function(propertyName) {
			return constants[propertyName];
		};

	};

	return scope;

})(EasyAutocomplete || {});

/*
 * EasyAutocomplete - ListBuilderService 
 *
 * @author Łukasz Pawełczak 
 *
 */
var EasyAutocomplete = (function(scope) {

	scope.ListBuilderService = function ListBuilderService(configuration, proccessResponseData) {


		this.init = function(data) {
			var listBuilder = [],
				builder = {};

			builder.data = configuration.get("listLocation")(data);
			builder.getValue = configuration.get("getValue");
			builder.maxListSize = configuration.get("list").maxNumberOfElements;

				
			listBuilder.push(builder);
		
			return listBuilder;
		};

		this.updateCategories = function(listBuilder, data) {
			
			if (configuration.get("categoriesAssigned")) {

				listBuilder = [];

				for(var i = 0; i < configuration.get("categories").length; i += 1) {

					var builder = convertToListBuilder(configuration.get("categories")[i], data);

					listBuilder.push(builder);
				}

			} 

			return listBuilder;
		};

		this.convertXml = function(listBuilder) {
			if(configuration.get("dataType").toUpperCase() === "XML") {

				for(var i = 0; i < listBuilder.length; i += 1) {
					listBuilder[i].data = convertXmlToList(listBuilder[i]);
				}
			}

			return listBuilder;
		};

		this.processData = function(listBuilder, inputPhrase) {

			for(var i = 0, length = listBuilder.length; i < length; i+=1) {
				listBuilder[i].data = proccessResponseData(configuration, listBuilder[i], inputPhrase);
			}

			return listBuilder;
		};

		this.checkIfDataExists = function(listBuilders) {

			for(var i = 0, length = listBuilders.length; i < length; i += 1) {

				if (listBuilders[i].data !== undefined && listBuilders[i].data instanceof Array) {
					if (listBuilders[i].data.length > 0) {
						return true;
					}
				} 
			}

			return false;
		};


		function convertToListBuilder(category, data) {

			var builder = {};

			if(configuration.get("dataType").toUpperCase() === "XML") {

				builder = convertXmlToListBuilder();
			} else {

				builder = convertDataToListBuilder();
			}
			

			if (category.header !== undefined) {
				builder.header = category.header;
			}

			if (category.maxNumberOfElements !== undefined) {
				builder.maxNumberOfElements = category.maxNumberOfElements;
			}

			if (configuration.get("list").maxNumberOfElements !== undefined) {

				builder.maxListSize = configuration.get("list").maxNumberOfElements;
			}

			if (category.getValue !== undefined) {

				if (typeof category.getValue === "string") {
					var defaultsGetValue = category.getValue;
					builder.getValue = function(element) {
						return element[defaultsGetValue];
					};
				} else if (typeof category.getValue === "function") {
					builder.getValue = category.getValue;
				}

			} else {
				builder.getValue = configuration.get("getValue");	
			}
			

			return builder;


			function convertXmlToListBuilder() {

				var builder = {},
					listLocation;

				if (category.xmlElementName !== undefined) {
					builder.xmlElementName = category.xmlElementName;
				}

				if (category.listLocation !== undefined) {

					listLocation = category.listLocation;
				} else if (configuration.get("listLocation") !== undefined) {

					listLocation = configuration.get("listLocation");
				}

				if (listLocation !== undefined) {
					if (typeof listLocation === "string") {
						builder.data = $(data).find(listLocation);
					} else if (typeof listLocation === "function") {

						builder.data = listLocation(data);
					}
				} else {

					builder.data = data;
				}

				return builder;
			}


			function convertDataToListBuilder() {

				var builder = {};

				if (category.listLocation !== undefined) {

					if (typeof category.listLocation === "string") {
						builder.data = data[category.listLocation];
					} else if (typeof category.listLocation === "function") {
						builder.data = category.listLocation(data);
					}
				} else {
					builder.data = data;
				}

				return builder;
			}
		}

		function convertXmlToList(builder) {
			var simpleList = [];

			if (builder.xmlElementName === undefined) {
				builder.xmlElementName = configuration.get("xmlElementName");
			}


			$(builder.data).find(builder.xmlElementName).each(function() {
				simpleList.push(this);
			});

			return simpleList;
		}

	};

	return scope;

})(EasyAutocomplete || {});


/*
 * EasyAutocomplete - Data proccess module
 *
 * Process list to display:
 * - sort 
 * - decrease number to specific number
 * - show only matching list
 *
 */
var EasyAutocomplete = (function(scope) {

	scope.proccess = function proccessData(config, listBuilder, phrase) {

		scope.proccess.match = match;

		var list = listBuilder.data,
			inputPhrase = phrase;//TODO REFACTOR

		list = findMatch(list, inputPhrase);
		list = reduceElementsInList(list);
		
		list = sort(list);
		list = dedupe(list);
		

		return list;
		
	function dedupe(list) {
			 var deDuped = [];
   
		var ids = [];
		var clean = [];

		$.each(list, function(index, value) {
				if($.inArray(value.kh_value, ids) == -1)
				{
						ids.push(value.kh_value);
						clean.push(value);
				}
		});
   
			
		//console.dir(collection);
    return clean;
			//result = $.unique(result);
			//return list;
		}

		function findMatch(list, phrase) {
			var preparedList = [],
				value = "";

			if (config.get("list").match.enabled) {
				for(var i = 0, length = list.length; i < length; i += 1) {
					value = config.get("getValue")(list[i]);
					
					////if($.inArray(list[i],preparedList) == -1) {
						
						if (match(value, phrase)) {

						
	
						preparedList.push(list[i]);	
						}
						else {
							//console.log('AAAAAAAAAAAAAAAAAAA');
						}
				//	}
					
				}

			} else {
				preparedList = list;
			}

			return preparedList;
		}

		function match(value, phrase) {

			if (!config.get("list").match.caseSensitive) {

				if (typeof value === "string") {
					value = value.toLowerCase();	
				}
				
				phrase = phrase.toLowerCase();
			}
			if (config.get("list").match.method(value, phrase)) {
				return true;
			} else {
				return false;
			}
		}

		function reduceElementsInList(list) {
			if (listBuilder.maxNumberOfElements !== undefined && list.length > listBuilder.maxNumberOfElements) {
				list = list.slice(0, listBuilder.maxNumberOfElements);
			}

			return list;
		}

		function sort(list) {
			if (config.get("list").sort.enabled) {
				list.sort(config.get("list").sort.method);
			}
		
			return list;
		}
		
	};


	return scope;


})(EasyAutocomplete || {});


/*
 * EasyAutocomplete - Template 
 *
 * 
 *
 */
var EasyAutocomplete = (function(scope){

	scope.Template = function Template(options) {


		var genericTemplates = {
			basic: {
				type: "basic",
				method: function(element) { return element; },
				cssClass: ""
			},
			description: {
				type: "description",
				fields: {
					description: "description"
				},
				method: function(element) {	return element + " - description"; },
				cssClass: "eac-description"
			},
			iconLeft: {
				type: "iconLeft",
				fields: {
					icon: ""
				},
				method: function(element) {
					return element;
				},
				cssClass: "eac-icon-left"
			},
			iconRight: {
				type: "iconRight",
				fields: {
					iconSrc: ""
				},
				method: function(element) {
					return element;
				},
				cssClass: "eac-icon-right"
			},
			links: {
				type: "links",
				fields: {
					link: ""
				},
				method: function(element) {
					return element;
				},
				cssClass: ""
			},
			custom: {
				type: "custom",
				method: function() {},
				cssClass: ""
			}
		},



		/*
		 * Converts method with {{text}} to function
		 */
		convertTemplateToMethod = function(template) {


			var _fields = template.fields,
				buildMethod;

			if (template.type === "description") {

				buildMethod = genericTemplates.description.method; 

				if (typeof _fields.description === "string") {
					buildMethod = function(elementValue, element) {
						return elementValue + " - <span>" + element[_fields.description] + "</span>";
					};					
				} else if (typeof _fields.description === "function") {
					buildMethod = function(elementValue, element) {
						return elementValue + " - <span>" + _fields.description(element) + "</span>";
					};	
				}

				return buildMethod;
			}

			if (template.type === "iconRight") {

				if (typeof _fields.iconSrc === "string") {
					buildMethod = function(elementValue, element) {
						return elementValue + "<img class='eac-icon' src='" + element[_fields.iconSrc] + "' />" ;
					};					
				} else if (typeof _fields.iconSrc === "function") {
					buildMethod = function(elementValue, element) {
						return elementValue + "<img class='eac-icon' src='" + _fields.iconSrc(element) + "' />" ;
					};
				}

				return buildMethod;
			}


			if (template.type === "iconLeft") {

				if (typeof _fields.iconSrc === "string") {
					buildMethod = function(elementValue, element) {
						return "<img class='eac-icon' src='" + element[_fields.iconSrc] + "' />" + elementValue;
					};					
				} else if (typeof _fields.iconSrc === "function") {
					buildMethod = function(elementValue, element) {
						return "<img class='eac-icon' src='" + _fields.iconSrc(element) + "' />" + elementValue;
					};
				}

				return buildMethod;
			}

			if(template.type === "links") {

				if (typeof _fields.link === "string") {
					buildMethod = function(elementValue, element) {
						return "<a href='" + element[_fields.link] + "' >" + elementValue + "</a>";
					};					
				} else if (typeof _fields.link === "function") {
					buildMethod = function(elementValue, element) {
						return "<a href='" + _fields.link(element) + "' >" + elementValue + "</a>";
					};
				}

				return buildMethod;
			}


			if (template.type === "custom") {

				return template.method;
			}

			return genericTemplates.basic.method;

		},


		prepareBuildMethod = function(options) {
			if (!options || !options.type) {

				return genericTemplates.basic.method;
			}

			if (options.type && genericTemplates[options.type]) {

				return convertTemplateToMethod(options);
			} else {

				return genericTemplates.basic.method;
			}

		},

		templateClass = function(options) {
			var emptyStringFunction = function() {return "";};

			if (!options || !options.type) {

				return emptyStringFunction;
			}

			if (options.type && genericTemplates[options.type]) {
				return (function () { 
					var _cssClass = genericTemplates[options.type].cssClass;
					return function() { return _cssClass;};
				})();
			} else {
				return emptyStringFunction;
			}
		};


		this.getTemplateClass = templateClass(options);

		this.build = prepareBuildMethod(options);


	};

	return scope;

})(EasyAutocomplete || {});


/*
 * EasyAutocomplete - jQuery plugin for autocompletion
 *
 */
var EasyAutocomplete = (function(scope) {

	
	scope.main = function Core($input, options) {
				
		var module = {
				name: "EasyAutocomplete",
				shortcut: "eac"
			};

		var consts = new scope.Constans(),
			config = new scope.Configuration(options),
			logger = new scope.Logger(),
			template = new scope.Template(options.template),
			listBuilderService = new scope.ListBuilderService(config, scope.proccess),
			checkParam = config.equals,

			$field = $input, 
			$container = "",
			elementsList = [],
			selectedElement = -1,
			requestDelayTimeoutId;

		scope.consts = consts;

		this.getConstants = function() {
			return consts;
		};

		this.getConfiguration = function() {
			return config;
		};

		this.getContainer = function() {
			return $container;
		};

		this.getSelectedItemIndex = function() {
			return selectedElement;
		};

		this.getItems = function () {
			return elementsList;
		};

		this.getItemData = function(index) {

			if (elementsList.length < index || elementsList[index] === undefined) {
				return -1;
			} else {
				return elementsList[index];
			}
		};

		this.getSelectedItemData = function() {
			return this.getItemData(selectedElement);
			
		};

		this.build = function() {
			prepareField();
		};

		this.init = function() {
			init();
		};
		function init() {

			if ($field.length === 0) {
				logger.error("Input field doesn't exist.");
				return;
			}

			if (!config.checkDataUrlProperties()) {
				logger.error("One of options variables 'data' or 'url' must be defined.");
				return;
			}

			if (!config.checkRequiredProperties()) {
				logger.error("Will not work without mentioned properties.");
				return;
			}


			prepareField();
			bindEvents();	

		}
		function prepareField() {

				
			if ($field.parent().hasClass(consts.getValue("WRAPPER_CSS_CLASS"))) {
				removeContainer();
				removeWrapper();
			} 
			
			createWrapper();
			createContainer();	

			$container = $("#" + getContainerId());
			if (config.get("placeholder")) {
				$field.attr("placeholder", config.get("placeholder"));
			}


			function createWrapper() {
				var $wrapper = $("<div>"),
					classes = consts.getValue("WRAPPER_CSS_CLASS");

			
				if (config.get("theme") && config.get("theme") !== "") {
					classes += " eac-" + config.get("theme");
				}

				if (config.get("cssClasses") && config.get("cssClasses") !== "") {
					classes += " " + config.get("cssClasses");
				}

				if (template.getTemplateClass() !== "") {
					classes += " " + template.getTemplateClass();
				}
				

				$wrapper
					.addClass(classes);
				$field.wrap($wrapper);


				if (config.get("adjustWidth") === true) {
					adjustWrapperWidth();	
				}
				

			}

			function adjustWrapperWidth() {
				var fieldWidth = $field.outerWidth();

				$field.parent().css("width", fieldWidth);				
			}

			function removeWrapper() {
				$field.unwrap();
			}

			function createContainer() {
				var $elements_container = $("<div>").addClass(consts.getValue("CONTAINER_CLASS"));
				
				$elements_container
						.attr("id", getContainerId())
						.prepend($('<ul role="listbox">'));
				//$elements_container.attr('aria-expanded','false');

				(function() {

					$elements_container
						/* List show animation */
						.on("show.eac", function() {

							switch(config.get("list").showAnimation.type) {

								case "slide":
									var animationTime = config.get("list").showAnimation.time,
										callback = config.get("list").showAnimation.callback;

									$elements_container.find("ul").slideDown(animationTime, callback);
								break;

								case "fade":
									var animationTime = config.get("list").showAnimation.time,
										callback = config.get("list").showAnimation.callback;

									$elements_container.find("ul").fadeIn(animationTime), callback;
								break;

								default:
									$elements_container.find("ul").show();
								break;
							}

							config.get("list").onShowListEvent();
							
						})
						/* List hide animation */
						.on("hide.eac", function() {

							switch(config.get("list").hideAnimation.type) {

								case "slide":
									var animationTime = config.get("list").hideAnimation.time,
										callback = config.get("list").hideAnimation.callback;

									$elements_container.find("ul").slideUp(animationTime, callback);
								break;

								case "fade":
									var animationTime = config.get("list").hideAnimation.time,
										callback = config.get("list").hideAnimation.callback;

									$elements_container.find("ul").fadeOut(animationTime, callback);
								break;

								default:
									$elements_container.find("ul").hide();
								break;
							}

							config.get("list").onHideListEvent();

						})
						.on("selectElement.eac", function() {
							$elements_container.find("ul li").removeClass("selected");
							$elements_container.find("ul li").eq(selectedElement).addClass("selected");

							config.get("list").onSelectItemEvent();
						})
						.on("loadElements.eac", function(event, listBuilders, phrase) {
			

							var $item = "",
								$listContainer = $elements_container.find("ul");

							$listContainer
								.empty()
								.detach();

							elementsList = [];
							var counter = 0;
							for(var builderIndex = 0, listBuildersLength = listBuilders.length; builderIndex < listBuildersLength; builderIndex += 1) {

								var listData = listBuilders[builderIndex].data;

								if (listData.length === 0) {
									continue;
								}

								if (listBuilders[builderIndex].header !== undefined && listBuilders[builderIndex].header.length > 0) {
									$listContainer.append("<div class='eac-category' >" + listBuilders[builderIndex].header + "</div>");
								}

								for(var i = 0, listDataLength = listData.length; i < listDataLength && counter < listBuilders[builderIndex].maxListSize; i += 1) {
									$item = $('<li role="option"><div class="eac-item"></div></li>');
									
									
									(function() {
										var j = i,
											itemCounter = counter,
											elementsValue = listBuilders[builderIndex].getValue(listData[j]);
										
											
										$item.find(" > div")
											.on("click", function() {
											
											
											$field.val(function(){
												return stripper(elementsValue,'buildloop');
											}).trigger("change");

											//	$field.val(elementsValue).trigger("change");

												selectedElement = itemCounter;
												selectElement(itemCounter);

												config.get("list").onClickEvent();
												config.get("list").onChooseEvent();
											})
											.mouseover(function() {

												selectedElement = itemCounter;
												selectElement(itemCounter);	

												config.get("list").onMouseOverEvent();
											})
											.mouseout(function() {
												config.get("list").onMouseOutEvent();
											})
											.html(template.build(highlight(elementsValue, phrase), listData[j]));
									})();

									$listContainer.append($item);
							
									
									elementsList.push(listData[i]);
								//	console.log('ME: '+$item.text());

									counter += 1;
								}
								announce(i);
							
							//	console.log('list count:'+i);
								// create the announcement container
								//$("#ariaAnnouncements").innerHTML='<p>HELLO</p>';
							/*	if(i>1) {
								// start by removing the announcement (avoid doubles)
									if($("#ariaAnnouncements").text().length>0) {
										console.log('emptied');
										$("#ariaAnnouncements").empty();
									}
									
									$("#ariaAnnouncements").innerHTML = i + " search suggestions are available. Use the up and down arrows to navigate or press escape to exit the suggestion list"; // will need lang specific message
									console.log('AA: '+$("#ariaAnnouncements").text());
								
								
								}*/
							
							}
						
						// Don't remember why I had two versions of the following, one inline and one as a function am removing this one - will is still work?
						/*
						if(i==1) {
							var suggs = ' search suggestion is available. Use the down arrow to select or press escape to exit the list or continue to type your query or press enter to submit your search888';
						}
						else {
							var suggs = ' search suggestions are available. Use the up and down arrows to navigate the list, or press escape to exit the list, or continue to type your query and/or press enter to submit your search888';
						}
						var AnneOunce = i + suggs;// will need lang specific message
						$("#ariaAnnouncements").attr('role','status');
						if(i>0) {
						
							$("#ariaAnnouncements").html(AnneOunce);
						//	console.log('anne:'+$("#ariaAnnouncements").text());
						}
						else {
							$("#ariaAnnouncements").empty();
						}
						*/
						// Marc adds close button etc for IA/WCAG
					/*	var EACCloseButt = document.createElement('a');
						EACCloseButt.id="EACCloseButton";
						EACCloseButt.setAttribute('onclick','hideContainerToo();');
						EACCloseButt.innerHTML='close';
						
						var EACCloseLI = document.createElement('li');
						EACCloseLI.setAttribute('class','');
						var EACCloseDiv = document.createElement('div');
						EACCloseDiv.setAttribute('class','eac-item');
						EACCloseDiv.append(EACCloseButt);
						EACCloseLI.append(EACCloseDiv);
						$listContainer.append(EACCloseLI);
						*/
						
					//  role=combobox and aria-label for suggestions container	
					//	$elements_container.attr('role','combobox');
					//	$elements_container.attr('aria-label','search suggestions');
					
						
							$elements_container.append($listContainer);
						
						
						

							config.get("list").onLoadEvent();
						});

				})();

				$field.after($elements_container);
				var thisOne = $field.after($elements_container);
				
			}

			function removeContainer() {
				$field.next("." + consts.getValue("CONTAINER_CLASS")).remove();
				//unannounce();
			}

			function highlight(string, phrase) {

			/*	if(config.get("highlightPhrase") && phrase !== "") {
					return highlightPhrase(string, phrase);	
				} else {
					return string;
				}*/
				
				return stripper(string,'highlight')
		
				//return string;
			}
			
			function escapeRegExp(str) {
				return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
 			}

			function highlightPhrase(string, phrase) {
				var escapedPhrase = escapeRegExp(phrase);
				return (string + "").replace(new RegExp("(" + escapedPhrase + ")", "gi") , "<b>$1</b>");
				//console.log(escapedPhrase);
			}



		}
		function getContainerId() {
			
			var elementId = $field.attr("id");

			elementId = consts.getValue("CONTAINER_ID") + elementId;

			return elementId;
			
		}
		function bindEvents() {

			bindAllEvents();
			

			function bindAllEvents() {
				if (checkParam("autocompleteOff", true)) {
					removeAutocomplete();
				}

				bindFocusOut();
				bindKeyup();
				bindKeydown();
				bindKeypress();
				bindFocus();
				bindBlur();
			}

			function bindFocusOut() {
				$field.focusout(function () {

					var fieldValue = $field.val(),
						phrase;

					if (!config.get("list").match.caseSensitive) {
						fieldValue = fieldValue.toLowerCase();
					}

					for (var i = 0, length = elementsList.length; i < length; i += 1) {

						phrase = config.get("getValue")(elementsList[i]);
						if (!config.get("list").match.caseSensitive) {
							phrase = phrase.toLowerCase();
						}

						if (phrase === fieldValue) {
							selectedElement = i;
							selectElement(selectedElement);
							return;
						}
					}
				});
			}

			function bindKeyup() {
				$field
				.off("keyup")
				.keyup(function(event) {

					switch(event.keyCode) {

						case 27:

						hideContainer();
						loseFieldFocus();
						break;

						case 38:

							event.preventDefault();

							if(elementsList.length > 0 && selectedElement > 0) {

								selectedElement -= 1;

								//$field.val(config.get("getValue")(elementsList[selectedElement]));	
								
								$field.val(function(){
									return stripper(config.get("getValue")(elementsList[selectedElement]),'case38');
								});
								
								

								selectElement(selectedElement);

							}						
						break;

						case 40:

							event.preventDefault();

							if(elementsList.length > 0 && selectedElement < elementsList.length - 1) {

								selectedElement += 1;

								//$field.val(config.get("getValue")(elementsList[selectedElement]));
								
								$field.val(function(){
									return stripper(config.get("getValue")(elementsList[selectedElement]),'case40');
								});			
								
								
								selectElement(selectedElement);
								
							}

						break;

						default:

							if (event.keyCode > 40 || event.keyCode === 8) { // 40 = downarrow, 8 = escape

								var inputPhrase = $field.val();
								
								
								if (!(config.get("list").hideOnEmptyPhrase === true && event.keyCode === 8 && inputPhrase === "")) {

									if (config.get("requestDelay") > 0) {
										if (requestDelayTimeoutId !== undefined) {
											clearTimeout(requestDelayTimeoutId);
										}

										requestDelayTimeoutId = setTimeout(function () { loadData(inputPhrase);}, config.get("requestDelay"));
									} else {
										loadData(inputPhrase);
									}

								} else {
									hideContainer();
									
								}
								
							}


						break;
					}
				

					function loadData(inputPhrase) {


						if (inputPhrase.length < config.get("minCharNumber")) {
							return;
						}


						if (config.get("data") !== "list-required") {

							var data = config.get("data");

							var listBuilders = listBuilderService.init(data);

							listBuilders = listBuilderService.updateCategories(listBuilders, data);
							
							listBuilders = listBuilderService.processData(listBuilders, inputPhrase);

							loadElements(listBuilders, inputPhrase);

							if ($field.parent().find("li").length > 0) {
								showContainer();	
							} else {
								hideContainer();
							}

						}

						var settings = createAjaxSettings();

						if (settings.url === undefined || settings.url === "") {
							settings.url = config.get("url");
						}

						if (settings.dataType === undefined || settings.dataType === "") {
							settings.dataType = config.get("dataType");
						}


						if (settings.url !== undefined && settings.url !== "list-required") {

							settings.url = settings.url(inputPhrase);

							settings.data = config.get("preparePostData")(settings.data, inputPhrase);

							$.ajax(settings) 
								.done(function(data) {

									var listBuilders = listBuilderService.init(data);

									listBuilders = listBuilderService.updateCategories(listBuilders, data);
									
									listBuilders = listBuilderService.convertXml(listBuilders);
									if (checkInputPhraseMatchResponse(inputPhrase, data)) {

										listBuilders = listBuilderService.processData(listBuilders, inputPhrase);

										loadElements(listBuilders, inputPhrase);	
																				
									}

									if (listBuilderService.checkIfDataExists(listBuilders) && $field.parent().find("li").length > 0) {
										showContainer();	
									} else {
										hideContainer();
									}

									config.get("ajaxCallback")();

								})
								.fail(function() {
									logger.warning("Fail to load response data");
								})
								.always(function() {
								
								});
						}

						

						function createAjaxSettings() {

							var settings = {},
								ajaxSettings = config.get("ajaxSettings") || {};

							for (var set in ajaxSettings) {
								settings[set] = ajaxSettings[set];
							}

							return settings;
						}

						function checkInputPhraseMatchResponse(inputPhrase, data) {

							if (config.get("matchResponseProperty") !== false) {
								if (typeof config.get("matchResponseProperty") === "string") {
									return (data[config.get("matchResponseProperty")] === inputPhrase);
								}

								if (typeof config.get("matchResponseProperty") === "function") {
									return (config.get("matchResponseProperty")(data) === inputPhrase);
								}

								return true;
							} else {
								return true;
							}

						}

					}


				});
			}

			function bindKeydown() {
				$field
					.on("keydown", function(evt) {
	        		    evt = evt || window.event;
	        		    var keyCode = evt.keyCode;
	        		    if (keyCode === 38) {
	        		        suppressKeypress = true; 
	        		        return false;
	        		    }
		        	})
					.keydown(function(event) {

						if (event.keyCode === 13 && selectedElement > -1) {

							//$field.val(config.get("getValue")(elementsList[selectedElement]));			
																		
								
								$field.val(function(){
									return stripper(config.get("getValue")(elementsList[selectedElement]),'keycode13');
								});
							

							config.get("list").onKeyEnterEvent();
							config.get("list").onChooseEvent();

							selectedElement = -1;
							hideContainer();

							event.preventDefault();
						}
					});
			}

			function bindKeypress() {
				$field
				.off("keypress");
			}

			function bindFocus() {
				$field.focus(function() {

					if ($field.val() !== "" && elementsList.length > 0) {
						
						selectedElement = -1;
						showContainer();	
					}
									
				});
			}

			function bindBlur() {
				$field.blur(function() {
					setTimeout(function() { 
						
						selectedElement = -1;
						hideContainer();
					}, 250);
				});
			}

			function removeAutocomplete() {
				$field.attr("autocomplete","off");
			}

		}

		function showContainer() {
			$container.trigger("show.eac");
			$('#q').attr('aria-expanded','true');
			$('#searchform').removeClass('noSuggs').addClass('suggs');
		//	console.log('1g1');
		}

		function hideContainer() {
			$container.trigger("hide.eac");
			//console.log('main hide disabled');
			$('#q').attr('aria-expanded','false');
			$('#searchform').removeClass('suggs').addClass('noSuggs');
			unannounce();
		}
		
		function hideContainerToo() { // added for container close click while above is disabled
			$container.trigger("hide.eac");
			$('#q').attr('aria-expanded','false');
			unannounce();
		}
		
		function unannounce() {
				$("#suggsAnnounce").empty();
			}

			function announce(i) {
				
				if($('html').attr('lang')==='en') {
					var suggInt = '';
					var sugg = ' search suggestion is available. Use the down arrow to select or press escape to exit the list or continue to type your query or press enter to submit your search.';
					var suggs = ' search suggestions are available. Use the up and down arrows to navigate the list, or press escape to exit the list, or continue to type your query and or press enter to submit your search.';
				}
				else {
					var suggInt = 'Hay ';
					var sugg = ' sugerencia de búsqueda. Utilizar las flechas hacia abajo para seleccionar o pulse "escape" para salir de la lista o continúe escribiendo su pregunta o pulse "intro" para enviar la búsqueda.';
					var suggs = ' sugerencias de búsqueda. Utilizar las flechas hacia arriba y hacia abajo para desplazarse por la lista o pulse "escape" para salir de la lista o continúe para escribir su pregunta y/o pulse "intro" para enviar la búsqueda';
				}
			
				
				if (i == 1) {
					var AnneOunce = suggInt + i + sugg;
				} else {
					var AnneOunce = suggInt + i + suggs;
				}
				//var AnneOunce = i + suggs; // will need lang specific message
				//console.log(AnneOunce);
				if (i > 0) {

					$("#suggsAnnounce").html(AnneOunce);
					//console.log('anne:' + $("#suggsAnnounce").text());
				} else {
					$("#suggsAnnounce").empty();
				}
			}

		function selectElement(index) {
			
			$container.trigger("selectElement.eac", index);
			//console.log('trig');
			// this is the select function
			
		}

		function loadElements(list, phrase) {
			var deduped = $.uniqueSort(list);
			$container.trigger("loadElements.eac", [list, phrase]);
			//console.log('DD: '+deduped);
		}

		function loseFieldFocus() {
			$field.trigger("blur");
		}
		
		function stripper(tease,trigg) {
			//console.log('stripped by '+trigg);
			if(tease.indexOf('(for')>0) {
				//console.log('if');
				return tease.substr(0,tease.indexOf('for')-1);			
			}
			
			else if(tease.indexOf('(para')>0) {
				//console.log('if');
				return tease.substr(0,tease.indexOf('para')-1);
				
			}

			else if(tease.indexOf(licName)>0) {
				//console.log('elseif');
				return  tease.substr(0,tease.indexOf(licName)-3);
				
			}

			else { //console.log('else');
						return tease; }
	//	console.log('what');						
		}


	};
	scope.eacHandles = [];

	scope.getHandle = function(id) {
		return scope.eacHandles[id];
	};

	scope.inputHasId = function(input) {

		if($(input).attr("id") !== undefined && $(input).attr("id").length > 0) {
			return true;
		} else {
			return false;
		}

	};

	scope.assignRandomId = function(input) {

		var fieldId = "";

		do {
			fieldId = "eac-" + Math.floor(Math.random() * 10000);		
		} while ($("#" + fieldId).length !== 0);
		
		elementId = scope.consts.getValue("CONTAINER_ID") + fieldId;

		$(input).attr("id", fieldId);
 
	};

	scope.setHandle = function(handle, id) {
		scope.eacHandles[id] = handle;
	};


	return scope;

})(EasyAutocomplete || {});

(function($) {

	$.fn.easyAutocomplete = function(options) {

		return this.each(function() {
			var $this = $(this),
				eacHandle = new EasyAutocomplete.main($this, options);

			if (!EasyAutocomplete.inputHasId($this)) {
				EasyAutocomplete.assignRandomId($this);
				
			}
			
			eacHandle.init();

			EasyAutocomplete.setHandle(eacHandle, $this.attr("id"));
		

		});
	};

	$.fn.getSelectedItemIndex = function() {

		var inputId = $(this).attr("id");

		if (inputId !== undefined) {
			return EasyAutocomplete.getHandle(inputId).getSelectedItemIndex();
			//console.log('**********gII*********');
		}
		//console.log('***3***');
		return -1;
	};

	$.fn.getItems = function () {

		var inputId = $(this).attr("id");

		if (inputId !== undefined) {
			return EasyAutocomplete.getHandle(inputId).getItems();
			//console.log('*************GI**************')
		}

		return -1;
	};

	$.fn.getItemData = function(index) {

		var inputId = $(this).attr("id");

		if (inputId !== undefined && index > -1) {
			return EasyAutocomplete.getHandle(inputId).getItemData(index);
			//console.log('and then');
		}

		return -1;
	};

	$.fn.getSelectedItemData = function() {

		var inputId = $(this).attr("id");

		if (inputId !== undefined) {
			return EasyAutocomplete.getHandle(inputId).getSelectedItemData();
			//console.log('and now');
		}

		return -1;
	};

})(jQuery);

// convert all characters to lowercase to simplify testing
    
    // *** BROWSER VERSION ***
    // Note: On IE5, these return 4, so use is.ie5up to detect IE5.
	var agt=navigator.userAgent.toLowerCase();
    var is_major = parseInt(navigator.appVersion);
    var is_minor = parseFloat(navigator.appVersion);
    var is_nav  = ((agt.indexOf('mozilla')!=-1) && (agt.indexOf('spoofer')==-1) && (agt.indexOf('compatible') == -1) && (agt.indexOf('opera')==-1) && (agt.indexOf('webtv')==-1));
    var is_nav2 = (is_nav && (is_major == 2));
    var is_nav3 = (is_nav && (is_major == 3));
    var is_nav4 = (is_nav && (is_major == 4));
    var is_nav4up = (is_nav && (is_major >= 4));
    var is_navonly      = (is_nav && ((agt.indexOf(";nav") != -1) || (agt.indexOf("; nav") != -1)) );
    var is_nav5 = (is_nav && (is_major == 5));
    var is_nav5up = (is_nav && (is_major >= 5));

    var is_ie   = (agt.indexOf("msie") != -1);
    var is_ie3  = (is_ie && (is_major < 4));
    var is_ie4  = (is_ie && (is_major == 4) && (agt.indexOf("msie 5.0")==-1) );
    var is_ie4up  = (is_ie  && (is_major >= 4));
    var is_ie5  = (is_ie && (is_major == 4) && (agt.indexOf("msie 5.0")!=-1) );
    var is_ie5up  = (is_ie  && !is_ie3 && !is_ie4);

    var is_aol   = (agt.indexOf("aol") != -1);
    var is_aol3  = (is_aol && is_ie3);
    var is_aol4  = (is_aol && is_ie4);

    var is_opera = (agt.indexOf("opera") != -1);
    var is_webtv = (agt.indexOf("webtv") != -1);

    // *** JAVASCRIPT VERSION CHECK ***
    // Useful to workaround Nav3 bug in which Nav3
    var is_js;
    if (is_nav2 || is_ie3) is_js = 1.0
    else if (is_nav3 || is_opera) is_js = 1.1
    else if ((is_nav4 && (is_minor <= 4.05)) || is_ie4) is_js = 1.2
    else if ((is_nav4 && (is_minor > 4.05)) || is_ie5) is_js = 1.3
    else if (is_nav5) is_js = 1.4
    // NOTE: In the future, update this code when newer versions of JS
    // are released. For now, we try to provide some upward compatibility
    // so that future versions of Nav and IE will show they are at
    // *least* JS 1.x capable. Always check for JS version compatibility
    // with > or >=.
    else if (is_nav && (is_major > 5)) is_js = 1.4
    else if (is_ie && (is_major > 5)) is_js = 1.3
    // HACK: no idea for other browsers; always check for JS version with > or >=
    else is_js = 0.0;

    // *** PLATFORM ***
    var is_win   = ( (agt.indexOf("win")!=-1) || (agt.indexOf("16bit")!=-1) );
    // NOTE: On Opera 3.0, the userAgent string includes "Windows 95/NT4" on all
    //        Win32, so you can't distinguish between Win95 and WinNT.
    var is_win95 = ((agt.indexOf("win95")!=-1) || (agt.indexOf("windows 95")!=-1));

    // is this a 16 bit compiled version?
    var is_win16 = ((agt.indexOf("win16")!=-1) || (agt.indexOf("16bit")!=-1) || (agt.indexOf("windows 3.1")!=-1) || (agt.indexOf("windows 16-bit")!=-1) );  

    var is_win31 = ((agt.indexOf("windows 3.1")!=-1) || (agt.indexOf("win16")!=-1) || (agt.indexOf("windows 16-bit")!=-1));

    // NOTE: Reliable detection of Win98 may not be possible. It appears that:
    //       - On Nav 4.x and before you'll get plain "Windows" in userAgent.
    //       - On Mercury client, the 32-bit version will return "Win98", but
    //         the 16-bit version running on Win98 will still return "Win95".
    var is_win98 = ((agt.indexOf("win98")!=-1) || (agt.indexOf("windows 98")!=-1));
    var is_winnt = ((agt.indexOf("winnt")!=-1) || (agt.indexOf("windows nt")!=-1));
    var is_win32 = (is_win95 || is_winnt || is_win98 || ((is_major >= 4) && (navigator.platform == "Win32")) || (agt.indexOf("win32")!=-1) || (agt.indexOf("32bit")!=-1));

    var is_os2   = ((agt.indexOf("os/2")!=-1) || (navigator.appVersion.indexOf("OS/2")!=-1) || (agt.indexOf("ibm-webexplorer")!=-1));

    var is_mac    = (agt.indexOf("mac")!=-1);
    var is_mac68k = (is_mac && ((agt.indexOf("68k")!=-1) || (agt.indexOf("68000")!=-1)));
    var is_macppc = (is_mac && ((agt.indexOf("ppc")!=-1) || (agt.indexOf("powerpc")!=-1)));

    var is_sun   = (agt.indexOf("sunos")!=-1);
    var is_sun4  = (agt.indexOf("sunos 4")!=-1);
    var is_sun5  = (agt.indexOf("sunos 5")!=-1);
    var is_suni86= (is_sun && (agt.indexOf("i86")!=-1));
    var is_irix  = (agt.indexOf("irix") !=-1);    // SGI
    var is_irix5 = (agt.indexOf("irix 5") !=-1);
    var is_irix6 = ((agt.indexOf("irix 6") !=-1) || (agt.indexOf("irix6") !=-1));
    var is_hpux  = (agt.indexOf("hp-ux")!=-1);
    var is_hpux9 = (is_hpux && (agt.indexOf("09.")!=-1));
    var is_hpux10= (is_hpux && (agt.indexOf("10.")!=-1));
    var is_aix   = (agt.indexOf("aix") !=-1);      // IBM
    var is_aix1  = (agt.indexOf("aix 1") !=-1);    
    var is_aix2  = (agt.indexOf("aix 2") !=-1);    
    var is_aix3  = (agt.indexOf("aix 3") !=-1);    
    var is_aix4  = (agt.indexOf("aix 4") !=-1);    
    var is_linux = (agt.indexOf("inux")!=-1);
    var is_sco   = (agt.indexOf("sco")!=-1) || (agt.indexOf("unix_sv")!=-1);
    var is_unixware = (agt.indexOf("unix_system_v")!=-1); 
    var is_mpras    = (agt.indexOf("ncr")!=-1); 
    var is_reliant  = (agt.indexOf("reliantunix")!=-1);
    var is_dec   = ((agt.indexOf("dec")!=-1) || (agt.indexOf("osf1")!=-1) || (agt.indexOf("dec_alpha")!=-1) || (agt.indexOf("alphaserver")!=-1) || (agt.indexOf("ultrix")!=-1) || (agt.indexOf("alphastation")!=-1)); 
    var is_sinix = (agt.indexOf("sinix")!=-1);
    var is_freebsd = (agt.indexOf("freebsd")!=-1);
    var is_bsd = (agt.indexOf("bsd")!=-1);
    var is_unix  = ((agt.indexOf("x11")!=-1) || is_sun || is_irix || is_hpux || is_sco ||is_unixware || is_mpras || is_reliant || is_dec || is_sinix || is_aix || is_linux || is_bsd || is_freebsd);
    var is_vms   = ((agt.indexOf("vax")!=-1) || (agt.indexOf("openvms")!=-1));

function newWindow(URL) {
       window.open(URL,"EmailToFriend","width=650,height=600,scrollbars=yes,resizable=yes,status=yes");
}

function newInvisibleWindow(URL) {
       window.open(URL,"EmailToFriend","width=0,height=0,scrollbars=yes,resizable=yes,status=yes");
}

// Function used to create popup windows for in article body links.
function popupWin(URL, winName, width, height) {

   if (isNaN(parseInt(width))) {
      // Error with width parameter, use default value of 600.
      width=600;
   }

   if (isNaN(parseInt(height))) {
      // Error with height parameter, use default value of 650.
      height=650;
   }

   window.open(URL,winName,"width="+ width + ",height=" + height + ",scrollbars=yes,resizable=yes,status=yes");   
}

// Functions used to define and play sound files (e.g. sound.wav).
var audioOn = false;
function defineMySound (sound_name, sound_file) {

   // alert("defineMySound: sound_name=" + sound_name + " sound_file= " + sound_file);

   document.writeln("<EMBED NAME='" + sound_name + "' SRC='" + sound_file + "' MASTERSOUND LOOP='false' AUTOSTART='false' AUTOREWIND='true' HIDDEN='true' WIDTH='0' HEIGHT='0'>");
}

function audioDo(doWhat,toWhat){
   if(audioOn){
      var A = eval('document.'+toWhat);
      if (A != null){
         if (doWhat=='stop') A.stop();
         else{
            if (navigator.appName == 'Netscape') A.play();
            else{
               if (document.M == null){
                  document.M = false; 
				  var m;
                  for(m in A) if (m == "ActiveMovie"){
                     document.M = true; break;
                     }
                  }
               if (document.M) A.SelectionStart = 0;
               if (document.M) A.play();
            }
         }
      }
   }
}

// Function used to open URL in a new window (target="_blank").
function openBlankTargetWin (myURL) {
   // alert ("openBlankTargetWin: attempting to open up URL in new browser window");
   window.open(myURL,"_blank");
}

//Function used to validate search text entry 
function validateQT() {
	if(document.SeekForm.SearchTextArea != null && document.SeekForm.SearchTextArea.value.length == 0 || document.SeekForm.SearchTextArea.value == "Search here...") {
         document.SeekForm.SearchTextArea.focus();
         alert("Please enter a question or keyword to search.");
         return false;
    }
	return true;
}

//Function used to validate search text entry 
//function validateQT(form) {
//	if(form.qt != null && form.qt.value.length == 0) {
//	   form.qt.focus();
//		alert("Please enter a question or keyword to search.");
//		return false;
//	}
//	return true;
//}

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  
  if(!d) d=document; 
  if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);
  }
  if(!(x=d[n])&&d.all) x=d.all[n]; 
  for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); 
  return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function printWindow(URL) {
	window.open(URL,"Print","width=700,height=600,scrollbars=yes,resizable=yes,status=yes,toolbar=yes,menubar=yes");
}

function checkOutWindow(URL) {
	window.open(URL,"CheckOut","width=600,height=400,scrollbars=yes,resizable=yes,status=yes")
}
//Just a dummy function, so that when in the onload this function is called, no javascript error in thrown for mothership. There is no marquee for the mothership.
function intializemarquee(){
}

function NewCPNNPNWindow(URL, name) {
     window.open(URL,name,"width=650,height=430,scrollbars=yes,resizable=yes,status=yes");
}

// General Nemours Cookie check/create, especially for pages that don't carry ads
function checkCookieNemours2() {
var nemCheck = readTheCookie2('refNemours');
var referringURL = document.referrer;
var referringURLowerCase = referringURL.toLowerCase();
	//First check to see if a Nemours cookie exists
	if(nemCheck == '1') {
		//Recreate the cookie to reset the timer
		createTheCookie2('refNemours','1','.5');
		function gamRefresh(url) {
			//alert('booYa');
		}
		//do no more (don't display ads)
		//alert("cookie existed");
		}
		
	//Next, if there's no cookie, check if the user was referred from Nemours
	///* test line */ else if(document.referrer.indexOf('mobilewebby') >-1) {
	/* actual line */ 
else if(referringURLowerCase.indexOf('nemours') >-1 || referringURLowerCase.indexOf('medlineplus') >-1 || referringURLowerCase.indexOf('nlm') >-1 || referringURLowerCase.indexOf('nih') >-1 || referringURLowerCase.indexOf('mobilewebby') >-1) {
		//This user was sent from Nemours so let's create a cookie
		createTheCookie2('refNemours','1','.5');
		function gamRefresh(url) {
			//alert('booYa');
		}
		//do no more (don't display ads)
		//alert("cookie created");
		}
		
	//If none of the above conditions are true then the user either didn't come from Nemours
	//or their session has timed out -- show the ads
	else {
		// Do nothing in this instance	
		}
}
			
function createTheCookie2(name,value,days) {
	if (days) 
	{
		var date = new Date();
		date.setTime(date.getTime()+(days*60*60*1000));
		var expires = "; expires="+date;
		//alert(date);
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}
	
function readTheCookie2(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) 
	{
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

checkCookieNemours2();

//document.write(unescape("%3Cscript src=\"/misc/foresee/foresee-trigger.js\" %3E%3C/script%3E"));

// Mobile Detection
var isMobile = false;
var pageLang = $('html').attr('lang');
let isShrunk = 0;
let currentScroll = $(window).scrollTop();

var closeSearchWords = function() {
	if(pageLang==='en') {
		return 'Close Search';
	}
	else return 'Cerrar búsqueda';
}
var openSearchWords = function() {
	if(pageLang==='en') {
		return 'Open Search';
	}
	else return 'Abrir búsqueda';
}
var openSearchLangWords = function() {
	if(pageLang==='en') {
		return 'Open Search Language Selector';
	}
	else return 'Abrir el selector de búsqueda de idiomas';
}
var closeSearchLangWords = function() {
	if(pageLang==='en') {
		return 'Close Search Language Selector';
	}
	else return 'Cerrar el selector de búsqueda de idiomas';
}
var customValidityWords = function() {
	if(pageLang==='en') {
		return 'Please fill in this field.';
	}
	else return 'Por favor, complete este campo';
}
var searchButtonSearchText = function() {
	if(pageLang==='en') {
		return 'Search';
	} else return 'Buscar';
}
var searchButtonCloseText = function() {
	if(pageLang==='en') {
		return 'Close';
	} else return 'Cerrar';
}

if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;



function homePageHeight() {
	var winHeight = $(window).height();
	var headHeight = $('#kh-header').height();
	var footHeight = $('.footer').height();
	var hpCallHeight = $('.hcCallout').outerHeight();
	var hpMinHeight = parseInt(hpCallHeight) + 160;
	var hpHeight = parseInt(winHeight) - parseInt(headHeight) - parseInt(footHeight); // plus 10 for bleed
	$('.homeBodyContainer').css('height',hpHeight).css('minHeight',hpMinHeight);	
}

function mobileFooterAcc() { // contracts footer columns to accordions on mobile
	if(mobFooter==1) {
		if($('ul.footerList').css('display')=='none') {
			// already done, don't want to keep repeating on each resize
		} else {
			$('ul.footerList').css('display','none');
			$('h2.footerColumnHeading').each(function() {
				var acon = $(this).attr('id').slice(0,-1)+'UL';
				$(this).attr({
					'aria-controls':acon,
					'role':'button',
					'aria-expanded':false,
					'tabindex':'0'
				}).addClass('mfClosed');
			});
		}
	} else if(mobFooter==0) {
		if($('ul.footerList').css('display')=='block') {
			// already done, don't want to keep repeating on each resize
		} else {
			$('ul.footerList').css('display','block');
			$('h2.footerColumnHeading').each(function() {
				$(this).removeAttr('aria-expanded role aria-controls tabindex').removeClass('mfClosed mfOpen');
			});
		}
	}
}

function runOnStartAndResize() {
	if($('#kh-mob-icon').css('display')=='block') {
		isMob = 1;
	} else {
		isMob = 0;
	} 
	if($('#footerRow3').css('flex-direction')=='column') { // happens at 590px w/ change to acc.
		mobFooter = 1;
		mobileFooterAcc();
	} else {
		mobFooter = 0;
		mobileFooterAcc();
	}

}

$(window).resize(function() {
	if(isEdit!='true') { // edit page is in perpetual resize so suppressing this (var set in page head)
		homePageHeight();
		
	}
	buttonsHeight();
	runOnStartAndResize();
});

$(window).load(function() {
	homePageHeight();
});

function titleMe() {
	$('.hcCallout').each(function(i,v) {
		var x = $(this).children('a').first().text();
		var c = $(this).children('p').first().text();
		if(pageLang==='es') {
			if(x.indexOf('adres')>-1) {
				var t = 'Para padres';
			} else if(x.indexOf('ños')>-1){
				var t = 'Para niños';
			} else if(x.indexOf('dolescentes')>-1) {
				var t = 'Para adolescentes';
			} else {
				$(this).children('h2').remove();
			}
		} else {
			if(c.indexOf('logo')>-1) {
				var t = 'Like our new look?'
			} else if(x.indexOf('arents')>-1) {
				var t = 'For Parents';
			} else if(x.indexOf('ids')>-1){
				var t = 'For Kids';
			} else if(x.indexOf('eens')>-1) {
				var t = 'For Teens';
			} else if(x.indexOf('ducators')) {
				var t = 'For Educators';
			} else {
				$(this).children('h2').remove();
			}
		}
		$(this).children('h2').text(t);
	});
}

function buttonsHeight() {
	if($('.kh-slide.active-slide').length) {
		var slideImgHeight = $('.active-slide > div > img').height();
		var halfHeight = Math.floor((parseInt(slideImgHeight) / 2) - 25); // half of image, minus half of button
		$('.kh-slideshow-buttons').css('top',halfHeight);
	}
}

$(window).on('load',function() {
	buttonsHeight();
	$('.kh-slideshow-buttons').css('visibility','visible');
});

$(document).ready(function () {
	$khHead = $('#kh-header');
	$nextSlideButt = $('#kh-slideshow-next');
	$prevSlideButt = $('#kh-slideshow-prev');
	$searchButt = $('#kh-search-icon'); // search button
	$searchArea = $('#kh-search-area'); // search container
	$navGroup = $('.kh-section-subnav') 
	$navTabsUL = $('ul#kh-topnav-tabs');
	$navTabsLI = $('ul#kh-topnav-tabs li');
	$navTabs = $('ul#kh-topnav-tabs li button');
	$modal = $('#kh-background-overlay');
	$burgerButt = $('button#kh-mob-icon');
	$mobMenu = $('#kh-mob-menu');
	$mobButts = $('ul#kh-mob-menu-buttons li button');
	$body = $('body');
	$khHead = $('#kh-header');
	
	$($modal).removeClass().hide(); // clear modal on page load

	var currentPage = window.location.href;
	
	var UA = navigator.userAgent; // get client useragent
    if (UA.indexOf('CriOS') > -1) { // add class to identify Chrome iOS and bypass animation flicker issue
        $body.addClass('CriOS');
    } else {
        $body.addClass('notCriOS');
    }
	runOnStartAndResize();
	// revert sansJS changes since this is with JS
	$('.sansJSMott').hide();
	$('ul#kh-mott-tabs').css('display','flex');
	$('.JSMott').show();
	$('#kh-mott-kids-links').hide();
	$('#kh-mott-teens-links').hide();

	// Marc's Shiny New Slideshow 2023
	/* the following line is for when I add graceful degredation to the slidedhow...
	$('.kh-slide:not(.active-slide)').css('display','none');
	*/

	buttonsHeight();
	const totalSlides = $('.kh-slideshow').data('slidestotalcount');
	$('#totalcount').text(totalSlides);
	$('#slidenumber').text(1);
	$prevSlideButt.css('visibility','hidden');

	$nextSlideButt.click(function() {
		$prevSlideButt.css('visibility','visible');
		let currentSlide = $('.active-slide').attr('id');
		var currentSlideNumber = currentSlide.substring(11);
		let nextSlideNumber = parseInt(currentSlideNumber) +1;
		if(nextSlideNumber==totalSlides) {
			$nextSlideButt.css('visibility','hidden');
		} else {
			$nextSlideButt.css('visibility','visible');
		}
		$('#'+currentSlide).removeClass('active-slide');
		$('#slideNumber'+nextSlideNumber).addClass('active-slide');
		$('#slidenumber').text(nextSlideNumber);
	});

	$prevSlideButt.click(function() {
		$nextSlideButt.css('visibility','visible');
		var currentSlide = $('.active-slide').attr('id');
		var currentSlideNumber = currentSlide.substring(11);
		var nextSlideNumber = parseInt(currentSlideNumber) -1;
		if(nextSlideNumber==1) {
			$prevSlideButt.css('visibility','hidden');
		} else {
			$prevSlideButt.css('visibility','visible');
		}
		$('#'+currentSlide).removeClass('active-slide');
		$('#slideNumber'+nextSlideNumber).addClass('active-slide');
		$('#slidenumber').text(nextSlideNumber);
	});

	// home page functions
	titleMe();
	var $homeDots = $('.kh-landing-page ul#kh-slider-dots li');
	var $homeDotsButt = $('.kh-landing-page ul#kh-slider-dots li button');
	$('#slideNumber1').addClass('waxOn');
	$('#buttonDot1').addClass('activeDot');
	var totalHomeSlides = $($homeDots).length;

	$('.hcNext').click(function() { // rotator controls
		var activeSlide = $('.waxOn').attr('id');
		var slideNumber = activeSlide.substring(11,12);
		var nextSlide = parseInt(slideNumber) + 1;
		if(nextSlide>totalHomeSlides) {
			var nextSlide = 1; // cycles back to start when end reached
		}
		$('#'+activeSlide).removeClass('waxOn');
		$('#slideNumber'+nextSlide).addClass('waxOn');
		$('#buttonDot'+slideNumber).removeClass('activeDot');
		$('#buttonDot'+nextSlide).addClass('activeDot');
	});

	$('.hcPrev').click(function() {
		var activeSlide = $('.waxOn').attr('id');
		var slideNumber = activeSlide.substring(11,12);
		var nextSlide = parseInt(slideNumber) - 1;
		if(nextSlide<1) {
			var nextSlide = totalHomeSlides; // cycles to end when start reached
		}
		$('#'+activeSlide).removeClass('waxOn');
		$('#slideNumber'+nextSlide).addClass('waxOn');
		$('#buttonDot'+slideNumber).removeClass('activeDot');
		$('#buttonDot'+nextSlide).addClass('activeDot');
	});

	$($homeDotsButt).click(function() {
		var whichDot = $(this).attr('id').substring(9,10);
		$($homeDotsButt).removeClass();
		$(this).addClass('activeDot');
		$('.HomePageRotatorCarousel > div > div').removeClass('waxOn');
		$('#slideNumber'+whichDot).addClass('waxOn');
	});
	
	// video AD button for keyboard, mouse, touch and hybrid devices
	// for keyboard control, made container target instead of button and have container take enter as click
	$('.khad-container').attr('tabindex','0');
	$('.khad-container .khad-button').attr('tabindex','-1');

	$('.khad-button').on({
		touchstart: function() {
			$(this).click();
		},
		touchend: function() {
			var thisButt = this;
			setTimeout(function() {
				$(thisButt).closest('.khad-container').removeClass('adHover adClickable');
			},1000);	
		}
	});

	$('.khad-container').on({	
		touchstart: function(e) {
			e.preventDefault();
			$(this).addClass('adHover');
			var thisButt = this;
			$(thisButt).data('buttTime', setTimeout(function() {
				$(thisButt).addClass('adClickable');
				touched = false;
			},1000));
		},
		touchcancel: function(e) {
			e.preventDefault();
			clearTimeout($(this).data('buttTime'));
			$(this).removeClass('adHover adClickable');
		},
		keyup: function(e) {
			if(e.key === 'Enter') {
				var thisButt = this;
				$(thisButt).find('.khad-button').click();
			}
		}
	});

	$('html').on({
		touchstart: function(e) {
			var whaTap = $(e.target);
			if(!whaTap.parents().andSelf().is('.khad-container')) { // touch outside of ad button, clear them
				$('.khad-container').removeClass('adHover adClickable');
			}
		}
	});

	animationTime = 200; // used for timeout functions to easily adjust timing

	function killTimeouts() {
		for (i = 0; i < 100; i++) {
			window.clearTimeout(i);
		}
	}
	
	// set current section
	var currentSection = function() {
		if(currentPage.indexOf('/en/parents')>-1||currentPage.indexOf('/es/parents')>-1) {
			var sec = 'parents';
		} else if(currentPage.indexOf('/en/kids')>-1||currentPage.indexOf('/es/kids')>-1) {
			var sec = 'kids';
		} else if(currentPage.indexOf('/en/teens')>-1||currentPage.indexOf('/es/teens')>-1) {
			var sec = 'teens';
		} else {
			var sec = 'parents'; // defaulting to parents for now
		}
		$('#khMainContainer').addClass(sec);
		return sec;
	}();
	
	$('ul#kh-topnav-tabs li button[data-section="'+currentSection+'"]').attr('data-status','currentSection');
	
	// search
	var elements = document.getElementsByTagName("INPUT");
	for (var i = 0; i < elements.length; i++) {
		elements[i].oninvalid = function(e) {
				e.target.setCustomValidity("");
				if (!e.target.validity.valid) {
					if(pageLang==='es') {
						e.target.setCustomValidity("Por favor, complete este campo");
					}
					else {
						e.target.setCustomValidity("Please fill out this field");
					}
				}
		};
		elements[i].oninput = function(e) {
				e.target.setCustomValidity("");
		};
	} 

	function fixOn(whereTo) {
		currentScroll = $(window).scrollTop();
		if($body.hasClass('shrunkenBody')||$body.hasClass('shrunkenBodied')) {
			$body.css({
				'position': 'fixed',
				'touch-action': 'none',
				'-webkit-overflow-scrolling': 'none',
				'overscroll-behavior': 'none',
				'width': '100%',
				'overflow': '',
				'top': -((whereTo))
			});
			$body.addClass('shrunkenBodied');
			$khHead.addClass('shrunkenHeaded');
			isShrunk=1;
		} else {
			$('html').addClass('fixBG');
		}
	}
	
	function fixOff() {
		if($body.hasClass('shrunkenBody')||$body.hasClass('shrunkenBodied')) {
			$body.css({
				'position': '',
				'touch-action': '',
				'-webkit-overflow-scrolling': '',
				'overscroll-behavior': '',
				'width': '',
				'overflow': '',
				'top': ''
			});
			isShrunk=1;
		} else {
			$('html').removeClass('fixBG');
		}
	
		if(isShrunk==1) {
			$body.removeClass('shrunkenBodied').addClass('shrunkenBody');
			$khHead.removeClass('shrunkenHeaded').addClass('shrunkenHead');
			$('html, body').scrollTop(currentScroll);
		}
	}

	function modalOut(whereTo) {
		$($modal).removeClass('modalIn').addClass('modalOut');
		setTimeout(function() {
			$($modal).hide();
		},animationTime);
		if(isShrunk==1) {
			fixOff();
		} else {
			fixOff();
		}
	}

	function modalIn(isMob) {
		if(isShrunk==1) {
			let howFar = $(window).scrollTop();
			fixOn(howFar);
		} else {
			fixOn();
		}
		
		if(isMob==1) {
			$($modal).removeClass('modalOut').addClass('modalIn').show();
		} else {
			$($modal).removeClass('modalOut').addClass('modalIn').show();
		}
		
	}

	function closeAllNavTabs() {
		$($navTabs).each(function() {
			if($(this).hasClass('openTab')) {
				$(this).removeClass().attr('aria-expanded','false');
			}
		});
		$($navGroup).each(function() {
			if($(this).hasClass('openNav')) {
				$(this).removeClass('openNav').addClass('closedNav');
			}
		});
	}

	$(window).resize(function () {
		//closeAllNavTabs();
	});

	function closeNav(whichNav,whichTab,modOut,section) {
		if(modOut!=true) {
			var howFar = $(window).scrollTop();
			modalOut(howFar);
		}
		$(whichTab).removeClass('openTab').attr('aria-expanded','false');
		$(whichNav).removeClass('openNav').addClass('closingNav');
		setTimeout(function(){
			//$(whichNav).removeClass('closingNav').addClass('closedNav').hide();
			$(whichNav).removeClass('closingNav').addClass('closedNav'); 
		},animationTime);
		if($('body').hasClass('keyboardUser')) {
			$(whichTab).focus();
		}
	}

	function closeOtherNav(whichNav,whichTab,section) {
		// if(isMob==0) {
		// 	resetMobNav();
		// }
		$($navGroup).each(function() {
			if(!$(this).is(whichNav)) {
				$(this).removeClass('openNav').addClass('closedNav');
			}
		});
		$($navTabs).each(function() {
			if(!$(this).is(whichTab)) {
				$(this).attr('aria-expanded','false').removeClass('openTab');
			}
		});
		var tab = '#tabTrap_'+section;
		$('.tabTrap').each(function() {
			if(!$(this).is(tab)) {
				var untab = '#'+$(this).attr('id');
				tabTrapper(untab,'-1','');
			}
		});
	}

	// make these functions next
	function resetMobNav() {
		//$('#kh-mob-menu').removeClass().addClass('closedNav').hide();
		closeMobMenu();
		$('#kh-mob-menu').removeClass().addClass('closedNav');
		$('#kh-mob-icon').removeClass().attr('aria-expanded','false');
	}

	$($modal).click(function() { // close everything on modal click
		killTimeouts();
		if($('#kh-search-icon').attr('aria-expanded')=='true') {
			closeSearch();
		} else if($($burgerButt).attr('aria-expanded')=='true') {
			resetMobNav();
		} else if($('#kh-parents-tab').attr('aria-expanded')=='true') {
			closeNav('#kh-parents-subnav','#kh-parents-tab');
		} else if($('#kh-kids-tab').attr('aria-expanded')=='true') {
			closeNav('#kh-kids-subnav','#kh-kids-tab');
		} else if($('#kh-teens-tab').attr('aria-expanded')=='true') {
			closeNav('#kh-teens-subnav','#kh-teens-tab');
		}
		if($khHead.hasClass('shrunkenHead')||$khHead.hasClass('shrunkenHeaded')) {
			var howFar = $(window).scrollTop();
			fixOff(howFar);
		} else {
			fixOff();
		}
		
		$($modal).removeClass().hide();
		unTrap();
	});

	function openNav(whichNav,whichTab,section) {
		closeOtherNav(whichNav,whichTab,section); // close other nav (if open)
		quickCloseSearch(); // and search
		if(!$($modal).hasClass('modalIn')) { // if modal already open, leave it open to avoid flicker
			modalIn(); 
		}
		$(whichTab).addClass('openTab').attr('aria-expanded','true'); // mark tab open
		$(whichNav).removeClass('closedNav').addClass('openingNav'); // open the dropdown
		setTimeout(function() {
			$(whichNav).removeClass('openingNav').addClass('openNav');
			if($('body').hasClass('keyboardUser')) {
				$(whichNav+' .kh-section-subnav-row2 ul li:first-child a').focus();
			}
		},animationTime);
	}

	$($navTabs).click(function() { // nav button clicked
		//killTimeouts();
		var section = $(this).attr("data-section");
		// 2. another tab is already open
		// 3. no tabs are open yet
		var tabID = '#kh-'+section+'-tab';
		var navID = '#kh-'+section+'-subnav';
		var tabTrapID = '#tabTrap_'+section;
		if($(navID).hasClass('openingNav')||$(tabID).hasClass('closingNav')) {
			// to mitigate double clicking - nav is in process of opening or closing so leave it be
		} else if($(tabID).hasClass('openTab')) { // tab is already open - close it
			closeNav(navID,tabID);
			tabTrapper(tabTrapID,'-1');
		} else { // tab is not open
			openNav(navID,tabID,section);
			tabTrapper(tabTrapID,'0',tabID);
		}
	});

	function openSearch() {
		killTimeouts();
		closeAllNavTabs();
		unTrap(); 
		
		tabTrapper('#tabTrap_search','0','#kh-search-icon');
		if(!$($modal).hasClass('modalIn')) { // avoid modal flicker
			modalIn();
		}
		$($searchButt).addClass('openSearchButt').attr('aria-expanded','true').text(searchButtonCloseText);
		$($searchArea).removeClass('closedSearch').addClass('openingSearch').show();
		setTimeout(function() {
			$($searchArea).removeClass('openingSearch').addClass('openSearch');
		},animationTime);
	}

	function quickCloseSearch() {
		$($searchButt).removeClass('openSearchButt').addClass('closeSearchButt').attr('aria-expanded','false').text(searchButtonSearchText);
		$($searchArea).attr('class','closedSearch');
		tabTrapper('#tabTrap_search','-1');
	}

	function closeSearch() {
		var howFar = $(window).scrollTop();
		$($searchButt).removeClass('openSearchButt').addClass('closeSearchButt').attr('aria-expanded','false').text(searchButtonSearchText);
		if(isShrunk==1) {
			modalOut(howFar)
		} else {
			modalOut();
		}
		
		$($searchArea).removeClass('openSearch').addClass('closingSearch');
		setTimeout(function() {
			$($searchButt).removeClass('closeSearchButt');
			$($searchArea).removeClass('closingSearch').addClass('closedSearch');
		},animationTime);
		tabTrapper('#tabTrap_search','-1');
	}
	
	$($searchButt).click(function() {
		if($($searchButt).hasClass('openSearchButt')) { // search is open, close it
			closeSearch();
		} else { // search is closed, open it
			openSearch();
		}
	});

	function openMobMenu() {
		$($modal).addClass('mobMenu4z'); // class adjusts z-index to put modal above nav
		modalIn();
		$(this).addClass('openMMB');
		$($mobMenu).addClass('openMM');
	}

	function closeMobMenu() {
		unTrap();
		closeNav('#kh-mob-menu','#kh-mob-icon');
		setTimeout(function() {
			$($modal).removeClass('mobMenu4z');
		},animationTime);
		$('.kh-section-subnav').removeClass('openNav').addClass('closedNav');
	}

	$($burgerButt).click(function() {
		// wcag, animations etc. to follow - for now just adding class to render styles
		if($(this).attr('aria-expanded')=='true') { // MMB = Mob Menu Button
			closeNav('#kh-mob-menu','#kh-mob-icon');
			setTimeout(function() {
				$($modal).removeClass('mobMenu4z');
			},animationTime);
			tabTrapper('#tabTrap_mm','-1');
		} else {
			$($modal).addClass('mobMenu4z'); // class adjusts z-index to put modal above nav
			openNav('#kh-mob-menu','#kh-mob-icon','burgerButt');
			tabTrapper('#tabTrap_mm','0','#mob-menu-close');
		}
	});

	$('#mob-menu-close').click(function() {
		closeMobMenu();
	});

	$('.kh-mob-back button').on('focusout keydown',function(e) {
		e.stopPropagation;
		if(e.key==='Tab') {	
			if(e.shiftKey) {
				$('#mob-menu-close').focus();
				return false;
			} else {
				// nothing yet
			}
		}
	});

	$('#mob-menu-close').on('focusout keydown',function(e) {
		var destinationDown;
		var destinationUp;
		$('ul#kh-mob-menu-buttons li button').each(function() {
			if($(this).attr('aria-expanded')=='true') {
				var section = $(this).data('section');
				destinationDown = '#'+section+'Back';
				destinationUp = '#kh-'+section+'-subnav > div > div.kh-section-subnav-row3 > ul > li:last-child a';
			}
		});
		if(e.key==='Tab') {
			if(e.shiftKey) {
				//e.stopPropagation;
				$(destinationUp).focus();
				//return false;
			} else {
				//e.stopPropagation;
				$(destinationDown).focus();
				//return false;
			}
		}
	});

	$('.kh-mob-back button').click(function() {
		var section = $(this).attr("data-section");
		var tabID = '#mob-butt-'+section;
		var navID = '#kh-'+section+'-subnav';
		var tabTrapID = '#tabTrap_'+section;
		if($(navID).hasClass('openingNav')||$(tabID).hasClass('closingNav')) {
			// to mitigate double clicking - nav is in process of opening or closing so leave it be
		} else if($(tabID).hasClass('openTab')) { // tab is already open - close it
			tabTrapper(tabTrapID,'-1');
			tabTrapper('#tabTrap_mm','0','#mob-menu-close');
			closeNav(navID,tabID,true);
			$(tabID).focus();
		} else { // tab is not open
			// tabTrapper(section,'0',tabID);
			// openNav(navID,tabID);
		}
	});

	$($mobButts).click(function() { // nav button clicked
		//killTimeouts();
		var section = $(this).attr("data-section");
		// 2. another tab is already open
		// 3. no tabs are open yet
		var tabID = '#mob-butt-'+section;
		var navID = '#kh-'+section+'-subnav';
		var backButt = '#'+section+'Back';
		var tabTrapID = '#tabTrap_'+section;
		if($(navID).hasClass('openingNav')||$(tabID).hasClass('closingNav')) {
			// to mitigate double clicking - nav is in process of opening or closing so leave it be
		} else if($(tabID).hasClass('openTab')) { // tab is already open - close it
			closeNav(navID,tabID,true);
			tabTrapper(tabTrapID,'-1');
		} else { // tab is not open
			openNav(navID,tabID,section);
			tabTrapper(tabTrapID,'0',backButt);
		}
	});

	mobFootArr = [];

	function mobileFooterOpenClose(fH,fU) {
		if($(fH).hasClass('mfOpen')) { // menu is expanded, close it
			$(fH).removeClass('mfOpen').addClass('mfClosed').attr('aria-expanded','false');
			$(fU).css('display','none');
			mobFootArr = $.grep(mobFootArr, function(value) {
				return value != fH; // remove button closed from array 
			});
		} else if($(fH).hasClass('mfClosed')) { // menu is not expanded, open it
			$(fH).removeClass('mfClosed').addClass('mfOpen').attr('aria-expanded','true');
			$(fU).css('display','block');
			mobFootArr.push(fH);
		}
	}

	$('.footerColumnHeading').on({ // footer accordion clicks (mob only)
		click: function(e) {
			e.preventDefault();
			var fcID = '#'+$(this).attr('id');
			var fcUL = '#'+$(this).attr('aria-controls');
			mobileFooterOpenClose(fcID,fcUL);
		},
		keyup: function(e) {
			if(e.key === 'Enter') {
				e.preventDefault();
				var fcID = '#'+$(this).attr('id');
				var fcUL = '#'+$(this).attr('aria-controls');
				mobileFooterOpenClose(fcID,fcUL);
			} // escape functionality with common keydown sequence below
		}
	});


	// marc - added escape function
	$(document).keydown(function (e) {
		// temp dev controls 
		/*if(e.key==='q') { // press q to get tab index status in console
			tt = new Array();
			$('.tabTrap').each(function() {
				tt.push({
					TAB_ID: $(this).attr('id'),
					STATUS: $(this).attr('tabindex')
				})
			});
			console.table(tt);
		} else if (e.key==='w') {
			let howFar = $(window).scrollTop();
			fixOn(howFar);
		} else if (e.key==='e') {
			let howFar = $(window).scrollTop();
			fixOff(howFar);
		} else*/ 
		if (e.key === "Escape") { // will make this more refined as time allows - for now am brute closing everything on escape
			e.preventDefault();
			if($('#kh-search-icon').attr('aria-expanded')=='true') { // search opened
				if($('#searchform').hasClass('suggs')) {
					$('#searchform').removeClass('suggs');
				} else if($('#q').val()) {
					$('#q').val('');
				} else {
					closeSearch();
				}
			} else if($($burgerButt).attr('aria-expanded')=='true') { // mobile menu opened
				if($('#mob-butt-parents').attr('aria-expanded')=='true') {
					closeNav('#kh-parents-subnav','#mob-butt-parents',true);
				} else if($('#mob-butt-kids').attr('aria-expanded')=='true') {
					closeNav('#kh-kids-subnav','#mob-butt-kids',true);
				} else if($('#mob-butt-teens').attr('aria-expanded')=='true') {
					closeNav('#kh-teens-subnav','#mob-butt-teens',true);
				} else {
					closeMobMenu();
				}
			} else if($('#kh-parents-tab').attr('aria-expanded')=='true') {
				closeNav('#kh-parents-subnav','#kh-parents-tab');
			} else if($('#kh-kids-tab').attr('aria-expanded')=='true') {
				closeNav('#kh-kids-subnav','#kh-kids-tab');
			} else if($('#kh-teens-tab').attr('aria-expanded')=='true') {
				closeNav('#kh-teens-subnav','#kh-teens-tab');
			} else if(mobFootArr.length!==0) { // array isn't empty, so something in the footer is expanded
				var lastOpenedFH = mobFootArr[mobFootArr.length -1];
				var lastOpenedUL = lastOpenedFH.slice(0,-1)+'UL';
				mobileFooterOpenClose(lastOpenedFH,lastOpenedUL);
			}
			// else if($('button.kh-category-title').attr('aria-expanded')=='true') {
			// 	$('button.kh-category-title[aria-expanded="true"]').click();
			// }
			// need proper category and accordion array with closing in order

		} else if(e.key==="Tab") {
			$("body").removeClass("mouseUser");
			$("body").addClass("keyboardUser");
		} else if(e.key==='Enter') {
			if($('#q').is(':focus')) {
				e.preventDefault();
				searchurl();
			}
		} // start arrow key functionality for ms mott box
		else if (e.key === "ArrowRight") { // move to next tab. some might suggest applying this to arrow down as well - W3C says otherwise tho
			if ($("#parents_tab").is(":focus")) { // forward from parents tab
				if ($("#kids_tab").length) { // does kids exist?
					$("#kids_tab").focus(); // if so place focus there
					kh_mottbox_change_section('kids'); // and activate the tab and its content
					tabIndexer('kids'); // set other tabs to tabindex -1 and active tab to 0
				} else if ($("#teens_tab").length) { // guess there was no kids content
					$("#teens_tab").focus(); // so go to the teens tab instead
					kh_mottbox_change_section('teens'); // etc.
					tabIndexer('teens');
				}	
			} else if ($("#kids_tab").is(":focus")) {
				if ($("#teens_tab").length) {
					$("#teens_tab").focus();
					kh_mottbox_change_section('teens');
					tabIndexer('teens');
				} else if ($("#parents_tab").length) {
					$("#parents_tab").focus();
					kh_mottbox_change_section('parents');
					tabIndexer('parents');
				}
			} else if ($("#teens_tab").is(":focus")) {
				if ($("#parents_tab").length) {
					$("#parents_tab").focus();
					kh_mottbox_change_section('parents');
					tabIndexer('parents');
				} else if ($("#kids_tab").length) {
					$("#kids_tab").focus();
					kh_mottbox_change_section('kids');
					tabIndexer('kids');
				}
			}
		} else if (e.key === "ArrowLeft") { // move to previous tab
			if ($("#parents_tab").is(":focus")) {
				if ($("#teens_tab").length) {
					$("#teens_tab").focus();
					kh_mottbox_change_section('teens');
					tabIndexer('teens');
				} else if ($("#kids_tab").length) {
					$("#kids_tab").focus();
					kh_mottbox_change_section('kids');
					tabIndexer('kids');
				}
			} else if ($("#kids_tab").is(":focus")) {
				if ($("#parents_tab").length) {
					$("#parents_tab").focus();
					kh_mottbox_change_section('parents');
					tabIndexer('parents');
				} else if ($("#teens_tab").length) {
					$("#teens_tab").focus();
					kh_mottbox_change_section('teens');
					tabIndexer('teens');
				}
			} else if ($("#teens_tab").is(":focus")) {
				if ($("#kids_tab").length) {
					$("#kids_tab").focus();
					kh_mottbox_change_section('kids');
					tabIndexer('kids');
				} else if ($("#parents_tab").length) {
					$("#parents_tab").focus();
					kh_mottbox_change_section('parents');
					tabIndexer('parents');
				}
			}
		}
	});

	var menuIsClosed = function() {
		if($('#kh-parents-tab').attr('aria-expanded')=='false' && 
			$('#kh-teens-tab').attr('aria-expanded')=='false' && 
			$('#kh-parents-tab').attr('aria-expanded')=='false' &&
			$('#kh-search-icon').attr('aria-expanded')!='true' &&
			$('#kh-mob-icon').attr('aria-expanded')!='true') {
				return true;
		} else {
			return false;
		}
	}

	$(window).scroll(function() {
		// sticky header
		fromTop = $(window).scrollTop();
	
		if(isMob==1) {
			topOff = 30; // point at which header fixes into place
		} else {
			topOff = 50;
		}
		if (fromTop >= topOff) {
			$body.addClass('shrunkenBody');
			$khHead.addClass('shrunkenHead');
			isShrunk = 1;
		} else if(fromTop < topOff) {
			$body.removeClass('shrunkenBody');
			$khHead.removeClass('shrunkenHead');
			isShrunk = 0;
		}
		if($body.hasClass('shrunkenBodied') || $body.hasClass('shrunkenHead')) {
			isShrunk = 1;
		}
	});

	$(document).mousedown(function() {
		$("body").removeClass("keyboardUser");
		$("body").addClass("mouseUser");
	});

	$(document).on({'touchstart':function(){
		//$("body").removeClass();
		//$("body").addClass("keyboardUser");
	}});

	// marc - some focus fixes during escape
	$("#kh-search-lang-select").blur(function () {
		$("#kh-search-lang-select").removeClass('hugMe');
	});

	/* tab traps
		tabTrap_parents = after P nav
		_kids = after K nav
		_teens = after T nav
		_search = after search submit
		_mm - end of mob menu
	*/

	function tabTrapper(whichTab,changeTo,whichFocus) { // which tab trap, sets values when menu/search opened, 0 = on -1 = off, which focus tabtrap on focus
		if(whichFocus==undefined||whichFocus==null) {
			var whichFocus = '';
		}
		$(whichTab).attr('tabindex',changeTo).attr('data-focusto',whichFocus);
	}

	function unTrap() {
		$('.tabTrap').each(function() {
			$(this).attr('tabindex','-1');
		});
	}

	$('.tabTrap').focus(function() {
		var whereTo = $(this).attr('data-focusto');
		$(whereTo).focus();
	});

	$("#skippy").click(function () {
		kh_close_menu();
		kh_hide_tab();
		kh_search_close(false);
		$("#searchform input#q").blur();
		$($modal).hide();
	});

	function tabIndexer(section) { // mott box function - still used?
			if (section === 'parents') {
			$("#parents_tab").attr('tabindex', 0);
			$("#teens_tab").attr('tabindex', -1);
			$("#kids_tab").attr('tabindex', -1);
		}
		if (section === 'kids') {
			$("#parents_tab").attr('tabindex', -1);
			$("#teens_tab").attr('tabindex', -1);
			$("#kids_tab").attr('tabindex', 0);
		}
		if (section === 'teens') {
			$("#parents_tab").attr('tabindex', -1);
			$("#teens_tab").attr('tabindex', 0);
			$("#kids_tab").attr('tabindex', -1);
		}
	}

	$("#searchButton").on("keydown", function(e) {
    if(e.keyCode == '13'){
		searchurl();
    }
    if(e.keyCode=='9') {
		$("#kh-search-icon").attr("tabindex","0");
	}
    });


	// Detect Information for WebTrends Search Stats
	function kh_search_tracking_tag() {
		var device_type = (isMobile) ? "mob" : "dtop";

		if ($("#searchform input#q").attr("lang") == 'en') {
			var fLang = 'english';
			//var fLang = 'english_spanish'; // used to send english and spanish together in search query
		} else {
			var fLang = 'spanish';
			//var fLang = 'english_spanish'; // used to send english and spanish together in search query
		}
		//$("#searchform input[name='client']").val("ms_" + current_section.charAt(0) + "_" + $("#searchform input#q").attr("lang"));
		$("#searchform input[name='lang']").val(fLang);
		//$("#searchform input[name='WT.ac']").val("msh-" + current_section.charAt(0) + "-" + device_type + "-" + $("#searchform input#q").attr("lang") + "-search");
	}

	var current_section = $("#kh-topnav-tabs li button").parent().attr("data-section");

	if (!$("#kh-topnav-tabs li button").length) {
		current_section = "p";
	}

	kh_search_tracking_tag();

	$("#kh-search-lang-esp").click(function () {
		$("#searchform input#q").attr({
			placeholder: "Buscar",
			lang: "es"
		}).val("");
		$("#searchform").attr("action", "/es/" + current_section + "/");

		kh_search_tracking_tag();
	});

	$("#kh-search-lang-eng").click(function () {
		$("#searchform input#q").attr({
			placeholder: "Search",
			lang: "en"
		}).val("");
		$("#searchform").attr("action", "/en/" + current_section + "/");
		kh_search_tracking_tag();

	});
	
	$("#searchLangSelector").change(function () {
		var nLang = '';
		var nTerm = $('#q').val();
		$("select option:selected").each(function(){
			nLang = $(this).val();
		});
		if(nLang==='spanish') {
			$("#searchform input#q").attr({
			placeholder: "Buscar",
			lang: "es"
			}).val(''); // replace search term to reinitialize suggestions to correct language
			$("#searchform").attr("action", "/es/" + current_section + "/");
			kh_search_tracking_tag();
		}
		else if(nLang==='english') {
			$("#searchform input#q").attr({
			placeholder: "Search",
			lang: "en"
			}).val('');
			$("#searchform").attr("action", "/en/" + current_section + "/");
			kh_search_tracking_tag();
		}
		$('#q').val(nTerm);
		/*
		$("#searchform input#q").attr({
			placeholder: "Buscar",
			lang: "es"
		}).val("");
		$("#searchform").attr("action", "/es/" + current_section + "/");

		kh_search_tracking_tag();*/
	});


	$("#langRadios").focusin(function () {
		$("#langRadios").attr('class', 'hugMe');
	});

	$("#langRadios").focusout(function () {
		$("#langRadios").attr('class', 'noBorder');
	});

	// Fix for Orientation Change Search Box Issue
	window.addEventListener("orientationchange", function () {
		$("#searchform input#q").blur();
	}, false);

	function onElementHeightChange(elm, callback) {
		var lastHeight = elm.clientHeight,
			newHeight;

		(function run() {
			newHeight = elm.clientHeight;

			if (lastHeight != newHeight) {
				callback();
			}

			lastHeight = newHeight;

			if (elm.onElementHeightChangeTimer) {
				clearTimeout(elm.onElementHeightChangeTimer);
			}

			elm.onElementHeightChangeTimer = setTimeout(run, 200);
		})();
	}

	$(document).on("keypress",function(e) {
		if(e.which == 13) {
			if($(".addthis_button_facebook button").is(":focus")) {
				$(".at-icon-facebook").click();
			}

			if($(".addthis_button_twitter button").is(":focus")) {
				$(".at-icon-twitter").click();
			}

			if($(".addthis_button_pinterest button").is(":focus")) {
				$(".at-icon-pinterest").click();
			}

			if($(".addthis_button_email button").is(":focus")) {
				$(".at-icon-email").click();
			}
		}
	});

	// mott
	if($('ul.kh-mott-links li').length == 0){
        $('div#kh-mott-box').hide();
    }else{
        if($("ul#kh-mott-teens-links li").length == 0){
            $("ul#kh-mott-tabs li[data-section='teens']").remove();
            $("#teens_panel").hide();
        }
        if($("ul#kh-mott-kids-links li").length == 0){
            $("ul#kh-mott-tabs li[data-section='kids']").remove();
            $("#kids_panel").hide();
        }
        if($("ul#kh-mott-parents-links li").length == 0){
            $("ul#kh-mott-tabs li[data-section='parents']").remove();
            $("#parents_panel").hide();
        }
        $('div#kh-mott-box').show();
    }

	// MOTT Box
	var kh_num_mott_links = 5;

	function kh_mottbox_open() {
		$(".kh-mott-links:visible li").show();

		$(".kh-mott-links li").removeClass("kh-mott-lastlink");
		$(".kh-mott-links li:last-child").addClass("kh-mott-lastlink");

		$("#kh-mott-toggle").attr("data-expanded", "true");

		if ($("#kh-mott-toggle").hasClass("kh-mott-toggle-span")) {
			$("#kh-mott-toggle").text("ver menos").show();
		} else {
			$("#kh-mott-toggle").text("View less").show();
		}
	}

	function kh_mottbox_close() {
		$(".kh-mott-links li").removeClass("kh-mott-lastlink");

		$(".kh-mott-links:visible li").each(function (e) {
			if (e == kh_num_mott_links - 1) {
				$(this).addClass("kh-mott-lastlink");
			}

			if (e >= kh_num_mott_links) {
				$(this).hide();
			}
		});

		$("#kh-mott-toggle").attr("data-expanded", "false");

		if ($("#kh-mott-toggle").hasClass("kh-mott-toggle-span")) {
			$("#kh-mott-toggle").text("ver más").css("display", "block");
		} else {
			$("#kh-mott-toggle").text("View more").css("display", "block");
		}
	}

	function kh_mottbox_toggle() {
		if ($("#kh-mott-toggle").attr("data-expanded") != "true") {
			kh_mottbox_open();
		} else {
			kh_mottbox_close();
		}
	}

	function kh_mottbox_reset_toggle(section) {
		if ($("#kh-mott-" + section + "-links li").length > kh_num_mott_links) {
			kh_mottbox_close();
		} else {
			$("#kh-mott-toggle").hide();
		}
	}

	//if (!isMobile) {
		if($(".kh-mott-active").length>0) {

			kh_mottbox_reset_toggle($(".kh-mott-active").closest("li").attr("data-section"));
		}
		else { // no tabs to get the info from so...
			kh_mottbox_reset_toggle($("#kh-mott-tabs").text().toLowerCase());
		}
	//}

	$("#kh-mott-toggle").click(function () {
		kh_mottbox_toggle();
	});

	function kh_mottbox_change_section(section) {
		$("#kh-mott-tabs li button").removeClass("kh-mott-active");
		$(".kh-mott-links:visible").hide();
		$("#parents_tab").attr("aria-selected", "false");
		$("#kids_tab").attr("aria-selected", "false");
		$("#teens_tab").attr("aria-selected", "false");
		$("#kh-mott-tabs li[data-section='" + section + "'] button").addClass("kh-mott-active");
		$("#kh-mott-tabs li[data-section='" + section + "'] button").attr("aria-selected", "true");
		$("#kh-mott-" + section + "-links").show();

		//if (!isMobile) {
			kh_mottbox_reset_toggle(section);
		//}
	}

	$("#kh-mott-tabs button").click(function () {
		var section = $(this).parent("li").attr("data-section");

		if (section != $(".kh-mott-active").attr("data-section") && !$(this).parent("li").hasClass("kh-mott-inactive")) {
			kh_mottbox_change_section(section);
		}
	});

	if ($("#kh-mott-tabs li:not('.kh-mott-inactive')").length > 1) {
		$("#kh-mott-tabs li:not('.kh-mott-inactive') button").css("cursor", "pointer");
	}

	// Partner Ad
	if (isMobile) { // moves ad inline with article - suppressing for reskin Marc 2/3/2023
		//if(!isMobile) { // remove this if reusing
			if ($("#mainContentContainer").hasClass("kh-article-page")) {
				//if($("#khcontent p").text().length > 2) {
				var kh_partner_ad = $("#kh-partner-ad").detach();
				var $p = $("#khcontent p:eq(1)");
				if($p.parents().hasClass('kh-slideshow-slide-info')) { // reg would place ad in slideshow, so
					console.log('isslide');
					$('.slideshow:eq(0)').after(kh_partner_ad);
				} else { // reg
					console.log('notslide');
					$("#khcontent p:eq(1)").after(kh_partner_ad);
				}
				
				kh_partner_ad = null;

				//$(".kh-inline-ad-before").text("Article continues after partner message");
				$("#kh-partner-ad").css("margin-bottom", "20px");
				//}
			}
		//}
	}

	if (document.referrer.toLowerCase().indexOf('nemours') > -1 || document.referrer.toLowerCase().indexOf('medlineplus') > -1 || document.referrer.toLowerCase().indexOf('nlm') > -1 || document.referrer.toLowerCase().indexOf('nih') > -1 || document.referrer.toLowerCase().indexOf('mobilewebby') > -1) {
		$("#kh-partner-ad").css("display", "none");
	}

	// Category Dropdown Functionality
	$(".kh-category-title").click(function () {
		if ($(this).attr("aria-expanded") != "true") {
			$(this).closest(".kh-category-name").next(".kh-category-list").show();
			$(this).attr("aria-expanded", "true");
		} else {
			$(this).closest(".kh-category-name").next(".kh-category-list").hide();
			$(this).attr("aria-expanded", "false");
		}
	});

	// KH Partner Page - Specific for WCAG
	if($(".jumpTo a").length) {
		$(".jumpTo a").attr("tabindex", "-1");
	}
	
    if($("#kh-mott-tabs button") != undefined && $("#kh-mott-tabs button").length > 0 &&
            !$($("#kh-mott-tabs button")[0]).hasClass("kh-mott-active")){
            $("#kh-mott-tabs button")[0].click();
     }
    
    if($("#searchLangSelector") != undefined && $("#searchLangSelector").length >0){
    	 if(pageLang=='en'){
    		 $("#searchLangSelector option[value='english']").attr("selected","selected");
    		 $("#searchLangSelector option[value='spanish']").removeAttr("selected");
    		 $("#searchLangSelector").change();
    	 }
    	 else if(pageLang=='es'){
    		 $("#searchLangSelector option[value='spanish']").attr("selected","selected");
    		 $("#searchLangSelector option[value='english']").removeAttr("selected");
    		 $("#searchLangSelector").change();
    	 }
    }
    
    if($("ul#kh-topnav-tabs") != undefined && $("ul#kh-topnav-tabs").length >0){
    	 if(pageLang=='en'){
       		 $($("ul#kh-topnav-tabs")[0]).addClass("kh-english");
       		 $($("ul#kh-topnav-tabs")[0]).removeClass("kh-spanish");
       	 }else if(pageLang=='es'){
       		 $($("ul#kh-topnav-tabs")[0]).addClass("kh-spanish");
       		 $($("ul#kh-topnav-tabs")[0]).removeClass("kh-english");
       	 } 
   }
 });


 /* move search functions from HTML to JS */
 $(document).ready(function() {
	if(location.hostname==='localhost') {
		$('#searchform').attr({
			'actionpath':'/content/kidshealth/us/en/searchresults.html',
			'action':'/en/parents/'
		});
	}
	$('#q').focus(function() {
		closePopup();
	});
});

function searchurl(){
	var lang = $( "#searchLangSelector option:selected" ).text();
	var st ="?q=";
	var qry =  $('#q').val();
	if(qry === "" ){
		if(lang =='English'){
			var str ="Please fill out this Field";
			$('#validationfield').css('display','inline-block');
			$("#validationMessage").text(str);
		} else {
			var sp_str= "Por favor, complete este campo"; 
			$('#validationfield').css('display','inline-block');
			$("#validationMessage").text(sp_str);
		}

		setTimeout(closePopup,3000);

	} else {
		var ssurl = location.pathname;
		localStorage.setItem("searchsourceurl",ssurl);
		var lang = $( "#searchLangSelector option:selected" ).text();
		localStorage.setItem("language",lang);
		if(lang=='English'){


		var successpath =	document.getElementById('searchform').getAttribute('actionpath'); 
		successpath= successpath.replace("/es/","/en/");

	} else {
		var successpath =	document.getElementById('searchform').getAttribute('actionpath'); 
		successpath= successpath.replace("/en/","/es/");

	}
	qry =st.concat(qry);
	successpath = successpath.concat(qry);	
	var start ="&start=0";
	successpath = successpath.concat(start);
	successpath =successpath.concat("#");

	window.location.assign(successpath);
	}

}

function addRemovalButton() {
	var remButton = document.createElement('button');
	remButton.setAttribute('type', 'button');
	remButton.setAttribute('aria-label', 'Clear search');
	var remClick = document.createAttribute('onclick');
	remClick.value = 'emptyMyBox(); return false;';
	remButton.setAttributeNode(remClick);
	var remSubmit = document.createAttribute('onsubmit');
	remSubmit.value = 'submitHandle();';
	remButton.setAttributeNode(remSubmit);
	var remClass = document.createAttribute('class');
	remClass.value = 'clearSearch';
	remButton.setAttributeNode(remClass);
	var remID = document.createAttribute('id');
	remID.value = 'clearSearch';
	remButton.setAttributeNode(remID);
	var searchBox = document.getElementById('q');
	searchBox.insertAdjacentElement('afterend', remButton);
}

window.addEventListener('load', function() {
	addRemovalButton();
});


function emptyMyBox() {
	var toClear = document.getElementById('q');
	toClear.value = '';
	toClear.focus();
	//  document.getElementById('q').addEventListener('keyup', enterMe()); // overcoming issue where function is running on enter instead of submitting the form
}

function submitHandle() {
	event.preventDefault();

	if(event.keyCode===13) {
	searchurl();
	}
}

function closePopup(){
	$("#validationfield").fadeOut();
}

(function($, $document, ns) {
    "use strict";

    var $parentsMultifield,message,$parentsMultiFieldItems,$kidsMultifield,$kidsMultiFieldItems,
	$teensMultifield,$teensMultiFieldItems;

	// when dialog gets injected
    $(document).on("foundation-contentloaded", function(e) {
       // console.log("Inside Iamge Common");
        if($("span.cq-FileUpload-label") != undefined){
			$("span.cq-FileUpload-label").html("Drop an asset here");
        }
    });
})($, $(document), Granite.author);

// ######################################################################
// ############ REMEMBER THAT MOBILE VERSIONS EXIST WITHIN ##############
// ###### kh_headJS_mobile.js AND NEED TO BE UPDATED INDIVIDUALLY #######
// ######################################################################

// Create the download link
/**/
var	KHAdLanguage ="en";
var	licName = "KidsHealth";
var RSLanguage = "";
var RSVoice  = "";

if(KHAdLanguage=='es') {
	RSLanguage = 'es_us';
	RSVoice = 'es_us_penelope';
}
else {
	RSLanguage = 'en_us';
	RSVoice = 'Kate';
}
var theRSURL_new = (escape(document.location.href));
var rsAudioTitle_new = document.title.replace(/ |\'|\?/g,"_");
var readSpeakerDownloadLink_new = "//app-na.readspeaker.com/cgi-bin/rsent?customerid=5202&amp;lang="+RSLanguage+"&amp;readid=khcontent_article&amp;url="+theRSURL_new+"&amp;audiofilename=KidsHealth_"+rsAudioTitle_new+"&amp;save=1";


//window.onload=alert(rsAudioTitle_new);
// <!--

if (! window.rsConf) { window.rsConf = {}; }
if (! window.rsConf.ui) { window.rsConf.ui = {}; }
window.rsConf.ui.rsbtnClass = 'rsbtn_kidshealth';
var rsUA=navigator.userAgent;
rsUA=rsUA.toLowerCase();
if(rsUA.indexOf("ipad")!=-1) {
window.rsConf.ui.player = [
	'<span class="rsbtn_box">',
	'	<button onclick="javascript:void(0);" class="rsbtn_pause rsimg rspart rsbutton" title="Pause">',
	'		<span class="rsbtn_btnlabel">Pause</span>',
	'	</button>',
	'	<button onclick="javascript:void(0);" class="rsbtn_stop rsimg rspart rsbutton" title="Stop">',
	'		<span class="rsbtn_btnlabel">Stop</span>',
	'	</button>',
	/*'	<span class="rsbtn_progress_container rspart">',
	'		<span class="rsbtn_progress_played"></span>',
	'	</span>',
	'	<a href="javascript:void(0);" class="rsbtn_volume rsimg rspart rsbutton" title="Volume">',
	'		<span class="rsbtn_btnlabel">Volume</span>',
	'	</a>',
	'	<span class="rsbtn_volume_container rspart">',
	'		<span class="rsbtn_volume_slider"></span>',
	'	</span>',*/
	'	<a href="'+readSpeakerDownloadLink_new+'" target="rs" class="kh_rs_download rsimg rspart rsbutton" title="mp3">',
	'		<span class="rsbtn_btnlabel">mp3</span>',
	'	</a>',
	'	<button onclick="javascript:void(0);" class="rsbtn_settings rsimg rspart rsbutton" title="Settings">',
	'		<span class="rsbtn_btnlabel">Settings</span>',
	'	</button>',
	'	<button onclick="javascript:void(0);" class="rsbtn_closer rsimg rspart rsbutton" title="Close player">',
	'		<span class="rsbtn_btnlabel">Close</span>',
	'	</button>',
	'	<span class="rsdefloat"></span>',
	'</span>'
];
}
else {
	window.rsConf.ui.player = [
	'<span class="rsbtn_box">',
	'	<button onclick="javascript:void(0);" class="rsbtn_pause rsimg rspart rsbutton" title="Pause">',
	'		<span class="rsbtn_btnlabel">Pause</span>',
	'	</button>',
	'	<button onclick="javascript:void(0);" class="rsbtn_stop rsimg rspart rsbutton" title="Stop">',
	'		<span class="rsbtn_btnlabel">Stop</span>',
	'	</button>',
	'	<span class="rsbtn_progress_container rspart">',
	'		<span class="rsbtn_progress_played"></span>',
	'	</span>',
	'	<button onclick="ariaVolume();" onfocus="ariaVolume();" onblur="ariaVolume();" onfocusout="ariaVolume();" id="thisRSVolume" class="rsbtn_volume rsimg rspart rsbutton" title="Volume" aria-expanded="false" tabindex="0">',
	'		<span class="rsbtn_btnlabel">Volume</span>',
	'	</button>',
	'	<span class="rsbtn_volume_container rspart" id="thisRSVolumneContainer" style="display: none">',
	'		<span class="rsbtn_volume_slider"></span>',
	'	</span>',
	'	<a href="'+readSpeakerDownloadLink_new+'" target="rs" class="kh_rs_download rsimg rspart rsbutton" title="mp3">',
	'		<span class="rsbtn_btnlabel">mp3</span>',
	'	</a>',
	'	<button onclick="javascript:void(0);" class="rsbtn_settings rsimg rspart rsbutton" title="Settings">',
	'		<span class="rsbtn_btnlabel">Settings</span>',
	'	</button>',
	'	<button class="rsbtn_closer rsimg rspart rsbutton" title="Close player">',
	'		<span class="rsbtn_btnlabel">Close</span>',
	'	</button>',
	'	<span class="rsdefloat"></span>',
	'</span>'
];
}

window.rsConf.ui.popupbutton = [
 /* '<a class="rsbtn_play tester" accesskey="L" title="Listen with ReadSpeaker" href="">',
    '<span class="rsbtn_left rspart"><span class="rsbtn_text"><span>Listen</span></span></span>',
    '<span class="rsbtn_right rsimg rsplay rspart"></span>',
  '</a>'*/''
];

/*
window.rsConf.ui.popupbutton = [];
window.rsConf.ui.popupplayer = [];
*/
// -->

// JS From RS:


// Include the external Readspeaker JavaScript.
/*
readspeakerJS='http://f1.na.readspeaker.com/script/5202/ReadSpeaker.js?pids=embhl';
function loadRS_JS() {
	jsCall = document.createElement('script');
	jsCall.type = 'text/javascript';
	jsCall.src = readspeakerJS;
	document.getElementsByTagName('head')[0].appendChild(jsCall);
}
loadRS_JS();
*/
// Custom calls to external ReadSpeaker functionality. Mobile versions exist within kh_mobile.js

function makeTheRSLinkEN() {
	document.write('<a onclick="rsUsed(\'1\')" rel="nofollow" class="rsbtn_play rsen" title="Listen to this page using ReadSpeaker" href="//app-na.readspeaker.com/cgi-bin/rsent?customerid=5202&amp;lang=en_us&amp;readid=khcontent_article&amp;url='+theRSURL+'"><span class="rsbtn_left rspart"><span class="rsbtn_text"><span class="readspeakerLauncher">Listen</span></span></span><span class="rsbtn_right rsplay rspart"></span></a>');
}


function makeTheRSLinkES() {
	document.write('<a onclick="rsUsed(\'1\')" rel="nofollow" class="rsbtn_play rses" title="Escucha esta página utilizando ReadSpeaker" href="//app-na.readspeaker.com/cgi-bin/rsent?customerid=5202&amp;lang=es_us&amp;readid=khcontent_article&amp;url='+theRSURL+'"><span class="rsbtn_left rspart"><span class="rsbtn_text"><span class="readspeakerLauncher">Escuchar</span></span></span><span class="rsbtn_right rsplay rspart"></span></a>');
}

// Mobile versions exist within kh_mobile.js
var isit=0;
var readspeakered=0;
function rsUsed(isit) {
	if(isit==1) {
		readspeakered=1; }
	else {
		readspeakered=2;}
}

function closepage() {
	if(readspeakered==1){
		//rshlexit();
		ReadSpeaker.q(function(){if(rspkr.ui.getActivePlayer()){rspkr.ui.getActivePlayer().close()}});
	}
	else {
		//do nothing
	}
}

// Pagination:
function showhide1(the_div_id, numberofdivs, navpagestyle) {
		for (var i = 1; i <= numberofdivs; i++) {
		document.getElementById('NavigatePage' + i).style.display = 'none';
		// revert style for page number
		var tNS1 = document.getElementById('navi_pagenumber_'+i);
		tNS1.style.fontWeight='normal';
		tNS1.style.textDecoration='underline';
		tNS1.style.fontSize='10px';
		tNS1.style.color='#06c';
		/*
		document.getElementById('navi_pagenumber_' + i).style.fontWeight = 'normal';
		document.getElementById('navi_pagenumber_' + i).style.textDecoration = 'underline';
		document.getElementById('navi_pagenumber_' + i).style.fontSize = '10px';
		document.getElementById('navi_pagenumber_' + i).style.color = '#0066cc';
		*/

	} //toggleClass(theIdName,'pageNaviActive','pageNaviNormal');
	document.getElementById(the_div_id).style.display = "";
	// set style for page number
	var tNS2 = document.getElementById(navpagestyle);
	tNS2.style.fontWeight='bold';
	tNS2.style.textDecoration='none';
	tNS2.style.fontSize='14px';
	tNS2.style.color='#666666';
	/*
	document.getElementById(navpagestyle).style.fontWeight = 'bold';
	document.getElementById(navpagestyle).style.textDecoration = 'none';
	document.getElementById(navpagestyle).style.fontSize = '14px';
	document.getElementById(navpagestyle).style.color = '#cccccc'; /*  */

	window.location = '#';
}

function setDivStyleToNone(i) {
	document.getElementById('NavigatePage' + i).style.display = 'none';
}

function showImage(image_name, alt_text, next_page_text) {
	html = "<img alt='" + alt_text + "' src='" + image_name + "'border='0'>" +
		next_page_text;
	document.write(html);
}

function ariaVolume() {
	window.setTimeout(ariaVolumeMAIN,500);
}

function ariaVolumeMAIN() {
	ourButton = document.getElementById('thisRSVolume');
	currentAria = ourButton.getAttribute('aria-expanded');
	//ourVolumeContainer = document.getElementsByClassName('rsbtn_volume_container')[0].style.display;
	ourVolumeContainer = document.getElementById('thisRSVolumneContainer');
	ourVolumeContainerDisplay = ourVolumeContainer.style.display;
	//console.log(ourVolumeContainer);


	if(ourVolumeContainer!==null) {
		//console.log('ovc=NOTnull');
		if(ourVolumeContainerDisplay==='none') {
			//console.log('ovcd=none');
		ourButton.setAttribute('aria-expanded','false'); // Because the display value is set after click we actually appear to reverse the state setting
		}																									// so that display:none = true, even though we actually want 'false' to appear
		else if(ourVolumeContainerDisplay==='block') {
			//console.log('ovcd=none');
			ourButton.setAttribute('aria-expanded','true');
		}
	}
	else ourButton.setAttribute('aria-expanded','false');
	/*if(currentAria==='true') {
		ourButton.setAttribute('aria-expanded','false');
	}
	else {
		ourButton.setAttribute('aria-expanded','true');
	}
	ourSliderSpan = document.getElementsByClassName('rsbtn_volume_slider')[0];
	ourSlider = ourSliderSpan.firstChild;
	ourSlider.setAttribute('display','block');

	ourHolder = document.getElementsByClassName('rsbtn_volume_container')[0];
	ourHolderState = ourHolder.display.value;
	console.log(ourHolderState);
	if(ourHolderState==='block' or ourHolderState=null) {
		ourButton.setAttribute('aria-expanded','true');
	}
	else {
		ourButton.setAttribute('aria-expanded','false');
	}*/
	//ourSlider.setAttribute('tabindex','0');
	// get span rsbtn_volume_handle then target the child a tag
}
// Add spacebar activation
	$(document).keydown(function (e) {
		if (e.keyCode == 32) {
			if($('.rsbtn_play').is(":focus")) {
				$('.rsbtn_play').click();
				e.preventDefault();
			}
		}
	});

// This JavaScript is an amalgamation of previously called internal JS files
// that can be deferred until after page load.


// Previously from khCommon.js, which has now been split amongst the new JS files (kh_footJS_common.js, kh_footJS_desktop.js, kh_headJS_common.js etc.)
// KidsHealth common Javascript
// Copyright date
// Moved to doc.write.js

// Close window in all browsers
function closeWindow() {
    window.open('', '_parent', '');
    window.close();
}

function delay() {
    for (i = 0; i < 100000; i++) {}
}

function KH_unloadFunctions() {
    // Previously held functions, currently none.
}


function gamRefresh(url) {
        //Fake gamRefresh to clear up a problem with multi-page instruction sheets
				//Full gamRefresh function is defined within common_functions_mothership.js
    }
    // The Following is specific to LHR Search and Browse navigation elements

function clearText(field) {
    if (field.defaultValue == field.value) field.value = '';
    else if (field.value == '') field.value = field.defaultValue;
}

function licTabSwitcher(section) {
		_licTabParents = document.getElementById('licTabParents');
		_licTabKids = document.getElementById('licTabKids');
		_licTabTeens = document.getElementById('licTabTeens');
		_licNavParentsLinks = document.getElementById('licNavParentsLinks');
		_licNavKidsLinks = document.getElementById('licNavKidsLinks');
		_licNavTeensLinks = document.getElementById('licNavTeensLinks');
		_licTabParentsButton = document.getElementById('licTabParentsButton');
		_licTabKidsButton = document.getElementById('licTabKidsButton');
		_licTabTeensButton = document.getElementById('licTabTeensButton');

	if (section == "Parents") {
		//alert("parents");
		if (_licTabParentsButton != null && _licTabParentsButton.getAttribute('aria-expanded') == 'true') {
			_licTabParentsButton.setAttribute('aria-expanded', 'false');
		} else {
			if (_licTabParentsButton != null) {
				_licTabParentsButton.setAttribute('aria-expanded', 'true');
			}
			if(_licTabKidsButton != null) {
				_licTabKidsButton.setAttribute('aria-expanded', 'false');
			}
			if(_licTabTeensButton != null) {
				_licTabTeensButton.setAttribute('aria-expanded', 'false');
			}
		}
		if (_licTabParents.className == "licTabActive") {
			_licTabParents.className = "licTabWasActive";
		} else {
			if (_licTabTeens != null) {
				_licTabTeens.className = "licTabWasActive";
			}
			_licTabParents.className = "licTabActive";
			if (_licTabKids != null) {
				_licTabKids.className = "licTabWasActive";
			}
		}
		if (_licNavParentsLinks.style.display == "none" || _licNavParentsLinks.style.display == "") {
			_licNavParentsLinks.style.display = "block";
			if (_licNavKidsLinks != null) {
				_licNavKidsLinks.style.display = "none";
			}
			if (_licNavTeensLinks != null) {
				_licNavTeensLinks.style.display = "none";
			}
		} else {
			_licNavParentsLinks.style.display = "none";
		}
	} else if (section == "Teens") {
		//alert("teens");
		if (_licTabTeensButton != null && _licTabTeensButton.getAttribute('aria-expanded') == 'true') {
			_licTabTeensButton.setAttribute('aria-expanded', 'false');
		} else {
			if(_licTabParentsButton != null) {
				_licTabParentsButton.setAttribute('aria-expanded', 'false');
		}
			if(_licTabKidsButton != null) {
				_licTabKidsButton.setAttribute('aria-expanded', 'false');
			}
			if(_licTabTeensButton != null) {
			_licTabTeensButton.setAttribute('aria-expanded', 'true');
			}
		}
		if (_licTabTeens.className == "licTabActive") {
			_licTabTeens.className = "licTabWasActive";
		} else {
			if (_licTabParents != null) {
				_licTabParents.className = "licTabWasActive";
			}
			if (_licTabKids != null) {
				_licTabKids.className = "licTabWasActive";
			}
			_licTabTeens.className = "licTabActive";
		}
		if (_licNavTeensLinks.style.display == "none" || _licNavTeensLinks.style.display == "") {
			if (_licNavParentsLinks != null) {
				_licNavParentsLinks.style.display = "none";
			}
			if (_licNavKidsLinks != null) {
				_licNavKidsLinks.style.display = "none";
			}
			_licNavTeensLinks.style.display = "block";
		} else {
			_licNavTeensLinks.style.display = "none";
		}
	} else {
		//alert("kids");
		if (_licTabKidsButton != null && _licTabKidsButton.getAttribute('aria-expanded') == 'true') {
			_licTabKidsButton.setAttribute('aria-expanded', 'false');
		} else {
			if(_licTabParentsButton != null) {
				_licTabParentsButton.setAttribute('aria-expanded', 'false');
			}
			if(_licTabKidsButton != null) {
				_licTabKidsButton.setAttribute('aria-expanded', 'true');
			}
			if(_licTabTeensButton != null) {
				_licTabTeensButton.setAttribute('aria-expanded', 'false');
			}
		}
		if (_licTabKids.className == "licTabActive") {
			_licTabKids.className = "licTabWasActive";
		} else {
			if (_licTabParents != null) {
				_licTabParents.className = "licTabWasActive";
			}
			_licTabKids.className = "licTabActive";
			if (_licTabTeens != null) {
				_licTabTeens.className = "licTabWasActive";
			}
		}
		if (_licNavKidsLinks.style.display == "none" || _licNavKidsLinks.style.display == "") {
			if (_licNavParentsLinks != null) {
				_licNavParentsLinks.style.display = "none";
			}
			_licNavKidsLinks.style.display = "block";
			if (_licNavTeensLinks != null) {
				_licNavTeensLinks.style.display = "none";
			}
		} else {
			_licNavKidsLinks.style.display = "none";
		}
	}
}
// This should be used for all popup windows
function tehWindow(tehLink, tehTarget, tehWidth, tehHeight, tehScrollbars,
        tehToolbar, tehResize, tehTop, tehLeft, tehStatus) {
        window.open(tehLink, tehTarget, 'width=' + tehWidth + ',height=' +
            tehHeight + ',scrollbars=' + tehScrollbars + ',toolbar=' +
            tehToolbar + 'resizable=' + tehResize + ',top=' + tehTop +
            ',left=' + tehLeft + ',status=' + tehStatus + '');
    }
		
function clearText(field){
            if (field.defaultValue == field.value) field.value = '';
            else if (field.value == '') field.value = field.defaultValue;
            }
            
            function articleFontSize(changedFontSize) {
            fontSize = document.getElementById('khcontent');
            fontSize.style.fontSize = changedFontSize;
            }
						
// What others are reading - usually loaded only for mothership, since this file is common
// be sure to test licensees

// This javaScript is used to dynamically pull What other people are reading content dynamically when ever mothership static pages 
// are loaded. The content is pulled from a xml file under /licensees/licensee1  which is updated whenever any changes are submitted 
// through the HomeSetupTool 
function setWhatOthersWant(section) {
	var req = null;
	if (window.XMLHttpRequest) req = new XMLHttpRequest();
	else if (window.ActiveXObject) req = new ActiveXObject("Microsoft.XMLHTTP"); //For IE
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			if (req.status == 200) {
				// process a XML document here
				var xml = req.responseXML;
				i = 0;
				html = "";
				while (i >= 0) {
					whatOthersWantText = xml.getElementsByTagName("whatotherswant_text")[i];
					whatOthersWantURL = xml.getElementsByTagName("whatotherswant_url")[i];
					if (whatOthersWantText != null && whatOthersWantURL != null) {
						whatOthersWantText = whatOthersWantText.firstChild.data;
						whatOthersWantURL = whatOthersWantURL.firstChild.data;
						html += "<li class=\"test999\"><a href=\"" + whatOthersWantURL + "\">" +
							whatOthersWantText + "</li>";
						i++;
					} else {
						i = -1;
					}
				}
				var othersString = document.getElementById("whatOthersWant");
				if (othersString != null) {
					othersString.innerHTML = html;
				}
			} else {
				document.getElementById("whatOthersWant").innerHTML =
					"Error: returned status code " + req.status + " " + req.statusText;
			}
		}
	};
	if (section == "Parents") {
		req.open("GET", "/misc/xml/mothership/whatotherswant_Parents.xml", true);
	} else if (section == "Teens") {
		req.open("GET", "/misc/xml/mothership/whatotherswant_Teens.xml", true);
	} else {
		req.open("GET", "/misc/xml/mothership/whatotherswant_Kids.xml", true);
	}
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.send(' ');
}

/* Marc - removed focus hug 2/13/19 WCAG flying focus focushug */
// Updated by cron_job on Wed Apr  1 00:00:04 EDT 2020 

var KHcopyDate='2020';
var Server_Month='04';
var Server_Year='2020'; 


function initializeSplat() {
	if (typeof Tooltip != 'undefined') Tooltip.init();
}

function newPageStyles() {
	var sCL = document.getElementById('subCatLinks');
	if (sCL != null) {
		// this will start the WITA closed: sCL.style.display = 'none'; Change to display: 'block' to start open.
		//sCL.style.display = 'none';

		toggleLayer('subCatLinks'); toggleClass('subCatHeaderLink','subCatOpen','subCatClosed');
		// this will start the WITA open: toggleClass('subCatHeaderLink','subCatOpen','subCatClosed');
		// toggleClass('subCatHeaderLink','subCatOpen','subCatClosed');
	}
	//pCN = document.getElementById('navi_pagenumber_1');
	//toggleLayer('navi_pagenumber_1','pageNaviNormal','pageNaviActive');
}

function pageBreakerGD() {
	var pb = document.getElementsByTagName('div');
	for (var i = 0; i < pb.length; i++) {
		if (pb[i].className == 'pageNavi') pb[i].style.display = "block";
	}
	var pageCountBox = document.getElementById('pageCountNumberBox');
	if (pageCountBox != null) {
		pageCountBox.style.display = 'block';
	}
}

//window.addEventListener('load',KH_loadFunctions);
//window.onload = KH_loadFunctions();

// Did Virtusa create this to cause issues? 
// $(document).ready(function () { 
//     $('img').each(function() {
//         if( this.alt == "") {
//            this.alt = " ";
//         }
// 	});

// });
function remHash() {
	//window.location.replace("#");
	var frag = window.location.hash;
	var uri = window.location.href;
	if (frag.toLowerCase().indexOf("cat") >= 0) { // frag id contains cat, 99.999% that it's not needed on non-cat pages
		console.log('has cat');
		window.location.replace('#'); // replace current #whatever with empty #
		if (typeof window.history.replaceState == 'function') { // replace the url with everything before the final char, which will be the hash
			history.replaceState({}, '', window.location.href.slice(0, -1));
		  }
	} else {
		// no has cat
	}
	console.log(frag);
	console.log(uri);
	//window.location.hash('');
}

$(document).ready(function() {
	initializeSplat();
	runOnLoad();

	if($('#khcontent_category').length) {
		anchorsAway(); // is category page
		
	} else {
		remHash(); // is not category page
	}
	//console.log('kh_footJS.js from /clientlib-js-site/js');
});
// KidsHealth common Javascript
// Copyright date
// Moved to doc.write.js

// Close window in all browsers
function closeWindow() {
    window.open('', '_parent', '');
    window.close();
}

function delay() {
    for (i = 0; i < 100000; i++) {}
}

function KH_unloadFunctions() {
    // Previously held functions, currently none.
}

function toggleLayer(whichLayer) {
    if (document.getElementById) {
        // this is the way the standards work
        var style2 = document.getElementById(whichLayer).style;
        style2.display = style2.display ? "" : "none";
    } else if (document.all) {
        // this is the way old msie versions work
        var style2 = document.all[whichLayer].style;
        style2.display = style2.display ? "" : "none";
    } else if (document.layers) {
        // this is the way nn4 works
        var style2 = document.layers[whichLayer].style;
        style2.display = style2.display ? "" : "none";
    }
}

function toggleBackground(whatLayer) {
    if (document.getElementById) {
        // this is the way the standards work
        var style2 = document.getElementById(whatLayer).style;
        style2.backgroundImage = style2.backgroundImage =
            "url(/etc.clientlibs/kidshealth/clientlibs/clientlib-site/resources/images/licensees/standard_licensee/images/articleShrink.gif)";
    } else if (document.all) {
        // this is the way old msie versions work
        var style2 = document.all[whatLayer].style;
        style2.backgroundImage = style2.backgroundImage =
            "url(/etc.clientlibs/kidshealth/clientlibs/clientlib-site/resources/images/licensees/standard_licensee/images/articleShrink.gif)";
    } else if (document.layers) {
        // this is the way nn4 works
        var style2 = document.layers[whatLayer].style;
        style2.backgroundImage = style2.backgroundImage =
            "url(/etc.clientlibs/kidshealth/clientlibs/clientlib-site/resources/images/licensees/standard_licensee/images/articleShrink.gif)";
    }
}

function toggleClass(id, classOne, classtwo) {
    identity = document.getElementById(id);
    class_name = identity.className;
    if (class_name == classOne) {
        identity.className = classtwo;
    } else {
        identity.className = classOne;
    }
}

function gamRefresh(url) {
        //Fake gamRefresh to clear up a problem with multi-page instruction sheets
				//Full gamRefresh function is defined within common_functions_mothership.js
    }
    // The Following is specific to LHR Search and Browse navigation elements

function clearText(field) {
    if (field.defaultValue == field.value) field.value = '';
    else if (field.value == '') field.value = field.defaultValue;
}

function licTabSwitcher(section) {
        _licTabParents = document.getElementById('licTabParents');
        _licTabKids = document.getElementById('licTabKids');
        _licTabTeens = document.getElementById('licTabTeens');
        _licNavParentsLinks = document.getElementById('licNavParentsLinks');
        _licNavKidsLinks = document.getElementById('licNavKidsLinks');
        _licNavTeensLinks = document.getElementById('licNavTeensLinks');
        if (section == "Parents") {
            //alert("parents");
            if (_licTabParents.className == "licTabActive") {
                _licTabParents.className = "licTabWasActive";
            } else {
                if (_licTabTeens != null) {
                    _licTabTeens.className = "licTabWasActive";
                }
                _licTabParents.className = "licTabActive";
                if (_licTabKids != null) {
                    _licTabKids.className = "licTabWasActive";
                }
            }
            if (_licNavParentsLinks.style.display == "none" ||
                _licNavParentsLinks.style.display == "") {
                _licNavParentsLinks.style.display = "block";
                if (_licNavKidsLinks != null) {
                    _licNavKidsLinks.style.display = "none";
                }
                if (_licNavTeensLinks != null) {
                    _licNavTeensLinks.style.display = "none";
                }
            } else {
                _licNavParentsLinks.style.display = "none";
            }
        } else if (section == "Teens") {
            //alert("teens");
            if (_licTabTeens.className == "licTabActive") {
                _licTabTeens.className = "licTabWasActive";
            } else {
                if (_licTabParents != null) {
                    _licTabParents.className = "licWasTabActive";
                }
                if (_licTabKids != null) {
                    _licTabKids.className = "licTabWasActive";
                }
                _licTabTeens.className = "licTabActive";
            }
            if (_licNavTeensLinks.style.display == "none" || _licNavTeensLinks.style
                .display == "") {
                if (_licNavParentsLinks != null) {
                    _licNavParentsLinks.style.display = "none";
                }
                if (_licNavKidsLinks != null) {
                    _licNavKidsLinks.style.display = "none";
                }
                _licNavTeensLinks.style.display = "block";
            } else {
                _licNavTeensLinks.style.display = "none";
            }
        } else {
            //alert("kids");
            if (_licTabKids.className == "licTabActive") {
                _licTabKids.className = "licTabWasActive";
            } else {
                if (_licTabParents != null) {
                    _licTabParents.className = "licTabWasActive";
                }
                _licTabKids.className = "licTabActive";
                if (_licTabTeens != null) {
                    _licTabTeens.className = "licTabWasActive";
                }
            }
            if (_licNavKidsLinks.style.display == "none" || _licNavKidsLinks.style
                .display == "") {
                if (_licNavParentsLinks != null) {
                    _licNavParentsLinks.style.display = "none";
                }
                _licNavKidsLinks.style.display = "block";
                if (_licNavTeensLinks != null) {
                    _licNavTeensLinks.style.display = "none";
                }
            } else {
                _licNavKidsLinks.style.display = "none";
            }
        }
    }
		
// This should be used for all popup windows
function tehWindow(tehLink, tehTarget, tehWidth, tehHeight, tehScrollbars,
        tehToolbar, tehResize, tehTop, tehLeft, tehStatus) {
        window.open(tehLink, tehTarget, 'width=' + tehWidth + ',height=' +
            tehHeight + ',scrollbars=' + tehScrollbars + ',toolbar=' +
            tehToolbar + 'resizable=' + tehResize + ',top=' + tehTop +
            ',left=' + tehLeft + ',status=' + tehStatus + '');
    }
		
// Ad display that is called from the child iFrame that contains the ad information.
function adShot(isIt, theAdTarget) {
    document.getElementById(theAdTarget).style.display = isIt;
}


$(document).ready(function() {
    if (location.hostname === 'localhost') {
        var devPrefix = 'https://www-dev.kidshealth.org'; // change location for fusion to work
    } else {
        var devPrefix = '';
    }
	var thePhrase ="";
    var options = {
        url: function(phrase) {
            if (phrase !== "") {
             thePhrase = phrase;
                return devPrefix+"/suggest?fq=_lw_data_source_s:(%22typeaheadkidshealthds%22)&q="+phrase+"&rows=20&wt=json&omitHeader=true&dataType=json";
            } else {
                return devPrefix+"/suggest?fq=_lw_data_source_s:(%22typeaheadkidshealthds%22)&q=empty&rows=20&wt=json&omitHeader=true&dataType=json";
            }
        },
        requestDelay: 300,
        listLocation: function(data) {
            //return data.suggest.titleSuggester[thePhrase].suggestions;
            return data.response.docs;
        },
        getValue: function(element) {
            if ($("#searchform input#q").attr("lang") == 'en') {
                var suggLang = 'english';
            } else {
                var suggLang = 'spanish';
            }
            if (element.kh_language_s === suggLang) {
                return element.kh_value[0];
            } else {
                return '';
            }
        },
        ajaxSettings: {
            dataType: "json",
            data: {
                dataType: "json"
            }
        },
        list: {
            sort: {
                enabled: true
            },
            match: {
                enabled: true
            },
            onClickEvent: function() {
                //$('form#searchform').submit();
                $("#searchButton").click();
            },
            onKeyEnterEvent: function() {
                $("#searchButton").click();
                //$('form#searchform').submit();
            },
            showAnimation: {
                type: "fade", //normal|slide|fade
                time: 400,
                callback: function() {}
            },
            hideAnimation: {
                type: "slide", //normal|slide|fade
                time: 400,
                callback: function() {}
            },
        },
    };
 
    $("#q").easyAutocomplete(options);
});
   $(window).load(function() {     
		var isExists = false;
             //console.log("window parent"+ window.parent.$("span[data-text='Licensee'] ul.coral-SelectList").length);
			 var pageUrl = window.location.href;
			 if(pageUrl.includes('/homepage.html') || pageUrl.includes('/searchresults.html') || pageUrl.includes('/splats/') || 
	            pageUrl.includes('/parents.html') || pageUrl.includes('/teens.html') || pageUrl.includes('/kids.html')){
				 window.parent.$("span[data-text='Licensee']").css("display","none");
			 } else {
       		 var outerHeight = window.outerHeight-200;
       		 //console.log("window outerHeight"+outerHeight);
             window.parent.$("span[data-text='Licensee']").css("display","block");
             window.parent.$("span[data-text='Licensee'] select.coral-Select-select--native").css("display","none");
             window.parent.$("span[data-text='Licensee'] button.coral-Select-button").css("color","#fafafa");
             window.parent.$("span[data-text='Licensee'] button.coral-Select-button").css("background","#4b4b4b");
       		 window.parent.$("span[data-text='Licensee'] ul.coral-SelectList").css("max-height",outerHeight);
            var medicalCodeText = window.parent.$("span[data-text='Licensee'] button");
			$(medicalCodeText).click(function(){
				isExists = true;
                eventHandle();

			});


          if($(".medicalcoding")!=undefined && $(".medicalcoding").html()!=""){
              window.parent.$("#medicalbutton").show();
              var url = $($(".medicalcoding")[0]).html(); 
              window.parent.$("#medicalbutton").click(function(){
            	  url=url.replace("/editor.html/", "/");
            	  window.open(url+".html",'_blank');
              });
  }
  else{
      window.parent.$("#medicalbutton").hide();
    }
   }

   function eventHandle(){
    window.parent.$("span[data-text='Licensee'] button span.coral-Select-button-text").on('DOMSubtreeModified',function(event){ 
        var licenseeUrl =  $(window.parent.$("span[data-text='Licensee'] ul").find("li.is-highlighted")[0]).attr("data-value");
        if(isExists){
            
            if(licenseeUrl != 'LIC Preview'){
                window.open(licenseeUrl,'_blank');
            }
            
        }
        window.parent.$("span[data-text='Licensee'] button span.coral-Select-button-text").off('DOMSubtreeModified');

    });
	}
 });


/* During a previous vendor's engagement a number of files were 
duplicated that didn't need to be. This JS replaces several of 
those within clientlib-js-site. This doesn't replace files of the same name within
different clientlibs.

Files that have been replaced by this one:

kh_headJS_common.js
kh_headJS.js
*/

function runOnLoad() {

}

$(document).ready(function() {
    // remove sticky cat cookie by making it expire in 1970
    document.cookie = 'khStickierCat' + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';


	mottleyCrew(); // set initial mott states
	mottleyWho();
    if($('#khcontent').hasClass('catPage')) {
        catClicker();
        catPicker();
    }
    

	$("#kids_tab").click(function() {
		setActiveMott('kid');
		setInactiveMott('parent');
		setInactiveMott('teen');
	});

	$("#teens_tab").click(function() {
		setActiveMott('teen');
		setInactiveMott('parent');
		setInactiveMott('kid');
	});

	$("#parents_tab").click(function() {
		setActiveMott('parent');
		setInactiveMott('teen');
		setInactiveMott('kid');
	});
});

function mottleyCrew() { // determine which tabs to show
	if ($("#parents_tab").length) {
		$("#PKTtabParents").css("display", "block");
	}
	if ($("#kids_tab").length) {
		$("#PKTtabKids").css("display", "block");
	}
	if ($("#teens_tab").length) {
		$("#PKTtabTeens").css("display", "block");
	}
}

function mottClearance() {

}

function setInactiveMott(section2) {
	var thisTab2 = "#" + section2 + "s_tab";
	var upperSec2 = section2.charAt(0).toUpperCase() + section2.slice(1);
	var thisPanel2 = "#relatedArticlesList" + upperSec2 + "s"; // current panel
	//console.log('u2: '+thisPanel2);
	$(thisTab2).attr("aria-selected", "false");
	$(thisTab2).attr("tabindex", "-1");
	$(thisTab2).closest("li").removeClass("current");
	$(thisTab2).closest("li").addClass("wascurrent");
	$(thisPanel2).css("display", "none");
}

function setActiveMott(section) {
	var thisTab = "#" + section + "s_tab"; // current tab
	var upperSec = section.charAt(0).toUpperCase() + section.slice(1); // capitalized section name e.g. teen = Teen
	var thisPanel = "#relatedArticlesList" + upperSec + "s"; // current panel
	$(thisTab).attr("aria-selected", "true");
	$(thisTab).attr("tabindex", "0");
	$(thisTab).closest("li").removeClass("wascurrent");
	$(thisTab).closest("li").addClass("current");
	$(thisPanel).css("display", "block");
	//console.log(thisTab);
}

function sectionFromTab() {

}

function mottleyWho() { // determine which tab should be active and which content should show onload
	if (KHAdSection === 'parent') {
		if ($("#parents_tab").length) {
			setActiveMott('parent');
			setInactiveMott('kid');
			setInactiveMott('teen');
		} else if ($("#kids_tab").length) {
			setActiveMott('kid');
			setInactiveMott('parent');
			setInactiveMott('teen');
		} else if ($("#teens_tab").length) {
			setActiveMott('teen');
			setInactiveMott('parent');
			setInactiveMott('kid');
		}
	} else if (KHAdSection === 'kid') {
		if ($("#kids_tab").length) {
			setActiveMott('kid');
			setInactiveMott('parent');
			setInactiveMott('teen');
		} else if ($("#teens_tab").length) {
			setActiveMott('teen');
			setInactiveMott('parent');
			setInactiveMott('kid');
		} else if ($("#parents_tab").length) {
			setActiveMott('parent');
			setInactiveMott('kid');
			setInactiveMott('teen');
		}
	} else if (KHAdSection === 'teen') {
		if ($("#teens_tab").length) {
			setActiveMott('teen');
			setInactiveMott('kid');
			setInactiveMott('parent');
		} else if ($("#kids_tab").length) {
			setActiveMott('kid');
			setInactiveMott('parent');
			setInactiveMott('teen');
		} else if ($("#parents_tab").length) {
			setActiveMott('parent');
			setInactiveMott('kid');
			setInactiveMott('teen');
		}
	}
}

// Ad display that is called from the child iFrame that contains the ad information.
function adShot(isIt, theAdTarget) {
	document.getElementById(theAdTarget).style.display = isIt;
}

// Toogle layer functionality - could be deferred but since this is the first thing on the page and users may
// click it before the page has finished loading I am adding it here instead

//var whichLayer;
function toggleLayer(whichLayer) {
	if (document.getElementById) {
		// this is the way the standards work
		var style2 = document.getElementById(whichLayer).style;
		style2.display = style2.display ? "" : "none";
	} else if (document.all) {
		// this is the way old msie versions work
		var style2 = document.all[whichLayer].style;
		style2.display = style2.display ? "" : "none";
	} else if (document.layers) {
		// this is the way nn4 works
		var style2 = document.layers[whichLayer].style;
		style2.display = style2.display ? "" : "none";
	}
}

function toggleBackground(whatLayer) {
	if (document.getElementById) {
		// this is the way the standards work
		var style2 = document.getElementById(whatLayer).style;
		style2.backgroundImage = style2.backgroundImage =
			"url(/etc.clientlibs/kidshealth/clientlibs/clientlib-site/resources/images/licensees/standard_licensee/images/articleShrink.gif)";
	} else if (document.all) {
		// this is the way old msie versions work
		var style2 = document.all[whatLayer].style;
		style2.backgroundImage = style2.backgroundImage =
			"url(/etc.clientlibs/kidshealth/clientlibs/clientlib-site/resources/images/licensees/standard_licensee/images/articleShrink.gif)";
	} else if (document.layers) {
		// this is the way nn4 works
		var style2 = document.layers[whatLayer].style;
		style2.backgroundImage = style2.backgroundImage =
			"url(/etc.clientlibs/kidshealth/clientlibs/clientlib-site/resources/images/licensees/standard_licensee/images/articleShrink.gif)";
	}
}

function toggleClass(id, classOne, classtwo) {
	identity = document.getElementById(id);
	class_name = identity.className;
	if (class_name == classOne) {
		identity.className = classtwo;
	} else {
		identity.className = classOne;
	}
}

// General Nemours Cookie check/create, especially for pages that don't carry ads
function checkCookieNemours2() {
	var nemCheck = readTheCookie2('refNemours');
	var referringURL = document.referrer;
	var referringURLowerCase = referringURL.toLowerCase();
	//First check to see if a Nemours cookie exists
	if (nemCheck == '1') {
		//Recreate the cookie to reset the timer
		createTheCookie2('refNemours', '1', '.5');

		function gamRefresh(url) {} // empty function - exists elsewhere with alternate functionality that isn't approrpriate for this situation
		//do no more (don't display ads)
	}

	//Next, if there's no cookie, check if the user was referred from Nemours
	else if (referringURLowerCase.indexOf('nemours') > -1 || referringURLowerCase.indexOf('medlineplus') > -1 || referringURLowerCase.indexOf('nlm') > -1 || referringURLowerCase.indexOf('nih') > -1 || referringURLowerCase.indexOf('mobilewebby') > -1) {
		//This user was sent from Nemours so let's create a cookie
		createTheCookie2('refNemours', '1', '.5');

		function gamRefresh(url) {} // same empty gamRefresh as before
		//do no more (don't display ads)
	}

	//If none of the above conditions are true then the user either didn't come from Nemours
	//or their session has timed out -- show the ads
	else {
		// Do nothing in this instance
	}
}

function createTheCookie2(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 60 * 60 * 1000));
		var expires = "; expires=" + date;
	} else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readTheCookie2(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

checkCookieNemours2();

// Cookie handlers - need to convert all other cookie functions to use these two
function createCookie(name, value, days) {
	if (name == "khStickierCat") {
		location.hash = "khsc";
	}
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}
// category memory
function anchorsAway() {
    var hashCat = window.location.hash;
    if(hashCat!=null) { // url has fragment id
       catLoad(hashCat,1);
    } 
}

function catLoad(catButt,hasHash) {
    catList = catButt+'List';
    $(catButt).attr('aria-expanded','true');
    $(catList).css('display','block');
    if(hasHash!==1) {
        setTimeout(function() {
            $('html, body').animate(
                {scrollTop: $(catButt).parent('h2').offset().top+(-60)}
            ,0);
        },500);
    }
}

function catClicker() { // link from cat event listenter
    $('.linkFromCat').click(function(e) {
        //e.preventDefault(); //for testing without loading target
        var pCat = $(this).parent().parent().attr('id').replace('List','');
        sessionStorage.setItem('remCat','#'+pCat);
    });
}

function catPicker() {
    if(window.location.href.indexOf('#')!= -1) {
        // cat hash is present - direct link, so ignore stored cat
    } else {
        if(sessionStorage.getItem('remCat')!=null) { // check session storage for previously clicked link from cat
            var catP = sessionStorage.getItem('remCat');
        } else {
            var catP = null;
        }

        if(catP!=null) {
            catLoad(catP); // expand the cat            
        }
    }
}

function thisCatGotCooked(theCat) {
	// if (document.getElementById(theCat) != null) {
	// 	printURL = document.getElementById(theCat).firstChild.href;
	// 	catStr = printURL;
	// 	if (catStr.indexOf("cat_id") != -1) {
	// 		startNumber = catStr.indexOf("cat_id") + 1;
	// 		endNumber = catStr.indexOf("article_set") + 1;
	// 		yesTheCat = catStr.substr((startNumber + 6), ((endNumber - 1) - (
	// 			startNumber + 7)));
	// 	}
	// 	createCookie('khStickierCatCompare', yesTheCat);
	// }
}

function stickyCatCookie() {
	// var theSubCat = readCookie('khStickierCat');
	// var toBeChanged = "cat" + theSubCat + "List";
	// var toBeChangedClass = "cat" + theSubCat;
	// var myNameIsURL = window.location.href;
	// var myHashLocation = myNameIsURL.indexOf("#") + 1;
	// var myHash = myNameIsURL.substr(myHashLocation);
	// if (myHash == "khsc" || myHashLocation == 0) {
	// 	if (theSubCat != null) {
	// 		location.hash = toBeChangedClass;
	// 	}
	// }
}

function hideCats() {
	// var ps = document.getElementsByTagName('ul');
	// for (var i = 0; i < ps.length; i++) {
	// 	if (ps[i].className == "kh-category-list") {
	// 		ps[i].style.display = "none";
	// 	}
	// }



	// var plusMinus = document.getElementsByTagName('button');
	// for (var i = 0; i < plusMinus.length; i++) {
	// 	if (plusMinus[i].className == 'medicationsExpanded') plusMinus[i].className =
	// 		'medicationsExpand';
	// }
	//stickyCatCookie();
}

function printWindow(URL) {
	window.open(URL, "Print", "width=700,height=600,scrollbars=yes,resizable=yes,status=yes,toolbar=yes,menubar=yes");
}

function printWindow1(URL) {
	var locURL = location.href;
	var prt = ".prt-en";
	if (locURL.search("/es") != -1) {
		prt = ".prt-es";
	}
	var html = ".html"
	var index = locURL.indexOf(html);
	html = locURL.substr(index)
	prt = prt.concat(html);
	locURL = locURL.slice(0, index);
	var URL = locURL.concat(prt);

	window.open(URL, "Print", "width=700,height=600,scrollbars=yes,resizable=yes,status=yes,toolbar=yes,menubar=yes");
}
// New toggle Attribute functionality
// Author Marcos J. Drake
// Example usage:
// <a id="someID" onclick="toggleAttribute('someID','aria-expanded','true','false')";
function toggleMyAttribute(toggleWhere, toggleWhat, toggleOn, toggleOff) {
	var where = document.getElementById(toggleWhere);
	var currentState = where.getAttribute(toggleWhat);
	if (currentState == toggleOn) {
		currentState = toggleOff;
	} else {
		currentState = toggleOn;
	}
	where.setAttribute(toggleWhat, currentState);
}
