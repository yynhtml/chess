//专题JS


$(function () {

});

//添加优惠卷
function addCoupon(couponId) {

    if (couponId.length <= 0) {
        return;
    }
    if (window.UserId <= 0) {

        var url = $("#hidUrl").val();
        url = decodeURIComponent(url);
        window.location.href = url.replace('{0}', window.location.href);;
        return;
    }


    $.ajax({
        url: "/ActivePage/AddCoupon?couponIds=" + couponId,
        type: 'Post',
        dataType: "json",
        success: function (result) {
            if (result.DoFlag) {
                easyDialog_open("亲, 优惠券已经成功飘进您的账户中 !");
            } else {
                easyDialog_open(result.DoResult);
            }


        }
    });
}

//加载手风琴效果点击切换
function loadAccordionTabClick(columnId) {
    var titleObj = $("[name='accordTitle-" + columnId + "']");

    $(titleObj).unbind().click(function () {
        titleObj.css("background", "#adadad");

        var obj = $(this);
        var foreColor = obj.attr("data-bgcolor");//前景颜色
        var id = obj.attr("data-id");//ID

        obj.css("background", foreColor);

        var productObj = $("[name='accordProduct-" + columnId + "']");
        productObj.removeClass("secListIn");

        var tempProduct = $("#accordProduct-" + columnId + "-" + id + "");
        tempProduct.addClass("secListIn");
    });
}

/*
    加载秒杀栏目表格切换
    columnId:栏目ID
*/
function loadSeckillTab(columnId) {

    var list = $("#promotion_" + columnId + " .secSkillA-main .secList-menu li");
    list.unbind().bind("click", function () {
        var obj = $(this);
        var promId = obj.attr("data-promId");

        list.removeClass("tabin");
        obj.addClass("tabin");

        $("[name='divSeckill_" + columnId + "']").removeClass("secListIn");
        $("#divSeckillProm_" + promId).addClass("secListIn");
    });

}

//弹出框方法
function easyDialog_open(msg) {
    $(document.body).append("<div class='overlay'></div>");

    $("#msgId").html(msg);
    var $Dialog = $(".confirmDialog");
    var sWidth = $Dialog.width();
    var sHeight = $Dialog.height();
    $Dialog.css({
        "margin-left": -sWidth / 2,
        "margin-top": -sHeight / 2
    });
    $Dialog.removeClass("transform_hide").addClass("transform_show");
    $(".Dialog-colseBtn, .confirmBtn a").click(function () {
        var log = $(".confirmDialog");
        log.removeClass("transform_show").addClass("transform_hide");
        $(".overlay").hide();
        return false;
    });
}

//加载公用商品列表
function loadCommonProduct(name, html) {

    if (name.length > 0 && html.length > 0) {
        $.ajax({
            url: "/ActivePage/ProductCommon",
            data: { "productHtml": html },
            dataType: 'html',
            type: 'POST',
            success: function (res) {
                $("#" + name).html(res);
            }
        });
    }
}

/*
    加载促销商品价格
    productIdStr:商品ID字符串
    promtionStr:商品促销ID字符串
    columnId:栏目ID
*/
function loadPromProductPrice(productIdStr, promtionStr, columnId) {

    var name = "-" + columnId + "-";

    var p = [];
    var prom = [];


    if (productIdStr.length > 0) {

        var productObj = productIdStr.split(",");
        for (var i = 0; i < productObj.length ; i++) {
            p.push(productObj[i]);

            if (p.length >= 50) {
                getPromtionPrice(p, prom, name);
                p = [];
            }
        }
        if (p.length > 0) {
            getPromtionPrice(p, prom, name);
        }

    } else {
        var promtionObj = promtionStr.split(",");
        for (var j = 0; j < promtionObj.length ; j++) {
            prom.push(promtionObj[j]);

            if (prom.length >= 20) {
                getPromtionPrice(p, prom, name);
                prom = [];
            }
        }
        if (prom.length > 0) {
            getPromtionPrice(p, prom, name);
        }
    }
}


//获取促销价格
function getPromtionPrice(p, prom, name) {
    var dataParameter = {};

    if (p.length > 0) {
        dataParameter =
        {
            "ProductIdList": p.join(","),
            "IsShowPromotion": "false",
            "UserId": window.UserId,
            "Guid": window.UserGuid,
            "DisplayLabel": window.UserLabel,
            "SourceTypeSysNo": window.SourceTypeSysNo,
            "AreaSysNo": window.AreaId,
            "ChannelID": window.ChannelID,
            "Ckid": 0
        };

    } else {
        dataParameter =
          {
              "ChannelProductList": prom.join(","),
              "ProductIdList": "",
              "IsShowPromotion": "false",
              "UserId": window.UserId,
              "Guid": window.UserGuid,
              "DisplayLabel": window.UserLabel,
              "SourceTypeSysNo": window.SourceTypeSysNo,
              "AreaSysNo": window.AreaId,
              "ChannelID": window.ChannelID,
              "Ckid": 0
          };

    }

    $.ajax({
        url: window.PromotionUrl + 'QueryPromPriceByProdId',
        async: true,
        type: "GET",
        data: dataParameter,
        dataType: 'jsonp',
        jsonp: "callback",
        success: function (response) {
            if (response.DoFlag == true && response.PromPriceList.length > 0) {
                for (var i = 0; i < response.PromPriceList.length; i++) {
                    var item = response.PromPriceList[i];
                    
                    var productId = item.ProductId;
                    var productPrice = item.PromPriceShow.toFixed(2);
                    var memo = item.ProductMemo;

                    var tempName = name + productId;

                    var buy = $("[name='buy" + tempName + "']");//购买图片

                    var goumai = buy.attr("data-goumai");//购买图片
                    var quehuo = buy.attr("data-quehuo");//缺货图片
                    
                    var tipObj = $("[name='tip" + tempName + "']");//缺货

                    var objMemo = $("[name='memo" + tempName + "']");//促销描述
                    objMemo.html(memo);

                    var objPrice = $("[name='price" + tempName + "']");//价格
                    objPrice.html(productPrice);

                    //库存
                    if (item.IsFlashBuy == false && item.Stock <= 0) {
                        tipObj.removeClass("hide"); //缺货
                        buy.attr("style", "background: url(" + quehuo + ") repeat");
                    } else {
                        tipObj.addClass("hide"); //有货
                        buy.attr("style", "background: url(" + goumai + ") repeat");
                    }
                }
            }
        }
    });
}


/*
    加载秒杀商品
    promIdStr:促销ID+标题以逗号分隔 123_09:00,
    labelImg:角标图片
    productLabelStr:商品标题字符串 商品ID+促销ID+描述标签 123_555_今日特价,
    columnId:栏目ID
*/
function loadSeckillProduct(promIdStr, labelImg, productLabelStr, columnId) {
    if (promIdStr.length > 0) {

        $.ajax({
            url: "/ActivePage/ProductSeckillIndex",
            data: {
                "promIdStr": promIdStr,
                "labelImg": labelImg,
                "productLabelStr": productLabelStr,
                "columnId": columnId
            },
            dataType: 'html',
            type: 'Get',
            success: function (res) {
                $("#promotion_" + columnId).html(res);
                $(".lazy").scrollLoading();
            }
        });
    }
}
