baseUrl = 'http://localhost:8081/'
var formData = new FormData();
formData.append("file",null)
var i=0;
var clock = null;
var getnums = 0;

async function onSuccess(stream) {
    var video = document.getElementById('logincam');
    video.srcObject = stream;
	video.play() 
}

async function onError(error){
    this.error(error)
    prompt("ERROR", 'alert-danger', 2000)
}

async function uploadStream(url){
    if (getnums == -1) return
    $.ajax({
        url: url,
        type: 'post',
		processData : false,
        contentType: false,
        dataType: 'json',
        data: formData,
        success:async function(data) {
            if (data.code == '0'){
                getnums=-1
                sessionStorage.setItem("userInfo", JSON.stringify(data))
                prompt(data.msg, 'alert-success', 2000);
                await new Promise((res, rej) => {
                    setTimeout(()=>{
                        res();
                    }, 1000);
                })
                await getAvator();
                ipcRenderer.send('success-login');
            }
            else {
                //getnums++
            }
        },
        error:function(error){
            //getnums++
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

async function captureVideo(){
    if (getnums==10){
        window.clearInterval(clock)
        prompt("未识别到用户", 'alert-success', 2500);
        await new Promise((res, rej) => {
            setTimeout(()=>{
                res();
            }, 3000);
        })
        history.back(-1)
    }
    var context = document.getElementById('canvas')
    var video = document.getElementById('logincam');
    context.getContext('2d').drawImage(video, 0, 0);  
    img = context.toDataURL('image/png')
    let name = "cache" + String(getnums)
    let conversions = dataURLtoFile(img, name);
    formData.set("file", conversions)
    console.log(conversions)
    await uploadStream(baseUrl + "user/videoLogin");
    getnums++
}


$(document).ready(async function(){
    navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video:{width: 600, height: 600}}, onSuccess, onError)
    } else {
        prompt("无可用的设备", 'alert-info', 2000)
    }
    navigator.mediaDevices.enumerateDevices().then(function(devicesList){
        console.log('------devicesList', devicesList)
    });
/*
    while (getnums<=10){
        await captureVideo()
        getnums++
    }
*/  
    await new Promise((res, rej) => {
        setTimeout(()=>{
            clock=self.setInterval("captureVideo()",500);
            $("#tips").text('正在识别');
            $("#tips").fadeIn("slow");
            res();
        }, 2000);
    })
    
    
    //$("#logincam").remove()
    //await uploadStream(baseUrl + "user/saveFaceImg");
    //history.back(-1)
})

