'use strict';
// Local, versioned demo progress only. No credentials or identity documents.
const DemoSession = (() => {
  const key='increditble.demo.v1';
  const fields=['cash','positions','costBasis','realizedPL','orders','profile','filters','connected','sync','historyFilters','incomeMonth','yieldAuto'];
  const integer=n=>Number.isSafeInteger(n)&&Math.abs(n)<=1e12;
  const money=n=>integer(n)&&n>=0;
  function decode(raw,bonds,accounts){
    if(!raw)return null;
    try{
      const saved=JSON.parse(raw);if(saved.version!==1)return null;
      const x=saved.data,ids=new Map(bonds.map(b=>[b.id,b])),sectors=new Set(bonds.map(b=>b.sector));
      if(!x||!money(x.cash)||!integer(x.realizedPL)||typeof x.yieldAuto!=='boolean')return null;
      for(const name of ['positions','costBasis'])if(!x[name]||typeof x[name]!=='object'||Array.isArray(x[name])||Object.entries(x[name]).some(([id,n])=>!ids.has(id)||!money(n)))return null;
      if(Object.keys(x.positions).some(id=>!(id in x.costBasis)))return null;
      const p=x.profile,f=x.filters,h=x.historyFilters;
      if(!p||typeof p.complete!=='boolean'||typeof p.verified!=='boolean'||(p.complete&&!p.verified)||!['new','some','experienced'].includes(p.experience)||!['cautious','balanced','open'].includes(p.risk))return null;
      if(!f||!Number.isFinite(f.amount)||f.amount<10||f.amount>1e6||!Number.isFinite(f.yield)||f.yield<0||f.yield>8||!Number.isInteger(f.term)||f.term<0||f.term>31||!(f.sector==='Any sector'||sectors.has(f.sector)))return null;
      if(!h||!['all','local',...Object.keys(accounts)].includes(h.account)||!['all','bonds','equities','cash'].includes(h.asset)||!/^202[67]-(0[1-9]|1[0-2])$/.test(x.incomeMonth))return null;
      if(!x.connected||Object.keys(accounts).some(id=>typeof x.connected[id]!=='boolean'))return null;
      if(!Array.isArray(x.orders)||x.orders.length>10000)return null;
      const orders=x.orders.map(o=>{
        if(!o||!ids.has(o.bond)||!['buy','sell'].includes(o.side)||!['id','cents','face','price','cashBefore','cashAfter','holdingBefore','holdingAfter'].every(k=>money(o[k]))||!o.price||!o.face||!o.cents||typeof o.time!=='string'||o.time.length>40)throw Error('Invalid order');
        if(o.cashAfter!==o.cashBefore+(o.side==='buy'?-o.cents:o.cents)||o.holdingAfter!==o.holdingBefore+(o.side==='buy'?o.face:-o.face))throw Error('Invalid balances');
        return {...o,name:ids.get(o.bond).name,time:o.time.replace(/[<>&"']/g,'')};
      });
      return {cash:x.cash,positions:{...x.positions},costBasis:{...x.costBasis},realizedPL:x.realizedPL,orders,
        profile:{complete:p.complete,verified:p.verified,experience:p.experience,risk:p.risk},filters:{amount:f.amount,yield:f.yield,term:f.term,sector:f.sector},
        connected:Object.fromEntries(Object.keys(accounts).map(id=>[id,x.connected[id]])),sync:Object.fromEntries(Object.keys(accounts).map(id=>[id,'Saved sample snapshot'])),historyFilters:{account:h.account,asset:h.asset},incomeMonth:x.incomeMonth,yieldAuto:x.yieldAuto};
    }catch{return null}
  }
  function encode(state){return JSON.stringify({version:1,data:Object.fromEntries(fields.map(k=>[k,state[k]]))})}
  return {key,decode,encode};
})();
