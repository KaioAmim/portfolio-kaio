import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const source=await readFile(new URL('../public/sw.js',import.meta.url),'utf8');
function setup(fetch){
 const handlers={};const fallback=new Response('offline document');
 const context={URL,Response,fetch,caches:{match:async()=>fallback},self:{location:{origin:'https://portfolio.test'},addEventListener:(name,fn)=>handlers[name]=fn}};
 vm.runInNewContext(source,context);
 return {handlers,fallback};
}
async function navigate(fetch,path='/',mode='navigate'){
 const {handlers,fallback}=setup(fetch);let response;
 handlers.fetch({request:{url:`https://portfolio.test${path}`,mode},respondWith(promise){response=promise;}});
 return {result:await response,fallback};
}
test('network failure returns the saved offline page',async()=>{const {result,fallback}=await navigate(async()=>{throw new Error('offline');});assert.equal(result,fallback);});
test('hosting 503 returns the saved offline page',async()=>{const {result,fallback}=await navigate(async()=>new Response('',{status:503}));assert.equal(result,fallback);});
test('successful page is served fresh',async()=>{const live=new Response('new version');const {result}=await navigate(async()=>live);assert.equal(result,live);});
test('authentication responses are preserved',async()=>{const auth=new Response('sign in',{status:401});const {result}=await navigate(async()=>auth);assert.equal(result,auth);});
test('auth routes and asset requests are not intercepted',async()=>{let called=false;const fetch=async()=>{called=true;return new Response('');};assert.equal((await navigate(fetch,'/signin-with-chatgpt')).result,undefined);assert.equal((await navigate(fetch,'/','cors')).result,undefined);assert.equal(called,false);});
