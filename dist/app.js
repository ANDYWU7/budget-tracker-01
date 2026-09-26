'use strict';

const icons = {
  pocket:'<path d="M5 4h14v11q-7 9-14 0Z"/><path d="m9 10 3 3 4-5"/>',
  overview:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  wallet:'<path d="M20 7H5a2 2 0 0 1 0-4h12v4M3 5v14a2 2 0 0 0 2 2h15V7M20 12h-5v5h5"/><path d="M17 14.5h.1"/>',
  repeat:'<path d="m17 2 4 4-4 4M3 11V8a2 2 0 0 1 2-2h16M7 22l-4-4 4-4m14-1v3a2 2 0 0 1-2 2H3"/>',
  receipt:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2Zm3 4h6M9 11h6m-6 4h3"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  sprout:'<path d="M12 21v-9M12 15C4 16 3 10 3 7c6-1 9 2 9 7Zm0-4c-1-7 4-9 9-8 1 6-3 10-9 8Z"/>',
  settings:'<path d="m9 4 1-2h4l1 2 3 2 2 .3 2 3-1 2v3l1 2-2 3-2 .3-3 2-1 2h-4l-1-2-3-2-2-.3-2-3 1-2v-3l-1-2 2-3L6 6Z" transform="translate(1 0) scale(.9)"/><circle cx="12" cy="12" r="3"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 8-3 8-3 9h18c0-1-3-1-3-9M10 21h4"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2"/>',
  arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
  down:'<path d="M12 4v16m-6-6 6 6 6-6"/>',
  up:'<path d="M12 20V4m-6 6 6-6 6 6"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-9h.01"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  coffee:'<path d="M4 8h12v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Zm12 1h3a3 3 0 0 1 0 6h-3M7 2v2m5-2v2M2 23h17"/>',
  bag:'<path d="M5 7h14l2 14H3Zm3 0V5a4 4 0 0 1 8 0v2"/>',
  bus:'<rect x="5" y="3" width="14" height="17" rx="3"/><path d="M5 11h14M8 20v2m8-2v2M8 16h1m6 0h1M9 6h6"/>',
  book:'<path d="M12 5v16M12 5C9 2 5 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-2-10 1Z"/>',
  music:'<path d="M10 18V5l10-2v13M10 9l10-2"/><ellipse cx="7" cy="18" rx="3" ry="3"/><ellipse cx="17" cy="16" rx="3" ry="3"/>',
  game:'<path d="M8 7h8c3 0 4 2 5 6l1 5c0 4-4 3-6 0H8c-2 3-6 4-6 0l1-5c1-4 2-6 5-6Z"/><path d="M6 11v5m-2-2.5h4m8-1h.1m2 3h.1"/>',
  headphones:'<path d="M4 14V9a8 8 0 0 1 16 0v5M4 12H2v8h5v-8Zm16 0h2v8h-5v-8Z"/>',
  bike:'<circle cx="5" cy="17" r="4"/><circle cx="19" cy="17" r="4"/><path d="m5 17 5-9 5 9H5m5-9h7l2 9M8 5h4m4-3h3l-2 6"/>',
  shield:'<path d="m12 2 9 4v7c0 5-9 9-9 9s-9-4-9-9V6Zm-4 10 3 3 5-6"/>',
  trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.wallet}</svg>`;
const $ = sel => document.querySelector(sel);
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = cents => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents / 100);
const dateKey = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const today = () => dateKey(new Date());
const parseDate = str => new Date(`${str}T12:00:00`);
const dateAdd = (str,days) => {const d=parseDate(str);d.setDate(d.getDate()+days);return dateKey(d);};
const dayDiff = str => Math.round((Date.UTC(...str.split('-').map((v,i)=>+v-(i===1?1:0))) - Date.UTC(...today().split('-').map((v,i)=>+v-(i===1?1:0))))/86400000);
const dateLabel = str => parseDate(str).toLocaleDateString('en-US',{month:'short',day:'numeric'});
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const KEY='pocket-budget-v1';
const categories={Food:{icon:'coffee',color:'#a8b784',tone:'orange'},Shopping:{icon:'bag',color:'#dcbc88',tone:'purple'},Transport:{icon:'bus',color:'#809779',tone:'blue'},Learning:{icon:'book',color:'#bdc8ac',tone:'green'},Entertainment:{icon:'game',color:'#c9bea2',tone:'purple'},Other:{icon:'wallet',color:'#dedfcf',tone:'green'},Subscriptions:{icon:'repeat',color:'#537bdb',tone:'blue'}};
function seed(){return {version:1,demo:true,opening:125000,incomes:[],expenses:[
  {id:uid(),name:'Lunch with friends',amount:1850,category:'Food',kind:'want',date:today()},
  {id:uid(),name:'New notebook',amount:1200,category:'Learning',kind:'need',date:dateAdd(today(),-1)},
  {id:uid(),name:'Bus pass',amount:2500,category:'Transport',kind:'need',date:dateAdd(today(),-2)},
  {id:uid(),name:'Weekend shopping',amount:5499,category:'Shopping',kind:'want',date:dateAdd(today(),-3)},
  {id:uid(),name:'Groceries',amount:5800,category:'Food',kind:'need',date:dateAdd(today(),-4)},
  {id:uid(),name:'Movie night',amount:2100,category:'Entertainment',kind:'want',date:dateAdd(today(),-5)},
  {id:uid(),name:'School supplies',amount:2499,category:'Learning',kind:'need',date:dateAdd(today(),-6)}
],subscriptions:[{id:uid(),name:'Spotify',amount:599,date:dateAdd(today(),2),cycle:'monthly',anchor:parseDate(dateAdd(today(),2)).getDate(),category:'Entertainment',kind:'want'}, {id:uid(),name:'iCloud+',amount:299,date:dateAdd(today(),6),cycle:'monthly',anchor:parseDate(dateAdd(today(),6)).getDate(),category:'Other',kind:'need'}],debts:[{id:uid(),name:'Pay back Alex',amount:2500,date:dateAdd(today(),4),paid:false}],goals:[{id:uid(),name:'New headphones',target:20000,saved:12000,icon:'headphones'},{id:uid(),name:'A bike of my own',target:40000,saved:16000,icon:'bike'}]};}
const blankBudget = () => ({version:1,demo:false,opening:0,incomes:[],expenses:[],subscriptions:[],debts:[],goals:[]});
const SECTION_KEY='pocket-overview-sections-v2';
const sectionLabels={forecast:'Balance forecast',upcoming:'Upcoming payments',activity:'Recent activity'};
function loadSections(){try{const raw=localStorage.getItem(SECTION_KEY);if(raw===null)return Object.keys(sectionLabels);const value=JSON.parse(raw);return Array.isArray(value)?value.filter(k=>Object.hasOwn(sectionLabels,k)):Object.keys(sectionLabels);}catch{return Object.keys(sectionLabels);}}
let visibleSections=loadSections();
let storageError=false;
function load(){try{const raw=localStorage.getItem(KEY);if(!raw)return blankBudget();const data=JSON.parse(raw);if(data.version!==1 || !Number.isSafeInteger(data.opening) || !['incomes','expenses','subscriptions','debts','goals'].every(k=>Array.isArray(data[k])))throw Error('Invalid data');return data;}catch{storageError=true;return blankBudget();}}
let state=load();
let view='overview', horizon=30, spendingFilter='all';
const sum = (items,key='amount') => items.reduce((n,x)=>n+x[key],0);
const balance=()=>state.opening+sum(state.incomes)-sum(state.expenses);
const saved=()=>sum(state.goals,'saved');
function nextDate(s,date=s.date){const d=parseDate(date);if(s.cycle==='weekly')return dateAdd(date,7);const month=d.getMonth()+1;const last=new Date(d.getFullYear(),month+1,0).getDate();return dateKey(new Date(d.getFullYear(),month,Math.min(s.anchor||d.getDate(),last),12));}
function scheduled(days=30){const end=dateAdd(today(),days);const events=state.debts.filter(d=>!d.paid&&d.date<=end).map(d=>({...d,type:'debt'}));state.subscriptions.forEach(s=>{let date=s.date;let count=0;while(date<=end&&count++<600){events.push({...s,date,type:'subscription'});date=nextDate(s,date);}});return events.sort((a,b)=>a.date.localeCompare(b.date));}
const safe=days=>balance()-saved()-sum(scheduled(days));
const recent=()=>[...state.expenses.map(x=>({...x,income:false})),...state.incomes.map(x=>({...x,income:true}))].sort((a,b)=>b.date.localeCompare(a.date));
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));storageError=false;}catch{storageError=true;}render();}
function hydrateIcons(){document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));}
function dueLabel(date){const days=dayDiff(date);return days<0?`${Math.abs(days)}d overdue`:days===0?'Due today':days===1?'Tomorrow':`In ${days} days`;}
function heading(title,desc,action='expense',label='Add expense'){return `<div class="page-heading"><h1>${title}</h1><div class="heading-actions"><button class="button primary" data-action="${action}">${icon('plus')}${label}</button></div></div>`;}
function empty(title,desc){return `<div class="empty"><strong>${title}</strong>${desc}</div>`;}
function stat(label,value,foot,ico,featured=false){return `<div class="stat-card ${featured?'featured':''}"><div class="stat-label">${label}${icon(ico)}</div><div class="stat-value">${money(value)}</div><div class="stat-foot">${foot}</div></div>`;}
function chart(){const events=scheduled(horizon);const start=balance()-saved();const vals=Array.from({length:7},(_,i)=>{const date=dateAdd(today(),Math.round(horizon*i/6));return start-sum(events.filter(e=>e.date<=date));});const lo=Math.min(0,...vals),hi=Math.max(10000,...vals);const coords=vals.map((v,i)=>[45+i*76,(18+(hi-v)/(hi-lo)*112)]);const path=coords.map((p,i)=>`${i?'L':'M'}${p[0]},${p[1]}`).join(' ');const points=coords.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${i===6?4:2.5}" fill="${i===6?'#fff':'#8fa572'}" stroke="#8fa572" stroke-width="2"><title>${dateLabel(dateAdd(today(),Math.round(horizon*i/6)))}: ${money(vals[i])}</title></circle>`).join('');return `<svg class="forecast-chart" viewBox="0 0 525 165" role="img" aria-label="Projected available balance goes from ${money(vals[0])} to ${money(vals[6])} in ${horizon} days, after savings and scheduled charges"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#e8edda" stop-opacity=".8"/><stop offset="100%" stop-color="#f8faf4" stop-opacity=".15"/></linearGradient></defs>${[0,1,2,3].map(i=>{const y=18+i*37.3;return `<line x1="45" x2="508" y1="${y}" y2="${y}" stroke="#edf0e6" stroke-dasharray="3 4"/><text x="0" y="${y+3}" class="chart-label">$${Math.round((hi-(hi-lo)*i/3)/100)}</text>`;}).join('')}<path d="${path} L501,130 L45,130 Z" fill="url(#chartFill)"/><path d="${path}" fill="none" stroke="#8fa572" stroke-width="2.5" stroke-linejoin="round"/>${points}${[0,2,4,6].map(i=>`<text class="chart-label" x="${coords[i][0]}" y="155" text-anchor="${i===6?'end':i===0?'start':'middle'}">${i===0?'Today':dateLabel(dateAdd(today(),Math.round(horizon*i/6)))}</text>`).join('')}</svg>`;}
function chargeRow(item,detailed=false){const isDebt=item.type==='debt';return `<div class="charge-row"><div class="item-icon ${isDebt?'orange':item.name.toLowerCase().includes('spotify')?'green':'purple'}">${icon(isDebt?'receipt':item.name.toLowerCase().includes('spotify')?'music':'repeat')}</div><div class="item-text"><strong>${esc(item.name)}</strong><small>${isDebt?'Money you owe':item.cycle==='weekly'?'Weekly subscription':'Monthly subscription'} ${detailed?'· '+dateLabel(item.date):''}</small></div><div class="item-amount">${money(item.amount)}<small class="${dayDiff(item.date)<0?'warning-text':''}">${dueLabel(item.date)}</small></div>${detailed?`<div class="row-actions"><button class="button primary" data-action="pay" data-id="${esc(item.id)}" data-type="${item.type}">Mark paid</button><button class="icon-button" data-action="remove-${isDebt?'debt':'subscription'}" data-id="${esc(item.id)}" aria-label="${isDebt?'Remove':'Cancel'} ${esc(item.name)}">${icon('trash')}</button></div>`:''}</div>`;}
function goalItem(goal,detail=false){const pct=Math.min(100,Math.round(goal.saved/goal.target*100));return `<div class="goal-item ${detail?'card goal-detail':''}"><div class="goal-top"><div class="item-icon ${goal.icon==='bike'?'orange':'purple'}">${icon(goal.icon)}</div><div><div class="goal-name">${esc(goal.name)}</div><div class="goal-amount"><strong>${money(goal.saved)}</strong> of ${money(goal.target)}</div></div><span class="goal-percent">${pct}%</span></div><div class="progress" role="progressbar" aria-label="${esc(goal.name)}" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>${detail?`${pct>=100?'<p class="completed-label">Goal funded.</p>':''}<button class="button" data-action="contribute" data-id="${esc(goal.id)}">${icon('plus')} ${pct>=100?'Manage savings':'Add to goal'}</button><button class="text-button danger-button" style="margin-top:15px" data-action="remove-goal" data-id="${esc(goal.id)}">Remove goal & release savings</button>`:''}</div>`;}
function transactionTable(items,full=false){if(!items.length)return empty('No activity','');return `<div class="table-wrap"><table><thead><tr><th>Transaction</th><th>Category</th><th>Date</th><th>Need or want</th><th style="text-align:right">Amount</th>${full?'<th><span class="screen-reader">Actions</span></th>':''}</tr></thead><tbody>${items.map(e=>{const cat=categories[e.category]||categories.Other;return `<tr><td><div class="transaction-name"><span class="item-icon ${e.income?'green':cat.tone}">${icon(e.income?'down':cat.icon)}</span>${esc(e.name)}</div></td><td>${e.income?'Money in':esc(e.category)}</td><td>${e.date===today()?'Today':dateLabel(e.date)}</td><td>${e.income?'<span class="badge">Income</span>':`<span class="badge ${e.kind==='want'?'want':''}">${e.kind==='want'?'Nice to have':'Essential'}</span>`}</td><td class="money-cell ${e.income?'positive':''}">${e.income?'+':'−'}${money(e.amount)}</td>${full?`<td style="text-align:right">${e.payment?'<span class="badge">Payment recorded</span>':`<button class="icon-button" data-action="remove-transaction" data-id="${esc(e.id)}" data-type="${e.income?'income':'expense'}" aria-label="Delete ${esc(e.name)}">${icon('trash')}</button>`}</td>`:''}</tr>`;}).join('')}</tbody></table></div>`;}
function overview(){
  const events=scheduled(30);
  const sections={
    forecast:()=>`<section class="card chart-card"><div class="card-head"><h2>Balance forecast</h2><div class="chart-toggle" aria-label="Forecast range"><button data-action="horizon" data-days="7" class="${horizon===7?'active':''}" aria-pressed="${horizon===7}">7 days</button><button data-action="horizon" data-days="30" class="${horizon===30?'active':''}" aria-pressed="${horizon===30}">30 days</button></div></div><div class="chart-meta"><div class="forecast-number">${money(safe(horizon))}<small>by ${dateLabel(dateAdd(today(),horizon))}</small></div></div>${chart()}</section>`,
    upcoming:()=>`<section class="card"><div class="card-head"><h2>Upcoming payments</h2><button class="text-button" data-action="reminders">View all</button></div><div class="upcoming-list">${events.slice(0,2).map(e=>chargeRow(e)).join('')||empty('No upcoming payments','')}</div></section>`,
    activity:()=>`<section class="card"><div class="card-head"><h2>Recent activity</h2><button class="text-button" data-action="navigate" data-view="spending">View all</button></div><div class="compact-activity">${recent().slice(0,2).map(e=>`<div class="compact-activity-row"><span><strong>${esc(e.name)}</strong><small>${e.date===today()?'Today':dateLabel(e.date)}</small></span><b class="${e.income?'positive':''}">${e.income?'+':'−'}${money(e.amount)}</b></div>`).join('')||empty('No activity','')}</div></section>`
  };
  return `${heading('Overview','')}${state.demo?'<div class="demo-notice">Sample budget <button class="text-button" data-action="fresh">Start your own</button></div>':''}${safe(30)<0?'<div class="alert danger">Your savings and upcoming payments exceed your balance.</div>':''}<section class="balance-panel" aria-label="Budget summary"><div><div class="balance-label">Safe to spend</div><div class="balance-value">${money(safe(30))}</div><p>After savings and payments due in the next 30 days.</p></div><div class="balance-current"><span>Current balance</span><strong>${money(balance())}</strong><button class="button" data-action="income">Add money</button></div></section>${spendingVisuals()}${savingsQuest()}<div class="overview-toolbar"><h2>More details</h2><button class="button" data-action="sections">Choose sections</button></div>${visibleSections.length?`<div class="dashboard-grid">${visibleSections.map(key=>sections[key]()).join('')}</div>`:''}`;
}
const pageLimits={spending:5,subscriptions:3,debts:3,goals:3};
function showMore(page,shown,total){return total>shown?'<button class="button show-more" data-action="show-more" data-view="'+page+'">Show more ('+(total-shown)+' remaining)</button>':'';}
function render(){
  const titles={overview:'Overview',spending:'My spending',subscriptions:'Subscriptions',debts:'Debts & dues',goals:'Savings goals'};
  view=Object.hasOwn(titles,location.hash.slice(1))?location.hash.slice(1):'overview';
  document.querySelectorAll('[data-nav]').forEach(a=>{a.classList.toggle('active',a.dataset.nav===view);if(a.dataset.nav===view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  let html='';
  if(view==='overview')html=overview();
  if(view==='spending'){
    const items=recent().filter(e=>spendingFilter==='all'||(spendingFilter==='income'?e.income:!e.income&&e.kind===spendingFilter));
    html=heading('My spending','')+'<div class="filter-row"><div class="summary-line" style="margin:0">Current balance <strong>'+money(balance())+'</strong></div><div class="heading-actions"><select id="spending-filter" aria-label="Filter spending"><option value="all">All activity</option><option value="need">Essentials</option><option value="want">Nice to have</option><option value="income">Money in</option></select><button class="button" data-action="income">'+icon('plus')+'Add money</button></div></div><section class="card">'+transactionTable(items.slice(0,pageLimits.spending),true)+'</section>'+showMore('spending',pageLimits.spending,items.length);
  }
  if(view==='subscriptions'){
    const upcoming=sum(scheduled(30).filter(e=>e.type==='subscription'));
    html=heading('Subscriptions','','subscription','Add subscription')+'<p class="summary-line"><strong>'+state.subscriptions.length+'</strong> subscriptions · <strong>'+money(upcoming)+'</strong> due in the next 30 days</p><div class="list-layout">'+(state.subscriptions.slice(0,pageLimits.subscriptions).map(s=>'<section class="card full-card">'+chargeRow({...s,type:'subscription'},true)+'</section>').join('')||'<section class="card">'+empty('No subscriptions yet','')+'</section>')+'</div>'+showMore('subscriptions',pageLimits.subscriptions,state.subscriptions.length);
  }
  if(view==='debts'){
    const unpaid=state.debts.filter(d=>!d.paid);
    html=heading('Debts & dues','','debt','Add a debt')+'<p class="summary-line"><strong>'+money(sum(unpaid))+'</strong> left to pay · '+unpaid.length+' open '+(unpaid.length===1?'debt':'debts')+'</p><div class="list-layout">'+(unpaid.slice(0,pageLimits.debts).map(d=>'<section class="card full-card">'+chargeRow({...d,type:'debt'},true)+'</section>').join('')||'<section class="card">'+empty('No unpaid debts','')+'</section>')+'</div>'+showMore('debts',pageLimits.debts,unpaid.length);
  }
  if(view==='goals'){
    html=heading('Savings goals','','goal','New goal')+'<p class="summary-line"><strong>'+money(saved())+'</strong> set aside · Reserved savings are excluded from safe to spend.</p><div class="collection-grid">'+(state.goals.slice(0,pageLimits.goals).map(g=>goalItem(g,true)).join('')||'<section class="card">'+empty('No savings goals','')+'</section>')+'</div>'+showMore('goals',pageLimits.goals,state.goals.length);
  }
  $('#main').innerHTML=(storageError?'<div class="alert danger">Device storage is unavailable or saved data could not be read. Changes may not survive a refresh.</div>':'')+html;
  $('#notification-dot').hidden=!scheduled(7).length;
  const filter=$('#spending-filter');if(filter)filter.value=spendingFilter;
  hydrateIcons();
}
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);});
document.addEventListener('change',event=>{if(event.target.id==='spending-period'){spendingPeriod=event.target.value==='month'?'month':'week';render();return;}if(event.target.id==='visual-goal'){selectedGoalId=event.target.value;render();return;}if(event.target.id==='spending-filter'){spendingFilter=event.target.value;pageLimits.spending=5;render();}});
let toastTimer;
function notify(message){$('#toast').classList.remove('milestone-celebration');$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4000);}
function closeModal(){$('#modal').close();}
function modal(title,description,body){$('#modal-content').innerHTML=`<div class="modal-inner"><div class="modal-head"><h2 id="modal-title">${title}</h2><button class="icon-button" data-action="close" aria-label="Close dialog">${icon('close')}</button></div>${description?`<p class="modal-description">${description}</p>`:''}${body}</div>`;if(!$('#modal').open)$('#modal').showModal();}
function field(label,name,type='text',value='',extra=''){return `<label>${label}<input name="${name}" type="${type}" value="${esc(value)}" ${extra} required></label>`;}
const amountField=(label='Amount',name='amount',value='')=>field(`${label} ($)`,name,'number',value,'min="0.01" max="1000000" step="0.01" inputmode="decimal"');
const nameField=label=>field(label,'name','', '', 'maxlength="70" autocomplete="off"');
const categoryField=()=>`<label>Category<select name="category">${Object.keys(categories).map(c=>`<option>${c}</option>`).join('')}</select></label>`;
const kindField=()=>'<label>Need or want?<select name="kind"><option value="need">Essential — something I need</option><option value="want">Nice to have — something I want</option></select></label>';
function formModal(title,description,fields,submitLabel,onSubmit){modal(title,description,`<form id="entry-form"><div class="form-fields">${fields}</div><div id="form-error" class="form-error" role="alert"></div><div class="modal-actions"><button class="button" type="button" data-action="close">Cancel</button><button class="button primary" type="submit">${submitLabel}</button></div></form>`);$('#entry-form').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;try{const data=Object.fromEntries(new FormData(form));if(data.name!==undefined){data.name=data.name.trim();if(!data.name)throw Error('Please give this a name.');}onSubmit(data);closeModal();}catch(error){$('#form-error').textContent=error.message;}});}
function cents(value,allowZero=false){const number=Number(value);const result=Math.round(number*100);if(!Number.isFinite(number)||result<(allowZero?0:1)||result>100000000||Math.abs(number*100-result)>.00001)throw Error('Enter a valid amount with up to two decimal places.');return result;}
function validDate(value,pastOnly=false){if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||Number.isNaN(parseDate(value).getTime())||dateKey(parseDate(value))!==value)throw Error('Please enter a valid date.');if(value<dateAdd(today(),-365)||value>dateAdd(today(),1825))throw Error('Choose a date within the past year or the next five years.');if(pastOnly&&value>today())throw Error('Log money on or before today. Add future payments as subscriptions or debts.');return value;}
function dateField(label='Date',pastOnly=false){return field(label,'date','date',today(),`min="${dateAdd(today(),-365)}" max="${pastOnly?today():dateAdd(today(),1825)}"`);}
function openExpense(){formModal('Add expense','',nameField('What was it for?')+`<div class="form-grid">${amountField()}${dateField('Date',true)}</div>`+categoryField()+kindField(),'Save expense',d=>{state.expenses.unshift({id:uid(),name:d.name,amount:cents(d.amount),category:d.category,kind:d.kind,date:validDate(d.date,true)});save();notify('Expense saved.');});}
function openIncome(){formModal('Add money','',nameField('Where did it come from?')+amountField()+dateField('Date received',true),'Add money',d=>{state.incomes.unshift({id:uid(),name:d.name,amount:cents(d.amount),date:validDate(d.date,true)});save();notify('Money added.');});}
function openSubscription(){formModal('Add subscription','',nameField('Subscription name')+`<div class="form-grid">${amountField('Cost per renewal')}<label>Renews<select name="cycle"><option value="monthly">Monthly</option><option value="weekly">Weekly</option></select></label></div>`+dateField('Next payment date')+categoryField()+kindField(),'Add subscription',d=>{const date=validDate(d.date);state.subscriptions.push({id:uid(),name:d.name,amount:cents(d.amount),date,anchor:parseDate(date).getDate(),cycle:d.cycle,category:d.category,kind:d.kind});save();notify('Subscription added.');});}
function openDebt(){formModal('Add debt','',nameField('Who or what do you owe?')+amountField('Amount owed')+dateField('Due date'),'Add debt',d=>{state.debts.push({id:uid(),name:d.name,amount:cents(d.amount),date:validDate(d.date),paid:false});save();notify('Debt added.');});}
function openGoal(){formModal('New savings goal','',nameField('Goal name')+amountField('Target amount','target')+'<label>Pick an icon<select name="icon"><option value="headphones">Headphones</option><option value="bike">Bike</option><option value="game">Gaming</option><option value="book">Learning</option><option value="target">Something special</option></select></label>','Create goal',d=>{state.goals.push({id:uid(),name:d.name,target:cents(d.target),saved:0,icon:d.icon});save();notify('Goal created.');});}
function contribute(id){const goal=state.goals.find(g=>g.id===id);if(!goal)return;formModal('Update '+esc(goal.name),`${money(goal.saved)} saved of ${money(goal.target)}. Savings stay in your balance, but are reserved from spending.`,`<label>What would you like to do?<select name="direction"><option value="add">Add to this goal</option><option value="release">Move savings back to spending</option></select></label>`+amountField(),'Update savings',d=>{const previousMilestone=goalMilestone(goal);const amount=cents(d.amount);if(d.direction==='add'){if(amount>balance()-saved())throw Error('You don’t have that much unreserved money. Add money first, or save a smaller amount.');goal.saved+=amount;}else{if(amount>goal.saved)throw Error('That is more than you have saved in this goal.');goal.saved-=amount;}save();const milestone=goalMilestone(goal);if(milestone>previousMilestone){notify(milestone===4?'Goal complete! All 4 milestones reached.':`${milestone*25}% milestone reached!`);$('#toast').classList.add('milestone-celebration');}else notify('Savings updated.');});}
function confirmAction(title,description,label,callback){formModal(title,description,'',label,()=>{callback();save();});}
function pay(id,type){const item=type==='debt'?state.debts.find(d=>d.id===id&&!d.paid):state.subscriptions.find(s=>s.id===id);if(!item)return;confirmAction('Mark '+esc(item.name)+' as paid?',`This records a ${money(item.amount)} expense today.${type==='subscription'?' The next due date moves to '+dateLabel(nextDate(item))+'.':' The debt will be marked complete.'} Only mark it paid after you’ve actually paid.`, 'Yes, I paid it',()=>{state.expenses.unshift({id:uid(),name:item.name,amount:item.amount,category:item.category||'Other',kind:item.kind||'need',date:today(),payment:{id:item.id,type}});if(type==='debt')item.paid=true;else item.date=nextDate(item);notify('Payment recorded.');});}
function openReminders(){const events=scheduled(30);modal('Payment reminders',`${money(sum(events))} is due in the next 30 days, including overdue payments. Reminders stay until handled.`,`<div class="reminders-detail">${events.length?events.map(e=>`<div>${chargeRow(e)}<button class="text-button" style="margin:8px 0 14px" data-action="pay" data-id="${esc(e.id)}" data-type="${e.type}">Record a payment ${icon('arrow')}</button></div>`).join(''):empty('No upcoming payments','No upcoming charges in the next 30 days.')}</div><div class="modal-actions"><button class="button" data-action="close">Back to my budget</button></div>`);}
function fresh(){formModal('Start a new budget','This replaces the sample or current budget on this device. Enter the money you have now, before setting aside savings.',field('Current balance ($)','opening','number','0','min="0" max="1000000" step="0.01" inputmode="decimal"'),'Start my budget',d=>{const opening=cents(d.opening,true);state={version:1,demo:false,opening,incomes:[],expenses:[],subscriptions:[],debts:[],goals:[]};save();notify('Budget created.');});}
function workspace(){modal('Budget settings','',`<p class="workspace-details">Saved in this browser only. Clearing browser data removes your budget.</p><div class="workspace-options"><button class="button" data-action="fresh">Start a new budget</button><button class="button" data-action="demo">Load sample budget</button></div>`);}
function chooseSections(){formModal('Extra overview sections','Add details below your spending charts.',Object.entries(sectionLabels).map(([key,label])=>`<label class="section-option"><input type="checkbox" name="${key}" ${visibleSections.includes(key)?'checked':''}>${label}</label>`).join(''),'Save selection',data=>{const selected=Object.keys(sectionLabels).filter(key=>data[key]==='on');try{localStorage.setItem(SECTION_KEY,JSON.stringify(selected));}catch{throw Error('Could not save your selection. Browser storage is unavailable.');}visibleSections=selected;render();notify('Overview updated.');});}

