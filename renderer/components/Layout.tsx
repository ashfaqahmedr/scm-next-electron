import {
    ChatBubbleOvalLeftEllipsisIcon,
    CodeBracketIcon,
    ExclamationCircleIcon,
    PlusIcon,
    RssIcon,
  } from '@heroicons/react/24/outline'
  import Link from 'next/link'
  import { useAppContext } from '../context/AppContextProvider'
  
  export default function Layout({ children }: { children: React.ReactNode }) {
    const { repositories, setRepositories, setCommits } = useAppContext()
  
    const selectRepositories = async () => {
      const repos = await window.ipc.selectRepositories()
      setRepositories(repos)
  
      const commits = await window.ipc.getRecentCommits()
      setCommits(commits)
    }
  
    return (
      <div className="overflow-x-hidden">
        <div className="w-64 fixed bg-stone-900 flex flex-col inset-y-0 ">
          <h1 className="drag h-10 font-semibold text-gray-300 flex items-center justify-end border-b border-stone-800 mr-3">
            <div className="flex items-center gap-1">
              Chomp Git <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
              <h1 className="drag h-10 font-semibold text-gray-300 flex items-center justify-end border-b border-stone-800 mr-3">
  <Link href="/home" className="flex items-center gap-1 no-drag">
    Chomp Git <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
  </Link>
</h1>
            </div>
          </h1>
          <div className="flex grow flex-col bg-stone-900 overflow-y-auto px-3.5 mt-3">
            <div className="text-sm font-semibold leading-6 text-gray-400 flex items-center px-1">
              <CodeBracketIcon className="h-5 w-5 mr-2" /> <Link href="/home">Repositories</Link>
              <PlusIcon
                onClick={() => selectRepositories()}
                className="ml-auto h-4 w-4 text-gray-400 hover:text-gray-200 ring-1 rounded-sm ring-gray-400 hover:ring-gray-200"
              />
            </div>
            <ul className="mt-5 ml-1 space-y-2 text-xs">
              {repositories.map((repo, i) => (
                <li key={i}>
                  <Link
                    href={`/repository/${repo.name}`}
                    className="flex items-center text-gray-400 hover:text-gray-200 justify-between"
                  >
                    {repo.name}
                    <div className="flex gap-1 items-center">
                      {!repo.isClean && <ExclamationCircleIcon className="h-4 w-4 text-yellow-400/40" />}
                      {repo.hasRemote && <RssIcon className="h-4 w-4 text-green-400/40" />}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pl-64">{children}</div>
      </div>
    )
  }