export type CustomerStatus = 'مشترك' | 'جاري خدمته' | 'منجز' | 'متوقف' | 'ملغي'
export type ContractStatus = 'ساري' | 'قارب على الانتهاء' | 'منتهي' | 'ملغي'

export interface Customer {
  id: string
  customer_code: string
  name: string
  organization_name?: string
  phone: string
  email?: string
  city?: string
  national_id?: string
  commercial_registration?: string
  status: CustomerStatus
  assigned_to?: string
  created_at: string
}

export interface Contract {
  id: string
  contract_code: string
  customer_id: string
  contract_type: string
  title: string
  start_date: string
  end_date?: string
  amount?: number
  status: ContractStatus
  pdf_url?: string
  version: number
  fields: Record<string, string | number | boolean>
  created_at: string
}
