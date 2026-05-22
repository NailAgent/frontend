import { apiRequest } from '@/apis/httpClient'
import { mapBookingsPage } from './bookingsMapper'

export async function getBookings({ page = 1, size = 12, signal } = {}) {
  const response = await apiRequest('/api/v1/bookings', {
    query: { page, size },
    signal,
  })

  return mapBookingsPage(response.data ?? {})
}
