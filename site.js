(function(){
const form=document.querySelector('[data-audit-form]');
if(form){
 form.addEventListener('submit',function(e){
  e.preventDefault();
  const d=new FormData(form);
  const msg=[
   'Hi ShowMe Digital Agency, I would like a free digital growth audit.',
   '',
   'Name: '+(d.get('name')||''),
   'Business: '+(d.get('business')||''),
   'Industry: '+(d.get('industry')||''),
   'Website: '+(d.get('website')||''),
   'Main goal: '+(d.get('goal')||'')
  ].join('\n');
  window.location.href='https://wa.me/13364572361?text='+encodeURIComponent(msg);
 });
}
})();