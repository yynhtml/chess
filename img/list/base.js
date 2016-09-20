//以下站点使用同一个base.js;by04.29.2015;
//MallSite;
//Item.MallSite;
//Haitao.MallSite;
//Buy.MallSite;
//AppSite;

//刷顶部
$(function () {
    getNavGationData();
    if ($("#ui-silder-nav").length > 0) {
        $("#ui-silder-nav").hover(function () {
            $(this).addClass("ui-silder-hover").find(".ui-category").stop().show();
        }, function () {
            $(this).removeClass("ui-silder-hover").find(".ui-category").stop().hide();
        });
    }
    $(".navStats").click(function () {
        var $this = $(this);
        var position = $this.attr("data-position");
        var type = $this.attr("data-type");
        var id = $this.attr("data-id");
        _gaq_push(position, type, id, 1);
    });
    $(".ui-category li a").click(function () {
        var $this = $(this);
        var index1 = $this.parents("li").index() + 1;
        var index2 = $this.parents("dd").index() < 0 ? 0 : $this.parents("dd").index();
        _gaq_push("m_category_" + index1 + "_" + index2, "m_category ", $this.text(), 1);
    });
});

window.GetUserInfo = function(callback) {

    if (window.HeaderBarLoaded) {
        callback({ UserId: window.UserId });
    } else {
        window.PageInits.push(function() {
            callback({ UserId: window.UserId });
        });
    }

};

