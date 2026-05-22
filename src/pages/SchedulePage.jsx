const GOOGLE_CALENDAR_URL =
  'https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FSeoul&showPrint=0&src=amVubnlraW1uYWlsQGdtYWlsLmNvbQ&color=%23039be5'

function SchedulePage() {
  return (
    <section className='calendar-panel' aria-label='구글 캘린더'>
      <iframe
        className='calendar-frame'
        frameBorder='0'
        scrolling='no'
        src={GOOGLE_CALENDAR_URL}
        title='구글 캘린더'
      />
    </section>
  )
}

export default SchedulePage
