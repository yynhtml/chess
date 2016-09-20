//以下站点使用此js;by04.29.2015;
//Item.MallSite;

//var startTime;//= "2014-12-21 09:20:33";
var endTime;//= ("2015-12-21 09:20:33");
var suiteBuy;
var suiteCount;
var systemTime;
var Stock;
var startDate;
var hotPromSysNo;
var productTypeList;
var FromSaleQty;
var IsSkill = 0;
var promotionType = 0;

window.PageInits.push(function initPage() {
    Parameter();
});

$(document).ready(function () {

    GetPromotion();

    //GA  统计代码
    $(".scrollLoading").scrollLoading();
    $("#A_500 a .stats,#banner_990_div a .stats, a.stats").unbind("click").click(function () {
        var _this = $(this);
        var href = _this.attr("href");
        var position = _this.attr("data-position");
        var page = window.location.href;

        _gaq_push(decodeURIComponent(page), position, decodeURIComponent(href), 1);
    });

    //全部咨询延迟加载
    $("#Noquestion").scrollLoading({ callback: getUserReferPageCopy });
    //买家映像延迟加载
    $("#userGoodsTagId").scrollLoading({ callback: _userCommentCopy });
    //左侧广告位延迟加载
    $("#rank_product_name").scrollLoading({ callback: GetDynamicAdvertis });
    $("#A_505").scrollLoading({ callback: GetDynamicAdvertis });

    $("#NogoodsPrice").scrollLoading({
        callback: function () {
            $.updateGoodsProm($("#NogoodsPrice"));
        }
    });

    //调用促销URL带参数
    //  $("#QueryPromInfosByProductId").scrollLoading({ callback: GetPromotion });

    // GetPromotion();
    //加入购物车数据加法
    $("#plus").click(function () {
        __selectBuyCount(0, $("#productStock"));
    });

    //加入购物车数量减法
    $("#minus").click(function () {
        __selectBuyCount(1, $("#productStock"));
    });

    //输入数量判断
    $("#txtqyt").keyup(function () {
        var reg_keleyi_com = /^[1-9]\d*$/;
        if (reg_keleyi_com.test($("#txtqyt").val())) {
            $("#amountbeyond").hide();
        } else {
            $("#txtqyt").val("1");
        }
    });

    $("#txtqyt").blur(function () {
        $StockCount = $("#productStock");
        var txtqyt = $("#txtqyt").val();
        var stockCount = $StockCount.val();
        if (eval(txtqyt) > eval(stockCount)) {
            $("#amountbeyond").show();
        } else {
            $("#amountbeyond").hide();
        }
    });

    //点击加入购物车,不区分用户是否登录   
    $("#jCarbtn1,#joinPurchase").click(function () {
        var thisClass = $("#jCarbtn1");
        if (thisClass.hasClass("loading-Btn") == true) {
            return;
        }
        var pramaterId = new Parameter();
        var txqyt = $("#txtqyt").val();
        var Stock = $("#productStock").val();
        var hidPromotionId = $("#hidPromotionId").val();
        var hidProductType = $("#hidProductType").val();

        if (eval(txqyt) <= eval(Stock)) {
            innertShopCart(pramaterId.ProductId, hidProductType, hidPromotionId, txqyt);
        }

    });

    //购买组合
    $("#buy_suitRQ").click(function () {
        if (window.suiteBuy != '' && window.suiteBuy != null) {
            innertShopCart(window.suiteBuy, window.productTypeList, window.hotPromSysNo, window.suiteCount);
        }
        else {
            var pramaterId = new Parameter();
            var txqyt = $("#txtqyt").val();
            var Stock = $("#productStock").val();
            var hidPromotionId = $("#hidPromotionId").val();
            var hidProductType = $("#hidProductType").val();
            if (eval(txqyt) <= eval(Stock)) {
                innertShopCart(pramaterId.ProductId, hidProductType, hidPromotionId, txqyt);
            }
        }
    });

    $("change_num_box width150,#PopularPlus").live("click", function () {
        var iC = parseFloat(jQuery(this).attr("tog"));

        var normalStock = parseInt(jQuery(this).attr("stock"));
        var qtysCou = $("#popularity" + iC).val();
        qtysCou++;
        if (eval(normalStock) <= qtysCou) {
            qtysCou = normalStock;
        }
        $("#popularity" + iC).val(qtysCou);
        suiteRQList();
    });

    $("change_num_box width150,#PopularMinus").live("click", function () {
        var iC = parseFloat(jQuery(this).attr("tog"));
        var qtysCou = $("#popularity" + iC).val();
        qtysCou--;
        if (qtysCou < 1) {
            qtysCou = 1;
        }
        $("#popularity" + iC).val(qtysCou);
        suiteRQList();
    });

    $("#submitConsult").live("click", function () {
        var gid = $("#productionId").val();
        if (gid != null && gid != '') {
            var enquiryType = $('#consultTag .checked input[name="radio"]').val();
            var enquiryContent = $.trim($("#enquiryContent").html());
            _btnInsertEnquiry(gid, enquiryType, enquiryContent);
        }
    });

    //回复点击
    $(".praise .btn_reply").live("click", function () {
        var userId = window.UserId;
        if (userId > 0) {
            var task = $(this).attr('id').split("_")[2];
            var commentId = task.substring(0, task.length - 2);
            var type = $(this).attr('id').split("+")[1];

            $("#itemReplyBox_" + commentId + type).css("display", "block");
        } else {
            ShowblockUI();
        }
    });

    //点击回复内容
    $(".reply-btn").live("click", function () {
        var taskContent = $(this).parent().find("input:text");
        var type = taskContent.attr("id").split('_')[1];
        __btnInsertCommentRef(taskContent.data("id"), taskContent.val());
        $("#itemReplyBox_" + taskContent.data("id") + type).css("display", "none");
        taskContent.attr("value", '');

    });

    //点击有用
    $(".praise .prise_1").live("click", function () {
        var userId = window.UserId;
        if (userId > 0) {
            var task = $(this).data('id').split("_")[1];
            var commentId = task.substring(0, task.length - 2);
            var type = task.split("+")[1];
            $.ajax({
                url: window.WebApiRoot + 'Api/GetInsertUserFul',
                async: true,
                type: "GET",
                contentType: "application/json;",
                data: { commentId: commentId },
                dataType: 'jsonp',
                success: function (response) {
                    if (response != '') {
                        var btnUservalue = $.trim($("#userFuller_" + commentId + type).html());
                        if (eval(response) == 1) {
                            var userCount = (++btnUservalue);
                            $.tipsBox({
                                obj: $("#userFuller_" + +commentId + type),
                                str: "+" + userCount,
                                callback: function () {
                                }
                            });
                            $("#userFuller_" + +commentId + type).html(userCount);
                            var id = + +commentId + type;

                        } else if (eval(response) == -200) {
                            __dialogBox("<i class='jumpicon3'></i>亲，评价只能点击一次!", "", ".jumpIn4,#closeTip");
                        } else {
                            __dialogBox("<i class='jumpicon3'></i>亲，请先登录才能点击!", "", ".jumpIn4,#closeTip");
                        }
                    }
                }
            });
        } else {
            ShowblockUI();
        }
    });
});


function _userCommentCopy() {
    _userComment(0, 10, 1);
}

///咨询 
function _btnInsertEnquiry(gid, enquiryType, enquiryConent) {

    if (enquiryConent.length > 200 || enquiryConent.length < 5) {
        __dialogBox("<i class='jumpicon3'></i>咨询内容在5-200个字符之内", "", ".jumpIn4,#closeTip");
    } else {
        $.ajax({
            url: window.WebApiRoot + 'Api/InsertCommentRefer',
            async: true,
            type: "GET",
            contentType: "application/json;",
            data: { gid: gid.trim(), intReferType: enquiryType.trim(), vchContent: enquiryConent.trim() },
            dataType: 'jsonp',
            success: function (response) {
                if (response != '') {
                    var numberValue = response.split('|')[0];
                    var messgageBox = response.split('|')[1];

                    if (eval(messgageBox) == -3) {
                        __dialogBox("<i class='jumpicon3'></i>请过3分钟后再提问!", "", ".jumpIn4,#closeTip");
                    } else {
                        if (eval(numberValue) == -1) {

                            __dialogBox("<i class='jumpicon3'></i>您未登录，请先登录操作!", "", ".jumpIn4,#closeTip");

                        } else if (eval(numberValue) == 1) {

                            __dialogBox("<i class='jumpicon1'></i>咨询提交成功!", "请等待工作人员回复!", ".jumpIn4,#closeTip");

                        } else if (eval(numberValue) == 0) {

                            __dialogBox("<i class='jumpicon3'></i>评论内容包含敏感词汇，请使用文明用语!", "", ".jumpIn4,#closeTip");

                        } else {

                            __dialogBox("<i class='jumpicon3'></i>咨询提交失败!", "请重新提交，谢谢！", ".jumpIn4,#closeTip");

                        }
                    }
                }
            }
        });
    }
};

//到货通知,暂无需要
function _btnInsertArrivalNotice(gid, webType) {
    $.ajax({
        url: window.WebApiRoot + 'Api/InsertArrivalNotice',
        async: true,
        type: "POST",
        contentType: "application/json;",
        data: "{gid:" + gid + ",webType:" + webType + "}",
        dataType: 'json',
        success: function (response) {
            if (response != '') {
                var numberValue = response.split('|')[0];
                var messgageBox = response.split('|')[1];
                if (eval(numberValue) == 1) {
                    __dialogBox("<i class='jumpicon1'></i>到货通知提交成功!", messgageBox, ".jumpIn4,#closeTip");
                } else {
                    __dialogBox("<i class='jumpicon3'></i>到货通知提交失败!", "请重新提交，谢谢！", ".jumpIn4,#closeTip");
                }
            }
        }
    });
};

