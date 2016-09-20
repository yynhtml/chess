$(function () {
    //邮费图片加载并且不是第一次登陆出现
    setTimeout(Module_A02, 1);
    //$(window).scroll(function (event) {
    //    iEResize();
    //});
    bindEveryPromotionGa();
    //从首页跳转到特卖页面;
    window.PageInits.push(function initPage() {
        var areaId = window.AreaId;
        if (areaId <= 0) {
            areaId = 9;
        }
        //if (areaId == 19 || areaId == 1000019) {
        //    window.location.href = window.WebRoot + "gd";
        //} else if (!((areaId == 9) || (areaId == 10) || (areaId == 11) || (areaId == 1000009) || (areaId == 1000010) || (areaId == 1000011))) {
        //    if ($.cookie && !$.cookie("m_gotm")) {
        //        $.cookie("m_gotm", 1, { expires: 0.25 });
        //        window.location.href = window.HaitaoRoot;
        //    }
        //}

        if (!((areaId == 9) || (areaId == 10) || (areaId == 11) || (areaId == 1000009) || (areaId == 1000010) || (areaId == 1000011))) {
            if ($.cookie && !$.cookie("m_gotm")) {
                $.cookie("m_gotm", 1, { expires: 0.25 });
                window.location.href = window.HaitaoRoot;
            }
        }
    });
    
    $(".fixLeftTop a").click(function () {
        var _this = $(this);
        var targetId = _this.attr("data-id");
        var top = $("#" + targetId + "").offset().top - 50;
        if (targetId == "teMaiAreaBox") {
            if ($("#ui-brand-ul").length <= 0) {
                $("html, body").stop().animate({ scrollTop: top+350 }, 400);
            } else {
                $("html, body").stop().animate({ scrollTop: top }, 400);
            }
        } else {
            $("html, body").stop().animate({ scrollTop: top }, 400);
        }
        
    });


    $("#everyDayAreaBox").scrollLoading({
        callback: getEveryDaySpecial
    });
    
    $("#uiBrandAreaBox").scrollLoading({
        callback: brandDataAjax
    });
    
    $("#indexAutoPlayAreaBox").scrollLoading({
        callback: Module_A101
    });

    $(window).scroll(function () {
        var $mallSearch = $(".ui-top-bar").find("#mallSearch");
        var $header_mallSearch = $("#ui-fixed-top").find("#mallSearch");
        var scroH = $(document).scrollTop();
        if ($(".fixLeftImg").length > 0) {
            if (scroH > 100) {
                $(".fixLeftImg").fadeIn();
            } else {
                $(".fixLeftImg").fadeOut();
            }
        }
       
        if (scroH > 500) {
            $("#ui-fixed-top").fadeIn();
            if ($mallSearch.length != 0 && $header_mallSearch.length == 0) {
                $("#fix-mallSearch-input").append($("#mallSearch").clone(true));
                $(".ui-top-bar #mallSearch").remove();
            }
        } else {
            $("#ui-fixed-top").fadeOut();
            if ($mallSearch.length == 0 && $header_mallSearch.length != 0) {
                $(".ui-top-bar #header-extra").append($("#mallSearch").clone(true));
                $("#fix-mallSearch-input #mallSearch").remove();
            }
        }
    });
    
});

function bindBrandPlay() {
    $("img").scrollLoading();
    var len = $("#ui-brand-ul li").length;
    var target = $("#ui-brand-ul");
    target.css("width", len*1090);
    var next = $("#brand-next");
    var pre = $("#brand-pre");
    next.click(function () {
        var page = parseInt(next.attr("data-page"));
        if (page == len) {
            target.animate({
                marginLeft: 0
            }, 400, function () {
                next.attr("data-page", 1);
                pre.attr("data-page", 1);
            });
        } else {
            next.attr("data-page",page+ 1);
            pre.attr("data-page", page + 1);
            page = parseInt($(this).attr("data-page"));
            target.animate({
                marginLeft: -(page - 1) * 1090
            }, 500, function () {

            });
        }
    });

    pre.click(function () {
        var page = parseInt(next.attr("data-page"));
        if (page == 1) {
            target.animate({
                marginLeft: -(len - 1) * 1090
            }, 500, function () {
                next.attr("data-page", len);
                pre.attr("data-page", len);
            });
        } else {
            next.attr("data-page", page-1);
            pre.attr("data-page", page - 1);
            page = parseInt($(this).attr("data-page"));
            target.animate({
                marginLeft: -(page - 1) * 1090
            }, 500);
        }
    });
}

