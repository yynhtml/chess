//以下站点使用此js;by04.29.2015;
//MallSite;
//Item.MallSite;
//Haitao.MallSite;

var User_Id = function () {
    return window.UserId;
};
var User_Guid = function () {
    return window.UserGuid;
};

window.PageInits.push(function initPage() {
    initCart(false);
});

//$.cookie("DisplayLabels") || $.cookie("_displaylabelids")
function initCart(isLoading, fun) {
    var _data = {
        "UserId": User_Id(),
        "Guid": User_Guid(),
        "DisplayLabel": displayLabel(),
        "SourceTypeSysNo": 1,
        "AreaSysNo": 100,
        "ChannelID": 102,
        "ExtensionSysNo": $.cookie("ExtensionSysNo") || ''
    };
    jQuery.ajax({
        url: window.BuyApiRoot + 'QueryShoppingCartPocket',
        type: "GET",
        cache: false,
        async: true,
        data: _data,
        dataType: 'jsonp',
        success: function (result) {
            if ($("#cartListCount").length > 0) {
                $("#cartListCount").text(result.BuyTotalCount);
            }
            if ($("#slidebar").length > 0) {
                if (result.DoFlag == true) {
                    $("#mayLike").hide();
                } else {
                    $("#mayLike").show();
                }
                $("#cartSlideNum").text("（" + result.BuyTotalCount + "）");
            }
            updateCart(result, isLoading, fun);
        }, error: function (XMLHttpResponse) {
            alert("系统繁忙，请稍后！");
        }
    });
}
/**
 * 购物车在执行更改数量时调用的js模板
 * @param result    返回json格式数据
 */
function updateCart(result, isLoading, fun) {
    if ($("#shoppingCar-box").length > 0) {
        var result1 = TrimPath.processDOMTemplate("car3_area_list", result);
        document.getElementById("shoppingCar-box-container").innerHTML = result1;
    }
    if ($("#slidebar").length > 0) {
        var result2 = TrimPath.processDOMTemplate("slideBarCart", result);
        document.getElementById("slideBarCart-box").innerHTML = result2;
    }
    if (typeof fun === "function" && fun != null) {
        fun();
    }
    if (isLoading) {
        if ($("#shoppingCar-box>dd").length > 0) {
            $("#shoppingCar-box>dd").show();
        }
    }
    //绑定数据成功后，绑定各种点击事件
    initClick();
}

//绑定各种操作事件
function initClick() {
    //删除商品
    if ($("[id^='deleteItem_']").length > 0) {
        $("[id^='deleteItem_']").unbind().bind("click", function () {
            var obj = $(this);
            var param = obj.attr("id");
            var arr = param.split("_");
            var ShopCartId = arr[1];
            var ProductId = arr[2];
            var CartType = arr[3];
            deleteItemFromShoppingCart(ShopCartId, ProductId, CartType, true);
        });
    }
    if ($("[id^='slideCartDeleteItem_']").length > 0) {
        $("[id^='slideCartDeleteItem_']").unbind().bind("click", function () {
            var obj = $(this);
            var param = obj.attr("id");
            var arr = param.split("_");
            var ShopCartId = arr[1];
            var ProductId = arr[2];
            var CartType = arr[3];
            deleteItemFromShoppingCart(ShopCartId, ProductId, CartType, false, bindScrollHeight);
        });
    }
    if ($("#shoppingCar-box-container").length > 0) {
        $("#shoppingCar-box-container").unbind().bind({
            mouseenter: function (e) {
                e.stopPropagation();
                e.preventDefault();
            }
        });
    }
}

/**
 *  删除商品
 *  @param ShopCartId 购物车Id
 *  @param ProductId 促销Id
 *  @param CartType 购物车类型 1 or 2
 *
 *  清空购物车必须传
 *  UserId, Guid
 */
function deleteItemFromShoppingCart(ShopCartId, ProductId, CartType, isLoading, fun) {
    var _data = {
        "UserId": User_Id(),
        "Guid": User_Guid(),
        "ShopCartId": ShopCartId,
        "ShopCartType": CartType,
        "IsClear": false,
        "DisplayLabel": displayLabel(),
        "SourceTypeSysNo": window.SourceTypeSysNo,
        "AreaSysNo": 0,
        "ChannelID": 0,
        "ExtensionSysNo": $.cookie("ExtensionSysNo") || ''
    };
    jQuery.ajax({
        url: window.BuyApiRoot + 'DeleteItemCart',
        type: "GET",
        async: true,
        data: _data,
        dataType: 'jsonp',
        success: function (result) {
            if (result.DoFlag) {
                if ($("#slidebar").length > 0) {
                    initCart(isLoading, fun);
                } else {
                    initCart(isLoading);
                }
            } else {
                alert("删除失败");
            }
        }, error: function (XMLHttpResponse) {
            alert("系统繁忙，请稍后！");
        }
    });
}

//动态改变侧边栏购物车滚动条高度
function bindScrollHeight() {
    var windowHeight = $(window).height();
    var scroll_viewport_cart = windowHeight - $(".cart-level-t").height();
    var windowHeight = $(window).height();
    var scroll_viewport_like = windowHeight - 120 - $("#slideBarCart-box").height();
    if ($("#scroll_viewport_cart").length > 0) {
        $("#scroll_viewport_cart").css("height", scroll_viewport_cart);
        $("#cart-level-plist").tinyscrollbar();
    }
    $("#scroll_viewport_like").css("height", scroll_viewport_like);
    $("#cart-level-tj-c").tinyscrollbar();
}

//右侧导航条购物车
function Module_Cart_tj_01() {
    LoadModuleData("Cart-tj-01", function (result) {
        if (result.DataList) {
            for (var i = 0,html = []; i < result.DataList.length; i++) {
                var model = result.DataList[i];
                if (model.LinkUrl != null) {
                    html.push('<a class="stats" href="' + model.LinkUrl + '" data-position="CartTjImg_' + (i + 1) + '" title="' + model.Title + '" style="display: block;"><img src="' + model.SmallPic + '" alt="' + model.Title + '" title="' + model.Title + '" width="230" height="134" /></a>');
                } else {
                    html.push('<a  href="' + model.LinkUrl + '" data-position="CartTjImg_' + (i + 1) + '" title="' + model.Title + '" style="display: block;"><img src="' + model.SmallPic + '" alt="' + model.Title + '" title="' + model.Title + '" width="230" height="134" /></a>');
                }
            }
            html = html.join("");
            $("#CartTjImg").html(html);
        }
    });
}