//插入回复评论
function __btnInsertCommentRef(commentid, contentRef) {
    if (contentRef != null && commentid != null) {
        if (contentRef.length < 5 || contentRef.length > 200) {
            __dialogBox("<i class='jumpicon3'></i>回复内容在5-200个字符之内", "", ".jumpIn4,#closeTip");
        } else {
            $.ajax({
                url: window.WebApiRoot + 'Api/InsertReplyComment',
                type: "GET",
                contentType: "application/json;",
                data: { commentId: commentid, replyComment: contentRef },
                dataType: 'jsonp',
                success: function (response) {
                    if (response != null) {

                        switch (eval(response)) {
                            case -1:
                                __dialogBox("<i class='jumpicon3'></i>回复失败!", "您未登录，请先登录操作！", ".jumpIn4,#closeTip"); break;
                            case 1:
                                __dialogBox("<i class='jumpicon1'></i>回复成功!", "回复评论成功！", ".jumpIn4,#closeTip"); break;
                            case 500:
                                __dialogBox("<i class='jumpicon3'></i>回复失败!", "需购买商品才能回复评论！", ".jumpIn4,#closeTip"); break;
                            case 0:
                                __dialogBox("<i class='jumpicon3'></i>回复失败!", "评论内容包含敏感词汇，请使用文明用语！", ".jumpIn4,#closeTip"); break;
                            default:
                                __dialogBox("<i class='jumpicon3'></i>回复失败!", "请重新回复！", ".jumpIn4,#closeTip"); break;
                        }
                        //if (eval(response) == -1) {
                        //    __dialogBox("<i class='jumpicon3'></i>回复失败!", "您未登录，请先登录操作！", ".jumpIn4,#closeTip");

                        //} else if (eval(response) == 1) {
                        //    __dialogBox("<i class='jumpicon1'></i>回复成功!", "回复评论成功！", ".jumpIn4,#closeTip");
                        //} else if (eval(response) == 500) {
                        //    __dialogBox("<i class='jumpicon3'></i>回复失败!", "需购买商品才能回复评论！", ".jumpIn4,#closeTip");
                        //} else {
                        //    __dialogBox("<i class='jumpicon3'></i>回复失败!", "请重新回复！", ".jumpIn4,#closeTip");
                        //}
                    }
                }
            });
        }
    }
}

//公共参数
function Parameter() {
    var parameter = new Object();
    parameter.channel = 102;
    parameter.userId = window.UserId;
    parameter.Guid = window.User_Guid;
    parameter.AreaSysNo = 100; //$("#AreaSysNo").val();
    parameter.Ckid = 21;
    parameter.SourceTypeSysNo = window.SourceTypeSysNo; //用户手机和网站配置
    parameter.ProductId = window.ProductId;//$("#productionId").val();
    parameter.StockCount = $("#productStock").val();
    parameter.VipPrice = $("#vipPrice").val();
    parameter.ProductionCode = $("#productionCode").val();
    parameter.PromSysNo = $("#PromSysNo").val();
    parameter.DisplayLabel = displayLabel();
    parameter.ExtensionSysNo = $.cookie("ExtensionSysNo") || ''; //推广标签
    parameter.webType = $("#webType").val();
    parameter.ZP = 11;
    parameter.ZP_1 = 12;
    parameter.HG = 2;
    parameter.ZHG = 3;
    parameter.MJ = 4;
    parameter.QG = 5;
    parameter.ChannelPromotion = 6;
    parameter.MZ = 7;
    parameter.DDTJ = 8;
    parameter.MS = 9;
    parameter.DefindSG = 100;
    parameter.MZ_1 = 13;

    return parameter;
}


function __selectBuyCount(optionType, maxValue) {

    var $txtQyt = $("#txtqyt");
    var number = maxValue.val();
    var valueBox = $txtQyt.val();
    if (eval(valueBox) < eval(number)) {
        $("#amountbeyond").hide();
    }

    if (optionType == 0) {
        if (eval(valueBox) < 99) {
            valueBox++;
        }
        if (eval(number) <= 0) {
            $(".tb-msg .tb-stop").html("库存不足!");
            $("#amountbeyond").show();
        }
        if (eval(valueBox) >= eval(number)) {
            $(".tb-msg .tb-stop").html("您所填写的商品数量超过库存！");
            $("#amountbeyond").show();

        } else {
            $("#amountbeyond").hide();
        }
    } else {

        valueBox--;
        if (valueBox <= FromSaleQty && FromSaleQty > 1) {
            valueBox = FromSaleQty;
            $(".tb-msg .tb-stop").html("提示 该商品" + FromSaleQty + "件起售!");
            $("#amountbeyond").show();
        } else if (eval(valueBox) < 1) {
            valueBox = 1;
        }
        if (eval(number) <= 0) {
            $(".tb-msg .tb-stop").html("库存不足!");
            $("#amountbeyond").show();
        }
    }

    $txtQyt.val(valueBox);
};

function getHotProduction(promSysNo) {
    if ($("#productStock").val() > 0) {
        var parameter = new Parameter();
        var dataParameter =
        {
            "ProductId": parameter.ProductId,
            "PromSysNo": promSysNo,
            "UserId": parameter.userId,
            "Guid": parameter.Guid,
            "DisplayLabel": parameter.DisplayLabel,
            "SourceTypeSysNo": parameter.SourceTypeSysNo,
            "AreaSysNo": parameter.AreaSysNo,
            "ChannelID": parameter.channel,
            "Ckid": parameter.Ckid,
            "ExtensionSysNo": parameter.ExtensionSysNo
        };
        $.ajax({
            url: window.BuyApiRoot + 'QueryProductByPromAndProd',
            async: true,
            type: "GET",
            data: dataParameter,
            dataType: 'jsonp',
            jsonp: "callback",
            success: function (response) {

                if (response != '' && response != null) {
                    var html = [];
                    var $PromotionBySuit = "";
                    var sum = 0;
                    $.each(response.PromModel.ProductContexts, function (b, items) {
                        sum = sum + items.Stock;
                    });
                    if (eval(sum) > 0) {
                        $.each(response.PromModel.ProductContexts, function (i, items) {
                            if (items.SaleState == true && items.Stock > 0) {
                                $PromotionBySuit = i;
                                //if ($PromotionBySuit < (response.PromModel.ProductContexts.length - 1)) {
                                var imgurl = items.ShowImgUrl.replace("{0}", "normal").replace("{type}", "160X160");
                                html.push("<dl class='hot_01_dl width152 padd9'><dt class='width150'><a href='" + window.ItemRoot + items.ProductId + ".html' target='_blank'>"); //productID
                                html.push("<img src='" + imgurl + "' alt='" + items.ProductName + "' title='" + items.ProductName + "' class='width_bai'/></a>");
                                html.push("<em class='hover_up'><span class='change_num_box width150'>");
                                html.push("<i id='PopularMinus' tog=" + i + " stock=" + items.Stock + ">-</i><input type='text' value='1' maxlength='2' id='popularity" + i + "' name='product_num' class='product_num width100'  /><i id='PopularPlus' stock=" + items.Stock + " tog=" + i + ">+</i></span></em></dt>");
                                html.push("<dd><p class='product_info'><a href='" + window.ItemRoot + items.ProductId + ".html' target='_blank' title='" + items.ProductName + "'>" + items.ProductName + "</a></p>");
                                html.push("<p class='sale_price'><input type='checkbox' name='popularCheck' class='checkbox' tog=" + items.MarketPrice.toFixed(2) + "  value=" + items.PromPriceShow.toFixed(2) + " product =" + items.ProductId + "  typeList=" + items.ProductType + " promid=" + promSysNo + " />促销价:￥" + items.PromPriceShow.toFixed(2) + "<input type='hidden' value=" + items.ProductId + " name='Hots'  id='Hots" + i + "'></p></dd></dl>");
                                //html.push("<div class='product_plus_icon top125'></div>");

                                if ((i + 1) < (response.PromModel.ProductContexts.length)) {
                                    html.push("<div class='product_plus_div height230'><div class='product_plus_icon top97'></div></div>");
                                }
                                //} else {
                                //    html.push("<dl class='hot_01_dl width152 padd9'><dt class='width150'><a href='" + window.ItemRoot + items.ProductId + ".html' target='_blank'>");
                                //    html.push("<img src='" + window.PicRoot + "/product/normal/" + items.ImgUrl + "' alt='" + items.ProductName + "' title='" + items.ProductName + "' class='width_bai'/></a>");
                                //    html.push("<em class='hover_up'><span class='change_num_box width150'>");
                                //    html.push("<i id='PopularMinus' tog=" + i + " stock=" + items.Stock + ">-</i><input type='text' value='1' maxlength='2' id='popularity" + i + "' name='product_num' class='product_num width100' /><i id='PopularPlus' stock=" + items.Stock + " tog=" + i + ">+</i></span></em></dt>");
                                //    html.push("<dd><p class='product_info'><a href='" + window.ItemRoot + items.ProductId + ".html' target='_blank' title='" + items.ProductName + "'>" + items.ProductName + "</a></p>");
                                //    html.push("<p class='sale_price'><input type='checkbox'  name='popularCheck' class='checkbox' tog=" + items.MarketPrice.toFixed(2) + "   value=" + items.PromPriceShow.toFixed(2) + " product =" + items.ProductId + " typeList=" + items.ProductType + "  promid=" + promSysNo + " />促销价:￥" + items.PromPriceShow.toFixed(2) + "<input type='hidden' value=" + items.ProductId + " name='Hots'  id='Hots" + i + "'></p></dd></dl>");
                                //    // html.push("<div class='product_plus_icon top125'></div>");
                                //}

                            }
                        });
                        $("#HotProductAll").html(html.join(""));

                        $("#A_01").show();
                        $("#groupsuitcur").show();
                        $("#groupproductByhot").show();

                        $("#HotProductAll input[name='popularCheck']:checkBox").click(function () {
                            suiteRQList();
                        });
                        //人气套餐，商品搭配部分，超出4个商品，出现横向滚动条，.hot_02_prodcuts>li的宽度改变;
                        var lenDl = ($PromotionBySuit + 1); //$(".hot_02_prodcuts li").children("dl").length;//默认状态下显示不足4个dl,3个+，不出现滚动条；
                        $("#HotProductAll").css({ "width": lenDl * 170 + (lenDl - 1) * 20 });
                        if (lenDl > 4) {
                            $(".hot_02_prodcuts").css({ "overflow-x": "auto" });
                        }
                    }
                } else {
                    $("#groupshow").show();
                    $("#groupshow").addClass("group_suit_li_cur");
                    $("#suitshow").show();
                }
            }
        });
    }
}

