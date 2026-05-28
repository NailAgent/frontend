import { useEffect, useMemo, useState } from 'react'
import { getBookings } from '@/apis/bookings'

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

function formatReservationDate(dateText) {
  const [date] = dateText.split(' ')
  const [, month, day] = date.split('-')
  return `26년 ${Number(month)}월 ${Number(day)}일`
}

function StatusBadge({ children }) {
  const tone =
    children === '예약 확정' || children === '이용 완료'
      ? 'success'
      : children === '예약 대기'
        ? 'warning'
        : children === '노쇼'
          ? 'danger'
          : 'neutral'
  return <span className={`badge badge--${tone}`}>{children}</span>
}

function ConfirmModal({ action, selectedReservations, onClose, onConfirm }) {
  const isDelete = action === 'delete'
  const isSingle = selectedReservations.length === 1
  const targetText = isSingle ? (
    <>
      <strong>{selectedReservations[0].name}</strong> 고객님의{' '}
      <strong>{formatReservationDate(selectedReservations[0].date)}</strong> 예약
    </>
  ) : (
    <strong>선택한 {selectedReservations.length}건의 예약</strong>
  )

  return (
    <div className='modal-backdrop' role='presentation'>
      <section
        className='confirm-modal'
        role='dialog'
        aria-modal='true'
        aria-labelledby='confirm-title'
      >
        <h2 id='confirm-title'>{isDelete ? '예약 삭제 확인' : '노쇼 처리 확인'}</h2>
        <p>
          {targetText}을 {isDelete ? '삭제할까요?' : '노쇼 처리할까요?'}
        </p>
        <p className='confirm-modal__warning'>
          {isDelete ? '삭제 후에는 취소할 수 없어요!' : '노쇼 처리 후에는 취소할 수 없어요!'}
        </p>
        <div className='confirm-modal__actions'>
          <button className='outline-action' type='button' onClick={onClose}>
            아니요
          </button>
          <button
            className='floating-action floating-action--modal'
            type='button'
            onClick={onConfirm}
          >
            예
          </button>
        </div>
      </section>
    </div>
  )
}

function ReservationImagesModal({ reservation, onClose }) {
  if (!reservation) {
    return null
  }

  const hasImages = reservation.imageUrls.length > 0

  return (
    <div className='modal-backdrop' role='presentation'>
      <section
        className='confirm-modal image-modal'
        role='dialog'
        aria-modal='true'
        aria-labelledby='image-modal-title'
      >
        <h2 id='image-modal-title'>{reservation.name} 고객 시술 사진</h2>
        {hasImages ? (
          <div className='image-modal__grid'>
            {reservation.imageUrls.map((imageUrl) => (
              <img alt={`${reservation.name} 고객 시술 사진`} key={imageUrl} src={imageUrl} />
            ))}
          </div>
        ) : (
          <p>등록된 시술 사진이 없습니다.</p>
        )}
        <div className='confirm-modal__actions'>
          <button
            className='floating-action floating-action--modal'
            type='button'
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </section>
    </div>
  )
}

