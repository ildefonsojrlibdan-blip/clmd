(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded',async()=>{
    const site=await CLMD.load('site'),c=site.contact;
    document.getElementById('contactDetails').innerHTML=[['fa-location-dot','Office Address',c.address],['fa-phone','Regional Office Telephone',c.telephone],['fa-phone-volume','CLMD Telephone',c.clmdTelephone],['fa-envelope','Official Regional Email',c.email],['fa-globe','Regional Website',c.website]].map(x=>`<div class="contact-line"><i class="fa-solid ${x[0]}"></i><div><strong>${x[1]}</strong>${String(x[2]).startsWith('http')?`<a href="${x[2]}" target="_blank" rel="noopener">${x[2]}</a>`:`<span>${CLMD.escape(x[2])}</span>`}</div></div>`).join('');
    const params=new URLSearchParams(location.search);if(params.get('subject'))document.getElementById('message').value=`Inquiry regarding ${params.get('subject')}: `;
    document.getElementById('inquiryForm').addEventListener('submit',e=>{e.preventDefault();CLMD.toast('Inquiry recorded','Demo mode: connect this form to the official CLMD email service or backend API before deployment.');e.target.reset()});
    document.getElementById('feedbackForm')?.addEventListener('submit',e=>{e.preventDefault();CLMD.toast('Thank you for your feedback','Your demonstration feedback entry has been acknowledged.');e.target.reset()});
  });
})();
