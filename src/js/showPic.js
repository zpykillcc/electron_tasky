//获取容器盒子
const wrapper = document.querySelector('.wrapper');
//快速生成一个length为100的数组
const list = [...new Array(100).keys()];
//打乱数组的顺序
list.sort((a, b) => Math.random() - 0.5);
//初始化索引值
let index = 0;

function fly(path) {
  //index=100时直接return
  if (index === 100) return;
  //取出当前小盒子的位置，取完后index需要自增1
  let currentVal = list[index++];
  //获取当前盒子的left和top值
  const left = currentVal % 10 * 60;
  const top = Math.floor(currentVal / 10) * 55

  //生成一个盒子
  box = document.createElement('div');
  //加上我们前面定义的类名
  box.classList.add('box');
  //设置背景图片的定位值和其他属性，这里./timg.jpg就是我们的素材图片
  box.style.cssText = `background:url('${path}') ${-left}px ${-top}px;
                   background-size: 600px 550px;`;
  //插入到容器中
  wrapper.appendChild(box);
  //生成飞入动画，需要注意在此之前我们需要先引入anime.js
  let animation = anime({
    targets: box, //目标元素，这里指当前飞入的小盒子
    left: left + 'px', //每一个小盒子的left值
    top: top + 'px', //每一个小盒子的top值
    duration: 20, //每一个小盒子飞入的执行时间，单位是毫秒
    easing: 'linear', //这里可以设置很多不一样的参数来控制动画如何执行
    //执行完当前动画后的延迟回调，因为我们需要执行100次，所以进行递归调用
    complete: function () {
      fly(path);
    }
  })
}

