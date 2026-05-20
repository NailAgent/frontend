export function mapCustomerToTableRow(customer) {
  return {
    id: String(customer.id),
    name: customer.name || '-',
    phone: customer.phone_num ?? '-',
    recent: customer.last_reserve_date ?? '-',
    visits: '-',
    noShows: customer.noshow_count ?? 0,
  }
}

export function mapCustomersPage(data) {
  return {
    pagination: {
      currentPage: data.current_page ?? 1,
      totalPages: data.total_pages ?? 1,
      size: data.size ?? 12,
      currentSize: data.current_size ?? data.customers?.length ?? 0,
      totalSize: data.total_size ?? data.customers?.length ?? 0,
      hasPrevious: Boolean(data.has_previous),
      hasNext: Boolean(data.has_next),
    },
    customers: (data.customers ?? []).map(mapCustomerToTableRow),
  }
}
