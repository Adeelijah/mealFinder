const meals=[
['Beef Steak baguette',13600,'beef','baguette','Beef steak in a baguette.'],['Chicken Breast baguette',12000,'chicken','baguette','A baguette with diced chicken breast.'],['Minced Beef baguette',11400,'beef','baguette','A baguette with lean minced beef.'],['Prawns baguette',27000,'prawns','baguette','A baguette with prawns.'],['Vegan baguette',11700,'plant','baguette','Tofu, carrot and apple in a baguette.'],['Avocado Chicken Tacos',11100,'chicken','tacos','Chicken and avocado tacos with cabbage and sauces.'],['Danbunama Mince Beef Tacos',12500,'beef','tacos','Mince beef tacos with Danbunama and BBQ sauce.'],['Philly Steak Tacos',13600,'beef','tacos','Steak tacos with mozzarella, cabbage and sauces.'],['Prawns Tacos',24000,'prawns','tacos','Prawn tacos with tomato, onion and sauces.'],['Tofu Tacos',9700,'plant','tacos','Tofu tacos with apple, onion and sweet corn.'],['Beef Steak Toasties',9500,'beef','toasties','Steak toasties with jalapeno and caramelized onion.'],['Chicken Cheese Toasties',10000,'chicken','toasties','Chicken and mozzarella toasties.'],['Prawns Dynamite Toasties',14000,'prawns','toasties','Prawn toasties with dynamite sauce and basil.'],['Chicken Salad',12000,'chicken','salad','Chicken, vegetables, avocado and vinaigrette.'],['Egg & Chicken Salad',12600,'chicken','salad','Chicken and boiled egg with vegetables and vinaigrette.'],['Thai Beef Steak Salad',13000,'beef','salad','Beef steak salad with herbs, peanuts and Thai dressing.'],['Vegan Salad',13700,'plant','salad','Tofu, vegetables, apple and vinaigrette.']
];
const mealImages=[5,6,7,8,9,0,1,2,3,4,14,15,16,10,11,12,13];
meals.forEach((meal,index)=>meal.push('images/menu-'+mealImages[index]+'.webp'));
const drinkImages={400:'images/menu-20.webp',3500:'images/menu-18.webp',4500:'images/menu-19.webp',6000:'images/menu-17.webp'};
const state={protein:'any',format:'any'};const $=id=>document.getElementById(id);const money=n=>'₦'+n.toLocaleString('en-NG');
function chooseMeal(budget,drink,protein,format){const eligible=meals.filter(m=>(protein==='any'||m[2]===protein)&&(format==='any'||m[3]===format));const affordable=eligible.filter(m=>m[1]+drink<=budget).sort((a,b)=>b[1]-a[1]);return {meal:affordable[0]||eligible.sort((a,b)=>a[1]-b[1])[0],fits:affordable.length>0};}

let photoRequest=0;
function showMealPhoto(meal){
 const photo=$('meal-photo'), frame=photo.closest('.food-photo'), loader=$('photo-loading'), error=$('photo-error');
 const request=++photoRequest;
 frame.setAttribute('aria-busy','false'); loader.hidden=true; error.hidden=true;
 if(!meal){photo.hidden=true;return;}
 photo.alt=meal[0]+' from the 12 inch Baguette menu';
 const source=meal[5];
 if(photo.getAttribute('src')===source && photo.complete && photo.naturalWidth>0){photo.hidden=false;return;}
 photo.hidden=true;loader.hidden=false;frame.setAttribute('aria-busy','true');
 const pending=new Image();
 pending.onload=()=>{if(request!==photoRequest)return;photo.src=source;photo.alt=meal[0]+' from the 12 inch Baguette menu';photo.hidden=false;loader.hidden=true;frame.setAttribute('aria-busy','false');};
 pending.onerror=()=>{if(request!==photoRequest)return;loader.hidden=true;error.hidden=false;frame.setAttribute('aria-busy','false');};
 pending.src=source;
}

function update(){const budget=Number($('budget').value),drink=Number($('drink').value);$('budget-label').textContent=money(budget);const {meal,fits}=chooseMeal(budget,drink,state.protein,state.format);const none=!meal;showMealPhoto(meal);const drinkPhoto=$('drink-photo');drinkPhoto.hidden=!drink;if(drink){drinkPhoto.src=drinkImages[drink];drinkPhoto.alt=$('drink').selectedOptions[0].text.split(' · ')[0];} $('photo-note').textContent=meal&&meal[0]==='Minced Beef baguette'?'Menu photo includes added chicken sausage. Extras may cost more.':'Menu photos are illustrative. Confirm extras when ordering.';$('meal-name').textContent=none?'Try a different combination':meal[0];$('meal-description').textContent=none?'This selection has no matching item in this finder. Change your filling or food style.':meal[4];$('match-label').textContent=none?'NO MENU MATCH':fits?'YOUR MENU MATCH':'CLOSEST MATCH · OVER BUDGET';const total=none?0:meal[1]+drink;$('total').textContent=none?'—':money(total);$('remaining').textContent=none?'':fits?money(budget-total)+' within budget':money(total-budget)+' over budget';$('pairing').textContent=drink?$('drink').selectedOptions[0].text.split(' · ')[0]+' included in estimate':'Food only';$('no-match').hidden=none||fits;$('no-match').textContent='No matching meal fits this budget. Increase your budget or change a preference.';}
for(const group of ['protein','format']){$(group).addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;state[group]=b.dataset.value;for(const x of $(group).children)x.setAttribute('aria-pressed',String(x===b));update();});}
$('budget').addEventListener('input',update);$('drink').addEventListener('change',update);update();
