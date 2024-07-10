// ./main/handlers.ts
import { dialog, ipcMain } from 'electron'
import simpleGit from 'simple-git'
import crypto from 'crypto'

// we're going to store our repository data in memory for demo purposes
const repositories = []

export const bindHandlers = () => {
  ipcMain.handle('select-repositories', async () => {
    const { filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] })

    for (const path of filePaths) {
      if (repositories.find(repository => repository.name === path)) continue
      try {
        const git = simpleGit(path)
        const repository = {
          name: path.split('/').slice(-1),
          hasRemote: (await git.getRemotes()).length > 0,
          isClean: (await git.status()).isClean(),
          commits: (await git.log()).all,
        }
        repositories.push(repository)
      } catch (e) {
        // probably not a git repository; ignore
      }
    }

    return repositories.map(({ name, hasRemote, isClean }) => ({ name, hasRemote, isClean }))
  })

  ipcMain.handle('get-recent-commits', async () => {
    const commits = []
    for (const repository of repositories) {
      for (const commit of repository.commits) {
        commits.push({
          repository: repository.name,
          avatarHash: crypto.createHash('md5').update(commit.author_email).digest('hex'),
          ...commit,
        })
      }
    }
    return commits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 500)
  })
}