function ReservationsPage() {
  const [page, setPage] = useState(1)
  const [reservationRows, setReservationRows] = useState([])
  const [pagination, setPagination] = useState(EMPTY_PAGINATION)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedAction, setSelectedAction] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [imageModalReservation, setImageModalReservation] = useState(null)
  const hasSelection = selectedIds.length > 0
  const selectedReservations = useMemo(
    () => reservationRows.filter((reservation) => selectedIds.includes(reservation.id)),
    [reservationRows, selectedIds],
  )

  useEffect(() => {
    const abortController = new AbortController()

    async function loadBookings() {
      setIsLoading(true)
      setErrorMessage('')
      setSelectedIds([])

      try {
        const bookingsPage = await getBookings({
          page,
          size: PAGE_SIZE,
          signal: abortController.signal,
        })

        setReservationRows(bookingsPage.bookings)
        setPagination(bookingsPage.pagination)
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setReservationRows([])
        setPagination((currentPagination) => ({
          ...currentPagination,
          currentPage: page,
          currentSize: 0,
          hasPrevious: page > 1,
          hasNext: false,
        }))
        setErrorMessage(error.message || '예약 목록을 불러오지 못했습니다.')
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadBookings()

    return () => {
      abortController.abort()
    }
  }, [page])

  const toggleReservation = (reservationId) => {
    setSelectedIds((currentIds) =>
      currentIds.includes(reservationId)
        ? currentIds.filter((id) => id !== reservationId)
        : [...currentIds, reservationId],
    )
  }

  const handleConfirmAction = () => {
    const removedCount = selectedIds.length

    setReservationRows((currentRows) =>
      currentRows.filter((reservation) => !selectedIds.includes(reservation.id)),
    )
    setPagination((currentPagination) => ({
      ...currentPagination,
      currentSize: Math.max(0, currentPagination.currentSize - removedCount),
      totalSize: Math.max(0, currentPagination.totalSize - removedCount),
    }))
    setSelectedIds([])
    setSelectedAction(null)
  }

  return (
    <>
      <header className='content-header'>
        <h1>예약 관리</h1>
        <p>{isLoading ? '예약 목록을 불러오는 중' : `총 ${pagination.totalSize}건의 예약`}</p>
      </header>
      <div className='table-card'>
        <table className='reservations-table'>
          <thead>
            <tr>
              <th className='checkbox-cell'>
                <span className='visually-hidden'>선택</span>
              </th>
              <th>고객명</th>
              <th>시술명</th>
              <th>시술 가능 날짜</th>
              <th>제거 여부</th>
              <th>디자이너</th>
              <th>예약 상태</th>
              <th>시술 사진</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className='table-state' colSpan='8'>
                  예약 목록을 불러오는 중입니다.
                </td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td className='table-state table-state--error' colSpan='8'>
                  {errorMessage}
                </td>
              </tr>
            ) : reservationRows.length === 0 ? (
              <tr>
                <td className='table-state' colSpan='8'>
                  조회된 예약이 없습니다.
                </td>
              </tr>
            ) : (
              reservationRows.map((reservation) => {
                const checked = selectedIds.includes(reservation.id)

                return (
                  <tr className={checked ? 'is-selected' : ''} key={reservation.id}>
                    <td className='checkbox-cell'>
                      <label className='checkbox-control'>
                        <input
                          type='checkbox'
                          checked={checked}
                          onChange={() => toggleReservation(reservation.id)}
                        />
                        <span className='visually-hidden'>{reservation.name} 예약 선택</span>
                      </label>
                    </td>
                    <td>{reservation.name}</td>
                    <td>{reservation.service}</td>
                    <td>{reservation.date}</td>
                    <td>
                      {reservation.removal === '제거' ? (
                        <span className='badge badge--violet'>제거</span>
                      ) : (
                        <span className='dot-chip'>-</span>
                      )}
                    </td>
                    <td>{reservation.designer}</td>
                    <td>
                      <StatusBadge>{reservation.status}</StatusBadge>
                    </td>
                    <td>
                      <button
                        className='photo-action'
                        type='button'
                        onClick={() => setImageModalReservation(reservation)}
                      >
                        사진 보기
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {!isLoading && !errorMessage ? (
        <div className='pagination-bar' aria-label='예약 페이지네이션'>
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
      <div className='action-group' aria-label='예약 작업'>
        <button
          className='secondary-action'
          type='button'
          disabled={!hasSelection}
          onClick={() => setSelectedAction('noShow')}
        >
          노쇼
        </button>
        <button
          className='floating-action floating-action--inline'
          type='button'
          disabled={!hasSelection}
          onClick={() => setSelectedAction('delete')}
        >
          삭제
        </button>
      </div>
      {selectedAction ? (
        <ConfirmModal
          action={selectedAction}
          selectedReservations={selectedReservations}
          onClose={() => setSelectedAction(null)}
          onConfirm={handleConfirmAction}
        />
      ) : null}
      <ReservationImagesModal
        reservation={imageModalReservation}
        onClose={() => setImageModalReservation(null)}
      />
    </>
  )
}

export default ReservationsPage
