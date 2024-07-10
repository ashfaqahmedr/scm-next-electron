import { ExclamationCircleIcon, RssIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { useAppContext } from '../../context/AppContextProvider'

export default function RepositoryView() {
  const { repositories } = useAppContext()
  const router = useRouter()
  const { name } = router.query

  const repository = repositories.find((repo) => repo.name === name)
  const commits = repository?.commits || []
  const commitsByContributor = commits.reduce((acc, commit) => {
    if (acc[commit.author_name]) {
      acc[commit.author_name]++
    } else {
      acc[commit.author_name] = 1
    }
    return acc
  }, {})

  const topContributors = Object.entries(commitsByContributor)
    .map(([name, count]) => ({ name, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return (
    <Layout>
      {repository && (
        <div className="p-3">
          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">{repository.name}</h1>

            <div className="flex gap-1">
              {!repository.isClean && (
                <span className="flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-gray-500/10">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  Uncommitted changes
                </span>
              )}
              {repository.hasRemote && (
                <span className="flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-gray-500/10">
                  <RssIcon className="w-4 h-4" />
                  Remote available
                </span>
              )}
              <span className="flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-gray-500/10">
                {repository.commits.length} commits
              </span>
            </div>
          </div>
          <h2 className="text-xs mb-5">{repository.path}</h2>

          <div className="bg-gray-50 rounded-sm ring-1 ring-gray-200 p-2">
            <h2 className="font-semibold mb-2">Top contributors</h2>
            <ol className="list-decimal list-inside">
              {topContributors.map(({ name, count }) => (
                <li key={name}>
                  <span className="font-medium">{name}</span> - {count} commits
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </Layout>
  )
}