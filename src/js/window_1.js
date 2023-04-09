const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
var img = null;
var Img = null;
var f = null;
var nowModel = null
let imgindex = 0
baseUrl = 'http://localhost:8081/'

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


function uploadPicture(url){
    var json = sessionStorage.getItem('userInfo');
    var obj = JSON.parse(json);
    var formData = new FormData(); 
    formData.append('uname', obj.data.uname);
	formData.append('file', f);
    //img.decode()
    if (!f){
        prompt('未选择图片', 'alert-danger', 2000);
    }
    else{
        $.ajax({
            beforeSend:function(){
                $(".loading").append('<img src="img/loading.gif"  />');
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
                    prompt('上传成功', 'alert-success', 2000);
                    sessionStorage.setItem("userAvator", JSON.stringify(data))
                    getAvator();
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
} 

async function changeModel(url, mod){
    option_payload = {
        "sd_model_checkpoint": mod,
    }
    await $.ajax({
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
            data: JSON.stringify(option_payload),
            success:function(data) {
                console.log(data)
            },
            error:function(error){
                prompt("请检查您的网络", 'alert-info', 2000)
            }
        })
}

async function postStableDiffusionImage(url,actProm, imgdata, lora){
    init_images = new Array();
    Lora = ''
    if (lora != ''){
       Lora = ",<"+lora+">" 
    }
    console.log(Lora)
    init_images[0]=imgdata
    info = {
        "init_images" : init_images,
        "resize_mode": 0,
        "denoising_strength": 0.65,
        "image_cfg_scale": 0,
        //"mask": "",
        "mask_blur": 4,
        "prompt": actProm +Lora,
        "styles": [
            ""
        ],
        "seed": -1,
        "subseed": -1,
        "subseed_strength": 0,
        "seed_resize_from_h": -1,
        "seed_resize_from_w": -1,
        "sampler_name": "Euler a",
        "batch_size": 1,
        "n_iter": 1,
        "steps": 50,
        "cfg_scale": 7,
        "width": 512,
        "height": 512,
        "restore_faces": true,
        "tiling": false,
        "do_not_save_samples": false,
        "do_not_save_grid": false,
        "negative_prompt": " text, close up, cropped, out of frame, worst quality, \
                            low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, \
                            poorly drawn hands, poorly drawn face, mutation, deformed, \
                            blurry, dehydrated, bad anatomy, bad proportions, \
                            extra limbs, cloned face, disfigured, gross proportions, \
                            malformed limbs, missing arms, missing legs, \
                            extra arms, extra legs, fused fingers, too many fingers, long neck",
        "eta": 0,
        "s_churn": 0,
        "s_tmax": 0,
        "s_tmin": 0,
        "s_noise": 1,
        "override_settings": {},
        "override_settings_restore_afterwards": true,
        "script_args": [],
        "sampler_index": "Euler",
        "include_init_images": false,
        "script_name": "",
        "send_images": true,
        "save_images": false,
        "alwayson_scripts": {}
    }
    await $.ajax({
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
            result = "data:image/png;base64,"+data.images[0]
            const dataBuffer = new Buffer(data.images[0], 'base64');
            await fsImg(dataBuffer)
            let name = "avator"
            f = dataURLtoFile(result, name);
            $(".wrapper").children(".box").append(Img)
            $(".imgWrapper").show(); 
            $("html,body").animate({ scrollTop: "0px" }, 200);
            fly('./cache/avator'+imgindex+'.png')
        },
        error:function(error){
            prompt("请检查您的网络", 'alert-info', 2000)
        }
   })
}

async function fsImg(dataBuffer){
    return new Promise((resolve, reject) => {
        fs.writeFile('src/cache/avator'+imgindex+'.png', dataBuffer, function (err){
            if (err)
                console.log(err);
            resolve()
        })
    })
}

async function getInterrogate(url){
    if (!img){
        prompt('未选择图片', 'alert-danger', 2000);
    }
    else{
        var model = $('#model').val()
        var lora = $('#lora').val()
        if (model != nowModel){
            await changeModel(stableURL+"sdapi/v1/options", model)
            nowModel = model
        }
        var canvas = document.createElement("canvas");
        canvas.width = img.width
        canvas.height = img.height
        var ctx = canvas.getContext("2d");
	    ctx.drawImage(img, 0, 0, img.width, img.height);
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

function getModels(url){
    $.ajax({
        url: url,
        type: 'get',
        //processData : false,
        contentType: 'application/json',
        dataType: 'json',
        success:function(data) {
            var models = new Array();
            for (k=0;k<data.length;k++){
                models[k] = data[k].title
                $("#model").append("<option value='"+models[k]+"'>"+models[k]+"</option>");
            }
        },
        error:function(error){
            prompt("请检查您的网络", 'alert-info', 2000)
        }
    })
}


$(document).ready(function(){
    $("#updatepic").click(function(){
        getModels(stableURL+"sdapi/v1/sd-models")
        $("#racePop").show(); 
        $("html,body").animate({ scrollTop: "0px" }, 200);   
    });
    $("#aClose").click(function (event) {
        $("#racePop").hide();
    });
    $("#updatevideo").click(function(){
        if (confirm("是否调用摄像头")){
            ipcRenderer.send('use-Video')
        } 
    });


    $('#getpic').change(function(){
        const {files}  = this
        f = files[0]
        console.log(URL.createObjectURL(f))
        img = document.createElement('img')
        img.src = URL.createObjectURL(f)
        img.style.width = '150px'
        $("#selectpic").empty()
        $("#selectpic").append(img)
    })
    $('#upload').click(function(){
        getInterrogate(stableURL+"sdapi/v1/interrogate")
    })
    
    $('#setAvator').click(function(){
        uploadPicture(baseUrl+'user/excavator')
    })

    $('#closeAvator').click(function(){
        $(".wrapper").empty()
        imgindex++
        index = 0
        $(".imgWrapper").hide();
    })
});