/*
* 绑定天天特价事件
*/
function bindEveryDayFunction() {
    $("img").scrollLoading();
    $(".countDownEveryDay").countTime();
    var everyDayLength = 2;
    $("#arr-left").click(function () {
        var $this = $(this);
        var target = $("#everyDayPromo");
        var currentPage = $this.attr("data-page");
        if (currentPage == 1) {
            return;
        } else {
            $(".ui-arr a").attr("data-page", --currentPage);
            target.stop().animate({ marginLeft: -1104 * (currentPage - 1) }, 500);
            $(".ui-arr a").removeClass("on");
            $("#arr-right").addClass("on");
        }
    });
    $("#arr-right").click(function () {
        var $this = $(this);
        var target = $("#everyDayPromo");
        var currentPage = $this.attr("data-page");
        if (currentPage == everyDayLength) {
            return;
        } else {
            $(".ui-arr a").attr("data-page", ++currentPage);
            target.stop().animate({ marginLeft: -1104 * (currentPage - 1) }, 500);
            $(".ui-arr a").removeClass("on");
            $("#arr-left").addClass("on");
        }
    });

    var autoCurrentPage = 0;
    function autoPlayEveryDay() {
        autoCurrentPage++;
        if (autoCurrentPage > 1) {
            autoCurrentPage = 0;
            $(".ui-arr a").attr("data-page", 1);
            $(".ui-arr a").eq(0).removeClass("on").siblings().addClass("on");
            $("#everyDayPromo").stop().animate({ marginLeft: 0 }, 500);
        } else {
            $(".ui-arr a").attr("data-page", 2);
            $(".ui-arr a").eq(1).removeClass("on").siblings().addClass("on");
            $("#everyDayPromo").stop().animate({ marginLeft: -1104 }, 500);
        }
    }
    var everyDayTimer = setInterval(autoPlayEveryDay, 6000);
    $(".ui-arr a").hover(function () {
        clearInterval(everyDayTimer);
    }, function () {
        clearInterval(everyDayTimer);
        everyDayTimer = setInterval(autoPlayEveryDay, 6000);
    });
}

//获取天天特价数据
function getEveryDaySpecial() {
    var promSysno = $("#hi_promSysno").val();
    //替换倒计时
    getProductSpecialList(promSysno);
}

function getProductSpecialList(promSysNo) {
    var dataParameter = {
        "ProductId": '',
        "PromSysNo": promSysNo,
        "UserId": '',
        "Guid": '',
        "DisplayLabel": displayLabel(),
        "SourceTypeSysNo": window.SourceTypeSysNo,
        "AreaSysNo": 100,
        "ChannelID": 102,
        "Ckid": 21,
        "ExtensionSysNo": $.cookie("ExtensionSysNo") || ''
    };
    $.ajax({
        url: window.BuyApiRoot + 'QueryProductByPromAndProd',
        async: true,
        type: "GET",
        cache: false,
        data: dataParameter,
        dataType: 'jsonp',
        jsonp: "callback",
        success: function (response) {
            if (response.DoFlag == true && response.PromModel != null) {
                $("p.countDownEveryDay").attr("data-time", response.PromModel.PromTime);
                bindEveryDayFunction();
                bindEveryPromotionGa();
            } else {
                $("#everyDayAreaBox").remove();
            }
        }
    });
}
//品牌专栏数据调用
function brandDataAjax() {
    var data = {ApplyPlace:1,FloorId:1};
    $.ajax({
        url: window.GoodsApi + 'json/reply/QueryNewHomePageAdOrBrand',
        type: "GET",
        cache: false,
        data: data,
        dataType: 'jsonp',
        jsonp: "callback",
        success: function (response) {
            if (response.DoFlag == true) {
                var result3 = TrimPath.processDOMTemplate("uiBrandArea", response);
                document.getElementById("uiBrandAreaBox").innerHTML = result3;
                //品牌专场轮播
                bindBrandPlay();
                bindBrandGa();
            } else {
                $("#uiBrandAreaBox").remove();
            }
        }
    });
}



//首页 广告轮播
function Module_A101() {

    //LoadModuleData("A-101", function (result) {
    //    if (result.DataList.length > 0) {
    //        var result4 = TrimPath.processDOMTemplate("indexAutoPlayArea", result);
    //        document.getElementById("indexAutoPlayAreaBox").innerHTML = result4;
            bindAutoPlay();
            bindNewGa();
    //    }
    //    return;        
    //});
}


