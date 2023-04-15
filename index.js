//引入两个模块：app 和 BrowserWindow

//app 模块，控制整个应用程序的事件生命周期。
//BrowserWindow 模块，它创建和管理程序的窗口。
const path = require('path')
const { app, BrowserWindow, Tray, Menu} = require('electron')
const iconPath = path.join(__dirname,'./src/img/icon.PNG')
const url = require('node:url');
//在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口

let mainWindow, tray
let ipcMain = require('electron').ipcMain;

const { autoUpdater } = require('electron-updater')
function checkUpdate(){
  //检测更新
  autoUpdater.checkForUpdates()
  
  //监听'error'事件
  autoUpdater.on('error', (err) => {
    console.log(err)
  })
  
  //监听'update-available'事件，发现有新版本时触发
  autoUpdater.on('update-available', () => {
    console.log('found new version')
  })
  
  //默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false
  
  //监听'update-downloaded'事件，新版本下载完成时触发
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '应用更新',
      message: '发现新版本，是否更新？',
      buttons: ['是', '否']
    }).then((buttonIndex) => {
      if(buttonIndex.response == 0) {  //选择是，则退出程序，安装新版本
        autoUpdater.quitAndInstall() 
        app.quit()
      }
    })
  })
}





app.on('ready', () => {
  //创建一个窗口
  //console.log('just test console.log')
  checkUpdate()
  mainWindow = new BrowserWindow({
    frame: false,
    resizable:true,
    width: 800,
    height: 800,
    icon: iconPath,
    webPreferences:{
      webSecurity: false,
      backgroundThrottling: false,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, './preload.js')
    }
  })
  mainWindow.removeMenu()
  //窗口加载html文件
  mainWindow.loadURL(`file://${__dirname}/src/main.html`)

  ipcMain.on('window-min', function() {
    mainWindow.minimize();
  })
  ipcMain.on('window-close', function() {
    mainWindow.hide();
  })

  ipcMain.on('window_new1',function() {
    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'./src/new_1.html'),
    protocol: 'file:',
    slashes: true
  }))
  })

  ipcMain.on('window_new2',function() {
    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'./src/new_2.html'),
    protocol: 'file:',
    slashes: true
  }))
  })

  ipcMain.on('window_new3',function() {
    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'./src/new_3.html'),
    protocol: 'file:',
    slashes: true
  }))
  })

  ipcMain.on('window_new4',function() {
    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'./src/new_4.html'),
    protocol: 'file:',
    slashes: true
  }))
  })

  ipcMain.on('window_new5',function() {
    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'./src/new_5.html'),
    protocol: 'file:',
    slashes: true
  }))
  })
  
  ipcMain.on('use-Video',function() {
    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'./src/video.html'),
    protocol: 'file:',
    slashes: true
  }))
  })

  ipcMain.on('use-Text',function() {
    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'./src/getText.html'),
    protocol: 'file:',
    slashes: true
  }))
  })

  ipcMain.on('pos-Img',function() {
    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'./src/getPoseImg.html'),
    protocol: 'file:',
    slashes: true
  }))
  })

  ipcMain.on('pos-Video',function() {
    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'./src/getPoseVideo.html'),
    protocol: 'file:',
    slashes: true
  }))
  })

  ipcMain.on('get_FaceImg',function() {
    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'./src/getFaceVideo.html'),
    protocol: 'file:',
    slashes: true
  }))
  })

  ipcMain.on('login-Video',function() {
    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'./src/loginVideo.html'),
    protocol: 'file:',
    slashes: true
  }))
  })

  ipcMain.on('success-login',function() {
    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'./src/base.html'),
    protocol: 'file:',
    slashes: true
  }))
  })
  tray = new Tray(iconPath)
  tray.setToolTip('Tasky')
  tray.on('click', () => {
    if (mainWindow.isVisible()){
      mainWindow.hide()
    }else{
      mainWindow.show()
    }
  })

  tray.on('right-click',() => {
    const menuConfig = Menu.buildFromTemplate([
      {
        label: 'Quit' ,
        click: () => app.quit()
      }
    ])
    tray.popUpContextMenu(menuConfig)
  })

})



