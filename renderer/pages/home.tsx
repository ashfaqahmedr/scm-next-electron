import { useState } from 'react'
import { ChatBubbleOvalLeftEllipsisIcon, CodeBracketIcon, ExclamationCircleIcon, PlusIcon, RssIcon, } from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function Home() {
  const [repositories, setRepositories] = useState([])
  const [commits, setCommits] = useState([])

  const selectRepositories = async () => {
    const repos = await window.ipc.selectRepositories()
    setRepositories(repos)

    const commits = await window.ipc.getRecentCommits()
    setCommits(commits)
  }

  return (
    <div className="overflow-x-hidden">
      <div className="w-64 fixed bg-stone-900 flex flex-col inset-y-0 ">
        <h1 className="h-10 font-semibold text-gray-300 flex items-center justify-end border-b border-stone-800 mr-3">
          <div className="flex items-center gap-1">
            Chomp Git <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
          </div>
        </h1>
        <div className="flex grow flex-col bg-stone-900 overflow-y-auto px-3.5 mt-3">
          <div className="text-sm font-semibold leading-6 text-gray-400 flex items-center px-1">
            <CodeBracketIcon className="h-5 w-5 mr-2" /> Repositories
            <PlusIcon
              onClick={() => selectRepositories()}
              className="ml-auto h-4 w-4 text-gray-400 hover:text-gray-200 ring-1 rounded-sm ring-gray-400 hover:ring-gray-200"
            />
          </div>
          <ul className="mt-5 ml-1 space-y-2 text-xs">
            {repositories.map((repo, i) => (
              <li key={i} className="flex items-center text-gray-400 hover:text-gray-200 justify-between">
                {repo.name}
                <div className="flex gap-1 items-center">
                  {!repo.isClean && <ExclamationCircleIcon className="h-4 w-4 text-yellow-400/40" />}
                  {repo.hasRemote && <RssIcon className="h-4 w-4 text-green-400/40" />}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="pl-64 mx-3.5 my-2">
        <div className="space-y-1.5">
          {commits.map((commit, i) => (
            <div key={i} className="flex text-sm align-text-top">
              <div className="shrink-0 flex gap-1 items-center">
                <div>
                  <Image src={`https://www.gravatar.com/avatar/${commit.avatarHash}.jpg?d=robohash`} width={20} height={20} className="rounded-full ring-1 ring-gray-500/10" alt="" />
                </div>
                {commit.date.substring(0, 10)}
              </div>
              <div className="ml-1 w-full flex justify-between">
                <span className="font-semibold truncate ">{commit.message}</span>
                <span className="mx-1 inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  {commit.repository}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}