//判断商品促销类型
function getproductType(promSysNo) {

    var parameter = new Parameter();
    var dataParameter =
    {
        "ProductId": parameter.ProductId,
        "PromSysNo": promSysNo,
        "UserId": parameter.userId,
        "Guid": parameter.Guid,
        "DisplayLabel": parameter.DisplayLabel,
        "SourceTypeSysNo": parameter.SourceTypeSysNo,
        "AreaSysNo": parameter.AreaSysNo,
        "ChannelID": parameter.channel,
        "Ckid": parameter.Ckid,
        "ExtensionSysNo": parameter.ExtensionSysNo
    };

    //替换价格
    if (promotionType != 1) {
        $.updateSimpleGoodsProm($(".conTopConBox"));
    }

    $.ajax({
        url: window.BuyApiRoot + '/QueryPromInfosByProductId',
        async: true,
        type: "GET",
        data: dataParameter,
        dataType: 'jsonp',
        jsonp: "callback",
        success: function (response) {

            if (response.list != null && response.DoFlag == true) {
                var html = [];
                var htmlMg = [];
                var _html = [];
                var promSysNumber = [];  //存储相关的促销ID
                if ($("#webType").val() == 205 || $("#webType").val() == 39) {
                    $("#summary li .pdt5:first").html("价&nbsp;&nbsp;格");
                } else {
                    $("#summary li .pdt5:first").html(" 促 销 价 ");
                }

                ShowPromotionTitle(response.PromWebSiteUrl, response.PromShortDescription);
                $.each(response.list, function (i, items) {
                    promSysNumber.push(items.PromSysNo);
                    switch (items.PromTypeSysNo) {
                        case parameter.ZP_1: //赠品
                        case parameter.ZP: //赠品     
                            if (IsSkill != 1) {
                                $("#divpromotionInfo .sx_dt").show();
                                getProductGiftChangeList(html, items.PromSysNo);
                            }
                            break;

                        case parameter.HG: //换购
                            if (IsSkill != 1) {
                                $("#divpromotionInfo .sx_dt").show();
                                getProductHGChangeList(_html, items.PromSysNo);
                            }
                            break;

                        case parameter.ZHG: //组合购
                            // getProductUHSuiteList(items.PromSysNo);
                            getHotProduction(items.PromSysNo);
                            break;

                        case parameter.MJ: //满减
                            getProductPromMJ(htmlMg, items.PromSysNo, items.PromWebSiteUrl, items.PromShortDescription);
                            break;

                        case parameter.MZ: //满折
                            getProductPromMZ(htmlMg, items.PromSysNo, items.PromWebSiteUrl, items.PromShortDescription);
                            break;
                        case parameter.MZ_1:
                            getProductPromMZ(htmlMg, items.PromSysNo, items.PromWebSiteUrl, items.PromShortDescription);
                            break;

                        default:
                            //  getProductPromotionList(items.PromSysNo);
                            break;
                    }
                });
                $("#hidPromotionId").val(promSysNumber.join(","));
            }
        }

    });

}

function getProductPromMZ(html, promSysNo, proWebSitUrl, shortDescription) {
    if (proWebSitUrl == null) {
        proWebSitUrl = "";
    }
    html.push('<dl class="salePromotionType"><dt class="dt_icon2"></dt>');
    html.push('<dd> <a href="' + proWebSitUrl + '" title="' + shortDescription + '" class="promDetail color333">' + shortDescription + '</a>');
    html.push('</dd></dl>');
    $("#A_MG_01").html(html.join(""));
}

function getProductPromMJ(html, promSysNo, proWebSitUrl, shortDescription) {

    if (proWebSitUrl == null) {
        proWebSitUrl = "#";
    }
    html.push('<dl class="salePromotionType"><dt class="dt_icon1"></dt>');
    html.push('<dd> <a href="' + proWebSitUrl + '" title="' + shortDescription + '" class="promDetail color333">' + shortDescription + '</a>');
    html.push('</dd></dl>');

    $("#A_MJ_01").html(html.join(""));
}

//TODO:暂时没用到
function getProductUHSuiteList(promSysNo) {
    var parameter = new Parameter();
    var dataParameter =
    {
        "ProductId": parameter.ProductId,
        "PromSysNo": promSysNo,
        "UserId": parameter.userId,
        "Guid": parameter.Guid,
        "DisplayLabel": parameter.DisplayLabel,
        "SourceTypeSysNo": parameter.SourceTypeSysNo,
        "AreaSysNo": parameter.AreaSysNo,
        "ChannelID": parameter.channel,
        "Ckid": parameter.Ckid,
        "ExtensionSysNo": parameter.ExtensionSysNo
    };

    $.ajax({
        url: window.BuyApiRoot + 'QueryProductByPromAndProd',
        async: true,
        type: "GET",
        data: dataParameter,
        dataType: 'jsonp',
        jsonp: "callback",
        success: function (response) {

            var html = [];
            var __TitleHtmlData = [];
            if (response != null || response.DoFlag == true) {
                var vipPrice = 0;
                var YH_markPrice = 0;
                if (response.PromModel.PromTypeSysNo == 3) { //组合购
                    var productCount = response.PromModel.ProductContexts.length;
                    $.each(response.PromModel.ProductContexts, function (i, items) {
                        if (items.SaleState == true) {
                            var imgurl = items.ShowImgUrl.replace("{0}", "normal").replace("{type}", "160X160");
                            vipPrice += parseFloat(items.PromPriceShow.toFixed(2));
                            YH_markPrice += parseFloat(items.MarketPrice.toFixed(2));
                            html.push("<dl class='hot_01_dl width152 padd9'><dt class='width150 height150'>");
                            html.push("<a href='" + window.ItemRoot + items.ProductId + ".html' target='_blank'><img src='" + imgurl + "' alt='" + items.ProductName + "'  class='width_bai' title=" + items.ProductName + " />");
                            html.push('</a></dt><dd><p class="product_info"><a href="' + window.ItemRoot + items.ProductId + '" title="' + items.ProductName + '">' + items.ProductName + '</a></p><p class="sale_price">');
                            html.push('￥' + items.PromPriceShow + '</p></dd></dl>');
                            if ((i + 1) != productCount) {

                                html.push('<div class="product_plus_div height230"><div class="product_plus_icon top97"></div>');
                            }

                            html.push('</div>');
                        }
                    });

                    var markPrice = $("#hotsuitPrice").attr("tog");
                    var menmPriice = $("#hotsuitPrice em").html();
                    var productPrice = (eval(vipPrice) + eval(menmPriice)).toFixed(2);
                    var productMarkPrice = (parseFloat(YH_markPrice) + parseFloat(markPrice));
                    var gapPrice = (parseFloat(productMarkPrice) - parseFloat(productPrice)).toFixed(2);

                    $("#li0suit").html(html.join(""));

                    $("#YH_Num_Price").html('￥' + gapPrice);
                    $("#YH_Num_Red").html('￥' + productPrice);
                    $("#A_01").show();
                    $("#groupshow").show();

                }
                $("#Bnt_YH_Num_Price_Buy").attr("style", "display:none");
                $("#Bnt_chosed_Buy").attr("style", "display:none");
                //优惠套餐，商品搭配部分，超出4个商品，出现横向滚动条，.hot_02_prodcuts>li的宽度改变;
                $("#suit1_produt>li").each(function (i) {
                    var getLiId = $(this).attr("id");
                    var lenDl = $('#' + getLiId).children("dl").length; //默认状态下显示不足4个dl,3个+，不出现滚动条；
                    $(this).css({ "width": lenDl * 170 + (lenDl - 1) * 20 });
                    if (lenDl > 4) {
                        $(".hot_02_prodcuts").css({ "overflow-x": "auto" });
                    }
                    ;
                    var arrli = new Array("一", "二", "三", "四");
                    __TitleHtmlData.push("<li class='wid100'>套餐<em>" + arrli[i] + "</em></li>");
                    $("#suit1").html(__TitleHtmlData.join(""));
                    $("#suit1>li").eq(0).addClass("c-orange");
                    if (lenDl === 0) {
                        $("#suit1>li").eq(i).hide();
                    }

                });
            }
        }
    });
}

function suiteRQList() {
    // var RQ_cCode = "";
    RQ_cOldPri = 0;
    RQ_iCount = 0;
    RQ_MarketPrice = 0;
    var RQ_qtys = 0;
    var RQ_qtysCou = 0;
    window.suiteBuy = '';
    window.suiteCount = '';
    window.productTypeList = '';
    window.hotPromSysNo = '';
    $("#HotProductAll input[name='popularCheck']:checkBox").each(function (i) {

        var $obj = jQuery(this);

        if ($obj.attr('checked')) {

            //RQ_cCode += ("," + jQuery(this).val());
            //&& !isNaN($("#popularity" + (i-1)).val()) == true

            if (!isNaN(parseFloat($obj.val())) == true) {

                var currentParent = $obj.parents("dl");
                RQ_qtysCou = currentParent.find("input[name='product_num']").val();

                //实际价格
                RQ_cOldPri += parseFloat(jQuery(this).val()) * parseFloat(RQ_qtysCou);
                //console.log(RQ_cOldPri);
                //市场价格
                RQ_MarketPrice += parseFloat($(this).attr("tog")) * parseFloat(RQ_qtysCou);

                RQ_qtys += ("," + RQ_qtysCou);
                RQ_iCount += parseFloat(RQ_qtysCou); //已选择数据量

                if (window.suiteBuy == '') {

                    window.suiteBuy = ($obj.attr("product"));
                    window.suiteCount = (RQ_qtysCou);
                    window.productTypeList = $obj.attr("typeList");
                    window.hotPromSysNo = ($obj.attr("promid"));
                } else {
                    window.suiteBuy += ("#" + $obj.attr("product"));
                    window.suiteCount += ("#" + RQ_qtysCou);
                    window.productTypeList += ("#" + $obj.attr("typeList"));
                    window.hotPromSysNo += ("#" + $obj.attr("promid"));
                }



            }
        }
    });

    var mianMarketPrice = (eval(RQ_MarketPrice) + eval(($("#NoSalePriceByHot").attr("tog") * $("#popularity-1").val()))).toFixed(2);
    RQ_iCount = parseFloat(RQ_iCount) + eval($("#popularity-1").val());
    RQ_cOldPri = parseFloat(RQ_cOldPri) + parseFloat($("#NoSalePriceByHot").html() * eval($("#popularity-1").val()));


    var YH_Price = (parseFloat(mianMarketPrice) - RQ_cOldPri.toFixed(2)).toFixed(2);
    if (window.suiteBuy != '' || window.suiteCount != '') {
        window.suiteBuy += ("#" + $("#productionId").val());
        window.suiteCount += ("#" + $("#txtqyt").val());

        window.hotPromSysNo += ("#" + $("#hidPromotionId").val());
        window.productTypeList += ("#" + 1);
    } else {
        window.suiteBuy += ($("#productionId").val());
        window.suiteCount += ($("#txtqyt").val());

        window.hotPromSysNo += ($("#hidPromotionId").val());
        window.productTypeList += (1);
    }
    $("#YH_Price").html("￥" + YH_Price);
    $("#NoHotMemoPrice").html('￥' + RQ_cOldPri.toFixed(2));
    $("#NoHotSelectBuy").html(RQ_iCount);
}

function innertShopCart(productId, productType, promSysNo, quality) {
    try {
        $.ajax({
            url: window.WebApiRoot + 'Api/InsertShopCart',
            async: true,
            type: "GET",
            contentType: "application/json;",
            data: { productId: productId, productType: productType, promSysNo: promSysNo, quantity: quality },
            dataType: 'jsonp',
            success: function (response) {
                if (response != '') {
                    if (response.DoFlag == true) {
                        __dialogBox("<i class='jumpicon1'></i>" + response.DoResult + "", "", ".jumpIn3");
                        initCart(false);
                        var shoppingCartId = 0;
                        if (response.ShopCartId == null) {
                            shoppingCartId = 0;
                        } else {
                            shoppingCartId = response.ShopCartId;
                        }

                        var this_href = window.location.href;
                        var page = window.location.href;
                        var hidPromotionId = $("#hidPromotionId").val();
                        _gaq.push(['_trackEvent', decodeURIComponent(window.location.href), "shoppingCartId_" + shoppingCartId, hidPromotionId, 1]);

                    } else if (response.DoFlag == false) {

                        __dialogBox("<i class='jumpicon3'></i>提示", response.DoResult, ".jumpIn4,#closeTip");

                    } else {
                        __dialogBox("<i class='jumpicon3'></i>提示", response, ".jumpIn4,#closeTip");
                    }
                }
            }
        });

    } catch (e) {

    }
}


