import { apiRequest } from '@/apis/httpClient'
import { mapFormValuesToShopInfoPayload, mapShopInfoToFormValues } from './shopInfoMapper'

export async function getShopInfo({ signal } = {}) {
  const response = await apiRequest('/api/v1/shopinfo', { signal })

  return mapShopInfoToFormValues(response.data ?? {})
}

export async function updateShopInfo(formValues, { signal } = {}) {
  await apiRequest('/api/v1/shopinfo', {
    body: mapFormValuesToShopInfoPayload(formValues),
    method: 'PATCH',
    signal,
  })
}
