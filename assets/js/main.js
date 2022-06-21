$(function() {

	"use strict";

	//===== Prealoder
	$(window).preloader({
		//delay: 2000,
		// preloader selector
		selector: '#preloader',
		// Preloader container holder
		type: 'window',
		// 'fade' or 'remove'
		removeType: 'fade',
		// fade duration
		fadeDuration: 750,
		// auto disimss after x milliseconds
		delay: 0
		
	});

    // starting of siteSticky
	var siteSticky = function() {
		$(".js-sticky-header").sticky({topSpacing:0});
	};
	siteSticky();
	// ending of siteSticky

	// starting of siteMenuClone
	var siteMenuClone = function() {

		$('.js-clone-nav').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});

		$('.js-clone-formSerach').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-formSearch-wrap').appendTo('.site-mobile-menu-body');
		});

		setTimeout(function() {
			var counter = 0;
			$('.site-mobile-menu .has-children').each(function(){
			var $this = $(this);
				$this.prepend('<span class="arrow-collapse collapsed">');
				$this.find('.arrow-collapse').attr({
					'data-toggle' : 'collapse',
					'data-target' : '#collapseItem' + counter,
				});
				$this.find('> ul').attr({
					'class' : 'collapse',
					'id' : 'collapseItem' + counter,
				});
				counter++;
    		});
		}, 1000);

		$('body').on('click', '.arrow-collapse', function(e) {
			var $this = $(this);
			if ( $this.closest('li').find('.collapse').hasClass('show') ) {
				$this.removeClass('active');
			} else {
				$this.addClass('active');
			}
			e.preventDefault();  
			
		});

		$(window).resize(function() {
			var $this = $(this),
			w = $this.width();
			if ( w > 768 ) {
				if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		})

		$('body').on('click', '.js-menu-toggle', function(e) {
			var $this = $(this);
			e.preventDefault();

			if ( $('body').hasClass('offcanvas-menu') ) {
				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		}) 

		// click outisde offcanvas
		$(document).mouseup(function(e) {
		var container = $(".site-mobile-menu");
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			if ( $('body').hasClass('offcanvas-menu') ) {
				$('body').removeClass('offcanvas-menu');
			}
		}
		});
	}; 

	siteMenuClone();

	// Ending of siteMenuClone

	// Scrolling to top button
	// Show or hide the sticky footer button
    $(window).on('scroll', function(event) {
        if($(this).scrollTop() > 600){
            $('.back-to-top').fadeIn(200)
        } else{
            $('.back-to-top').fadeOut(200)
        }
    });
    
    //Animate the scroll to top
    $('.back-to-top').on('click', function(event) {
        event.preventDefault(); 
        $('html, body').animate({
            scrollTop: 0,
        }, 1500);
    });

	// End of Scrolling buttom

	// Form
	var contactForm = function() {

		if ($('#contactForm').length > 0 ) {
			$( "#contactForm" ).validate( {
				rules: {
					name: "required",
					email: {
						required: true,
						email: true
					},
					message: {
						required: true,
						minlength: 5
					}
				},
				messages: {
					name: "Please enter your name",
					email: "Please enter a valid email address",
					message: "Please enter a message"
				},
				/* submit via ajax */
				submitHandler: function(form) {		
					var $submit = $('.submitting'),
						waitText = 'Submitting...';

					$.ajax({   	
						type: "POST",
						url: "php/send-email.php",
						data: $(form).serialize(),

						beforeSend: function() { 
							$submit.css('display', 'block').text(waitText);
						},
						success: function(msg) {
						if (msg == 'OK') {
							$('#form-message-warning').hide();
								setTimeout(function(){
								$('#contactForm').fadeOut();
							}, 1000);
								setTimeout(function(){
								$('#form-message-success').fadeIn();   
							}, 1400);
							
							} else {
							$('#form-message-warning').html(msg);
								$('#form-message-warning').fadeIn();
								$submit.css('display', 'none');
							}
						},
						error: function() {
							$('#form-message-warning').html("Something went wrong. Please try again.");
							$('#form-message-warning').fadeIn();
							$submit.css('display', 'none');
						}
					});    		
				}
				
			} );
		}
	};
	contactForm();

	// cards

	function getPageList(totalPages, page, maxLength){
		function range(start, end){
			return Array.from(Array(end - start + 1), (_, i) => i + start);
		}
		
		var sideWidth = maxLength < 9 ? 1 : 2;
		var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
		var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;
		
		if(totalPages <= maxLength){
			return range(1, totalPages);
		}
		
		if(page <= maxLength - sideWidth - 1 - rightWidth){
			return range(1, maxLength - sideWidth - 1).concat(0, range(totalPages - sideWidth + 1, totalPages));
		}
		
		if(page >= totalPages - sideWidth - 1 - rightWidth){
			return range(1, sideWidth).concat(0, range(totalPages- sideWidth - 1 - rightWidth - leftWidth, totalPages));
		}
		
		return range(1, sideWidth).concat(0, range(page - leftWidth, page + rightWidth), 0, range(totalPages - sideWidth + 1, totalPages));
	}
	
	function fun(){
		var numberOfItems = $(".ch_card-content .ch_card").length;
		var limitPerPage = 6; //How many card items visible per a page
		var totalPages = Math.ceil(numberOfItems / limitPerPage);
		var paginationSize = 7; //How many page elements visible in the pagination
		var currentPage;
		
		function showPage(whichPage){
			if(whichPage < 1 || whichPage > totalPages) return false;
		
			currentPage = whichPage;
		
			$(".ch_card-content .ch_card").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();
		
			$(".ch_pagination li").slice(1, -1).remove();
		
			getPageList(totalPages, currentPage, paginationSize).forEach(item => {
			$("<li>").addClass("ch_page-item").addClass(item ? "ch_current-page" : "ch_dots")
			.toggleClass("ch_active", item === currentPage).append($("<a>").addClass("ch_page-link")
			.attr({href: "javascript:void(0)"}).text(item || "...")).insertBefore(".ch_next-page");
			});
		
			$(".ch_previous-page").toggleClass("ch_disable", currentPage === 1);
			$(".ch_next-page").toggleClass("ch_disable", currentPage === totalPages);
			return true;
		}
		
		$(".ch_pagination").append(
			$("<li>").addClass("ch_page-item").addClass("ch_previous-page").append($("<a>").addClass("ch_page-link").attr({href: "javascript:void(0)"}).text("Prev")),
			$("<li>").addClass("ch_page-item").addClass("ch_next-page").append($("<a>").addClass("ch_page-link").attr({href: "javascript:void(0)"}).text("Next"))
		);
		
		$(".ch_card-content").show();
		showPage(1);
		
		$(document).on("click", ".ch_pagination li.ch_current-page:not(.ch_active)", function(){
			return showPage(+$(this).text());
		});
		
		$(".ch_next-page").on("click", function(){
			return showPage(currentPage + 1);
		});
		
		$(".ch_previous-page").on("click", function(){
			return showPage(currentPage - 1);
		});
	};
	fun();

	// scroll indicator
	$(window).on('scroll', function(event) {
        if($(this).scrollTop() > 50){
            $('.top_progress_container ').fadeIn(200)
        } else{
			$('.top_progress_container ').fadeOut(200)
        }
    });

	// When the user scrolls the page, execute myFunction 
	window.onscroll = function() {myFunction()};
        
	function myFunction() {
		var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
		var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		var scrolled = (winScroll / height) * 100;
		document.getElementById("myBar").style.width = scrolled + "%";
	}

	// End scroll indicator
});