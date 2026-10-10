'use strict';
// Local, deterministic explanations for synthetic bonds. No AI service or real issuer data.
const BondGuide = (() => {
  const usd = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n/100);
  const pct = n => n.toFixed(2)+'%';
  const term = b => b.years<1?`${Math.round(b.years*12)} months`:`${b.years} ${b.years===1?'year':'years'}`;
  const due = b => new Date(Date.UTC(2026,9+Math.round(b.years*12),9)).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
  function rationale(b,c){
    const f=c.filters, meets=b.yield>=f.yield, horizon=Number(f.term), fits=horizon===31||(horizon===0?b.years<1:b.years<=horizon);
    const yieldReason=f.yield?`${pct(b.yield)} ${meets?'meets':'is below'} your ${pct(f.yield)} minimum yield.`:'You have not set a minimum yield.';
    const sectorReason=f.sector==='Any sector'?`You left industry open; this adds a ${b.sector.toLowerCase()} bond option.`:`${b.sector} ${b.sector===f.sector?'matches':'differs from'} your industry choice.`;
    const why=`${yieldReason} Repayment in ${term(b)} ${fits?'fits':'exceeds'} your selected timeframe. ${sectorReason}`;
    const peers=c.bonds.filter(x=>x.id!==b.id&&x.sector===b.sector&&x.years===b.years&&x.risk<=c.maxRisk);
    const safer=peers.filter(x=>x.risk<b.risk&&x.yield<b.yield).sort((a,z)=>z.yield-a.yield)[0];
    const higher=peers.filter(x=>x.risk>b.risk&&x.yield>b.yield).sort((a,z)=>a.yield-z.yield)[0];
    let tradeoff=safer?`An option with higher credit quality in this industry, also due in ${term(b)}, yields ${pct(safer.yield)} in the demo. This bond pays more, with a weaker sample credit rating.`:higher?`An option with lower credit quality in this industry, also due in ${term(b)}, yields ${pct(higher.yield)} in the demo. This bond offers a lower yield with a stronger sample credit rating.`:`The ${b.rating} rating is a sample credit-quality label, not a repayment guarantee.`;
    tradeoff+=b.years>=10?' The long wait to repayment also matters if you need to sell early.':' Selling before repayment may return less than you invested.';
    if(b.risk>c.maxRisk)tradeoff='This bond is outside your current credit-risk preference. '+tradeoff;
    return {why,tradeoff};
  }
  function portfolio(b,c){
    const cents=Math.round(c.filters.amount*100),t=c.totals;
    const own=c.positions[b.id]||0;
    if(cents>c.cash)return `Your selected ${usd(cents)} exceeds the ${usd(c.cash)} available in InCreditble. External account balances cannot fund this trade.`;
    return `Using your selected ${usd(cents)} of InCreditble cash would change bonds from ${(t.bonds/t.total*100).toFixed(1)}% to ${((t.bonds+cents)/t.total*100).toFixed(1)}% of the portfolio shown here. This is an illustration at the $100 valuation reference. The execution quote and spread change the final face value and portfolio total. ${own?`You already hold ${usd(own)} of this exact bond here.`:'You do not currently hold this exact bond in InCreditble.'} External funds have no company or industry breakdown in this demo, so I cannot judge overall issuer concentration or diversification.`;
  }
  function answer(question,b,c){
    const q=question.toLowerCase(),r=rationale(b,c),amount=Math.round(c.filters.amount*100);
    if(/buy for me|place.*order|execute|帮我买|替我买|下单/.test(q))return ['I can explain this sample bond. To trade, return to the bond details, choose an amount and review the simulated order yourself.'];
    if(/fraction|minimum|small amount|small budget|start small|少量|小额|最低|碎额/.test(q))return ['Yes. This demo lets you buy a small part of a bond from $10, rather than a full unit. You can enter dollar-and-cent amounts such as $10 or $25.50.','The same issuer and early-sale risks apply to a small position. Real fractional availability and execution are not connected in this prototype.'];
    if(/portfolio|holdings|allocation|diversif|持仓|组合|占比|分散/.test(q))return [portfolio(b,c)];
    if(/company|issuer|business|公司|发行人|业务|赚钱|revenue/.test(q))return [`${b.company.name} is fictional. ${b.company.business}`,`How it earns money: ${b.company.income}`,`What to watch: ${b.company.watch} These are invented business characteristics, not findings from company research.`,`The demo includes a sample rating of ${b.rating}, a ${pct(b.yield)} yield and repayment on ${due(b)}. It contains no verified financial statements, company research or current news. Those would be needed to assess a real issuer.`];
    if(/cd|deposit|bank|benchmark|定存|银行|基准/.test(q)){
      const cd=c.cds.find(x=>x.years===b.years);
      return cd?[`For repayment in ${term(b)}, the illustrative bank CD pays ${pct(cd.apy)} APY; the bond's sample yield is ${pct(b.yield)}. These are fictional figures, not live offers.`,`APY includes compounding. The bond example assumes all promised payments arrive and you hold to repayment. A rate difference alone does not make one the better choice; payment risk and early-exit terms differ.`]:[`This demo has no same-term CD quote for a ${term(b)} bond. I cannot give a like-for-like rate comparison. The finder may show a shorter-term reference, labeled as such.`];
    }
    if(/risk|safe|stable|default|lose|sell|guarantee|风险|安全|稳定|违约|损失|卖|保证/.test(q))return [r.tradeoff,`The issuer could miss interest or fail to repay principal. The ${pct(b.defaultRate)} annual default rate is an invented demo value, not a forecast or your chance of losing money. Selling early depends on the available price and buyer.`,c.experience==='experienced'?`Sample assumptions: non-callable, valuation reference 100, no accrued interest or fees. Buy and sell quotes are simulated; no live executable price is provided.`:'A promised payment is not a guaranteed payment. The money you get back can be less than you put in.'];
    if(/interest|income|earn|payment|yield|收益|利息|付息|赚/.test(q)){
      const annual=Math.round(amount*b.yield/100),coupon=Math.round(amount*b.yield/100/2);
      return [`At the $100 reference price, ${usd(amount)} of face value pays ${usd(annual)} in annualized interest, before tax and real-world fees, if payments arrive as promised. ${b.years<1?`Over its remaining ${term(b)}, the interest is ${usd(Math.round(amount*b.yield/100*b.years))}.`:`Each scheduled half-year payment is about ${usd(coupon)}.`}`,`The next modeled payment is April 9, 2027. Principal repayment is due ${due(b)} and is separate from interest.`,c.experience==='experienced'?`Coupon and reference yield equal ${pct(b.yield)} at par. The execution quote changes actual yield and the face value your budget buys.`:'Annual yield does not mean money arrives every month. This demo schedules interest twice a year, in April and October.'];
    }
    if(/price|cost|fee|pricing|价格|费用|报价/.test(q))return [`Holdings use a $100 valuation reference. Clicking Buy or Sell shows separate simulated buy and sell quotes, then the face value and final cash amount for your order. The difference between those quotes is the spread; this demo has no fees or accrued interest.`,`This is not a live quote or a fair-price assessment. Real execution, fees and fractional availability are not connected.`];
    if(/why|match|recommend|fit|trade.off|为什么|推荐|匹配|取舍/.test(q))return [r.why,...(c.rankingNotes?.[b.id]?[c.rankingNotes[b.id]]:[]),r.tradeoff,'Ranking considers yield fit, credit quality, earlier repayment and known InCreditble bond exposure. External fund holdings are not scored. These are demo matches, not a full suitability assessment.'];
    return ['This prototype has sample answers for this bond’s match, company, interest, risks, pricing, CD comparison and portfolio impact. It does not connect to a live AI model or search the web.','Try one of the questions below. I cannot verify other companies, current market facts or a personalized investment decision.'];
  }
  return {rationale,portfolio,answer};
})();