document.addEventListener('click',e=>{const button=e.target.closest('[data-action]');if(!button)return;const {action,id,type}=button.dataset;
  if(action==='close')closeModal();
  else if(action==='expense')openExpense();
  else if(action==='income')openIncome();
  else if(action==='subscription')openSubscription();
  else if(action==='debt')openDebt();
  else if(action==='goal')openGoal();
  else if(action==='contribute')contribute(id);
  else if(action==='reminders')openReminders();
  else if(action==='workspace')workspace();
  else if(action==='sections')chooseSections();
  else if(action==='fresh')fresh();
  else if(action==='pay')pay(id,type);
  else if(action==='horizon'){horizon=Number(button.dataset.days);render();}
  else if(action==='navigate'){location.hash=button.dataset.view;}
  else if(action==='show-more'&&Object.hasOwn(pageLimits,button.dataset.view)){pageLimits[button.dataset.view]+=5;render();}
  else if(action==='demo')confirmAction('Replace this budget with a sample?','Your current budget on this device will be replaced.','Load sample budget',()=>{state=seed();notify('Sample budget loaded.');});
  else if(action==='remove-subscription'){const item=state.subscriptions.find(s=>s.id===id);if(item)confirmAction('Remove '+esc(item.name)+'?', 'This removes future charges from Pocket. It does not cancel the subscription with the provider. Make sure you’ve canceled it there, too.','Remove from Pocket',()=>{state.subscriptions=state.subscriptions.filter(s=>s.id!==id);notify('Subscription removed from your plan.');});}
  else if(action==='remove-debt'){const item=state.debts.find(d=>d.id===id);if(item)confirmAction('Remove this debt?','Use this for an entry added by mistake. If you paid it, use Mark paid to record the expense instead.','Remove debt',()=>{state.debts=state.debts.filter(d=>d.id!==id);notify('Debt removed.');});}
  else if(action==='remove-goal'){const item=state.goals.find(g=>g.id===id);if(item)confirmAction('Remove '+esc(item.name)+'?',`${money(item.saved)} in reserved savings will become available to spend again. Your cash balance stays the same.`,'Remove goal',()=>{state.goals=state.goals.filter(g=>g.id!==id);notify('Goal removed and savings released.');});}
  else if(action==='remove-transaction'){const list=type==='income'?state.incomes:state.expenses;const item=list.find(t=>t.id===id);if(item?.payment){notify('Recorded payments stay in your history to keep due dates accurate.');return;}if(item)confirmAction('Delete this entry?',`Remove “${esc(item.name)}” for ${money(item.amount)}? Your balance will be recalculated.`,'Delete entry',()=>{const key=type==='income'?'incomes':'expenses';state[key]=state[key].filter(t=>t.id!==id);notify('Entry deleted.');});}
});
$('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=$('#modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});
window.addEventListener('storage',e=>{if(e.key===KEY){state=load();render();}if(e.key===SECTION_KEY){visibleSections=loadSections();render();}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
if(document.modelContext?.registerTool){const lifecycle=new AbortController();const tool={name:'read_pocket_budget',title:'Read Pocket budget',description:'Read the device-local current balance, reserved savings, upcoming charges, and 30-day forecast. Makes no changes.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute(input){if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw Error('Expected an empty object.');return {currency:'USD',amountsIn:'cents',balance:balance(),reservedSavings:saved(),safeToSpend:safe(30),upcoming:scheduled(30).map(e=>({name:e.name,amount:e.amount,date:e.date,type:e.type})),sampleBudget:state.demo};}};try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
render();
