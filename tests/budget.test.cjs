const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const elements = new Map();
const element = () => ({innerHTML:'',textContent:'',hidden:false,value:'',dataset:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},setAttribute(){},removeAttribute(){}});
const context = vm.createContext({
  console, Intl, Date, Math, Number, String, Object, Array, Error, Promise, AbortController,
  setTimeout, clearTimeout,
  location:{hash:'#overview'},
  localStorage:{getItem:()=>null,setItem(){}},
  document:{querySelector(selector){if(!elements.has(selector))elements.set(selector,element());return elements.get(selector);},querySelectorAll:()=>[],addEventListener(){}},
  window:{addEventListener(){},scrollTo(){}},
});
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../dist/app.js'),'utf8'),context);
const run = code => vm.runInContext(code,context);
assert.equal(run('balance()'),0,'New users start with an empty budget');
assert.doesNotMatch(run('overview()'),/class="forecast-chart"|Recent activity|Spending by category/);
run("visibleSections=['forecast','activity']");
assert.match(run('overview()'),/class="forecast-chart"/);
assert.match(run('overview()'),/Recent activity/);
assert.doesNotMatch(run('overview()'),/Spending by category/);
run("visibleSections=[];state=seed()");
assert.equal(run('balance()'),103552);
assert.equal(run('saved()'),28000);
assert.equal(run('safe(30)'),72154);
assert.equal(run("nextDate({cycle:'monthly',anchor:31,date:'2027-01-31'})"),'2027-02-28');
assert.equal(run("nextDate({cycle:'monthly',anchor:31,date:'2027-02-28'})"),'2027-03-31');
assert.equal(run("nextDate({cycle:'monthly',anchor:31,date:'2028-01-31'})"),'2028-02-29');
assert.equal(run("nextDate({cycle:'weekly',date:'2026-12-29'})"),'2027-01-05');
assert.equal(run("cents('12.34')"),1234);
for(const value of ['0','-1','NaN','1.001','Infinity','1000001'])assert.throws(()=>run(`cents('${value}')`));
assert.throws(()=>run("validDate('2026-02-30')"));
assert.throws(()=>run("validDate(dateAdd(today(),1),true)"));
run("state.subscriptions=[{id:'weekly',name:'Weekly',amount:100,date:today(),cycle:'weekly'}];state.debts=[]");
assert.equal(run('scheduled(30).length'),5);
assert.equal(run('sum(scheduled(30))'),500);
run("state.debts=[{id:'late',amount:2500,date:dateAdd(today(),-4),paid:false}]");
assert.equal(run("scheduled(7).filter(e=>e.type==='debt').length"),1);
run('state.debts[0].paid=true');
assert.equal(run("scheduled(7).filter(e=>e.type==='debt').length"),0);
run('state=seed();state.expenses.push({amount:350,date:today(),kind:"need",category:"Food",name:"Test"})');
assert.equal(run('balance()'),103202);
assert.equal(run('safe(30)'),71804);
run('state.goals[0].saved+=1000');
assert.equal(run('balance()'),103202);
assert.equal(run('safe(30)'),70804);
run('state=seed();state.expenses.push({amount:state.debts[0].amount});state.debts[0].paid=true');
assert.equal(run('balance()'),101052);
assert.equal(run('safe(30)'),72154,'Paying a reserved debt must not double-deduct safe spending');
run('state={version:1,demo:false,opening:0,incomes:[],expenses:[],subscriptions:[],debts:[],goals:[]}');
assert.equal(run('safe(30)'),0);
assert.match(run('overview()'),/Choose which sections/);
assert.match(run('transactionTable([],true)'),/No activity/);
assert.doesNotMatch(run("transactionTable([{id:'p',name:'Paid debt',amount:100,date:today(),category:'Other',kind:'need',payment:{id:'d'}}],true)"),/data-action="remove-transaction"/);
console.log('Passed: balance, forecast, debt payment, savings reservation, monthly anchoring, leap year, weekly recurrence, overdue charges, amount/date validation, and empty state.');
