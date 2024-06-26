const { contextBridge, ipcRenderer } = require('electron');

//这里将全局信息暴露出来，以供renderer.js 使用
contextBridge.exposeInMainWorld('versions', {
    node:()=>process.versions.node,
    chrome:()=>process.versions.chrome,
    electron:()=>process.versions.electron,
    //暴露一个被称为 ipcRenderer.invoke 的ping函数来触发该处理程序
    ping:(strParam1, strParam2)=>ipcRenderer.invoke('ping', strParam1, strParam2),
    //暴露一个 setTitle 方法，它将title值发送到main处理（单向）
    setTitle: (title)=>ipcRenderer.send('set-title', title),
    //暴露一个文件选择窗口的调用方法 openFile （双向）
    openFile: ()=>ipcRenderer.invoke("dialog:openFile"),
    //暴露一个 onUpdateCounter 方法，用于接收 主进程 送来的 信息。（这是一个监听函数）
    onUpdateCounter:(callback)=>ipcRenderer.on('update-counter', (_event, value)=>callback(value))
});

window.addEventListener('DOMContentLoaded', ()=>{
    const replaceText = (selector, text)=>{
        const element = document.getElementById(selector)
        if(element) element.innerText = text;
    }
    for(const dependency of ['chrome', 'node', 'electron']){
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
});