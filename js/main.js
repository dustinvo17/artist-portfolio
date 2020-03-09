"use strict";
//Wrapping all JavaScript code into a IIFE function for prevent global variables creation
(function(){

var $body = jQuery('body');
var $window = jQuery(window);

//hidding menu elements that do not fit in menu width
//processing center logo
function menuHideExtraElements() {
	
	//cleaneng changed elements
	jQuery('.sf-more-li, .sf-logo-li').remove();
	var windowWidth = jQuery('body').innerWidth();
	
	jQuery('.sf-menu').each(function(){
		var $thisMenu = jQuery(this);
		var $menuWraper = $thisMenu.closest('.mainmenu_wrapper');
		$menuWraper.attr('style', '');
		if (windowWidth > 991) {
			//grab all main menu first level items 
			var $menuLis = $menuWraper.find('.sf-menu > li');
			$menuLis.removeClass('sf-md-hidden');

			var $headerLogoCenter = $thisMenu.closest('.header_logo_center');
			var logoWidth = 0;
			var summaryLiWidth = 0;
			
			if ( $headerLogoCenter.length ) {
				var $logo = $headerLogoCenter.find('.logo');
				// 30/2 - left and right margins
				logoWidth = $logo.outerWidth(true) + 70;
			}

			// var wrapperWidth = jQuery('.sf-menu').width();
			var wrapperWidth = $menuWraper.outerWidth(true);
			$menuLis.each(function(index) {
				var elementWidth = jQuery(this).outerWidth();
				summaryLiWidth += elementWidth;
				if(summaryLiWidth >= (wrapperWidth-logoWidth)) {
					var $newLi = jQuery('<li class="sf-more-li"><a>...</a><ul></ul></li>');
					jQuery($menuLis[index - 1 ]).before($newLi);
					var newLiWidth = jQuery($newLi).outerWidth(true);
					var $extraLiElements = $menuLis.filter(':gt('+ ( index - 2 ) +')');
					$extraLiElements.clone().appendTo($newLi.find('ul'));
					$extraLiElements.addClass('sf-md-hidden');
					return false;
				}
			});

			if ( $headerLogoCenter.length ) {
				var $menuLisVisible = $headerLogoCenter.find('.sf-menu > li:not(.sf-md-hidden)');
				var menuLength = $menuLisVisible.length;
				var summaryLiVisibleWidth = 0;
				$menuLisVisible.each(function(){
					summaryLiVisibleWidth += jQuery(this).outerWidth();
				});

				var centerLi = Math.floor( menuLength / 2 );
				if ( (menuLength % 2 === 0) ) {
					centerLi--;
				}
				var $liLeftFromLogo = $menuLisVisible.eq(centerLi);
				$liLeftFromLogo.after('<li class="sf-logo-li"></li>');
				$headerLogoCenter.find('.sf-logo-li').width(logoWidth);
				var liLeftRightDotX = $liLeftFromLogo.offset().left + $liLeftFromLogo.outerWidth();
				var logoLeftDotX = windowWidth/2 - logoWidth/2;
				var menuLeftOffset = liLeftRightDotX - logoLeftDotX;
				$menuWraper.css({'left': -menuLeftOffset})
			}
			
		}// > 991
	}); //sf-menu each
} //menuHideExtraElements

function initMegaMenu() {
	var $megaMenu = jQuery('.mainmenu_wrapper .mega-menu');
	if($megaMenu.length) {
		var windowWidth = jQuery('body').innerWidth();
		if (windowWidth > 991) {
			$megaMenu.each(function(){
				var $thisMegaMenu = jQuery(this);
				//temporary showing mega menu to propper size calc
				$thisMegaMenu.css({'display': 'block', 'left': 'auto'});
				var thisWidth = $thisMegaMenu.outerWidth();
				var thisOffset = $thisMegaMenu.offset().left;
				var thisLeft = (thisOffset + (thisWidth/2)) - windowWidth/2;
				$thisMegaMenu.css({'left' : -thisLeft, 'display': 'none'});
				if(!$thisMegaMenu.closest('ul').hasClass('nav')) {
					$thisMegaMenu.css('left', '');
				}
			});
		}
	}
}


function affixSidebarInit() {
	var $affixAside = jQuery('.affix-aside');
	if ($affixAside.length) {
		
			//on stick and unstick event
			$affixAside.on('affix.bs.affix', function(e) {
				var affixWidth = $affixAside.width() - 1;
				var affixLeft = $affixAside.offset().left;
				$affixAside
					.width(affixWidth)
					.css("left", affixLeft);
			}).on('affix-top.bs.affix affix-bottom.bs.affix', function(e) {
				$affixAside.css({"width": "", "left": ""});
			});
			
			//counting offset
			var offsetTop = $affixAside.offset().top - jQuery('.page_header').height();
			var offsetBottom = jQuery('.page_footer').outerHeight(true) + jQuery('.page_copyright').outerHeight(true);
			
			$affixAside.affix({
				offset: {
					top: offsetTop,
					bottom: offsetBottom
				},
			});

			jQuery(window).on('resize', function() {
				$affixAside.css({"width": "", "left": ""});
				
				if( $affixAside.hasClass('affix')) {
					//returning sidebar in top position if it is sticked because of unexpacted behavior
					$affixAside.removeClass("affix").css("left", "").addClass("affix-top");
				}

				var offsetTop = jQuery('.page_topline').outerHeight(true) 
								+ jQuery('.page_toplogo').outerHeight(true) 
								+ jQuery('.page_header').outerHeight(true)
								+ jQuery('.page_breadcrumbs').outerHeight(true) 
								+ jQuery('.blog_slider').outerHeight(true);
				var offsetBottom = jQuery('.page_footer').outerHeight(true) 
								+ jQuery('.page_copyright').outerHeight(true);
				
				$affixAside.data('bs.affix').options.offset.top = offsetTop;
				$affixAside.data('bs.affix').options.offset.bottom = offsetBottom;
				
				$affixAside.affix('checkPosition');

			});

	}//eof checking of affix sidebar existing
}

//helper functions to init elements only when they appears in viewport (jQUery.appear plugin)
function initAnimateElement(self, index) {
	var animationClass = !self.data('animation') ? 'fadeInUp' : self.data('animation');
	var animationDelay = !self.data('delay') ? 150 : self.data('delay');
	setTimeout(function(){
		self.addClass("animated " + animationClass);
	}, index * animationDelay);
}
function initCounter(self) {
	if (self.hasClass('counted')) {
		return;
	} else {
		self.countTo().addClass('counted');
	}
}
function initProgressbar(el) {
	el.progressbar({
		transition_delay: 300
	});
}
function initChart(el) {
	var data = el.data();
	var size = data.size ? data.size : 270;
	var line = data.line ? data.line : 20;
	var bgcolor = data.bgcolor ? data.bgcolor : '#ffffff';
	var trackcolor = data.trackcolor ? data.trackcolor : '#c14240';
	var speed = data.speed ? data.speed : 3000;

	el.easyPieChart({
		barColor: trackcolor,
		trackColor: bgcolor,
		scaleColor: false,
		scaleLength: false,
		lineCap: 'butt',
		lineWidth: line,
		size: size,
		rotate: 0,
		animate: speed,
		onStep: function(from, to, percent) {
			jQuery(this.el).find('.percent').text(Math.round(percent));
		}
	});
}

//wrap select element in select-group
function wrapSelect() {
	jQuery('.wrap-select-group, .cryptonatorwidget select').each(function() {
		var $select = jQuery( this );
		if ( $select.hasClass('select2-hidden-accessible') ) {
			return;
		}
		$select.wrap('<div class="form-group select-group"></div>').after('<i class="fa fa-angle-down theme_button color1 no_bg_button" aria-hidden="true"></i>');
		if ( $select.hasClass('wrap-select-group') ) {
			$select.addClass('empty choice');
		}
	})
}

//equalize header side columns width
function headerColumnsEqualize() {
	var $header = jQuery('.page_header').first();
	var $leftLogo = $header.find('.header_left_logo');
	var $rightButtons = $header.find('.header_right_buttons');
	if ( parseInt( $leftLogo.css( 'width' ) ) > parseInt( $rightButtons.css( 'width' ) ) ) {
		$rightButtons.css( 'min-width', $leftLogo.css( 'width' ) );
	} else {
		$leftLogo.css( 'min-width', $rightButtons.css( 'width' ) );
	}
}

//function that initiating template plugins on window.load event
function windowLoadInit() {

	////////////
	//mainmenu//
	////////////
	if (jQuery().scrollbar) {
		jQuery('[class*="scrollbar-"]').scrollbar();
	}
	if (jQuery().superfish) {
		jQuery('ul.sf-menu').superfish({
			popUpSelector: 'ul:not(.mega-menu ul), .mega-menu ',
			delay:       700,
			animation:   {opacity:'show', marginTop: 0},
			animationOut: {opacity: 'hide',  marginTop: 5},
			speed:       200,
			speedOut:    200,
			disableHI:   false,
			cssArrows:   true,
			autoArrows:  true

		});
		jQuery('ul.sf-menu-side').superfish({
			popUpSelector: 'ul:not(.mega-menu ul), .mega-menu ',
			delay:       500,
			animation:   {opacity:'show', height: 100 +'%'},
			animationOut: {opacity: 'hide',  height: 0},
			speed:       400,
			speedOut:    300,
			disableHI:   false,
			cssArrows:   true,
			autoArrows:  true
		});
	}

	
	//toggle mobile menu
	jQuery('.toggle_menu').on('click', function(){
		jQuery(this)
			.toggleClass('mobile-active')
				.closest('.page_header')
				.toggleClass('mobile-active')
				.end()
				.closest('.page_toplogo')
				.next()
				.find('.page_header')
				.toggleClass('mobile-active');
	});

	jQuery('.mainmenu a').on('click', function(){
		var $this = jQuery(this);
		//If this is a local link or item with sumbenu - not toggling menu
		if (($this.hasClass('sf-with-ul')) || !($this.attr('href').charAt(0) === '#')) {
			return;
		}
		$this
		.closest('.page_header')
		.toggleClass('mobile-active')
		.find('.toggle_menu')
		.toggleClass('mobile-active');
	});

	//side header processing
	var $sideHeader = jQuery('.page_header_side');
	// toggle sub-menus visibility on menu-click
	jQuery('ul.menu-side-click').find('li').each(function(){
		var $thisLi = jQuery(this);
		//toggle submenu only for menu items with submenu
		if ($thisLi.find('ul').length)  {
			$thisLi
				.append('<span class="activate_submenu"></span>')
				//adding anchor
				.find('.activate_submenu, > a')
				.on('click', function(e) {
					var $thisSpanOrA = jQuery(this);
					//if this is a link and it is already opened - going to link
					if (($thisSpanOrA.attr('href') === '#') || !($thisSpanOrA.parent().hasClass('active-submenu'))) {
						e.preventDefault();
					}
					if ($thisSpanOrA.parent().hasClass('active-submenu')) {
						$thisSpanOrA.parent().removeClass('active-submenu');
						return;
					}
					$thisLi.addClass('active-submenu').siblings().removeClass('active-submenu');
				});
		} //eof sumbenu check
	});
	if ($sideHeader.length) {
		jQuery('.toggle_menu_side').on('click', function(){
			var $thisToggler = jQuery(this);
			if ($thisToggler.hasClass('header-slide')) {
				$sideHeader.toggleClass('active-slide-side-header');
			} else {
				if($thisToggler.parent().hasClass('header_side_right')) {
					$body.toggleClass('active-side-header slide-right');
				} else {
					$body.toggleClass('active-side-header');
				}
			}
		});
		//hidding side header on click outside header
		$body.on('click', function( e ) {
			if ( !(jQuery(e.target).closest('.page_header_side').length) && !($sideHeader.hasClass('page_header_side_sticked')) ) {
				$sideHeader.removeClass('active-slide-side-header');
				$body.removeClass('active-side-header slide-right');
			}
		});
	} //sideHeader check

	//1 and 2/3/4th level mainmenu offscreen fix
	var MainWindowWidth = jQuery(window).width();
	var boxWrapperWidth = jQuery('#box_wrapper').width();
	jQuery(window).on('resize', function(){
		MainWindowWidth = jQuery(window).width();
		boxWrapperWidth = jQuery('#box_wrapper').width();
	});
	//2/3/4 levels
	jQuery('.mainmenu_wrapper .sf-menu').on('mouseover', 'ul li', function(){
	// jQuery('.mainmenu').on('mouseover', 'ul li', function(){
		if(MainWindowWidth > 991) {
			var $this = jQuery(this);
			// checks if third level menu exist         
			var subMenuExist = $this.find('ul').length;
			if( subMenuExist > 0){
				var subMenuWidth = $this.find('ul, div').first().width();
				var subMenuOffset = $this.find('ul, div').first().parent().offset().left + subMenuWidth;
				// if sub menu is off screen, give new position
				if((subMenuOffset + subMenuWidth) > boxWrapperWidth){
					var newSubMenuPosition = subMenuWidth + 0;
					$this.find('ul, div').first().css({
						left: -newSubMenuPosition,
					});
				} else {
					$this.find('ul, div').first().css({
						left: '100%',
					});
				}
			}
		}
	//1st level
	}).on('mouseover', '> li', function(){
		if(MainWindowWidth > 991) {
			var $this = jQuery(this);
			var subMenuExist = $this.find('ul').length;
			if( subMenuExist > 0){
				var subMenuWidth = $this.find('ul').width();
				var subMenuOffset = $this.find('ul').parent().offset().left - (jQuery(window).width() / 2 - boxWrapperWidth / 2);
				// if sub menu is off screen, give new position
				if((subMenuOffset + subMenuWidth) > boxWrapperWidth){
					var newSubMenuPosition = boxWrapperWidth - (subMenuOffset + subMenuWidth);
					$this.find('ul').first().css({
						left: newSubMenuPosition,
					});
				} 
			}
		}
	});
	
	/////////////////////////////////////////
	//single page localscroll and scrollspy//
	/////////////////////////////////////////
	var navHeight = jQuery('.page_header').outerHeight(true);
	//if sidebar nav exists - binding to it. Else - to main horizontal nav
	if (jQuery('.mainmenu_side_wrapper').length) {
		$body.scrollspy({
			target: '.mainmenu_side_wrapper',
			offset: navHeight
		});
	} else if (jQuery('.mainmenu_wrapper').length) {
		$body.scrollspy({
			target: '.mainmenu_wrapper',
			offset: navHeight 
		})
	}
	if (jQuery().localScroll) {
		jQuery('.mainmenu_wrapper > ul, .mainmenu_side_wrapper > ul, #land, .scroll_button_wrap, .intro-layer').localScroll({
			duration:900,
			easing:'easeInOutQuart',
			offset: -navHeight+40
		});
	}

	//background image teaser and secitons with half image bg
	//put this before prettyPhoto init because image may be wrapped in prettyPhoto link
	jQuery(".bg_teaser, .image_cover").each(function(){
		var $teaser = jQuery(this);
		var $image = $teaser.find("img").first();
		if (!$image.length) {
			$image = $teaser.parent().find("img").first();
		}
		if (!$image.length) {
			return;
		}
		var imagePath = $image.attr("src");
		$teaser.css("background-image", "url(" + imagePath + ")");
		var $imageParent = $image.parent();
		//if image inside link - adding this link, removing gallery to preserve duplicating gallery items
		if ($imageParent.is('a')) {
			$teaser.prepend($image.parent().clone().html(''));
			$imageParent.attr('data-gal', '');
		}
	});

	//toTop
	if (jQuery().UItoTop) {
		jQuery().UItoTop({ easingType: 'easeInOutQuart' });
	}

	//parallax
	if (jQuery().parallax) {
		jQuery('.parallax').parallax("50%", 0.01);
	}
	
	//prettyPhoto
	if (jQuery().prettyPhoto) {
		jQuery("a[data-gal^='prettyPhoto']").prettyPhoto({
			hook: 'data-gal',
			theme: 'facebook', /* light_rounded / dark_rounded / light_square / dark_square / facebook / pp_default*/
			social_tools: false,
			default_width: 1170,
			default_height: 780
		});
	}
	
	////////////////////////////////////////
	//init Bootstrap JS components//
	////////////////////////////////////////
	//bootstrap carousel
	if (jQuery().carousel) {
		jQuery('.carousel').carousel();
	}
	//bootstrap tab - show first tab 
	jQuery('.nav-tabs').each(function() {
		jQuery(this).find('a').first().tab('show');
	});
	jQuery('.tab-content').each(function() {
		jQuery(this).find('.tab-pane').first().addClass('fade in');
	});
	//bootstrap collapse - show first tab 
	jQuery('.panel-group').each(function() {
		jQuery(this).find('a').first().filter('.collapsed').trigger('click');
	});
	//tooltip
	if (jQuery().tooltip) {
		jQuery('[data-toggle="tooltip"]').tooltip();
	}

	

	//comingsoon counter
	

	//adding CSS classes for elements that needs different styles depending on they widht width
	//see 'plugins.js' file
	jQuery('#mainteasers .col-lg-4').addWidthClass({
		breakpoints: [500, 600]
	});

	// init timetable
	var $timetable = jQuery('#timetable');
	if ($timetable.length) {
		// bind filter click
		jQuery('#timetable_filter').on( 'click', 'a', function( e ) {
			e.preventDefault();
			e.stopPropagation();
			var $thisA = jQuery(this);
			if ( $thisA.hasClass('selected') ) {
				// return false;
				return;
			}
			var selector = $thisA.attr('data-filter');
			$timetable
				.find('tbody td')
				.removeClass('current')
				.end()
				.find(selector)
				.closest('td')
				.addClass('current');
			$thisA.closest('ul').find('a').removeClass('selected');
			$thisA.addClass('selected');
	  });
	}

	/////////
	//SHOP///
	/////////
	

	//color filter 
	jQuery(".color-filters").find("a[data-background-color]").each(function() {
		jQuery(this).css({"background-color" : jQuery(this).data("background-color")});
	}); // end of SHOP
	///eof docready

	//////////////
	//flexslider//
	//////////////
	if (jQuery().flexslider) {
		var $introSlider = jQuery(".intro_section .flexslider");
		$introSlider.each(function(index){
			var $currentSlider = jQuery(this);
			var data = $currentSlider.data();
			var nav = (data.nav !== 'undefined') ? data.nav : true;
			var dots = (data.dots !== 'undefined') ? data.dots : true;

			$currentSlider.flexslider({
				animation: "fade",
				pauseOnHover: true, 
				useCSS: true,
				controlNav: dots,   
				directionNav: nav,
				prevText: "",
				nextText: "",
				smoothHeight: false,
				slideshowSpeed:10000,
				animationSpeed:600,
				start: function( slider ) {
					slider.find('.slide_description').children().css({'visibility': 'hidden'});
					slider.find('.flex-active-slide .slide_description').children().each(function(index){
						var self = jQuery(this);
						var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
						setTimeout(function(){
							self.addClass("animated "+animationClass);
						}, index*200);
					});
					slider.find('.flex-control-nav').find('a').each(function() {
						jQuery( this ).html('0' + jQuery( this ).html());
					})
				},
				after: function( slider ){
					slider.find('.flex-active-slide .slide_description').children().each(function(index){
						var self = jQuery(this);
						var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
						setTimeout(function(){
							self.addClass("animated "+animationClass);
						}, index*200);
					});
				},
				end :function( slider ){
					slider.find('.slide_description').children().each(function() {
						var self = jQuery(this);
						var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
						self.removeClass('animated ' + animationClass).css({'visibility': 'hidden'});
							// jQuery(this).attr('class', '');
					});
				},

			})
			//wrapping nav with container - uncomment if need
			.find('.flex-control-nav')
			.wrap('<div class="container-fluid nav-container"/>')
		}); //intro_section flex slider

		jQuery(".flexslider").each(function(index){
			var $currentSlider = jQuery(this);
			//exit if intro slider already activated 
			if ($currentSlider.find('.flex-active-slide').length) {
				return;
			}

			var data = $currentSlider.data();
			var nav = (data.nav !== 'undefined') ? data.nav : true;
			var dots = (data.dots !== 'undefined') ? data.dots : true;
			var autoplay = (data.autoplay !== 'undefined') ? data.autoplay : true;
			$currentSlider.flexslider({
				animation: "slide",
				useCSS: true,
				controlNav: dots,   
				directionNav: nav,
				prevText: "",
				nextText: "",
				smoothHeight: false,
				slideshow: autoplay,
				slideshowSpeed:5000,
				animationSpeed:400,
				start: function( slider ) {
					slider.find('.flex-control-nav').find('a').each(function() {
						jQuery( this ).html('0' + jQuery( this ).html());
					})
				},
			})
			.find('.flex-control-nav')
			.wrap('<div class="container-fluid nav-container"/>')
		});
	}

	////////////////////
	//header processing/
	////////////////////
	//stick header to top
	//wrap header with div for smooth sticking
	var $header = jQuery('.page_header').first();
	var boxed = $header.closest('.boxed').length;
	if ($header.length) {
		//hiding main menu 1st levele elements that do not fit width
		menuHideExtraElements();
		//mega menu
		initMegaMenu();
		//wrap header for smooth stick and unstick
		var headerHeight = $header.outerHeight();
		$header.wrap('<div class="page_header_wrapper"></div>');
		var $headerWrapper = $header.parent();
		if (!boxed) {
			$headerWrapper.css({height: $header.outerHeight()}); 
		}

		headerColumnsEqualize();

		//headerWrapper background
		if( $header.hasClass('header_white') ) {
			$headerWrapper.addClass('header_white');
		} else if ( $header.hasClass('header_darkgrey') ) {
			$headerWrapper.addClass('header_darkgrey');
			if ( $header.hasClass('bs') ) {
				$headerWrapper.addClass('bs');
			}

		} else if ( $header.hasClass('header_gradient') ) {
			$headerWrapper.addClass('header_gradient');
		}

		if ( $header.hasClass('header_transparent') ) {
			$headerWrapper.addClass('header_transparent_wrap')
		}

		//get offset
		var headerOffset = 0;
		//check for sticked template headers
		if (!boxed && !($headerWrapper.css('position') === 'fixed')) {
			headerOffset = $header.offset().top;

			if ($header.css('padding-top') === '65px') {
				headerOffset += 65;
			}
		}

		//for boxed layout - show or hide main menu elements if width has been changed on affix
		jQuery($header).on('affixed-top.bs.affix affixed.bs.affix affixed-bottom.bs.affix', function ( e ) {
			if( $header.hasClass('affix-top') ) {
				$headerWrapper.removeClass('affix-wrapper affix-bottom-wrapper').addClass('affix-top-wrapper');
			} else if ( $header.hasClass('affix') ) {
				$headerWrapper.removeClass('affix-top-wrapper affix-bottom-wrapper').addClass('affix-wrapper');
			} else if ( $header.hasClass('affix-bottom') ) {
				$headerWrapper.removeClass('affix-wrapper affix-top-wrapper').addClass('affix-bottom-wrapper');
			} else {
				$headerWrapper.removeClass('affix-wrapper affix-top-wrapper affix-bottom-wrapper');
			}
			menuHideExtraElements();
			initMegaMenu();
		});

		//if header has different height on afixed and affixed-top positions - correcting wrapper height
		jQuery($header).on('affixed-top.bs.affix', function () {
			// $headerWrapper.css({height: $header.outerHeight()});
		});

		jQuery($header).affix({
			offset: {
				top: headerOffset,
				bottom: 0
			}
		});

	}

	////////////////////
	//triggered search//
	////////////////////


	////////////////
	//owl carousel//
	////////////////
	if (jQuery().owlCarousel) {
		jQuery('.owl-carousel').each(function() {
			var $carousel = jQuery(this);
			var data = $carousel.data();

			var loop = data.loop ? data.loop : false;
			var margin = (data.margin || data.margin === 0) ? data.margin : 30;
			var nav = data.nav ? data.nav : false;
			var dots = data.dots ? data.dots : false;
			var themeClass = data.themeclass ? data.themeclass : 'owl-theme';
			var center = data.center ? data.center : false;
			var items = data.items ? data.items : 4;
			var autoplay = data.autoplay ? data.autoplay : false;
			var responsiveXs = data.responsiveXs ? data.responsiveXs : 1;
			var responsiveXxs = data.responsiveXxs ? data.responsiveXxs : 1;
			var responsiveSm = data.responsiveSm ? data.responsiveSm : 2;
			var responsiveMd = data.responsiveMd ? data.responsiveMd : 3;
			var responsiveLg = data.responsiveLg ? data.responsiveLg : 4;
			var responsiveXlg = data.responsiveXlg ? data.responsiveXlg : responsiveLg;
			var filters = data.filters ? data.filters : false;
			var mouseDrag = $carousel.data('mouse-drag') === false ? false : true;
			var touchDrag = $carousel.data('touch-drag') === false ? false : true;

			if (filters) {
				// $carousel.clone().appendTo($carousel.parent()).addClass( filters.substring(1) + '-carousel-original' );
				$carousel.after($carousel.clone().addClass('owl-carousel-filter-cloned'));
				jQuery(filters).on('click', 'a', function( e ) {
					//processing filter link
					e.preventDefault();
					var $thisA = jQuery(this);
					if ($thisA.hasClass('selected')) {
						return;
					}
					var filterValue = $thisA.attr('data-filter');
					$thisA.siblings().removeClass('selected active');
					$thisA.addClass('selected active');
					
					//removing old items
					$carousel.find('.owl-item').length;
					for (var i = $carousel.find('.owl-item').length - 1; i >= 0; i--) {
						$carousel.trigger('remove.owl.carousel', [1]);
					};

					//adding new items
					var $filteredItems = jQuery($carousel.next().find(' > ' +filterValue).clone());
					$filteredItems.each(function() {
						$carousel.trigger('add.owl.carousel', jQuery(this));
						jQuery(this).addClass('scaleAppear');						
					});
					
					$carousel.trigger('refresh.owl.carousel');

					//reinit prettyPhoto in filtered OWL carousel
					if (jQuery().prettyPhoto) {
						$carousel.find("a[data-gal^='prettyPhoto']").prettyPhoto({
							hook: 'data-gal',
							theme: 'facebook' /* light_rounded / dark_rounded / light_square / dark_square / facebook / pp_default*/
						});
					}
				});
				
			} //filters

			$carousel.owlCarousel({
				loop: loop,
				margin: margin,
				nav: nav,
				navText: ['<span>prev</span>', '<span>next</span>'],
				autoplay: autoplay,
				dots: dots,
				themeClass: themeClass,
				center: center,
				items: items,
				smartSpeed: 400,
				mouseDrag: mouseDrag,
				touchDrag: touchDrag,
				responsive: {
					0:{
						items: responsiveXxs
					},
					500:{
						items: responsiveXs
					},
					768:{
						items: responsiveSm
					},
					992:{
						items: responsiveMd
					},
					1200:{
						items: responsiveLg
					},
					1600:{
						items: responsiveXlg
					}
				},
			})
			.addClass(themeClass);
			if(center) {
				$carousel.addClass('owl-center');
			}

			$window.on('resize', function() {
				$carousel.trigger('refresh.owl.carousel');
			});

			$carousel.on('changed.owl.carousel', function() {
				if (jQuery().prettyPhoto) {
					jQuery("a[data-gal^='prettyPhoto']").prettyPhoto({
						hook: 'data-gal',
						theme: 'facebook', /* light_rounded / dark_rounded / light_square / dark_square / facebook / pp_default*/
						social_tools: false
					});
				}
			})
		});

	} //eof owl-carousel

	//aside affix
	affixSidebarInit();

	$body.scrollspy('refresh');

	//appear plugin is used to elements animation, counter, pieChart, bootstrap progressbar
	if (jQuery().appear) {
		//animation to elements on scroll
		jQuery('.to_animate').appear();

		jQuery('.to_animate').filter(':appeared').each(function(index){
			initAnimateElement(jQuery(this), index);
		});

		$body.on('appear', '.to_animate', function(e, $affected ) {
			jQuery($affected).each(function(index){
				initAnimateElement(jQuery(this), index);
			});
		});

		//counters init on scroll
		if (jQuery().countTo) {
			jQuery('.counter').appear();
			
			jQuery('.counter').filter(':appeared').each(function(){
				initCounter(jQuery(this));
			});
			$body.on('appear', '.counter', function(e, $affected ) {
				jQuery($affected).each(function(){
					initCounter(jQuery(this));
				});
			});
		}
	
		//bootstrap animated progressbar
		if (jQuery().progressbar) {
			jQuery('.progress .progress-bar').appear();

			jQuery('.progress .progress-bar').filter(':appeared').each(function(){
				initProgressbar(jQuery(this));
			});
			$body.on('appear', '.progress .progress-bar', function(e, $affected ) {
				jQuery($affected).each(function(){
					initProgressbar(jQuery(this));
				});
			});
			//animate progress bar inside bootstrap tab
			jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
				initProgressbar(jQuery(jQuery(e.target).attr('href')).find('.progress .progress-bar'));
			});
			//animate progress bar inside bootstrap dropdown
			jQuery('.dropdown').on('shown.bs.dropdown', function(e) {
				initProgressbar(jQuery(this).find('.progress .progress-bar'));
			});
		}

		//circle progress bar
		if (jQuery().easyPieChart) {

			jQuery('.chart').appear();
			
			jQuery('.chart').filter(':appeared').each(function(){
				initChart(jQuery(this));
			});
			$body.on('appear', '.chart', function(e, $affected ) {
				jQuery($affected).each(function(){
					initChart(jQuery(this));
				});
			});

		}

	} //appear check

	//Flickr widget
	// use http://idgettr.com/ to find your ID
	if (jQuery().jflickrfeed) {
		var $flickr = jQuery("#flickr, .flickr_ul");
		if ( $flickr.length ) {
			if ( ! ( $flickr.hasClass('flickr_loaded') ) ) {
				$flickr.jflickrfeed({
					flickrbase: "http://api.flickr.com/services/feeds/",
					limit: 4,
					qstrings: {
						id: "131791558@N04"
					},
					itemTemplate: '<a href="{{image_b}}" data-gal="prettyPhoto[pp_gal]"><li><img alt="{{title}}" src="{{image_m}}" /></li></a>'
				}, function(data) {
					$flickr.find('a').prettyPhoto({
						hook: 'data-gal',
						theme: 'facebook'
					});
				}).addClass('flickr_loaded');
			}
		}
	}

	// Instagram widget
	
	// init Isotope
	jQuery('.isotope_container').each(function(index) {
		var $container = jQuery(this);
		var layoutMode = ($container.hasClass('masonry-layout')) ? 'masonry' : 'fitRows';
		var columnWidth = ($container.find('.col-lg-20').length) ? '.col-lg-20' : '';
		$container.isotope({
			percentPosition: true,
			layoutMode: layoutMode,
			masonry: {
				//for big first element in grid - giving smaller element to use as grid
				columnWidth: columnWidth
			}
		});

		var $filters = jQuery(this).attr('data-filters') ? jQuery(jQuery(this).attr('data-filters')) : $container.prev().find('.filters');
		// bind filter click
		if ($filters.length) {
			$filters.on( 'click', 'a', function( e ) {
				e.preventDefault();
				var $thisA = jQuery(this);
				var filterValue = $thisA.attr('data-filter');
				$container.isotope({ filter: filterValue });
				$thisA.siblings().removeClass('selected active');
				$thisA.addClass('selected active');
			});
			//for works on select
			$filters.on( 'change', 'select', function( e ) {
				e.preventDefault();
				var filterValue = jQuery(this).val();
				$container.isotope({ filter: filterValue });
			});
		}
	});

	//Unyson or other messages modal
	var $messagesModal = jQuery('#messages_modal');
	if ($messagesModal.find('ul').length) {
		$messagesModal.modal('show');
	}

	// prevent search form trigger from scrolling to top
	jQuery('.search_form_trigger').on( 'click', function($e) {
	    $e.preventDefault();
	});

	//prevent default action of # links
	jQuery("[href='#0']").on( 'click', function($e) {
		$e.preventDefault();
	});

	//wrap select elements in .select-group
	wrapSelect();

	if (jQuery().cuePlaylist) {
		cue.initialize();
	}

	//page preloader
	jQuery(".preloaderimg").fadeOut(150);
	jQuery(".preloader").fadeOut(350).delay(200, function(){
		jQuery(this).remove();
	});
	
}//eof windowLoadInit

$window.ready(function() {
	if (window.cue) {
		cue.initialize();
	}
})



$window.on('load', function(){
	windowLoadInit();

	//Google Map script
	
	//google map length

	// color for placeholder of select elements
	jQuery(".choice").on('change', function () {
		if(jQuery(this).val() === "") jQuery(this).addClass("empty");
		else jQuery(this).removeClass("empty")
	});

}); //end of "window load" event

$window.on('resize', function(){

	$body.scrollspy('refresh');

	//header processing
	headerColumnsEqualize();
	menuHideExtraElements();
	initMegaMenu();
	var $header = jQuery('.page_header').first();
		//checking document scrolling position
		if ($header.length && !jQuery(document).scrollTop() && $header.first().data('bs.affix')) {
			$header.first().data('bs.affix').options.offset.top = $header.offset().top;
		}
	if (!$header.closest('.boxed').length) {
		jQuery(".page_header_wrapper").css({height: $header.first().outerHeight()}); //editing header wrapper height for smooth stick and unstick
	}
	
});
$('.contact-form').submit(function() {
		
})
//end of IIFE function

})();

