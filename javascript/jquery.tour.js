/*
 * Main Code by: CODROPS
 * http://tympanus.net/codrops/2010/12/21/website-tour/
 * 
 * Tranformed into a plugin by Nick Routsong
 * blog.routydevelopment.com
 * 
 * Ver. 1.0
 * 
 * Example Step Object Properties:
 * 
 * "name" 		: "tour_1",
 * "bgcolor"	: "black",
 * "color"		: "white",
 * "position"	: "TL",
 * "text"		: "You can create a tour to explain the functionality of your app",
 * "time" 		: 5000
 * 
 * 
 */

(function($){
	$.tour = {};
	
	$.tour.options = {
		steps: {},
		autoplay: false,
		saveCookie: false,
		current_step: 0,
		showtime: 4000,
		mainTitle: "Take a Tour"
	};
	
	$.tour.start = function(params){

		try {
			
			return Tour.start(params || {});
			
		} catch(e) {
		
			var err = 'Tour Error: ' + e;
			(typeof(console) != 'undefined' && console.error) ? 
				console.error(err, params) : 
				alert(err);
				
		}
		
	};
	
	var Tour = {
		 
		//Private
		total_steps: 0,
		step: 0,
			
		start: function(options){
			$.extend($.tour.options,options); 
			Tour.total_steps = $.tour.options.steps.length;
			Tour.showControls();
		},  
		
		begin: function(){
			$('#activatetour,#latertour').remove();
			$('#endtour,#restarttour,.latertour').show();
			if(!$.tour.options.autoplay && Tour.total_steps > 1)
				$('#nextstep').show();
			Tour.showOverlay();
			Tour.next();
		},
		
		prev: function(){
			if(!$.tour.options.autoplay){
				if(Tour.step > 2)
					$('#prevstep').show();
				else
					$('#prevstep').hide();
				if(Tour.step == Tour.total_steps)
					$('#nextstep').show();
			}		
			if(Tour.step <= 1)
				return false;
			--Tour.step;
			Tour.showTooltip();
		},
		
		next: function(){
			
			if(!$.tour.options.autoplay){
				if(Tour.step > 0){
					$('#prevstep').show();
				} else {
					$('#prevstep').hide();
				}
				if(Tour.step == Tour.total_steps - 1)
					$('#nextstep').hide();
				else
					$('#nextstep').show();	
			}	
			if(Tour.step >= Tour.total_steps){
				//if last step then end tour
				Tour.end();
				return false;
			}
			++Tour.step;
			Tour.showTooltip();
		},
		
		end: function(remind){
			
			if(typeof remind == 'undefined'){
				remind = false;
			}
			
			Tour.step = 0;
			if($.tour.options.autoplay){
				clearTimeout($.tour.options.showtime);
			}
			Tour.hideTooltip();
			Tour.hideControls();
			Tour.hideOverlay();
			if($.tour.options.saveCookie == true && remind == false){
				jQuery.Storage.set("tour","true");
			}
		},
		
		restart: function(){
			Tour.step = 0;
			if($.tour.options.autoplay){
				clearTimeout($.tour.options.showtime);
			}
			Tour.next();
		},
		
		cancel: function(remind){
			Tour.end(remind);
		},
		
		hideOverlay: function(){
			$('#tour_overlay').remove();
		},
		
		showOverlay: function(){
			$('body').prepend('<div id="tour_overlay" class="overlay"></div>');
		},
		
		hideControls: function(){
			$('#tourcontrols').remove();
		},
		
		showControls: function(){
			var tourcontrols  = '<div id="tourcontrols" class="tourcontrols">';
			tourcontrols += '<p>'+$.tour.options.mainTitle+'</p>';
			tourcontrols += '<span class="tour-button" id="activatetour">Start the Tour</span>';
			tourcontrols += '<span id="latertour" class="tour-button latertour">Remind me Later</span>';
			if(!$.tour.options.autoplay){
				tourcontrols += '<div class="nav"><span class="tour-button" id="prevstep" style="display:none;">< Previous</span>';
				tourcontrols += '<span class="tour-button" id="nextstep" style="display:none;">Next ></span></div>';
			}
			tourcontrols += '<a id="restarttour" style="display:none;">Restart the Tour</span>';
			tourcontrols += '<a id="endtour" style="display:none;">End the Tour</a>';
			tourcontrols += '<a class="latertour" style="display:none;">Remind me Later</a>';
			tourcontrols += '<span class="close" id="canceltour"></span>';
			tourcontrols += '</div>';
			
			$('body').prepend(tourcontrols);
			$('#tourcontrols').animate({'right':'30px'},500);
			
			var controls = $('body').find('#tourcontrols');
			
			controls.find('#activatetour').live('click',function(){
				Tour.begin();
			});
			controls.find('.latertour').live('click',function(){
				Tour.cancel(true);
			});
			controls.find('#canceltour').live('click',function(){
				Tour.cancel(false);
			});
			controls.find('#endtour').live('click',function(){
				Tour.cancel(false);
			});
			controls.find('#restarttour').live('click',function(){
				Tour.restart();
			});
			controls.find('#nextstep').live('click',function(){
				Tour.next();
			});
			controls.find('#prevstep').live('click',function(){
				Tour.prev();
			});
			
		},
		
		hideTooltip: function(){
			$('#tour_tooltip').remove();
		},
		
		showTooltip: function(){
			//remove current tooltip
			Tour.hideTooltip();
			
			var step_config		= $.tour.options.steps[Tour.step - 1];
			var elem			= $('.' + step_config.name);
			
			if($.tour.options.autoplay){
				$.tour.options.showtime = setTimeout(Tour.next(),step_config.time);
			}
			
			var bgcolor  = step_config.bgcolor;
			var color	 = step_config.color;
			
			var tooltip = $('<div>',{
				id			: 'tour_tooltip',
				className 	: 'tooltip',
				html		: '<p>'+step_config.text+'</p><span class="tooltip_arrow"></span>'
			}).css({
				'display'			: 'none',
				'background-color'	: bgcolor,
				'color'				: color
			});
			
			//the css properties the tooltip should have
			var properties		= {};
			var tip_position 	= step_config.position;
			
			//append the tooltip but hide it
			$('body').prepend(tooltip);
			
			//get some info of the element
			var e_w	= elem.outerWidth();
			var e_h	= elem.outerHeight();
			var e_l	= elem.offset().left;
			var e_t	= elem.offset().top;
			
			switch(tip_position){
				case 'TL'	:
					properties = {
						'left'	: e_l,
						'top'	: e_t + e_h + 'px'
					};
					tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_TL');
					break;
				case 'TR'	:
					properties = {
						'left'	: e_l + e_w - tooltip.width() + 'px',
						'top'	: e_t + e_h + 'px'
					};
					tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_TR');
					break;
				case 'BL'	:
					properties = {
						'left'	: e_l + 'px',
						'top'	: e_t - tooltip.height() + 'px'
					};
					tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_BL');
					break;
				case 'BR'	:
					properties = {
						'left'	: e_l + e_w - tooltip.width() + 'px',
						'top'	: e_t - tooltip.height() + 'px'
					};
					tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_BR');
					break;
				case 'LT'	:
					properties = {
						'left'	: e_l + e_w + 'px',
						'top'	: e_t + 'px'
					};
					tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_LT');
					break;
				case 'LB'	:
					properties = {
						'left'	: e_l + e_w + 'px',
						'top'	: e_t + e_h - tooltip.height() + 'px'
					};
					tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_LB');
					break;
				case 'RT'	:
					properties = {
						'left'	: e_l - tooltip.width() + 'px',
						'top'	: e_t + 'px'
					};
					tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_RT');
					break;
				case 'RB'	:
					properties = {
						'left'	: e_l - tooltip.width() + 'px',
						'top'	: e_t + e_h - tooltip.height() + 'px'
					};
					tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_RB');
					break;
				case 'T'	:
					properties = {
						'left'	: e_l + e_w/2 - tooltip.width()/2 + 'px',
						'top'	: e_t + e_h + 'px'
					};
					tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_T');
					break;
				case 'R'	:
					properties = {
						'left'	: e_l - tooltip.width() + 'px',
						'top'	: e_t + e_h/2 - tooltip.height()/2 + 'px'
					};
					tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_R');
					break;
				case 'B'	:
					properties = {
						'left'	: e_l + e_w/2 - tooltip.width()/2 + 'px',
						'top'	: e_t - tooltip.height() + 'px'
					};
					tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_B');
					break;
				case 'L'	:
					properties = {
						'left'	: e_l + e_w  + 'px',
						'top'	: e_t + e_h/2 - tooltip.height()/2 + 'px'
					};
					tooltip.find('span.tooltip_arrow').addClass('tooltip_arrow_L');
					break;
			}
			
			/*
				if the element is not in the viewport
				we scroll to it before displaying the tooltip
			 */
			var w_t	= $(window).scrollTop();
			var w_b = $(window).scrollTop() + $(window).height();
			//get the boundaries of the element + tooltip
			var b_t = parseFloat(properties.top,10);
			
			if(e_t < b_t)
				b_t = e_t;
			
			var b_b = parseFloat(properties.top,10) + tooltip.height();
			if((e_t + e_h) > b_b)
				b_b = e_t + e_h;
			
			if((b_t < w_t || b_t > w_b) || (b_b < w_t || b_b > w_b)){
				$('html, body').stop()
				.animate({scrollTop: b_t}, 500, 'easeInOutExpo', function(){
					//need to reset the timeout because of the animation delay
					if($.tour.options.autoplay){
						clearTimeout($.tour.options.showtime);
						$.tour.options.showtime = setTimeout(Tour.next(),step_config.time);
					}
					//show the new tooltip
					tooltip.css(properties).show();
				});
			}
			else
				//show the new tooltip
				tooltip.css(properties).show();
		}
		
	};
	
})(jQuery);