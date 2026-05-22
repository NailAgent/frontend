import { useEffect, useState } from 'react'
import { getShopInfo, updateShopInfo } from '@/apis/shopinfo'
import Icon from '@/components/Icon'
import { shopCards } from '@/data/dashboardData'

function ShopInfoPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formValues, setFormValues] = useState(() =>
    Object.fromEntries(shopCards.map((card) => [card.id, card.text])),
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const loadShopInfo = async (signal) => {
    const shopInfo = await getShopInfo({ signal })
    setFormValues(shopInfo)
  }

  useEffect(() => {
    const abortController = new AbortController()

    async function loadInitialShopInfo() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        await loadShopInfo(abortController.signal)
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setErrorMessage(error.message || '샵 정보를 불러오지 못했습니다.')
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadInitialShopInfo()

    return () => {
      abortController.abort()
    }
  }, [])

  const handleChange = (cardId, value) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [cardId]: value,
    }))
  }

  const handleActionClick = async () => {
    if (!isEditing) {
      setIsEditing(true)
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    try {
      await updateShopInfo(formValues)
      await loadShopInfo()
      setIsEditing(false)
    } catch (error) {
      setErrorMessage(error.message || '샵 정보를 저장하지 못했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <header className='content-header'>
        <h1>샵 정보 관리</h1>
        <p>
          {isLoading
            ? '샵 정보를 불러오는 중'
            : isSaving
              ? '샵 정보를 저장하는 중'
              : '네일샵 운영에 필요한 정보를 관리합니다'}
        </p>
      </header>
      {!isLoading && isEditing && errorMessage ? (
        <p className='inline-error' role='alert'>
          {errorMessage}
        </p>
      ) : null}
      {isLoading ? (
        <section className='info-state' aria-label='샵 정보 로딩'>
          샵 정보를 불러오는 중입니다.
        </section>
      ) : errorMessage && !isEditing ? (
        <section className='info-state info-state--error' aria-label='샵 정보 오류'>
          {errorMessage}
        </section>
      ) : (
        <section className='info-grid' aria-label='샵 정보'>
          {shopCards.map((card) => {
            const value = formValues[card.id]

            return (
              <article className='info-card' key={card.id}>
                <div className='info-card__heading'>
                  <span className='icon-tile'>
                    <Icon name={card.icon} />
                  </span>
                  <h2>{card.title}</h2>
                </div>
                {isEditing ? (
                  <textarea
                    className='info-card__field'
                    aria-label={`${card.title} 수정`}
                    value={value}
                    rows={card.isValue ? 2 : 4}
                    disabled={isSaving}
                    onChange={(event) => handleChange(card.id, event.target.value)}
                  />
                ) : card.isValue ? (
                  <strong className='info-card__value'>{value}</strong>
                ) : (
                  <div className='info-card__body'>
                    {value.split('\n').map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                )}
              </article>
            )
          })}
        </section>
      )}
      <div className='shop-info-actions'>
        <button className='upload-action' type='button'>
          추가 정보 업로드
        </button>
        <button
          className={`floating-action ${isEditing ? 'floating-action--complete' : ''}`}
          type='button'
          disabled={isLoading || isSaving || (Boolean(errorMessage) && !isEditing)}
          onClick={handleActionClick}
        >
          {isSaving ? '저장 중' : isEditing ? '완료' : '수정'}
        </button>
      </div>
    </>
  )
}

export default ShopInfoPage
