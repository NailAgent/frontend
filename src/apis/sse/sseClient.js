import { buildApiUrl } from '@/apis/httpClient'

const SSE_CONNECT_PATH = '/api/v1/sse/connect'
const RECONNECT_DELAY_MS = 3000

function parseEventData(event) {
  try {
    return JSON.parse(event.data)
  } catch {
    return null
  }
}

export function createSseConnection({ onInquiry, onError } = {}) {
  let eventSource = null
  let reconnectTimer = null
  let isClosed = false

  const clearReconnectTimer = () => {
    if (reconnectTimer) {
      window.clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  const connect = () => {
    clearReconnectTimer()

    eventSource = new EventSource(buildApiUrl(SSE_CONNECT_PATH))

    eventSource.addEventListener('inquiry', (event) => {
      const data = parseEventData(event)

      if (!data) {
        onError?.(new Error('알림 데이터 형식이 올바르지 않습니다.'))
        return
      }

      onInquiry?.(data)
    })

    eventSource.onerror = (error) => {
      onError?.(error)
      eventSource?.close()

      if (!isClosed) {
        reconnectTimer = window.setTimeout(connect, RECONNECT_DELAY_MS)
      }
    }
  }

  connect()

  return {
    close() {
      isClosed = true
      clearReconnectTimer()
      eventSource?.close()
    },
  }
}
