import { useMemo, useRef, useState } from 'react'
import { contractTemplates } from '../data/contracts'
import { FileText, ArrowLeft, ArrowRight, Download, CheckCircle2 } from 'lucide-react'
import { downloadContractPdf } from '../lib/pdf'

type FormState = Record<string, string|number|boolean>

export default function NewContract(){
 const [step,setStep]=useState(1)
 const [templateId,setTemplateId]=useState(contractTemplates[0].id)
 const [form,setForm]=useState<FormState>({
  customer_name:'',organization_name:'',phone:'',email:'',city:'',
  national_id:'',commercial_registration:'',contract_amount:'',start_date:'',end_date:'',
  customer_status:'مشترك',payment_terms:'50% عند التوقيع و50% عند التسليم'
 })
 const contractRef=useRef<HTMLDivElement>(null)
 const template=useMemo(()=>contractTemplates.find(t=>t.id===templateId)!,[templateId])
 const code=`MT-CON-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`
 const set=(k:string,v:string|number|boolean)=>setForm(p=>({...p,[k]:v}))
 const next=()=>setStep(s=>Math.min(4,s+1)), prev=()=>setStep(s=>Math.max(1,s-1))
 const download=async()=>{ if(contractRef.current) await downloadContractPdf(contractRef.current,`${code}.pdf`) }

 return <section className="wizard">
  <div className="steps">{['نوع العقد','بيانات العميل','تفاصيل العقد','المعاينة'].map((s,i)=><div className={step>=i+1?'active':''} key={s}><span>{i+1}</span><b>{s}</b></div>)}</div>
  {step===1&&<div className="panel"><div className="panel-head"><div><h2>اختيار نوع العقد</h2><p>حدد القالب المناسب لطبيعة الخدمة</p></div></div>
   <div className="template-grid selectable">{contractTemplates.map(t=><button key={t.id} className={templateId===t.id?'selected':''} onClick={()=>setTemplateId(t.id)}><FileText/><h3>{t.name}</h3><p>{t.description}</p>{templateId===t.id&&<CheckCircle2 className="check"/>}</button>)}</div>
  </div>}
  {step===2&&<div className="panel"><div className="panel-head"><div><h2>بيانات العميل</h2><p>تستخدم هذه البيانات لإنشاء ملف العميل والعقد</p></div></div>
   <div className="form-grid">
    <label><span>اسم العميل *</span><input value={String(form.customer_name)} onChange={e=>set('customer_name',e.target.value)}/></label>
    <label><span>اسم الجهة</span><input value={String(form.organization_name)} onChange={e=>set('organization_name',e.target.value)}/></label>
    <label><span>رقم الجوال *</span><input dir="ltr" value={String(form.phone)} onChange={e=>set('phone',e.target.value)}/></label>
    <label><span>البريد الإلكتروني</span><input dir="ltr" type="email" value={String(form.email)} onChange={e=>set('email',e.target.value)}/></label>
    <label><span>المدينة</span><input value={String(form.city)} onChange={e=>set('city',e.target.value)}/></label>
    <label><span>السجل التجاري أو الرقم الموحد</span><input value={String(form.commercial_registration)} onChange={e=>set('commercial_registration',e.target.value)}/></label>
    <label><span>حالة العميل</span><select value={String(form.customer_status)} onChange={e=>set('customer_status',e.target.value)}><option>مشترك</option><option>جاري خدمته</option><option>منجز</option><option>متوقف</option><option>ملغي</option></select></label>
   </div>
  </div>}
  {step===3&&<div className="panel"><div className="panel-head"><div><h2>تفاصيل العقد</h2><p>{template.name}</p></div></div>
   <div className="form-grid">
    <label><span>تاريخ بداية العقد *</span><input type="date" value={String(form.start_date)} onChange={e=>set('start_date',e.target.value)}/></label>
    <label><span>تاريخ نهاية العقد</span><input type="date" value={String(form.end_date)} onChange={e=>set('end_date',e.target.value)}/></label>
    <label><span>قيمة العقد</span><input type="number" value={String(form.contract_amount)} onChange={e=>set('contract_amount',e.target.value)}/></label>
    <label className="wide"><span>شروط الدفع</span><textarea value={String(form.payment_terms)} onChange={e=>set('payment_terms',e.target.value)}/></label>
    {template.fields.map(f=><label key={f.key} className={f.type==='textarea'?'wide':''}><span>{f.label}{f.required?' *':''}</span>
      {f.type==='textarea'?<textarea value={String(form[f.key]??'')} onChange={e=>set(f.key,e.target.value)}/>:
       f.type==='boolean'?<select value={String(form[f.key]??false)} onChange={e=>set(f.key,e.target.value==='true')}><option value="false">لا</option><option value="true">نعم</option></select>:
       <input type={f.type||'text'} value={String(form[f.key]??'')} onChange={e=>set(f.key,e.target.value)}/>}
    </label>)}
   </div>
  </div>}
  {step===4&&<div className="panel preview-panel">
    <div className="panel-head no-print"><div><h2>معاينة العقد</h2><p>راجع البيانات قبل إنشاء الملف النهائي</p></div><button className="primary" onClick={download}><Download size={18}/> تحميل PDF</button></div>
    <div className="contract-paper" ref={contractRef}>
      <div className="contract-cover">
        <img src="/manzor-logo.webp" alt="منظور تقني"/>
        <div className="cover-line"/>
        <h1>{template.name}</h1>
        <p>{String(form.organization_name||form.customer_name||'اسم العميل')}</p>
        <dl><div><dt>رقم العقد</dt><dd>{code}</dd></div><div><dt>تاريخ الإصدار</dt><dd>{new Date().toLocaleDateString('ar-SA')}</dd></div></dl>
      </div>
      <div className="contract-body">
        <div className="doc-header"><img src="/manzor-logo.webp"/><div><b>منظور تقني</b><span>{code}</span></div></div>
        <h2>بيانات الأطراف</h2>
        <table className="doc-table"><tbody>
          <tr><th>الطرف الأول</th><td>منظور تقني</td><th>الطرف الثاني</th><td>{String(form.organization_name||form.customer_name)}</td></tr>
          <tr><th>ممثل الطرف الثاني</th><td>{String(form.customer_name)}</td><th>رقم التواصل</th><td dir="ltr">{String(form.phone)}</td></tr>
          <tr><th>البريد الإلكتروني</th><td dir="ltr">{String(form.email||'-')}</td><th>المدينة</th><td>{String(form.city||'-')}</td></tr>
        </tbody></table>
        <p className="preamble">تم الاتفاق بين الطرفين وهما بكامل الأهلية المعتبرة على تنفيذ موضوع هذا العقد وفقا للبنود والشروط الآتية:</p>
        <h2>بيانات العقد</h2>
        <table className="doc-table"><tbody>
          <tr><th>نوع العقد</th><td>{template.name}</td><th>قيمة العقد</th><td>{form.contract_amount?`${form.contract_amount} ريال سعودي`:'تحدد حسب العرض المالي'}</td></tr>
          <tr><th>تاريخ البداية</th><td>{String(form.start_date||'-')}</td><th>تاريخ النهاية</th><td>{String(form.end_date||'-')}</td></tr>
          <tr><th>شروط الدفع</th><td colSpan={3}>{String(form.payment_terms)}</td></tr>
        </tbody></table>
        <h2>تفاصيل الخدمة</h2>
        <table className="doc-table"><tbody>{template.fields.map(f=><tr key={f.key}><th>{f.label}</th><td colSpan={3}>{typeof form[f.key]==='boolean'?(form[f.key]?'نعم':'لا'):String(form[f.key]||'-')}</td></tr>)}</tbody></table>
        <div className="clauses">{template.clauses.map((c,i)=><section key={c.title}><h3>المادة {i+1}: {c.title}</h3><p>{c.body}</p></section>)}</div>
        <section><h3>المادة {template.clauses.length+1}: المقابل المالي والضرائب</h3><p>تسدد قيمة العقد وفق شروط الدفع المحددة، وتضاف ضريبة القيمة المضافة أو أي رسوم نظامية أخرى متى كانت واجبة التطبيق.</p></section>
        <section><h3>المادة {template.clauses.length+2}: القوة القاهرة</h3><p>لا يعد أي طرف مخلا بالتزاماته إذا تعذر التنفيذ بسبب ظرف خارج عن إرادته لا يمكن توقعه أو دفعه، على أن يشعر الطرف الآخر خلال مدة معقولة.</p></section>
        <section><h3>المادة {template.clauses.length+3}: تسوية النزاعات</h3><p>يسعى الطرفان إلى تسوية أي نزاع وديا، وعند تعذر ذلك يكون الاختصاص للجهة القضائية المختصة في المملكة العربية السعودية.</p></section>
        <section><h3>المادة {template.clauses.length+4}: أحكام عامة</h3><p>يمثل هذا العقد وملاحقه كامل الاتفاق بين الطرفين، ولا يكون أي تعديل نافذا إلا إذا كان مكتوبا ومعتمدا من الطرفين.</p></section>
        <div className="signatures"><div><h3>الطرف الأول</h3><p>منظور تقني</p><span>الاسم:</span><span>الصفة:</span><span>التوقيع والختم:</span></div><div><h3>الطرف الثاني</h3><p>{String(form.organization_name||form.customer_name)}</p><span>الاسم: {String(form.customer_name)}</span><span>الصفة:</span><span>التوقيع والختم:</span></div></div>
        <footer>منظور تقني — {code}</footer>
      </div>
    </div>
  </div>}
  <div className="wizard-actions no-print"><button className="secondary" disabled={step===1} onClick={prev}><ArrowRight size={18}/> السابق</button>{step<4&&<button className="primary" onClick={next}>التالي <ArrowLeft size={18}/></button>}</div>
 </section>
}
