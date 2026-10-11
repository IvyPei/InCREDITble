import {randomUUID} from 'node:crypto';
export const CONSENT_TEXT = 'Yes, the InCreditble team may email me about my feedback, early testing and product updates.';
const MAX_BYTES = 10000;
const json = (status, body) => Response.json(body, {status, headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const bad = message => json(400, {ok:false,error:message});

export function createFeedbackHandler({save, env=process.env, now=()=>new Date(), uuid=randomUUID}) {
  return async request => {
    if (request.method !== 'POST') return new Response('Method not allowed', {status:405,headers:{Allow:'POST','Cache-Control':'no-store'}});
    const allowed = new Set(['https://increditble.vercel.app']);
    for (const host of [env.VERCEL_URL,env.VERCEL_BRANCH_URL]) if(host) allowed.add(`https://${host}`);
    if (env.NODE_ENV==='development') for(const port of [4173,4182,4183]) {allowed.add(`http://127.0.0.1:${port}`);allowed.add(`http://localhost:${port}`);}
    if (!allowed.has(request.headers.get('origin'))) return json(403,{ok:false,error:'Please send this form from the InCreditble website.'});
    if (!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')||'')) return json(415,{ok:false,error:'Please submit the website form.'});
    if (Number(request.headers.get('content-length'))>MAX_BYTES) return json(413,{ok:false,error:'Your response is too long.'});
    let data;
    try {const raw=await request.text();if(Buffer.byteLength(raw)>MAX_BYTES)return json(413,{ok:false,error:'Your response is too long.'});data=JSON.parse(raw);}catch{return bad('Please check your response and try again.');}
    if(!data||typeof data!=='object'||Array.isArray(data))return bad('Please check your response.');
    if(data.website)return bad('Please leave the extra website field empty.');
    if(!['feedback','interest'].includes(data.intent))return bad('Choose feedback or interest.');
    if(typeof data.consent!=='boolean')return bad('Please choose whether we may contact you.');
    for(const [key,max] of [['name',80],['message',2000],['email',254]])if(typeof data[key]!=='string'||data[key].length>max)return bad(`Please check the ${key} field.`);
    const name=data.name.trim(),message=data.message.trim(),email=data.email.trim();
    if(data.intent==='feedback'&&message.length<3)return bad('Please add a few words of feedback.');
    if(data.intent==='interest'&&!data.consent)return bad('Please agree to email contact so we can keep you posted.');
    if(data.consent&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return bad('Please enter a valid email address.');
    if(!data.consent&&email)return bad('Please agree to contact or remove your email.');
    if(!env.BLOB_STORE_ID&&!env.BLOB_READ_WRITE_TOKEN)return json(503,{ok:false,error:'We can’t save your response right now. Please try again shortly.'});
    const date=now(),id=uuid();
    const entry={id,createdAt:date.toISOString(),intent:data.intent,name,message,email:data.consent?email:null,contactConsent:data.consent,consentText:data.consent?CONSENT_TEXT:null,consentedAt:data.consent?date.toISOString():null,consentVersion:'2026-10-11',source:['prototype','pitch','share'].includes(data.source)?data.source:'direct'};
    // No IP addresses, account details, user-agent strings or full referrer URLs are collected.
    const path=`feedback/${date.toISOString().slice(0,10)}/${data.intent}-${id}.json`;
    try {await save(path,JSON.stringify(entry,null,2),{access:'private',contentType:'application/json',addRandomSuffix:false,allowOverwrite:false});}
    catch {return json(503,{ok:false,error:'Your response could not be saved. Please try again. Your text is still here.'});}
    return json(201,{ok:true,id});
  };
}
