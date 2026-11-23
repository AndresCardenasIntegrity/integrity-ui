export type IntegrityPaginationToken = number | 'ellipsis'

export function getPaginationBounds(page: number, pageSize: number, totalItems: number) {
  const safePageSize = Math.max(1, Math.floor(pageSize))
  const safeTotal = Math.max(0, Math.floor(totalItems))
  const totalPages = Math.max(1, Math.ceil(safeTotal / safePageSize))
  const safePage = Math.min(Math.max(1, Math.floor(page)), totalPages)

  if (safeTotal === 0) {
    return {
      page: 1,
      pageSize: safePageSize,
      totalPages: 1,
      from: 0,
      to: 0,
    }
  }

  const from = (safePage - 1) * safePageSize + 1
  const to = Math.min(safePage * safePageSize, safeTotal)

  return {
    page: safePage,
    pageSize: safePageSize,
    totalPages,
    from,
    to,
  }
}

export function computePaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): IntegrityPaginationToken[] {
  const safeTotal = Math.max(1, Math.floor(totalPages))
  const safeCurrent = Math.min(Math.max(1, Math.floor(currentPage)), safeTotal)
  const totalNumbers = siblingCount * 2 + 5

  if (safeTotal <= totalNumbers) {
    return Array.from({ length: safeTotal }, (_, i) => i + 1)
  }

  const leftSibling = Math.max(safeCurrent - siblingCount, 1)
  const rightSibling = Math.min(safeCurrent + siblingCount, safeTotal)

  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < safeTotal - 1

  const result: IntegrityPaginationToken[] = []

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3 + 2 * siblingCount
    for (let i = 1; i <= leftCount; i++) result.push(i)
    result.push('ellipsis', safeTotal)
    return result
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + 2 * siblingCount
    result.push(1, 'ellipsis')
    for (let i = safeTotal - rightCount + 1; i <= safeTotal; i++) result.push(i)
    return result
  }

  result.push(1, 'ellipsis')
  for (let i = leftSibling; i <= rightSibling; i++) result.push(i)
  result.push('ellipsis', safeTotal)
  return result
}