function ShowPromotionTitle(url, title) {
    if (url != '') {
        $("#PromShortDescription").html('<a href=' + url + ' class="btn_viewPromotion" title="查看活动详情"> ' + title + '</a>');
    } else {
        $("#PromShortDescription").html(title);
    }
}

function __dialogBox(icon, messgeBox, showState) {
    easyDialog.open
    ({
        header: '温馨提醒',
        container: "addproduct",
        overlay: false,
        drag: false
    });
    var html1 = icon;
    var html2 = messgeBox;
    $(".jumpIn1").html(html1);
    $(".jumpIn2").html(html2);
    $(".jumpIn4 a").hide();
    $("#closeTip").hide();
    $(".jumpIn3").hide();

    $(showState).show();
};

function getUserReferPageCopy() {
    getUserReferPage(-1);
}

function getUserReferPage(intReferType) {

    var productId = $("#productionId").val();
    $.ajax({
        url: window.WebApiRoot + 'Api/GetUserReferPage',
        async: true,
        type: "GET",
        contentType: "application/json;",
        data: { id: productId, intReferType: intReferType },
        dataType: 'jsonp',
        success: function (response) {
            if (response != '' && response != null) {
                var dataHtml = [];
                var dataLength = (response.length - 1);
                $("#NoGoodsAdvostoryCount").html('(' + response.GoodsAdvostoryCount + ')');
                $("#NoGoodsAdvostoryCountBySKU").html('(' + response.AdSKUCount + ')');
                $("#NoGoodsAdvostoryCountByStock").html('(' + response.AdStock + ')');
                $("#NoGoodsAdvostoryCountBypay").html('(' + response.AdPay + ')');
                $("#NoGoodsAdvostoryCountBybill").html('(' + response.AdBill + ')');
                $("#NoGoodsAdvostoryCountAll").html(response.GoodsAdvostoryCount);
                if (response.advistoryList != '' && response.advistoryList != null) {
                    var questionClassName1 = "question_li";
                    var userAdvisory = dataLength;
                    $.each(response.advistoryList, function (i, userAdvisorys) {
                        if (i >= userAdvisory) {

                            questionClassName1 = "question_li nobtmL";
                        }
                        dataHtml.push("<li class='" + questionClassName1 + "'><dl class='userN'><dt>");
                        dataHtml.push("<span class='wid150'>用 &nbsp&nbsp&nbsp&nbsp 户：" + userAdvisorys.UserAdvisoryLeval + "</span> ");
                        dataHtml.push("<span class='wid150'></span> <span class='wid150 fonttime'>" + userAdvisorys.GoodsAdostoryTime + "</span>");
                        dataHtml.push("</dt> <dd> <p class='consult'>咨询内容：<span>" + userAdvisorys.GoodsAdvostoryContect + "</span></p> <dl class='reply'> <dt>专业回复：</dt>");
                        dataHtml.push("<dd>" + userAdvisorys.GoodsAdvostoryRefer + "</dd></dl></dd></dl></li>");
                    });
                } else {
                    dataHtml.push("<li style='padding: 10px 10px 10px 20px;color:#666'>暂无该产品的咨询数据！</li>");
                }
                switch (intReferType) {
                    case 0: $("#NoquestionSKU").html(dataHtml.join("")); break;
                    case 1: $("#NOquestionStock").html(dataHtml.join("")); break;
                    case 2: $("#NoquestionPay").html(dataHtml.join("")); break;
                    case 3: $("#NoquestionBill").html(dataHtml.join("")); break;
                    case 4: $("#NoquestionPromotion").html(dataHtml.join("")); break;
                    default:
                        $("#Noquestion").html(dataHtml.join("")); break;
                }
            }
        }
    });
};

//赠品调用方法
function getProductGiftChangeList(html, promSysNo) {
    var parameter = new Parameter();
    var dataParameter =
    {
        "ProductId": parameter.ProductId,
        "PromSysNo": promSysNo,
        "UserId": parameter.userId,
        "Guid": parameter.Guid,
        "DisplayLabel": parameter.DisplayLabel,
        "SourceTypeSysNo": parameter.SourceTypeSysNo,
        "AreaSysNo": parameter.AreaSysNo,
        "ChannelID": parameter.channel,
        "Ckid": parameter.Ckid,
        "ExtensionSysNo": parameter.ExtensionSysNo
    };
    $.ajax({
        url: window.BuyApiRoot + '/QueryGiftByPromAndProd',
        async: true,
        type: "GET",
        data: dataParameter,
        dataType: 'jsonp',
        jsonp: "callback",
        success: function (response) {

            if (response.DoFlag == true && response.PromList != null) {
                var showPromotionTitle = false;
                var divpromBox = "promBox";
                var folding = "展开查看";
                var unFolding = "收起";
                switch (response.PromList.PromTypeSysNo) {
                    case parameter.ZP_1:
                    case parameter.ZP:
                        ///赠品
                        $.each(response.PromList.ProductContexts, function (i, items) {
                            if (items.SaleState == true) {
                                showPromotionTitle = true;
                            }
                        });

                        if (showPromotionTitle == true) {
                            html.push('<dl class="salePromotionType"><dt class="dt_icon3"></dt>');
                            html.push('<dd><a href="javascript:;" target="_self" title="' + response.PromList.PromShortDescription + '" class="promDetail colorf90">' + response.PromList.PromShortDescription + '</a>');
                            html.push('<div class="sp_act" id="sp_act"><a href="javascript:;" target="_self" class="in colorf90">' + folding + '<i></i></a>');
                            html.push('<a href="javascript:;" target="_self" class="ex hide colorf90">' + unFolding + '<i></i></a></div></dd></dl>');
                            html.push('<div class="' + divpromBox + '" id="giftBoxIn"><ul class="full_gift" id="fullGift">');
                            if (response.PromList.ProductContexts != null) {
                                $.each(response.PromList.ProductContexts, function (a, items) {
                                    if (items.SaleState == true) {
                                        var imgurl = items.ShowImgUrl.replace("{0}", "normal").replace("{type}","160X160");
                                        html.push('<li data-id=' + items.ProductId + ' data-promSysNo="' + response.PromList.PromSysNo + '"  data-productType="' + items.ProductType + '" ><a href="' + window.ItemRoot + items.ProductId + '.html" title="' + items.ProductName + '">');
                                        html.push('<img src=' + imgurl + ' alt="' + items.ProductName + '" title="' + items.ProductName + '"></a>');
                                        html.push('<b class="ongetGift" data-id="' + items.ProductId + '"  data-promSysNo="' + response.PromList.PromSysNo + '"  data-productType="' + items.ProductType + '">领取</b></li>');
                                    }
                                });
                            }
                            html.push('</ul><div class="prom_act"><a class="prom_add" data-index="1"></a><a class="prom_reduce" data-index="1"></a></div></div>');
                        }
                        break;
                }
            }

            $("#giftBox").html(html.join(""));

            if ($.trim($("#giftBox").html()) != null && $.trim($("#giftBox").html()) != '') {
                var giftBox = $("#giftBox").find("div#giftBoxIn").length;
                for (var i = 0; i < giftBox; i++) {
                    if (i == 0) {
                        $("#giftBox").find("div#giftBoxIn").eq(i).attr("class", "promBox");
                    } else {
                        $("#giftBox").find("div#giftBoxIn").eq(i).attr("class", "promBox hide");
                    }
                }
                $("#giftBox").find(".sp_act a:first").html("收起<i></i>");
                $("#giftBox").find(".sp_act a.hide:first").html("展开查看<i></i>");
                $("#shangeGiftBox").find("#shangeGiftBoxIn").attr("class", "promBox hide");
                $("#shangeGiftBox").find(".sp_act a:first").html("展开查看<i></i>");
                $("#shangeGiftBox").find(".sp_act a.hide:first").html("收起<i></i>");

            } else {
                var giftBox = $("#shangeGiftBox").find("div#shangeGiftBoxIn").length;
                for (var i = 0; i < giftBox; i++) {
                    if (i == 0) {
                        $("#shangeGiftBox").find("div#shangeGiftBoxIn").eq(i).attr("class", "promBox");
                    } else {
                        $("#shangeGiftBox").find("div#shangeGiftBoxIn").eq(i).attr("class", "promBox hide");
                    }
                }
                $("#shangeGiftBox").find(".sp_act a:first").html("收起<i></i>");
                $("#shangeGiftBox").find(".sp_act a.hide:first").html("展开查看<i></i>");
            }


            $("#giftBox .prom_add").click(function () {
                var obj = $(this);
                var count = parseInt($(this).attr("data-index"));
                var len = obj.parents(".promBox").find("li").length;
                var page = Math.ceil(len / 6);
                if (count == 1) {
                    obj.parents(".promBox").find(".prom_add").attr("data-index", page);
                    obj.parents(".promBox").find(".prom_reduce").attr("data-index", page);
                    obj.parents(".promBox").find("ul").animate({
                        marginTop: -(page - 1) * 82
                    });
                } else {
                    obj.parents(".promBox").find(".prom_add").attr("data-index", count - 1);
                    obj.parents(".promBox").find(".prom_reduce").attr("data-index", count - 1);
                    obj.parents(".promBox").find("ul").animate({
                        marginTop: -(parseInt($(this).attr("data-index")) - 1) * 82
                    });
                }

            });

            $("#giftBox .prom_reduce").click(function () {
                var obj = $(this);
                var count = parseInt($(this).attr("data-index"));
                var len = obj.parents(".promBox").find("li").length;
                var page = Math.ceil(len / 6);
                if (count == page) {
                    obj.parents(".promBox").find(".prom_add").attr("data-index", 1);
                    obj.parents(".promBox").find(".prom_reduce").attr("data-index", 1);
                    obj.parents(".promBox").children("ul").animate({
                        marginTop: 0
                    });
                } else {
                    obj.parents(".promBox").find(".prom_add").attr("data-index", count + 1);
                    obj.parents(".promBox").find(".prom_reduce").attr("data-index", count + 1);

                    obj.parents(".promBox").find("ul").animate({
                        marginTop: -(parseInt($(this).attr("data-index")) - 1) * 82
                    });
                }
            });
        }
    });
}

