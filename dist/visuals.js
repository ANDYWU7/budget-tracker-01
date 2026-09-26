'use strict';

// All chart amounts come from recorded expenses, in integer cents.
let spendingPeriod = 'week';
let selectedGoalId = '';
const chartColors = {Food:'#e9a14f',Shopping:'#a38ade',Transport:'#5ba5ce',Learning:'#77ad75',Entertainment:'#e28097',Other:'#9aa5aa',Subscriptions:'#537bdb'};
function spendingData(period = spendingPeriod) {
  const end = today();
  const start = period === 'month' ? `${end.slice(0,7)}-01` : dateAdd(end,-6);
  const expenses = state.expenses.filter(e=>e.date>=start && e.date<=end);
  const days = [];
  for(let date=start;date<=end;date=dateAdd(date,1))days.push({date,amount:sum(expenses.filter(e=>e.date===date))});
  const totals = new Map();
  for(const expense of expenses){
    // A subscription payment is one expense: move it into this slice, never count it twice.
    const category = expense.payment?.type==='subscription' ? 'Subscriptions' : (Object.hasOwn(chartColors,expense.category)?expense.category:'Other');
    totals.set(category,(totals.get(category)||0)+expense.amount);
  }
  const groups = [...totals].filter(([,amount])=>amount>0).map(([name,amount])=>({name,amount,color:chartColors[name]})).sort((a,b)=>b.amount-a.amount);
  return {start,end,days,groups,total:sum(expenses)};
}
function dailySpendingChart(data) {
  const max=Math.max(100,...data.days.map(day=>day.amount));
  return `<div class="daily-chart-scroll"><div class="daily-bars" style="--day-count:${data.days.length}" role="img" aria-label="Daily spending from ${dateLabel(data.start)} to ${dateLabel(data.end)}. Total ${money(data.total)}.">${data.days.map(day=>`<div class="day-column" title="${dateLabel(day.date)}: ${money(day.amount)}"><div class="bar-space"><span class="day-bar ${day.date===today()?'today':''}" style="height:${Math.max(2,day.amount/max*100)}%"><span class="bar-number">${day.amount?money(day.amount).replace('.00',''):'$0'}</span></span></div><span class="day-label">${day.date===today()?'Today':parseDate(day.date).toLocaleDateString('en-US',{weekday:'short'})}</span><span class="day-date">${parseDate(day.date).getMonth()+1}/${parseDate(day.date).getDate()}</span></div>`).join('')}</div></div>`;
}
function spendingPie(data) {
  let position=0;
  const slices=data.groups.map(group=>{const start=position;position+=group.amount/data.total*100;return `${group.color} ${start}% ${position}%`;});
  return `<div class="pie-layout"><div class="spending-pie ${data.total?'':'pie-empty'}" style="background:${data.total?`conic-gradient(${slices.join(',')})`:'#edf0ed'}" role="img" aria-label="Spending by category: ${data.groups.map(g=>`${g.name} ${money(g.amount)}`).join(', ')||'No recorded spending'}">${data.total?'':'<span>No spending<br>yet</span>'}</div><ul class="pie-legend">${data.groups.map(g=>`<li><span class="legend-swatch" style="background:${g.color}"></span><span class="legend-name">${g.name}<small>${Math.round(g.amount/data.total*100)}%</small></span><strong>${money(g.amount)}</strong></li>`).join('')}${!data.groups.some(g=>g.name==='Subscriptions')?'<li class="zero-category"><span class="legend-swatch" style="background:#537bdb"></span><span class="legend-name">Subscriptions<small>No payments recorded</small></span><strong>$0.00</strong></li>':''}</ul></div>`;
}
function spendingVisuals() {
  const data=spendingData();
  return `<section class="spending-visuals" aria-labelledby="spending-visuals-title"><div class="visuals-toolbar"><h2 id="spending-visuals-title">Your spending</h2><label class="period-label"><span class="screen-reader">Spending chart period</span><select id="spending-period"><option value="week" ${spendingPeriod==='week'?'selected':''}>Last 7 days</option><option value="month" ${spendingPeriod==='month'?'selected':''}>This month</option></select></label></div><div class="visuals-grid"><section class="card daily-card"><div class="card-head"><h3>Spent each day</h3><span class="chart-total">${money(data.total)} <small>total</small></span></div>${dailySpendingChart(data)}${data.total?'':'<p class="chart-empty-note">Add an expense to fill in your first bar.</p>'}<details class="chart-data"><summary>View daily amounts</summary><table><thead><tr><th>Date</th><th>Spent</th></tr></thead><tbody>${data.days.map(d=>`<tr><td>${dateLabel(d.date)}</td><td>${money(d.amount)}</td></tr>`).join('')}</tbody></table></details></section><section class="card pie-card"><div class="card-head"><h3>What you spent on</h3></div>${spendingPie(data)}<p class="chart-footnote">Includes paid subscriptions. Upcoming charges aren’t spending yet.</p></section></div></section>`;
}
function goalMilestone(goal){return Math.min(4,Math.floor(goal.saved/goal.target*4));}
function savingsQuest() {
  if(!state.goals.length)return `<section class="card savings-quest empty-quest"><div><h2>Savings progress</h2><p>Set a goal to track four savings milestones.</p></div><button class="button" data-action="goal">${icon('plus')}New goal</button></section>`;
  const goal=state.goals.find(g=>g.id===selectedGoalId)||state.goals[0];
  const fraction=Math.min(1,goal.saved/goal.target), milestone=goalMilestone(goal);
  const nextTarget=Math.ceil(goal.target*(milestone+1)/4);
  return `<section class="card savings-quest" aria-labelledby="savings-progress-title"><div class="quest-header"><h2 id="savings-progress-title">Savings progress</h2>${state.goals.length>1?`<label><span class="screen-reader">Goal to show</span><select id="visual-goal">${state.goals.map(g=>`<option value="${esc(g.id)}" ${g.id===goal.id?'selected':''}>${esc(g.name)}</option>`).join('')}</select></label>`:`<span>${esc(goal.name)}</span>`}<span class="milestone-badge ${milestone===4?'complete':''}">${icon(milestone===4?'check':'target')}${milestone}/4 milestones</span><span class="quest-next">${milestone===4?'Goal complete!':`${money(nextTarget-goal.saved)} to next milestone`}</span></div><div class="quest-body"><div class="quest-numbers"><strong>${money(goal.saved)}</strong><span>of ${money(goal.target)}</span></div><div class="quest-track"><div class="quest-line" role="progressbar" aria-label="${esc(goal.name)} savings" aria-valuenow="${Math.round(fraction*100)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${fraction*100}%"></span></div><div class="quest-stops">${[1,2,3,4].map(n=>`<div class="quest-stop ${n<=milestone?'unlocked':''}" aria-label="${n*25}% milestone ${n<=milestone?'reached':'not reached'}"><span>${n<=milestone?icon('check'):n}</span><small>${n*25}%</small></div>`).join('')}</div></div><button class="button primary" data-action="contribute" data-id="${esc(goal.id)}">${milestone===4?'Manage savings':'Add savings'}</button></div></section>`;
}
