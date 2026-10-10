'use strict';
// Transparent demo ranking, not a calibrated investment or suitability model.
const BondMatching = (() => {
  const issuer = b => b.name.split(' · ')[0];
  function shortlist(eligible,{filters,positions,bonds}) {
    const held=bonds.filter(b=>(positions[b.id]||0)>0);
    const total=held.reduce((n,b)=>n+positions[b.id],0);
    const sectorShare=sector=>total?held.filter(b=>b.sector===sector).reduce((n,b)=>n+positions[b.id],0)/total:0;
    const issuerShare=name=>total?held.filter(b=>issuer(b)===name).reduce((n,b)=>n+positions[b.id],0)/total:0;
    const horizon=Number(filters.term)===0?0.5:Number(filters.term)===31?35:Number(filters.term);
    const scored=eligible.map(b=>{
      const credit=({1:40,2:24,3:8})[b.risk];
      const yieldFit=filters.yield?30*Math.max(0,1-(b.yield-filters.yield)/4):30*b.yield/8;
      const repayment=15*(1-b.years/horizon);
      const exposurePenalty=15*sectorShare(b.sector)+20*issuerShare(issuer(b));
      return {bond:b,score:credit+yieldFit+repayment-exposurePenalty};
    });
    const selected=[];
    while(selected.length<3){
      const available=scored.filter(x=>!selected.some(s=>issuer(s.bond)===issuer(x.bond))).map(x=>({...x,adjusted:x.score-(selected.some(s=>s.bond.years===x.bond.years&&Math.abs(s.bond.yield-x.bond.yield)<0.15&&s.bond.risk===x.bond.risk)?12:0)-(filters.sector==='Any sector'&&selected.some(s=>s.bond.sector===x.bond.sector)?12:0)})).sort((a,b)=>b.adjusted-a.adjusted||a.bond.id.localeCompare(b.bond.id));
      if(!available.length)break;
      selected.push(available[0]);
    }
    return selected.map(({bond},i)=>{
      const share=sectorShare(bond.sector),existing=issuerShare(issuer(bond));
      const mix=i>0&&selected.slice(0,i).every(x=>x.bond.sector!==bond.sector)&&filters.sector==='Any sector';
      const note=existing?'Adds to an issuer you already hold here; that overlap lowered its ranking.':share>0?'This industry is already in your InCreditble bond holdings; that overlap lowered its ranking.':total?'No current InCreditble bond holdings in this industry; external fund exposure is unknown.':'Selected using yield fit, credit quality and time to repayment.';
      return {...bond,matchRank:i+1,selectionNote:note+(mix?' It also adds a different industry to these three choices.':'')};
    });
  }
  function highlights(matches,filters){
    const uniqueBest=(b,key,dir=1)=>matches.length>1&&matches.every(x=>x.id===b.id||dir*key(b)<dir*key(x));
    const term=b=>b.years<1?`${Math.round(b.years*12)} months`:`${b.years} ${b.years===1?'year':'years'}`;
    return matches.map(b=>{
      let title='Another issuer to consider',text=`${b.yield.toFixed(2)}% reference yield, with repayment in ${term(b)}.`;
      if(matches.length===1){title='Fits your preferences';}
      else if(uniqueBest(b,x=>x.years)){title='Earlier scheduled repayment';text=`Due in ${term(b)}, the earliest repayment among these matches—if the issuer pays.`;}
      else if(uniqueBest(b,x=>x.risk)){title='Stronger sample credit quality';text='The strongest credit-quality group among these matches. It can still miss payments.';}
      else if(filters.yield&&uniqueBest(b,x=>Math.abs(x.yield-filters.yield))){title='Closest to your yield target';text=`${b.yield.toFixed(2)}% is closest to your ${filters.yield.toFixed(2)}% minimum among these matches.`;}
      else if(uniqueBest(b,x=>x.yield,-1)){title='More interest for the same face value';text=`${b.yield.toFixed(2)}% is the highest reference yield among these matches. Compare credit quality and repayment timing.`;}
      else if(matches.every(x=>x.id===b.id||x.sector!==b.sector)){title=`A choice in ${b.sector.toLowerCase()}`;text=`A different industry within these matches, with repayment in ${term(b)}.`;}
      return {...b,comparisonTitle:title,comparisonText:text};
    });
  }
  return {shortlist,issuer,highlights};
})();