//查询换购商品
function getProductHGChangeList(html, promSysNo) {
    var parameter = new Parameter();
    var dataParameter =
    {
        "ProductId": parameter.ProductId,
        "PromSysNo": promSysNo,
        "UserId": parameter.userId,
        "Guid": parameter.Guid,
        "DisplayLabel": parameter.DisplayLabel,
        "SourceTypeSysNo": parameter.SourceTypeSysNo,
        "AreaSysNo": parameter.AreaSysNo,
        "ChannelID": parameter.channel,
        "Ckid": parameter.Ckid,
        "ExtensionSysNo": parameter.ExtensionSysNo
    };
    //换购调用接口
    $.ajax({
        url: window.BuyApiRoot + '/QueryProductByPromAndProd',
        async: true,
        type: "GET",
        data: dataParameter,
        dataType: 'jsonp',
        jsonp: "callback",
        success: function (response) {
            if (response.DoFlag == true && response.PromModel != null) {
                //换购
                var divpromBox = "promBox hide";
                var folding = "展开查看";
                var unFolding = "收起";

                html.push('<dl class="salePromotionType"><dt class="dt_icon4"></dt><dd>');
                html.push('<a href="javascript:;" target="_self" title="' + response.PromModel.PromShortDescription + '"');
                html.push('class="promDetail colorf90">' + response.PromModel.PromShortDescription + '</a>');
                html.push('<div class="sp_act" id="sp_act_change"><a href="javascript:;" target="_self" class="in colorf90">' + folding + '<i></i>');
                html.push('</a><a href="javascript:;" target="_self" class="ex hide colorf90">' + unFolding + '<i></i></a></div></dd></dl>');
                html.push('<div class="' + divpromBox + '" id="shangeGiftBoxIn"><ul class="change_gift" id="shangeGift">');
                if (response.PromModel.ProductContexts != '' && response.PromModel.ProductContexts != null) {
                    $.each(response.PromModel.ProductContexts, function (a, items) {
                        if (items.SaleState == true) {
                            var imgurl = items.ShowImgUrl.replace("{0}", "normal").replace("{type}", "160X160");
                            html.push('<li data-id=' + items.ProductId + ' data-promSysNo=' + response.PromModel.PromSysNo + '>');
                            html.push('<a href="' + window.ItemRoot + items.ProductId + '.html" title="' + items.ProductName + '">');
                            html.push('<img src=' + imgurl + ' alt="' + items.ProductName + '" title="' + items.ProductName + '"></a>');
                            html.push('<b class="ongetGift" data-id="' + items.ProductId + '"  data-promSysNo="' + response.PromModel.PromSysNo + '"');
                            html.push('data-productType="' + items.ProductType + '">￥' + items.PromPriceShow.toFixed(2) + '换购</b></li>');
                        }
                    });
                }
                html.push('</ul><div class="prom_act">');
                html.push('<a class="prom_add" data-index="1"></a><a class="prom_reduce" data-index="1"></a></div></div>');
            }

            $("#shangeGiftBox").html(html.join(""));

            if ($.trim($("#giftBox").html()) != null && $.trim($("#giftBox").html()) != '') {
                var giftBox = $("#giftBox").find("div#giftBoxIn").length;
                for (var i = 0; i < giftBox; i++) {
                    if (i == 0) {
                        $("#giftBox").find("div#giftBoxIn").eq(i).attr("class", "promBox");
                    } else {
                        $("#giftBox").find("div#giftBoxIn").eq(i).attr("class", "promBox hide");
                    }
                }
                $("#giftBox").find(".sp_act a:first").html("收起<i></i>");
                $("#giftBox").find(".sp_act a.hide:first").html("展开查看<i></i>");
                $("#shangeGiftBox").find("#shangeGiftBoxIn").attr("class", "promBox hide");
                $("#shangeGiftBox").find(".sp_act a:first").html("展开查看<i></i>");
                $("#shangeGiftBox").find(".sp_act a.hide:first").html("收起<i></i>");

            } else {
                var giftBox = $("#shangeGiftBox").find("div#shangeGiftBoxIn").length;
                for (var i = 0; i < giftBox; i++) {
                    if (i == 0) {
                        $("#shangeGiftBox").find("div#shangeGiftBoxIn").eq(i).attr("class", "promBox");
                    } else {
                        $("#shangeGiftBox").find("div#shangeGiftBoxIn").eq(i).attr("class", "promBox hide");
                    }
                }
                $("#shangeGiftBox").find(".sp_act a:first").html("收起<i></i>");
                $("#shangeGiftBox").find(".sp_act a.hide:first").html("展开查看<i></i>");
            }

            $("#shangeGiftBox .prom_add").click(function () {
                var obj = $(this);
                var count = parseInt($(this).attr("data-index"));
                var len = obj.parents(".promBox").find("li").length;
                var page = Math.ceil(len / 6);
                if (count == 1) {
                    obj.parents(".promBox").find(".prom_add").attr("data-index", page);
                    obj.parents(".promBox").find(".prom_reduce").attr("data-index", page);
                    obj.parents(".promBox").find("ul").animate({
                        marginTop: -(page - 1) * 82
                    });
                } else {
                    obj.parents(".promBox").find(".prom_add").attr("data-index", count - 1);
                    obj.parents(".promBox").find(".prom_reduce").attr("data-index", count - 1);
                    obj.parents(".promBox").find("ul").animate({
                        marginTop: -(parseInt($(this).attr("data-index")) - 1) * 82
                    });
                }


            });

            $("#shangeGiftBox .prom_reduce").click(function () {

                var obj = $(this);
                var count = parseInt($(this).attr("data-index"));
                var len = obj.parents(".promBox").find("li").length;
                var page = Math.ceil(len / 6);
                if (count == page) {
                    obj.parents(".promBox").find(".prom_add").attr("data-index", 1);
                    obj.parents(".promBox").find(".prom_reduce").attr("data-index", 1);
                    obj.parents(".promBox").children("ul").animate({
                        marginTop: 0
                    });
                } else {
                    obj.parents(".promBox").find(".prom_add").attr("data-index", count + 1);
                    obj.parents(".promBox").find(".prom_reduce").attr("data-index", count + 1);

                    obj.parents(".promBox").find("ul").animate({
                        marginTop: -(parseInt($(this).attr("data-index")) - 1) * 82
                    });
                }

            });

        }
    });
}

//评论
function _userComment(comtype, top, pageNumber) {

    var productId = $("#productionId").val();
    $.ajax({
        url: window.WebApiRoot + 'Api/GetUserComment',
        async: true,
        type: "GET",
        contentType: "application/json;",
        data: { id: productId, top: top, pageNumber: pageNumber, comtype: comtype },
        dataType: 'jsonp',
        success: function (response) {
            if (response != '') {
                var FavorableComment = response.FavorableComment;
                var AverageComment = response.AverageComment;
                var PoorComment = response.PoorComment;

                $("#NoProductCommentAll").html('(' + response.ProductCommentAll + ')');
                $("#NoProductCommentFav").html('(' + response.ProductCommentFav + ')');
                $("#NoproductCommentAvg").html('(' + response.productCommentAvg + ')');
                $("#NoProductCommentPoor").html('(' + response.ProductCommentPoor + ')');
                $("#NoProductCommentHighLight").html('(' + response.ProductCommentHighLight + ')');
                $("#spinpl em").html('(' + response.ProductCommentAll + ')');
                $("#NofirstRate").html("好评率：" + response.FavorableComment + '%');

                _getAnimate($("#NoOfFavorableCommentId"), FavorableComment);
                __getAnimaetLength($("#NOofFavorable"), FavorableComment);
                __getAnimaetLength($("#NOofAverage"), AverageComment);
                __getAnimaetLength($("#NOofPoor"), PoorComment);

                $("#NOofFavorableValue").html("(" + FavorableComment + "%)");
                $("#NOofAverageValue").html("(" + AverageComment + "%)");
                $("#NOofPoorValue").html("(" + PoorComment + "%)");

            }
            var htmlValues = [];
            if (response.UserGoodsTag != '' && response.UserGoodsTag != null) {
                $.each(response.UserGoodsTag, function (i, tags) {
                    htmlValues.push("<q class='comm-tags'><span>" + tags.GoodsTagName + "</span><em>(" + tags.GoodsTagCount + ")</em></q>");
                });
            } else {

                htmlValues.push("<div style='padding: 80px 10px 10px 20px' class='nocommentimg'></div>");
            }

            $("#userGoodsTagId").html(htmlValues.join(""));

            _getPdtComment(0, 10, 1);
        }
    });
}


function __getAnimaetLength(index, value) {
    var $index = index;
    $index.css("width", 0);
    $index.animate({ width: (value / 100) * 100 }, "3000");
};

function _getPdtComment(comtype, top, pageNumber) {

    var productId = $("#productionId").val();
    $.ajax({
        url: window.WebApiRoot + 'Api/GetComment',
        async: true,
        type: "GET",
        data: { id: productId, top: top, pageNumber: pageNumber, comtype: comtype },
        dataType: 'jsonp',
        before: function (e) {
            show(comtype);
        },
        success: function (response) {
            switch (comtype) {
                case 0:
                    _switchType(response, $("#userCommentmainP"), comtype, $("#NoProductCommentAll").html(), top, pageNumber);
                    break;
                case 1:
                    _switchType(response, $("#divgoodCommentmainP"), comtype, $("#NoProductCommentFav").html(), top, pageNumber);
                    break;
                case 2:
                    _switchType(response, $("#divinterCommentmainP"), comtype, $("#NoproductCommentAvg").html(), top, pageNumber);
                    break;
                case 3:
                    _switchType(response, $("#divpoorCommentmainP"), comtype, $("#NoProductCommentPoor").html(), top, pageNumber);
                    break;
                default:
                    _switchType(response, $("#divjinghuaCommentmainP"), comtype, $("#NoProductCommentHighLight").html(), top, pageNumber);
                    break;
            }
        }
    });
}

function show(comtype) {

    switch (comtype) {
        case 0:
            $("#UserCommentPart .loading").show();
            break;
        case 1:
            $("#divgoodcomment .loading").show();
            break;
        case 2:
            $("#divintercomm .loading").show();
            break;
        case 3:
            $("#divpoorcomment .loading").show();
            break;
        default:
            $("#divjinghuacomment .loading").show();
            break;
    }
}

function Hide(comtype) {
    switch (comtype) {
        case 0:
            $("#UserCommentPart .loading").hide();
            break;
        case 1:
            $("#divgoodcomment .loading").hide();
            break;
        case 2:
            $("#divintercomm .loading").hide();
            break;
        case 3:
            $("#divpoorcomment .loading").hide();
            break;
        default:
            $("#divjinghuacomment .loading").hide();
            break;
    }
}

//商品评价分数
function _getAnimate(index, value) {
    var $numOfFavorableComment = index;
    $numOfFavorableComment.html('0<span style="color: #f90; font-size: 12px;">%</span>');
    if (value > 0) {
        $numOfFavorableComment.animateNumber(value, '', '<span style="color: #f90; font-size: 12px;">%</span>');
    }
};

