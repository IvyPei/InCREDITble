/* Discovery prototype: grid search over six synthetic assets, not market advice. */
(() => {
  'use strict';
  const el=id=>document.getElementById(id);
  const money=(n)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
  const assets=[
    {id:'t-short',name:'Short Treasury sample',kind:'Treasury',coupon:.02,risk:5,duration:1,color:'#d9ff66'},
    {id:'t-long',name:'Long Treasury sample',kind:'Treasury',coupon:.05,risk:30,duration:7,color:'#b8d767'},
    {id:'utility',name:'Lumen Utilities sample',kind:'Corporate',coupon:.07,risk:40,duration:4,color:'#b49bff'},
    {id:'industry',name:'Orbit Industries sample',kind:'Corporate',coupon:.09,risk:60,duration:6,color:'#7445ff'},
    {id:'frontier',name:'Frontier Energy sample',kind:'Speculative corporate',coupon:.12,risk:85,duration:4,color:'#ffb185'},
    {id:'venture',name:'Venture Telecom sample',kind:'Speculative corporate',coupon:.13,risk:100,duration:3,color:'#b5657e'}
  ];
  const frequencies={monthly:{periods:12,label:'month',name:'Monthly'},biweekly:{periods:26,label:'2 weeks',name:'Every 2 weeks'},weekly:{periods:52,label:'week',name:'Weekly'},quarterly:{periods:4,label:'quarter',name:'Quarterly'}};
  const builder={capital:10000,risk:35,frequency:'monthly',federal:24,stateTax:5,excluded:[]};
  const candidates=[];
  // 5% increments; corporate issuers capped at 25%, speculative aggregate at 50%.
  for(let c=0;c<=5;c++)for(let d=0;d<=5;d++)for(let e=0;e<=5;e++)for(let f=0;f<=5;f++){
    const remaining=20-c-d-e-f;if(remaining<0)continue;
    for(let a=0;a<=remaining;a++){
      const weights=[a,remaining-a,c,d,e,f].map(x=>x/20);
      const gross=weights.reduce((s,w,i)=>s+w*assets[i].coupon,0);
      if(gross>.100001)continue; // The prototype's visible 2%-10% exploration range.
      candidates.push({weights,gross,risk:weights.reduce((s,w,i)=>s+w*assets[i].risk,0),duration:weights.reduce((s,w,i)=>s+w*assets[i].duration,0)});
    }
  }
  function optimize(){
    const riskBudget=5+builder.risk*.95,maxDuration=1+builder.risk*.06;
    const speculativeCap=builder.risk<35?0:Math.min(.5,(builder.risk-35)/100);
    let best=null,feasible=0;
    for(const candidate of candidates){
      const w=candidate.weights;
      if(candidate.risk>riskBudget+1e-7||candidate.duration>maxDuration+1e-7||w[4]+w[5]>speculativeCap+1e-7)continue;
      if(builder.excluded.some(id=>w[assets.findIndex(a=>a.id===id)]>0))continue;
      feasible++;
      const netRate=w.reduce((s,x,i)=>s+x*assets[i].coupon*(1-builder.federal/100-(i<2?0:builder.stateTax/100)),0);
      if(!best||netRate>best.netRate+1e-9||(Math.abs(netRate-best.netRate)<1e-9&&candidate.risk<best.risk))best={...candidate,netRate};
    }
    if(!best)return {feasible,riskBudget,maxDuration,speculativeCap};
    const fee=builder.capital*.001,available=builder.capital-fee;
    // Three months of the estimated annual net interest are pre-funded from principal.
    const invested=available/(1+.25*best.netRate),net=invested*best.netRate;
    return {...best,feasible,riskBudget,maxDuration,speculativeCap,fee,invested,reserve:available-invested,net,grossDollars:invested*best.gross};
  }
  function renderBuilder(){
    const r=optimize(),freq=frequencies[builder.frequency];
    const label=builder.risk<20?'Cautious':builder.risk<45?'Measured':builder.risk<70?'Adventurous':'High risk';
    el('risk-profile').textContent=label;
    el('portfolio-risk').setAttribute('aria-valuetext',`${label}, ${builder.risk} out of 100; illustrative preference`);
    el('portfolio-risk').style.setProperty('--risk-position',`${builder.risk}%`);
    document.querySelectorAll('[data-builder-frequency]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.builderFrequency===builder.frequency));
    el('builder-result').hidden=!r.weights;el('builder-empty').hidden=!!r.weights;
    el('builder-details').hidden=!r.weights;
    el('builder-state').textContent=JSON.stringify({inputs:builder,selection:r,assets},null,2);
    if(!r.weights){el('builder-empty').textContent='No sample portfolio fits these constraints. Reinclude an asset or adjust your risk preference.';return;}
    el('builder-payday').textContent=money(r.net/freq.periods);
    el('builder-period').textContent=`/ ${freq.label}`;
    el('builder-yield').textContent=`${(r.gross*100).toFixed(2)}%`;
    el('builder-net').textContent=money(r.net);
    el('builder-buffer').textContent=money(r.reserve);
    el('builder-invested').textContent=money(r.invested);
    el('builder-equivalent').textContent=`Annualized after-tax interest equivalent: ${money(r.net)} ÷ ${freq.periods}. Actual payment dates and cash availability need a separate schedule.`;
    el('builder-risk-explain').textContent=builder.risk<20?'Mostly short Treasury exposure. Price and reinvestment risk still exist.':builder.risk<45?'The sample can add duration and corporate exposure. More interest comes with additional price and repayment risk.':builder.risk<70?'The sample may introduce speculative issuers. Missed coupons, principal losses, and difficult early sales become more material.':'This setting permits substantial speculative exposure. High coupons do not compensate for every default, liquidity, or market-price risk.';
    el('builder-allocation').innerHTML=r.weights.map((w,i)=>w?`<span style="width:${w*100}%;background:${assets[i].color}" title="${assets[i].name}: ${(w*100).toFixed(0)}%"></span>`:'').join('');
    el('builder-positions').innerHTML=assets.map((a,i)=>r.weights[i]?`<tr><td><span class="holding-name"><i class="asset-dot" style="background:${a.color}"></i>${a.name}</span><small class="holding-id">${a.kind}</small></td><td>${(r.weights[i]*100).toFixed(0)}%</td><td>${money(r.invested*r.weights[i])}</td><td>${(a.coupon*100).toFixed(1)}%</td></tr>`:'').join('');
    const treasury=(r.weights[0]+r.weights[1])*100,speculative=(r.weights[4]+r.weights[5])*100;
    el('builder-mix').textContent=`${treasury.toFixed(0)}% Treasuries · ${(100-treasury-speculative).toFixed(0)}% other corporates · ${speculative.toFixed(0)}% speculative corporates`;
    el('builder-constraints').textContent=`Sample search: ${r.feasible.toLocaleString()} feasible combinations; 25% maximum per corporate issuer; ${(r.speculativeCap*100).toFixed(0)}% speculative cap; ${r.maxDuration.toFixed(1)}-year duration limit. Actual portfolio risk score: ${r.risk.toFixed(1)} / budget ${r.riskBudget.toFixed(1)}.`;
    el('builder-stress').textContent=`Illustrative rate shock: a +2 percentage-point rate move implies about ${money(r.invested*r.duration*.02)} of bond-price decline using a simple duration approximation (${r.duration.toFixed(1)} years). It excludes convexity, credit-spread changes, and defaults.`;
    el('builder-costs').textContent=`${money(r.fee)} initial cost assumption; ${money(r.reserve)} cash reserve prefunded from your investment; ${money(r.grossDollars-r.net)} annual tax provision. No ongoing fees, execution costs, or default losses are modeled.`;
    el('builder-state').textContent=JSON.stringify({inputs:builder,selection:r,assets,assumptions:'Synthetic at-par coupon samples, not live yields or expected total returns. Grid search maximizes estimated net interest under toy constraints; fractional amounts are not executable bond orders. Reserve earns zero. Annualized equivalents do not guarantee a funded payment schedule.'},null,2);
  }
  for(const [id,key,min,max] of [['portfolio-capital','capital',10000,5000000],['builder-federal','federal',0,40],['builder-state-tax','stateTax',0,15]]){
    el(id).addEventListener('input',e=>{const n=Number(e.target.value),ok=e.target.value!==''&&Number.isFinite(n)&&n>=min&&n<=max;el('builder-error').hidden=ok;if(!ok){el('builder-error').textContent=`${key==='capital'?'Investment amount':'Tax rate'} must be between ${min.toLocaleString()} and ${max.toLocaleString()}. The last valid estimate remains shown.`;return;}builder[key]=n;renderBuilder();});
  }
  el('portfolio-risk').addEventListener('input',e=>{builder.risk=Number(e.target.value);renderBuilder();});
  document.querySelectorAll('[data-builder-frequency]').forEach(b=>b.addEventListener('click',()=>{builder.frequency=b.dataset.builderFrequency;renderBuilder();}));
  el('builder-exclusions').innerHTML=assets.map(a=>`<label><input type="checkbox" value="${a.id}"> Exclude ${a.name}</label>`).join('');
  el('builder-exclusions').addEventListener('change',()=>{builder.excluded=[...el('builder-exclusions').querySelectorAll('input:checked')].map(x=>x.value);renderBuilder();});
  el('builder-review').addEventListener('click',()=>{el('builder-details').open=true;el('builder-details').scrollIntoView({behavior:'smooth',block:'start'});});
  renderBuilder();
})();
