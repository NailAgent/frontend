const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  constructor({ status, errorCode, message, payload }) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errorCode = errorCode
    this.payload = payload
  }
}

export function buildApiUrl(path, query) {
  const normalizedBaseUrl = API_BASE_URL.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const searchParams = new URLSearchParams()

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return `${normalizedBaseUrl}${normalizedPath}${queryString ? `?${queryString}` : ''}`
}

async function parseJsonResponse(response) {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    if (!response.ok) {
      return null
    }

    throw new ApiError({
      status: response.status,
      errorCode: 'INVALID_JSON_RESPONSE',
      message: '응답 형식이 올바르지 않습니다.',
      payload: text,
    })
  }
}

export async function apiRequest(path, { body, method = 'GET', query, signal } = {}) {
  let response
  const headers = {
    Accept: 'application/json',
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    response = await fetch(buildApiUrl(path, query), {
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers,
      method,
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }

    throw new ApiError({
      status: 0,
      errorCode: 'NETWORK_ERROR',
      message: '서버에 연결할 수 없습니다.',
      payload: error,
    })
  }

  const payload = await parseJsonResponse(response)

  if (!response.ok || payload?.status >= 400) {
    throw new ApiError({
      status: payload?.status ?? response.status,
      errorCode: payload?.error_code ?? 'HTTP_ERROR',
      message: payload?.message ?? '요청 처리 중 오류가 발생했습니다.',
      payload,
    })
  }

  return payload
}
