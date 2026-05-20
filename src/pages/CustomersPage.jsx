import { useEffect, useMemo, useState } from 'react'
import { getCustomers } from '@/apis/customers'

const PAGE_SIZE = 12
const EMPTY_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  size: PAGE_SIZE,
  currentSize: 0,
  totalSize: 0,
  hasPrevious: false,
  hasNext: false,
}

function NoShowBadge({ count }) {
  const tone = count >= 2 ? 'danger' : count === 1 ? 'warning' : 'success'
  return <span className={`badge badge--${tone}`}>{count}회</span>
}

function CustomersPage() {
  const [page, setPage] = useState(1)
  const [customerRows, setCustomerRows] = useState([])
  const [pagination, setPagination] = useState(EMPTY_PAGINATION)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [sort, setSort] = useState('이름순')
  const sortedCustomers = useMemo(() => {
    const list = [...customerRows]
    if (sort === '최근 예약 순') return list.sort((a, b) => b.recent.localeCompare(a.recent))
    if (sort === '오래된 예약 순') return list.sort((a, b) => a.recent.localeCompare(b.recent))
    if (sort === '방문 횟수순')
      return list.sort((a, b) => Number.parseInt(b.visits) - Number.parseInt(a.visits))
    if (sort === '노쇼 횟수순') return list.sort((a, b) => b.noShows - a.noShows)
    return list.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
  }, [customerRows, sort])

  useEffect(() => {
    const abortController = new AbortController()

    async function loadCustomers() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const customersPage = await getCustomers({
          page,
          size: PAGE_SIZE,
          signal: abortController.signal,
        })

        setCustomerRows(customersPage.customers)
        setPagination(customersPage.pagination)
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setCustomerRows([])
        setPagination((currentPagination) => ({
          ...currentPagination,
          currentPage: page,
          currentSize: 0,
          hasPrevious: page > 1,
          hasNext: false,
        }))
        setErrorMessage(error.message || '고객 목록을 불러오지 못했습니다.')
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadCustomers()

    return () => {
      abortController.abort()
    }
  }, [page])

  return (
    <>
      <header className='content-header'>
        <h1>고객 관리</h1>
        <p>{isLoading ? '고객 목록을 불러오는 중' : `총 ${pagination.totalSize}명의 고객`}</p>
      </header>
      <div className='sort-tabs' role='tablist' aria-label='고객 정렬'>
        {['이름순', '최근 예약 순', '오래된 예약 순', '방문 횟수순', '노쇼 횟수순'].map(
          (option) => (
            <button
              className={`sort-tab ${sort === option ? 'is-active' : ''}`}
              key={option}
              type='button'
              onClick={() => setSort(option)}
            >
              {option}
            </button>
          ),
        )}
      </div>
      <div className='table-card'>
        <table>
          <thead>
            <tr>
              <th>고객명</th>
              <th>연락처</th>
              <th>최근 예약일</th>
              <th>방문 횟수</th>
              <th>노쇼 횟수</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className='table-state' colSpan='5'>
                  고객 목록을 불러오는 중입니다.
                </td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td className='table-state table-state--error' colSpan='5'>
                  {errorMessage}
                </td>
              </tr>
            ) : sortedCustomers.length === 0 ? (
              <tr>
                <td className='table-state' colSpan='5'>
                  조회된 고객이 없습니다.
                </td>
              </tr>
            ) : (
              sortedCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.recent}</td>
                  <td>{customer.visits}</td>
                  <td>
                    <NoShowBadge count={customer.noShows} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!isLoading && !errorMessage ? (
        <div className='pagination-bar' aria-label='고객 페이지네이션'>
          <button
            type='button'
            disabled={!pagination.hasPrevious}
            onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
          >
            이전
          </button>
          <span>
            {pagination.currentPage} / {pagination.totalPages}
          </span>
          <button
            type='button'
            disabled={!pagination.hasNext}
            onClick={() => setPage((currentPage) => currentPage + 1)}
          >
            다음
          </button>
        </div>
      ) : null}
    </>
  )
}

export default CustomersPage
