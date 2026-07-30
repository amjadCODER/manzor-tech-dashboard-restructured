document.querySelectorAll('[data-modal]').forEach(button=>{
  button.addEventListener('click',()=>{
    const modal=document.getElementById(button.dataset.modal);
    if(modal) modal.showModal();
  });
});

document.querySelectorAll('.modal .close').forEach(button=>{
  button.addEventListener('click',()=>button.closest('dialog').close());
});

document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.addEventListener('click',event=>{
    const rect=dialog.getBoundingClientRect();
    const outside=event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom;
    if(outside) dialog.close();
  });
});

const lightbox=document.createElement('div');
lightbox.className='image-lightbox';
lightbox.setAttribute('role','dialog');
lightbox.setAttribute('aria-modal','true');
lightbox.setAttribute('aria-label','عرض صورة النظام');
lightbox.innerHTML='<button type="button" aria-label="اغلاق الصورة">×</button><img alt="صورة النظام بالحجم الكامل"><div class="mockup-preview"></div>';
document.body.appendChild(lightbox);
const lightboxImg=lightbox.querySelector('img');
const mockupPreview=lightbox.querySelector('.mockup-preview');

function closeLightbox(){
  lightbox.classList.remove('open');
  document.body.classList.remove('lightbox-open');
  lightboxImg.removeAttribute('src');
  lightbox.classList.remove('mockup-mode');
  mockupPreview.innerHTML='';
}

document.querySelectorAll('.system-gallery img').forEach(img=>{
  img.addEventListener('click',event=>{
    event.stopPropagation();
    lightboxImg.src=img.currentSrc||img.src;
    lightboxImg.alt=img.alt||'صورة النظام';
    lightbox.classList.add('open');
    document.body.classList.add('lightbox-open');
  });
});

function openMockupPreview(mockup){
  mockupPreview.innerHTML='';
  const clone=mockup.cloneNode(true);
  clone.classList.remove('zoomable-mockup');
  clone.removeAttribute('role');
  clone.removeAttribute('tabindex');
  clone.removeAttribute('aria-label');
  mockupPreview.appendChild(clone);
  lightbox.classList.add('mockup-mode','open');
  document.body.classList.add('lightbox-open');
}

document.querySelectorAll('.zoomable-mockup').forEach(mockup=>{
  mockup.addEventListener('click',event=>{
    if(event.target.closest('.details-btn')) return;
    event.stopPropagation();
    openMockupPreview(mockup);
  });
  mockup.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){
      event.preventDefault();
      openMockupPreview(mockup);
    }
  });
});

lightbox.querySelector('button').addEventListener('click',closeLightbox);
lightbox.addEventListener('click',event=>{if(event.target===lightbox) closeLightbox()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&lightbox.classList.contains('open')) closeLightbox()});

const searchInput=document.getElementById('system-search');
const resultsBox=document.getElementById('search-results');
const cards=[...document.querySelectorAll('.system-card')];
const systems=cards.map(card=>({card,name:card.querySelector('h3').textContent.trim(),keywords:(card.dataset.search||'').toLowerCase()}));
function runSearch(){
  const q=searchInput.value.trim().toLowerCase();
  resultsBox.innerHTML='';
  cards.forEach(c=>c.classList.remove('search-hidden'));
  if(!q){resultsBox.classList.remove('open');return}
  const matches=systems.filter(x=>x.name.toLowerCase().includes(q)||x.keywords.includes(q));
  matches.forEach(item=>{
    const b=document.createElement('button');
    b.type='button';
    b.textContent=item.name;
    b.addEventListener('click',()=>{
      item.card.scrollIntoView({behavior:'smooth',block:'center'});
      searchInput.value='';
      resultsBox.classList.remove('open');
    });
    resultsBox.appendChild(b);
  });
  resultsBox.classList.toggle('open',matches.length>0);
}
searchInput?.addEventListener('input',runSearch);
document.addEventListener('click',e=>{if(!e.target.closest('.header-search'))resultsBox?.classList.remove('open')});
document.querySelector('.search-toggle')?.addEventListener('click',()=>{
  document.querySelector('.header-search').classList.toggle('open');
  setTimeout(()=>searchInput?.focus(),50);
});

// lightweight typing animation for the hero title
function startHeroTyping(){
  const typingTitle=document.getElementById('typing-title');
  if(!typingTitle) return;
  const fullText=typingTitle.dataset.text||typingTitle.textContent.trim();
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion||!fullText){
    typingTitle.textContent=fullText;
    return;
  }
  typingTitle.textContent='';
  typingTitle.classList.add('typing-active');
  let index=0;
  const typeNext=()=>{
    index+=1;
    typingTitle.textContent=fullText.slice(0,index);
    if(index<fullText.length){
      window.setTimeout(typeNext,70);
    }else{
      typingTitle.classList.remove('typing-active');
    }
  };
  window.setTimeout(typeNext,350);
}
startHeroTyping();
