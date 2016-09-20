//以下站点使用此js;by04.29.2015;
//MallSite;
//Item.MallSite;

$(function () {
    if ($(".ui-category-list").length > 0) {
        $(".ui-category-list").hover(function () {
            $(this).addClass("ui-category-list-hover");
        }, function () {
            $(this).removeClass("ui-category-list-hover");
        });
    };


    if ($("#ui-new").length > 0) {
        var myscroll = setInterval('autoScroll("#ui-new")', 3000)
        $("#ui-new").hover(function () { clearInterval(myscroll); }, function () { myscroll = setInterval('autoScroll("#ui-new")', 3000) });
    }




    if ($("#shoppingCar-box").length > 0) {
        $("#shoppingCar-box").unbind().bind({
            mouseenter: function (e) {
                initCart(false);
                $("#shoppingCar-box dd").show();
                if ($("#cart-slidebar").length > 0) {
                    $("#cart-slidebar").hide();
                }
            },
            mouseleave: function (e) {
                $("#shoppingCar-box dd").hide();
            }
        });
    }
    //页面加载时加载购物车
    //initCart(false);
    //site-nav切换;
    $("#menu-nav-container>li").hover(function () {
        var $this = $(this).index();
        $(this).children(".category-sub-pannel").show();
        $(this).removeClass().addClass("menu-nav-hover");
        $(".icon-arrow").eq($this).hide();
    }, function () {
        $(this).children(".category-sub-pannel").hide();
        $(this).removeClass();
        $(".icon-arrow").show();
    });

    //本周热点浮层;
    if ($("#hot-weekend-title").length > 0) {
        $("#hot-weekend-title").toggle(function () {
            $("#hot-weekend-box").stop().slideUp(150, function () {
                $(this).hide();
                $("#hot-weekend-title").removeClass("hot-weekend-title-hover");
            });
        }, function () {
            $("#hot-weekend-box").stop().slideDown(100, function () {
                $(this).show();
                $("#hot-weekend-title").addClass("hot-weekend-title-hover");
            });
        });
    }
    HeaderEvent.Head_keydown();

});

