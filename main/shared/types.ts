import { DefaultLogFields, ListLogLine } from "simple-git"

type Commit = (DefaultLogFields & ListLogLine)

export type Repository = {
  path: string
  name: string
  hasRemote: boolean
  isClean: boolean
  commits: readonly Commit[]
}