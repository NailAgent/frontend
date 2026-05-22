export const navItems = [
  { id: 'shop', label: '샵 정보 관리', icon: 'gear' },
  { id: 'customers', label: '고객', icon: 'users' },
  { id: 'reservations', label: '예약', icon: 'calendar' },
  { id: 'schedule', label: '일정', icon: 'schedule' },
]

export const shopCards = [
  {
    id: 'hours',
    title: '영업 시간',
    icon: 'clock',
    text: '평일: 10:00 - 20:00\n주말: 11:00 - 19:00\n정기휴무: 매주 월요일',
  },
  { id: 'deposit', title: '예약금', icon: 'dollar', text: '20,000원', isValue: true },
  { id: 'account', title: '계좌', icon: 'card', text: '국민은행 123-456-789012' },
  {
    id: 'form',
    title: '예약 양식',
    icon: 'form',
    text: '1. 고객명 2. 연락처 3. 희망 날짜/시간 4. 시술 종류 5. 제거 여부',
  },
  {
    id: 'prices',
    title: '대표 가격',
    icon: 'tag',
    text: '젤 네일: 50,000원 아트 추가: 5,000원~ 제거: 10,000원 풀 케어: 80,000원',
  },
  {
    id: 'message',
    title: '예약 멘트',
    icon: 'message',
    text: '안녕하세요! 러블리 네일샵입니다 💅 예약 문의 주셔서 감사합니다. 희망하시는 날짜와 시술을 알려주세요!',
  },
  {
    id: 'policy',
    title: '정책',
    icon: 'shield',
    text: '노쇼 2회 이상 시 예약 제한 · 당일 취소는 예약금 환불 불가 · 15분 이상 지각 시 예약 취소될 수 있음',
  },
]

export const customers = [
  { name: '김민지', phone: '010-1234-5678', recent: '2026-05-05', visits: '12회', noShows: 0 },
  { name: '이서연', phone: '010-2345-6789', recent: '2026-05-03', visits: '8회', noShows: 1 },
  { name: '박지우', phone: '010-3456-7890', recent: '2026-04-28', visits: '15회', noShows: 0 },
  { name: '최유진', phone: '010-4567-8901', recent: '2026-04-25', visits: '5회', noShows: 2 },
  { name: '정소희', phone: '010-5678-9012', recent: '2026-04-20', visits: '20회', noShows: 0 },
]

export const reservations = [
  {
    id: 'reservation-1',
    name: '김민지',
    service: '젤 네일 + 아트',
    date: '2026-05-10 14:00',
    removal: '-',
    designer: '디자이너 A',
    status: '확정',
  },
  {
    id: 'reservation-2',
    name: '이서연',
    service: '제거 + 케어',
    date: '2026-05-10 15:30',
    removal: '제거',
    designer: '디자이너 B',
    status: '대기중',
  },
  {
    id: 'reservation-3',
    name: '박지우',
    service: '젤 네일',
    date: '2026-05-11 10:00',
    removal: '-',
    designer: '디자이너 A',
    status: '확정',
  },
  {
    id: 'reservation-4',
    name: '최유진',
    service: '풀 케어 + 아트',
    date: '2026-05-11 13:00',
    removal: '-',
    designer: '디자이너 C',
    status: '대기중',
  },
  {
    id: 'reservation-5',
    name: '박사랑',
    service: '젤 네일',
    date: '2026-04-10 11:00',
    removal: '-',
    designer: '디자이너 B',
    status: '확정',
  },
]
