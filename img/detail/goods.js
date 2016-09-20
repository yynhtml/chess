$(document).ready(function () {
    //手机下单hover;
    $(".phonebuydiv").hover(function () {
        $("#m-qrcode").show();
    }, function () {
        $("#m-qrcode").hide();
    });


    //加添延迟加载。
    $("#ReviewProductId").scrollLoading({ callback: GetRecentViewedProduct });
    //GetUserBrowse();

    //人气套餐，优惠组合暂时visibility : hidden掉全部搭配文字，套餐一二三文字；
    $("#all_suit,#suit1").css("visibility", "hidden");


    //表单失去焦点时，初始化
    $(":input").focus(function () {
        $(this).addClass("focus");
        if ($(this).val() == this.defaultValue) {
            $(this).val("");
        }
    }).blur(function () {
        $(this).removeClass("focus");
        if ($(this).val() == '') {
            $(this).val(this.defaultValue);
        }
    });

    //category-menu-nav 显示
    $("#category-menu-nav").hover(function () {
        $("#menu-nav-container").show();
    }, function () {
        $("#menu-nav-container").hide();
    });


    //头部放大镜效果
    /* 鼠标移动小图，小图对应大图显示在大图上，并替换放大镜中的图*/
    var zooimg = $("#specList>ul>li>img");
    zooimg.livequery("mouseover", function () {
        var imgSrc = $(this).attr("src");
        var i = imgSrc.lastIndexOf(".");
        var unit = imgSrc.substring(i);
        imgSrc = imgSrc.substring(0, i);
        var imgSrc_small = $(this).attr("src_S");
        var imgSrc_big = $(this).attr("src_B");
        $("#bigImg").attr({ "src": imgSrc_small, "jqimg": imgSrc_big });
        $(this).parent().addClass("chosed").siblings().removeClass("chosed");
    });

    //使用jqzoom
    $(".jqzoom").jqueryzoom({
        xzoom: 470, //放大图的宽度(默认是 200)
        yzoom: 450, //放大图的高度(默认是 200)
        offset: 0, //离原图的距离(默认是 10)
        position: "right", //放大图的定位(默认是 "right")
        preload: 1
    });

    /*如果小图过多，则出现滚动条在一行展示*/
    var btnNext = $('#specRight');
    var btnPrev = $('#specLeft');
    var ul = btnPrev.next().find('ul');

    var len = ul.find('li').length;
    var i = 0;
    if (len > 5) {
        $("#specRight").addClass("specRightF").removeClass("specRightT");
        ul.css("width", 62 * len);
        btnNext.click(function (e) {
            if (i >= len - 5) {
                return;
            }
            i++;
            if (i == len - 5) {
                $("#specRight").addClass("specRightT").removeClass("specRightF");
            }
            $("#specLeft").addClass("specLeftF").removeClass("specLeftT");
            moveS(i);
        });
        btnPrev.click(function (e) {
            if (i <= 0) {
                return;
            }
            i--;
            if (i == 0) {
                $("#specLeft").addClass("specLeftT").removeClass("specLeftF");
            }
            $("#specRight").addClass("specRightF").removeClass("specRightT");
            moveS(i);
        });
    };
    function moveS(i) {
        ul.animate({ left: -62 * i }, 500);
    };
    function picAuto() {
        if ($(".listImg li").size() <= 5) {
            $("#specLeft,#specRight").show();
        }
    };
    picAuto();

    //组合装选择
    $("#group_num>li>a").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
    $("#group_num>li").live("click", function () {
        var $this = $(this).index("#group_num>li");
        $("#group_num>li").removeClass("select").eq($this).addClass("select");
    });

    //尺寸选择
    $("#size_num>li").live("click", function () {
        var $this = $(this).index("#size_num>li");
        if ($("#size_num>li").eq($this).find("a").hasClass("disable") == false) {
            $("#size_num>li").removeClass("select").eq($this).addClass("select");
        }
    });

    //颜色选择
    $("#color_choose>li").live("click", function () {
        var $this = $(this).index("#color_choose>li");
        if ($("#color_choose>li").eq($this).find("a").hasClass("disable") == false) {
            $("#color_choose>li").removeClass("select").eq($this).addClass("select");
        }
    });

    //人气组合，优惠套餐，tab切换
    $("#group_suit_ul>li").live("click", function () {
        var $this = $(this).index("#group_suit_ul>li");
        $("#group_suit_ul>li").removeClass("group_suit_li_cur").eq($this).addClass("group_suit_li_cur");
        $("#groupproductol>li").hide().eq($this).show();
    });

    //人气组合，优惠套餐，全部搭配，奶粉tab切换
    $("#all_suit>li").live("click", function () {
        var $this = $(this).index("#all_suit>li");
        $("#all_suit>li").removeClass("c-orange").eq($this).addClass("c-orange");
        $("#all_suit_product>li").hide().eq($this).show();
    });

    //人气组合，优惠套餐，套餐一二三 tab切换
    $("#suit1>li").live("click", function () {
        var $this = $(this).index("#suit1>li");
        $("#suit1>li").removeClass("c-orange").eq($this).addClass("c-orange");
        $("#suit1_produt>li").hide().eq($this).show();
    });

    // 三级分类 排行榜 tab切换
    $("#rank_product_name>li").live("mouseover", function () {
        var $this = $(this).index("#rank_product_name>li");
        $("#rank_product_name>li").removeClass("rank_product_cur").eq($this).addClass("rank_product_cur");
        $("#rank_product>li").hide().eq($this).show();
    });

    //热门活动 品牌活动 品类活动tab切换
    $("#hot_active>li").live("click", function (i) {
        var $this = $(this).index("#hot_active>li");
        $("#hot_active>li").removeClass("group_suit_li_cur").eq($this).addClass("group_suit_li_cur");
        $("#hot_ad>li").hide().eq($this).show();
    });

    //判断热门活动，品牌活动，品类活动部分，广告是否显示4个，不足4个，title隐藏。
    $("#hot_ad>li").each(function (i) {
        $(this).attr("id", "hotAd" + i + "li");
        var hotLiId = $(this).attr("id");
        var hotLiOL = $("#" + hotLiId).children("ol").find("li").length;
        if (hotLiOL < 4) {
            $("#hot_active>li").eq(i).hide();
        }
        $("#hot_active>li").eq(0).addClass("group_suit_li_cur");
    });

    //商品介绍 商品评论 商品问答 品质保障tab切换
    $("#product_intro>li").live("click", function () {
        var $this = $(this).index("#product_intro>li");
        $("#product_intro>li").removeClass("group_suit_li_cur").eq($this).addClass("group_suit_li_cur");
        if ($(document).scrollTop() > $("#part3_R_3_div").offset().top) {
            $("body").stop().animate({ scrollTop: $("#part3_R_3_div").offset().top - 60 }, 100);
        }
        if ($this == 0) {
            $("#intro_box,.shangp1,.shangp2,.shangp3,.shangp4").show();
        } else if ($this == 1) {
            $("#intro_box,.shangp1").hide();
            $(".shangp2,.shangp3,.shangp4").show();
            $(".shangp2").css("marginTop", "30px");
        } else if ($this == 2) {
            $("#intro_box,.shangp1,.shangp2").hide();
            $(".shangp3,.shangp4").show();
            $(".shangp3").css("marginTop", "30px");
        } else if ($this == 3) {
            $("#intro_box,.shangp1,.shangp2,.shangp3").hide();
            $(".shangp4").show();
            $(".shangp4").css("marginTop", "30px");
        }
    });

    //全部评论  好评  中评  差评tab切换
    $("#pingjia_tab>li").live("click", function () {
        var $this = $(this).index("#pingjia_tab>li");
        $("#pingjia_tab>li").removeClass("group_suit_li_cur").eq($this).addClass("group_suit_li_cur");
        $("#pingjia_box>li").hide().eq($this).show();
    });

    //全部咨询  商品   配送  支付   发票  常见问题 tab切换
    $("#pro-tab>li").live("click", function () {
        var $this = $(this).index("#pro-tab>li");
        $("#pro-tab>li").removeClass("group_suit_li_cur").eq($this).addClass("group_suit_li_cur");
        $("#consult_box>li").hide().eq($this).show();
    });

    //获取要定位元素距离浏览器顶部的距离
    var navH = $("#tab_H_box_fix").offset().top;
    var show_detail_title_fixed = true;
    //滚动条事件
    $(window).scroll(function () {
        //获取滚动条的滑动距离
        var scroH = $(this).scrollTop();
        //滚动条的滑动距离大于等于定位元素距离浏览器顶部的距离，就固定，反之就不固定
        if (show_detail_title_fixed) {
            if (scroH >= navH) {
                $("#tab_H_box_fix").css({ "position": "fixed", "top": "0px", "z-index": "20" });
                $("#product_intro").css({ "position": "relative" });
            } else if (scroH < navH) {
                $("#tab_H_box_fix").css({ "position": "static" });
                $("#product_intro").css({ "position": "relative" });
            }
        }
    });

    //人气组合，奶粉，出现滚动条
    var hotlenDL = $("#hotsuitIn dl").length;
    $("#hotsuitIn").css({ "width": hotlenDL * 170 + (hotlenDL - 1) * 20 });
    if (hotlenDL > 4) {
        $(".hot_02_prodcuts").css({ "overflow-x": "auto" });
    }

    $(".closeff,#goshopping,#closeShop,#readd,#closeTip").live("click", function () {
        easyDialog.close();
        $("#closeTip").hide();
    });

    //点击加关注,,收藏成功：1 ； 失败： 0；
    $("#insertFav").live("click", function () {
        var userId = window.UserId;
        var productId = $("#productionId").val();
        if (userId > 0) {
            $.ajax({
                url: window.WebApiRoot + "Api/GetInsertFav",
                contentType: "application/json;",
                data: { id: productId },
                type: "Get",
                async: true,
                dataType: 'jsonp',
                success: function (response) {
                    if (response != "") {
                        var numberValue = response.split('|')[0];
                        var messgageBox = response.split('|')[1];
                        if (numberValue == "0") {
                            numberValue = 1;
                        }
                        ////默认处理收藏返回结果
                        //if (numberValue == "-1") {
                        //    messgageBox = "该商品已收藏！";
                        //} else {
                        //    messgageBox = "已成功收藏该商品！";
                        //}
                        window.__dialogBox("<i class='jumpicon1'></i>" + messgageBox + "", "您已收藏<span>" + numberValue + "</span>件商品", ".jumpIn4,#seeCollect");
                    }
                }
            });
        } else {
            ShowblockUI();
        }
    });

    //满赠
    $("#fullGift>li,#shangeGift>li").live("mouseover", function () {
        $(this).children("b").stop().animate({ "bottom": "0" }, 400);//鼠标移入事件
        $(this).children("img").css("border", "1px solid #f90");
    }).live("mouseout", function () {
        $(this).children("b").stop().animate({ "bottom": "-24px" }, 400);//鼠标移出事件
        $(this).children("img").css("border", "1px solid #f1f1f1");
    });

    $(".ongetGift").live("click", function () {
        //var stock = $(this).data("stock"); //库存显示信息
        var productId = $(this).data("id");//商品ID
        var promotionId = $(this).data("promsysno"); //促销编号
        var productType = $(this).data("producttype"); //商品类型

        innertShopCart(productId, productType, promotionId, 1);

    });

    //赠品
    $("#giftBox>dl").live("click", function () {
        if ($(this).next("#giftBoxIn:first").hasClass("hide")) {
            $(this).next("#giftBoxIn:first").removeClass("hide");
            if ($(this).find("#sp_act a").eq(0).text() == "收起") {
                $(this).find("#sp_act a").eq(0).show();
                $(this).find("#sp_act a").eq(1).hide();
            } else {
                $(this).find("#sp_act a").eq(1).show();
                $(this).find("#sp_act a").eq(0).hide();
            }

        } else {
            $(this).next("#giftBoxIn:first").addClass("hide");
            if ($(this).find("#sp_act a").eq(0).text() == "收起") {
                $(this).find("#sp_act a").eq(1).show();
                $(this).find("#sp_act a").eq(0).hide();
            } else {
                $(this).find("#sp_act a").eq(1).hide();
                $(this).find("#sp_act a").eq(0).show();
            }

        }
    });

    //换购
    $("#shangeGiftBox>dl").live("click", function () {

        if ($(this).next("#shangeGiftBoxIn:first").hasClass("hide")) {
            $(this).next("#shangeGiftBoxIn:first").removeClass("hide");
            if ($(this).find("#sp_act_change a").eq(0).text() == "收起") {
                $(this).find("#sp_act_change a").eq(1).hide();
                $(this).find("#sp_act_change a").eq(0).show();
            } else {
                $(this).find("#sp_act_change a").eq(0).hide();
                $(this).find("#sp_act_change a").eq(1).show();
            }

        } else {

            $(this).next("#shangeGiftBoxIn:first").addClass("hide");
            if ($(this).find("#sp_act_change a").eq(0).text() == "收起") {
                $(this).find("#sp_act_change a").eq(1).show();
                $(this).find("#sp_act_change a").eq(0).hide();
            } else {
                $(this).find("#sp_act_change a").eq(0).show();
                $(this).find("#sp_act_change a").eq(1).hide();
            }

        }
    });

    //发表评论弹框，先判断用户是否登录，login=1;已登录，弹出评论框；loginIn=0 ,未登录，弹出登录框；
    $("#btn-comment").live("click", function () {

        var userId = window.UserId;
        if (userId > 0) {
            $("#userCommentConext").text("");
            var loginIn = 1;
            if (loginIn == 1) {
                easyDialog.open({
                    header: '发表评论',
                    container: "makeComment",
                    overlay: false,
                    drag: false
                });
                $(".jumpIn4,#mComment").show();
            }
        } else {
            ShowblockUI();
        }

    });

    //发表评论弹，标签选择，多选；
    $("#commentTag>li").live("click", function () {
        if ($(this).hasClass("checked")) {
            $(this).removeClass("checked");
        } else {
            $(this).addClass("checked");
        }
        $(this).children("input").css("checked", "checked");
    });

    //输入评论后，显示评论成功与否状态；5种状态；comment= 1 , 评论成功；comment = 2  ,未购买,无法评论； comment= 3  ,已购买未确认收货,无法评论; comment= 0  ,已评论过, 无法评论;
    $("#mComment").live("click", function () {
        var checkTags = "";
        var $userCommentConext = $("#userCommentConext");
        var $gid = $("#productionId");
        var commentScore = Score;
        $("#commentTag .checked input[name='checkbox']").each(function () {
            if ($(this).attr("checked")) {
                if (checkTags == '') {
                    checkTags = $(this).val();
                } else {
                    checkTags += "," + $(this).val();
                }
            }
        });
        if ($gid.val() > 0) {
            if ($userCommentConext.html().trim() == '<br>' || $userCommentConext.html().trim() == '') {

                window.__dialogBox("<i class='jumpicon3'></i>提示", "请输入评论内容，谢谢！", ".jumpIn4,#closeTip");
                return;

            } else if (commentScore == 0 || commentScore == '') {
                commentScore = 5;
            }

            InsertUserComment($gid.val(), commentScore, checkTags, $userCommentConext.html().trim());
        }
    });


    //发表咨询，先判断用户是否登录，login=1;已登录，弹出评论框；login=0 ,未登录，弹出登录框；
    $("#makeConsultBtn").live("click", function () {
        var userId = window.UserId;
        if (userId > 0) {
            $("#enquiryContent").text("");

            easyDialog.open({
                header: '发表咨询',
                container: "makeConsult",
                overlay: false,
                drag: false
            });
            $(".jumpIn4,#submitConsult").show();

        } else {
            //弹出登陆框；
            ShowblockUI();
        }
    });

    //咨询标签点击，单选状态；
    $("#consultTag>li").live("click", function () {
        if ($(this).hasClass("checked")) {
            $(this).removeClass("checked");
        } else {
            $(this).addClass("checked").siblings().removeClass("checked");
        }
        $(this).children("input").css("checked", "checked");
    });

    //文本框限制大小
    var maxValue = $("#enqiryLength").html();
    var limite = $("#commentLength").html();
    $("#enquiryContent").keyup(function () {
        var LimiteValue = $("#enqiryLength").html();
        var inputCount = $("#enquiryContent").html().length;
        if (inputCount > 1) {
            var enquiryLength = (LimiteValue - $("#enquiryContent").length);
            $("#enqiryLength").html(enquiryLength);
        } else {
            $("#enqiryLength").html(maxValue);
        }
    });

    $("#userCommentConext").keyup(function () {
        var LimiteValue = $("#commentLength").html();
        var inputCount = $("#userCommentConext").html().length;
        if (inputCount > 1) {
            var enquiryLength = (LimiteValue - $("#userCommentConext").length);
            $("#commentLength").html(enquiryLength);
        } else {
            $("#commentLength").html(maxValue);
        }
    });


    //重新加入购物车、重新咨询、重新领取、重新收藏等功能超过3次后提示该弹窗,  moretry=1  没有超过3次; moretry= 0  超过3次;
    $("#reget").live("click", function () {
        var moretry = 0;
        if (moretry == 0) {
            easyDialog.open({
                header: '温馨提醒',
                container: "addproduct",
                overlay: false,
                drag: false
            });
            var html1 = "<i class='jumpicon3'></i>重试失败!";
            var html2 = "过会再试试";
            $(".jumpIn1").html(html1);
            $(".jumpIn2").html(html2);
            $(".jumpIn4 a").hide();
            $(".jumpIn4,#closeTip").show();
        }
    });

    //评论框打分
    var stepW = 24;
    var description = new Array("非常差，回去再练练", "真的是差，都不忍心说你了", "一般，还过得去吧", "很好，是我想要的东西", "太完美了，此物只得天上有，人间哪得几回闻!");
    var stars = $("#starComment > li");
    var descriptionTemp;
    var Score = 0;
    $("#showb").css("width", 0);
    stars.each(function (i) {
        $(stars[i]).click(function (e) {
            Score = i + 1;
            $("#showb").css({ "width": stepW * Score });
            descriptionTemp = description[i];
            $(this).find('a').blur();
            return stopDefault(e);
            return descriptionTemp;
        }), $(stars[i]).hover(
             function () {
                 $(".description").text(description[i]);
             },
             function () {
                 if (descriptionTemp != null)
                     $(".description").text("当前您的评价为：" + descriptionTemp);
                 else
                     $(".description").text(" ");
             }
         );
    });

});

