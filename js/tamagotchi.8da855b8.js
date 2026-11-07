(function(){
var MAX=10,state=null;
var EMOJI={cat:'\uD83D\uDC31',dog:'\uD83D\uDC36',chicken:'\uD83D\uDC14',dragon:'\uD83D\uDC09'};
var LABEL={cat:'Cat',dog:'Dog',chicken:'Chicken',dragon:'Dragon'};
var TEXT=/^[A-Za-z0-9 ]{1,20}$/;
function $(id){return document.getElementById(id);}
var form=$('pet-form');
if(!form)return;
function clamp(v){return Math.max(0,Math.min(MAX,v));}
function clean(t){return (t||'').replace(/\s+/g,' ').trim();}
function say(t){$('game-msg').textContent=t;}
function showError(msg,field){var e=$('form-error');e.textContent=msg;e.hidden=false;field.setAttribute('aria-invalid','true');field.focus();}
function clearError(){var e=$('form-error');e.hidden=true;e.textContent='';['pet-kind','pet-name-input'].forEach(function(id){$(id).removeAttribute('aria-invalid');});}
['hunger','happiness'].forEach(function(k){var box=$('seg-'+k);for(var i=0;i<MAX;i++){var s=document.createElement('span');s.className='seg';box.appendChild(s);}});
function render(){
  if(!state)return;
  ['hunger','happiness'].forEach(function(k){
    $('num-'+k).textContent=state[k];
    var segs=$('seg-'+k).children;
    for(var i=0;i<MAX;i++)segs[i].classList.toggle('on',i<state[k]);
  });
  $('pet-title').textContent=state.name+' the '+state.type;
  var art=$('pet-art'),paw=$('pet-paw');
  if(state.kind==='custom'){art.hidden=true;paw.hidden=false;}
  else{paw.hidden=true;art.hidden=false;art.textContent=EMOJI[state.kind];}
}
function showForm(){form.hidden=false;$('game-play').hidden=true;}
function showPlay(){form.hidden=true;$('game-play').hidden=false;}
Array.prototype.forEach.call(form.elements.pet,function(r){
  r.addEventListener('change',function(){$('custom-kind-wrap').hidden=form.elements.pet.value!=='custom';});
});
form.addEventListener('submit',function(e){
  e.preventDefault();
  clearError();
  var kind=form.elements.pet.value;
  var kindText=clean($('pet-kind').value);
  var name=clean($('pet-name-input').value);
  if(kind==='custom'&&!TEXT.test(kindText)){showError('Type a pet type with 1 to 20 letters, numbers or spaces.',$('pet-kind'));return;}
  if(!TEXT.test(name)){showError('Type a pet name with 1 to 20 letters, numbers or spaces. The name is needed before you can start.',$('pet-name-input'));return;}
  var type=kind==='custom'?kindText:LABEL[kind];
  var keep=state?{hunger:state.hunger,happiness:state.happiness}:{hunger:5,happiness:5};
  state={kind:kind,type:type,name:name,hunger:keep.hunger,happiness:keep.happiness};
  showPlay();render();
  say('Hello, '+name+' the '+type+'. Pick an action from the menu.');
  $('act-feed').focus();
});
$('act-feed').addEventListener('click',function(){
  if(state.hunger===0){say(state.name+' is already full. Try playing instead.');return;}
  state.hunger=clamp(state.hunger-1);render();
  say(state.name+' enjoyed a snack. Hunger is now '+state.hunger+'.');
});
$('act-play').addEventListener('click',function(){
  var hMax=state.hunger===MAX,pMax=state.happiness===MAX;
  state.hunger=clamp(state.hunger+1);state.happiness=clamp(state.happiness+1);render();
  if(hMax&&pMax)say('Hunger and happiness are both at their maximum, so they stay at 10.');
  else if(hMax)say('Hunger is at its maximum, so it stays at 10. Happiness is now '+state.happiness+'.');
  else if(pMax)say('Happiness is already at its maximum. Hunger is now '+state.hunger+'.');
  else say('You played together. Happiness is now '+state.happiness+', hunger is now '+state.hunger+'.');
});
$('act-walk').addEventListener('click',function(){
  var hMax=state.hunger===MAX,hZero=state.happiness===0;
  state.hunger=clamp(state.hunger+1);state.happiness=clamp(state.happiness-1);render();
  if(hMax&&hZero)say('Hunger is at its maximum and happiness is at 0, so nothing changes.');
  else if(hMax)say('Hunger is at its maximum, so it stays at 10. Happiness is now '+state.happiness+'.');
  else if(hZero)say('Happiness is already at 0, so it stays there. Hunger is now '+state.hunger+'.');
  else say('You went for a walk. Hunger is now '+state.hunger+', happiness is now '+state.happiness+'.');
});
$('act-status').addEventListener('click',function(){
  say(state.name+' the '+state.type+'. Hunger '+state.hunger+' of 10, happiness '+state.happiness+' of 10.');
});
$('act-change').addEventListener('click',function(){showForm();say('Choose a new pet. The meters stay as they are.');form.elements.pet[0].focus();});
$('act-restart').addEventListener('click',function(){state=null;showForm();say('Starting over. Both meters begin at 5.');form.elements.pet[0].focus();});
$('act-quit').addEventListener('click',function(){var n=state.name;state=null;showForm();say('Goodbye, '+n+'. Choose a pet to play again.');form.elements.pet[0].focus();});
})();
