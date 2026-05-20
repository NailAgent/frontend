import { useState } from 'react'
import Icon from '@/components/Icon'
import { navItems } from '@/data/dashboardData'
import CustomersPage from '@/pages/CustomersPage'
import ReservationsPage from '@/pages/ReservationsPage'
import ShopInfoPage from '@/pages/ShopInfoPage'

function App() {
  const [activeTab, setActiveTab] = useState('shop')

  const panel = {
    shop: <ShopInfoPage />,
    customers: <CustomersPage />,
    reservations: <ReservationsPage />,
    schedule: null,
  }[activeTab]

  return (
    <div className='admin-shell'>
      <aside className='sidebar'>
        <div className='brand'>
          <div className='brand__title'>
            <Icon name='shop' />
            <strong>러블리 네일샵</strong>
          </div>
          <span>김지영 사장님</span>
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
    </div>
  )
}

export default App