function bindAutoPlay() {
    function autoplay() {
        if ($dian > ($slideimg - 1)) {
            $dian = 0;
            $("#slideArea").animate({ left: 0 }, 100);
        }
        $("#slideArea").stop().animate({ left: -$dian * 1090 }, 500);
        $("#slide_btnArea>span").eq($dian).addClass('bannercur').siblings().removeClass('bannercur');
        $dian++;
    }
    //轮播;
    var $dian = 0;
    var timelunbo = setInterval(autoplay, 3000);
    var $slideimg = $("#slideArea").find(".main-banner").length;
    var $dianwidth = 23 * $slideimg;
    $("#slideArea").css("width", 1090 * $slideimg + "px");
    $("#slide_btnArea").css({ "width": $dianwidth + "px", "marginLeft": "-" + ($dianwidth + 10) / 2 + "px" });

    $("#slide_btnArea>span").hover(function (e) {
        $dian = $(this).index();
        $("#slideArea").stop().animate({ left: -$dian * 1090 }, 500);
        $("#slide_btnArea>span").eq($dian).addClass('bannercur').siblings().removeClass('bannercur');
    });
    $("#slideBox").hover(function () {
        clearInterval(timelunbo);
    }, function () {
        clearInterval(timelunbo);
        timelunbo = setInterval(autoplay, 3000);
    });
}


function iEResize() {
    var windowWidth = $(window).width();
    var target = $("#slideArea");
    if (windowWidth > 1240) {
        target.css({ marginLeft: -340 });
    } else {
        target.css({ marginLeft: -460 });

    }

}


function Module_A02() {

    if (typeof ($.cookie('isshowpoppic')) == "undefined") {

        LoadModuleData("A-02", function (result) {

            if (result.DataList != null && result.DataList.length > 0) {
                var item = result.DataList[0];
                var smallPic = item.SmallPic;
                var bigPic = item.BigPic;
                var closeImgPosi = parseInt(item.Tip);//定位按钮位置;
                var imgSizeSplit = ($(item.Content).text() || item.Content || "").split("x");
                if (imgSizeSplit.length < 2) {
                    return;
                }
                if (closeImgPosi.length < 0) {
                    return;
                }

                var popImgWidth = parseInt(imgSizeSplit[0]);
                var popImgHeight = parseInt(imgSizeSplit[1]);

                if (bigPic && popImgWidth > 0 && popImgHeight > 0) {
                    //弹出图片的路径        
                    var popupContainer = $("#popup_container");
                    var arr = [];
                    arr.push('<a href="' + item.LinkUrl + '" target="_blank" data-index="index-zmm-overlay-link" class="first-big-img">');
                    arr.push('<img src="' + bigPic + '" /></a>');
                    arr.push('<span href="javascript:;" class="close"><img src="' + smallPic + '"/></span>');
                    arr = arr.join('');
                    popupContainer.html(arr);
                    popupContainer.css({ "width": popImgWidth + "px", "height": popImgHeight + "px", "position": "relative" });
                    popupContainer.find(".close").css({ "right": closeImgPosi + "px", "top": closeImgPosi + "px" });//定位关闭的按钮;

                    $("#popup_container a").click(function () {
                        _gaq.push(['_trackEvent', window.location.href, $(this).attr("data-index"), $(this).attr("href")]);
                    });
                    popupContainer.find("span.close").click(function () {
                        $("#easyDialogBox").remove();
                        $("#overlay").remove();
                    });

                    easyDialog.open({
                        container: 'popup_container',
                        isOverlay: true
                    });
                    $("#overlay").css({
                        "background": "#000",
                        "opacity": 0.8
                    });

                    $.cookie('isshowpoppic', 'express_cookie_value', { expires: 1 });
                }
            }
        });
    }
}

function bindEveryPromotionGa() {
    $(".promotionStats").unbind().bind("click", function () {
        var $this = $(this);
        var href = $this.attr("href");
        var position = $this.attr("data-position");
        var type, id ;
        
        if (href.indexOf("t.muyingzhijia.") > -1) {
            id = getQueryHrefString(href, "ProductId") + "_" + getQueryHrefString(href, "ProductSkuId");
            type = "t_product"; 
        } else {
            id = $this.attr("data-productId");
            type = "m_product";
        }
        _gaq_push(position, type, id, 1);
    });
}

function bindBrandGa() {
    $(".brandStats").unbind().bind("click", function () {
        var $this = $(this);
        var position = $this.attr("data-position");
        var href = $this.attr("href");
        var type,id;
        if (href.indexOf("t.muyingzhijia.") > -1) {
            type = "t_deal";
            id = href.replace(".html", "").split("show/")[1];
        } else if (href.indexOf("/Shopping/SearchResult.aspx") > -1) {
            type = "m_search";
            id = getQueryHrefString(decodeURIComponent(href), "condition");
        } else if (href.indexOf("haitao.muyingzhijia") > -1) {
            type = "h_brand";
            id = href.split(".html")[0].split("Brand/")[1];        
        }
         _gaq_push(position, type, id, 1);
    });
}