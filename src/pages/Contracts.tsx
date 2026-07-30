import { FileText, PlusCircle, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
export default function Contracts(){
 const nav=useNavigate()
 return <section className="panel">
  <div className="panel-head"><div><h2>العقود</h2><p>متابعة جميع العقود وإصداراتها وحالاتها</p></div><button className="primary" onClick={()=>nav('/contracts/new')}><PlusCircle size={18}/> إنشاء عقد</button></div>
  <div className="filters"><label className="search"><Search size={18}/><input placeholder="البحث برقم العقد أو اسم العميل"/></label><select><option>جميع الحالات</option><option>ساري</option><option>قارب على الانتهاء</option><option>منتهي</option><option>ملغي</option></select></div>
  <div className="empty"><FileText/><h3>لا توجد عقود</h3><p>أنشئ أول عقد ليظهر في هذه القائمة.</p></div>
 </section>
}