//评论框星星打分;
function stopDefault(e) {
    if (e && e.preventDefault)
        e.preventDefault();
    else
        window.event.returnValue = false;
    return false;
};

//用户购买过商品
function GetProductAlsoBuyList() {
    var productId = $("#productionId").val();
    $.ajax({
        url: window.WebApiRoot + 'Api/ProductionAlsoBuy',
        async: true,
        type: "POST",
        contentType: "application/json;",
        data: "{id:'" + productId + "'}",
        dataType: 'json',
        cache: true,
        success: function (response) {
            if (response != '') {
                var dataLenght = (response.length - 1);
                var html = [];
                $.each(response, function (i, item) {
                    if (i < dataLenght) {
                        html.push("<dl class='buy_too_dl'><dt><a href='" + window.WebRoot + item.intProductID + ".html'>");
                        html.push("<img src='" + window.PicRoot + "/Product/normal/" + item.vchMainPicURL + "' alt='" + item.vchProductName + "' title='" + item.vchProductName + "' /></a></dt>");
                        html.push("<dd> <p><a href='" + window.WebRoot + item.intProductID + ".html' title='" + item.vchProductName + "'>" + item.vchProductName + "<span data-type='promtitle'></span></a></p>");
                        html.push("<p class='center_orange'>￥<span data-type='price'>" + item.numVipPrice.toFixed(2) + "</span></p></dd></dl>");
                    } else {
                        html.push("<dl class='buy_too_dl noL_noP'><dt><a href='" + window.WebRoot + item.intProductID + ".html'>");
                        html.push("<img src='" + window.PicRoot + "/Product/normal/" + item.vchMainPicURL + "' alt='" + item.vchProductName + "' title='" + item.vchProductName + "' /></a></dt>");
                        html.push("<dd> <p><a href='" + window.WebRoot + item.intProductID + ".html' title='" + item.vchProductName + "'>" + item.vchProductName + "<span data-type='promtitle'></span>");
                        html.push("</a></p> <p class='center_orange'>￥<span data-type='price'>" + item.numVipPrice.toFixed(2) + "</span></p></dd></dl>");
                    }
                });

                $("#padBtm0").html(html.join(""));
            }
        }
    });
}


