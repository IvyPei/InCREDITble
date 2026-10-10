'use strict';
// Synthetic accounting and distribution fixtures. No live prices, returns, or payment feeds.
const PortfolioIncome = (() => {
  const today = '2026-10-09';
  const months = Array.from({length:12}, (_,i) => {
    const date = new Date(Date.UTC(2026,9+i,1));
    return {key:date.toISOString().slice(0,7),year:date.getUTCFullYear(),month:date.getUTCMonth(),label:date.toLocaleDateString('en-US',{month:'short',timeZone:'UTC'}),full:date.toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'UTC'})};
  });
  const usd = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n/100);
  const signed = n => `${n<0?'−':n>0?'+':''}${usd(Math.abs(n))}`;
  const dateLabel = s => new Date(s+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
  const iso = (year,month,day) => new Date(Date.UTC(year,month,day)).toISOString().slice(0,10);
  const received = [
    {account:'local',name:'Harbor Energy',date:'2026-04-09',kind:'interest',cents:3600},
    {account:'local',name:'Harbor Energy',date:'2026-10-09',kind:'interest',cents:3600},
    ...Array.from({length:9},(_,i)=>({account:'fidelity',name:'Corporate bond fund',date:iso(2026,i+1,0),kind:'dividend',cents:5250})),
    ...[2,5,8].map(m=>({account:'fidelity',name:'Broad-market stock fund',date:iso(2026,m+1,0),kind:'dividend',cents:10500})),
    ...[2,8].map(m=>({account:'schwab',name:'Treasury bond holding',date:iso(2026,m,15),kind:'interest',cents:21000})),
    ...[2,5,8].map(m=>({account:'schwab',name:'Dividend stock fund',date:iso(2026,m+1,0),kind:'dividend',cents:4500})),
    {account:'ibkr',name:'Investment-grade corporate bonds',date:'2026-05-15',kind:'interest',cents:18000},
    {account:'ibkr',name:'Corporate bond interest',date:'2026-10-08',kind:'interest',cents:5625}
  ];
  const rules = [
    {account:'fidelity',holding:0,kind:'dividend',rate:2,frequency:4,months:[2,5,8,11],day:0},
    {account:'fidelity',holding:1,kind:'dividend',rate:4.5,frequency:12,months:null,day:0},
    {account:'schwab',holding:0,kind:'interest',rate:4.2,frequency:2,months:[2,8],day:15},
    {account:'schwab',holding:1,kind:'dividend',rate:3,frequency:4,months:[2,5,8,11],day:0},
    {account:'ibkr',holding:0,kind:'interest',rate:4.8,frequency:2,months:[4,10],day:15}
  ];
  function snapshot({positions,bonds,accounts,connected,costBasis={},localRealized=0}) {
    const isIncluded = id => id==='local'||connected[id];
    const paid = received.filter(p=>isIncluded(p.account));
    let unrealized=Object.entries(positions).reduce((sum,[id,face])=>sum+face-(costBasis[id]??face),0),realized=localRealized;
    Object.entries(accounts).forEach(([id,a])=>{
      if(!connected[id])return;
      unrealized+=a.holdings.reduce((sum,h)=>sum+h.value-h.costBasis,0);
      realized+=a.realizedPL||0;
    });
    // Local holdings use a fixed par reference; quote spreads affect cost basis and realized P&L.
    const income = paid.reduce((sum,p)=>sum+p.cents,0);
    const expected=[];
    Object.entries(positions).forEach(([id,face])=>{
      if(face<=0)return;
      const bond=bonds.find(b=>b.id===id);
      const maturity=iso(2026,9+Math.round(bond.years*12),9);
      months.forEach(m=>{
        if(m.month!==3&&m.month!==9)return;
        const date=iso(m.year,m.month,9);
        if(date>today&&date<=maturity)expected.push({account:'local',name:bond.name,date,kind:'interest',cents:Math.round(face*bond.yield/100/2)});
      });
    });
    rules.forEach(rule=>{
      if(!connected[rule.account])return;
      const holding=accounts[rule.account].holdings[rule.holding];
      months.forEach(m=>{
        if(rule.months&&!rule.months.includes(m.month))return;
        const date=rule.day?iso(m.year,m.month,rule.day):iso(m.year,m.month+1,0);
        if(date>today)expected.push({account:rule.account,name:holding.name,date,kind:rule.kind,cents:Math.round(holding.value*rule.rate/100/rule.frequency)});
      });
    });
    expected.sort((a,b)=>a.date.localeCompare(b.date)||a.name.localeCompare(b.name));
    const buckets=months.map(m=>{
      const items=expected.filter(p=>p.date.startsWith(m.key));
      return {...m,interest:items.filter(p=>p.kind==='interest').reduce((s,p)=>s+p.cents,0),dividend:items.filter(p=>p.kind==='dividend').reduce((s,p)=>s+p.cents,0)};
    });
    return {paid,expected,buckets,unrealized,realized,income,profit:unrealized+realized+income,expectedTotal:expected.reduce((s,p)=>s+p.cents,0)};
  }
  function profitMarkup(s) {
    return `<div class="profit-block"><span class="small muted">Total profit / loss · All time</span><strong class="profit-value ${s.profit<0?'negative':'positive'}">${signed(s.profit)}</strong><details class="profit-details"><summary>What’s included</summary><dl class="definition"><dt>Price change on current holdings</dt><dd>${signed(s.unrealized)}</dd><dt>Profit / loss on past sales</dt><dd>${signed(s.realized)}</dd><dt>Interest & dividends received</dt><dd>${signed(s.income)}</dd></dl><p class="disclosure">Sample account history. Received income is already included in cash balances. Expected payments are excluded from profit.</p></details></div>`;
  }
  function render(s,selected,accounts) {
    const selectedMonth=months.find(m=>m.key===selected)||months[0];
    const payments=[...s.paid.map(p=>({...p,status:'Received'})),...s.expected.map(p=>({...p,status:'Expected'}))].filter(p=>p.date.startsWith(selectedMonth.key)).sort((a,b)=>a.date.localeCompare(b.date));
    const max=Math.max(1,...s.buckets.map(b=>b.interest+b.dividend));
    const upcoming=s.expected[0];
    const nextDate=upcoming?.date;
    const nextTotal=s.expected.filter(p=>p.date===nextDate).reduce((sum,p)=>sum+p.cents,0);
    return `<section class="card section-card income-section" aria-label="Interest and dividend payment schedule">
      <div class="spread income-heading"><div><h2>Interest & dividend payments</h2><p class="small muted">See when your investments could pay you.</p></div><span class="tag">Sample schedule</span></div>
      <div class="income-stats"><div><span>Received so far · All time</span><strong>${usd(s.income)}</strong></div><div><span>Expected · Oct 2026–Sep 2027</span><strong>${usd(s.expectedTotal)}</strong></div><div><span>Next expected payment${nextDate?' · '+dateLabel(nextDate):''}</span><strong>${nextDate?usd(nextTotal):'None scheduled'}</strong></div></div>
      <div class="income-layout"><div class="income-chart-area"><div class="legend income-legend"><span><i style="background:#633ac3"></i>Interest</span><span><i style="background:#4c967d"></i>Dividends / fund distributions</span></div><p class="small muted chart-caption">Monthly estimates (rounded) · Select a month for details</p><div class="income-chart-scroll"><div class="income-chart" role="group" aria-label="Expected monthly income, October 2026 to September 2027">
      ${s.buckets.map(b=>{const total=b.interest+b.dividend;return `<button type="button" class="income-month ${b.key===selectedMonth.key?'selected':''}" data-action="income-month" data-month="${b.key}" aria-pressed="${b.key===selectedMonth.key}" aria-label="${b.full}: expected interest ${usd(b.interest)}, dividends ${usd(b.dividend)}"><span class="chart-amount">$${Math.round(total/100)}</span><span class="chart-bars" aria-hidden="true"><span class="chart-stack" style="height:${total/max*128}px"><span class="bar-dividend" style="height:${total?b.dividend/total*100:0}%"></span><span class="bar-interest" style="height:${total?b.interest/total*100:0}%"></span></span></span><span class="chart-month-name">${b.label}</span><small>${b.year}</small></button>`}).join('')}
      </div></div></div><div class="month-payments" aria-live="polite"><h3>${selectedMonth.full}</h3>${payments.length?payments.map(p=>`<div class="payment-item"><div class="spread"><strong>${usd(p.cents)}</strong><span class="payment-status ${p.status==='Received'?'paid':''}">${p.status}</span></div><p>${p.name}</p><small>${dateLabel(p.date)} · ${p.kind==='interest'?'Interest':'Dividend / distribution'}<br>${p.account==='local'?'InCreditble':accounts[p.account].name}</small></div>`).join(''):'<p class="small muted empty-payments">No payments scheduled for this month.</p>'}</div></div>
      <p class="disclosure income-note">Demo snapshot: Oct 9, 2026. Estimates assume you keep today’s holdings and payments continue unchanged. Before tax; principal repayments excluded. Dividends can change and interest payments can be missed.</p>
    </section>`;
  }
  return {snapshot,profitMarkup,render,today};
})();