var funProxyInterval = {};
function getPageTopToolbar() {
   

    var bindEvent = function () {
        if (typeof (window.initPage) == "function") {
            window.initPage();
        }
        if (typeof (window.PageInits) !== "undefined" && window.PageInits instanceof Array) {
            for (var i = 0; i < window.PageInits.length; i++) {
                var fun = window.PageInits[i];
                if (typeof (fun) == "function") {
                    try {
                        fun();
                    } catch (e) {
                    }
                }
                var funProxy = function (funName) {
                    var funStr = null;
                    if (typeof (funName) !== "string") {
                        return false;
                    }

                    if (typeof (funProxyInterval[funName]) === 'undefined') {
                        funProxyInterval[funName] = 0;
                    }

                    try {
                        funStr = eval(funName);
                    } catch (e) {

                    }

                    if (typeof (funStr) == "function") {
                        try {
                            funStr();
                            return true;
                        } catch (e) {
                        }
                    }

                    var retryCount = funProxyInterval[funName];
                    
                    if (retryCount < 5) {
                        funProxyInterval[funName] = retryCount + 1;
                        setTimeout(function () {
                            funProxy(funName);
                        }, 200);
                    }
                };
                funProxy(fun);

            }
        }
        //网站顶部 统计代码
        $(".m_top_nav_stats").unbind().bind("click", function () {
            var _this = $(this);
            var position = _this.attr("data-position");
            var type = _this.attr("data-type");
            var index = _this.attr("data-index");
            _gaq_push(position, type, index, 1);
        });
        //nav 浮层;
        $("#phonebox").hover(function () {
            $(this).addClass("hoverphonediv");
            $("#phonehidediv").show();
        }, function () {
            $(this).removeClass("hoverphonediv");
            $("#phonehidediv").hide();
        });

        $("#ssn-home").hover(function () {
            $(this).addClass('ssn-hover');
            $(this).addClass('ssn-home-hover');
            $("#Theader_down01").show();
        }, function () {
            $(this).removeClass('ssn-home-hover');
            $(this).removeClass('ssn-hover');
            $("#Theader_down01").hide();
        });

        $("#ssn-sitemap").hover(function () {
            $(this).addClass('ssn-hover');
            $("#Theader_down02").show();
        }, function () {
            $(this).removeClass('ssn-hover');
            $("#Theader_down02").hide();
        });

        $("#ssn-mybrand").hover(function () {
            $(this).addClass('ssn-hover');
            $("#Theader_down03").show();
        }, function () {
            $(this).removeClass('ssn-hover');
            $("#Theader_down03").hide();
        });

        var targetUrl = "";
        var pageUrl = window.location.href;
        var urlSearch = window.location.search;

        if (urlSearch.toLowerCase().indexOf("foward") <= -1 && pageUrl.toLowerCase().indexOf("register.aspx") <= -1 && pageUrl.toLowerCase().indexOf("login.aspx") <= -1) {
            pageUrl += urlSearch;
            targetUrl = "?foward=" + encodeURIComponent(pageUrl);
        }

        var $loginBtn = $("#loginBtn");
        var $regionBtn = $("#regBtn");
        $loginBtn.attr("href", $loginBtn.attr("href") + targetUrl);
        $regionBtn.attr("href", $regionBtn.attr("href") + targetUrl);

        if (pageUrl.indexOf('buy.') > -1) {

        } else if (pageUrl.indexOf("haitao.muyingzhijia") > -1) {
            $(".header-quick-menu li a[data-position='m_top_nav_3']").parent().addClass("curpage");
        }
        //else if (pageUrl.indexOf("t.muyingzhijia") > -1) {
        //    $(".header-quick-menu li a[data-position='m_top_nav_2']").parent().addClass("curpage");
        //}
        else if (pageUrl.indexOf("app.muyingzhijia") > -1) {
            $("#phonebox").addClass("curpage");
        } else {
            $(".header-quick-menu li a[data-position='m_top_nav_1']").parent().addClass("curpage");
        }

        $("#logout").click(function () {
            jQuery.ajax({
                type: "GET",
                dataType: 'jsonp',
                url: window.WebApiRoot + 'api/logout',
                //url: window.WebRoot + 'logout.aspx',
                success: function (result) {
                    var this_href = window.location.href;
                    var isRefresh = true;
                    var needRefreshUrls = [];
                    for (var i = 0; i < needRefreshUrls.length; i++) {
                        if (new RegExp(needRefreshUrls[i], "i").test(this_href)) {
                            isRefresh = true;
                            break;
                        }
                    }

                    if (isRefresh) {
                        window.location.reload();
                    } else {
                        getPageTopToolbar();
                    }
                }
            });
        });

        if ($("#slidebar").length > 0) {
            //动态加载广告;
            Module_Cart_tj_01("Cart-tj-01");

            //hover;
            $("#myzone,#mycollect,#myservice,#gototop").hover(function () {
                $(".level-dd,.level-dd-ewcode").hide().stop().animate({ right: "55px" }, 200, function () {
                    $(this).parent(".level-dl").removeClass("level-hover");
                });
                $(this).addClass("level-hover");
                $(this).children(".level-dd").show().stop().animate({ right: "31px" }, 200);
            }, function () {
                $(".level-dd,.level-dd-ewcode").hide().stop().animate({ right: "55px" }, 200, function () {
                    $(this).parent(".level-dl").removeClass("level-hover");
                });
                $(this).removeClass("level-hover");
                $(this).children(".level-dd").hide().stop().animate({ right: "55px" }, 200);
            });

            //购物车点击;
            $("#mycart>.level-dt").click(function () {
                if ($("#mycart").hasClass("level-hover")) {
                    $("#mycart>.level-dd").hide().stop().animate({ right: "55px" }, 200, function () {
                        $("#mycart").removeClass("level-hover");
                    });
                } else {
                    $("#mycart>.level-dd").show().stop().animate({ right: "31px" }, 200, function () {
                        $("#mycart").addClass("level-hover");
                        initCart(false, bindScrollHeight);
                    });
                    $("#ewcode>.level-dd-ewcode").hide().stop().animate({ right: "55px" }, 0, function () {
                        $("#ewcode").removeClass("level-hover");
                    });
                }
            });

            //判断:当前元素是否是被筛选元素的子元素
            jQuery.fn.isChildOf = function (b) {
                return (this.parents(b).length > 0);
            };
            //判断:当前元素是否是被筛选元素的子元素或者本身
            jQuery.fn.isChildAndSelfOf = function (b) {
                return (this.closest(b).length > 0);
            };

            $(document).click(function (event) {
                var target = event.target;
                if (!$(target).isChildAndSelfOf("#mycart")) {
                    if ($("#mycart").hasClass("level-hover")) {
                        //$("#mycart>.level-dd").hide();
                        $("#mycart>.level-dd").hide().stop().animate({ right: "55px" }, 0, function () {
                            $("#mycart").removeClass("level-hover");
                        });
                    }
                }
                if ($("#ewcode").hasClass("level-hover")) {
                    //二维码取消点击;
                    if ($("#ewcode").hasClass("level-hover")) {
                        $("#ewcode>.level-dd-ewcode").hide().stop().animate({ right: "55px" }, 0, function () {
                            $("#ewcode").removeClass("level-hover");
                        });
                    }
                }
            });

            //二维码点击;
            $("#ewcode>.level-dt").click(function () {
                if ($("#ewcode").hasClass("level-hover")) {
                    $("#ewcode>.level-dd-ewcode").hide().stop().animate({ right: "55px" }, 200, function () {
                        $("#ewcode").removeClass("level-hover");
                    });
                } else {
                    $("#ewcode>.level-dd-ewcode").show().stop().animate({ right: "36px" }, 200, function () {
                        $("#ewcode").addClass("level-hover");
                    });
                    $("#mycart>.level-dd").hide().stop().animate({ right: "55px" }, 200, function () {
                        $("#mycart").removeClass("level-hover");
                    });
                }
            });

            //关闭;
            $(".level-close").click(function () {
                $(this).parents(".level-dd").hide();
            });
            //关闭;
            $("#mycart .level-close").click(function () {
                $(this).parents(".level-dd").hide().stop().animate({ right: "55px" }, 200, function () {
                    $("#mycart").removeClass("level-hover");
                });
            });

            $(".userlogin").click(function () {
                var isLogin = window.UserId;
                if (parseFloat(isLogin) < 1) {
                    ShowblockUI();
                }
            });

            $(window).scroll(function () {
                $("#gototop").unbind("click").click(function () {
                    $("html, body").stop().animate({ scrollTop: 0 }, 400);
                });
            });
        }
    };
    //顶部工具条调用;
    if ($("#site-nav").length > 0) {
        var _data = {};
        var curpageUrl = window.location.hostname;
        var isUrl = ["o.www.muyingzhijia.me",
                     "beta.muyingzhijia.com",
                     "beta.o.muyingzhijia.com",
                     "www.muyingzhijia.com",
                     "o.www.muyingzhijia.com",
                     "item.muyingzhijia.me",
                     "beta.item.muyingzhijia.com",
                     "beta.o.item.muyingzhijia.com",
                     "o.item.muyingzhijia.com",
                     "item.muyingzhijia.com",
                     "haitao.muyingzhijia.me",
                     "beta.haitao.muyingzhijia.com",
                     "haitao.muyingzhijia.com",
                     "t.muyingzhijia.me",
                     "beta.t.muyingzhijia.com",
                     "t.muyingzhijia.com",
                     "i.www.muyingzhijia.com"];
        for (var i in isUrl) {
            var url = isUrl[i];
            if (url == curpageUrl) {//$.trim(url.toLowerCase()) == $.trim(curpageUrl.toLowerCase())
                _data["isShowSplid"] = 1;
            } else {
                continue;
            }
        }

        $.ajax({
            cache: false,
            //url: window.BuyRoot + '/Fragment/HeaderBar',
            url: window.WebApiRoot + '/Fragment/HeaderBar',
            data: _data,
            dataType: 'jsonp',
            success: function (html) {
                if (html) {
                    $("#site-nav").html(html);
                    //window.UserId = parseInt($("#vh_userid").val()||"");
                    //window.UserGuid = $("#vh_Guid").val();
                    //头部是否加载完成
                    window.HeaderBarLoaded = true;
                    bindEvent();
                }
            }
        });
    }
}

