import { useEffect, useState } from 'react'
import { createSseConnection } from '@/apis/sse'
import DailyBriefingModal from '@/components/DailyBriefingModal'
import Icon from '@/components/Icon'
import InquiryNotificationModal from '@/components/InquiryNotificationModal'
import { navItems } from '@/data/dashboardData'
import CustomersPage from '@/pages/CustomersPage'
import ReservationsPage from '@/pages/ReservationsPage'
import SchedulePage from '@/pages/SchedulePage'
import ShopInfoPage from '@/pages/ShopInfoPage'

function App() {
  const [activeTab, setActiveTab] = useState('shop')
  const [notifications, setNotifications] = useState([])
  const [dailyBriefings, setDailyBriefings] = useState([])

  useEffect(() => {
    const sseConnection = createSseConnection({
      onDailyBriefing(data) {
        const briefing = {
          id: crypto.randomUUID(),
          total: data.total ?? 0,
          reservations: data.reservations ?? [],
        }

        setDailyBriefings((currentBriefings) => [...currentBriefings, briefing])
      },
      onInquiry(data) {
        if (!data.waiting) {
          return
        }

        const notification = {
          id: crypto.randomUUID(),
          customerName: data.customer_name ?? '고객',
        }

        setNotifications((currentNotifications) => [...currentNotifications, notification])
      },
      onError(error) {
        console.error('SSE 연결 오류:', error)
      },
    })

    return () => {
      sseConnection.close()
    }
  }, [])

  const currentNotification = notifications[0] ?? null
  const currentDailyBriefing = dailyBriefings[0] ?? null

  const handleNotificationConfirm = () => {
    setNotifications((currentNotifications) => currentNotifications.slice(1))
  }

  const handleDailyBriefingConfirm = () => {
    setDailyBriefings((currentBriefings) => currentBriefings.slice(1))
  }

  const panel = {
    shop: <ShopInfoPage />,
    customers: <CustomersPage />,
    reservations: <ReservationsPage />,
    schedule: <SchedulePage />,
  }[activeTab]

  return (
    <div className='admin-shell'>
      <aside className='sidebar'>
        <div className='brand'>
          <div className='brand__title'>
            <Icon name='shop' />
            <strong>숙명네일샵</strong>
          </div>
          <span>김제니 사장님</span>
        </div>
        <nav className='side-nav' aria-label='관리 메뉴'>
          {navItems.map((item) => (
            <button
              className={`side-nav__item ${activeTab === item.id ? 'is-active' : ''}`}
              key={item.id}
              type='button'
              onClick={() => setActiveTab(item.id)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className='admin-content'>{panel}</main>
      <InquiryNotificationModal
        notification={currentNotification}
        onConfirm={handleNotificationConfirm}
      />
      <DailyBriefingModal briefing={currentDailyBriefing} onConfirm={handleDailyBriefingConfirm} />
    </div>
  )
}

export default App
