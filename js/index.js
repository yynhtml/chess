$(function(){
	$("#h_banner").animate({"height":"1px"},1000,function(){
		$(this).find("img").attr("src","img/index/20160721152244_10_1920x100.jpg");
		$(this).animate({"height":"67px"},1000);
	});
	//轮播图
	
	var timer1 = null;
	var index = 1;
	var length = $(".banner_lunbo li").size();
	lunbo();
	$(".banner_lunbo").mouseover(function(){
		clearInterval(timer1);
	});
	$(".banner_lunbo_dian").mouseover(function(){
		index = $(this).index();
		$(".banner_lunbo_dian").eq(index).css("background","#FF5C00").siblings().css("background","#fff");
		$(".banner_lunbo ul").animate({"left":-index*1090+"px"},500);
	});
	$(".banner_lunbo").mouseout(function(){
		lunbo();
	})
	function lunbo(){
		clearInterval(timer1);
		timer1 = setInterval(function(){
			$(".banner_lunbo_dian").eq(index).css("background","#FF5C00").siblings().css("background","#fff");
			$(".banner_lunbo ul").animate({"left":-index*1090+"px"},500);
			index++;
			if(index >= length){
				index = 0;
			}
		},3000);
	}
	//倒计时
	//alert($(".banner_2_time .num").size());

	setInterval(function(){	
		var shijian = new Date(2016,7,24);
		var now = new Date();
		var cha = shijian.getTime() - now.getTime();
		var tian = Math.floor(cha/1000/60/60/24);
		var shi=Math.floor((cha/1000-tian*24*60*60)/60/60);
		var fen=Math.floor((cha/1000-tian*24*60*60-shi*60*60)/60);
		var miao=Math.floor(cha/1000-tian*24*60*60-shi*60*60-fen*60);
		if(miao == -1){
			fen--;
			miao=59;
		}
		if(miao < 10){
			$(".banner_2_time .num").eq(2).html("0"+miao);
		}else{
			$(".banner_2_time .num").eq(2).html(miao);
		}
		if(fen == -1){
			shi--;
			fen=59;
		}
		if(fen < 10){
			$(".banner_2_time .num").eq(1).html("0"+fen);
		}else{
			$(".banner_2_time .num").eq(1).html(fen);
		}
		if(shi == -1){
			tian--;
			shi=23;
		}
		if(shi < 10){
			$(".banner_2_time .num").eq(0).html("0"+shi);
		}else{
			$(".banner_2_time .num").eq(0).html(shi);
		}
		miao--;
	},1000);
	
	
	//轮播图2
	//给每个图加鼠标事件
	$(".banner_2_down li").hover(function(){
		$(this).find(".sale").css("display","block");
		$(this).find(".saled").animate({"top":"0px"},100);
	},function(){
		$(this).find(".sale").css("display","none");
		$(this).find(".saled").css("top","20px");
	});
	//轮播
	var flag = 0;
	var timer2 = null;
	function lunbo2(){
			if(flag){
				$(".banner_2_up .you").css("background-position","-194px -53px");
				$(".banner_2_up .zuo").css("background-position","-165px -83px");
			}else{
				$(".banner_2_up .zuo").css("background-position","-165px -53px");
				$(".banner_2_up .you").css("background-position","-194px -83px");
			}
			$(".banner_2_down ul").animate({"left":-flag*1100+"px"},500,function(){
			flag = !flag;
			});
		}
	timer2 = setInterval(lunbo2,5000);		
	//加按钮控制
	$(".banner_2_up").find(".zuo").mouseenter(function(){
		clearInterval(timer2);
		$(".banner_2_up .zuo").css("background-position","-165px -83px");
		//alert(1);
	});
	$(".banner_2_up").find(".zuo").mouseleave(function(){
		timer2 = setInterval(lunbo2,5000);	
		$(".banner_2_up .zuo").css("background-position","-165px -53px");
		//alert(1);
	});
	$(".banner_2_up").find(".zuo").click(function(){
		flag = 0;
		lunbo2();
	})
	$(".banner_2_up").find(".you").mouseenter(function(){
		clearInterval(timer2);
		$(".banner_2_up .you").css("background-position","-194px -83px");
		//alert(2);
	});	
	$(".banner_2_up").find(".you").mouseleave(function(){
		timer2 = setInterval(lunbo2,5000);
		$(".banner_2_up .you").css("background-position","-194px -53px");
		//alert(2);
	});	
	$(".banner_2_up").find(".you").click(function(){
		flag = 1;
		lunbo2();
	});
	$(window).scroll(function(){
		var top = $(this).scrollTop();
		if(top > 200){
			$("#fixLeftImg").css("display","block");
		}else{
			$("#fixLeftImg").css("display","none");
		}
		if(top > 520){
			$("#fixTop").css("display","block");
		}else{
			$("#fixTop").css("display","none");
		}
	})
	//回到顶部
	$("#fix_dingbu").click(function(){
		$(window).scrollTop(0);
	})
	//通过解读json文件给页面添加内容
	$.ajax({
		type:"post",
		url:"js/index_tehuizhuanchan.json",
		dataType:"json",
		success:function(data){
			var str = '';
			for(var i = 0;i < data.length;i++){
				str += '<a href="html/list.html"><dl>';
				str += '<dt class="l"><a href="html/list.html"><img src="'+data[i].Img+'"/></a></dt>';
				str += '<dd class="r">';
				str += '<h2><a href="html/list.html">'+data[i].tle+'</a></h2>';
				str += '<p>'+data[i].cont+'</p>';
				str += '<div><span>¥ <b>'+data[i].price+'</b> 起</span>';
				str += '<a href="javascript:;" class="r">点击进入</a></div></dd></dl></a>';
			}
			$(".cont2_box").append(str);
		}	
	})
	$.ajax({
		type:"post",
		url:"js/index_jinrijingxuan.json",
		dataType:"json",
		success:function(data){
			var str = '';
			for(var i = 0;i < data.length;i++){
				var biaoqian = data[i].biaoqian;
				str += '<dl><dt class="l"><a href="html/list.html"><img src="'+data[i].Img+'"/></a></dt>';
				str += '<dd class="r"><div class="cont3_box_box1">';
				if(data[i].Flag){
					str += '<span class="cont3_box_flag" style="background-position:'+data[i].Flag+'"></span>';
				}
				for(var j in biaoqian){
					str += '<span class="biaoqian">'+biaoqian[j]+'</span>';
				}
				//alert(data[i].tle)
				str += '<span class="canzhao"></span></div>'
				str += '<h2><a href="html/list.html">'+data[i].tle+'</a></h2>';
				str += '<p>'+data[i].cont+'</p>';
				str += '<div class="addr"><i></i>'+data[i].address+'</div>';
				str += '<div><span>¥ <b>'+data[i].price+'</b></span>';
				str += '<a href="html/list.html" class="r cli">点击进入</a></div></dd></dl>';
			}
			$(".cont3_box").append(str);
		}	
	})	
})
