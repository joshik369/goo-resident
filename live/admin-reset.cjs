// Local operator recovery, not an internet endpoint. Prints a private single-use link.
const {createApp}=require('./server.cjs');
const app=createApp({origin:process.env.PUBLIC_ORIGIN||'http://127.0.0.1:4180'});
const account=app.db.prepare("SELECT id FROM accounts WHERE role='administrator' AND email=?").get((process.env.ADMIN_EMAIL||'joshik.natarajan@gmail.com').toLowerCase());
if(!account){console.error('Start the server once to provision the initial administrator.');process.exitCode=1}else console.log('Private administrator reset link (24 hours): '+app.issue(account.id,'local-operator').activationUrl);
app.db.close();
