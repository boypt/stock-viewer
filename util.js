(function(){
	var utils = {
		ajax: function(url,callback){
			var XHR = (function(){
				try{
					if(window.XMLHttpRequest){
						return new window.XMLHttpRequest();
					}else{
						return new window.ActiveXObject("Microsoft.XMLHTTP");
					}
				}catch(e){}
			})();

			var url = url;
			XHR.open("get", url, true);
			XHR.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
			XHR.onreadystatechange = function(){
				if(XHR.readyState == 4 && XHR.status == 200){
					// var ret = eval("(" + XHR.responseText + ")");
					// var ret = new Function("return " + XHR.responseText )();
					// extension中不能使用eval，new Function等方法
					callback( unescape( XHR.responseText.replace(/\\/ig, '%') ) ); 
				}
			}
			XHR.send(null);

		},
		// 简易模板
		htmlEscape: function(s) {
		    if(s == null) return '';
		    s = s + '';
		    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, "&#39;");
		},
		getPathData: function (data , path){
			var type = $.type(data),
				path = path + '',
				dirs = path.split('.'),
				dir;
			/* 非数组或者非对象的data不处理 */
			if(!(type=='array') && !(type=='object')){return 'error data';}
			if(path == 'undefined'){return 'error path';}

			while(dir = dirs.shift()){
				if(data[dir]){
					data = data[dir];
				}else{
					return null;
				}
			}
			return data;
		},
		tmpl: function (tplStr, data) {
			/**
			 * 一般模板替换时data为一个对象或者数组，这样在模板中可以通过制定path来获取相应值，从而个性化渲染模板，但也有可能传入data为string，如历史记录中的情况，这时把它包装成数组，便于在history模板中定制输出
			 */
			if($.type(data) == 'string'){data = [data]}

		    return tplStr.replace(/{([^}]*?)}/g, function ($0, $1) {
		        return data[$1] == null ? '' : utils.htmlEscape(utils.getPathData(data,$1));
		    });
		}
	};

	window.utils = utils;
})();

