function DailyBriefingModal({ briefing, onConfirm }) {
  if (!briefing) {
    return null
  }

  const reservations = briefing.reservations ?? []
  const total = briefing.total ?? reservations.length

  return (
    <div className='modal-backdrop' role='presentation'>
      <section
        aria-labelledby='daily-briefing-title'
        aria-modal='true'
        className='confirm-modal daily-briefing-modal'
        role='dialog'
      >
        <span className='notification-modal__eyebrow'>오늘의 예약 브리핑</span>
        <h2 id='daily-briefing-title'>오늘 예약은 총 {total}건입니다</h2>
        {reservations.length > 0 ? (
          <ul className='daily-briefing-list'>
            {reservations.map((reservation, index) => (
              <li className='daily-briefing-list__item' key={`${reservation.time}-${index}`}>
                <strong>{reservation.time}</strong>
                <div>
                  <span>{reservation.name}</span>
                  <p>
                    {reservation.service} · {reservation.designer ?? '사장님'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>오늘 예정된 예약이 없습니다.</p>
        )}
        <div className='confirm-modal__actions'>
          <button
            className='floating-action floating-action--modal'
            type='button'
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      </section>
    </div>
  )
}

export default DailyBriefingModal
