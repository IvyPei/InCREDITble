/* PROTOTYPE: deterministic synthetic illustration, not a pricing or optimization engine. */
'use strict';
const $ = id => document.getElementById(id);
const usd = (n, decimals = 0) => new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:decimals}).format(n);
const compactUsd = n => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',notation:'compact',maximumFractionDigits:1}).format(n);
const pct = n => `${(n * 100).toFixed(1)}%`;
const dateText = d => d.toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
const startOfMonth = d => new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1));
function addMonths(date, n) {
  const d = new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+n,1));
  const last = new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();
  d.setUTCDate(Math.min(date.getUTCDate(),last)); return d;
}
const issuers = [
  {id:'treasury',name:'U.S. Treasury allocation',rate:.04,phase:0,term:2},
  {id:'harbor',name:'Harbor Software',rate:.05,phase:1,term:3},
  {id:'northstar',name:'Northstar Utilities',rate:.049,phase:2,term:4},
  {id:'cedar',name:'Cedar Consumer',rate:.054,phase:3,term:5},
  {id:'meridian',name:'Meridian Health',rate:.052,phase:4,term:3}
];
const plans = [
  {name:'Balanced income',description:'A mix of sample Treasury and corporate bonds, with a separate reserve for your payday.',weights:[.45,.15,.15,.10,.15]},
  {name:'Treasury emphasis',description:'A larger Treasury allocation and less company exposure. Compare the effect on your cash-flow target.',weights:[.75,.05,.075,.05,.075]},
  {name:'Income emphasis',description:'More corporate exposure and higher sample interest, with greater reliance on company repayments.',weights:[.25,.20,.20,.15,.20]}
];
const state = {capital:100000,payout:250,frequency:'monthly',start:'2026-11-01',keep:100,reinvest:false,federal:24,stateTax:5,plan:0,excluded:[],preferred:[],variant:'A',view:'plan'};
// Posted sample account history is separate from proposed plans. Exploring a plan never trades holdings.
const account = {frozen:false,transactions:[
  {name:'Corner Market',detail:'Oct 2 · debit card •• 2048',cents:-4210,type:'card'},
  {name:'Neighborhood Coffee',detail:'Oct 2 · debit card •• 2048',cents:-650,type:'card'},
  {name:'Your portfolio payday',detail:'Oct 1 · received in cash account',cents:25000,type:'payday'},
  {name:'Opening cash balance',detail:'Sep 30 · sample opening balance',cents:75000,type:'opening'}
]};
const heldPositions=issuers.map((issuer,i)=>({...issuer,value:99150*plans[0].weights[i]}));
const availableCashCents=()=>account.transactions.reduce((sum,t)=>sum+t.cents,0);
let latest, changeMessage = 'Three sample plans. Your payment goal stays the same when you explore alternatives.';
function allocations(treasuryOnly=false) {
  if(treasuryOnly) return [1,0,0,0,0];
  const weights=[...plans[state.plan].weights];
  issuers.forEach((b,i)=>{if(i&&state.excluded.includes(b.id)){weights[0]+=weights[i];weights[i]=0;}});
  issuers.forEach((b,i)=>{if(i&&state.preferred.includes(b.id)&&!state.excluded.includes(b.id)){const tilt=Math.min(.05,.25-weights[i],weights[0]);weights[i]+=tilt;weights[0]-=tilt;}});
  return weights;
}
function paymentDates() {
  const start=new Date(state.start+'T00:00:00Z'), end=addMonths(start,60), dates=[];
  if(state.reinvest) return dates;
  for(let i=0;i<300;i++){
    const d=state.frequency==='monthly'?addMonths(start,i):new Date(start.getTime()+i*7*86400000);
    if(d>=end) break; dates.push(d);
  }
  return dates;
}
function calculate(weights=allocations()) {
  const capital=state.capital, fee=capital*.001, available=capital-fee;
  const start=new Date(state.start+'T00:00:00Z'), payments=paymentDates();
  const annualPayout=payments.length*state.payout/5;
  const grossRate=weights.reduce((s,w,i)=>s+w*issuers[i].rate,0);
  const netRates=issuers.map((b,i)=>b.rate*(1-state.federal/100-(i?state.stateTax/100:0)));
  const netRate=weights.reduce((s,w,i)=>s+w*netRates[i],0);
  // Prefund planned principal consumption as cash; no invisible sales or borrowing.
  const principalReserve=Math.max(0,(annualPayout-available*netRate)*5/(1-5*netRate));
  const reserve=Math.min(available,state.reinvest?0:Math.max(annualPayout*.25,principalReserve));
  let positions=weights.map(w=>w*(available-reserve)), cash=reserve, paid=0, unfunded=0, interest=0, grossInterest=0, taxes=0;
  const ledger=[], annual=[], payEvents=[];
  const firstYearEnd=addMonths(start,12);
  for(let m=0;m<60;m++){
    const left=addMonths(start,m),right=addMonths(start,m+1);
    const inMonth=payments.filter(d=>d>=left&&d<right);
    let monthPaid=0,monthUnfunded=0;
    inMonth.forEach(d=>{
      const transfer=Math.min(state.payout,Math.max(0,cash));
      cash-=transfer;paid+=transfer;monthPaid+=transfer;
      const gap=state.payout-transfer;unfunded+=gap;monthUnfunded+=gap;
      payEvents.push({date:d,requested:state.payout,paid:transfer,gap});
    });
    // Semiannual receipts at each sample bond's offset. Receipts arrive after that period's transfers.
    let gross=0,net=0;
    issuers.forEach((b,i)=>{if(m%6===b.phase){gross+=positions[i]*b.rate/2;net+=positions[i]*netRates[i]/2;}});
    cash+=net;interest+=net;grossInterest+=gross;taxes+=gross-net;
    ledger.push({date:left,net,gross,tax:gross-net,payout:monthPaid,requested:inMonth.length*state.payout,cash,gap:monthUnfunded});
    if((m+1)%12===0){
      if(state.reinvest){positions=positions.map((p,i)=>p+cash*weights[i]);cash=0;}
      annual.push({year:(m+1)/12,capital:positions.reduce((a,b)=>a+b,0)+cash,paid,netInterest:interest});
    }
  }
  const initialBonds=available-reserve;
  const firstYear=ledger.slice(0,12),yearNet=firstYear.reduce((s,r)=>s+r.net,0);
  const firstYearRequested=payments.filter(d=>d<firstYearEnd).length*state.payout;
  const end=annual[4].capital,target=capital*state.keep/100;
  const gap=Math.max(0,target-end),feasible=gap<.5&&unfunded<.5;
  return {weights,fee,reserve,initialBonds,grossRate,netRate,yearNet,firstYearRequested,ledger,annual,payEvents,paid,unfunded,end,target,gap,feasible,interest,grossInterest,taxes,netRates};
}
function render() {
  latest=calculate(); const r=latest;
  const freq=state.frequency==='monthly'?'month':'week';
  $('monthly').setAttribute('aria-pressed',state.frequency==='monthly');
  $('weekly').setAttribute('aria-pressed',state.frequency==='weekly');
  $('payout-label').textContent=`Your ${state.frequency} payday`;
  $('annual-request').textContent=state.reinvest?'Payouts paused while reinvesting.':`${usd(r.firstYearRequested)} requested in the first 12 months`;
  $('payout').disabled=state.reinvest;
  $('keep-label').textContent=`${state.keep}%`;
  $('keep-dollars').textContent=`Aim to retain ${usd(r.target)}. Not a guarantee.`;
  $('hero-amount').textContent=state.reinvest?'Growing':usd(state.payout,state.frequency==='weekly'?2:0);
  $('hero-frequency').textContent=state.reinvest?'your capital':`/ ${freq}`;
  $('hero-caption').textContent=state.reinvest?'Net interest stays in the portfolio; reinvested annually in this model.':'A planned transfer to your cash account, after modeled tax provisions.';
  $('first-date').textContent=state.reinvest?'Payouts paused':dateText(new Date(state.start+'T00:00:00Z'));
  $('net-interest').textContent=usd(r.yearNet);
  $('reserve-total').textContent=usd(r.reserve);
  $('status').className='status'+(r.feasible?'':' shortfall');
  $('status').innerHTML=r.feasible?`<strong>Fits this illustration</strong>${state.reinvest?'No cash payouts are scheduled.':r.firstYearRequested>r.yearNet?'Part of your planned spending comes from principal.':'Your first-year net interest covers the requested annual payouts.'} Assumptions can change.`:`<strong>This plan needs an adjustment</strong>${r.unfunded>.5?`${usd(r.unfunded)} of requested payments are unfunded. `:''}${r.gap>.5?`Ending capital is ${usd(r.gap)} below your target.`:''} Try a smaller payday, more capital, or a lower capital target.`;
  $('review').innerHTML=r.feasible?'Review this plan <span>↗</span>':'Review the funding gap <span>↗</span>';
  renderCashChart(r);renderPortfolio(r);renderFuture(r);renderRisk(r);renderAccounts();
  $('state-view').textContent=JSON.stringify({...state,accounts:{availableCash:availableCashCents()/100,cardFrozen:account.frozen,portfolioBonds:99150,portfolioReserve:750,transactions:account.transactions},computed:{startingReserve:Math.round(r.reserve),investedInBonds:Math.round(r.initialBonds),firstYearNetInterest:Math.round(r.yearNet),fiveYearRequested:Math.round(r.paid+r.unfunded),fiveYearPaid:Math.round(r.paid),unfundedPayments:Math.round(r.unfunded),endingCapital:Math.round(r.end),capitalTarget:Math.round(r.target),feasible:r.feasible},assumptions:'Synthetic at-par bonds; fixed rates; 0.10% initial cost; no default or market-price modeling; tax provision, not withholding; unchanged rates on maturity rolls. Posted account snapshot is independent from unapproved plan changes.'},null,2);
  if($('review-dialog').open) renderReview();
}
function renderCashChart(r){
  const rows=r.ledger.slice(0,12),max=Math.max(1,...rows.map(x=>Math.max(x.net,x.requested)));
  $('cash-chart').innerHTML=`<span class="chart-max">${usd(max)} scale maximum</span>`+rows.map(row=>{
    const mon=row.date.toLocaleDateString('en-US',{month:'short',timeZone:'UTC'});
    return `<div class="month-group" title="${mon}: ${usd(row.net)} net interest; ${usd(row.payout)} funded payout${row.gap>.5?`; ${usd(row.gap)} unfunded`:''}"><span class="bar net" style="height:${row.net/max*100}%"></span><span class="bar out" style="height:${row.payout/max*100}%"></span><span class="month-label">${mon}</span></div>`;
  }).join('');
  $('cash-chart').setAttribute('aria-label',rows.map(row=>`${row.date.toLocaleDateString('en-US',{month:'short',timeZone:'UTC'})}: net interest ${usd(row.net)}, payout ${usd(row.payout)}`).join('; '));
  $('cash-ledger').innerHTML=rows.map(row=>`<tr><td>${dateText(row.date)}</td><td>${usd(row.net)}</td><td>${usd(row.payout)}${row.gap>.5?`<br><small>${usd(row.gap)} unfunded</small>`:''}</td><td>${usd(row.cash)}</td></tr>`).join('');
  $('payment-ledger').innerHTML=r.payEvents.length?r.payEvents.slice(0,8).map(row=>`<tr><td>${dateText(row.date)}</td><td>${usd(row.requested,2)}</td><td>${usd(row.paid,2)}${row.gap>.5?' · shortfall':''}</td></tr>`).join(''):'<tr><td colspan="3">Payments are paused while reinvesting.</td></tr>';
}
function renderPortfolio(r){
  $('plan-title').textContent=plans[state.plan].name;
  $('plan-description').textContent=plans[state.plan].description;
  const values=[{name:'Treasuries',amount:r.initialBonds*r.weights[0],color:'#b49bff'},{name:'Corporates',amount:r.initialBonds*(1-r.weights[0]),color:'#241634'},{name:'Cash reserve',amount:r.reserve,color:'#d9ff66'}];
  const denominator=state.capital-r.fee;
  $('allocation-bar').innerHTML=values.map(x=>`<span style="width:${x.amount/denominator*100}%;background:${x.color}" title="${x.name}: ${usd(x.amount)}"></span>`).join('');
  $('allocation-legend').innerHTML=values.map(x=>`<span><i style="background:${x.color}"></i>${x.name} ${pct(x.amount/denominator)}</span>`).join('');
  $('change-note').textContent=changeMessage;
  const t=calculate(allocations(true));
  $('comparison').innerHTML=`<div class="comparison-grid"><div><h3>Your selected plan</h3><p>First-year net interest</p><strong>${usd(r.yearNet)}</strong><p>${pct(1-r.weights[0])} corporate allocation within bonds<br>5-year capital: ${usd(r.end)}<br>${r.feasible?'Fits the sample assumptions':'Funding / capital gap'}</p></div><div><h3>Treasury-only baseline</h3><p>First-year net interest</p><strong>${usd(t.yearNet)}</strong><p>No corporate exposure<br>5-year capital: ${usd(t.end)}<br>${t.feasible?'Fits the sample assumptions':'Funding / capital gap'}</p></div></div><p class="small muted" style="margin-top:12px">Same cash goals and taxes; each plan sizes its own cash reserve. This is a synthetic comparison, not a market quote.</p>`;
  $('bond-list').innerHTML=issuers.map((b,i)=>{
    const excluded=state.excluded.includes(b.id),preferred=state.preferred.includes(b.id);
    return `<div class="bond-row ${excluded?'excluded':''}"><div><h3>${b.name}</h3><p>${usd(r.initialBonds*r.weights[i])} · ${pct(b.rate)} sample coupon · ${b.term}-year sample maturity</p></div>${i?`<div class="bond-controls"><button data-prefer="${b.id}" aria-pressed="${preferred}" ${excluded?'disabled':''}>${preferred?'Preferred':'Prefer'}</button><button data-exclude="${b.id}" aria-pressed="${excluded}">${excluded?'Include':'Exclude'}</button></div>`:'<span class="small muted">Baseline asset</span>'}</div>`;
  }).join('');
}
function renderFuture(r){
  $('five-payout').textContent=usd(r.paid);
  $('end-capital').textContent=usd(r.end);
  $('end-target').textContent=`Your target: ${usd(r.target)}${r.gap>.5?` · ${usd(r.gap)} below target`:''}`;
  $('payout-sources').textContent=state.reinvest?`${usd(r.interest)} in modeled net interest stays in your portfolio over five years.`:`Across five years: ${usd(r.interest)} net interest earned; ${usd(Math.max(0,r.paid-r.interest))} net principal spent on payouts. Returned principal is not additional income.`;
  const max=Math.max(state.capital,...r.annual.map(x=>x.capital));
  $('capital-chart').innerHTML=[{year:0,capital:state.capital},...r.annual].map(x=>`<div class="capital-column" style="height:${Math.max(3,x.capital/max*100)}%" title="${x.year?'Year '+x.year:'Today'}: ${usd(x.capital)}"><span>${x.year?'Year '+x.year:'Today'}<br>${compactUsd(x.capital)}</span></div>`).join('');
  const maturity={};
  issuers.forEach((b,i)=>{const amount=r.initialBonds*r.weights[i];if(amount>0){for(let year=b.term;year<=5;year+=b.term)maturity[year]=(maturity[year]||0)+amount;}});
  $('maturity-ledger').innerHTML=Object.entries(maturity).map(([year,amount])=>`<tr><td>${dateText(addMonths(new Date(state.start+'T00:00:00Z'),Number(year)*12))}</td><td>${usd(amount)}</td><td>Reinvest at sample rate</td></tr>`).join('');
}
function renderRisk(r){
  $('credit-risk').textContent=`${pct(1-r.weights[0])} of the bond allocation is in sample corporate issuers. Missed interest or principal payments could reduce your cash flow. Ratings and defaults are not modeled.`;
  $('rate-risk').textContent='Your account value can fall when rates rise. Selling before maturity could realize a loss. This illustration assumes no early sales and no callable bonds.';
  $('cash-risk').textContent=`${usd(r.reserve)} starts in cash, earning 0% in this model. It bridges uneven receipts${r.firstYearRequested>r.yearNet?' and planned principal spending':''}. Taxes, maturity reinvestment rates, and available bonds can change.`;
  const largest=Math.max(0,...issuers.map((b,i)=>i?r.initialBonds*r.weights[i]*r.netRates[i]/2:0));
  $('stress-copy').textContent=largest?`One missed coupon from the largest sample corporate position would reduce net cash receipts by about ${usd(largest)}. The buffer is not a guarantee and would need to be reassessed. Principal default losses would be separate; they are not estimated here.`:'This allocation has no corporate positions. Treasury market-value and reinvestment risks still remain.';
}
function renderReview(){
  const r=latest;
  $('review-content').innerHTML=[['Investment',usd(state.capital)],['Planned payday',state.reinvest?'Reinvest; no payouts':`${usd(state.payout,2)} ${state.frequency}`],['Initial cost assumption',usd(r.fee)],['Cash reserved upfront',usd(r.reserve)],['Expected net interest, year 1',usd(r.yearNet)],['Total paid, 5 years',usd(r.paid)],['Projected remaining capital',usd(r.end)],['Desired remaining capital',usd(r.target)]].map(([a,b])=>`<div class="review-row"><span>${a}</span><strong>${b}</strong></div>`).join('')+(r.feasible?'':`<p class="review-warning">This sample plan does not meet your goals. Unfunded payments: ${usd(r.unfunded)}. Ending-capital shortfall: ${usd(r.gap)}. Adjust your goals before proceeding.</p>`);
  $('finish-review').textContent=r.feasible?'Looks good for now':'Back to adjust my plan';
  $('review-confirmation').textContent='';
}
function renderAccounts(){
  const balance=availableCashCents()/100;
  $('cash-balance').textContent=usd(balance,2);$('cash-tile-balance').textContent=usd(balance,2);
  $('card-spending').textContent=usd(-account.transactions.filter(t=>t.type==='card').reduce((sum,t)=>sum+t.cents,0)/100,2);
  $('card-state').textContent=account.frozen?'Frozen · demo':'Active · demo';
  $('debit-card').classList.toggle('frozen',account.frozen);
  $('freeze-card').textContent=account.frozen?'Unfreeze card':'Freeze card';
  $('freeze-card').setAttribute('aria-pressed',account.frozen);
  $('cash-activity').innerHTML=account.transactions.map(t=>`<div class="activity-row"><span class="activity-symbol" aria-hidden="true">${t.type==='payday'?'↙':t.type==='card'?'↗':'+'}</span><div class="activity-copy"><strong>${t.name}</strong><small>${t.detail}</small></div><span class="activity-amount ${t.cents>0?'credit':''}">${t.cents>0?'+':'−'}${usd(Math.abs(t.cents)/100,2)}</span></div>`).join('');
  $('account-holdings').innerHTML=heldPositions.map((b,i)=>`<tr><td><span class="holding-name">${b.name}</span><small class="holding-id">Sample position ${String(i+1).padStart(2,'0')}</small></td><td>${i?'Corporate':'Treasury'}</td><td>${usd(b.value,2)}</td><td>${pct(b.rate)}</td><td>Nov 1, ${2026+b.term}</td></tr>`).join('');
  const maturities={};heldPositions.forEach(b=>maturities[b.term]=(maturities[b.term]||0)+b.value);
  $('account-maturities').innerHTML=Object.entries(maturities).map(([year,value])=>`<div class="maturity-item"><span>Nov ${2026+Number(year)}</span><strong>${usd(value)}</strong><small>Scheduled principal repayment</small></div>`).join('');
}
function setView(view,push=true){
  state.view=['plan','cash','bonds'].includes(view)?view:'plan';
  document.body.dataset.view=state.view;
  $('planner').hidden=state.view!=='plan';$('cash-account').hidden=state.view!=='cash';$('bond-account').hidden=state.view!=='bonds';
  document.querySelector('.variant-switcher').hidden=state.view!=='plan';
  const copy={plan:['YOUR MONEY, ON YOUR SCHEDULE','A payday.<br><em>Of your own making.</em>','Give your money a job. Plan the cash you want to receive,<br class="desktop"> and explore the bond portfolio behind it.'],cash:['YOUR PAYDAY, READY FOR EVERYDAY','Made to grow.<br><em>Ready to spend.</em>','Your portfolio pays your cash account.<br class="desktop"> Your debit card takes it from there.'],bonds:['YOUR PORTFOLIO, YOUR PACE','Find your rhythm.<br><em>See what it could pay.</em>','Choose an amount and explore your comfort with risk.<br class="desktop"> See the cash-flow estimate and the bonds behind it.']}[state.view];
  $('page-eyebrow').textContent=copy[0];$('page-title').innerHTML=copy[1];$('page-description').innerHTML=copy[2];
  document.querySelectorAll('[data-view]').forEach(button=>{const selected=button.dataset.view===state.view;button.classList.toggle('nav-active',selected);if(selected)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
  if(push){const url=new URL(location.href);url.searchParams.set('view',state.view);history.replaceState(null,'',url);}
  render();
}
function updateInput(id,key,min,max){
  $(id).addEventListener('input',()=>{
    const raw=$(id).value,n=Number(raw);
    if(raw!==''&&Number.isFinite(n)&&n>=min&&n<=max){state[key]=n;$('input-error').hidden=true;render();}
  });
  $(id).addEventListener('change',()=>{
    const raw=$(id).value,n=Number(raw);
    if(raw===''||!Number.isFinite(n)||n<min||n>max){$('input-error').hidden=false;$('input-error').textContent=`Please enter a value between ${min.toLocaleString()} and ${max.toLocaleString()}.`;$(id).value=state[key];return;}
    $('input-error').hidden=true;state[key]=n;render();
  });
}
updateInput('capital','capital',10000,5000000);updateInput('payout','payout',0,100000);updateInput('federal','federal',0,40);updateInput('state-tax','stateTax',0,15);
$('keep').addEventListener('input',e=>{state.keep=Number(e.target.value);render();});
$('reinvest').addEventListener('change',e=>{state.reinvest=e.target.checked;render();});
$('start').addEventListener('change',e=>{if(e.target.value>='2026-11-01'&&e.target.value<='2027-12-31'){state.start=e.target.value;$('input-error').hidden=true;render();}else{e.target.value=state.start;$('input-error').hidden=false;$('input-error').textContent='Choose a sample start date between November 1, 2026 and December 31, 2027.';}});
document.querySelectorAll('[data-frequency]').forEach(button=>button.addEventListener('click',()=>{const next=button.dataset.frequency;if(next===state.frequency)return;state.payout=Math.round(state.payout*(next==='weekly'?12/52:52/12)*100)/100;state.frequency=next;$('payout').value=state.payout;render();}));
$('alternative').addEventListener('click',()=>{const previous=plans[state.plan].name;state.plan=(state.plan+1)%plans.length;changeMessage=`${previous} → ${plans[state.plan].name}. Payment goal, taxes, exclusions, and preferences are unchanged.`;render();});
$('bond-list').addEventListener('click',e=>{const exclude=e.target.closest('[data-exclude]'),prefer=e.target.closest('[data-prefer]');if(exclude){const id=exclude.dataset.exclude;state.excluded=state.excluded.includes(id)?state.excluded.filter(x=>x!==id):[...state.excluded,id];state.preferred=state.preferred.filter(x=>x!==id);changeMessage='Exclusions move that allocation to Treasuries; the cash-flow projection has been recalculated.';render();}if(prefer){const id=prefer.dataset.prefer;state.preferred=state.preferred.includes(id)?state.preferred.filter(x=>x!==id):[...state.preferred,id];changeMessage='Preference applied within the sample 25% issuer limit. Your cash-flow goal is unchanged.';render();}});
for(const [button,panel] of [['compare-toggle','comparison'],['holdings-toggle','holdings']])$(button).addEventListener('click',()=>{$(panel).hidden=!$(panel).hidden;$(button).setAttribute('aria-expanded',!$(panel).hidden);});
$('show-schedule').addEventListener('click',()=>{$('schedule-details').open=!$('schedule-details').open;});
document.querySelectorAll('[data-scroll]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.scroll).scrollIntoView({behavior:'smooth'})));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{setView(b.dataset.view);document.querySelector('.intro').scrollIntoView({behavior:'smooth'});}));
$('freeze-card').addEventListener('click',()=>{account.frozen=!account.frozen;$('card-message').textContent=account.frozen?'Card frozen. Simulated purchases are blocked.':'Card active. You can try a simulated purchase.';render();});
$('coffee-payment').addEventListener('click',()=>{
  if(account.frozen){$('card-message').textContent='Purchase declined in demo: your card is frozen. Your balances are unchanged.';return;}
  if(availableCashCents()<650){$('card-message').textContent='Purchase declined in demo: not enough available cash. No bonds were sold and no credit was used.';return;}
  account.transactions.unshift({name:'Neighborhood Coffee',detail:'Just now · simulated debit card purchase',cents:-650,type:'card'});
  $('card-message').textContent=`Demo purchase approved. ${usd(availableCashCents()/100,2)} remains available. Your portfolio holdings are unchanged.`;render();
});
$('review').addEventListener('click',()=>{renderReview();$('review-dialog').showModal();});
$('close-dialog').addEventListener('click',()=>$('review-dialog').close());
$('finish-review').addEventListener('click',()=>{if(!latest.feasible){$('review-dialog').close();$('controls').scrollIntoView({behavior:'smooth'});$('payout').focus();}else{$('review-confirmation').textContent='Plan reviewed in this demo. No account was opened and no money moved.';}});
const variants={A:'A · Payday dashboard',B:'B · Guided plan',C:'C · Cash-flow workbench'};
function setVariant(value,push=true){state.variant=variants[value]?value:'A';document.body.dataset.variant=state.variant;$('variant-name').textContent=variants[state.variant];if(push){const url=new URL(location.href);url.searchParams.set('variant',state.variant);history.replaceState(null,'',url);}render();}
function cycle(direction){const keys=Object.keys(variants);setVariant(keys[(keys.indexOf(state.variant)+direction+3)%3]);}
$('previous-variant').addEventListener('click',()=>cycle(-1));$('next-variant').addEventListener('click',()=>cycle(1));
document.addEventListener('keydown',e=>{if(state.view!=='plan'||$('review-dialog').open||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,[contenteditable]'))return;if(e.key==='ArrowRight'){e.preventDefault();cycle(1);}if(e.key==='ArrowLeft'){e.preventDefault();cycle(-1);}});
setVariant(new URL(location.href).searchParams.get('variant')||'A',false);
setView(new URL(location.href).searchParams.get('view')||'plan',false);
