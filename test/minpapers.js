// Every answer path in every guide must list at least 3 papers (seeded random walks, 400 per guide).
let seed = 12345; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
global.window=global;['kb','cites','j-money','j-family','j-consumer','j-other','j-nri','j-business','j-more','j-genz','j-gaps','j-rights','j-crucial','stand','law-2026','engine'].forEach(f=>require('../src/'+f+'.js'));
const KB=global.ER_KB,E=global.ER_ENGINE;
// exhaustive-ish: for each guide, random walks over many answer combos; report min papers
let worst=[];
for(const iss of KB.issues){let min=99,ex=null;
 for(let trial=0;trial<400;trial++){const a={};
  for(let k=0;k<30;k++){const q=E.nextQuestion?E.nextQuestion(iss,a,'all'):null;if(!q)break;const o=q.options[Math.floor(rnd()*q.options.length)];a[q.id]=q.multi?[o.id]:o.id;}
  const ev=E.evidence(iss,a);const n=(ev.must||ev).length!==undefined?(Array.isArray(ev)?ev.length:(ev.must||[]).length+(ev.maybe||[]).length):0;
  if(n<min){min=n;ex=JSON.stringify(a);} }
 if(min<3)worst.push(iss.id+' min='+min+' '+ex);}
if (worst.length) { console.log(worst.join('\n')); process.exit(1); } console.log('MINPAPERS OK');
