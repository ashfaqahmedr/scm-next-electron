// ./main/preload.ts
const { contextBridge, ipcRenderer } = require("electron")

const handler = {
  selectRepositories: () => ipcRenderer.invoke("select-repositories"),
  getRecentCommits: () => ipcRenderer.invoke("get-recent-commits"),
  // part two:
  viewRepository: (id: number) => ipcRenderer.invoke("view-repository", id),
}

contextBridge.exposeInMainWorld("ipc", handler)

export type IpcHandler = typeof handler