function _switchType(_html, $ControlsName, commentType, rows, top, pageNumber) {

    $ControlsName.html("");
    $ControlsName.html(_html);
    Hide(commentType);
    //分页
    var row = rows.substring(1, rows.length - 1);

    if (row == '' || row == 0) {
        row = 1;
    }
    var pageTotals = parseInt(eval(row) / top);
    if ((eval(row) % top) > 0) {
        pageTotals = pageTotals + 1;
    }
    $.jqPaginator('#pagination2', {
        totalPages: pageTotals,
        visiblePages: 5,
        currentPage: pageNumber,
        prev: '<li class="prev"><a href="javascript:;" target="_self">上一页</a></li>',
        next: '<li class="next"><a href="javascript:;" target="_self">下一页</a></li>',
        page: '<li class="page"><a href="javascript:;" target="_self">{{page}}</a></li>',
        onPageChange: function (pageNumber, type) {
            if (type != 'init') {
                _getPdtComment(commentType, top, pageNumber);
            }
        }
    });
};

function getProductPromotionList(promSysNo) {

    var parameter = new Parameter();
    var dataParameter =
    {
        "ProductId": parameter.ProductId,
        "PromSysNo": promSysNo,
        "UserId": parameter.userId,
        "Guid": parameter.Guid,
        "DisplayLabel": parameter.DisplayLabel,
        "SourceTypeSysNo": parameter.SourceTypeSysNo,
        "AreaSysNo": parameter.AreaSysNo,
        "ChannelID": parameter.channel,
        "Ckid": parameter.Ckid,
        "ExtensionSysNo": parameter.ExtensionSysNo
    };

    $.ajax({
        url: window.BuyApiRoot + '/QueryPromInfoByPromAndProd',
        async: true,
        type: "GET",
        data: dataParameter,
        dataType: 'jsonp',
        jsonp: "callback",
        success: function (response) {
            if (response.DoFlag == true) {
                //当单品促销的时候，有库存缓存的原因，区分替换价格的和库存的状态
                $("#hidSubpromotionType").val(1);
                $("#PromSysNo").val(promSysNo);
                //多少起售
                FromSaleQty = response.FromSaleQty;
                if (FromSaleQty > 1) {
                    $("#saleQty").text("(" + FromSaleQty + "件起售)");
                    $("#txtqyt").val(FromSaleQty);
                }
                var stock = response.Stock;
                window.Stock = stock;
                if (stock > 0 && response.SaleState == true) {
                    $("#jCarbtn1").removeClass().addClass("shopping_car");
                    productRemoveAttr();
                } else {
                    $("#jCarbtn1").removeClass().addClass("product_inform");
                    $("#summary-price .p-price").text('￥' + parseInt($("#vipPrice").val()).toFixed(2));
                    ProductAttr();
                }

                //if (response.PresellDays > 0) {
                //    $("#sendSKUInfo").html("待备货 预计 " + response.PresellDays + " 天后发货");
                //    $("#sendinfo").show();
                //}
                if (response.IsFlashBuy == true) {
                    var price = response.Price;
                    $("#summary li .pdt5:first").html(" 会 员 价 ");
                    $("#summary-price .p-price").html("￥" + price.toFixed(2));
                    $("#hotsuitPrice em").html(price);
                    $("#NoHotMemoPrice").html('￥' + price);
                    $("#NoSalePriceByHot").html(price);
                    $("#productStock").val(response.Stock);
                    if ($("#name h1").text().indexOf("海淘") > -1) {
                        $("#name a").attr("href", window.HaitaoRoot);
                    } else {
                        $("#name a").attr("href", window.TmaiRoot);
                    }
                    $("#bt_activity").show();
                    setProductType(1);
                    setMeidaGA($("#productStock").val(), $("#NoSalePriceByHot").text());
                    if (response.Time > 0) {
                        $("#promotionTitle").html("限时限购，离特卖结束还剩：");
                        remainLimitTime(response.Time);
                    }
                } else {
                    if (response.basePromotion != null && response.basePromotion != '') {
                        var limitTime = "";
                        switch (response.basePromotion.PromTypeSysNo) {
                            case 8://天天特价

                                $("#summary li .pdt5:first").html(" 限 时 价 ");
                                limitTime = "限时限购，离促销结束还剩：";
                                remainLimitTime(response.basePromotion.PromTime);
                                break;

                            case 9: //秒杀
                            case 16: //秒杀
                                IsSkill = 1;
                                $("#summary li .pdt5:first").html(" 秒 杀 价 ");
                                if (response.basePromotion.PromState == 0) {
                                    limitTime = "限时限购，离秒杀结束还剩：";
                                } else {
                                    limitTime = "限时限购，离秒杀开始还剩：";
                                }
                                skillTimes(response.basePromotion.PromTime, response.basePromotion.PromState);
                                break;
                        }
                        if (response.basePromotion.ProductContexts != null && response.basePromotion.ProductContexts.length > 0) {
                            //价格   
                            var promotion = response.basePromotion.ProductContexts[0];
                            promotionType = 1;
                            $("#promotionTitle").html(limitTime);
                            $("#summary-price .p-price").html('￥' + promotion.PromPriceShow.toFixed(2));

                            $("#NoSalePriceByHot").html(promotion.PromPriceShow.toFixed(2));
                            $("#hotsuitPrice em").html(promotion.PromPriceShow.toFixed(2));
                            $("#productStock").val(window.Stock); //总库存
                            $("#PresellStock").val(promotion.PresellCount);
                            //$("#YH_Price").html("￥" + YH_Price);
                            $("#NoHotMemoPrice").html('￥' + promotion.PromPriceShow.toFixed(2));
                            setProductType(promotion.ProductType);
                            setMeidaGA($("#productStock").val(), $("#NoSalePriceByHot").text());
                        }
                    }
                }
                //根据促销类型和商品ID查询所有促销
                getproductType(promSysNo);
            }
        }
    });
}

//获取动态广告
function GetDynamicAdvertis() {
    $.ajax({
        url: window.WebApiRoot + "Api/ResponseDynamicAdvertis",
        async: true,
        type: "GET",
        dataType: "jsonp",
        contentType: "application/json;",
        success: function (response) {
            var html = [];
            var adHtml = [];
            if (response != null && response != '') {
                if (response.A_500 != null && response.A_500.DataList != '' && response.A_500.DataList != null && response.A_500.DataList.length > 0) {
                    $("#A_500").show();
                    $("#A_500").find("[data-url='LinkUrl']").attr("href", response.A_500.DataList[0].LinkUrl);
                    $("#A_500").find("[data-url='LinkUrl'] img").attr("src", response.A_500.DataList[0].SmallPic);
                }

                if (response.A_501_1 != null && response.A_501_1.DataList != '' && response.A_501_1.DataList != null && response.A_501_1.DataList.length > 0) {

                    if (response.A_501_1.DataList != null && response.A_501_1.DataList.length >= 4) {
                        html.push("<li  id='NOhotactive'><a href='javascript:;' target='_self'>热门活动</a></li>");
                        adHtml.push("<li  data-model='A_500_1_1'> <ol class='part3_R_2_ol' data-model='A_500_1'>");
                        $.each(response.A_501_1.DataList, function (i, item) {
                            if (i < 4) {
                                adHtml.push('<li><a href="' + item.LinkUrl + '" class="stats" data-position="hotActivity_' + (i + 1) + '" >');
                                adHtml.push('<img title="' + item.Title + '" src="' + item.SmallPic + '" alt="' + item.Title + '"/></a></li>');
                            }
                        });
                        adHtml.push(" </ol></li>");
                    }
                }

                if (response.A_501_2 != null && response.A_501_2.DataList != '' && response.A_501_2.DataList != null) {

                    if (response.A_501_2.DataList != null && response.A_501_2.DataList.length >= 4) {
                        html.push("<li id='NOhotactive'><a href='javascript:;' target='_self'>品牌活动</a></li>");
                        adHtml.push(" <li  data-model='A_500_2_2'><ol class='part3_R_2_ol' data-model='A_500_2'>");
                        $.each(response.A_501_2.DataList, function (i, item) {
                            if (i < 4) {
                                adHtml.push('<li><a href="' + item.LinkUrl + '" class="stats" data-position="brandActivity_' + (i + 1) + '">');
                                adHtml.push('<img title="' + item.Title + '" src="' + item.SmallPic + '" alt="' + item.Title + '"/></a></li>');
                            }
                        });
                        adHtml.push(" </ol></li>");
                    }
                }

                if (response.A_501_3 != null && response.A_501_3.DataList != '' && response.A_501_3.DataList != null) {

                    if (response.A_501_3.DataList != null && response.A_501_3.DataList.length >= 4) {
                        html.push("<li id='NOhotcateory'  style='display: list-item;'><a href='javascript:;' target='_self'>品类活动</a></li>");
                        adHtml.push("<li  data-model='A_500_3_3'> <ol class='part3_R_2_ol' data-model='A_500_3'>");
                        $.each(response.A_501_3.DataList, function (i, item) {
                            if (i < 4) {
                                adHtml.push('<li><a href="' + item.LinkUrl + '" class="stats" data-position="categoryActivity_' + (i + 1) + '">');
                                adHtml.push('<img title="' + item.Title + '" src="' + item.SmallPic + '" alt="' + item.Title + '"/></a></li>');
                            }
                        });

                        adHtml.push(" </ol></li>");
                    }
                }


                $("#hot_active").html(html.join(""));
                $("#hot_ad").html(adHtml.join(""));
                $(".stats").unbind("click").click(function () {
                    var _this = $(this);
                    var href = _this.attr("href");
                    var position = _this.attr("data-position");
                    var page = window.location.href;

                    _gaq_push(decodeURIComponent(page), position, decodeURIComponent(href), 1);
                });
                var length = $("#hot_active").find("li").length;

                if (length > 0) {
                    $("#NotabAdvertis").show();
                    for (var i = 0; i < length; i++) {
                        $("#hot_ad > li").removeClass().addClass("hide");
                    }
                    $("#hot_ad").find("li:first").removeClass().addClass("display: list-item;");
                }


                $("#hot_active").find("li:first").removeClass().addClass("group_suit_li_cur");

                if (response.A_502 != null && response.A_502.DataList != null && response.A_502.DataList.length > 0) {
                    //$("#banner_990_div").show();
                    $("#banner_990_div").find("[data-url='LinkUrl']").attr("href", response.A_500.DataList[0].LinkUrl);
                    $("#banner_990_div").find("[data-url='LinkUrl'] img").attr("src", response.A_500.DataList[0].SmallPic);
                }

                if (response.A_503 != null && response.A_503.DataList != null && response.A_503.DataList.length > 0) {
                    var _504html = [];
                    $.each(response.A_503.DataList, function (i, item) {
                        _504html.push('<li><a href="' + item.LinkUrl + '" class="stats" data-position="adBottom_' + i + '">');
                        _504html.push('<img title="' + item.Title + '" src="' + item.SmallPic + '" alt="' + item.Title + '"/></a></li>');
                    });

                    $("#A_505").html(_504html.join(""));
                    $(".stats").unbind("click").click(function () {
                        var _this = $(this);
                        var href = _this.attr("href");
                        var position = _this.attr("data-position");
                        var page = window.location.href;

                        _gaq_push(decodeURIComponent(page), position, decodeURIComponent(href), 1);
                    });
                    $("#A_505").show();
                }
            }
        }
    });
}


