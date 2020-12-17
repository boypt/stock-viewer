;(function($,undefined){

	// 初始化指数数据
	(function(){
		var stock_list_data = localStorage.getItem('stock_list');
		$("#importexport_code").val(stock_list_data || '');
		if(!!stock_list_data){
			return;
		}
		var data = [
			{key: "sh000001", name: "上证指数", pinyin: "szzs", type: "ZS"},
			{key: "sz399006", name: "创业板指", pinyin: "cybz", type: "ZS"}
		];
		while(data.length){
			Stock.addStock(data.pop());
		}
	})();

	(function(){
		var renderIconHtml = function(){
			var confIcons = ['rabbit', 'panda', 'mouse', 'lips', 'bear', 'dog', 'angrybird', 'hellokitty', 'octopus', 'tiger', 'flower', 'crab'];
			// window.confIcons = confIcons;
			var html = [];
			while(confIcons.length){
				var icon = confIcons.shift();
				html.push('<a href="#" class="icon" data-id="' + icon + '"><img src="images/icons/' + icon + '.png"/></a>');
			}
			$('#setting .iconlist').html(html.join(""));			
		}
		var bindEvent = function(){
			$('.setting').on('click', function(e){
				$("#setting").toggle();
				$('.mask').toggle();
			});
			$('#setting').delegate('.icon', 'click', function(e){
				var name = $(this).attr('data-id');
				localStorage.setItem('stock_icon', name);
				$('.iconlist .icon').removeClass('cur');
				$(this).addClass('cur');

				chrome.browserAction.setIcon({path: 'images/icons/' + name + '.png'});
			}).delegate('.close', 'click', function(e){
				$('#setting').hide();
				$('.mask').hide();
			}).delegate('.default', 'click', function(e){
				localStorage.removeItem('stock_icon');
				chrome.browserAction.setIcon({path: 'images/logo48.png'});
			});

			$(".importexport").on('click', function(e){
				var stock_list_data = localStorage.getItem('stock_list');
				$("#importexport_code").val(stock_list_data || '');
				$("#importexport").show();
				$('.mask').toggle();
			});

			$("#importexport").delegate('.close', 'click', function(e){
				$('#importexport').hide();
				$('.mask').toggle();
			});

			$("#importexport_confirm").click(function (e) {
				var textdata = $("#importexport_code").val();
				try {
					var tmp = JSON.parse(textdata);
					console.log(tmp);

					if (typeof(tmp['value']) !== 'object') {
						alert('array error');
						return;
					};
				} catch (e) {
					alert(e);
					return;
				}

				localStorage.setItem('stock_list', textdata);
				window.close();
			});
		}
		renderIconHtml();
		bindEvent();

	})();


	var baseSugUrl = 'https://smartbox.gtimg.cn/s3/?t=all';
	var localBaseSugUrl = localStorage.getItem('stock_sugUrl');
	if(localBaseSugUrl && localBaseSugUrl != 'undefined'){
		baseSugUrl = localBaseSugUrl;
	}
	/* 搜索suggest */
	var sug = new Suggest({
		template : {
			item : '<div class="sug-item" data-pre="{0}" data-item="{0}{1}" data-type={4}>'+
						'<span class="key">{1}</span><span class="name">{2}</span><span class="pinyin">{3}</span>'+
						// '<span class="sug-plus"></span>'+
					'</div>'
		},
		requestUrl : baseSugUrl,
		requestQueryKey : 'q',
		requestCallbackKey : 'cb',
		localStorageKey : Stock.name,
		suggestMaxNum: 15,
		submitCallback : function(query){
			var arr = query.split("  ");
			var queryObj = {
				key : arr[0]+arr[1],
				name : arr[2],
				pinyin : arr[3],
				type : arr[4]
			}
			console.log(queryObj);
			Stock.addStock(queryObj);
		},
		isCache : false
	});
	window.TYPE = "financeQQ";
	
})(jQuery);