var isshow = false;
var HeaderEvent = {
    SeachKey: function () {
        //#region 获取搜索列表对象
        var getSearchList = function () {
            if ($("#keyword_list").length <= 0) {
                var klistTemplate = ['<ul class="keyword-search" id="keyword_list"></ul>'].join('');
                $("#s-combobox").append(klistTemplate);
            }
            return $("#keyword_list");
        };
        //#endregion

        //#region 绑定数据到元素
        var bindSearchList = function ($this, data) {

            var keyword = $this.val();
            var searchList = getSearchList();
            var listItem = [];
            if (typeof (data) != 'undefined' && typeof (data.klist) != 'undefined' && (data.klist instanceof Array)) {
                $.each(data.klist, function (index, item) {
                    listItem.push(['<li class="search-item"><a href="javascript:;" ><div class="search-item-l" data-key="', item.KeyWords, '">', item.KeyWords, '</div>', '<div class="search-item-r">约', item.Count, '个商品</div>', '</a></li>'].join(''));
                });
            }
            var displayKeyWords = (keyword + "").length >= 15
                ? keyword.substring(0, 13) + "..."
                : keyword;
            if ((keyword + "").length > 0) {
                listItem.push(['<li class="search-item"><a href="javascript:;" ><div data-key="', keyword, '" class="search-item-l">搜索“', displayKeyWords, '”关键字</div>', '</a></li>'].join(''));
            }
            searchList.html(listItem.join(''));
            //searchList.css({
            //    top: $this.height() + 11,
            //    left: $this.offset().left-3,
            //    width: $this.parent().width()
            //});
            searchList.find(".search-item > a").unbind().bind("click", function () {
                canSearch = false;
                $this.val($(this).find(".search-item-l").attr("data-key"));
                canSearch = true;
                $("#btnSearch").click();
                searchList.slideUp(200);
            }).bind("mouseover", function () {
                $(this).parents("ul").find("li.search-item-hover").removeClass("search-item-hover");
            });
            searchList.slideDown(200);
        };
        //#endregion
        var searchCache = {};
        var canSearch = true;
        $("#txSearchCondition").focus(function () {
            if ($(this).val().length > 0) {
                getSearchList().slideDown(200);
            }
        }).blur(function () {
            getSearchList().slideUp(200);
        }).bind("keyup propertychange", function (e) {
            var $this = $(this);
            var keyword = $.trim($this.val());
            var searchList = getSearchList();
            if (e.type === "keyup") {
                var thisSelected = searchList.find("li.search-item-hover");
                if (e.keyCode == 38 || e.keyCode == 40) {
                    searchList.find("li").removeClass("search-item-hover");
                    var targetEl = null;
                    if (searchList.find("li").length > 1) {

                        if (thisSelected.length > 0) {
                            if (e.keyCode === 38) {
                                //UP
                                targetEl = thisSelected.prev();
                            } else if (e.keyCode === 40) {
                                //DOWN
                                targetEl = thisSelected.next();
                            }

                        } else {
                            targetEl = searchList.find("li").eq(0);
                        }

                    } else if (searchList.find("li").length > 0) {
                        targetEl = searchList.find("li").eq(0);
                    } else {

                    }
                    if (targetEl.length > 0) {
                        $this.val(targetEl.find("div.search-item-l").attr("data-key"));
                        targetEl.addClass("search-item-hover");
                    }
                    return;
                } else if (e.keyCode === 23) {
                    return;
                }
            }
            if (canSearch && keyword.length >= 1) {

                if (typeof (window.searchTimeOut) != "undefined") {
                    clearTimeout(window.searchTimeOut);
                }

                window.searchTimeOut = setTimeout(function () {
                    if (canSearch && keyword.length >= 1) {

                        if (keyword in searchCache) {
                            bindSearchList($this, searchCache[keyword]);
                        } else {

                            canSearch = false;
                            $.ajax({
                                url: window.WebRoot + "/ajax",
                                type: 'GET',
                                dataType: 'jsonp',
                                data: {
                                    method: 'GetKeyWordStatistics',
                                    k: keyword,
                                    pagesize: 8,
                                    pageindex: 1
                                },
                                success: function (data) {

                                    searchCache[keyword] = data;
                                    bindSearchList($this, data);
                                    canSearch = true;

                                }
                            });
                        }
                    }
                }, 300);

            } else {
                searchList.slideUp(200);
            }
        });
    },
    ClickBtn: function () {
        var searstr = $.trim($("#txSearchCondition").val());
        if (searstr == "" || searstr == "请输入商品") {
            searstr = "";
            return false;
        }

        //window.location.href = window.Search + '?condition=' + encodeURIComponent(searstr.replace(/^\s+|\s+$/g, ""));
        setTimeout(function () {
            window.location.href = window.Search + '?condition=' + encodeURIComponent(searstr.replace(/^\s+|\s+$/g, "")) + "&IsClick=true";
        }, 10);
        //if (window.event)
        //    window.event.returnValue = false;
        //else
        //    event.preventDefault();
    },
    Head_keydown: function () {

        //输入框
        $("#txSearchCondition").focus(function (event) {
            $(".s-combobox-placeholder").hide();
        }).blur(function (event) {
            if ($(this).val() == "") {
                $(".s-combobox-placeholder").show();
            }
        });

        document.onkeydown = function (e) {
            if (!e) { e = window.event; }
            if ((e.keyCode || e.which) == 13) {
                if (document.activeElement.id == "txSearchCondition") {
                    e.returnValue = false;
                    HeaderEvent.ClickBtn();
                }
            }
        }
        $("#btnSearch").click(function () { HeaderEvent.ClickBtn(); });
        HeaderEvent.SeachKey();
    }
};


function autoScroll(obj) {
    $(obj).find("ul:first").animate({
        marginTop: "-35px"
    }, 500, function () {
        $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);
    });
}
