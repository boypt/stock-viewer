/**
 * suggest.js	搜索建议组件
 * @authors guorui (guorui@360.cn)
 * @date    2014-08-26 15:10:02
 * @version 1.0.2
 */
 function loadJs(l,f,e){var b={}.toString.call(l)==="[object Array]",a=document.getElementsByTagName("SCRIPT")[0],h=a.parentNode,d=0,j=false,g=3000,c=function(m){if(m.clearAttributes){m.clearAttributes()}else{m.onload=m.onreadystatechange=m.onerror=null}h.removeChild(m)},i=function(){if(!f){return}if(b){d++;if(d===l.length){j=true;f()}}else{j=true;f()}},k=function(n){var m=document.createElement("SCRIPT");m.type="text/javascript";m.charset="utf-8";m.async=true;if(m.readyState){m.onreadystatechange=function(){if(m.readyState=="loaded"||m.readyState=="complete"){m.onreadystatechange=null;i()}}}else{m.onload=function(){i()}}if(e){m.onerror=function(){c(m);j=true;e()};setTimeout(function(){!j&&e()},g)}m.src=n;h.insertBefore(m,a)};if({}.toString.call(l)==="[object Array]"){each(l,function(m){k(m)})}else{k(l)}}
(function($, win, undefined){
    
	function Suggest( conf ){
		this._init( conf );
	}

	Suggest.prototype = {
		/* 更正构造函数 */
		constructor : Suggest,
		/**
		 * init	初始化函数
		 * @param config{Object} 用户配置
		 */
		_init : function( U_conf ){
			/* 默认配置 */
			var D_conf = {
				elements : {
					/* 放置suggest的wrap */
					wrap : null,
					/* 输入框 */
					input : null,
					/* 要提交的form表单 */
					form : null,
					/* 关闭suggest列表的按钮 */
					close : null,
					/* 快速删除按钮 */
					quickdel : null
				},
				template : {
					/* suggest提示框结构模板 */
					sug  : '<div class="sug">'+
		    					'<div class="sug-list">'+
		    					'</div>'+
		    					'<div class="sug-button">'+
		    						'<span class="sug-clear">清空历史记录</span>'+
		    						'<span class="sug-close">关闭</span>'+
		    					'</div>'+
		    				'</div>',
					/* 每条结果结构模板 */
					item : '<div class="sug-item" data-item="{0}">'+
    							'{0}<i>{1}</i>'+
    							'<span class="sug-plus"></span>'+
    						'</div>'
				},
				/* suggest显示的最大数目 */
				suggestMaxNum : 5,
				/* 是否选择快速删除按钮 */
				showQuickDel : true,
				/* 远程加载数据的接口url */
				requestUrl : 'http://suggest.h.qhimg.com/index.php',
				/* 请求url中query字符串的键值，如"&kw=123"中的kw，通过它可以灵活适配服务端接口*/
				requestQueryKey : 'word',
				/* 请求url中callback回调的键值，如"&cb=zepto_suggest_123"中的cb，通过它可以灵活适配服务端接口*/
				requestCallbackKey : 'cb',
				/* 请求url中需要额外添加的参数， 通过它可以灵活适配服务端接口*/
				requestParam : '',
				/* response数据中所需遍历数据的路径,使用.来分割，类似从{a:['ha']}中通过path:'a.1'来获取ha */
				responseDataPath : '',
				/* 数据请求处理的间隔时间 */
				renderDelayTime : 300,
				/* 是否显示input框快速删除按钮 */
				showQuickDel : true,
				/* localstorage关键字 */
				localStorageKey : 'zepto_suggest',
				/* localstorage分隔符 */
				localStorageSeparator : ',',
				/* 清除历史记录是否提示确认框 */
				confirmClearHistory : true,
				submitCallback : function(){},
				/* 是否缓存请求的查询结果 */
				isCache : true			};
			this.config = $.extend( true , D_conf , U_conf );
			/* 初始化DOM */
			this._initDom();
			/* 初始化事件绑定 */
			this._bindEvent();
		},

		/*=================初始化=====================*/

		/**
		 * initDom	初始化Dom函数,对dom进行包装，添加一些组件需求的元素
		 * @return suggest{Suggest} 当前实例
		 */
		_initDom : function(){
			var t = this,
				$wrap = t.El('wrap'),
				$input = t.El('input'),
				$form = t.El('form'),
				sugTmpl = t.config.template.sug,
				sugList,
				sugClassTop = null;

			/* 输入框 */
			!$input && ($input = t.El('input',$('#input')));
			$input.attr('autocomplete','off');
			/* form表单 */
			!$form && ($form = (t.El('form',$input.closest('form'))));

			/* 修正wrap，suggest的外层包裹，可以用户指定，默认在input上外创建一个sug-mask的div */
			if ($wrap) {
				/* wrap存在，所有suggest的结构放入wrap中*/
				$wrap.append(sugTmpl);
			}else{
				/* wrap不存在，默认在input后放置一个suggest list */
				$input.wrap('<div class="sug-mask"></div>');
				$wrap = $('.sug-mask');
				t.El('wrap',$wrap);
				$wrap.css({'position':'relative'});
				sugClassTop = $input.height() + (parseInt( $wrap.css( 'top' ), 10 ) || 0);
				$wrap.append(sugTmpl);
			}

			/* 快速删除按钮 */
			t.config.showQuickDel && ($input.parent().append(t.El('quickdel',$('<div class="sug-quickdel"></div>'))));

			/* suggest list */
			$sug = t.El('sug',$wrap.find('.sug'));
			$sugList = t.El('list',$wrap.find('.sug-list'));
			sugClassTop && $sug.css('top',sugClassTop);

			/* 按钮 */
			t.El('close',$wrap.find('.sug-close'));

			return t;
		},

		/**
		 * bindEvent 初始化事件绑定操作
		 * @return keyword{String} 当前用户输入的关键字
		 * @return suggest{Suggest} 当前实例
		 */
		_bindEvent : function(){
			var t = this,
				$doc = $(document),
				$input = t.El('input'),
				$form = t.El('form'),
				$close = t.El('close'),
				$quickdel = t.El('quickdel'),
				$sug = t.El('sug');
			/* input的相关事件绑定 */
			$input.on('focus',function(){
				!t.isShow() && t._renderList();
			});
			$input.on('input',function(){
				t._renderList();
			});

			$input.on("keydown",function(e){
				var keyCode = e.keyCode;
				if(keyCode != 38 && keyCode != 40){
					return;
				}
				if($sug.find(".sug-item").length){
					var direction = "down";
					switch(e.keyCode){
						case 38:
							direction = "up";
							break;
						case 40:
							direction = "down";
							break; 
					}
					t._focusItem(direction);
				}
			}).on('keyup', function(e){
				if(this.value.trim() == ''){
					t.hide();
				}
			});

			/* form提交 */
			$form.on('submit',function(e){
				e.preventDefault();
				/* 存入历史记录 */
				if($sug.find(".sug-item").length){
					var val = "";
					var el = null;
					if($sug.find(".hover").length){
						el = $sug.find(".hover");
					}else{
						el = $sug.find(".sug-item").eq(0);
					}

					var arr = [];
					el.find("span").each(function(i,item){
						arr.push($(item).html());
					})
					arr.push(el.attr('data-type'));
					val = el.attr('data-pre') + "  " + arr.join("  ");
					
					t.config.submitCallback(val);
					t.hide();
					$input.val('');
				}
				
			});

			/* 关闭按钮 */
			$close.on('click',function(){
				t.hide();
			});
			$doc.on('click', function(e){
				var el = e.target;
				while(el){
					if(el.id && el.id == 'search'){
						return;
					}
					el = el.parentNode;
				}
				t.hide();
			});

			/* 快速删除按钮 */
			if(t.config.showQuickDel){
				var handleDelBtn = function(){
					if($input.val()){
						$quickdel.show();
					}else{
						$quickdel.hide();
					}
				};
				$quickdel.on('click',function(){
					$input.val('').trigger('input');
					$(this).hide();
				});
				$input.on('focus blur input',handleDelBtn);
			}

			/* 快速复制按钮 */
			$sug.delegate('.sug-plus','touchend',function(e){
				// $input.val($(this).closest('.sug-item').data('item'));
				$input.trigger('focus');
				e.preventDefault();
                e.stopPropagation();
			});

			/* suggest条目点击 */
			$sug.delegate('.sug-item','click',function(e){
				var el = $(this);
				el.find('.sug-plus').trigger('touchend');
				// $form.submit();

				var arr = [];
				el.find("span").each(function(i,item){
					arr.push($(item).html());
				})
				arr.push(el.attr('data-type'));

				var val = el.attr("data-pre") + "  " + arr.join("  ");
				t.config.submitCallback(val);
				t.hide();
				$input.val('');
			});

			return t;
		},

		/*=================视图操作=====================*/
		_focusItem : function(direction){
			var t = this;
			var $sug = t.El('sug');
			var $input = t.El('input');
			var focusClass = "hover";
			var index = $sug.find('.' + focusClass).index();
			var	len = $sug.find(".sug-item").length;
			var	lastIndex = len - 1;
			if(!len){
				return;
			}
			if(direction == "down"){
				var nextIndex = index < lastIndex ? index + 1 : -1;
			}
			if(direction == "up"){
				var nextIndex = index == -1 ? lastIndex : index - 1;
			}

			$sug.find(".sug-item").removeClass(focusClass);
			var curItem = $sug.find(".sug-item").eq(nextIndex);
			if(nextIndex != -1){
				curItem.addClass(focusClass);
			}			

			var arr = [];
			curItem.find("span").each(function(i,item){
				arr.push($(item).html());
			})

			$input.val(arr.join("  "));
		},
		/**
		 * _renderList 渲染suggest列表
		 * @param callback{Function} 回调函数
		 * @return suggest{Suggest} 当前实例
		 */
		_renderList : function(){
			var t = this,
				kw;

			win.clearTimeout(t.renderTimeout);
			t.renderTimeout = win.setTimeout(function(){
				kw = t._getKeyword();
				if( kw ){
					/* 加载远程数据 */
					t._getRemoteData( t._renderSuggestList );
				}
			}, t.renderDelayTime);

			return t;
		},
		/**
		 * _renderSuggestList 根据data渲染suggest列表
		 * @param kw{String} 查询关键字
		 * @param data{Array} suggest数据集
		 * @param tpl{String} 模板字符串
		 * @return suggest{Suggest} 当前实例
		 */
		_renderSuggestList : function( kw , data , tpl ){
			var t = this,
				curKw = t._getKeyword(),
				$list = t.El('list'),
				sugMaxNum = t.config.suggestMaxNum,
				htmlStr = [],
				i,len;

			/* 更新列表前如果发现获取的kw和当前inupt中的kw不一致，则不更新list */
			if(curKw!=kw){return t;}

			if( !data || !data.length ){
				t.hide();
				return t;
			}
			var regFilter = /^(sz|sh|jj)$/i;
			for (i = 0, len = data.length; (i <= len-1)&&(i < sugMaxNum); i++) {
				if(!regFilter.test(data[i][0])){
					continue;
				}
				htmlStr.push(utils.tmpl( tpl , data[i] ));
			}
			$list.html(htmlStr.join(''));
			t.show();

			return t;
		},
		/**
		 * show 显示suggest列表
		 * @return suggest{Suggest} 当前实例
		 */
		show : function(){
			var t = this,
				$sug = t.El('sug');
			if(!t.isShow()){
				$sug.show();
			}
			return t;
		},
		/**
		 * hide 隐藏suggest列表
		 * @return suggest{Suggest} 当前实例
		 */
		hide : function(){
			var t = this,
				$sug = t.El('sug');
			if(t.isShow()){
				$sug.hide();
			}
			return t;
		},
		/**
		 * isShow 判断suggest列表是否显示
		 * @return boolean{Boolean} 布尔值
		 */
		isShow : function(){
			var t = this,
				$sug = t.El('sug');
			return $sug.is(':visible');
		},

		/*=================数据操作=====================*/

		/**
		 * _getKeyword 获取用户输入框请求的关键字
		 * @return keyword{String} 当前用户输入的关键字
		 */
		_getKeyword : function(){
			return this.El('input').val().trim();
		},
		/**
		 * _getRemoteData 通过远程请求获取数据
		 * @param callback{Function} 回调函数
		 * @return suggest{Suggest} 当前实例
		 */
		_getRemoteData : function( callback ){
			var t = this,
				url = t.config.requestUrl,
				kw = t._getKeyword(),
				queryKey = t.config.requestQueryKey,
				param = t.config.requestParam,
				cbKey = t.config.requestCallbackKey,
				isCache = t.config.isCache,
				cb;

			/* 请求后回调函数名称 */
			cb = 'zepto_suggest_'+(+new Date());

			if(url.split("?").length == 1){
				/* url添加query */
				url = ( url + '?' + queryKey + '=' + encodeURIComponent( kw ) ).replace(/[&?]{1,2}/,'?');
			}else{
				url = ( url + '&' + queryKey + '=' + encodeURIComponent( kw ) ).replace(/[&?]{1,2}/,'?');
			}
			/* url添加callback */
			!~url.indexOf( cbKey ) && (url += '&'+ cbKey + '=' + cb);

			/* url其他参数 */
			param && (url += '&' + param);

			if(window.TYPE && TYPE == "financeQQ"){
				utils.ajax(url,function(d){
					var ret = d.split('"').length > 2 ? decodeURIComponent(d.split('"')[1]) : '' ;
					var data = ret.split('^');
					data.forEach(function(item,index){
						data[index] = item.split("~");
					})
					callback.call( t , kw , data, t.config.template.item );
				});
				// loadJs(url,function(){
				// 	// console.log(v_hint);
				// 	var data = v_hint.split("^");
				// 	data.forEach(function(item,index){
				// 		data[index] = item.split("~");
				// 	})
				// 	callback.call( t , kw , data, t.config.template.item );	
				// },function(){});	
			}else{
				/* jsonp的回调处理 */
				win[ cb ] = function( res ){
					/**
					 * res为远程返回的完整数据
					 * 格式：{q:'123',d:['1234','12345']}
					 * q为查询的字符串，d为查询的结果数组
					 */
					 /**
					 * data为需要遍历的结果数组
					 * 格式（res中的d）：['1234','12345']
					 * 使用getPathData的方法是为了从res中获取d，这样通过配置可以适应各种接口数据结构
					 */
					var data = utils.getPathData(res , t.config.responseDataPath);
					/* 回调处理 */
					callback.call( t , kw , data, t.config.template.item );
					/* 移除window上的回调函数 */
					delete win[ cb ];
				};
				/* jsonp请求 */
				$.ajax({
					url : url,
					dataType : 'jsonp'
				});
			}


		},

		/*=================工具方法=====================*/

		/**
		 * EL 对config上的elements进行操作 (获取|更新)
		 * @param [key]{String} 索引
		 * @param [value]{String} 值
		 * @return [zepto{Zepto}] 返回相应元素
		 */
		El : function( key , value ){
			var t = this;
			if ( value ) {
				/* 设置元素值 */
				return (t.config.elements[key] = value);
			}else{
				/* 获取元素值 */
				return t.config.elements[key];
			}
		}

	};

	win.Suggest = Suggest;
})(jQuery, window);