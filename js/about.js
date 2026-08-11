(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded',async()=>{
    const site=await CLMD.load('site');
    document.getElementById('visionText').textContent=site.vision;
    document.getElementById('missionText').textContent=site.mission;
    document.getElementById('coreValues').innerHTML=site.coreValues.map((v,i)=>`<div class="col-md-6 col-xl-3"><article class="value-card" data-aos="fade-up" data-aos-delay="${i*70}"><i class="fa-solid ${v.icon}"></i><h3>${CLMD.escape(v.title)}</h3><p>${CLMD.escape(v.text)}</p></article></div>`).join('');
    document.getElementById('leadershipGrid').innerHTML=site.leaders.map((l,i)=>`<div class="col-lg-4"><article class="leader-card" data-aos="fade-up" data-aos-delay="${i*80}"><div class="leader-photo"><img src="${CLMD.asset(l.image)}" alt="Photo placeholder for ${CLMD.escape(l.name)}" loading="lazy"></div><div class="leader-body"><span class="leader-position">${CLMD.escape(l.position)}</span><h3>${CLMD.escape(l.name)}</h3><p class="leader-message">${CLMD.escape(l.message)}</p><button class="btn btn-violet btn-sm" data-leader="${CLMD.escape(l.name)}">Read More</button></div></article></div>`).join('');
    const c=site.contact;
    document.getElementById('aboutContact').innerHTML=[['fa-location-dot','Office Address',c.address],['fa-phone','Regional Office',c.telephone],['fa-phone-volume','CLMD Telephone',c.clmdTelephone],['fa-envelope','Official Email',c.email]].map(x=>`<div class="contact-line"><i class="fa-solid ${x[0]}"></i><div><strong>${x[1]}</strong><span>${CLMD.escape(x[2])}</span></div></div>`).join('');
    document.querySelectorAll('[data-leader]').forEach(b=>b.addEventListener('click',()=>CLMD.toast('Leadership Profile',`${b.dataset.leader}: replace the placeholder image and add the approved full profile before publication.`,'info')));
  });
})();
