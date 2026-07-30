import { Users, FileText, Clock, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard(){
  const nav=useNavigate()
  return <>
    <section className="hero">
      <div><span className="eyebrow">لوحة التحكم</span><h2>إدارة موحدة للعملاء والعقود</h2><p>متابعة حالة العملاء والعقود والمستندات من مكان واحد.</p></div>
      <img src="/manzor-logo.webp" alt=""/>
    </section>
    <section className="stats">
      <article><div className="stat-icon"><Users/></div><span>إجمالي العملاء</span><strong>0</strong><small>يتم التحديث من قاعدة البيانات</small></article>
      <article><div className="stat-icon"><FileText/></div><span>العقود السارية</span><strong>0</strong><small>عقود نشطة حاليا</small></article>
      <article><div className="stat-icon"><Clock/></div><span>قرب الانتهاء</span><strong>0</strong><small>تحتاج إلى متابعة</small></article>
      <article><div className="stat-icon"><CheckCircle2/></div><span>العملاء المنجزون</span><strong>0</strong><small>خدمات مكتملة</small></article>
    </section>
    <section className="panel">
      <div className="panel-head"><div><h3>الإجراءات السريعة</h3><p>الوصول المباشر إلى العمليات الأساسية</p></div></div>
      <div className="quick-grid">
        <button onClick={()=>nav('/contracts/new')}><FileText/><b>إنشاء عقد جديد</b><span>إنشاء العميل والعقد في عملية واحدة</span></button>
        <button onClick={()=>nav('/customers')}><Users/><b>إدارة العملاء</b><span>عرض وتحديث بيانات العملاء</span></button>
        <button onClick={()=>nav('/contracts')}><Clock/><b>متابعة العقود</b><span>مراجعة العقود السارية والمنتهية</span></button>
      </div>
    </section>
  </>
}
