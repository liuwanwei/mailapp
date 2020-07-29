// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const replaceText = (selector, text) => {
  const element = document.getElementById(selector)
  if (element) {
    element.innerText = text
  }else{
    console.log(`couldn't find element with id ${selector}`)
  }
}

window.addEventListener('DOMContentLoaded', () => {
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
  
  if (process.pid){
    // 在调试 console 中打印
    console.log('pid: ' + process.pid)
    replaceText('pid', process.pid)
  }
})


// 通过信号方式简单通信测试代码
var counter = 1
process.on('SIGHUP', () => {
  replaceText('mail-code', counter.toString())
  counter++
});
