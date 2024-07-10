import Image from 'next/image'
import Layout from '../components/Layout'
import { useAppContext } from '../context/AppContextProvider'

export default function Home() {
  const { commits } = useAppContext()

  return (
    <Layout>
      <div className="divide-y divide-gray-100">
        {commits.map((commit, i) => (
          <div key={i} className="p-3 hover:bg-gray-50">
            <div className="flex gap-2 mb-2 items-center text-gray-900">
              <div>
                <Image
                  src={`https://www.gravatar.com/avatar/${commit.avatarHash}.jpg?d=robohash`}
                  width={26}
                  height={26}
                  className="w-6 h-6 rounded-full ring-1 ring-teal-400/70 bg-gray-100"
                  alt=""
                />
              </div>
              <div className="font-medium text-xs">{commit.author_name}</div>
              <div className="text-xs">{commit.date.substring(0, 10)}</div>
              <span className="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                {commit.repository}@{commit.hash.substring(0, 7)}
              </span>
            </div>
            <div className="ml-0 w-full flex justify-between">
              <span className="text-sm ml-8 text-gray-700">{commit.message}</span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}