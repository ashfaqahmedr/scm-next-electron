import { Repository } from '../../main/shared/types'
import { createContext, useContext, useEffect, useState } from 'react'

type AppContextType = {
  repositories: Repository[]
  setRepositories: (repos: Repository[]) => void
  commits: any[]
  setCommits: (commits: any[]) => void
}

interface Props {
  [propName: string]: any
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider = (props: Props) => {
  const [repositories, setRepositories] = useState([])
  const [commits, setCommits] = useState([])

  useEffect(() => {
    const onReady = async () => {
      const { repositories, commits } = await window.ipc.signalReady()
      setRepositories(repositories)
      setCommits(commits)
    }

    onReady()
  }, [])

  const value = {
    repositories,
    setRepositories,
    commits,
    setCommits,
  }

  return <AppContext.Provider value={value} {...props} />
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppContextProvider')
  return context
}