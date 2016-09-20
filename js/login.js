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
			$(this).css("border-color","#0E931C");
			$(this).parents("dd").find("p").css({"background":"#fff","border-color":"#fff","color":"#0E931C"});
			$(this).parents("dd").find("p").html("<b style='background: url(../img/index/onSuccess.gif) no-repeat center center ;'></b>");
			flag = 1;
		}
		$(this).parents("dd").find("p").css("display","block");
	});
	$("#pass").focus(function(){
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
	$(".cont_sub").click(function(){
		var cookies = document.cookie;
		var cook=cookies.split("; ");
		console.log(cook);
		var name = $("#phone").val();
		var pass = $("#pass").val();
		if(getCookie("name") == name){
			if(getCookie("pass") == pass){
				
				setCookie("oname",name,setCookieDate(7),"/");
				//alert("登陆成功！");
				$(this).parents("dd").find("p").css("display","none");
				window.location.href = "../index.html";
			}else{
				$(this).parents("dd").find("p").css({"background":"#FFEDB5","border-color":"#FF9900","color":"#ff0000"});
				$(this).parents("dd").find("p").html("<b style='background: url(../img/index/onError.gif) no-repeat center center ;'></b>密码输入错误！");
				$(this).parents("dd").find("p").css("display","block");
			}
		}else{
			$(this).parents("dd").find("p").css({"background":"#FFEDB5","border-color":"#FF9900","color":"#ff0000"});
			$(this).parents("dd").find("p").html("<b style='background: url(../img/index/onError.gif) no-repeat center center ;'></b>用户名不存在");
			$(this).parents("dd").find("p").css("display","block");
		}
	})
})
