$(document).ready(function(){

	//Sortable. This works if all the other events are turned off
	//Maybe will work after hold event or something someday...
	//$('.mod.sortable').sortable({items: '.item-mod'});

	//Hide Address Bar on Load
	window.scrollTo(0, 1);

	//These store different elements of an item being manipulated
	//So that items can be references across anonymous setTimeout functions
	var v = {};
	v.$itemMod = null;
	v.$item = null;
	v.$itemInput = null;
	v.$itemModClone = null;

	//These variables store the number of incomplete items before / after an item
	//As a reference to calculate the distance an item needs to move to be completed or un-completed
	var afterCount, beforeCount;

	//Variable stores the gesture event
	var releasePoint;

	//The spacer is placed (and maintained) between incomplete and complete items
	var spacer = $('#spacer');

	//These booleans get set and unset throughout functions
	//So that we can ensure only one gestural reaction can happen at a time
	var wait = true;
	var focus = false;
	var itemMotion = false; 
	var scroll = false;
	// Debugging tools
	// setInterval(function(){ console.log("focus ="+focus); }, 500);
	// setInterval(function(){ console.log("itemMotion ="+itemMotion); }, 500);
	// setInterval(function(){ console.log("scroll ="+scroll); }, 500);

	//Don't let anything happen right when the page loads.
	//Command+R to refresh would register as a keydown event.
	setTimeout(function(){
		wait = false;
	}, 100);
	
	// Pull to Create Task - Drag Events
	$(document).hammer({drag_min_distance: 0}).on('drag', '.mod', function(event){
		if ($(window).scrollTop() <= 0) {
			if (event.gesture.deltaY > 67 ) {
				$('#new-item-top').find('input').val('Release to Create Item');
				$('body').css('margin-top', ((event.gesture.deltaY) - 67)+"px");
			} else {
				$('#new-item-top').css('height', event.gesture.deltaY+"px");
				$('#new-item-top .item').css('background-color', 'hsl(0, 100%, '+((event.gesture.deltaY)-10)+'%)');
				$('#new-item-top .item').css('border-color', 'hsl(0, 100%, '+((event.gesture.deltaY)-30)+'%)');
				$('#new-item-top').find('input').val('Pull to Create Task');
				$('#new-item-top').css('-webkit-transform', 'rotateX('+(90-(((event.gesture.deltaY)/67)*90))+'deg)');
			}
		}
		if (event.gesture.deltaY > 20 || event.gesture.deltaY < -20) {
			scroll = true;
		}
	});

	// Pull to Create Task - Drag End Events
	$(document).hammer({drag_min_distance: 0}).on('dragend', '.mod', function(event){
		if (event.gesture.deltaY > 67 ) {
			$('body').addClass('slide-back').css('margin-top','0px');
			$('#new-item-top').css('height', "0px");
			$('.mod').prepend(itemModTemplate.clone());
			updateColors();
			$('.item-mod.new input').focus();
			$('.mod .item-mod.new').removeClass('new');
			setTimeout(function() {
				$('body').removeClass('slide-back');
			}, 200);
		} else {
			$('#new-item-top').addClass('animate-back');
			$('#new-item-top').css('height', "0px");
			$('#new-item-top').css('-webkit-transform', 'rotateX(90deg)');
			setTimeout(function() {
				$('#new-item-top').removeClass('animate-back');
				$('#new-item-top').attr('style','');
			}, 100);
		}
		scroll = false;
	});


	// Drag Item X - Drag Events
	$(document).hammer({drag_block_vertical: false}).on('drag', '.item-mod', function(event){
		if ( itemMotion == true ) { return; }
		if ( scroll == true ) { return; }
		v.$itemMod = $(this);
		v.$item = v.$itemMod.find('.item');
		v.$itemInput = $(this).find('.item').find('input');

		var dragX = event.gesture.deltaX;
		//console.log(dragX);
		v.$item.css('margin-left',dragX+'px');

		if ( event.gesture.deltaY > 15 || event.gesture.deltaY < -15 ) {
			dragX = 0;
		}

		var dragY = event.gesture.deltaY;
		v.$item.css('margin-left',dragX+'px');

		//If item is not done...
		if (!v.$itemMod.hasClass('done') && !v.$itemMod.hasClass('was-done')) {
			//If scroll enters the done position
			if ( dragX > 55 ) {
				v.$itemMod.css('background-position-x', (dragX-55)+"px");
				v.$itemMod.addClass('check');
			//If scroll enters the clear position
			} else if ( dragX < -55 ) {
				v.$itemMod.css('background-position-x', (dragX+55)+"px");
			//Anywhere in between
			} else {
				v.$itemMod.css('background-position-x', '0px');
				v.$itemMod.removeClass('check');
			}
		//If item is done
		} else {
			//If scroll enters the un-do position
			if ( dragX > 55 ) {
				v.$itemMod.css('background-position-x', (dragX-55)+"px");
				v.$itemMod.removeClass('done');
				v.$item
					.css('background-color', 'hsl(45,100%, 50%);')
					.css('border-top-color', 'hsl(45,100%, 70%);')
					.css('border-bottom-color', 'hsl(45,100%, 30%);');
				//v.$itemInput.prop('disabled', false);
			//If scroll enters the clear position
			} else if ( dragX < -55 ) {
				v.$itemMod.css('background-position-x', (dragX+55)+"px");
			//Anywhere in between
			} else {
				v.$itemMod.css('background-position-x', '0px');
				v.$itemMod.addClass('done');
				//v.$itemInput.prop('disabled', true);
			}
		}

	});//eo touchmove

	// Clears leftover styles on items when dragging begins
	$(document).hammer().on('dragstart', '.item-mod', function(){
		$(this).attr('style','');
	});

	// Creates an extra reference for items that were done
	// And that soon might be manipulated
	$(document).hammer().on('dragstart', '.item-mod.done', function(){
		$(this).addClass('was-done');
	});

	// Drag Item X - Drag End Events
	$(document).hammer().on('dragend', '.item-mod', function(event){
		if ( scroll == true ) { return; }
		v.$itemMod = $(this);
		v.$item = v.$itemMod.find('.item');
		v.$itemInput = $(this).find('.item').find('input');

		releasePoint = event.gesture.deltaX;

		//If item is not done
		if (!v.$itemMod.hasClass('done') && !v.$itemMod.hasClass('was-done')) {
			v.$itemMod.attr('style','');
			//And release point is in the 'done' zone
			if ( releasePoint > 55 ) {
				itemMotion = true;
				v.$item.addClass('slide-back').css('margin-left','0px');
				afterCount = v.$itemMod.nextAll().not('.done').length;
				v.$itemMod.css('background-position-x', ((-60)-($(this).scrollLeft()))+"px");
				//Delay for item to momentum-scroll back, then do the move
			    setTimeout( function(){
			    	v.$item.removeClass('slide-back');
			    	v.$itemMod.css('background-image','none');
					v.$itemMod.addClass('done').removeClass('check');
					v.$itemModClone = v.$itemMod.clone();
			    	v.$itemModClone.insertAfter(v.$itemMod).addClass('shrink');
					spacer.addClass('make-space');
					v.$itemMod.addClass('remove').css('-webkit-transform', 'translate(0px,'+((afterCount-1)*67)+'px)');
				},200 );
				//Delay for another 0.5s for item move to occur, then clean up the leftovers
				setTimeout(function() {
    				v.$itemModClone.insertAfter(spacer).removeClass('shrink');
    				v.$itemMod.hide().remove();
    				spacer.removeClass('make-space');
    				v.$itemMod.css('background-image','url("clear.png")');
    				itemMotion = false;
    			}, 600);
			} else {
				itemMotion = true;
				v.$item.addClass('slide-back').css('margin-left','0px');
				setTimeout( function(){
					v.$item.removeClass('slide-back');
					itemMotion = false;
				},200 );
			}
		//If item is done
		} else {
			//And release point is in the un-do position
			if ( releasePoint > 55 ) {
				itemMotion = true;
				v.$item.addClass('slide-back').css('margin-left','0px');
				beforeCount = v.$itemMod.prevAll('.done').length;
				v.$itemMod.css('background-position-x', ((-60)-($(this).scrollLeft()))+"px");
			    setTimeout( function(){
			    	v.$item.removeClass('slide-back');
					v.$itemMod.removeClass('done was-done check');
					spacer.addClass('make-space');
					v.$itemModClone = v.$itemMod.clone();
			    	v.$itemModClone.insertAfter(v.$itemMod).addClass('shrink');
					v.$itemMod.addClass('remove').css('-webkit-transform', 'translate(0px,'+(-(beforeCount+1)*67)+'px)');
				}, 200);
				
				setTimeout(function() {
    				v.$itemModClone.insertBefore(spacer).removeClass('shrink');
    				v.$itemMod.hide().remove();
    				spacer.removeClass('make-space');
    				itemMotion = false;
    			}, 600);
			} else {
				itemMotion = true;
				v.$item.addClass('slide-back').css('margin-left','0px');
				setTimeout( function(){
					v.$item.removeClass('slide-back');
					itemMotion = false;
				}, 200);
			}
		} //eo if item is done / not done

		//No matter what, if release point is in the clear position
		if ( releasePoint < -55 ) {
			itemMotion = true;
			v.$itemMod.css('background-image', 'none');
			v.$item.addClass('slide-out').css('margin-left','-320px');
			v.$itemMod.addClass('shrink-after gone');
			setTimeout(function() {
				v.$itemMod.remove();
				itemMotion = false;
			}, 400);
		}

		//No matter what, update colors
		updateColors();
	});

	function updateColors(){
		var hue;
		var items = $('#mod .item-mod').not('.done').not('.check');
		var itemsCount = items.length - 1;
		if (itemsCount < 5) {  itemsCount = 5; }
		items.each(function( index ){
			hue = (45/itemsCount) * index;
			$(this).children('.item')
				.css('background-color', 'hsl('+hue+',100%, 50%);')
				.css('border-top-color', 'hsl('+hue+',100%, 70%);')
				.css('border-bottom-color', 'hsl('+hue+',100%, 30%);')
		});
	}

	// Location of a hidden item which gets cloned when new items are created
	var itemModTemplate = $('#item-mod-template .item-mod');

	// Space below items that triggers a new item to be created
	$(document).hammer().on('tap', '#new-item-trigger', function(){
		if ( focus == true ) { return; }
		$(this).find('.hanger').css('-webkit-transform','rotateX(0deg)');
		$(this).find('.hanger').find('.item').css('background-color', 'hsl(45, 100%, 50%)');
		setTimeout(function(){
			$('.hanger').addClass('no-transition');
			$('.hanger').attr('style','');
			$('.hanger .item').attr('style','');
			itemModTemplate.clone().insertBefore(spacer);
			$('.mod .item-mod.new input').focus();
			$('.mod .item-mod.new').removeClass('new');
			$('.hanger').removeClass('no-transition');
			focus = true;
			updateColors();
		}, 400);
		
	});

	// A tap on an item triggers focus on the input within that item
	$(document).hammer().on('tap', '.item', function(){
		if ( focus == true || $(this).parent().hasClass('done') ) { return; }
		$(this).find('input').removeAttr("disabled").focus();
		$(this).closest('.item-mod').addClass('focus');
		$('.mod, body').addClass('focus');
	});

	// Whenever focus on an input occurs, add some reference classes
	// So we know that an item is currently being edited
	$(document).on('focus','input',function(){
		$('.mod, body').addClass('focus');
		$(this).closest('.item-mod').addClass('focus');
	});

	// Whenever an item is done being edited, close everything up.
	// If the item has no contents, trash it.
	$(document).on('blur','input', function(){
		var itemMod = $(this).closest('.item-mod');
		$('.hanger').css('-webkit-transform','rotateX(-90deg)');
		$(this).attr("disabled", "disabled");
		$('.mod, body').removeClass('focus');
		itemMod.removeClass('focus');
		$('.hanger').attr('style','');
		var value = $(this).val();
		if (value == "" || value == 0) {
			itemMod.css('-webkit-overflow-scrolling','none').css('background-image', 'none');
			itemMod.addClass('transition');
			itemMod.find('.item').css('left', releasePoint+'px').css('position','absolute');
			itemMod.find('.item').css('left','-320px');
			itemMod.addClass('shrink-after gone');
			setTimeout(function() {
				itemMod.remove();
				$('.hanger').attr('style','');
				focus = false;
			}, 400);
		} else {
			setTimeout(function() {
				$('.hanger').attr('style','');
				focus = false;
			}, 400);
		}
	});

	// When ENTER key is pressed, lock up the input. (Triggers blur event)
	$(document).on('keyup', 'input', function (e) {
	    if (e.keyCode == 13) {
	        $(this).attr("disabled", "disabled").blur();
	    }
	});

	// If a valid char keyCode is struck, create a new item.
	// Currently buggy if you start typing too fast.
	$(document).on('keyup',function(e){
		if (wait == true || focus == true) { return; }
		var keycode = e.keyCode;
	    var valid = 
	        (keycode > 47 && keycode < 58)   || // number keys
	        (keycode > 64 && keycode < 91)   || // letter keys
	        (keycode > 95 && keycode < 112) // numpad keys
		if (!$('.mod, body').hasClass('focus') && valid) {
			$('#new-item-trigger').trigger('tap');
			wait = true;
			setTimeout(function() {
				$('.item-mod.focus').find('.item').find('input').val(String.fromCharCode(e.which));
				wait = false;
			}, 400);
		} else if ($('.mod, body').hasClass('focus') && e.keyCode == 27) {
			$('.item-mod.focus').find('input').val('').blur();
		}
	});


});