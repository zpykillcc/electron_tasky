

let img = null;
let f = null;
baseUrl = 'http://localhost:8081/'

async function uploadPicture(url){
    var json = sessionStorage.getItem('userInfo');
    var obj = JSON.parse(json);
    var formData = new FormData(); 
    formData.append('uname', obj.data.uname);
	formData.append('file', f);
    //img.decode()
    if (!img){
        prompt('未选择图片', 'alert-danger', 2000);
    }
    else{
        await $.ajax({
            beforeSend:function(){
                document.getElementById('word').innerHTML="识别结果:";
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
                    prompt('识别成功', 'alert-success', 2000);
                    var result = JSON.parse(data.data)
                    for (var i = 0; i < result.words_result_num; i++){
                        console.log(result.words_result[i].words)
                        $('#word').append("<br/>" + result.words_result[i].words)
                    }
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

function showText(){
        var story = document.getElementById('word');
        var s = document.getElementById('show');
        var i = 0;
        timer=setInterval(function(){
            s.innerHTML=story.innerHTML.substring(0,i);
            i++;
            if(s.innerHTML==story.innerHTML){
                clearInterval(timer);
            }
        },40);
}


$(document).ready(function(){
    $("#uptextimage").click(function(){
        ipcRenderer.send('use-Text');
    });

    $('#getText').change(function(){
        const {files}  = this
        f = files[0]
        console.log(URL.createObjectURL(f))
        img = document.createElement('img')
        img.src = URL.createObjectURL(f)
        img.style.width = '300px'
        img.style.height = '300px'
        img.style.position = 'relative'
        img.style.top = '50px'
        $("#selectpic").empty()
        $("#selectpic").append(img)
    })

    $('#uploadText').click(async function(){
        await uploadPicture(baseUrl + 'user/postTextImage')
        showText();
    })
});