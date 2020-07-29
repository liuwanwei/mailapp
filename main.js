// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

/**
 * IPC 服务端
 * 参考：https://gist.github.com/eddieantonio/e17a3e8a093c2e84090a35a9bd2c83d0
 */
function createLocalIpcServer () {
  var net = require('net')
  var server = net.createServer(client => {
    const chunks = []
    console.log('client connected')
    client.setEncoding('utf8')

    client.on('end', () => {
      console.log('client disconnected')
    })

    client.on('data', chunk => {
      console.log(`Got data: ${chunk}`)
      chunks.push(chunk)

      if (chunk.match(/\r\n$/)) {
        const {ping} = JSON.parse(chunks.join(''))
        client.write(JSON.stringify({pong: ping}))
      }
    })
  })

  server.on('listening', () => {
    console.log('server listening')
  })
  server.listen('/tmp/mailipc.sock')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  createLocalIpcServer()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
