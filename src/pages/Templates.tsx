import { contractTemplates } from '../data/contracts'
import { FileText } from 'lucide-react'
export default function Templates(){
 return <section className="panel">
  <div className="panel-head"><div><h2>قوالب العقود</h2><p>القوالب الافتراضية المعتمدة داخل النظام</p></div><span className="count">{contractTemplates.length} قوالب</span></div>
  <div className="template-grid">{contractTemplates.map(t=><article key={t.id}><div className="template-icon"><FileText/></div><h3>{t.name}</h3><p>{t.description}</p><div><span>{t.fields.length} حقول</span><span>{t.clauses.length} بنود</span></div></article>)}</div>
 </section>
}
