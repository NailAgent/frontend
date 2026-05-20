const CLOSED_DAY_LABELS = {
  1: '월요일',
  2: '화요일',
  3: '수요일',
  4: '목요일',
  5: '금요일',
  6: '토요일',
  7: '일요일',
}

const CLOSED_DAY_VALUES = Object.fromEntries(
  Object.entries(CLOSED_DAY_LABELS).map(([value, label]) => [label, Number(value)]),
)

function formatCurrency(amount) {
  if (amount === undefined || amount === null || amount === '') {
    return ''
  }

  return `${Number(amount).toLocaleString('ko-KR')}원`
}

function parseCurrency(value) {
  const numericValue = Number(String(value ?? '').replace(/[^\d]/g, ''))
  return Number.isFinite(numericValue) ? numericValue : undefined
}

function formatBusinessHours(shopInfo) {
  const hours = shopInfo.business_hour ?? ''
  const closedDay = CLOSED_DAY_LABELS[shopInfo.closed_days]

  if (!closedDay) {
    return hours
  }

  return [hours, `정기휴무: 매주 ${closedDay}`].filter(Boolean).join('\n')
}

function parseBusinessHours(value) {
  const lines = String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const closedDayLineIndex = lines.findIndex((line) => line.includes('정기휴무'))
  const closedDayLine = closedDayLineIndex >= 0 ? lines[closedDayLineIndex] : ''
  const closedDayLabel = Object.keys(CLOSED_DAY_VALUES).find((label) =>
    closedDayLine.includes(label),
  )
  const businessHourLines = lines.filter((_, index) => index !== closedDayLineIndex)

  return {
    businessHour: businessHourLines.join('\n'),
    closedDays: closedDayLabel ? CLOSED_DAY_VALUES[closedDayLabel] : undefined,
  }
}

function formatServicesPrice(servicesPrice) {
  if (!servicesPrice) {
    return ''
  }

  try {
    const parsedPrices = JSON.parse(servicesPrice)

    if (!parsedPrices || typeof parsedPrices !== 'object' || Array.isArray(parsedPrices)) {
      return servicesPrice
    }

    return Object.entries(parsedPrices)
      .map(([serviceName, price]) => `${serviceName}: ${formatCurrency(price)}`)
      .join('\n')
  } catch {
    return servicesPrice
  }
}

function parseServicesPrice(value) {
  const text = String(value ?? '').trim()

  if (!text) {
    return ''
  }

  try {
    JSON.parse(text)
    return text
  } catch {
    const priceEntries = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [serviceName, ...priceParts] = line.split(':')
        const price = parseCurrency(priceParts.join(':'))

        if (!serviceName || price === undefined) {
          return null
        }

        return [serviceName.trim(), price]
      })
      .filter(Boolean)

    if (!priceEntries.length) {
      return text
    }

    return JSON.stringify(Object.fromEntries(priceEntries))
  }
}

export function mapShopInfoToFormValues(shopInfo) {
  return {
    hours: formatBusinessHours(shopInfo),
    deposit: formatCurrency(shopInfo.deposit_amount),
    account: shopInfo.account_number ?? '',
    form: shopInfo.booking_form_text ?? '',
    prices: formatServicesPrice(shopInfo.services_price),
    message: shopInfo.booking_message_text ?? '',
    policy: shopInfo.policy_text ?? '',
  }
}

export function mapFormValuesToShopInfoPayload(formValues) {
  const { businessHour, closedDays } = parseBusinessHours(formValues.hours)

  return {
    business_hour: businessHour,
    ...(closedDays ? { closed_days: closedDays } : {}),
    booking_form_text: formValues.form,
    services_price: parseServicesPrice(formValues.prices),
    deposit_amount: parseCurrency(formValues.deposit),
    account_number: formValues.account,
    policy_text: formValues.policy,
    booking_message_text: formValues.message,
  }
}