var displayLabel = function getDisplayLables() {
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) {
                from += len;
            }
            for (; from < len; from++) {
                if (from in this && this[from] === elt) {
                    return from;
                }
            }
            return -1;
        };
    }

    var displayLables = window.UserLabel;
    if (displayLables == '' && displayLables == null) {
        displayLables = $.cookie("DisplayLabels") || $.cookie("_displaylabelids");
    }
    var lables = [];
    var displayLable = '';
    if (typeof displayLables != "undefined") {
        if (displayLables.indexOf("[") > -1) {
            var splits = displayLables.split(',');
            for (var i = 0; i < splits.length; i++) {
                lables.push(splits[i].replace('[', '').replace(']', ''));
            }
            displayLable = lables.join(",");

        } else {
            displayLable = displayLables.join(",");
        }
    }
    return displayLable;
};

///广告模块取数
function LoadModuleData(moduleCode, callbackfn) {
    $.ajax({
        url: window.WebApiRoot + 'api/GetAdModuleData',
        type: "GET",
        data: { moduleCode: moduleCode },
        dataType: 'jsonp',
        success: function (response) {
            if (response) {
                if (typeof (callbackfn) == "function") {
                    callbackfn(response);
                }
            }
        },
        complete: function () {
            ;
        }
    });
}

//商品总价保留2位有效数字
function totalPriceFormat(price) {
    return price.toFixed(2);
}

//小图替换;
function getJoinProductPicUrl(url) {
    if (url.indexOf("{0}") > -1 && url.indexOf("{type}") <= -1) {
        return url.replace("{0}", "small");
    } else{
        return url.replace("{type}", "60X60");
    }
}

//显示登录框
function ShowblockUI() {
    LoginDialog(function () {
        initCart(false);
    }, true);
}


