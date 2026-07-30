import { useParams, useNavigate } from 'react-router-dom'
import { ArrowRight, FileText, Download } from 'lucide-react'

export default function CustomerDetails(){
  const {id}=useParams(); const nav=useNavigate()
  return <>
    <button className="back" onClick={()=>nav('/customers')}><ArrowRight size={18}/> العودة إلى العملاء</button>
    <section className="panel">
      <div className="empty"><FileText/><h3>ملف العميل</h3><p>سيتم تحميل بيانات العميل والعقود المرتبطة به من Supabase بعد الربط.</p><code>{id}</code></div>
    </section>
  </>
}