function adverterType(html, dataList, $type, $title, $Label) {
    if (dataList != null && dataList.length >= 4) {
        $.each(dataList, function (i, item) {
            if (i < 4) {
                html.push('<li><a href="' + item.LinkUrl + '" title="">');
                html.push('<img title="' + item.Title + '" src="' + item.SmallPic + '" alt="' + item.Title + '"/></a></li>');
            }
        });
        $title.show();
        $Label.show();
    }

    $type.html(html.join(""));
}

//设置商品类型
function setProductType(value) {

    $("#hidProductType").val(value); //产品类型
}

function skillTimes(time, state) {

    //注意：当state 为0 是已开始，但是time == 0 时，是已结束的状态，暂且需要判断
    //需做判断，暂且未执行
    if (state == 0) {//已开始
        if (window.Stock > 0) {
            $("#jCarbtn1").removeClass().addClass("shopping_going");

            jQuery("#jCarbtn1").unbind("click").click(function () {
                var productID = $("#productionId").val();
                var hidPromotionId = $("#hidPromotionId").val();
                var productType = $("#hidProductType").val();
                var qty = $("#productStock").val();
                if (productID != '' && productType != '' && qty > 0) {
                    var qtys = jQuery("#txtqyt").val();
                    innertShopCart(productID, productType, hidPromotionId, qtys);
                }
            });
        } else {
            $("#jCarbtn1").removeClass().addClass("shopping_over");
            $("#jCarbtn1").unbind("click");
        }
    }
    else if (state == 1) {//未开始

        $("#jCarbtn1").removeClass().addClass("shopping_coming");
        $("#jCarbtn1").unbind("click");
    } else { //已结束

        $("#jCarbtn1").removeClass().addClass("shopping_finish");
        $("#jCarbtn1").unbind("click");
    }

    if (time >= 0) {
        var lDay = parseInt(time / 24 / 3600);
        var lHour = parseInt((time / 3600) % 24);
        var lMinute = parseInt((time / 60) % 60);
        var lSecond = parseInt(time % 60);
        if ($("[data-type='promotionTime']") != null) {
            var limitTime = p(lDay) + "天" + p(lHour) + "小时" + p(lMinute) + "分" + p(lSecond) + "秒";
            $("[data-type='promotionTime']").html(limitTime);
        }
        time = time - 1;
        if (time == 0) {
            if (state == 0) {
                state = 2;
            } else {
                state = 0;
            }
        }
        setTimeout("skillTimes(" + time + "," + state + ")", 1000);
    }
}

///倒计时
function remainLimitTime(time) {
    if (time >= 0) {
        var lDay = parseInt(time / 24 / 3600);
        var lHour = parseInt((time / 3600) % 24);
        var lMinute = parseInt((time / 60) % 60);
        var lSecond = parseInt(time % 60);
        if ($("[data-type='promotionTime']") != null) {
            var limitTime = p(lDay) + "天" + p(lHour) + "小时" + p(lMinute) + "分" + p(lSecond) + "秒";
            $("[data-type='promotionTime']").html(limitTime);
        }
        time = time - 1;
        if (time > 0) {
            setTimeout("remainLimitTime(" + time + ")", 1000);
        }
    }
}
//创建补0函数
function p(s) {
    return s < 10 ? '0' + s : s;
}

(function ($) {
    $.fn.animateNumber = function (to, prefix, postfix) {
        var $ele = $(this),
            num = parseInt($ele.html()),
            up = to > num,
            num_interval = Math.abs(num - to) / 90;
        var loop = function () {
            num = up ? Math.ceil(num + num_interval) : Math.floor(num - num_interval);
            if ((up && num > to) || (!up && num < to)) {
                num = to;
                clearInterval(animation);
            }
            $ele.html(prefix + num + postfix);
        };
        var animation = setInterval(loop, 30);
    };
})(jQuery);

(function ($) {
    $.extend({
        tipsBox: function (options) {
            options = $.extend({
                obj: null,  //jq对象，要在那个html标签上显示
                str: "+1",  //字符串，要显示的内容;也可以传一段html，如: "<b style='font-family:Microsoft YaHei;'>+1</b>"
                startSize: "10px",  //动画开始的文字大小
                endSize: "15px",    //动画结束的文字大小
                interval: 600,  //动画时间间隔
                color: "red",    //文字颜色
                callback: function () { }    //回调函数
            }, options);
            $("body").append("<span class='num'>" + options.str + "</span>");
            var box = $(".num");
            var left = options.obj.offset().left + options.obj.width() / 2;
            var top = options.obj.offset().top - options.obj.height();
            box.css({
                "position": "absolute",
                "left": left + "px",
                "top": top + "px",
                "z-index": 9999,
                "font-size": options.startSize,
                "line-height": options.endSize,
                "color": options.color
            });
            box.animate({
                "font-size": options.endSize,
                "opacity": "0",
                "top": top - parseInt(options.endSize) + "px"
            }, options.interval, function () {
                box.remove();
                options.callback();
            });
        }
    });
})(jQuery);

$.updateGoodsProm = function ($obj) {
    $obj.each(function () {
        var $this = $(this);
        var gids = [];
        $this.find("[data-type='item']").each(function () {
            var gid = $(this).data("gid");
            gids.push(gid);
        });
        var parameter = new Parameter();
        var dataParameter =
        {
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
                async: true,
                type: "GET",
                cache: false,
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
                            });
                        }

                        $this.find("[data-type='item']").each(function () {
                            var gid = $(this).data("gid");
                            var $price = $(this).find("[data-type='price']");
                            if (gid != null && pDict[gid] != null) {
                                $price.text(pDict[gid].PromPriceShow.toFixed(2));
                                //TODO:库存大于0
                                //if (pDict[gid].Stock > 0) {

                                //    if (parameter.ProductId == pDict[gid].ProductId && pDict[gid].ProductId != null && $("#hidSubpromotionType").val() != 1) {

                                //        $("#jCarbtn1").removeClass().addClass("shopping_car");
                                //        $("#productStock").val(pDict[gid].Stock);
                                //        $("#summary-price .p-price").text('￥' + pDict[gid].PromPriceShow.toFixed(2));
                                //        $("#NoSalePriceByHot").html(pDict[gid].PromPriceShow.toFixed(2));
                                //        $("#NoHotMemoPrice").html('￥' + pDict[gid].PromPriceShow.toFixed(2));
                                //        productRemoveAttr();
                                //        setMeidaGA($("#productStock").val(), $("#NoSalePriceByHot").text());
                                //        FromSaleQty = pDict[gid].FromSaleQty;

                                //        if (FromSaleQty > 1) {
                                //            $("#saleQty").text("(" + FromSaleQty + "件起售)");
                                //            $("#txtqyt").val(FromSaleQty);
                                //            if (FromSaleQty > pDict[gid].Stock) {
                                //                $("#jCarbtn1").removeClass().addClass("product_inform");
                                //            }
                                //        }
                                //        //if (pDict[gid].PresellDays > 0) {
                                //        //    $("#sendSKUInfo").html("待备货 预计 " + pDict[gid].PresellDays + " 天后发货");
                                //        //    $("#sendinfo").show();
                                //        //}

                                //    }
                                //}
                                //else {
                                //    //TODO:库存不足
                                //    if (parameter.ProductId == pDict[gid].ProductId && pDict[gid].ProductId != null && $("#hidSubpromotionType").val() != 1) {

                                //        $("#jCarbtn1").removeClass().addClass("product_inform");
                                //        $("#summary-price .p-price").text('￥' + pDict[gid].PromPriceShow.toFixed(2));
                                //        $("#NoSalePriceByHot").html(pDict[gid].PromPriceShow.toFixed(2));
                                //        $("#productStock").val(pDict[gid].Stock);
                                //        $("#NoHotMemoPrice").html('￥' + pDict[gid].PromPriceShow.toFixed(2));
                                //        ProductAttr();
                                //        setMeidaGA($("#productStock").val(), $("#NoSalePriceByHot").text());
                                //        FromSaleQty = pDict[gid].FromSaleQty;
                                //        if (FromSaleQty > 1) {
                                //            $("#saleQty").text("(" + FromSaleQty + "件起售)");
                                //            $("#txtqyt").val(FromSaleQty);
                                //        }
                                //        //if (pDict[gid].PresellDays > 0) {
                                //        //    $("#sendSKUInfo").html("待备货 预计 " + pDict[gid].PresellDays + " 天后发货");
                                //        //    $("#sendinfo").show();
                                //        //}
                                //    }
                                //}

                            }
                            //else {
                            //    //TODO:下架商品处理
                            //    if (parameter.ProductId == pDict[gid].ProductId && pDict[gid].ProductId != null && $("#hidSubpromotionType").val() != 1) {

                            //        $("#jCarbtn1").removeClass().addClass("product_inform");
                            //        $("#summary-price .p-price").text('￥' + $("#vipPrice").val());
                            //        $("#NoSalePriceByHot").html(pDict[gid].PromPriceShow.toFixed(2));
                            //        $("#NoHotMemoPrice").html('￥' + pDict[gid].PromPriceShow.toFixed(2));
                            //        $("#productStock").val(0);
                            //        ProductAttr();
                            //        setMeidaGA($("#productStock").val(), $("#NoSalePriceByHot").text());
                            //        FromSaleQty = pDict[gid].FromSaleQty;
                            //        if (FromSaleQty > 1) {
                            //            $("#saleQty").text("(" + FromSaleQty + "件起售)");
                            //            $("#txtqyt").val(FromSaleQty);
                            //        }
                            //    }
                            //}
                        });
                    }
                    //else {
                    //    //设置VIP价格
                    //    $("#summary-price .p-price").text('￥' + $("#vipPrice").val());
                    //    setMeidaGA($("#productStock").val(), $("#vipPrice").val());
                    //    FromSaleQty = pDict[gid].FromSaleQty;
                    //    if (FromSaleQty > 1) {
                    //        $("#saleQty").text("(" + FromSaleQty + "件起售)");
                    //        $("#txtqyt").val(FromSaleQty);
                    //    }

                    //}
                }
            });

        } catch (e) {
            //设置VIP价格
            $("#summary-price .p-price").text('￥' + $("#vipPrice").val().toFixed(2));
            setMeidaGA($("#productStock").val(), $("#vipPrice").val());
        }

    });
};

