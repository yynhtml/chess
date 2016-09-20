$(function(){
	//表单验证
	//手机号验证
	var flag = 0;
	$("#phone").blur(function(){
		var phone = $(this).val();
		if(!(/^1[3|4|5|7|8]\d{9}$/.test(phone))){
			$(this).css("border-color","#FF0000");
			$(this).parents("dd").find("p").css({"background":"#FFEDB5","border-color":"#FF9900"});
			$(this).parents("dd").find("p").html("<b style='background: url(../img/index/onError.gif) no-repeat center center ;'></b>手机格式不对，请重新输入！");
			flag = 0;
		}else{
			$(this).css("border-color","#0E931C");
			$(this).parents("dd").find("p").css({"background":"#fff","border-color":"#fff"});
			$(this).parents("dd").find("p").html("<b style='background: url(../img/index/onSuccess.gif) no-repeat center center ;'></b>");
			flag = 1;
		}
		$(this).parents("dd").find("p").css("display","block");
	});
	$("#phone").focus(function(){
		$(this).parents("dd").find("p").css("display","none");
		$(this).css("border-color","#FF5C00");
	});
	//密码验证
	$("#pass").blur(function(){
		var pass = $(this).val();
		if(!(/^[0-9A-Za-z%^&*#@$]{6,20}$/.test(pass))){
			$(this).css("border-color","#FF0000");
			$(this).parents("dd").find("p").css({"background":"#FFEDB5","border-color":"#FF9900","color":"#ff0000"});
			$(this).parents("dd").find("p").html("<b style='background: url(../img/index/onError.gif) no-repeat center center ;'></b>密码长度限制为6-20位字符");
			flag = 0;
		}else{
			var rules=[
			{reg:/\d+/,weight:2},
			{reg:/[a-z]+/,weight:4},
			{reg:/[A-Z]+/,weight:8},
			{reg:/[~!@#\$%^&*\(\)\{\};,.\?\/'"]/,weight:16}
			];
			var strongLevel={'0-10':'弱','10-20':'中','20-30':'强'};
		    var weight=0;
		    for(var j=rules.length-1;j>=0;j--){
		        if(rules[j].reg.test(pass)){
		            weight|=rules[j].weight;
		        }
		    }
		    var key='20-30';
		    if(weight<=10)key='0-10';
		    else if(weight<=20)key='10-20';
		    console.log(weight,strongLevel[key]);	
			$(this).css("border-color","#0E931C");
			$(this).parents("dd").find("p").css({"background":"#fff","border-color":"#fff","color":"#0E931C"});
			$(this).parents("dd").find("p").html("<b style='background: url(../img/index/onSuccess.gif) no-repeat center center ;'></b>密码强度为："+strongLevel[key]);
			flag = 1;
		}
		$(this).parents("dd").find("p").css("display","block");
	});
	$("#pass").focus(function(){
		$(this).parents("dd").find("p").css("display","none");
		$(this).css("border-color","#FF5C00");
	});
	//密码重复验证
	$("#pass2").blur(function(){
		if($(this).val()){
			if($(this).val() == $("#pass").val()){
				$(this).css("border-color","#0E931C");
				$(this).parents("dd").find("p").css({"background":"#fff","border-color":"#fff"});
				$(this).parents("dd").find("p").html("<b style='background: url(../img/index/onSuccess.gif) no-repeat center center ;'></b>");
				flag = 1;
			}else{
				$(this).css("border-color","#FF0000");
				$(this).parents("dd").find("p").css({"background":"#FFEDB5","border-color":"#FF9900","color":"#ff0000"});
				$(this).parents("dd").find("p").html("<b style='background: url(../img/index/onError.gif) no-repeat center center ;'></b>2次密码不一致，请重新输入");
				flag = 0;
			}
		}else{
			$(this).css("border-color","#FF0000");
			$(this).parents("dd").find("p").css({"background":"#FFEDB5","border-color":"#FF9900","color":"#ff0000"});
			$(this).parents("dd").find("p").html("<b style='background: url(../img/index/onError.gif) no-repeat center center ;'></b>重复密码不能为空，请确认");
			flag = 0;
		}
		$(this).parents("dd").find("p").css("display","block");
	});
	$("#pass2").focus(function(){
		$(this).parents("dd").find("p").css("display","none");
		$(this).css("border-color","#FF5C00");
	});
	//图片验证码验证
	var ma = 1;
	var arr = ["hfqbhk","jktgdb","gmkrkv","2msspq","kq4yra"];
	$(".change_tu").click(function(){
		ma = Math.floor(Math.random()*5+1);
		$("img.change_tu").attr("src","../img/yanzhengma/"+ma+".jpg");
	});
	$("#yanzheng").blur(function(){
		var la = ma - 1;
		console.log($(this).val(),arr[la]);		
		if($(this).val()){
			if($(this).val() != arr[la]){
				$(this).css("border-color","#FF0000");
				$(this).parents("dd").find("p").css({"background":"#FFEDB5","border-color":"#FF9900"});
				$(this).parents("dd").find("p").html("<b style='background: url(../img/index/onError.gif) no-repeat center center ;'></b>图片验证码格式错误");
				$(this).parents("dd").find("p").css("display","block");
				flag = 0;
			}else{
				$(this).css("border-color","#ccc");
				flag = 1;
			}
		}else{
			$(this).css("border-color","#FF0000");
			$(this).parents("dd").find("p").css({"background":"#FFEDB5","border-color":"#FF9900"});
			$(this).parents("dd").find("p").html("<b style='background: url(../img/index/onError.gif) no-repeat center center ;'></b>图片验证码格式错误");
			$(this).parents("dd").find("p").css("display","block");
			flag = 0;
		}
	});
	$("#yanzheng").focus(function(){
		$(this).parents("dd").find("p").css("display","none");
		$(this).css("border-color","#FF5C00");
	});
	var flag1 = 0;
	$("#cont_check").click(function(){
		flag1 = !flag1;
		if(flag1 == 0){
			$(this).css("border-color","#FF0000");
			$(this).parents("dd").find("p").css({"background":"#FFEDB5","border-color":"#FF9900"});
			$(this).parents("dd").find("p").html("<b style='background: url(../img/index/onError.gif) no-repeat center center ;'></b>您还没同意用户协议");
			flag = 0;
			$(this).parents("dd").find("p").css("display","block");
		}else{
			$(this).parents("dd").find("p").css("display","none");
			flag = 1;
		}
		
	});
	$(".cont_sub").click(function(){
		//alert(flag)
		if(flag1 == 0){
			$(this).css("border-color","#FF0000");
			$(this).parents("dd").find("p").css({"background":"#FFEDB5","border-color":"#FF9900"});
			$(this).parents("dd").find("p").html("<b style='background: url(../img/index/onError.gif) no-repeat center center ;'></b>您还没同意用户协议");
			flag = 0;
			$(this).parents("dd").find("p").css("display","block");
		}else{
			$(this).parents("dd").find("p").css("display","none");
			flag = 1;
		}		
		 if(flag == 1&&flag1 == 1){
		 	var name = $("#phone").val();
		 	var pass = $("#pass").val();
			setCookie("name",name,setCookieDate(7),"/");
			setCookie("pass",pass,setCookieDate(7),"/");
			window.location.href = "zhuce1.html";
		 }
	});
})
