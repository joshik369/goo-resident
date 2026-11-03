const {test}=require('node:test'),assert=require('node:assert/strict'),{mkdtempSync,rmSync}=require('node:fs'),{tmpdir}=require('node:os'),path=require('node:path');
const {createApp}=require('./server.cjs');
test('Real account lifecycle, persistence, resident isolation, office permissions and violations',async()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'goo-security-')),dbPath=path.join(dir,'test.sqlite');let app=createApp({dbPath});await new Promise(r=>app.server.listen(0,'127.0.0.1',r));let base='http://127.0.0.1:'+app.server.address().port;
 const password='A-long-test-password-42!';
 async function call(url,body,token){const r=await fetch(base+url,{method:body?'POST':'GET',headers:{'Content-Type':'application/json','X-Goo-Client':'native',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,body:await r.json()}}
 const mutate=(op,payload,token)=>call('/api/mutate',{op,payload},token);
 const activate=link=>call('/api/activate',{token:new URLSearchParams(new URL(link).hash.slice(1)).get('activate'),password});
 const login=async email=>{const r=await call('/api/login',{email,password});assert.equal(r.status,200);return r.body.token};
 try{
 const home=await fetch(base+'/');assert.equal(home.status,200);assert.match(await home.text(),/Your community,/);assert.equal(home.headers.get('x-robots-tag'),null);
 const portal=await fetch(base+'/portal');assert.equal(portal.status,200);assert.match(portal.headers.get('x-robots-tag'),/noindex/);assert.match(await portal.text(),/client.js/);
 const map=await fetch(base+'/sitemap.xml');assert.match(map.headers.get('content-type'),/xml/);const xml=await map.text();assert.match(xml,/<loc>http:\/\/127.0.0.1:4180\/<\/loc>/);assert(!xml.includes('portal'));assert(!xml.includes('api/'));
 const robots=await fetch(base+'/robots.txt');assert.match(await robots.text(),/Sitemap:.*sitemap.xml/);
 const privateResponse=await fetch(base+'/api/state');assert.equal(privateResponse.status,401);assert.match(privateResponse.headers.get('x-robots-tag'),/noindex/);
 assert.equal((await call('/api/state')).status,401);
 const setup=app.bootstrap('admin@example.test');assert(setup.activationUrl);assert.equal(app.bootstrap('attacker@example.test'),null);assert.equal((await activate(setup.activationUrl)).status,200);assert.equal((await activate(setup.activationUrl)).status,400);
 let admin=await login('admin@example.test');
 async function resident(name,email,apt,role){const r=await mutate('account',{name,email,apartmentId:apt,leaseRole:role},admin);assert.equal(r.status,200);assert.equal((await activate(r.body.activationUrl)).status,200);return login(email)}
 const first=await resident('Primary','one@example.test',1,'Primary leaseholder');const second=await resident('Secondary','two@example.test',1,'Secondary leaseholder');const dependent=await resident('Dependent','dependent@example.test',1,'Dependent');const other=await resident('Other','other@example.test',2,'Primary leaseholder');
 assert.equal((await mutate('account',{name:'Attack',email:'attack@example.test',apartmentId:1,leaseRole:'Dependent'},first)).status,403);
 assert.equal((await mutate('settings',{community:'Hacked'},second)).status,403);
 assert.equal((await mutate('charges',{apartmentId:2,category:'Rent',amountCents:1,date:'2026-11-01',description:'Attack'},dependent)).status,403);
 const salts=app.db.prepare('SELECT password_hash FROM accounts').all().map(a=>a.password_hash.split(':')[0]);assert.equal(new Set(salts).size,5);for(const salt of salts)assert.equal(Buffer.from(salt,'base64url').length,32);
 assert.equal((await call('/api/login',{email:'admin@example.test',password:'wrong-password-value'})).status,401);
 assert.equal((await mutate('charges',{apartmentId:1,category:'Rent',amountCents:145099,date:'2026-11-01',dueDate:'2026-02-30',description:'Invalid due date'},admin)).status,400);
 assert.equal((await mutate('charges',{apartmentId:1,category:'Rent',amountCents:145099,date:'2026-11-01',dueDate:'2026-11-05',description:'Monthly rent'},admin)).status,200);
 const accountData=(await call('/api/state',null,admin)).body;const secondId=accountData.accounts.find(a=>a.email==='two@example.test').id;
 await mutate('violations',{apartmentId:1,title:'Household notice',rule:'Quiet hours',date:'2026-11-01',description:'Apartment notice',requiredAction:'Observe quiet hours',deadline:'2026-11-10',internalNotes:'STAFF SECRET'},admin);
 await mutate('violations',{apartmentId:1,memberId:secondId,title:'Individual notice',rule:'Parking',date:'2026-11-01',description:'Individual only',requiredAction:'Move vehicle',deadline:'2026-11-10'},admin);
 const s1=(await call('/api/state',null,first)).body,s2=(await call('/api/state',null,second)).body,s3=(await call('/api/state',null,other)).body;
 assert.equal(s1.apartments.length,1);assert.equal(s1.apartments[0].block,undefined);assert.equal(s1.accounts,undefined);assert(!JSON.stringify(s1).includes('STAFF SECRET'));assert.equal(s1.records.filter(r=>r.kind==='violations').length,1);assert.equal(s2.records.filter(r=>r.kind==='violations').length,2);assert.equal(s3.records.length,0);
 await mutate('request',{apartmentId:2,title:'Leak',description:'Sink leak',category:'Plumbing',priority:'Normal',entry:'Contact me first'},first);
 assert.equal((await call('/api/state',null,first)).body.records.find(r=>r.kind==='requests').apartmentId,1);
 assert.equal((await mutate('autopay',{items:['Electricity'],day:1},first)).status,400);assert.equal((await mutate('autopay',{items:['Rent'],day:4},first)).status,400);
 await mutate('autopay',{items:['Rent'],day:3},first);await mutate('autopay',{items:['Water'],day:2},second);assert.equal((await call('/api/state',null,first)).body.records.filter(r=>r.kind==='autopay').length,1);
 const payment={apartmentId:1,amountCents:145099,date:'2026-11-02',reference:'bank-ref-1'};assert.equal((await mutate('payments',payment,admin)).status,200);assert.equal((await mutate('payments',payment,admin)).status,409);
 assert.equal((await mutate('settings',{community:'Goo Community',timezone:'America/Chicago',paymentUrl:'javascript:alert(1)'},admin)).status,400);
 const csrf=await fetch(base+'/api/mutate',{method:'POST',headers:{Origin:'https://attacker.test','Content-Type':'application/json',Authorization:'Bearer '+admin},body:JSON.stringify({op:'settings',payload:{}})});assert.equal(csrf.status,403);
 const oldSalt=app.db.prepare('SELECT password_hash FROM accounts WHERE id=?').get(secondId).password_hash.split(':')[0];
 const reset=await mutate('invite',{id:secondId},admin);assert.equal((await activate(reset.body.activationUrl)).status,200);assert.equal((await call('/api/state',null,second)).status,401);
 assert.notEqual(app.db.prepare('SELECT password_hash FROM accounts WHERE id=?').get(secondId).password_hash.split(':')[0],oldSalt);
 await mutate('account-active',{id:secondId,active:false},admin);assert.equal((await call('/api/login',{email:'two@example.test',password})).status,401);
 await mutate('lease-active',{apartmentId:1,active:false},admin);assert.equal((await call('/api/state',null,first)).status,401);assert.equal((await call('/api/state',null,dependent)).status,401);
 assert.equal((await call('/api/logout',{},admin)).status,200);assert.equal((await call('/api/state',null,admin)).status,401);
 await app.close();app=createApp({dbPath});await new Promise(r=>app.server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+app.server.address().port;admin=await login('admin@example.test');const persisted=(await call('/api/state',null,admin)).body;assert.equal(persisted.accounts.length,5);assert.equal(persisted.records.filter(r=>r.kind==='charges')[0].amountCents,145099);assert(persisted.audit.length>0);assert.equal(persisted.records.find(r=>r.kind==='charges').dueDate,'2026-11-05');
 for(const a of app.db.prepare('SELECT * FROM accounts').all()){assert(!a.password_hash.includes(password));assert(a.password_hash.includes(':'))}
 }finally{await app.close();rmSync(dir,{recursive:true,force:true})}
});
