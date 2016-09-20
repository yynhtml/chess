
function Parameter() {
    var parameter = new Object();
    parameter.channel = 102;
    parameter.userId = window.UserId;
    parameter.Guid = window.User_Guid;
    parameter.AreaSysNo = 100; //$("#AreaSysNo").val();
    parameter.Ckid = window.CKid;
    parameter.SourceTypeSysNo = window.SourceTypeSysNo;
    parameter.DisplayLabel = displayLabel();
    parameter.ExtensionSysNo = $.cookie("ExtensionSysNo") || '';
    return parameter;
}
$.updateGoodsProms = function ($obj) {
    $obj.each(function () {
        var $this = $(this);
        var gids = [];
        $this.find("[data-type='item']").each(function () {
            var gid = $(this).data("gid");
            gids.push(gid);
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

                            });
                        }

                        $this.find("[data-type='item']").each(function () {
                            var gid = $(this).data("gid");
                            var $price = $(this).find("[data-type='price']");
                            var promotion = $(this).find("[data-type='promotion']");
                            var pstock = $(this).find("[data-type='soldout']")
                            if (gid != null && pDict[gid] != null) {
                                $price.text(pDict[gid].PromPriceShow.toFixed(2));
                                if ((pDict[gid].ProductMemo !== typeof ('undefined')) || (pDict[gid].ProductMemo != '')) {
                                    promotion.html(pDict[gid].ProductMemo);
                                }
                                if (pDict[gid].Stock > 0) {
                                    pstock.hide();
                                } else {
                                    pstock.show();
                                }
                            }

                        });
                    }
                }
            });

        } catch (e) {
        }

    });
};