$.updateSimpleGoodsProm = function ($obj) {

    $obj.each(function () {
        var $this = $(this);
        var parameter = new Parameter();
        var dataParameter =
        {
            "ProductIdList": parameter.ProductId,
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
                url: window.BuyApiRoot + 'QueryPromPriceByProdId',
                async: true,
                type: "GET",
                cache: false,
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
                            });
                        }
                        var result = $this.find("[data-type='item']");
                        if (result.length == 0) {
                            //Ie8以下 兼容问题
                            var gid = parameter.ProductId;
                            if (pDict[gid] != null && gid != null) {
                                if (parameter.ProductId == pDict[gid].ProductId && pDict[gid].ProductId != null) {
                                    if (pDict[gid].Stock > 0) {
                                        $("#jCarbtn1").removeClass().addClass("shopping_car");
                                        $("#productStock").val(pDict[gid].Stock);
                                        $("#summary-price .p-price").text('￥' + pDict[gid].PromPriceShow.toFixed(2));
                                        $("#NoSalePriceByHot").html(pDict[gid].PromPriceShow.toFixed(2));
                                        $("#NoHotMemoPrice").html('￥' + pDict[gid].PromPriceShow.toFixed(2));
                                        productRemoveAttr();
                                        setMeidaGA($("#productStock").val(), $("#NoSalePriceByHot").text());
                                        FromSaleQty = pDict[gid].FromSaleQty;
                                        if (FromSaleQty > 1) {
                                            $("#saleQty").text("(" + FromSaleQty + "件起售)");
                                            $("#txtqyt").val(FromSaleQty);
                                            if (FromSaleQty > pDict[gid].Stock) {
                                                $("#jCarbtn1").removeClass().addClass("product_inform");
                                            }
                                        }
                                    } else {
                                        $("#jCarbtn1").removeClass().addClass("product_inform");
                                        $("#summary-price .p-price").text('￥' + pDict[gid].PromPriceShow.toFixed(2));
                                        $("#NoSalePriceByHot").html(pDict[gid].PromPriceShow.toFixed(2));
                                        $("#productStock").val(pDict[gid].Stock);
                                        $("#NoHotMemoPrice").html('￥' + pDict[gid].PromPriceShow.toFixed(2));
                                        ProductAttr();
                                        setMeidaGA($("#productStock").val(), $("#NoSalePriceByHot").text());
                                        FromSaleQty = pDict[gid].FromSaleQty;
                                        if (FromSaleQty > 1) {
                                            $("#saleQty").text("(" + FromSaleQty + "件起售)");
                                            $("#txtqyt").val(FromSaleQty);
                                        }
                                    }
                                }
                            } else {
                                if (parameter.ProductId == pDict[gid].ProductId && pDict[gid].ProductId != null) {
                                    $("#jCarbtn1").removeClass().addClass("product_inform");
                                    $("#summary-price .p-price").text('￥' + $("#vipPrice").val().toFixed(2));
                                    $("#NoSalePriceByHot").html(pDict[gid].PromPriceShow.toFixed(2));
                                    $("#NoHotMemoPrice").html('￥' + pDict[gid].PromPriceShow.toFixed(2));
                                    $("#productStock").val(0);
                                    ProductAttr();
                                    setMeidaGA($("#productStock").val(), $("#NoSalePriceByHot").text());
                                    FromSaleQty = pDict[gid].FromSaleQty;
                                    if (FromSaleQty > 1) {
                                        $("#saleQty").text("(" + FromSaleQty + "件起售)");
                                        $("#txtqyt").val(FromSaleQty);
                                    }
                                }
                            }
                        } else {
                            //IE9 以上,Chorme, fireFix ,360 浏览器执行方法
                            result.each(function () {
                                var gid = $(this).data("gid");
                                if (gid != null && pDict[gid] != null) {
                                    //TODO:库存大于0
                                    if (pDict[gid].Stock > 0) {
                                        if (parameter.ProductId == pDict[gid].ProductId && pDict[gid].ProductId != null) {
                                            $("#jCarbtn1").removeClass().addClass("shopping_car");
                                            $("#productStock").val(pDict[gid].Stock);
                                            $("#summary-price .p-price").text('￥' + pDict[gid].PromPriceShow.toFixed(2));
                                            $("#NoSalePriceByHot").html(pDict[gid].PromPriceShow.toFixed(2));
                                            $("#NoHotMemoPrice").html('￥' + pDict[gid].PromPriceShow.toFixed(2));
                                            productRemoveAttr();
                                            setMeidaGA($("#productStock").val(), $("#NoSalePriceByHot").text());
                                            FromSaleQty = pDict[gid].FromSaleQty;
                                            if (FromSaleQty > 1) {
                                                $("#saleQty").text("(" + FromSaleQty + "件起售)");
                                                $("#txtqyt").val(FromSaleQty);
                                                if (FromSaleQty > pDict[gid].Stock) {
                                                    $("#jCarbtn1").removeClass().addClass("product_inform");
                                                }
                                            }
                                            //if (pDict[gid].PresellDays > 0) {
                                            //    $("#sendSKUInfo").html("待备货 预计 " + pDict[gid].PresellDays + " 天后发货");
                                            //    $("#sendinfo").show();
                                            //}

                                        }
                                    } else {
                                        //TODO:库存不足
                                        if (parameter.ProductId == pDict[gid].ProductId && pDict[gid].ProductId != null) {

                                            $("#jCarbtn1").removeClass().addClass("product_inform");
                                            $("#summary-price .p-price").text('￥' + pDict[gid].PromPriceShow.toFixed(2));
                                            $("#NoSalePriceByHot").html(pDict[gid].PromPriceShow.toFixed(2));
                                            $("#productStock").val(pDict[gid].Stock);
                                            $("#NoHotMemoPrice").html('￥' + pDict[gid].PromPriceShow.toFixed(2));
                                            ProductAttr();
                                            setMeidaGA($("#productStock").val(), $("#NoSalePriceByHot").text());
                                            FromSaleQty = pDict[gid].FromSaleQty;
                                            if (FromSaleQty > 1) {
                                                $("#saleQty").text("(" + FromSaleQty + "件起售)");
                                                $("#txtqyt").val(FromSaleQty);
                                            }
                                            //if (pDict[gid].PresellDays > 0) {
                                            //    $("#sendSKUInfo").html("待备货 预计 " + pDict[gid].PresellDays + " 天后发货");
                                            //    $("#sendinfo").show();
                                            //}
                                        }
                                    }

                                } else {
                                    //TODO:下架商品处理
                                    if (parameter.ProductId == pDict[gid].ProductId && pDict[gid].ProductId != null) {

                                        $("#jCarbtn1").removeClass().addClass("product_inform");
                                        $("#summary-price .p-price").text('￥' + $("#vipPrice").val().toFixed(2));
                                        $("#NoSalePriceByHot").html(pDict[gid].PromPriceShow.toFixed(2));
                                        $("#NoHotMemoPrice").html('￥' + pDict[gid].PromPriceShow.toFixed(2));
                                        $("#productStock").val(0);
                                        ProductAttr();
                                        setMeidaGA($("#productStock").val(), $("#NoSalePriceByHot").text());
                                        FromSaleQty = pDict[gid].FromSaleQty;
                                        if (FromSaleQty > 1) {
                                            $("#saleQty").text("(" + FromSaleQty + "件起售)");
                                            $("#txtqyt").val(FromSaleQty);
                                        }
                                    }
                                }
                            });
                        }
                    } else {
                        //设置VIP价格
                        $("#summary-price .p-price").text('￥' + $("#vipPrice").val().toFixed(2));
                        setMeidaGA($("#productStock").val(), $("#vipPrice").val());
                        FromSaleQty = pDict[gid].FromSaleQty;
                        if (FromSaleQty > 1) {
                            $("#saleQty").text("(" + FromSaleQty + "件起售)");
                            $("#txtqyt").val(FromSaleQty);
                        }

                    }
                }
            });

        } catch (e) {
            //设置VIP价格
            $("#summary-price .p-price").text('￥' + $("#vipPrice").val().toFixed(2));
            setMeidaGA($("#productStock").val(), $("#vipPrice").val());
        }

    });
};



function GetPromotion() {

    //如果是秒杀：传值 //天天特价：传值
    var promSysNo = getUrlParam('promid') || '0';

    promSysNo = (promSysNo.split("?")[0]);

    //渠道名称
    var channelName = getUrlParam('fromPromType') || '';

    channelName = (channelName.split("?")[0]);

    if ($.cookie("Link51FL") != null) {
        channelName = $("#51Value").val();
    }

    if (channelName.length > 0 && promSysNo == '0') {
        var parameter = Parameter();
        var dataParameter =
        {
            "PromTypeMapper": channelName,
            "UserId": parameter.userId,
            "Guid": parameter.Guid,
            "DisplayLabel": parameter.DisplayLabel,
            "SourceTypeSysNo": parameter.SourceTypeSysNo,
            "AreaSysNo": parameter.AreaSysNo,
            "ChannelID": parameter.channel,
            "Ckid": parameter.Ckid,
            "ExtensionSysNo": parameter.ExtensionSysNo
        };

        $.ajax({
            url: window.BuyApiRoot + '/QueryPromSysNoByPromType',
            async: true,
            type: "GET",
            data: dataParameter,
            dataType: 'jsonp',
            jsonp: "callback",
            success: function (response) {
                if (response.DoFlag == true) {

                    promSysNo = response.PromSysNo;
                }
                getProductPromotionList(response.promSysNo);
                // getproductType(response.PromSysNo);
            }
        });
    }
    else {
        //根据商品获取所有促销类型
        getProductPromotionList(promSysNo);

        // getproductType(promSysNo);
    }
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

function productRemoveAttr() {
    $("#plus").removeAttr("disabled");
    $("#minus").removeAttr("disabled");
    $("#txtqyt").removeAttr("disabled");
}

function ProductAttr() {
    $("#plus").attr("disabled", "disabled");
    $("#minus").attr("disabled", "disabled");
    $("#txtqyt").attr("disabled", "true");
}

var numberCount = 0;
function setMeidaGA(strock, price) {
    if (numberCount == 0 || $("#hidSubpromotionType").val() == 1) {
        var ps = new getParameterList();
        //var stockState = strock;
        var state = 0;
        if (strock > 0) {
            state = 1;
        }
        var _mvq = window._mvq || []; window._mvq = _mvq;
        _mvq.push(['$setAccount', 'm-164-0']);

        _mvq.push(['$setGeneral', 'goodsdetail', '', /*用户名*/ window.Uid, /*用户id*/ window.UserId]);
        _mvq.push(['$logConversion']);

        //_mvq.push(['setPageUrl', /*单品着陆页url*/ '']);	//如果不需要特意指定单品着陆页url请将此语句删掉
        _mvq.push(['$addGoods', /*分类id*/ ps.intWebThirdType, /*品牌id*/ ps.brandId, /*商品名称*/ ps.title, /*商品ID*/ ps.gid, /*商品售价*/ price, /*商品图片url*/ ps.pricductUrl, /*分类名*/ ps.vchCateChildName, /*品牌名*/ ps.brand, /*商品库存状态1或是0*/ state, /*网络价*/ ps.marketprice, /*收藏人数*/ '', /*商品下架时间*/ '']);
        _mvq.push(['$logData']);
        numberCount = numberCount + 1;
    }
}