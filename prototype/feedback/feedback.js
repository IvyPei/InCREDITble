'use strict';
const form=document.querySelector('#feedback-form'),consent=form.elements.consent,email=form.elements.email,message=form.elements.message,submit=document.querySelector('#submit'),error=document.querySelector('#form-error');
const source=new URLSearchParams(location.search).get('from');
function update(){
 const interested=form.elements.intent.value==='interest';
 message.required=!interested;consent.required=interested;
 document.querySelector('#message-optional').hidden=!interested;
 document.querySelector('#form-intro').textContent=interested?'Leave your email to hear about early testing and product updates.':'A quick thought can make a big difference. No email needed.';
 document.querySelector('#email-field').hidden=!consent.checked;email.disabled=!consent.checked;email.required=consent.checked;
 submit.innerHTML=interested?'Keep me posted <span aria-hidden="true">→</span>':'Send feedback <span aria-hidden="true">→</span>';
 error.hidden=true;
}
form.addEventListener('change',update);
form.addEventListener('submit',async event=>{
 event.preventDefault();if(submit.disabled)return;if(!form.reportValidity())return;
 const intent=form.elements.intent.value;
 const payload={intent,name:form.elements.name.value.trim(),message:message.value.trim(),email:consent.checked?email.value.trim():'',consent:consent.checked,website:form.elements.website.value,source};
 if(intent==='feedback'&&payload.message.length<3){error.textContent='Please add a few words of feedback.';error.hidden=false;message.focus();return;}
 submit.disabled=true;submit.textContent='Sending…';form.setAttribute('aria-busy','true');error.hidden=true;
 // Feedback is sent only to our backend, never saved in browser storage.
 try{
  const response=await fetch('/api/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
  const result=await response.json().catch(()=>null);
  if(!response.ok||result?.ok!==true||typeof result.id!=='string')throw new Error(result?.error||'Your response could not be saved. Please try again.');
  form.hidden=true;const success=document.querySelector('#success');success.hidden=false;
  document.querySelector('#success-title').textContent=intent==='interest'?'You’re on our interest list.':'Thank you for helping us improve.';
  document.querySelector('#success-message').textContent=payload.consent?'Your response has been saved. Our team may email you about your feedback, early testing and product updates.':'Your feedback has been saved. You haven’t signed up for emails.';
  form.reset();success.focus();
 }catch(cause){error.textContent=cause.name==='TimeoutError'?'We couldn’t confirm your submission. Your text is still here; please try again.':cause.message||'We couldn’t connect. Your text is still here; please try again.';error.hidden=false;}
 finally{submit.disabled=false;form.removeAttribute('aria-busy');submit.innerHTML=intent==='interest'?'Keep me posted <span aria-hidden="true">→</span>':'Send feedback <span aria-hidden="true">→</span>';}
});
update();
