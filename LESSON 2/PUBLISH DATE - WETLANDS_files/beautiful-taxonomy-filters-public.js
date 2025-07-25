(function( $ ) {
	'use strict';

	/**
	 * Variables used by the AJAX call
	 */
	var xhr;
    var active = false;
    var timer;

	/**
	 * Lets select2 all night long
	 */
	function create_select2_dropdown( select_el ){

		var args = {
			allowClear: btf_localization.allow_clear,
			syncCssClasses: true,
			minimumResultsForSearch: 1 // Temporarily set to 1 because select2 misbehaves without the search.
		};

		if( btf_localization.show_description == '1' ){
			args.templateResult = formatResult;
			args.templateSelection = formatSelection;
		}

		/**
		 * Support language
		 */
		if( btf_localization.language !== '' ) {
			args.language = btf_localization.language;
		}

		/**
		 * Support RTL
		 */
		if( btf_localization.rtl == '1' ) {
			args.dir = 'rtl';
		}

		var select2;

		if ( typeof select_el !== 'undefined' ) {
			if ( ! $(select_el).hasClass('select2-hidden-accessible') ) {
				select2 = select_el.select2(args);
			}
		}else{
			select2 = $('.beautiful-taxonomy-filters-select').select2(args);
		}
	}


	/**
	 * Format the results of select2
	 *
	 */
	function formatResult (term) {
		if (!term.id ){ return term.text; }

		//var new_term = term.text;
		var new_term = term.element.innerHTML;
		if( term.text.indexOf(":.:") !== -1) {
			new_term = new_term.replace(':.:', ' <br><span class="term-description">');
			new_term = new_term.replace(':-:', '</span>');

		}

		var $term = $(
			'<span class="' + term.element.className + '">' + new_term + '</span>'
		);
		return $term;

	}


	/**
	 * Format the selection of select2
	 *
	 */
	function formatSelection (term) {
		if (!term.id ) {
			return term.text;
		}

		if ( term.text.indexOf(":.:") === -1 ) {
			return term.element.innerHTML;
		}

		//run a regexp on the text to find :.:<any characters:-: and then replace it
		//var new_term = term.text;
		var new_term = term.text;
		var re = /(:\.:[\s\S]*?:-:)/;
		var reg_results = re.exec(new_term);
		new_term = new_term.replace(reg_results[0], '');
		var $term = $(
			'<span>' + new_term + '</span>'
		);
		return $term;
	}

	/**
	 * Run the AJAX update function to make terms conditional.
	 *
	 * @param el	jQuery object of the select that changed.
	 */
	function conditional_terms_ajax_new( el ){
		/**
		 * If there's already an active AJAX request kill it.
		 */
		if( active ) {
			xhr.abort();
		}

		/**
		 * Show loaders and disable selects if the response takes more than 1 second.
		 */
		if( timer ){
			clearTimeout(timer);
		}
		timer = setTimeout(function(){
        	form.find('.beautiful-taxonomy-filters-loader').addClass('active');
        	form.find('select.beautiful-taxonomy-filters-select').prop('disabled', true);
        	form.find('.beautiful-taxonomy-filters-button').prop('disabled', true);
        }, 800);


		/**
		 * Get general options
		 */
		var form = el.closest('#beautiful-taxonomy-filters-form'),
			nonce = el.data('nonce'),
			posttype = $('input[name="post_type"]').val(),
			selects = [],
			taxonomies = [];

		/**
		 * Get values from all selects
		 */
		var filtered_taxonomies = [];
		form.find('select.beautiful-taxonomy-filters-select').each(function(index){
			var sel = $(this),
				taxonomy = sel.data('taxonomy'),
				val = sel.val();

			if( val === '' ){
				val = 0;
			}

			selects.push({
				taxonomy: sel.data('taxonomy'),
				term: val,
			});

			taxonomies.push( sel.data('taxonomy') );

			if ( val) {
				filtered_taxonomies.push( sel.data('taxonomy') );
			}

		});

		/**
		 * Run our AJAX
		 */
		active = true;
		xhr = $.ajax({
			type: 'post',
			dataType: 'json',
			url: btf_localization.ajaxurl,
			data: {
				action: 'update_filters_callback',
				selects: selects,
				posttype: posttype,
				nonce: nonce,
				taxonomies: taxonomies
			},
			success: function( response ){

				/**
				 * Make sure all dropdowns are enabled and loaders are hidden
				 */
				if( timer ){
					clearTimeout(timer);
				}
				form.find('select.beautiful-taxonomy-filters-select').prop( 'disabled', false );
				form.find('.beautiful-taxonomy-filters-loader').removeClass('active');
				form.find('.beautiful-taxonomy-filters-button').prop('disabled', false);

				/**
				 * Lets get cracking on hiding options
				 */
				 if( Object.keys(response).length > 0 ){
 					$.each(response, function(taxonomy, terms) {
						var select_element = form.find('select.beautiful-taxonomy-filters-select[data-taxonomy="' + taxonomy + '"]');

						// Let's first check if we've only filtered one select. If so, we should not disabled any of that's dropdowns so it's easier to switch.
						if ( 1 === filtered_taxonomies.length && taxonomy === filtered_taxonomies[0] ) {
							return;
						}

						// First we disable all options.
						var options = select_element.find('option').prop('disabled', true);

						// Not for the default value.. that dude wants to live.
						select_element.find('option[value="0"], option[value=""]').prop('disabled', false);

						// Then we loop through all fetched terms and enable them.
						for ( var i = 0; i < terms.length; i++ ) {
							var term = terms[i];
							var text = terms[i].term_name;
							if ( btf_localization.show_count == 1 ) {
								text += ' (' + terms[i].term_count + ')';
							}
							var option = select_element.find('option[value="' + terms[i].term_id + '"]').prop('disabled', false).text( text );
						}

						// If select2 is being used we need to destroy the instance and run a new one.
						if( btf_localization.disable_select2 != '1' ){
							select_element.trigger('change.select2');
						}
					});
				}

			},
			error: function(){
				/**
				 * Make sure all dropdowns are enabled and loaders are hidden
				 */
				if( timer ){
					clearTimeout(timer);
				}
				form.find('select.beautiful-taxonomy-filters-select').prop( 'disabled', false );
				form.find('.beautiful-taxonomy-filters-loader').removeClass('active');
				form.find('.beautiful-taxonomy-filters-button').prop('disabled', false);

			},
			complete: function(){
				/**
				 * Regardless of success/error we are done. Set active to false.
				 */
				active = false;
			}
		});

	}


	/**
	 * Run the AJAX update function to make terms conditional.
	 *
	 * @param el	jQuery object of the select that changed.
	 */
	function conditional_terms_ajax( el ){

		/**
		 * If there's already an active AJAX request kill it.
		 */
		if( active ) {
			xhr.abort();
		}

		/**
		 * Show loaders and disable selects if the response takes more than 1 second.
		 */
		if( timer ){
			clearTimeout(timer);
		}
		timer = setTimeout(function(){
        	form.find('.beautiful-taxonomy-filters-loader').addClass('active');
        	form.find('select.beautiful-taxonomy-filters-select').prop('disabled', true);
        	form.find('.beautiful-taxonomy-filters-button').prop('disabled', true);
        }, 800);


		/**
		 * Get general options
		 */
		var form = el.closest('#beautiful-taxonomy-filters-form'),
			nonce = el.data('nonce'),
			posttype = $('input[name="post_type"]').val(),
			current_taxonomy = el.data('taxonomy'),
			selects = [];

		/**
		 * Get values from all selects
		 */
		form.find('select.beautiful-taxonomy-filters-select').each(function(index){
			var sel = $(this),
				taxonomy = sel.data('taxonomy'),
				val = sel.val();

			if( val === '' ){
				val = 0;
			}

			selects.push({
				taxonomy: sel.data('taxonomy'),
				term: val,
			});

		});

		/**
		 * Run our AJAX
		 */
		active = true;
		xhr = $.ajax({
			type: 'post',
			dataType: 'json',
			url: btf_localization.ajaxurl,
			data: {
				action: 'update_filters_callback',
				selects: selects,
				posttype: posttype,
				current_taxonomy: current_taxonomy,
				nonce: nonce,
			},
			success: function( response ){

				/**
				 * Make sure all dropdowns are enabled and loaders are hidden
				 */
				if( timer ){
					clearTimeout(timer);
				}
				form.find('select.beautiful-taxonomy-filters-select').prop( 'disabled', false );
				form.find('.beautiful-taxonomy-filters-loader').removeClass('active');
				form.find('.beautiful-taxonomy-filters-button').prop('disabled', false);

				/**
				 * Lets get cracking on hiding options
				 */
				if( Object.keys(response.taxonomies).length > 0 ){

					$.each(response.taxonomies, function(taxonomy, terms){
						var select_element = form.find('select.beautiful-taxonomy-filters-select[data-taxonomy="' + taxonomy + '"]');
						select_element.find('option').each(function(){
							var option = $(this),
								val = option.val(),
								option_text = option.text();

							/**
							 * empty or 0 is probably an "all" option and we should leave these alone!
							 * also.. leave britney alone!
							 */
							if( val === '' || val === 0 || val == '0' ){
								return true;

							}

							if( $.inArray( val, terms ) === -1 ){
								option.prop('disabled', true);

							} else {
								option.prop('disabled', false);

							}
						});

						/**
						 * If select2 is being used we need to destroy the instance and run a new one.
						 */
						if( btf_localization.disable_select2 != '1' ){
							var select_el = form.find('select.beautiful-taxonomy-filters-select[data-taxonomy="' + taxonomy + '"]');
							select_el.trigger('change.select2');
						}
					});

				}
			},
			error: function(){
				/**
				 * Make sure all dropdowns are enabled and loaders are hidden
				 */
				if( timer ){
					clearTimeout(timer);
				}
				form.find('select.beautiful-taxonomy-filters-select').prop( 'disabled', false );
				form.find('.beautiful-taxonomy-filters-loader').removeClass('active');
				form.find('.beautiful-taxonomy-filters-button').prop('disabled', false);

			},
			complete: function(){
				/**
				 * Regardless of success/error we are done. Set active to false.
				 */
				active = false;
			}
		});

	}


	//Document is ready for some JS magic!
	$(document).ready(function(){

		/**
		 * Trigger select2
		 *
		 */
		if( btf_localization.disable_select2 != 1 ){
			create_select2_dropdown();
		}


		/**
		 * Update the terms of each taxonomy on the fly
		 * This allows us to only show relevant terms whenever a selection has been made.
		 *
		 */
		if( btf_localization.conditional_dropdowns == 1 ){

			/**
			 * Trigger on the first select with a value on page load.
			 * This will find all forms and look in each of them. By doing this we make sure all forms that should be updated will be.
			 */
			var forms = $('.beautiful-taxonomy-filters form, .beautiful-taxonomy-filters-widget form');
			for( var i = 0; i < forms.length; i++ ){
				var selects = $(forms[i]).find('.beautiful-taxonomy-filters-select');
				for( var j = 0; j < selects.length; j++ ){
					if( $(selects[j]).val() != 0 ){
						conditional_terms_ajax_new( $(selects[j]) );
						break;
					}
				}
			}

			/**
			 * Trigger whenever select is changed
			 */
			$('.beautiful-taxonomy-filters, .beautiful-taxonomy-filters-widget').on('change', '.beautiful-taxonomy-filters-select', function(){
				var el = $(this);
				conditional_terms_ajax_new( el );
			});
		}
	});

})( jQuery );
