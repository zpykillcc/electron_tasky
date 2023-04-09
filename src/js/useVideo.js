const { get } = require("animejs");
var capture = 0

async function onSuccess(stream) {
    var video = document.getElementById('webcam');
    video.srcObject = stream;
	video.play() 
}

async function onError(error){
    this.error(error)
    prompt("ERROR", 'alert-danger', 2000)
}


async function getVideoInterrogate(url){
    if (capture == 0){
        prompt('未拍摄照片', 'alert-danger', 2000);
    }
    else{
        var model = $('#model').val()
        var lora = $('#lora').val()
        if (model != nowModel){
            await changeModel(stableURL+"sdapi/v1/options", model)
            nowModel = model
        }    
        console.log(model)
        console.log(lora)
        var canvas = document.getElementById('canvas')
	    var dataURL = canvas.toDataURL("image/png");
        var info ={
            "image": dataURL,
            "model": "clip",
        };
        $.ajax({
            beforeSend:function(){
                $(".loading").append('<img src="img/loading.gif"  />');
            },
             complete: function() {$(".loading").empty();
            },
            url: url,
            type: 'post',
			//processData : false,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(info),
            success:async function(data) {
                activePrompt = "best quality, ultra-detailed, masterpiece, finely detail, highres, 8k wallpaper，best quality, ultra-detailed, masterpiece, finely detail, highres, 8k wallpaper，"+data.caption
                await postStableDiffusionImage(stableURL+"sdapi/v1/img2img",activePrompt, dataURL,lora)
            },
            error:function(error){
                prompt("请检查您的网络", 'alert-info', 2000)
            }
       })
    };
}



$(document).ready(function(){
    navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video:{width: 700, height: 600}}, onSuccess, onError)
    } else {
        prompt("无可用的设备", 'alert-info', 2000)
    }
    navigator.mediaDevices.enumerateDevices().then(function(devicesList){
        console.log('------devicesList', devicesList)
    });
   
    getModels(stableURL+"sdapi/v1/sd-models")

    $('#capture').click(function(){
            
            this.showVideo = false
            var context = document.getElementById('canvas').getContext('2d');
            var video = document.getElementById('webcam');
            context.drawImage(video, 0, 0);    
            capture = 1
    })

    $('#refresh').click(function(){
        capture = 0
        var context = document.getElementById('canvas').getContext('2d');
        context.clearRect(0,0,800,600)
    })

    $('#subbmit').click(function(){
        getVideoInterrogate(stableURL+"sdapi/v1/interrogate")
    })
})