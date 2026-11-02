// Temporary, in-memory UI verification server. Never writes real community data.
const {createApp}=require('./server.cjs');
const app=createApp({dbPath:':memory:',origin:'http://127.0.0.1:4181'});
const setup=app.bootstrap('qa@example.test');
app.server.listen(4181,'127.0.0.1',async()=>{
 const token=new URLSearchParams(new URL(setup.activationUrl).hash.slice(1)).get('activate');
 const response=await fetch('http://127.0.0.1:4181/api/activate',{method:'POST',headers:{'Content-Type':'application/json','X-Goo-Client':'native'},body:JSON.stringify({token,password:'Temporary-QA-Only-2026!'})});
 if(!response.ok)throw Error('QA setup failed');
 console.log('Temporary QA server ready: http://127.0.0.1:4181');
});
