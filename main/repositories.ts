import Store from 'electron-store'
import { Repository } from './shared/types'
import simpleGit from 'simple-git'

type RepositoryStore = {
  paths: string[]
}

export const loadRepositories = async (): Promise<Repository[]> => {
  const store = new Store<RepositoryStore>()
  const paths = store.get('paths', [])

  return await Promise.all(paths.map(repoFromPath))
}

export const storeRepositories = (repositories: Repository[]) => {
  const store = new Store<RepositoryStore>()
  store.set(
    'paths',
    repositories.map((repo) => repo.path)
  )
}

export const repoFromPath = async (path: string): Promise<Repository> => {
  const git = simpleGit(path)
  return {
    path,
    name: path.split('/').slice(-1)[0],
    hasRemote: (await git.getRemotes()).length > 0,
    isClean: (await git.status()).isClean(),
    commits: (await git.log()).all,
  }
}