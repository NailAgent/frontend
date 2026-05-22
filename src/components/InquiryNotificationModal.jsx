function InquiryNotificationModal({ notification, onConfirm }) {
  if (!notification) {
    return null
  }

  return (
    <div className='modal-backdrop' role='presentation'>
      <section
        aria-labelledby='inquiry-notification-title'
        aria-modal='true'
        className='confirm-modal notification-modal'
        role='dialog'
      >
        <span className='notification-modal__eyebrow'>새 문의 알림</span>
        <h2 id='inquiry-notification-title'>응답을 기다리고 있어요</h2>
        <p>
          <strong>{notification.customerName}</strong> 고객이 응답을 기다리고 있습니다.
        </p>
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

export default InquiryNotificationModal