//用户最近浏览过的数据
function GetRecentViewedProduct() {
    var productId = $("#productionId").val();
    try {
        $.ajax({
            url: window.WebApiRoot + 'Api/GetRecentViewedProduct',
            async: true,
            contentType: "application/json;",
            data: { id: productId },
            dataType: 'jsonp',
            cache: true,
            type: "GET",
            success: function (response) {
                if (response != '' && response != null) {
                    $("#productReviewLast").show();
                    var dataLength = (response.length - 1);
                    var html = [];
                    $.each(response, function (i, item) {
                        if (i >= 5) {
                            //$("#ReviewProductId").addClass("brand_scroll");
                            //$(".rela_type_dl dd.recent_scan_box").css({ "height": "829px", "overflow-y": "auto" });
                            $(".rela_type_dl dd.recent_scan_box").css({ "height": "829px" });
                        }
                        var picUrl = "";
                        if (item.MainPicURL.indexOf("{type}") > -1) {
                            picUrl = window.PicRoot + item.MainPicURL;
                            if (picUrl) picUrl = picUrl.replace("{type}", "160X160");
                        }
                        else if (item.MainPicURL.indexOf("{0}") > -1) {
                            picUrl = window.PicRoot + item.MainPicURL;
                            if (picUrl) picUrl = picUrl.replace("{0}", "normal");
                        } else {
                            picUrl = window.PicRoot + "Product/normal/" + item.MainPicURL;//兼容测试环境
                        }
                        if (i < dataLength) {
                            html.push("<dl class='buy_too_dl'><dt><a href='" + window.ItemRoot + item.ProductID + ".html' class='stats' data-position='recentlyViewed_" + (i + 1) + "'>");
                            html.push("<img src='" + window.ThemesRoot + "images/loading2.gif' class='scrollLoading' data-url='" + picUrl + "' alt='" + item.vchProductName + "' title='" + item.ProductName + "'/></a></dt>");
                            html.push("<dd> <p><a href='" + window.ItemRoot + item.ProductID + ".html'  class='stats' data-position='recentlyViewed_" + (i + 1) + "' title='" + item.ProductName + "'>" + item.ProductName + "<span data-type='promtitle'>");
                            html.push("</span></a></p> <p class='center_orange'>￥<span data-type='price'>" + item.VipPrice.toFixed(2) + "</span></p></dd></dl>");
                        } else {
                            html.push("<dl class='buy_too_dl noL_noP'><dt><a href='" + window.ItemRoot + item.ProductID + ".html'  class='stats' data-position='recentlyViewed_" + (i + 1) + "' >");
                            html.push("<img src='" + picUrl + "' alt='" + item.vchProductName + "' title='" + item.ProductName + "' /></a></dt>");
                            html.push("<dd> <p><a href='" + window.ItemRoot + item.ProductID + ".html'  class='stats' data-position='recentlyViewed_" + (i + 1) + "' title='" + item.ProductName + "'>" + item.ProductName + "</a><span data-type='promtitle'>");
                            html.push("</span></p><p class='center_orange'>￥" + item.VipPrice.toFixed(2) + "</p></dd></dl>");
                        }
                    });
                    $("#ReviewProductId").html(html.join(""));
                    $("#userbrowse").html(html.join(""));
                    $(".stats").unbind("click").click(function () {
                        var _this = $(this);
                        var href = _this.attr("href");
                        var position = _this.attr("data-position");
                        var page = window.location.href;

                        _gaq_push(decodeURIComponent(page), position, decodeURIComponent(href), 1);
                    });
                    $(".scrollLoading").scrollLoading();
                } else {
                    $("#productReviewLast").hide();
                }
            }
        });

    } catch (e) {

    }

}

