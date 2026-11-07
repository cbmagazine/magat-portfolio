(function(){
var COLS=['id','name','age','course','grade','city'];
var ROWS=[[1,'Maria Santos',19,'BSIT',92,'Quezon City'],[2,'Jose Reyes',20,'BSCS',85,'Cebu'],[3,'Ana Cruz',18,'BSIT',78,'Davao'],[4,'Miguel Dela Cruz',21,'BSCS',88,'Quezon City'],[5,'Liza Mendoza',19,'BSIT',95,'Cebu'],[6,'Carlo Bautista',22,'BSIS',70,'Davao'],[7,'Grace Villanueva',20,'BSCS',81,'Manila'],[8,'Paolo Garcia',18,'BSIS',66,'Manila']];
var AGG=['COUNT','SUM','AVG','MAX','MIN'];
var CMP=['=','!=','<>','<','>','<=','>='];
var SUGG=['SELECT','FROM','WHERE','AND','OR','GROUP BY','ORDER BY','ASC','DESC','LIMIT','LIKE','COUNT(*)','SUM(','AVG(','MAX(','MIN(','students','id','name','age','course','grade','city'];

function tokenize(src){
  var s=src.replace(/;\s*$/,''),re=/\s*(?:('(?:[^']|'')*')|(\d+(?:\.\d+)?)|([A-Za-z_][A-Za-z0-9_]*)|(<=|>=|<>|!=|[=<>(),*]))/y,pos=0,out=[],m;
  while(pos<s.length){
    if(/^\s*$/.test(s.slice(pos)))break;
    re.lastIndex=pos;m=re.exec(s);
    if(!m){
      var ch=s.slice(pos).trim().charAt(0);
      if(ch==="'")throw new Error('A text value needs a closing single quote, for example \'Ana\'.');
      throw new Error('The sandbox does not understand "'+ch+'" here. Check the spelling and punctuation.');
    }
    pos=re.lastIndex;
    if(m[1])out.push({t:'str',v:m[1].slice(1,-1).replace(/''/g,"'")});
    else if(m[2])out.push({t:'num',v:parseFloat(m[2])});
    else if(m[3])out.push({t:'id',v:m[3]});
    else out.push({t:'op',v:m[4]});
  }
  return out;
}

function parse(src){
  var t=tokenize(src),i=0;
  if(!t.length)throw new Error('The editor is empty. Type a SELECT query to run it.');
  function kw(w){return !!t[i]&&t[i].t==='id'&&t[i].v.toUpperCase()===w;}
  function eat(w){if(kw(w)){i++;return true;}return false;}
  function op(v){return !!t[i]&&t[i].t==='op'&&t[i].v===v;}
  function need(w){if(!eat(w))throw new Error('The query needs "'+w+'" here.');}
  function col(){
    if(!t[i]||t[i].t!=='id')throw new Error('Expected a column name such as name, grade or course.');
    var n=t[i++].v.toLowerCase();
    if(COLS.indexOf(n)<0)throw new Error('Unknown column "'+n+'". The students table has: '+COLS.join(', ')+'.');
    return n;
  }
  function item(){
    var tk=t[i],nx=t[i+1];
    if(op('*')){i++;return {star:true};}
    if(tk&&tk.t==='id'&&AGG.indexOf(tk.v.toUpperCase())>=0&&nx&&nx.t==='op'&&nx.v==='('){
      var fn=tk.v.toUpperCase(),arg;i+=2;
      if(op('*')){if(fn!=='COUNT')throw new Error(fn+'(*) is not allowed. Use a column name such as grade.');i++;arg='*';}
      else arg=col();
      if(!op(')'))throw new Error('Close the function with a parenthesis, for example '+fn+'(grade).');
      i++;
      return {agg:fn,col:arg,label:fn+'('+arg+')'};
    }
    return {col:col()};
  }
  need('SELECT');
  var items=[item()];
  while(op(',')){i++;items.push(item());}
  need('FROM');
  if(!t[i]||t[i].t!=='id')throw new Error('Name the table after FROM. The only table is students.');
  var tbl=t[i++].v.toLowerCase();
  if(tbl!=='students')throw new Error('The only table in this sandbox is students.');
  var where=null;
  if(eat('WHERE')){
    where={conds:[],joins:[]};
    while(true){
      var c=col(),cmp;
      if(eat('LIKE'))cmp='LIKE';
      else if(t[i]&&t[i].t==='op'&&CMP.indexOf(t[i].v)>=0)cmp=t[i++].v;
      else throw new Error('Use a comparison after "'+c+'", such as =, >=, < or LIKE.');
      if(!t[i]||(t[i].t!=='str'&&t[i].t!=='num'))throw new Error('Put a value after the comparison. Text needs single quotes, for example \'Ana\'.');
      where.conds.push({c:c,cmp:cmp,v:t[i++].v});
      if(kw('AND')||kw('OR')){where.joins.push(t[i].v.toUpperCase());i++;}
      else break;
    }
  }
  var group=null;
  if(eat('GROUP')){need('BY');group=col();}
  var order=null;
  if(eat('ORDER')){
    need('BY');
    var o=item();
    order={key:(o.label||o.col).toLowerCase(),dir:'ASC'};
    if(eat('DESC'))order.dir='DESC';else eat('ASC');
  }
  var limit=null;
  if(eat('LIMIT')){
    if(!t[i]||t[i].t!=='num'||t[i].v%1!==0)throw new Error('LIMIT needs a whole number, for example LIMIT 3.');
    limit=t[i++].v;
  }
  if(kw('JOIN')||kw('INNER')||kw('LEFT')||kw('RIGHT'))throw new Error('JOIN is not supported in this simplified sandbox. Query the students table only.');
  if(i<t.length)throw new Error('The sandbox did not expect "'+t[i].v+'" after the query. Check the order of the clauses.');
  return {items:items,where:where,group:group,order:order,limit:limit};
}

function cmpVal(a,b){
  if(typeof a==='number'&&typeof b==='number')return a-b;
  a=String(a);b=String(b);
  return a<b?-1:a>b?1:0;
}

function run(src){
  var q=parse(src),idx={};
  COLS.forEach(function(c,k){idx[c]=k;});
  function test(v,cd){
    var b=cd.v,a=v;
    if(cd.cmp==='LIKE'){
      var re=new RegExp('^'+String(b).replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/%/g,'.*').replace(/_/g,'.')+'$','i');
      return re.test(String(a));
    }
    if(typeof a!==typeof b){if(typeof a==='number')b=Number(b);else a=Number(a);}
    switch(cd.cmp){
      case '=':return a==b;
      case '!=':case '<>':return a!=b;
      case '<':return a<b;
      case '>':return a>b;
      case '<=':return a<=b;
      case '>=':return a>=b;
    }
    return false;
  }
  function keep(r){
    var w=q.where;if(!w)return true;
    var res=null;
    w.conds.forEach(function(cd,k){
      var ok=test(r[idx[cd.c]],cd);
      if(k===0)res=ok;else res=(w.joins[k-1]==='OR')?(res||ok):(res&&ok);
    });
    return res;
  }
  var rows=ROWS.filter(keep),headers,out;
  function agg(it,rs){
    if(it.agg==='COUNT'){
      if(it.col==='*')return rs.length;
      return rs.filter(function(r){var v=r[idx[it.col]];return v!==null&&v!==undefined;}).length;
    }
    var vals=rs.map(function(r){return r[idx[it.col]];});
    if((it.agg==='SUM'||it.agg==='AVG')&&vals.some(function(v){return typeof v!=='number';}))throw new Error(it.agg+' works on number columns such as grade or age.');
    if(!vals.length)return null;
    if(it.agg==='SUM')return vals.reduce(function(s,v){return s+v;},0);
    if(it.agg==='AVG')return Math.round(vals.reduce(function(s,v){return s+v;},0)/vals.length*100)/100;
    if(it.agg==='MAX')return vals.reduce(function(m,v){return v>m?v:m;});
    return vals.reduce(function(m,v){return v<m?v:m;});
  }
  if(q.items.some(function(it){return it.agg;})||q.group){
    var key=q.group;
    q.items.forEach(function(it){
      if(it.star)throw new Error('Use column names when you mix columns with aggregate functions.');
      if(!it.agg&&it.col!==key)throw new Error('"'+it.col+'" must be in GROUP BY or inside an aggregate function such as COUNT or AVG.');
    });
    var groups=[],map={};
    rows.forEach(function(r){
      var k=key?String(r[idx[key]]):'all';
      if(!map[k]){map[k]={key:key?r[idx[key]]:null,rows:[]};groups.push(map[k]);}
      map[k].rows.push(r);
    });
    if(!key&&!groups.length)groups.push({key:null,rows:[]});
    headers=q.items.map(function(it){return it.agg?it.label:it.col;});
    out=groups.map(function(g){return q.items.map(function(it){return it.agg?agg(it,g.rows):g.key;});});
    if(q.order){
      var oi=headers.findIndex(function(h){return h.toLowerCase()===q.order.key;});
      if(oi<0)throw new Error('ORDER BY must name a column or aggregate from the SELECT list.');
      out.sort(function(a,b){return cmpVal(a[oi],b[oi])*(q.order.dir==='DESC'?-1:1);});
    }
  }else{
    var cols=[];
    q.items.forEach(function(it){if(it.star)COLS.forEach(function(c){cols.push(c);});else cols.push(it.col);});
    headers=cols;
    if(q.order){
      if(COLS.indexOf(q.order.key)<0)throw new Error('ORDER BY must name a column from the students table.');
      var oc=idx[q.order.key];
      rows.sort(function(a,b){return cmpVal(a[oc],b[oc])*(q.order.dir==='DESC'?-1:1);});
    }
    out=rows.map(function(r){return cols.map(function(c){return r[idx[c]];});});
  }
  if(q.limit!==null)out=out.slice(0,q.limit);
  return {headers:headers,rows:out};
}

function renderTable(res){
  var wrap=document.createElement('div'),tb=document.createElement('table');
  tb.className='data';
  var thead=document.createElement('thead'),hr=document.createElement('tr');
  res.headers.forEach(function(h){var th=document.createElement('th');th.scope='col';th.textContent=h;hr.appendChild(th);});
  thead.appendChild(hr);tb.appendChild(thead);
  var tbody=document.createElement('tbody');
  if(!res.rows.length){
    var tr=document.createElement('tr'),td=document.createElement('td');
    td.colSpan=res.headers.length;td.textContent='No rows match this query.';
    tr.appendChild(td);tbody.appendChild(tr);
  }
  res.rows.forEach(function(r){
    var tr=document.createElement('tr');
    r.forEach(function(v){var td=document.createElement('td');td.textContent=v===null?'NULL':String(v);tr.appendChild(td);});
    tbody.appendChild(tr);
  });
  tb.appendChild(tbody);wrap.appendChild(tb);
  var note=document.createElement('p');note.className='note';
  note.textContent=res.rows.length+(res.rows.length===1?' row':' rows')+' returned.';
  wrap.appendChild(note);
  return wrap;
}

var ta=document.getElementById('sql-input');
if(!ta)return;
var sug=document.getElementById('sql-suggest'),err=document.getElementById('sql-error'),resBox=document.getElementById('sql-result'),sample=document.getElementById('sample-table');

var st=document.createElement('table');st.className='data';
var sh=document.createElement('tr');
COLS.forEach(function(c){var th=document.createElement('th');th.scope='col';th.textContent=c;sh.appendChild(th);});
var shead=document.createElement('thead');shead.appendChild(sh);st.appendChild(shead);
var sbody=document.createElement('tbody');
ROWS.forEach(function(r){var tr=document.createElement('tr');r.forEach(function(v){var td=document.createElement('td');td.textContent=String(v);tr.appendChild(td);});sbody.appendChild(tr);});
st.appendChild(sbody);sample.appendChild(st);

function execute(){
  err.hidden=true;err.textContent='';resBox.textContent='';
  try{resBox.appendChild(renderTable(run(ta.value)));}
  catch(e){err.textContent=e.message;err.hidden=false;}
}

var items=[],active=-1;
function current(){
  var pre=ta.value.slice(0,ta.selectionStart);
  var m=/[A-Za-z_]*$/.exec(pre);
  return {word:m[0],start:ta.selectionStart-m[0].length};
}
function hide(){sug.hidden=true;sug.textContent='';items=[];active=-1;}
function mark(){[].forEach.call(sug.children,function(b,k){b.setAttribute('aria-selected',k===active?'true':'false');});}
function accept(s){
  var c=current();
  var before=ta.value.slice(0,c.start),after=ta.value.slice(ta.selectionStart);
  ta.value=before+s+after;
  var pos=(before+s).length;
  ta.setSelectionRange(pos,pos);
  hide();ta.focus();
}
function show(force){
  var w=current().word.toLowerCase();
  if(!w&&!force){hide();return;}
  items=SUGG.filter(function(s){var l=s.toLowerCase();return l!==w&&l.indexOf(w)===0;}).slice(0,8);
  if(!items.length){hide();return;}
  active=-1;sug.textContent='';
  items.forEach(function(s){
    var b=document.createElement('button');
    b.type='button';b.textContent=s;b.setAttribute('aria-selected','false');
    b.addEventListener('mousedown',function(e){e.preventDefault();accept(s);});
    sug.appendChild(b);
  });
  sug.hidden=false;
}
ta.addEventListener('input',function(){show(false);});
ta.addEventListener('blur',function(){setTimeout(hide,150);});
ta.addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();hide();execute();return;}
  if((e.ctrlKey||e.metaKey)&&e.key===' '){e.preventDefault();show(true);return;}
  if(sug.hidden)return;
  if(e.key==='ArrowDown'){e.preventDefault();active=(active+1)%items.length;mark();}
  else if(e.key==='ArrowUp'){e.preventDefault();active=active<=0?items.length-1:active-1;mark();}
  else if(e.key==='Tab'||(e.key==='Enter'&&active>=0)){e.preventDefault();accept(items[active>=0?active:0]);}
  else if(e.key==='Escape'){hide();}
});

document.getElementById('sql-run').addEventListener('click',execute);
document.querySelectorAll('[data-q]').forEach(function(b){
  b.addEventListener('click',function(){ta.value=b.getAttribute('data-q');hide();execute();ta.focus();});
});
ta.value='SELECT name, grade FROM students WHERE grade >= 85 ORDER BY grade DESC';
execute();
})();
