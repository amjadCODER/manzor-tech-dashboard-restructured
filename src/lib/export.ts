import * as XLSX from 'xlsx'
import { Customer } from '../types'

export function exportCustomers(customers: Customer[]) {
  const rows = customers.map(c => ({
    'رقم العميل': c.customer_code,
    'اسم العميل': c.name,
    'الجهة': c.organization_name || '',
    'رقم الجوال': c.phone,
    'البريد الإلكتروني': c.email || '',
    'المدينة': c.city || '',
    'حالة العميل': c.status,
    'الموظف المسؤول': c.assigned_to || '',
    'تاريخ الإنشاء': new Date(c.created_at).toLocaleDateString('ar-SA')
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'العملاء')
  XLSX.writeFile(wb, `عملاء-منظور-تقني-${new Date().toISOString().slice(0,10)}.xlsx`)
}
