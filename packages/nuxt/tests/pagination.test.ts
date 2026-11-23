import { describe, expect, it } from 'vitest'
import { computePaginationRange, getPaginationBounds } from '../app/utils/pagination'

describe('pagination utilities', () => {
  it('computes item bounds and clamps out-of-range page numbers', () => {
    expect(getPaginationBounds(1, 10, 42)).toEqual({
      page: 1,
      pageSize: 10,
      totalPages: 5,
      from: 1,
      to: 10,
    })

    expect(getPaginationBounds(5, 10, 42)).toEqual({
      page: 5,
      pageSize: 10,
      totalPages: 5,
      from: 41,
      to: 42,
    })

    expect(getPaginationBounds(99, 10, 42).page).toBe(5)
    expect(getPaginationBounds(-3, 10, 42).page).toBe(1)
  })

  it('handles empty datasets safely', () => {
    expect(getPaginationBounds(1, 10, 0)).toEqual({
      page: 1,
      pageSize: 10,
      totalPages: 1,
      from: 0,
      to: 0,
    })
  })

  it('generates compact page ranges with ellipses', () => {
    expect(computePaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5])
    expect(computePaginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 20])
    expect(computePaginationRange(10, 20)).toEqual([1, 'ellipsis', 9, 10, 11, 'ellipsis', 20])
    expect(computePaginationRange(19, 20)).toEqual([1, 'ellipsis', 16, 17, 18, 19, 20])
  })
})
