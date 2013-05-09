$(document).ready(function(){

	//Hide Address Bar on Load
	window.scrollTo(0, 1);

	//Holds item object for reference in setTimeout functions that lose scope
	var v = {};
	v.$itemMod = null;
	v.$item = null;
	v.$itemInput = null;
	v.$itemModClone = null;

	var afterCount, beforeCount, releasePoint;
	var spacer = $('#spacer');

	$(document).hammer({drag_min_distance: 0}).on('drag dragend', '.mod', function(event){
		console.log(event);
		if (event.type == "drag" && $(window).scrollTop() == 0) {
			if (event.gesture.deltaY > 67 ) {
				$('#new-item-top').find('input').val('Release to Create Item');
				$('body').css('margin-top', ((event.gesture.deltaY) - 67)+"px");
			} else {
				$('#new-item-top').css('height', event.gesture.deltaY+"px");
				$('#new-item-top .item').css('background-color', 'hsl(0, 100%, '+((event.gesture.deltaY)-20)+'%)');
				$('#new-item-top .item').css('border-color', 'hsl(0, 100%, '+((event.gesture.deltaY)-20)+'%)');
				$('#new-item-top').find('input').val('Pull to Create Task');
				$('#new-item-top').css('-webkit-transform', 'rotateX('+(90-(((event.gesture.deltaY)/67)*90))+'deg)');
			}
		} else {
			if (event.gesture.deltaY > 67 ) {
				$('body').addClass('slide-back').css('margin-top','0px');
				$('#new-item-top').css('height', "0px");
				$('.mod').prepend(itemModTemplate.clone());
				$('.item-mod.new input').focus();
				$('.item-mod.new').removeClass('new');
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
		}
	});


	//When any item is touched and being moved
	//Runs every pixel
	$(document).hammer({drag_block_vertical: true}).on('drag', '.item-mod', function(event){
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
		//console.log(dragX);
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

	$(document).hammer().on('dragstart', '.item-mod', function(){
		$(this).attr('style','');
	});

	$(document).hammer().on('dragstart', '.item-mod.done', function(){
		$(this).addClass('was-done');
	});

	//When touch on item is released
	//Runs once when touch is released
	$(document).hammer().on('dragend', '.item-mod', function(event){
		v.$itemMod = $(this);
		v.$item = v.$itemMod.find('.item');
		v.$itemInput = $(this).find('.item').find('input');

		releasePoint = event.gesture.deltaX;

		//If item is not done
		if (!v.$itemMod.hasClass('done') && !v.$itemMod.hasClass('was-done')) {
			v.$itemMod.attr('style','');
			//And release point is in the 'done' zone
			if ( releasePoint > 55 ) {
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
    			}, 600);
			} else {
				v.$item.addClass('slide-back').css('margin-left','0px');
				setTimeout( function(){
					v.$item.removeClass('slide-back');
				},200 );
			}
		//If item is done
		} else {
			//And release point is in the un-do position
			if ( releasePoint > 55 ) {
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
    			}, 600);
			} else {
				v.$item.addClass('slide-back').css('margin-left','0px');
				setTimeout( function(){
					v.$item.removeClass('slide-back');
				}, 200);
			}
		} //eo if item is done / not done

		//No matter what, if release point is in the clear position
		if ( releasePoint < -55 ) {
			v.$itemMod.css('background-image', 'none');
			v.$item.addClass('slide-out').css('margin-left','-321px');
			v.$itemMod.addClass('shrink-after gone');
			setTimeout(function() {
				v.$itemMod.remove();
			}, 400);
		}
	});

	//Tap in space below items creates new item
	//Additional measure checks scroll between touchstart and touchend
	//In order to determine the difference between tap and scrolling
	var itemModTemplate = $('#item-mod-template .item-mod');

	$('body').not('.focus').hammer().on('tap', '#new-item-trigger', function(){
		itemModTemplate.clone().insertBefore(spacer);
		$('.item-mod.new input').focus();
		$('.item-mod.new').removeClass('new');
	});

	$(document).hammer().on('tap', '.item', function(){
		$(this).find('input').removeAttr("disabled").focus();
		$(this).closest('.item-mod').addClass('focus');
		$('.mod, body').addClass('focus');

	});

	//On focus of input, trigger focus classes
	$(document).on('focus','input',function(){
		$('.mod, body').addClass('focus');
		$(this).closest('.item-mod').addClass('focus');
	});

	$(document).on('keyup', 'input', function (e) {
	    if (e.keyCode == 13) {
	        $(this).attr("disabled", "disabled").blur();
	    }
	});

	//Blur. Some problems with this working on newly created items. 
	//'.on' didn't seem to work either.
	$(document).on('blur','input', function(){
		var itemMod = $(this).closest('.item-mod');
		$(this).attr("disabled", "disabled");
		$('.mod, body').removeClass('focus');
		itemMod.removeClass('focus');
		var value = $(this).val();
		if (value == "" || value == 0) {
			itemMod.css('-webkit-overflow-scrolling','none').css('background-image', 'none');
			itemMod.addClass('transition');
			itemMod.find('.item').css('left', releasePoint+'px').css('position','absolute');
			itemMod.find('.item').css('left','-321px');
			itemMod.addClass('shrink-after gone');
			setTimeout(function() {
				itemMod.remove();
			}, 400);
		}
	});

});