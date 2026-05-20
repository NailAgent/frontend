import { apiRequest } from '@/apis/httpClient'
import { mapCustomersPage } from './customersMapper'

export async function getCustomers({ page = 1, size = 12, signal } = {}) {
  const response = await apiRequest('/api/v1/customers', {
    query: { page, size },
    signal,
  })

  return mapCustomersPage(response.data ?? {})
}
