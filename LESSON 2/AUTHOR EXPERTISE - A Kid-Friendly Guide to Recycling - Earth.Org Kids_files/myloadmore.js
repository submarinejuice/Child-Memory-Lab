jQuery(function($){ // use jQuery code inside this to avoid "$ is not defined" error
	
    

    
    var $grid = $('.archive_grid_cont').masonry({
      // set itemSelector so .grid-sizer is not used in layout
      itemSelector: '.article_grid',
      // use element for option
      columnWidth: '.grid-sizer',
      percentPosition: true
    });
    
    //$grid.masonry('layout');
    

    
    $grid.imagesLoaded().progress( function() {
      $grid.masonry('layout');
    });

    $('.misha_loadmore').click(function(){
 
		var button = $(this),
		    data = {
			'action': 'loadmore',
			'query': misha_loadmore_params.posts, // that's how we get params from wp_localize_script() function
			'page' : misha_loadmore_params.current_page
		};
 
		$.ajax({ // you can also use $.post here
			url : misha_loadmore_params.ajaxurl, // AJAX handler
			data : data,
			type : 'POST',
			beforeSend : function ( xhr ) {
				button.text('Loading...'); // change the button text, you can also add a preloader image
			},
			success : function( data ){
				if( data ) { 
                    
                 //  $('.archive_grid_cont').append(data)
                   // add and lay out newly appended items
                //   .masonry( 'appended', data );
                    
                    var $data = $( data );
                    $grid.append( $data ).masonry( 'appended', $data );
                    
					//button.text( 'More posts' ).prev().before(data); // insert new posts
					misha_loadmore_params.current_page++;
                    button.text('More posts');
					if ( misha_loadmore_params.current_page == misha_loadmore_params.max_page ) 
						button.remove(); // if last page, remove the button
 
					// you can also fire the "post-load" event here if you use a plugin that requires it
					// $( document.body ).trigger( 'post-load' );
				} else {
					button.remove(); // if no data, remove the button as well
				}
              
      
			}
		});
	});
});