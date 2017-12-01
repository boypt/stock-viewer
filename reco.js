;(function($,undefined){
	// var $weixin = $("#weixin");	
	var sTpl = ['<li class="item">',
					'<div class="img">',
						'<img src="{img}" alt="{name}">',
					'</div>',
					'<div class="info">',
						'<span class="title">{name}</span>',
						'<span class="intro">{intro}</span>',
					'</div>',
				'</li>'].join("");

	var getRecoList = function(data,sTpl){	
		var arrHtml = [];
		for(var i = 0,len = data.length;i < len;i++){
			arrHtml.push(utils.tmpl(sTpl, data[i]));
		}

		return arrHtml.join("");
	}

	var init = function(obj,cb){
		$.ajax(obj.url,{
			success:function(res){
				var ret = JSON.parse(res);
				if(ret && ret.errno == 0){
					var data = ret.data;
					if(data && data.length){
						var tpl = obj.tpl || sTpl;
						var str = getRecoList(data,tpl);
						$el = obj.el || $('body');
						$el.append(str);
						cb && cb();
					}
				}
			}
		});
	}

	window.RecoList = {
		init : init
	}
})(jQuery);