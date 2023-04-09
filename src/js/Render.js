const ipcRenderer = require('electron').ipcRenderer;
const { shell } = require('electron');

var min = document.getElementById('min_');
var close = document.getElementById('close_');
var links = document.querySelectorAll('a[href]');
baseURL = "http://localhost:8081"
vueUrl = 'http://localhost:8082/'
var gpuURL = null
var stableURL = null

if (min) {
    min.addEventListener('click', ()=> {
        ipcRenderer.send('window-min');
    })
}
if (close) {
    close.addEventListener('click', () => {
        ipcRenderer.send('window-close');
    })
}

links.forEach(link => {
    link.addEventListener('click', e => {
        const url = link.getAttribute('href');
        e.preventDefault();
        shell.openExternal(url);
    })
})

const getGPUUrl = function(){
        $.ajax({
        url: baseURL+'/user/getURL',
        type: 'get',
        data: {                             // 请求参数
        },
        //async : false,
        //dataType: 'json',
        success:function(data_1) {
                gpuURL = data_1.data[0]
                stableURL = data_1.data[1]
                sessionStorage.setItem('gpuURL',gpuURL)
                sessionStorage.setItem('stableURL',stableURL)
                console.log(gpuURL, stableURL)
        },
        error:function(error){
            prompt("获取url失败", 'alert-info', 2000)
        }
    })
}



const getAvator = async function(){
    var json = sessionStorage.getItem('userInfo');
    var obj = JSON.parse(json);
    await $.ajax({
        url: baseURL+'/user/getAvator',
        type: 'get',
        data: {                             // 请求参数
            uname: obj.data.uname,
        },
        //async : false,
        //dataType: 'json',
        success:function(data_1) {
                sessionStorage.setItem('Avator',data_1);
                if (data_1 != ''){
                    $("#avator").attr("src", baseURL + data_1);
                    $(".disp").attr("src", baseURL + data_1);
                } 
        },
        error:function(error){
            prompt("获取头像失败", 'alert-info', 2000)
        }
    })
 }



/**
* 密码登录ajax请求
*/
function passwordLogin(){
    $.ajax({
        beforeSend:function(){
            $(".loading").append('<img src="img/loading.gif"  />');
        },
         complete: function() {$(".loading").remove();
        },
        url: baseURL+'/user/login',
        type: 'post',
        data: {                             // 请求参数
            uname: $("#username").val(),
            password: $("#password").val(),
        },
        dataType: 'json',
        success: async function(data) {
            if (data.code == '0'){
                sessionStorage.setItem("userInfo", JSON.stringify(data))
                await getAvator();
                ipcRenderer.send('success-login');
            }
            else{
                prompt(data.msg, 'alert-danger', 2000);
            }
        },
        error:function(error){
            prompt("请检查您的网络", 'alert-info', 2000)
        }
   })
}

$(document).ready(function(){
    $("#passBtn").click(passwordLogin);
    $("#videoBtn").click(function(){
        ipcRenderer.send('login-Video')
    })
});

$('.input-item').bind('keypress', function (event) {
    if (event.keyCode == "13") {
      passwordLogin();
    }
  })

/**
* 弹出式提示框，默认1.2秒自动消失
* @param message 提示信息
* @param style 提示样式，有alert-success、alert-danger、alert-warning、alert-info
* @param time 消失时间
*/
const prompt = function (message, style, time)
 {
     style = (style === undefined) ? 'alert-success' : style;
     time = (time === undefined) ? 1200 : time;
     $('<div>')
         .appendTo('body')
         .addClass('alert ' + style)
         .html(message)
         .show()
         .delay(time)
         .fadeOut();
 };


$(document).ready(function(){
    gpuURL = sessionStorage.getItem('gpuURL');
    stableURL = sessionStorage.getItem('stableURL');
    if (gpuURL == null && stableURL ==null){
        getGPUUrl()
    }
    var json = sessionStorage.getItem('userInfo');
    var obj = JSON.parse(json);
    image = sessionStorage.getItem('Avator');
    /*
    $.ajax({
        url: 'http://localhost:8081/user/getAvator',
        type: 'get',
        data: {                             // 请求参数
            uname: obj.data.uname,
        },
        //dataType: 'json',
        success:function(data) {
                img = data;
                if (img!=null){
                    $("#avator").attr("src", 'data:image/JPG;base64,'+ img);
                    $("#disp").attr("src", 'data:image/jpg;base64,'+ img);
                }
        },
        error:function(error){
            prompt("请检查您的网络", 'alert-info', 2000)
        }
    })
    */
    if (image != ''){
      $("#avator").attr("src", baseURL + image);
      $(".disp").attr("src", baseURL + image);  
    }
    $(".weltext").text("欢迎! "+obj.data.uname);
    $("#set").click(function(e){
        e.preventDefault()
        var href = vueUrl+'change'
        shell.openExternal(href)
    });
    $("#qcontainer_1").click(function(){  
        ipcRenderer.send('window_new1');
    })
    $("#qcontainer_2").click(function(){
        ipcRenderer.send('window_new2');
    })
    $("#qcontainer_3").click(function(){
        ipcRenderer.send('window_new3');
    })
    $("#qcontainer_4").click(function(){
        ipcRenderer.send('window_new4');
    })
    $("#qcontainer_5").click(function(){
        ipcRenderer.send('window_new5');
    })
    $(".icoback").click(function(){
        history.back(-1)
    });
});



