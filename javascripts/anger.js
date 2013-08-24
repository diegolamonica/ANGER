/**
 * ANGER = ANother Great and Easy Responsive menu
 * @see https://github.com/diegolamonica/anger/
 * @author Diego La Monica <http://diegolamonica.info>
 * @license GPL 2.0
 *
 */

(function($){
$.fn.anger = function(options){
	var defaultOptions = {
		
		handler: document,
		
		/* 
		 * Which is the activator event?
		 * It could be:
		 * - swipe-left: the menu will show if the gesture is swipe (see: swipeDirection, swipeMinimalDistance, swipeTolerance)
		 * - menu-selector: using a menu selector item (see: activatorId and activatorClass )
		 */
		activator: 'swipe',	
		/*
		 * the menu will use the following class(es) when the page reachs the minimal size
		 */
		containerClass: 'responsive',
		/*
		 * Minimal size in pixel to activate the responsive menu
		 */
		minWindowSize: 800,
		/*
		 * Tells if the menu must be collapsed when starts
		 */
		closedOnDefault: true,
		
		menuAppliedCSS: "padding:0; margin: 0; display: block; position: fixed; left: 0; top: ##; overflow: hidden; width: 90%",
		itemAppliedCSS: "display: block !important; border-bottom: 1px solid #ccc; background-color: white; text-align: center; padding: 5px; ",
		linkAppliedCSS: "display: block !important; height: 1em; overflow: hidden; ",

		/*
		 * ====================
		 * Used only if activator = 'menu-selector' 
		 * ====================
		 */
		 
		/*
		 * The activator item ID
		 */
		activatorId:		null,
		activatorClass:	'responsive-menu-activator',
		 
		/*
		 * ==================
		 * Used only if activator = 'swipe'
		 * ==================
		 */
		swipeDirection:		'left',		// Which is the direction (allowed: 'left' or 'right')
		swipeMinimalDistance:	100,		// How many pixel should be the minimal movement?
		swipeTolerance:		0.1			// Tolerance (in %) on y asses. The lesser value means the most horizontal swipe.
	},
	that	= this,
 	ul		= $('>ul', that);
 	
 	/*
 	 * Applying the default options;
 	 */
 	if(options==null) options = [];
	options = $.extend(defaultOptions, options);

	/*
	 * Generating unique ID for handler, menu container, for menu and for menu list items
	 */
	if($(options.handler).attr('id') == null)
		$(options.handler).attr('id', realUniqueId("handler"));
		
	if(that.attr('id') == null)
		that.attr('id', realUniqueId("nav-menu"));

	if(ul.attr('id') == null )
		ul.attr('id', realUniqueId("ul-menu"));
		
	if(options.activatorId == null)
		options.activatorId	= realUniqueId("activator-menu");
	
	/*
	 * Generates unique ID into the page
	 */
	function realUniqueId(prefix){
		var rndId = '';
		if(prefix == null) prefix = 'uniqueid';
		
		rndId = prefix+'-0';
		while($(rndId).length>0)
			rndId = prefix + "-" + String(Math.floor( Math.random()*99999 ));
		
		return rndId;
	}
	
	/*
	 * Hide/show the menu
	 */
	function toggleMenu(){
		if ( isMenuVisible() ){
			if(options.swipeDirection == 'up' || options.swipeDirection == 'down'){
				ul.slideUp();
			}else
				ul.animate({width: 0}, 'fast');
		}else{
			if(options.swipeDirection == 'up' || options.swipeDirection == 'down'){
				ul.slideDown();
			}else
				ul.animate({width: options.menuWidth}, 'fast');
		}
	}
	
	/**
	 * Check if the menu is visible. Returns true if the menu is visible else will return false.
	 * @return boolean
	 */
	function isMenuVisible(){
		var w = ul.width();
		
		if(w > 0 && ul.is(':visible')){
			options.menuWidth = w;
			return true;
		}else{
			return false;
		}
		
	}

	switch(options.activator){
	
		case 'menu-selector':
			
	
			var menuActivator = $('<a href="#">Menu</a>')
				.insertBefore(ul)
				.addClass(options.activatorClass)
				.attr('id', options.activatorId)
				.on('click', toggleMenu);
			
	
			break;
		case 'swipe':
			
			var 
				startTime 	= 0,
				startX		= 0,
				startY		= 0;
			
		
			$(options.handler)
				.on('mousedown touchstart', function(event){
					if($(window).width() > options.minWindowSize) return;
					if(startTime!=0) return;
					startTime = event.timeStamp;
					
					/*
					 * Handling both mouse events and touch events
					 */ 
					startX = (event.type=='touchstart') ? event.originalEvent.touches[0].pageX : event.pageX;
					startY = (event.type=='touchstart') ? event.originalEvent.touches[0].pageY : event.pageY;
					
				})
		
				.on('mouseup touchend', function(event){
					var endTime = event.timeStamp;
					if(startTime==0) return;
					
					if(endTime - startTime<1500){ // Less than 1.5 seconds
						startTime = 0;
						var 
							/*
							 * Handling both mouse events and touch events
							 */ 
							stopX = (event.type=='touchend') ? event.originalEvent.changedTouches[0].pageX : event.pageX,
							stopY = (event.type=='touchend') ? event.originalEvent.changedTouches[0].pageY : event.pageY,
							
							xDistance 		= stopX - startX,
							yDistance 		= stopY - startY,
							absXDistance 	= Math.abs(xDistance),
							absYDistance 	= Math.abs(yDistance),
							toleranceY 		= (1/xDistance) * absYDistance,
							toleranceX 		= (1/yDistance) * absXDistance,
							tolerance 		= (options.swipeDirection == 'right' || options.swipeDirection == 'left')? toleranceY : toleranceX,
							distance		= (options.swipeDirection == 'right' || options.swipeDirection == 'left')? xDistance : yDistance,
							absDistance		= (options.swipeDirection == 'right' || options.swipeDirection == 'left')? absXDistance : absYDistance;
							
							
						if(absDistance >= options.swipeMinimalDistance && tolerance < options.swipeTolerance){
							if(!isMenuVisible()){
								if( (distance > 0 && (options.swipeDirection == 'right' || options.swipeDirection == 'down')) ||	// I'm opening the menu from right or from the bottom
									(distance < 0 && (options.swipeDirection == 'left' || options.swipeDirection =='up')) ){	// I'm opening the menu from left or from the top
							
									toggleMenu();
									event.preventDefault();
									
								}
							}else{
						
								if( (distance < 0 && (options.swipeDirection == 'right' || options.swipeDirection == 'down')) ||	// I'm closing the menu from right
									(distance > 0 && (options.swipeDirection == 'left' || options.swipeDirection =='up'))){	// I'm closing the menu from left
							
									toggleMenu();
									event.preventDefault();
								}
						
							} 
						}
					
					}
					startTime = 0;
					endTime = 0;
					
				});
			break;
	}
	/*
	 * Defining the right location for menu (including the menuActivator height)
	 */
	options.menuAppliedCSS =
		options.menuAppliedCSS
			.replace('##', $(menuActivator).height() +'px')
			.replace('##', '0px');	// If menu activator is not defined the above replace will not work
		;

	$(window)
	
		/*
		 * Attaching resize event on the window to apply the right behaviour
		 */
		.on('resize', function(){
			if($(window).width < options.minWindowSize){
				if(options.closedOnDefault && isMenuVisible() ) toggleMenu(); 
			}else{
				ul.css({width: ''});
			}
		})
		
		/*
		 * Firing the resize
		 */
		.trigger('resize');
	/*
	 * Creating the Stylesheet
	 */
	var 
		menuSelector 		= '#' + that.attr('id') + ' #' + ul.attr('id'),
		menuItemSelector 	= menuSelector + ' li',
		menuSubitemSelector = menuSelector + ' li li',
		linkItemSelector	= menuSelector + ' li a',
		style = $(
		'<style type="text/css">' +
			'#'+options.activatorId + '{ display: none; }\n' +
			'@media screen and (max-width: '+options.minWindowSize+'px ){\n' +
				'#' + $(options.handler).attr('id') +' {\n' +
				'	-webkit-user-select: none; /* webkit (safari, chrome) browsers */\n' +
				'	-moz-user-select: none; /* mozilla browsers */\n' +
				'	-khtml-user-select: none; /* webkit (konqueror) browsers */\n' +
				'	-ms-user-select: none; /* IE10+ */\n' +
				'}'+
			
				'\t'+menuSelector + '{' + options.menuAppliedCSS + '} ' + '\n' +
				'\t'+menuItemSelector + '{' + options.itemAppliedCSS + '} ' + '\n' +
				'\t'+linkItemSelector + '{' + options.linkAppliedCSS + '} ' + '\n' +
				'\t'+menuSubitemSelector + '{ display: none !important; }' + '\n' +
				'\t' + '#'+options.activatorId + '{ display: block !important; }\n' +
			'}' +
		'</style>');
	$('html > head').append(style);
};
})(jQuery);
