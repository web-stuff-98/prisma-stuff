import { useContext, createContext, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/router'

/*
should have put this stuff in a reducer
*/

const FilterContext = createContext<
  | {
      searchTags: string[]
      autoAddRemoveSearchTag: (tag: string) => void
      pageCount: number
      fullCount: number
      maxPage: number
      setPageCount: (to: number) => void
      setFullCount: (to: number) => void
      setMaxPage: (to: number) => void
    }
  | any
>(undefined)

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [searchTags, setSearchTags] = useState<string[]>([])
  const [pageCount, setPageCount] = useState(0)
  const [fullCount, setFullCount] = useState(0)
  const [maxPage, setMaxPage] = useState(1)

  const { push, query } = useRouter()
  const autoAddRemoveSearchTag = (tag: string) => {
    const { tags: rawTags } = query
    let tags: string[] = []
    if (rawTags)
      tags = String(rawTags)
        .replaceAll(' ', '+')
        .split('+')
        .filter((tag: string) => tag !== '')
    if (tags.includes(tag)) tags = tags.filter((t: string) => t !== tag)
    else tags = [...tags, tag]
    setSearchTags(tags)
    push(`/blog/page/1${tags.length > 0 ? `?tags=` + tags.join('+') : ''}`)
  }

  return (
    <FilterContext.Provider
      value={{
        searchTags,
        autoAddRemoveSearchTag,
        setFullCount,
        fullCount,
        setPageCount,
        pageCount,
        maxPage,
        setMaxPage,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => useContext(FilterContext)
