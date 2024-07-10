import { BrowserWindow, dialog, ipcMain } from 'electron'
import crypto from 'crypto'
import { loadRepositories, repoFromPath, storeRepositories } from './repositories'
import { Repository } from './shared/types'

export const bindHandlers = (window: BrowserWindow) => {
  ipcMain.handle('ready', async () => {
    const repositories = await loadRepositories()
    const commits = await getRecentCommits(repositories)
    window.show()
    return  //{ repositories: filterRepositories(repositories), commits }
  })

  ipcMain.handle('select-repositories', async () => {
    const { filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] })
    const repositories = await loadRepositories()

    for (const path of filePaths) {
      if (repositories.find((repository) => repository.path === path)) continue
      try {
        const repository = await repoFromPath(path)
        repositories.push(repository)
      } catch (e) {
        // probably not a git repository; ignore
      }
    }

    storeRepositories(repositories)
    return repositories
  })

  ipcMain.handle('get-recent-commits', async () => {
    const repositories = await loadRepositories()
    return await getRecentCommits(repositories)
  })
}

const getRecentCommits = async (repositories: Repository[]) => {
  const commits = repositories.flatMap((repository) =>
    repository.commits.map((commit) => ({
      repository: repository.name,
      avatarHash: crypto.createHash('md5').update(commit.author_email).digest('hex'),
      ...commit,
    }))
  )
  return commits
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 500)
}