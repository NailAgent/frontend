const VISIT_STATUS_LABELS = {
  pending: '예약 대기',
  confirmed: '예약 확정',
  visited: '이용 완료',
  no_show: '노쇼',
}

export function mapBookingToReservation(booking) {
  const reserveDate = booking.reserve_date ?? ''
  const reserveTime = booking.reserve_time ?? ''

  return {
    id: String(booking.id),
    name: booking.name ?? '-',
    service: booking.service ?? '-',
    date: [reserveDate, reserveTime].filter(Boolean).join(' '),
    removal: booking.off_removal ? '제거' : '-',
    designer: booking.designer || '사장님',
    status:
      VISIT_STATUS_LABELS[String(booking.visit_status ?? '').toLowerCase()] ??
      booking.visit_status ??
      '-',
    visitStatus: booking.visit_status ?? '',
    imageUrls: booking.image_urls ?? [],
  }
}

export function mapBookingsPage(data) {
  return {
    pagination: {
      currentPage: data.current_page ?? 1,
      totalPages: data.total_pages ?? 1,
      size: data.size ?? 12,
      currentSize: data.current_size ?? data.bookings?.length ?? 0,
      totalSize: data.total_size ?? data.bookings?.length ?? 0,
      hasPrevious: Boolean(data.has_previous),
      hasNext: Boolean(data.has_next),
    },
    bookings: (data.bookings ?? []).map(mapBookingToReservation),
  }
}
