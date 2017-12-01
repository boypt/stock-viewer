// 数据统计
(function(){

    var hash = function (s) {
        var h = 0,
        g = 0;
        for (var i = s.length - 1; i >= 0; i--) {
            var c = parseInt(s.charCodeAt(i));
            h = ((h << 6) & 0xfffffff) + c + (c << 14);
            if ((g = h & 0xfe00000) != 0) h = (h ^ (g >> 21))
        }
        return h
    }


    var id = localStorage.getItem('stid');
    if(!id){
        var dm = document.domain.toLowerCase();
        id = [hash(dm), +new Date+ Math.random()+Math.random()].join('.');
        localStorage.setItem('stid', id);
    }

    var logSender = function (a, delay) {
        setTimeout(function () {
            var b = +(new Date) + Math.random(),
                c = "slog" + b,
                d = window[c] = new Image;
            d.src = a + (a.indexOf('?') == -1 ? "?":"&") + 'stid=' + localStorage.getItem('stid') + "&_t=" + b,
                d.onload = d.onerror = function () {
                    window[c] = null
                }
        }, delay || 0);
    };

    var pvUrl = 'http://lhb.stock360.cn/pv.gif';
    var clkUrl = 'http://lhb.stock360.cn/clk.gif';
    logSender(pvUrl);
    window.logSender = logSender;
    window.clkUrl = clkUrl;
    
    $(document).on('click', 'a', function(e){
    	var content = $(this).html();
    	var params = ['c=' + content];
    		
    	logSender(clkUrl + '?' + params.join('&'));
    });
})();
