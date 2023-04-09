baseUrl = 'http://localhost:8081/'
var formData = new FormData();
var json = sessionStorage.getItem('userInfo');
var obj = JSON.parse(json);
var i=0;

async function onSuccess(stream) {
    var video = document.getElementById('facecam');
    video.srcObject = stream;
	video.play() 
}

async function onError(error){
    this.error(error)
    prompt("ERROR", 'alert-danger', 2000)
}

async function uploadStream(url){
    formData.append('uname', obj.data.uname);
    await $.ajax({
        beforeSend:function(){
            $(".loading").append('<img src="img/loading.gif"/>');
        },
        complete: function() {$(".loading").empty();
        },
        url: url,
        type: 'post',
		processData : false,
        contentType: false,
        dataType: 'json',
        data: formData,
        success:function(data) {
            if (data.code == '0'){
                prompt(data.msg, 'alert-success', 2000);
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


function dataURLtoFile(dataurl, filename = 'file') {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let suffix = mime.split('/')[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, {
      type: mime
    })
  }

function captureVideo(){
    var context = document.getElementById('canvas')
    var video = document.getElementById('facecam');
    context.getContext('2d').drawImage(video, 0, 0);  
    img = context.toDataURL('image/png')
    let name = obj.data.uname + String(i++)
    let conversions = dataURLtoFile(img, name);
    formData.append("file", conversions)
}


$(document).ready(async function(){
    navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;
    if (navigator.getUserMedia) {
        await navigator.getUserMedia({video:{width: 600, height: 500}}, onSuccess, onError)
    } else {
        prompt("无可用的设备", 'alert-info', 2000)
    }
    navigator.mediaDevices.enumerateDevices().then(function(devicesList){
        console.log('------devicesList', devicesList)
    });
    var clock = null;
    await new Promise((res, rej) => {
        setTimeout(()=>{
            clock=self.setInterval("captureVideo()",500);
            $("#tips").text('保持姿势不变');
            $("#tips").fadeIn("slow");
            res();
        }, 2000);
    })
    
    await new Promise((res, rej) => {
        setTimeout(() => {
            $("#tips").fadeOut("slow");
            res()
        }, 3000)
    })

    await new Promise((res, rej) => {
        setTimeout(() => {
            $("#tips").text('缓慢向左转');
            $("#tips").fadeIn("slow");
            res()
        }, 1000)
    })

    await new Promise((res, rej) => {
        setTimeout(() => {
            $("#tips").fadeOut("slow");
            res()
        }, 3000)
    })

    await new Promise((res, rej) => {
        setTimeout(() => {
            $("#tips").text('缓慢向右转');
            $("#tips").fadeIn("slow");
            res()
        }, 1000)
    })

    await new Promise((res, rej) => {
        setTimeout(() => {
            $("#tips").fadeOut("slow");
            res()
        }, 3000)
    })

    await new Promise((res, rej) => {
        setTimeout(() => {
            window.clearInterval(clock)
            res()
        }, 1000)
    })
    $("#facecam").remove()
    await uploadStream(baseUrl + "user/saveFaceImg");
    await new Promise((res, rej) => {
        setTimeout(() => {
            res()
        }, 2000)
    })
    history.back(-1)
})

