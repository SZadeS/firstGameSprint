
jQuery(window).load(function(){
	viewHandle();
	pageHandler();
});

function viewHandle(){
	var timeHolder = $('.time-box'),
		hintViewTime = timeHolder.find('#hint-time'),
		gameViewTime = timeHolder.find('#play-time'),
		gameHolder = $('.game-holder'),
		hintsView = gameHolder.find('.hints'),
		gameView = gameHolder.find('.play-dice'),
		refreshBtn = gameHolder.find('.btn-refresh'),
		gameIndex = 60,
		index = 15;


	if(index >= 10){
		hintViewTime.html('00 : ' + index);
	}else{
		hintViewTime.html('00 : 0' + index);
	}
	stepHandler();
	hintViewTime.fadeIn('slow');
	hintsView.fadeIn('slow');


	function hanldeTime(index){
		if(index >= 10){
			hintViewTime.html('00 : ' + index);
		}else{
			hintViewTime.html('00 : 0' + index);
		}

		if(index === 0){
			clearInterval(timer);
			hintViewTime.fadeOut('fast');
			hintsView.fadeOut('fast');

			setTimeout(function(){
				if(gameIndex >= 10){
					gameViewTime.html('00 : ' + gameIndex);
				}else{
					gameViewTime.html('00 : 0' + gameIndex);
				}
				gameViewTime.fadeIn('slow');
				gameView.fadeIn('slow');

				var gameTimer = setInterval(function(){
					handleGameTime(gameIndex);
					gameIndex --;
				}, 1000);


				function handleGameTime(gameIndex){
					if(gameIndex >= 10){
						gameViewTime.html('00 : ' + gameIndex);
					}else{
						gameViewTime.html('00 : 0' + gameIndex);
					}

					if(gameIndex === 0){
						clearInterval(gameTimer);
						$('#lose').fadeIn('fast');
						refreshBtn.fadeIn('fast');
					}
				}

			},500);
		}
	}

	var timer = setInterval(function(){
		hanldeTime(index);
		index --;
	}, 1000);

}


function createGround(width){
    var result = [];

    for (var i = 0 ; i < width; i++) {
        for (var j = i; j < i+1; j++) {
			result[j] = Math.ceil((Math.random() * 8) + 1);
        }
    }

    return result;
}


function stepHandler(){
	var itemHolder = $('.play-dice'),
		hintsList = $('.game-items.hints'),
		hintsItem = hintsList.find('.items-row'),
		item = itemHolder.find('.items-row'),
		lastVal = 0,
		results = createGround(10),
		gameHolder = $('.game-holder'),
		refreshBtn = gameHolder.find('.btn-refresh'),
		pointsList = [],
		timeHolder = $('.time-box'),
		gameViewTime = timeHolder.find('#play-time'),
		count = localStorage.getItem('count') ? localStorage.getItem('count') : 6;


	matchIndex(hintsItem, false);
	document.getElementById("life").innerHTML = count;

	function matchIndex(indexItem, flag){

		function filterArray(){
			if(pointsList.sort().join(',') !== results.sort().join(',')){
				return false;
			}else{
				return true;
			}
		}

		function lifeVal(){
		 document.getElementById("life").innerHTML = count;
		}

		if(flag){
			var childs = indexItem.parent().children(),
				val = true;

			if(!$(indexItem).hasClass('isClicked')){
				pointsList.pop(k);
			}

			for (var k = 0; k < childs.length; k++) {

				if($(childs[k]).hasClass('isClicked')){
					pointsList.push(k);

				}
			}

			for(var n=0; n<pointsList.length; n++){
				var items = [],
					compareLength = results.length - pointsList.length;

				while(compareLength > 0){
					var item = results.shift();
					items.unshift(item);
					compareLength--;
				}

				val = filterArray();

				if(val){
					var len = items.length;
					while(len > 0){
						var item = items.shift();
						results.unshift(item);
						len--;
					}
				}else{
					count = count - 1;
					lifeVal();
					$('#lose').fadeIn();
					refreshBtn.fadeIn('fast');
					$('#win').addClass('hidden');
					$('#play-time').addClass('hidden');
					localStorage.setItem('count', count);
					return false;
				}
			}


			if(pointsList.length >= results.length){
				console.log('>>> here ');
				var res = filterArray();

				if(!res){
					count = count - 1;
					lifeVal();
					$('#lose').fadeIn();
					$('#play-time').addClass('hidden');
					$('#win').addClass('hidden');
					refreshBtn.fadeIn('fast');
					localStorage.setItem('count', count)

				}else if(pointsList.length >= results.length){
					$('#win').fadeIn();
					refreshBtn.fadeIn('fast');
					$('#play-time').addClass('hidden');
					$('#lose').addClass('hidden');
				}

			}

		}else{
			for (var k = 0; k < results.length; k++) {
				var loc = results[k],
					itemChild = indexItem[k].children;

				itemChild[loc].className += ' isClicked';
			}
		}



	}

	item.each(function(index){
		var item = $(this),
			colItem = item.find('.item');

		colItem.each(function(colIndex){
			var col = $(this);

			col.on('click',function(){
				col.toggleClass('isClicked');
				matchIndex(col, true);
			});
		});

	});
}

function pageHandler(){
	var btn = $('.btn-reload')[0];

	btn.onclick = function(){
		location.reload();
	}
}
