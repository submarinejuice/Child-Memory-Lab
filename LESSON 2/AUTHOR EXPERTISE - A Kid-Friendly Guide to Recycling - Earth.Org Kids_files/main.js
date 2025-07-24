/*/////////////////////////// MENU BTN ///////////////////////*/
jQuery(document).ready(function($){
 
$('.cta_btn').on('click', function(event) {
     var href = this.href;
    var target = $(href.substring(href.lastIndexOf('#')));

    if( target.length ) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 500);
    }
});

 });   


	var menu_icon = jQuery(".menu_icon_inner");
	var icon_bar_1 = jQuery(".icon_bar_1");
	var icon_bar_2 = jQuery(".icon_bar_2");
	var icon_bar_3 = jQuery(".icon_bar_3");
	var menu_icon_outer = jQuery(".menu_icon_outer");
	var mob_menu_cover = jQuery(".mob_menu_cover");
var mobmenu = jQuery(".mob_menu");
var menu_ani = new TimelineMax({paused:true});

	menu_ani.to(icon_bar_3, 0.18,  {autoAlpha:0, force3D:true},0)
	menu_ani.to(icon_bar_2, 0.18,  {rotation:-45, left:-5, top: -2, transformOrigin:"50 0 0", force3D:true})
    menu_ani.to(icon_bar_1, 0.18,  {rotation:45, left: 0, top: -3, transformOrigin:"0 0 0", force3D:true})
	menu_ani.to(menu_icon_outer, 0.18,  {"margin-left":10, force3D:true},0);
	menu_ani.to(mob_menu_cover, 0.3,  {autoAlpha:1, force3D:true}, 0)
	menu_ani.to(menu_icon_outer, 0.18,  {"margin-left":0, force3D:true},0)
	menu_ani.to(mobmenu, 0.3,  {autoAlpha:1}, 0.3)

	menu_ani.reversed(true);

	function toggleDirection() {
  			menu_ani.reversed() ? menu_ani.play() : menu_ani.reverse();
	};

	var oddClick = true;
	
	

	jQuery(".menu-icon, .mob_menu_cover").bind("touchstart click", function(e) {
        jQuery(".mainmenu").toggleClass( "menu_open" );
        jQuery("header").toggleClass( "searchmob" );
		menuicon_pos = menu_icon.offset().top;
		e.stopPropagation(); e.preventDefault();
	 	toggleDirection();

        if (oddClick == true) {
					
		} else {
			
		}
		
		menuswitch = oddClick ? 1 : 0;
		
	oddClick = !oddClick;        
		
         jQuery(".sub-menu-wrap-open").removeClass( "sub-menu-wrap-open" ); 
        
	});	
	
    jQuery(".sub_menu_btn").on("click", function(e){
       jQuery(".sub_menu_btn").not(this).parent().each(function(){
           jQuery(this).removeClass( "sub-menu-wrap-open" );
       });
       jQuery(this).parent().toggleClass( "sub-menu-wrap-open" ); 
    });

    
    jQuery('a[aria-current="page"]').on("click", function(e){
        
        if (jQuery(".mainmenu").hasClass( "menu_open" ) ) {
        jQuery(".mainmenu").removeClass( "menu_open" );
        	 	toggleDirection();

        if (oddClick == true) {
					
		} else {
			
		}
		
		menuswitch = oddClick ? 1 : 0;
		
	oddClick = !oddClick;    
        }
        
    });
    

    
// throttle function, enforces a minimum time interval
function throttle(fn, interval) {
    var lastCall, timeoutId;
    return function () {
        var now = new Date().getTime();
        if (lastCall && now < (lastCall + interval) ) {
            // if we are inside the interval we wait
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                lastCall = now;
                fn.call();
            }, interval - (now - lastCall) );
        } else {
            // otherwise, we directly call the function 
            lastCall = now;
            fn.call();
        }
    };
}
function highlightNavigation() {

    var scrollPosition = jQuery(window).scrollTop();
	var windowwidth = jQuery(window).width();
	
	if (scrollPosition >= 60) {
		
		jQuery("header").addClass("scrolledtime");
	
	
	} else {
	
		jQuery("header").removeClass("scrolledtime");

	}

    
}

jQuery(window).scroll( throttle(highlightNavigation,5) );
highlightNavigation();



 
    
/*    


 var feed = new Instafeed({
        get: 'user',
        userId: 21454078302,
		limit : 6,
		resolution : 'low_resolution',
        accessToken: '21454078302.1677ed0.974498f070104709a5a2c3320777991c',
		template: '<div class="col-xs-4 col-sm-2 col-md-4 insta_img"><a target="_blank" href="{{link}}"><div class="inner" style="background-image:url({{image}})"></div></a></div>'
    });
	feed.run();
    
    
    */
