//放大镜效果
$(function(){
	$("#cont1 .cont1_smallImg li").mouseover(function(){
		$(this).find("img").css("border-color","#FF5C00")
		$(this).siblings().find("img").css("border-color","#f1f1f1");
		var _index = $(this).index();
		$("#cont1 .cont1_norImg li").eq(_index).show().siblings().hide();
	});
	$("#cont1 .cont1_norImg li").mouseover(function(){
		var _index = $(this).index();
		$("#cont1 .cont1_bigImg li").eq(_index).show().siblings().hide();
		$("#cont1 .cont1_bigImg").css("display","block");
		$(this).find("span").mousemove(function(evt){
			var e = evt || window.event;
			$("#cont1 .cont1_smBox").css("display","block");
			var L = e.pageX - $("#cont1 .cont1_smBox").outerWidth()/2 - $(this).offset().left;
			var T = e.pageY - $("#cont1 .cont1_smBox").outerHeight()/2 - $(this).offset().top;
			if(L <= 0){
				L = 0;
			}else if(L >= $(this).outerWidth() - $("#cont1 .cont1_smBox").outerWidth()){
				L = $(this).outerWidth() - $("#cont1 .cont1_smBox").outerWidth();
			}
			if(T <= 0){
				T = 0;
			}else if(T >= $(this).outerHeight() - $("#cont1 .cont1_smBox").outerHeight()){
				T = $(this).outerHeight() - $("#cont1 .cont1_smBox").outerHeight();
			}
			document.title = e.clientX +":" +L + ":" + T;
			$("#cont1 .cont1_smBox").css("left",L+"px");
			$("#cont1 .cont1_smBox").css("top",T+"px");
			$("#cont1 .cont1_bigImg li img").css("left",-L*2+"px");
			$("#cont1 .cont1_bigImg li img").css("top",-T*2+"px");
		})
	});
	$("#cont1 .cont1_norImg li").mouseout(function(){
		$("#cont1 .cont1_smBox").css("display","none");
		$("#cont1 .cont1_bigImg").css("display","none");
	});
	$("#cont1 .cont1_cen p a").click(function(){
		$(this).css({"background":"url(../img/detail/bg-selected.png) no-repeat right bottom","border-color":"#ff5c00"});
		$(this).siblings().css({"background":"#fff","border-color":"#ccc"});
	});
	$("#cont1 .cont1_cen .cont1_cen_box .cont1_cen_num input").val(1);
	$("#cont1 .cont1_cen .cont1_cen_num .cont1_cen_btn1").click(function(){
		var num = $("#cont1 .cont1_cen .cont1_cen_box .cont1_cen_num input").val();
		num++;
		$("#cont1 .cont1_cen .cont1_cen_box .cont1_cen_num input").val(num);
	});
	$("#cont1 .cont1_cen .cont1_cen_num .cont1_cen_btn2").click(function(){
		var num = $("#cont1 .cont1_cen .cont1_cen_box .cont1_cen_num input").val();
		if(num > 1){
			num--;
		}
		$("#cont1 .cont1_cen .cont1_cen_box .cont1_cen_num input").val(num);
	});	
	$("#cont2 .cont2_right_top li").click(function(){
		$(this).find("a").addClass("a_cur");
		$(this).siblings().find("a").removeClass("a_cur");
		var _index = $(this).index();
		if(_index == 1){
			$("#goodsShows").css("display","none");
			$("#goodsQuanping").css("display","block");
			$("#goodsPingjia").css("display","block");
			$(window).scrollTop(735);
		}else if(_index == 2){
			$("#goodsPingjia").css("display","none");
			$("#goodsQuanping").css("display","block");
			$("#goodsShows").css("display","none");
			$(window).scrollTop(735);
		}else if(_index == 3){
			$("#goodsQuanping").css("display","none");
			$("#goodsPingjia").css("display","none");
			$("#goodsShows").css("display","none");
			$(window).scrollTop(735);
		}else{
			$("#goodsQuanping").css("display","block");
			$("#goodsPingjia").css("display","block");
			$("#goodsShows").css("display","block");
			$(window).scrollTop(735);
		}
	});
	$(window).scroll(function(){
		//var e = evt || document.event;
		var top = $(this).scrollTop();
		
		if(top >= 735){
			$("#cont2 .nav_box").css("top",top-735+"px");
		}else{
			$("#cont2 .nav_box").css("top","-5px");
		}
	});
	$("#cont2 .cont2_right_down .quan_box li").click(function(){
		$(this).find("a").addClass("a_cur");
		$(this).siblings().find("a").removeClass("a_cur");
	});	
	$("#cont2 .cont2_right_down .goodsShow .goodsPingjia .percent dl dd s c").animate({"width":"100%"},2000);	
	$("#cont2 .cont2_right_down .goodsShow img")
	
	//倒计时
	setInterval(function(){	
	var shijian = new Date(2016,8,24);
	var now = new Date();
	var cha = shijian.getTime() - now.getTime();
	var tian = Math.floor(cha/1000/60/60/24);
	var shi=Math.floor((cha/1000-tian*24*60*60)/60/60);
	var fen=Math.floor((cha/1000-tian*24*60*60-shi*60*60)/60);
	var miao=Math.floor(cha/1000-tian*24*60*60-shi*60*60-fen*60);
	var str = '';
	if(shi == -1){
		tian--;
		shi=23;
	}
	if(shi < 10){
		str += "0" + shi + "时";
	}else{
		str += shi + "时";
	}

	if(fen == -1){
		shi--;
		fen=59;
	}
	if(fen < 10){
		str += "0" + fen + "分";
	}else{
		str += fen + "分";
	}
	if(miao == -1){
		fen--;
		miao=59;
	}
	if(miao < 10){
		str += "0" + miao + "秒";
	}else{
		str += miao + "秒";
	}	
	$("#time").html(str);
	miao--;
	},1000);

})




