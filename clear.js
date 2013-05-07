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

	//When any item is touched and being moved
	//Runs every pixel
	$(document).on('touchmove', '.item-mod', function(){
		v.$itemMod = $(this);
		v.$item = v.$itemMod.find('.item');
		v.$itemInput = $(this).find('.item').find('input');

		//If item is not done...
		if (!v.$itemMod.hasClass('done') && !v.$itemMod.hasClass('was-done')) {
			//If scroll enters the done position
			if ( v.$itemMod.scrollLeft() < -60 ) {
				v.$itemMod.css('background-position-x', ((-60)-($(this).scrollLeft()))+"px");
				v.$itemMod.addClass('check');
			//If scroll enters the clear position
			} else if ( v.$itemMod.scrollLeft() > 60 ) {
				v.$itemMod.css('background-position-x', ((60)-($(this).scrollLeft()))+"px");
			//Anywhere in between
			} else {
				v.$itemMod.css('background-position-x', '0px');
				v.$itemMod.removeClass('check');
			}
		//If item is done
		} else {
			//If scroll enters the un-do position
			console.log(v.$itemMod);
			console.log(v.$itemMod.scrollLeft());
			if ( v.$itemMod.scrollLeft() < -60 ) {
				v.$itemMod.css('background-position-x', ((-60)-($(this).scrollLeft()))+"px");
				v.$itemMod.removeClass('done');
				//v.$itemInput.prop('disabled', false);
			//If scroll enters the clear position
			} else if ( v.$itemMod.scrollLeft() > 60 ) {
				v.$itemMod.css('background-position-x', ((60)-($(this).scrollLeft()))+"px");
			//Anywhere in between
			} else {
				v.$itemMod.css('background-position-x', '0px');
				v.$itemMod.addClass('done');
				//v.$itemInput.prop('disabled', true);
			}
		}

	});//eo touchmove

	$(document).on('touchstart', '.item-mod', function(){
		$(this).attr('style','');
	});

	$(document).on('touchstart', '.item-mod.done', function(){
		$(this).addClass('was-done');
	});

	//When touch on item is released
	//Runs once when touch is released
	$(document).on('touchend', '.item-mod', function(){
		v.$itemMod = $(this);
		v.$item = v.$itemMod.find('.item');
		v.$itemInput = $(this).find('.item').find('input');

		releasePoint = v.$itemMod.scrollLeft();

		//If item is not done
		if (!v.$itemMod.hasClass('done') && !v.$itemMod.hasClass('was-done')) {
			v.$itemMod.attr('style','');
			//And release point is in the 'done' zone
			if ( releasePoint < -60 ) {
				afterCount = v.$itemMod.nextAll().not('.done').length;
				v.$itemMod.css('background-position-x', ((-60)-($(this).scrollLeft()))+"px");
				//Delay for item to momentum-scroll back, then do the move
			    setTimeout( function(){
			    	v.$itemMod.css('background-image','none');
					v.$itemMod.addClass('done').removeClass('check');
					v.$itemInput.prop('disabled', true);
					v.$itemModClone = v.$itemMod.clone();
			    	v.$itemModClone.insertAfter(v.$itemMod).addClass('shrink');
					spacer.addClass('make-space');
					v.$itemMod.addClass('remove').css('-webkit-transform', 'translate(0px,'+((afterCount-1)*67)+'px)');
				},325 );
				//Delay for another 0.5s for item move to occur, then clean up the leftovers
				setTimeout(function() {
    				v.$itemModClone.insertAfter(spacer).removeClass('shrink');
    				v.$itemMod.hide().remove();
    				spacer.removeClass('make-space');
    				v.$itemMod.css('background-image','url("clear.png")');
    			}, 825);
			}
		//If item is done
		} else {
			//And release point is in the un-do position
			if ( releasePoint < -60 ) {
				beforeCount = v.$itemMod.prevAll('.done').length;
				v.$itemMod.css('background-position-x', ((-60)-($(this).scrollLeft()))+"px");
			    setTimeout( function(){
					v.$itemMod.removeClass('done was-done check');
					v.$itemInput.prop('disabled', false);
					if (beforeCount > 0) {
						spacer.addClass('make-space');
						beforeCount++; //note this
					}
					v.$itemModClone = v.$itemMod.clone();
			    	v.$itemModClone.insertAfter(v.$itemMod).addClass('shrink');
					v.$itemMod.addClass('remove').css('-webkit-transform', 'translate(0px,'+(-(beforeCount)*67)+'px)');
				},350 );
				
				setTimeout(function() {
    				v.$itemModClone.insertBefore(spacer).removeClass('shrink');
    				v.$itemMod.hide().remove();
    				spacer.removeClass('make-space');
    			}, 850);
			}
		} //eo if item is done / not done

		//No matter what, if release point is in the clear position
		if ( releasePoint > 60 ) {
			v.$itemMod.css('-webkit-overflow-scrolling','none').css('background-image', 'none');
			v.$itemMod.addClass('transition');
			v.$item.css('left', releasePoint+'px').css('position','absolute');
			v.$item.css('left','-321px');
			v.$itemMod.addClass('shrink-after gone');
			setTimeout(function() {
				v.$itemMod.remove();
			}, 400);
		}
	});

	//Tap in space below items creates new item
	//Additional measure checks scroll between touchstart and touchend
	//In order to determine the difference between tap and scrolling
	var scroll;
	var newScroll;
	var itemModTemplate = $('#item-mod-template .item-mod');
	$('#new-item-trigger').on('touchstart', function(){
		scroll = $(window).scrollTop();
	});

	$('#new-item-trigger').on('touchend', function(){
		newScroll = $(window).scrollTop();
		if (scroll == newScroll ) {
			itemModTemplate.clone().insertBefore(spacer);
			$('.item-mod.new input').focus();
			$('.item-mod.new').removeClass('new');
		}
	});

	//On focus of input, trigger focus classes
	$('input').on('focus',function(){
		$('.mod').addClass('focus');
		$(this).closest('.item-mod').addClass('focus');
	});

	//Blur. Some problems with this working on newly created items. 
	//'.on' didn't seem to work either.
	$('input').blur(function(){
		var itemMod = $(this).closest('.item-mod');
		$('.mod').removeClass('focus');
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