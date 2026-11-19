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

  // Project Queries section: Copy email + Email/GitHub draft launcher
  var copyBtn=document.getElementById('copy-email-btn');
  if(copyBtn){
    copyBtn.addEventListener('click',function(){
      var email=copyBtn.getAttribute('data-email')||'';
      if(navigator.clipboard&&email){
        navigator.clipboard.writeText(email).then(function(){
          copyBtn.textContent='Email Copied';
          setTimeout(function(){copyBtn.textContent='Copy Email'},2000);
        });
      }
    });
  }

  var composer=document.getElementById('query-composer');
  if(composer){
    var qName=document.getElementById('q-name'),
        qReply=document.getElementById('q-reply'),
        qProj=document.getElementById('q-project'),
        qBody=document.getElementById('q-body'),
        qOut=document.getElementById('q-status'),
        emailBtn=document.getElementById('q-send-email'),
        ghBtn=document.getElementById('q-send-github');

    function validateDraft(){
      if(qName.value.trim().length<2){qOut.className='err';qOut.textContent='Enter your name (at least 2 characters).';return false}
      if(qReply.value.trim().length<3){qOut.className='err';qOut.textContent='Enter your email or GitHub handle for replies.';return false}
      if(qBody.value.trim().length<10){qOut.className='err';qOut.textContent='Describe your query in at least 10 characters.';return false}
      return true;
    }

    function formattedText(){
      return 'Project: '+qProj.value+'\nFrom: '+qName.value.trim()+'\nReply Email or GitHub Handle: '+qReply.value.trim()+'\n\nQuery Details:\n'+qBody.value.trim();
    }

    if(emailBtn){
      emailBtn.addEventListener('click',function(){
        if(!validateDraft())return;
        var addr=composer.getAttribute('data-email');
        var subj=encodeURIComponent('Project Query: '+qProj.value);
        var body=encodeURIComponent(formattedText());
        qOut.className='ok';qOut.textContent='Opening your email client to '+addr+'.';
        window.location.href='mailto:'+addr+'?subject='+subj+'&body='+body;
      });
    }

    if(ghBtn){
      ghBtn.addEventListener('click',function(){
        if(!validateDraft())return;
        var repo=composer.getAttribute('data-repo');
        var title=encodeURIComponent('[Query] '+qProj.value+': '+qName.value.trim());
        var body=encodeURIComponent(formattedText());
        qOut.className='ok';qOut.textContent='Opening a pre-filled GitHub issue in a new tab.';
        window.open(repo+'/issues/new?title='+title+'&body='+body,'_blank','noopener');
      });
    }
  }
})();