/**
*   @param cartarea  购物车实体
*   @param type 购物车类型
*   判断购物车是否只有特卖商品
*/
function isHasOnlyTGoods(cartarea, type) {
    var flag = false;
    var arr = [];
    for (var i = 0; i < cartarea.length; i++) {
        if (cartarea[i].CartType != type) {
            flag = true;
            break;
        }
    }
    return flag;
}

/**
*   @param specialId  专场id
*   @param ProductId  商品id
*   @param ProductSkuId  商品id
*   获取特卖商品详情页URL
*/
function returnTmaiGoodsHref(specialId, ProductId, ProductSkuId) {
    var str2 = window.TemaiRoot || window.TmaiRoot || "http://t.muyingzhijia.com/";
    return str2 + "pro/" + specialId + "/" + ProductId + ".html?sku=" + ProductSkuId;
}

/**
*    @param  imgUrl 特卖图片url
*/

function returnTmaiGoodsSmallImg(imgUrl) {
    return imgUrl.replace("source", "s");
}

//获取href参数
function getQueryHrefString(url, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var str = url.split("?")[1];
    var r = str.match(reg);
    if (r != null) return decodeURIComponent(unescape(r[2])); return null;
}

//获取没有参数的url
function getClearUrl(url) {
    if (url.indexOf("?") > -1) {
        return url.split("?")[0];
    } else {
        return url;
    }
}

//获取特卖专场id
function getTmaiSpecialId(url) {
    var href = getClearUrl(url);
    return href.split("show/")[1].replace(".html", "");;
}

/*
 * 调用登陆浮层
 * callback： 回调函数 也可以是 回调url
 * isOverlay：是否显示遮罩
 */
function LoginDialog(callback, isOverlay, returnurl) {
    var url = window.WebRoot + "dialog_login.aspx";
    if (typeof (callback) === "function") {
        window.LoginDialogCallback = callback;
        url += "?callidenid=1&callback=LoginDialogCallback";
    } else if ((callback || "").length > 0) {
        url += "?returnurl=" + encodeURIComponent(callback);
    }

    if (url.indexOf("returnurl") == -1 && typeof (returnurl) !== 'undefined') {
        if (url.indexOf("?") > -1) {
            url += "&returnurl=" + returnurl;
        } else {
            url += "?returnurl=" + returnurl;
        }
    }
    if ($("#dialog_login_box").length <= 0) {
        jQuery("body").append("<div id='dialog_login_box' style='display: block'><iframe id='dialog_login_box_iframe' src='" + url + "' class='iframe' frameborder='0'></iframe></div>");
    }

    easyDialog.open({
        container: 'dialog_login_box',
        isOverlay: isOverlay
    });
    if ((navigator.userAgent.indexOf("MSIE 6.0") > 0)) {
        $("#dialog_login_box iframe").attr("src", url);
    }
}

//层的智能浮动
$.fn.smartFloat = function () {
    var position = function (element) {
        var top = element.position().top, pos = element.css("position");
        $(window).scroll(function () {
            var scrolls = $(this).scrollTop();
            if (scrolls > top) {
                if (window.XMLHttpRequest) {
                    element.css({
                        position: "fixed",
                        top: 0
                    });
                } else {
                    element.css({
                        top: scrolls
                    });
                }
            } else {
                element.css({
                    position: "absolute",
                    top: top
                });
            }
        });
    };
    return $(this).each(function () {
        position($(this));
    });
};

//分屏
$.fn.extend({
    asyncLoadImg: function () {
        var $obj = $(this);
        if (typeof lazyload !== 'undefined') {
            $obj.find("img.lazy").lazyload({
                threshold: 400,
                effect: "fadeIn",
                event: 'sporty,scroll'
            });
            $obj.find("img.lazy").trigger("sporty");
        }
    }
});

window.ag_count_send = function () { };

function bindNewGa() {
    $(".newstats").unbind().bind("click", function () {
        var _this = $(this);
        var href = _this.attr("href");
        var type = "m_activity";
        var position = _this.attr("data-position");
        var id = "";
        if (href.indexOf("t.muyingzhijia.com") > -1) {
            if (href.indexOf("http://t.muyingzhijia.com/show") > -1) {
                type = "t_deal";
                id = getTmaiSpecialId(href);
            } else {
                type = "t_home";
                id = "特卖首页";
            }
        } else if (href.indexOf("Shopping/ActivityPage.aspx") > -1) {
            id = getQueryHrefString(href, "sbjId");
        } else {
            type = "otherType"
            id = "otherId";
        }
        _gaq_push(position, type, id, 1);
    });
}

