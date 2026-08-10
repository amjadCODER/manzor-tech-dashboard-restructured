import SiteShell from "@/components/SiteShell";

export default function HomePage() {
  return (
    <SiteShell>
      <div className="ambient ambient-one">
      </div>
      <div className="ambient ambient-two">
      </div>
      <header className="site-header glass">
        <a aria-label="منظور تقني" className="brand" href="#top">
          <span className="brand-mark">
            <img alt="شعار منظور تقني" src="assets/manzor-logo.webp"/>
          </span>
          <span>
            <strong>منظور تقني</strong>
            <small>حلول رقمية</small>
          </span>
        </a>

        <nav>
          <a href="#first-system">الانظمة</a>
          <a href="#consultation">اطلب استشارتك</a>
          <a
            href="https://wa.me/966573704437?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D9%85%D9%86%D8%B8%D9%88%D8%B1%20%D8%AA%D9%82%D9%86%D9%8A"
            rel="noopener"
            target="_blank"
          >
            اتصل بنا
          </a>
        </nav>

        <div className="header-actions">
          <div className="header-search">
            <button aria-label="فتح البحث" className="search-toggle">
              ⌕
            </button>
            <div className="search-box">
              <input
                autoComplete="off"
                id="system-search"
                placeholder="ابحث عن نظام"
                type="search"
              />
              <div className="search-results" id="search-results"></div>
            </div>
          </div>

          <a className="nav-login" href="/login">
            تسجيل الدخول
          </a>
        </div>
      </header>
      <main id="top">
       <section className="hero">
        <div className="hero-copy glass">
         <h1 aria-label="انظمة تقنية صنعت لتبسيط الاعمال ورفع كفاءة التشغيل" data-text="انظمة تقنية صنعت لتبسيط الاعمال ورفع كفاءة التشغيل" id="typing-title">
          انظمة تقنية صنعت لتبسيط الاعمال ورفع كفاءة التشغيل
         </h1>
         <p>
          مجموعة من الانظمة الرقمية الحديثة تجمع الاداره والتقارير والتواصل والاتمتة في واجهات بسيطة وقابلة للتوسع
         </p>
         <div className="hero-actions">
          <a className="btn primary" href="#first-system">
           استعراض الانظمة
          </a>
          <a className="btn secondary" href="https://wa.me/966573704437?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D9%85%D9%86%D8%B8%D9%88%D8%B1%20%D8%AA%D9%82%D9%86%D9%8A" rel="noopener" target="_blank">
           اتصل بنا
          </a>
         </div>
         <div className="hero-stats">
          <div>
           <strong>
            6
           </strong>
           <span>
            انظمة تقنية
           </span>
          </div>
          <div>
           <strong>
            100%
           </strong>
           <span>
            واجهات متجاوبة
           </span>
          </div>
          <div>
           <strong>
            24/7
           </strong>
           <span>
            وصول عبر الويب
           </span>
          </div>
         </div>
        </div>
        <div className="hero-visual glass">
         <div className="orbit orbit-a">
         </div>
         <div className="orbit orbit-b">
         </div>
         <div className="core">
          <img alt="شعار منظور تقني" src="assets/manzor-logo.webp"/>
         </div>
         <div className="float-card fc-one">
          اداره مركزية
         </div>
         <div className="float-card fc-two">
          تقارير واضحة
         </div>
         <div className="float-card fc-three">
          اتمتة تشغيلية
         </div>
        </div>
       </section>
       <section className="systems-section" id="systems">
        <div className="section-heading">
         <h2>
          الانظمة التقنية
         </h2>
         <p>
          اضغط على عرض التفاصيل لقراة اهداف كل نظام ومميزاته كاملة
         </p>
        </div>
        <article className="system-card glass" data-search="manzor tech systems منظور تك سيستمز erp اي ار بي نظام تخطيط موارد المؤسسة" id="first-system">
         <div className="system-gallery single">
          <img alt="واجهة نظام ERP" loading="lazy" src="assets/erp.jpeg"/>
         </div>
         <div className="system-content">
          <span className="system-type">
           ERP PLATFORM
          </span>
          <h3>
           MANZOR Tech Systems
          </h3>
          <p className="lead">
           منصة ERP متكاملة تجمع انظمة الموسسة وعملياتها في بيية تشغيل موحدة وقابلة للتخصيص
          </p>
          <div className="chips">
           <span>
            الموارد البشرية
           </span>
           <span>
            المحاسبة
           </span>
           <span>
            CRM
           </span>
           <span>
            المشاريع
           </span>
          </div>
          <ul>
           <li>
            توحيد بيانات الجهة وعملياتها في منصة واحدة
           </li>
           <li>
            اداره الصلاحيات والوحدات حسب طبيعة كل جهة
           </li>
           <li>
            ربط الاقسام والتقارير والمستندات ضمن مسار عمل موحد
           </li>
           <li>
            قابلية التوسع واضافة الوحدات مستقبلا
           </li>
          </ul>
          <button className="details-btn" data-modal="erp-modal">
           عرض التفاصيل
          </button>
         </div>
        </article>
        <article className="system-card glass" data-search="manzor mail منظور ميل mail dashboard البريد الايميلات">
         <div className="system-gallery single">
          <img alt="واجهة MANZOR Mail" loading="lazy" src="assets/manzor-mail.jpeg"/>
         </div>
         <div className="system-content">
          <span className="system-type">
           EMAIL OPERATIONS
          </span>
          <span className="development-badge">
           قيد التطوير المستمر
          </span>
          <h3>
           MANZOR Mail
          </h3>
          <p className="lead">
           منصة مركزيه لاداره صناديق البريد الخاصه بعدة جهات من لوحة تحكم واحدة
          </p>
          <div className="chips">
           <span>
            صندوق وارد موحد
           </span>
           <span>
            رسايل التحقق
           </span>
           <span>
            حسابات غير محدودة
           </span>
          </div>
          <ul>
           <li>
            عرض حسابات البريد في داشبورد موحد
           </li>
           <li>
            اظهار الرسايل غير المقروة لكل حساب
           </li>
           <li>
            الوصول السريع الى رسايل التحقق والطلبات
           </li>
           <li>
            تقليل التنقل بين الحسابات ورفع سرعة المتابعة
           </li>
          </ul>
          <button className="details-btn" data-modal="mail-modal">
           عرض التفاصيل
          </button>
         </div>
        </article>
        <article className="system-card glass" data-search="vault منظور فولت محفظة العملاء ملفات العقود">
         <div className="system-gallery dual">
          <img alt="واجهة Vault" loading="lazy" src="assets/vault-main.jpeg"/>
          <img alt="ملف العميل" loading="lazy" src="assets/vault-client.jpeg"/>
         </div>
         <div className="system-content">
          <span className="system-type">
           CLIENT DIGITAL VAULT
          </span>
          <h3>
           Vault منظور
          </h3>
          <p className="lead">
           محفظة رقمية متكاملة تحفظ بيانات العملا وملفاتهم وعقودهم والتزاماتهم ومسار العمل عليهم
          </p>
          <div className="chips">
           <span>
            ملفات العملا
           </span>
           <span>
            العقود
           </span>
           <span>
            السجل المالي
           </span>
           <span>
            سجل النشاط
           </span>
          </div>
          <ul>
           <li>
            انشا ملف مستقل ومتكامل لكل عميل
           </li>
           <li>
            استيراد البيانات من Excel او اضافتها يدويا
           </li>
           <li>
            حفظ الملفات والحسابات والعقود والالتزامات
           </li>
           <li>
            تسجيل الموظف المسوول وتاريخ كل تعديل
           </li>
          </ul>
          <button className="details-btn" data-modal="vault-modal">
           عرض التفاصيل
          </button>
         </div>
        </article>
        <article className="system-card glass" data-search="businessflow بزنس فلو اداره دخل الفروع الايرادات اليومية">
         <div className="system-gallery dual">
          <img alt="لوحة دخل الفروع" loading="lazy" src="assets/businessflow-dashboard.jpeg"/>
          <img alt="ادخال الدخل اليومي" loading="lazy" src="assets/businessflow-entry.jpeg"/>
         </div>
         <div className="system-content">
          <span className="system-type">
           LIGHT REVENUE TRACKING
          </span>
          <h3>
           BusinessFlow
          </h3>
          <p className="lead">
           نظام مبسط لرجال الاعمال ورواد الاعمال واصحاب البسطات والكشكات والعربات المتنقلة والاعمال الخفيفة التي لا تحتاج الى نظام كاشير متكامل
          </p>
          <div className="chips">
           <span>
            مناسب للبسطات والكشكات
           </span>
           <span>
            بدون POS
           </span>
           <span>
            بدون كمبيوتر
           </span>
           <span>
            رابط مباشر
           </span>
           <span>
            تقرير شهري
           </span>
          </div>
          <ul>
           <li>
            الموظف يفتح الرابط ويسجل دخل اليوم مباشرة
           </li>
           <li>
            تسجيل الكاش والشبكة والتحويل والملاحظات لكل فرع او موقع
           </li>
           <li>
            عرض سجل يومي تراكمي لجميع المواقع
           </li>
           <li>
            اداره عدة فروع او نقاط بيع خفيفة من لوحة واحدة
           </li>
           <li>
            تصدير تقرير شهري مجمع بصيغة Excel
           </li>
          </ul>
          <button className="details-btn" data-modal="business-modal">
           عرض التفاصيل
          </button>
         </div>
        </article>
        <article className="system-card glass" data-search="whatsapp sender واتساب سندر حملات تسويق رسائل">
         <div className="system-gallery single">
          <img alt="واجهة WhatsApp Sender" loading="lazy" src="assets/whatsapp-sender.png"/>
         </div>
         <div className="system-content">
          <span className="system-type">
           WHATSAPP MARKETING AUTOMATION
          </span>
          <span className="development-badge">
           قيد التطوير المستمر
          </span>
          <h3>
           WhatsApp Sender
          </h3>
          <p className="lead">
           اداة لاداره حملات واتساب التسويقية من ملفات Excel مع نصوص وصور وسجل واضح للتنفيذ
          </p>
          <div className="chips">
           <span>
            Excel
           </span>
           <span>
            صور ونصوص
           </span>
           <span>
            توقيت الارسال
           </span>
           <span>
            سجل الحملات
           </span>
          </div>
          <ul>
           <li>
            رفع جهات الاتصال من ملف Excel
           </li>
           <li>
            تخصيص الرسالة باسم العميل واضافة صورة
           </li>
           <li>
            تحديد وقت ثابت او عشوايي بين كل رسالة
           </li>
           <li>
            حفظ سجل المرسل والمتبقي ونسبة الانجاز
           </li>
          </ul>
          <button className="details-btn" data-modal="whatsapp-modal">
           عرض التفاصيل
          </button>
         </div>
        </article>
        <article className="system-card glass" data-search="email sender ايميل سندر outlook حملات بريدية html bcc">
         <div aria-label="تكبير واجهة Email Sender" className="mockup email zoomable-mockup" role="button" tabIndex={0}>
          <div className="mock-top">
           <span>
           </span>
           <b>
            Email Sender
           </b>
           <em>
            حملة جديدة
           </em>
          </div>
          <div className="mail-compose">
           <label>
            قائمة المستلمين
            <strong>
             clients.xlsx
            </strong>
           </label>
           <label>
            عنوان الرسالة
            <strong>
             عرض الخدمات الرقمية
            </strong>
           </label>
           <div className="html-preview">
            <i>
            </i>
            <i>
            </i>
            <i>
            </i>
            <h4>
             حملة بريدية احترافية
            </h4>
            <p>
             قالب HTML متجاوب مع هوية الجهة
            </p>
           </div>
          </div>
          <div className="mock-progress">
           <i style={{ width: "82%" }}>
           </i>
          </div>
          <button tabIndex={-1} type="button">
           ارسال الحملة
          </button>
         </div>
         <div className="system-content">
          <span className="system-type">
           EMAIL MARKETING AUTOMATION
          </span>
          <span className="development-badge">
           قيد التطوير المستمر
          </span>
          <h3>
           Email Sender
          </h3>
          <p className="lead">
           اداة لارسال حملات بريدية احترافية عبر Outlook Web باستخدام قوايم Excel وقوالب HTML
          </p>
          <div className="chips">
           <span>
            Outlook Web
           </span>
           <span>
            HTML
           </span>
           <span>
            BCC
           </span>
           <span>
            Excel
           </span>
          </div>
          <ul>
           <li>
            استيراد عناوين البريد من ملف Excel
           </li>
           <li>
            استخدام قالب HTML ثابت ومعاينته قبل الارسال
           </li>
           <li>
            ارسال المستلمين بنسخة مخفية BCC
           </li>
           <li>
            دعم المرفقات وحفظ سجل نتايج الحملة
           </li>
          </ul>
          <button className="details-btn" data-modal="email-modal">
           عرض التفاصيل
          </button>
         </div>
        </article>
       </section>
       <section className="consultation-section glass" id="consultation">
        <div className="consultation-copy">
         <span className="system-type">
          FREE CONSULTATION
         </span>
         <h2>
          اطلب استشارتك الآن
         </h2>
         <p>
          شاركنا احتياجك التقني ونساعدك في اختيار الحل الانسب وترتيب خطوات التنفيذ بوضوح
         </p>
        </div>
        <div className="consultation-actions">
         <a className="btn primary" href="https://wa.me/966573704437?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D9%85%D9%86%D8%B8%D9%88%D8%B1%20%D8%AA%D9%82%D9%86%D9%8A" rel="noopener" target="_blank">
          اطلب استشارتك الآن
         </a>
         <a className="btn secondary" href="/login">
          دخول العملاء
         </a>
        </div>
       </section>
      </main>
      <footer>
       <strong>
        نشر بواسطة منظور تقني © 2026
       </strong>
      </footer>
      <dialog className="modal system-modal" id="erp-modal">
       <button aria-label="اغلاق" className="close">
        ×
       </button>
       <span className="system-type">
        ERP PLATFORM
       </span>
       <h3>
        MANZOR Tech Systems
       </h3>
       <p>
        منصة ERP متكاملة تجمع الموارد البشرية والمحاسبة والعملا والمشاريع والعقود والمستندات والتقارير والبريد والحضور والدعم ضمن بيية تشغيل واحدة
       </p>
       <h4>
        اهداف النظام
       </h4>
       <ul>
        <li>
         توحيد بيانات الجهة وعملياتها في منصة مركزية واحدة
        </li>
        <li>
         رفع كفاة التشغيل وتقليل تكرار ادخال البيانات بين الاقسام
        </li>
        <li>
         تسهيل المتابعة واتخاذ القرار من خلال تقارير ولوحات واضحة
        </li>
        <li>
         توفير بنية مرنة قابلة للتخصيص والنمو مع احتياج الجهة
        </li>
       </ul>
       <h4>
        المميزات
       </h4>
       <ul>
        <li>
         الموارد البشرية والحضور والموظفون والصلاحيات
        </li>
        <li>
         المحاسبة والعملا CRM والمشاريع والعقود والمستندات
        </li>
        <li>
         التقارير والتقويم والموقع والبريد والدعم والتحليلات
        </li>
        <li>
         تخصيص اسما الوحدات وترتيبها وهوية كل جهة
        </li>
        <li>
         ربط الانظمة الداخلية ضمن لوحة تحكم موحدة
        </li>
       </ul>
      </dialog>
      <dialog className="modal system-modal" id="mail-modal">
       <button aria-label="اغلاق" className="close">
        ×
       </button>
       <span className="system-type">
        EMAIL OPERATIONS
       </span>
       <span className="development-badge">
        قيد التطوير المستمر
       </span>
       <h3>
        MANZOR Mail
       </h3>
       <p>
        منصة لاداره البريد الموسسي لعدة جهات من لوحة واحدة مع الوصول السريع للرسايل المهمة ورسايل التحقق
       </p>
       <h4>
        اهداف النظام
       </h4>
       <ul>
        <li>
         تجميع صناديق البريد في مكان واحد
        </li>
        <li>
         تسريع متابعة رسايل العملا والطلبات
        </li>
        <li>
         تسهيل الوصول الى رموز ورسايل التحقق
        </li>
        <li>
         تقليل الوقت الضايع في التنقل بين الحسابات
        </li>
       </ul>
       <h4>
        المميزات
       </h4>
       <ul>
        <li>
         اضافة عدد غير محدود من الحسابات
        </li>
        <li>
         لوحة تحكم موحدة لجميع صناديق البريد
        </li>
        <li>
         عداد للرسايل غير المقروة لكل حساب
        </li>
        <li>
         قسم مخصص لرسايل التحقق
        </li>
        <li>
         فتح بريد كل جهة من داخل النظام
        </li>
        <li>
         واجهة متجاوبة بتصميم زجاجي واضح
        </li>
       </ul>
      </dialog>
      <dialog className="modal system-modal" id="vault-modal">
       <button aria-label="اغلاق" className="close">
        ×
       </button>
       <span className="system-type">
        CLIENT DIGITAL VAULT
       </span>
       <h3>
        Vault منظور
       </h3>
       <p>
        محفظة رقمية تحفظ كل ما يتعلق بالعميل من بيانات وملفات وحسابات وعقود والتزامات مالية وسجل نشاط
       </p>
       <h4>
        اهداف النظام
       </h4>
       <ul>
        <li>
         تجميع معلومات العميل في ملف مركزي واحد
        </li>
        <li>
         منع ضياع الملفات والحسابات والعقود بين الموظفين
        </li>
        <li>
         توثيق مسار العمل والتعديلات على كل عميل
        </li>
        <li>
         ربط مسووليات الموظفين بملفات العملا وخطط العمل
        </li>
       </ul>
       <h4>
        المميزات
       </h4>
       <ul>
        <li>
         ملف مستقل لكل عميل
        </li>
        <li>
         استيراد من Excel واضافة يدوية وربط تكاملي
        </li>
        <li>
         حفظ الملفات والحسابات والعقود والالتزامات المالية
        </li>
        <li>
         متابعة الموظفين والخطط اليومية والاسبوعية
        </li>
        <li>
         سجل نشاط يوضح اسم الموظف وتاريخ كل تعديل
        </li>
        <li>
         تتبع الانجاز والمهام المرتبطة بكل عميل
        </li>
       </ul>
      </dialog>
      <dialog className="modal system-modal" id="business-modal">
       <button aria-label="اغلاق" className="close">
        ×
       </button>
       <span className="system-type">
        LIGHT REVENUE TRACKING
       </span>
       <h3>
        BusinessFlow
       </h3>
       <p>
        نظام مخصص لرجال الاعمال ورواد الاعمال واصحاب البسطات والكشكات والعربات المتنقلة والمحال الصغيرة والاعمال الخفيفة التي تعتمد على الكاش او جهاز الشبكة ولا تحتاج الى نظام POS او جهاز كاشير متكامل
       </p>
       <h4>
        الفية المستهدفة
       </h4>
       <ul>
        <li>
         رجال الاعمال ورواد الاعمال
        </li>
        <li>
         اصحاب البسطات والكشكات والاكشاك
        </li>
        <li>
         العربات المتنقلة والمشاريع الموسمية
        </li>
        <li>
         المحال الصغيرة ونقاط البيع الخفيفة
        </li>
        <li>
         الانشطة التي تعمل بالكاش او الشبكة بدون كاشير كامل
        </li>
       </ul>
       <h4>
        اهداف النظام
       </h4>
       <ul>
        <li>
         تمكين اصحاب البسطات والكشكات والاعمال الخفيفة من تسجيل المبيعات بسهولة
        </li>
        <li>
         تسهيل تسجيل دخل الفروع يوميا من الجوال
        </li>
        <li>
         اداره الدخل اليومي بدون الحاجة الى نظام كاشير متكامل
        </li>
        <li>
         تجميع بيانات جميع المواقع في سجل مركزي
        </li>
        <li>
         متابعة ادا الفروع والمواقع من اي مكان
        </li>
        <li>
         تقليل الاخطا والاعتماد على الجداول والرسايل اليدوية
        </li>
        <li>
         توفير تقرير شهري موحد لصاحب العمل
        </li>
       </ul>
       <h4>
        المميزات
       </h4>
       <ul>
        <li>
         مناسب للبسطات والكشكات والاكشاك والعربات المتنقلة والمحال الصغيرة
        </li>
        <li>
         لا يحتاج POS ولا كمبيوتر ولا جهاز كاشير متكامل
        </li>
        <li>
         يعمل من الجوال او الجهاز اللوحي عبر رابط مباشر
        </li>
        <li>
         تسجيل الايرادات اليومية خلال ثوان
        </li>
        <li>
         تسجيل الكاش والشبكة والتحويل وطرق الدفع المختلفة لكل موقع
        </li>
        <li>
         سجل يومي تراكمي لجميع الفروع
        </li>
        <li>
         اداره عدة فروع او نقاط بيع من لوحة واحدة
        </li>
        <li>
         دعم عدد كبير من المواقع والمستخدمين
        </li>
        <li>
         واجهة بسيطة لا تحتاج الى تدريب
        </li>
        <li>
         تصدير ملف Excel واحد يجمع كامل دخل الشهر
        </li>
       </ul>
      </dialog>
      <dialog className="modal system-modal" id="whatsapp-modal">
       <button aria-label="اغلاق" className="close">
        ×
       </button>
       <span className="system-type">
        WHATSAPP MARKETING AUTOMATION
       </span>
       <span className="development-badge">
        قيد التطوير المستمر
       </span>
       <h3>
        WhatsApp Sender
       </h3>
       <p>
        اداة لاداره حملات واتساب التسويقية باستخدام قوايم Excel ورسايل قابلة للتخصيص وصور ومتابعة واضحة للحملة
       </p>
       <h4>
        اهداف النظام
       </h4>
       <ul>
        <li>
         تنظيم الحملات التسويقية عبر واتساب
        </li>
        <li>
         تقليل العمل اليدوي وتكرار نسخ الرسايل
        </li>
        <li>
         تخصيص الرسالة لكل جهة او عميل
        </li>
        <li>
         متابعة تقدم الحملة وحفظ نتايجها
        </li>
       </ul>
       <h4>
        المميزات
       </h4>
       <ul>
        <li>
         رفع جهات الاتصال من Excel
        </li>
        <li>
         قراة الاسم ورقم الجوال من الملف
        </li>
        <li>
         تخصيص الرسالة باسم العميل
        </li>
        <li>
         ارسال نص مع صورة
        </li>
        <li>
         اختيار زمن ثابت او عشوايي بين الرسايل
        </li>
        <li>
         فتح المحادثة ووضع القالب الجاهز
        </li>
        <li>
         تنبيه منبثق وصوت قبل الارسال
        </li>
        <li>
         ايقاف الحملة واستكمالها وحفظ سجل المرسلات
        </li>
       </ul>
      </dialog>
      <dialog className="modal system-modal" id="email-modal">
       <button aria-label="اغلاق" className="close">
        ×
       </button>
       <span className="system-type">
        EMAIL MARKETING AUTOMATION
       </span>
       <span className="development-badge">
        قيد التطوير المستمر
       </span>
       <h3>
        Email Sender
       </h3>
       <p>
        اداة لارسال حملات بريدية من Outlook Web باستخدام قوايم Excel وقوالب HTML جاهزة مع دعم الخصوصية والمرفقات
       </p>
       <h4>
        اهداف النظام
       </h4>
       <ul>
        <li>
         تسهيل تنفيذ الحملات البريدية المنظمة
        </li>
        <li>
         توحيد شكل الرسايل والهوية البصرية
        </li>
        <li>
         حماية عناوين المستلمين باستخدام BCC
        </li>
        <li>
         تقليل الوقت المطلوب لتجهيز وارسال الحملة
        </li>
       </ul>
       <h4>
        المميزات
       </h4>
       <ul>
        <li>
         استيراد عناوين البريد من Excel
        </li>
        <li>
         استخدام قالب HTML ثابت ومتجاوب
        </li>
        <li>
         معاينة الرسالة قبل الارسال
        </li>
        <li>
         ارسال نسخة مخفية BCC
        </li>
        <li>
         اضافة مرفقات للحملة
        </li>
        <li>
         حفظ سجل الارسال والنتايج
        </li>
       </ul>
      </dialog>
    </SiteShell>
  );
}
