'use strict';
// Fictional monthly account balances for this throwaway prototype; not price history.
const PortfolioHistory = (() => {
  const history = {
    local: [382500, 385000, 389500, 386000, 394000, 400000],
    fidelity: [3500000, 3580000, 3520000, 3710000, 3780000, 3858000],
    schwab: [1690000, 1710000, 1685000, 1740000, 1760000, 1780000],
    ibkr: [945000, 952000, 941000, 978000, 990000, 1000000]
  };
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const usd = n => new Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format(n/100);
  // Asset balances add to each account's original sample history, in cents.
  const assets = {
    local:{bonds:[145000,146000,147000,145500,149000,150000],equities:[0,0,0,0,0,0]},
    fidelity:{bonds:[1350000,1370000,1360000,1380000,1390000,1400000],equities:[1850000,1900000,1840000,2000000,2050000,2100000]},
    schwab:{bonds:[980000,985000,975000,990000,995000,1000000],equities:[540000,550000,535000,575000,590000,600000]},
    ibkr:{bonds:[710000,715000,700000,735000,742000,750000],equities:[0,0,0,0,0,0]}
  };
  const assetLabels={all:'All assets',bonds:'Bonds',equities:'Equities',cash:'Cash'};
  function values(local, accounts, connected, filters={account:'all',asset:'all'}) {
    const ids=['local',...Object.keys(accounts).filter(id=>connected[id])].filter(id=>filters.account==='all'||filters.account===id);
    return months.map((_,i)=>ids.reduce((sum,id)=>{
      let bonds,equities,cash;
      if(i===5){
        const account=accounts[id];
        bonds=id==='local'?local.bonds:account.holdings.filter(h=>h.type==='Bonds').reduce((n,h)=>n+h.value,0);
        equities=id==='local'?0:account.holdings.filter(h=>h.type!=='Bonds').reduce((n,h)=>n+h.value,0);
        cash=id==='local'?local.cash:account.cash;
      }else{
        bonds=assets[id].bonds[i];equities=assets[id].equities[i];cash=history[id][i]-bonds-equities;
      }
      return sum+({all:bonds+equities+cash,bonds,equities,cash}[filters.asset]);
    },0));
  }
  function render(local, accounts, connected, filters={account:'all',asset:'all'}) {
    const series=values(local,accounts,connected,filters),low=Math.min(...series),high=Math.max(...series);
    const accountOptions=[['all','All accounts'],['local','InCreditble'],...Object.entries(accounts).filter(([id])=>connected[id]).map(([id,a])=>[id,a.name])];
    const accountName=accountOptions.find(([id])=>id===filters.account)[1];
    const step=Math.max(10000,Math.ceil((high-low)/4/10000)*10000);
    const min=Math.max(0,Math.floor(low/step)*step-step), max=Math.ceil(high/step)*step+step;
    const y=value=>180-(value-min)/(max-min)*180;
    const points=series.map((v,i)=>`${i*120},${y(v).toFixed(2)}`).join(' ');
    const tick=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n/100);
    return `<section class="portfolio-history" aria-label="Portfolio value history">
      <div class="history-heading"><h3>${filters.asset==='all'?'Value over time':assetLabels[filters.asset]}</h3><span>6 months · Sample history</span></div>
      <div class="history-filters"><label>Account<select id="history-account" aria-label="Chart account">${accountOptions.map(([id,name])=>`<option value="${id}" ${filters.account===id?'selected':''}>${name}</option>`).join('')}</select></label><label>Show<select id="history-asset" aria-label="Chart asset type">${Object.entries(assetLabels).map(([id,name])=>`<option value="${id}" ${filters.asset===id?'selected':''}>${name}</option>`).join('')}</select></label></div>
      <p class="history-scope">${accountName} · ${assetLabels[filters.asset]}<br>Chart only; the total above includes all accounts.</p>
      <p class="history-readout" id="history-readout" aria-live="polite">Oct 9, 2026 <strong>${usd(series[5])}</strong></p>
      ${high===0?`<div class="history-empty">No ${assetLabels[filters.asset].toLowerCase()} in this selection.</div>`:`<div class="history-plot-row"><div class="history-axis" aria-hidden="true"><span>${tick(max)}</span><span>${tick((min+max)/2)}</span><span>${tick(min)}</span></div>
      <div class="history-plot"><svg viewBox="0 0 600 180" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="portfolio-fill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#7147bf" stop-opacity=".15"/><stop offset="1" stop-color="#7147bf" stop-opacity="0"/></linearGradient></defs>
        <path d="M0 0H600 M0 90H600 M0 180H600" stroke="#e8e3ef" stroke-width="1" stroke-dasharray="4 5" vector-effect="non-scaling-stroke"/>
        <polygon points="0,180 ${points} 600,180" fill="url(#portfolio-fill)"/>
        <polyline points="${points}" fill="none" stroke="#633ac3" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
      </svg>${series.map((value,i)=>`<button type="button" class="history-point" data-action="portfolio-point" data-label="${months[i]} 9, 2026" data-value="${usd(value)}" style="left:${i*20}%;top:${y(value)/180*100}%" aria-label="${months[i]} 9, 2026: ${usd(value)}" aria-pressed="${i===5}"></button>`).join('')}
      <div class="history-months" aria-hidden="true">${months.map(m=>`<span>${m}</span>`).join('')}</div></div></div>`}
      <p class="history-caption">${high===0?'Try another account or asset type.':'Sample balance history.'} Deposits and withdrawals affect this chart; it does not measure returns.</p>
    </section>`;
  }
  return {values,render};
})();
