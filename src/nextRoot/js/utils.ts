import QS from 'query-string'
export const a = 2

export const getQuery = (
  pick: string = '',
  str: string = location.search
): string | any => {
  const parsed = QS.parse(str)
  if (pick) {
    return (parsed[pick] as string) ?? ''
  }

  return parsed
}

export const setQuery = (newQuery: any) => {
  let searchStr

  let parsed = getQuery('')

  parsed = { ...parsed, ...newQuery }

  for (const key in parsed) {
    if (Object.prototype.hasOwnProperty.call(parsed, key)) {
      const element = parsed[key]
      if (!element) delete parsed[key]
    }
  }

  searchStr = QS.stringify(parsed)

  history.pushState(
    null,
    '',
    location.origin +
      location.pathname +
      location.hash +
      (searchStr ? '?' + searchStr : '')
  )
}