function getNavGationData() {
    if ($(".ui-category").length > 0) {
        var data = '[' +
                            '{ "CategoryId": 11},' +
                            '{ "CategoryId": 2},' +
                            '{ "CategoryId": 441},' +
                            '{ "CategoryId": 442},' +
                            '{ "CategoryId": 6},' +
                            '{ "CategoryId": 3},' +
                            '{ "CategoryId": 7},' +
                            '{ "CategoryId": 9},' +
                            '{ "CategoryId": 443}' +
                        ']';
        jQuery.ajax({
            url: window.GoodsApi + "/json/reply/QueryIndexCategorys",
            data: { ParentIds: data },
            type: "get",
            async: true,
            dataType: 'jsonp',
            success: function (result) {
                if (result.DoFlag) {
                    $.each(result.QueryIndexCategorysDtos, function (i, item) {
                        var html = [];
                        html.push('<div class="ui-cate-left-box" >');
                        $.each(item.GetTwoCategory, function (j, list) {
                            html.push('<dl>');
                            html.push('<dt><a href="' + window.WebRoot + 'Shopping/subcategory.aspx?cateID=' + list.TwoCatetory.IntCateID + '" target="_blank" style="color:' + list.TwoCatetory.TextColor + '">' + list.TwoCatetory.VchCateName + '</a></dt>');
                            html.push('<dd>');
                            $.each(list.TwoCatetory.ThreeCategory, function (k, cate) {
                                if (cate.vchCateUrl != 'undefined' && cate.vchCateUrl != null && cate.vchCateUrl != '') {
                                    html.push('<a href="' + cate.vchCateUrl + '" target="_blank" style="color:"' + cate.TextColor + '>' + cate.VchCateName + '</a>');
                                } else {
                                    html.push('<a href="' + window.WebRoot + 'Shopping/subcategory.aspx?cateID=' + cate.IntCateID + '" target="_blank" style="color:"' + cate.TextColor + '>' + cate.VchCateName + '</a>');
                                }
                                if (k < list.TwoCatetory.ThreeCategory.length - 1) {
                                    html.push('| ');
                                }
                            });
                            html.push('</dd>');
                            html.push('</dl>');
                        });
                        html.push('</div>');
                        $("#ui-cate-left-" + item.IntCateID).html(html.join(""));

                        var html2 = [];
                        html2.push('<div class="ui-brand-list">');
                        if (item.GetTwoBrand != null && item.GetTwoBrand.length > 0) {
                            $.each(item.GetTwoBrand, function (j, list) {
                                html2.push('<a href="' + list.ClickUrl + '" target="_blank" title="' + list.Title + '" >');
                                html2.push('<img src="' + list.PictureUrl + '" alt="' + list.Title + '" />');
                                html2.push('</a>');
                            });
                        }
                        html2.push('</div>');

                        var html3 = [];
                        html3.push('<div class="ui-brand-items">');
                        if (item.GetTwoAdImg != null && item.GetTwoAdImg.length > 0) {
                            $.each(item.GetTwoAdImg, function (j, list) {
                                html3.push('<a href="' + list.ClickUrl + '" target="_blank"  title="' + list.Title + '" >');
                                html3.push('<img src="' + list.PictureUrl + '" alt="' + list.Title + '" />');
                                html3.push('</a>');
                            });
                        }
                        html3.push('</div>');
                        $("#ui-cate-right-" + item.IntCateID).html(html2.join("") + html3.join(""));
                    });
                }
                $("#ui-silder-nav").attr("data-isLoaded", 1);
            }, error: function (XMLHttpResponse) {
                alert("系统繁忙，请稍后！");
            }
        });
    }
}

//防止页面被外网iframe调用
function stopIframe() {
    var url,data;
    try {
        url = "topUrl=" + top.location.href + "&selfUrl=" + window.WebRoot;
        data = {
            "ClientIp": window.ClientIp,
            "Message": "当前页面与父级页面window对象不同",
            "Url": url, // 需编码
            "SystemType": "1",
            "LogBody": "当前页面的url=" + window.WebRoot + ",父级页面的url=" + top.location.href + "",
            "Level": "Error"
        }
    } catch (exp) {
        url = "topUrl=" + window.location.host + "&selfUrl=" + window.WebRoot;
        data = {
            "ClientIp": window.ClientIp,
            "Message": "获取top.location异常",
            "Url": url, // 需编码
            "SystemType": "1",
            "LogBody": "当前页面的url=" + window.WebRoot + ",父级页面的url=",
            "Level": "Error"
        }
    }
    if (top != self) {
        jQuery.ajax({
            url: 'http://bs.api.muyingzhijia.com/logcollection',
            data: data,
            type: 'get',
            dataType: 'jsonp'
        });
    }
}