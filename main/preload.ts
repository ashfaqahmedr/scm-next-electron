const { contextBridge, ipcRenderer } = require("electron")

const handler = {
  selectRepositories: () => ipcRenderer.invoke("select-repositories"),
  getRecentCommits: () => ipcRenderer.invoke("get-recent-commits"),
  signalReady: () => ipcRenderer.invoke('ready'),
}

contextBridge.exposeInMainWorld("ipc", handler)

export type IpcHandler = typeof handler