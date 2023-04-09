

let img = null;
let f = null;
//baseUrl = "http://region-41.seetacloud.com:33930/"

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
                    console.log(data.data)
                    img = document.createElement('img')
                    img.src = gpuURL + data.data
                    img.style.width = '400px'
                    img.style.height = '400px'
                    img.style.position = 'relative'
                    img.style.top = '50px'
                    $("#show").empty()
                    $("#show").append(img)
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
    $("#updatapos").click(function(){
        ipcRenderer.send('pos-Img');
    });

    $('#getImage').change(function(){
        const {files}  = this
        f = files[0]
        console.log(URL.createObjectURL(f))
        img = document.createElement('img')
        img.src = URL.createObjectURL(f)
        img.style.width = '200px'
        img.style.height = '200px'
        img.style.position = 'relative'
        img.style.top = '50px'
        $("#selectpic").empty()
        $("#selectpic").append(img)
    })

    $('#uploadimg').click(function(){
        uploadPicture(gpuURL + 'uploadImg')
    })
});