(function(){
  function el(tag,props,text){var n=document.createElement(tag);Object.assign(n,props||{});if(text)n.textContent=text;return n}

  // Live GitHub repos from /api/github
  var status=document.getElementById('gh-status');
  fetch('/api/github').then(function(r){return r.json()}).then(function(d){
    var list=document.getElementById('gh-repos'),langs=document.getElementById('gh-langs');
    if(!d.repos.length){status.textContent='GitHub is unreachable right now. Visit my profile directly.';return}
    status.textContent=d.repos.length+' public repositories';
    Object.keys(d.languages).forEach(function(k){langs.appendChild(el('span',0,k+' \u00b7 '+d.languages[k]))});
    d.repos.slice(0,6).forEach(function(r){
      var li=el('li');
      li.appendChild(el('a',{href:r.url,target:'_blank',rel:'noopener'},r.name));
      li.appendChild(el('p',0,r.description||'No description yet.'));
      li.appendChild(el('small',0,(r.language||'n/a')+' \u00b7 updated '+r.updated));
      list.appendChild(li);
    });
  }).catch(function(){status.textContent='Could not load repositories.'});

  // Contact form -> POST /api/contact
  var form=document.getElementById('contact-form'),out=document.getElementById('form-status');
  if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var btn=form.querySelector('button'),body=Object.fromEntries(new FormData(form));
    btn.disabled=true;out.className='';out.textContent='Sending\u2026';
    fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
      .then(function(r){return r.json().then(function(j){return{ok:r.ok,j:j}})})
      .then(function(res){
        if(res.ok){out.className='ok';out.textContent=res.j.message;form.reset()}
        else{out.className='err';out.textContent=res.j.fields?Object.values(res.j.fields).join(' '):res.j.message}
      })
      .catch(function(){out.className='err';out.textContent='Network error. Please try again.'})
      .finally(function(){btn.disabled=false});
  });
})();