//新增评论
function InsertUserComment(gid, score, tags, commentContext) {
    $.ajax({
        url: window.WebApiRoot + 'Api/InsertUserComment',
        async: true,
        type: "GET",
        contentType: "application/json;",
        data: { gid: gid, starScore: score, userComment: commentContext, Tags: tags },
        dataType: 'jsonp',
        success: function (response) {
            if (response != null) {
                if (eval(response) == -1) {
                    window.__dialogBox("<i class='jumpicon2'></i>评论失败!", "您未登录，请先登录操作！", ".jumpIn4,#closeTip");
                } else if (eval(response) == 0) {
                    window.__dialogBox("<i class='jumpicon2'></i>评论失败!", "评论内容包含敏感词汇，请使用文明用语！", ".jumpIn4,#closeTip");
                } else if (eval(response) == 500) {
                    window.__dialogBox("<i class='jumpicon2'></i>评论失败!", "您未购买过该商品，无法评论！", ".jumpIn4,#closeTip");
                } else if (eval(response) == 1) {
                    window.__dialogBox("<i class='jumpicon1'></i>评论成功!", "该评论已提交给工作人员审核！欢迎下次光临,谢谢！", ".jumpIn4,#closeTip");
                    _userComment(0, 10, 1);
                }
            }
        }
    });
};

function stopIframe() {

}