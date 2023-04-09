var ffmpeg = require('fluent-ffmpeg')

var file;
file = $('<input type="file" />');
let f = null;

/*
const transcode = async function({ target: { files } }){
    const sourceBuffer = await fetch("input.avi").then(r => r.arrayBuffer());
}
*/

function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { 
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}


async function uploadVideo(url){
    var json = sessionStorage.getItem('userInfo');
    var obj = JSON.parse(json);
    var formData = new FormData(); 
    formData.append('uname', obj.data.uname);
	formData.append('file', f);
    if (!f){
        prompt('未选择视频', 'alert-danger', 2000);
    }
    else{
        await $.ajax({
            beforeSend:function(){
                $(".loading").append('<img src="img/loading.gif"  />');
            },
             complete: function() {
                $(".loading").empty();
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
                    console.log (data.data)
                    var videoSrc = gpuURL + data.data
                    console.log(videoSrc)
                    $("#video").attr("src", gpuURL + data.data);
                   
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


$(document).ready(function(){
    $("#upposvideo").click(function(){
        ipcRenderer.send('pos-Video');
    });
    $('#capture').click(function(){
        file.click();
    })

    file.change(function(){
        var objUrl = getObjectURL(this.files[0]);
        f = this.files[0]
        console.log("objUrl = " + objUrl);
        if (objUrl) {
            $("#preview").attr("src", objUrl);
        }
    })

    $('#refresh').click(function(){
        $("#preview").attr("src", "");
        $("#video").attr("src", "");    
    })

    $('#subbmit').click(function(){
        uploadVideo(gpuURL +'uploadVideo')
        //f=null;
    })
});