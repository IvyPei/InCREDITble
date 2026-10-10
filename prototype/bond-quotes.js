'use strict';
// Invented quotes for fictional securities. No network or live market data.
const BondQuotes = (() => {
  function create(bond, revision=0) {
    const seed=[...bond.id].reduce((n,c)=>n+c.charCodeAt(0),0);
    const spread=12+(seed%4)*2+(revision%3)*2;
    return {bid:10000-spread,ask:10000+spread,mark:10000,revision,
      history:[9972+seed%12,9986,9979+seed%8,10008,9994,10000]};
  }
  function amounts(side,input,price) {
    const face=side==='buy'?Math.floor(input*10000/price):input;
    return {face,cash:Math.round(face*price/10000)};
  }
  function payments(bond,face){
    return {coupon:Math.round(face*bond.yield/100/2),principal:face,next:'2027-04-09',due:new Date(Date.UTC(2026,9+Math.round(bond.years*12),9)).toISOString().slice(0,10)};
  }
  return {create,amounts,payments};
})();
