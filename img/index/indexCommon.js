$(function () {
    lunbo("focus");  
    $("#teMaiAreaBox").scrollLoading({
        callback: tmSpecialList
    });
});
function lunbo(id) {
    var oDiv = $("#" + id);
    var oULBig = oDiv.children(".focusImg");
    var oULBigWidth = oULBig.css("width", oULBig.children('li').length * 1090);
    var aBigLi = oULBig.children('li');
    var oDivSmall = oDiv.children('.focusDot');
    var aLiSmall = oDivSmall.children('li');
    function autoplay() {
        if (now == aLiSmall.length) {
            now = 0;
            oULBig.stop().animate({ left: 0 }, 500);
        }
        for (var i = 0; i < aLiSmall.length; i++) {
            aLiSmall.eq(i).removeClass("curDot");
        }
        aLiSmall.eq(now).addClass('curDot');
        oULBig.stop().animate({ left: -(now * 1090) }, 500);
        now++;
    }
    //轮播;
    var now = 0;
    aLiSmall.hover(function () {
        now = $(this).index();
        autoplay();
    });
    var timelunbo = setInterval(autoplay, 3000);
    oDiv.hover(function () {
        clearInterval(timelunbo);
    }, function () {
        clearInterval(timelunbo);
        timelunbo = setInterval(autoplay, 3000);
    });
}

//倒计时
$.fn.countTime = function () {
    var self = $(this);
    $.each(self, function () {
        var tm = $(this);
        var intDiff = parseInt(tm.data("time")) || 0;
        window.setInterval(function () {
            var day = 0,
                hour = 0,
                minute = 0,
                second = 0;//时间默认值
            if (intDiff > 0) {
                day = Math.floor(intDiff / (60 * 60 * 24));
                hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }
            if (day <= 9) day = '0' + day;
            if (hour <= 9) hour = '0' + hour;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            $(".day", tm).html(day);
            $(".hour", tm).html(hour);
            $(".minute", tm).html(minute);
            $(".second", tm).html(second);
            intDiff--;
        }, 1000);
    });
}


var timeDate = function (obj) {
    return Dateformat(WcfDateToJsDate(obj), "yyyy/MM/dd hh:mm:ss");
};

var WcfDateToJsDate = function (wcfDate) {
    if (typeof wcfDate == 'string' && wcfDate.length > 5) {
        var date = new Date(parseInt(wcfDate.substring(6)));
        return date;
    } else return wcfDate;
};


var JsDateToWcfDate = function (jsDate) {
    // \/Date(568310400000+0800)\/
    return "\/Date(" + jsDate.getTime() + "+0000)\/";
};
var Dateformat = function (date, format) {
    var o = {

        "M+": date.getMonth() + 1, //month  
        "d+": date.getDate(), //day  
        "h+": date.getHours(), //hour  
        "m+": date.getMinutes(), //minute  
        "s+": date.getSeconds(), //second  
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter  
        "S": date.getMilliseconds() //millisecond  
    }

    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};



//特卖进行中;
function tmSpecialList() {
    var dataParameter = {
        "Top": 10,
        "PageIndex": 1,
        "PageSize": 10
    };$.ajax({
        url: window.TemaiProductRoot + 'QueryTopSpecialShow',
        type: "GET",
        cache: false,
        data: dataParameter,
        dataType: 'jsonp',
        jsonp: "callback",
        success: function (response) {
            if (response.DoFlag == true) {
                var result2 = TrimPath.processDOMTemplate("teMaiArea", response);
                document.getElementById("teMaiAreaBox").innerHTML = result2;
                bindTemaiFunction();
                bindTemaiGa();
            } else {
                $("#teMaiAreaBox").remove();
            }

        }
    });
}

function bindTemaiGa() {
    $(".temaiStats").unbind().bind("click", function () {
        var $this = $(this);
        var position = $this.attr("data-position");
        var type = "t_deal";
        var href = $this.attr("href");
        var id = $this.attr("data-id");
        _gaq_push(position, type, id, 1);
    });
}

function moreTemaiGa() {
    _gaq_push("m_more", "t_home", window.TemaiRoot , 1);
}

//绑定特卖专场时间
function bindTemaiFunction() {
    $("img").scrollLoading();
    $(".countDown").countTime();
}



/*
*   @param a 图片字符串
*   return 替换的img url
*/
function forMateImg(a) {
    return a.replace("{0}", "big");
}

/*
*   @param a 库存
*   @param b 促销库存    
*   @param c 是否满足条件  
*   @param d 数组下表
*   return 新的数值
*/
function saleStock(a, b, c, d) {
    var returnStock = 0;
    var baseVal = [527, 342, 861, 297, 618, 550, 364, 875];
    if (c == 1) {
        returnStock = parseInt(a) + parseInt(b) + baseVal[d - 1];
    } else {
        returnStock = baseVal[d - 1];
    }
    return returnStock;
}
/*
*   @param a 商品id
*   @param b 商品促销id
*   return 商品url
*/
function getGoodsUrl(a, b) {
    return window.ItemRoot + a + ".html?promid=" + b;
}

/*
* @param a 结束时间
* @param b 开始时间
*  return 时间（单位秒）
*/
function getCountDownTime(a, b) {
    a = timeDate(a, "yyyy/MM/dd hh:mm:ss");
   return ((new Date(a).getTime() - new Date().getTime()) / 1000);
}

/*
* @param a 专场id
* @param b 商品id
* @param c sku id
* return 商品url
*/
function getItemUrl(a, b, c) {
    return window.TemaiRoot + "show/" + a + ".html?ProductId=" + b + "&ProductSkuId=" + c;
}

/*
* @param a 图片url
* return 小尺寸的图片url
*/
function getNormalImg(a) {
    return a.replace("_source", "_l")
}

/*
* @param a 商品价格
* return 格式化后的价格
*/
function getFormatPrice(a) {
    return a.toFixed(2);
}

function replacePrice() {
    var gids = [];
    $("[class^='item-price']").each(function () {
        var $this = $(this);
        if ($this.attr("data-flag") == 0) {
            var gid = $(this).data("gid");
            gids.push(gid);
        }
    });

    var parameter = new Parameter();
    var dataParameter = {
        "ProductIdList": gids.join(","),
        "UserId": parameter.userId,
        "Guid": parameter.Guid,
        "DisplayLabel": parameter.DisplayLabel,
        "SourceTypeSysNo": parameter.SourceTypeSysNo,
        "AreaSysNo": parameter.AreaSysNo,
        "ChannelID": parameter.channel,
        "Ckid": parameter.Ckid,
        "ExtensionSysNo": parameter.ExtensionSysNo
    };
    try {
        $.ajax({
            url: window.BuyApiRoot + '/QueryPromPriceByProdId',
            type: "GET",
            cache: false,
            async: true,
            data: dataParameter,
            dataType: 'jsonp',
            jsonp: "callback",
            success: function (response) {
                var pDict = {};
                if (response.DoFlag == true) {
                    if (response.PromPriceList != null) {
                        $.each(response.PromPriceList, function (i, items) {
                            var values = response.PromPriceList[i];
                            pDict[items.ProductId] = values;
                            $(".item-price-" + items.ProductId + "").html(pDict[items.ProductId].PromPriceShow.toFixed(2));
                            $(".item-price-" + items.ProductId + "").attr("data-flag", 1);
                        });
                    }
                }
            }
        });
    } catch (e) {
    }
}