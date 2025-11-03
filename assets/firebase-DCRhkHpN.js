var Ei={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _o=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let r=t.charCodeAt(s);r<128?e[n++]=r:r<2048?(e[n++]=r>>6|192,e[n++]=r&63|128):(r&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=r>>18|240,e[n++]=r>>12&63|128,e[n++]=r>>6&63|128,e[n++]=r&63|128):(e[n++]=r>>12|224,e[n++]=r>>6&63|128,e[n++]=r&63|128)}return e},rc=function(t){const e=[];let n=0,s=0;for(;n<t.length;){const r=t[n++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const i=t[n++];e[s++]=String.fromCharCode((r&31)<<6|i&63)}else if(r>239&&r<365){const i=t[n++],o=t[n++],a=t[n++],u=((r&7)<<18|(i&63)<<12|(o&63)<<6|a&63)-65536;e[s++]=String.fromCharCode(55296+(u>>10)),e[s++]=String.fromCharCode(56320+(u&1023))}else{const i=t[n++],o=t[n++];e[s++]=String.fromCharCode((r&15)<<12|(i&63)<<6|o&63)}}return e.join("")},bo={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<t.length;r+=3){const i=t[r],o=r+1<t.length,a=o?t[r+1]:0,u=r+2<t.length,c=u?t[r+2]:0,l=i>>2,h=(i&3)<<4|a>>4;let d=(a&15)<<2|c>>6,p=c&63;u||(p=64,o||(d=64)),s.push(n[l],n[h],n[d],n[p])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(_o(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):rc(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<t.length;){const i=n[t.charAt(r++)],a=r<t.length?n[t.charAt(r)]:0;++r;const c=r<t.length?n[t.charAt(r)]:64;++r;const h=r<t.length?n[t.charAt(r)]:64;if(++r,i==null||a==null||c==null||h==null)throw new ic;const d=i<<2|a>>4;if(s.push(d),c!==64){const p=a<<4&240|c>>2;if(s.push(p),h!==64){const E=c<<6&192|h;s.push(E)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class ic extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const oc=function(t){const e=_o(t);return bo.encodeByteArray(e,!0)},Cn=function(t){return oc(t).replace(/\./g,"")},ac=function(t){try{return bo.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uc(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cc=()=>uc().__FIREBASE_DEFAULTS__,lc=()=>{if(typeof process>"u"||typeof Ei>"u")return;const t=Ei.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},hc=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&ac(t[1]);return e&&JSON.parse(e)},jn=()=>{try{return cc()||lc()||hc()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},fc=t=>{var e,n;return(n=(e=jn())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},dc=t=>{const e=fc(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),s]:[e.substring(0,n),s]},No=()=>{var t;return(t=jn())===null||t===void 0?void 0:t.config},Pg=t=>{var e;return(e=jn())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gc{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pc(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},s=e||"demo-project",r=t.iat||0,i=t.sub||t.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:r,exp:r+3600,auth_time:r,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Cn(JSON.stringify(n)),Cn(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ko(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Fg(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ko())}function Vg(){var t;const e=(t=jn())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function $g(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function Ug(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Bg(){const t=ko();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function mc(){try{return typeof indexedDB=="object"}catch{return!1}}function yc(){return new Promise((t,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var i;e(((i=r.error)===null||i===void 0?void 0:i.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vc="FirebaseError";class gt extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=vc,Object.setPrototypeOf(this,gt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ro.prototype.create)}}class Ro{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},r=`${this.service}/${e}`,i=this.errors[e],o=i?wc(i,s):"Error",a=`${this.serviceName}: ${o} (${r}).`;return new gt(r,a,s)}}function wc(t,e){return t.replace(Ec,(n,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const Ec=/\{\$([^}]+)}/g;function jg(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function $s(t,e){if(t===e)return!0;const n=Object.keys(t),s=Object.keys(e);for(const r of n){if(!s.includes(r))return!1;const i=t[r],o=e[r];if(Ti(i)&&Ti(o)){if(!$s(i,o))return!1}else if(i!==o)return!1}for(const r of s)if(!n.includes(r))return!1;return!0}function Ti(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qg(t){const e=[];for(const[n,s]of Object.entries(t))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function zg(t,e){const n=new Tc(t,e);return n.subscribe.bind(n)}class Tc{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,s){let r;if(e===void 0&&n===void 0&&s===void 0)throw new Error("Missing Observer.");Ic(e,["next","error","complete"])?r=e:r={next:e,error:n,complete:s},r.next===void 0&&(r.next=Ss),r.error===void 0&&(r.error=Ss),r.complete===void 0&&(r.complete=Ss);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Ic(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Ss(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ie(t){return t&&t._delegate?t._delegate:t}class xt{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fe="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sc{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new gc;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Ac(e))try{this.getOrInitializeService({instanceIdentifier:Fe})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:r});s.resolve(i)}catch{}}}}clearInstance(e=Fe){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Fe){return this.instances.has(e)}getOptions(e=Fe){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[i,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(i);s===a&&o.resolve(r)}return r}onInit(e,n){var s;const r=this.normalizeInstanceIdentifier(n),i=(s=this.onInitCallbacks.get(r))!==null&&s!==void 0?s:new Set;i.add(e),this.onInitCallbacks.set(r,i);const o=this.instances.get(r);return o&&e(o,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const r of s)try{r(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Cc(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Fe){return this.component?this.component.multipleInstances?e:Fe:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Cc(t){return t===Fe?void 0:t}function Ac(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dc{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Sc(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var k;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(k||(k={}));const _c={debug:k.DEBUG,verbose:k.VERBOSE,info:k.INFO,warn:k.WARN,error:k.ERROR,silent:k.SILENT},bc=k.INFO,Nc={[k.DEBUG]:"log",[k.VERBOSE]:"log",[k.INFO]:"info",[k.WARN]:"warn",[k.ERROR]:"error"},kc=(t,e,...n)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),r=Nc[e];if(r)console[r](`[${s}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class xo{constructor(e){this.name=e,this._logLevel=bc,this._logHandler=kc,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in k))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?_c[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,k.DEBUG,...e),this._logHandler(this,k.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,k.VERBOSE,...e),this._logHandler(this,k.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,k.INFO,...e),this._logHandler(this,k.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,k.WARN,...e),this._logHandler(this,k.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,k.ERROR,...e),this._logHandler(this,k.ERROR,...e)}}const Rc=(t,e)=>e.some(n=>t instanceof n);let Ii,Si;function xc(){return Ii||(Ii=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Mc(){return Si||(Si=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Mo=new WeakMap,Us=new WeakMap,Oo=new WeakMap,Cs=new WeakMap,mr=new WeakMap;function Oc(t){const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("success",i),t.removeEventListener("error",o)},i=()=>{n(be(t.result)),r()},o=()=>{s(t.error),r()};t.addEventListener("success",i),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&Mo.set(n,t)}).catch(()=>{}),mr.set(e,t),e}function Lc(t){if(Us.has(t))return;const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",o),t.removeEventListener("abort",o)},i=()=>{n(),r()},o=()=>{s(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",i),t.addEventListener("error",o),t.addEventListener("abort",o)});Us.set(t,e)}let Bs={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Us.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Oo.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return be(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Pc(t){Bs=t(Bs)}function Fc(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=t.call(As(this),e,...n);return Oo.set(s,e.sort?e.sort():[e]),be(s)}:Mc().includes(t)?function(...e){return t.apply(As(this),e),be(Mo.get(this))}:function(...e){return be(t.apply(As(this),e))}}function Vc(t){return typeof t=="function"?Fc(t):(t instanceof IDBTransaction&&Lc(t),Rc(t,xc())?new Proxy(t,Bs):t)}function be(t){if(t instanceof IDBRequest)return Oc(t);if(Cs.has(t))return Cs.get(t);const e=Vc(t);return e!==t&&(Cs.set(t,e),mr.set(e,t)),e}const As=t=>mr.get(t);function $c(t,e,{blocked:n,upgrade:s,blocking:r,terminated:i}={}){const o=indexedDB.open(t,e),a=be(o);return s&&o.addEventListener("upgradeneeded",u=>{s(be(o.result),u.oldVersion,u.newVersion,be(o.transaction),u)}),n&&o.addEventListener("blocked",u=>n(u.oldVersion,u.newVersion,u)),a.then(u=>{i&&u.addEventListener("close",()=>i()),r&&u.addEventListener("versionchange",c=>r(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}const Uc=["get","getKey","getAll","getAllKeys","count"],Bc=["put","add","delete","clear"],Ds=new Map;function Ci(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Ds.get(e))return Ds.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,r=Bc.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(r||Uc.includes(n)))return;const i=async function(o,...a){const u=this.transaction(o,r?"readwrite":"readonly");let c=u.store;return s&&(c=c.index(a.shift())),(await Promise.all([c[n](...a),r&&u.done]))[0]};return Ds.set(e,i),i}Pc(t=>({...t,get:(e,n,s)=>Ci(e,n)||t.get(e,n,s),has:(e,n)=>!!Ci(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jc{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(qc(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function qc(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const js="@firebase/app",Ai="0.9.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const je=new xo("@firebase/app"),zc="@firebase/app-compat",Kc="@firebase/analytics-compat",Hc="@firebase/analytics",Gc="@firebase/app-check-compat",Qc="@firebase/app-check",Wc="@firebase/auth",Yc="@firebase/auth-compat",Xc="@firebase/database",Jc="@firebase/database-compat",Zc="@firebase/functions",el="@firebase/functions-compat",tl="@firebase/installations",nl="@firebase/installations-compat",sl="@firebase/messaging",rl="@firebase/messaging-compat",il="@firebase/performance",ol="@firebase/performance-compat",al="@firebase/remote-config",ul="@firebase/remote-config-compat",cl="@firebase/storage",ll="@firebase/storage-compat",hl="@firebase/firestore",fl="@firebase/firestore-compat",dl="firebase",gl="9.23.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qs="[DEFAULT]",pl={[js]:"fire-core",[zc]:"fire-core-compat",[Hc]:"fire-analytics",[Kc]:"fire-analytics-compat",[Qc]:"fire-app-check",[Gc]:"fire-app-check-compat",[Wc]:"fire-auth",[Yc]:"fire-auth-compat",[Xc]:"fire-rtdb",[Jc]:"fire-rtdb-compat",[Zc]:"fire-fn",[el]:"fire-fn-compat",[tl]:"fire-iid",[nl]:"fire-iid-compat",[sl]:"fire-fcm",[rl]:"fire-fcm-compat",[il]:"fire-perf",[ol]:"fire-perf-compat",[al]:"fire-rc",[ul]:"fire-rc-compat",[cl]:"fire-gcs",[ll]:"fire-gcs-compat",[hl]:"fire-fst",[fl]:"fire-fst-compat","fire-js":"fire-js",[dl]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const An=new Map,zs=new Map;function ml(t,e){try{t.container.addComponent(e)}catch(n){je.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Dn(t){const e=t.name;if(zs.has(e))return je.debug(`There were multiple attempts to register component ${e}.`),!1;zs.set(e,t);for(const n of An.values())ml(n,t);return!0}function yl(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vl={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."},Ne=new Ro("app","Firebase",vl);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wl{constructor(e,n,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new xt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ne.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const El=gl;function Tl(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const s=Object.assign({name:qs,automaticDataCollectionEnabled:!1},e),r=s.name;if(typeof r!="string"||!r)throw Ne.create("bad-app-name",{appName:String(r)});if(n||(n=No()),!n)throw Ne.create("no-options");const i=An.get(r);if(i){if($s(n,i.options)&&$s(s,i.config))return i;throw Ne.create("duplicate-app",{appName:r})}const o=new Dc(r);for(const u of zs.values())o.addComponent(u);const a=new wl(n,s,o);return An.set(r,a),a}function Il(t=qs){const e=An.get(t);if(!e&&t===qs&&No())return Tl();if(!e)throw Ne.create("no-app",{appName:t});return e}function tt(t,e,n){var s;let r=(s=pl[t])!==null&&s!==void 0?s:t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),je.warn(a.join(" "));return}Dn(new xt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sl="firebase-heartbeat-database",Cl=1,Mt="firebase-heartbeat-store";let _s=null;function Lo(){return _s||(_s=$c(Sl,Cl,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(Mt)}}}).catch(t=>{throw Ne.create("idb-open",{originalErrorMessage:t.message})})),_s}async function Al(t){try{return await(await Lo()).transaction(Mt).objectStore(Mt).get(Po(t))}catch(e){if(e instanceof gt)je.warn(e.message);else{const n=Ne.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});je.warn(n.message)}}}async function Di(t,e){try{const s=(await Lo()).transaction(Mt,"readwrite");await s.objectStore(Mt).put(e,Po(t)),await s.done}catch(n){if(n instanceof gt)je.warn(n.message);else{const s=Ne.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});je.warn(s.message)}}}function Po(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dl=1024,_l=720*60*60*1e3;class bl{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new kl(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=_i();if(this._heartbeatsCache===null&&(this._heartbeatsCache=await this._heartbeatsCachePromise),!(this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(r=>r.date===s)))return this._heartbeatsCache.heartbeats.push({date:s,agent:n}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(r=>{const i=new Date(r.date).valueOf();return Date.now()-i<=_l}),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache===null||this._heartbeatsCache.heartbeats.length===0)return"";const e=_i(),{heartbeatsToSend:n,unsentEntries:s}=Nl(this._heartbeatsCache.heartbeats),r=Cn(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}}function _i(){return new Date().toISOString().substring(0,10)}function Nl(t,e=Dl){const n=[];let s=t.slice();for(const r of t){const i=n.find(o=>o.agent===r.agent);if(i){if(i.dates.push(r.date),bi(n)>e){i.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),bi(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class kl{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return mc()?yc().then(()=>!0).catch(()=>!1):!1}async read(){return await this._canUseIndexedDBPromise?await Al(this.app)||{heartbeats:[]}:{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Di(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Di(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function bi(t){return Cn(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rl(t){Dn(new xt("platform-logger",e=>new jc(e),"PRIVATE")),Dn(new xt("heartbeat",e=>new bl(e),"PRIVATE")),tt(js,Ai,t),tt(js,Ai,"esm2017"),tt("fire-js","")}Rl("");var xl="firebase",Ml="9.23.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */tt(xl,Ml,"app");var Ol=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},m,yr=yr||{},I=Ol||self;function qn(t){var e=typeof t;return e=e!="object"?e:t?Array.isArray(t)?"array":e:"null",e=="array"||e=="object"&&typeof t.length=="number"}function zn(t){var e=typeof t;return e=="object"&&t!=null||e=="function"}function Ll(t,e,n){return t.call.apply(t.bind,arguments)}function Pl(t,e,n){if(!t)throw Error();if(2<arguments.length){var s=Array.prototype.slice.call(arguments,2);return function(){var r=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(r,s),t.apply(e,r)}}return function(){return t.apply(e,arguments)}}function Z(t,e,n){return Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?Z=Ll:Z=Pl,Z.apply(null,arguments)}function hn(t,e){var n=Array.prototype.slice.call(arguments,1);return function(){var s=n.slice();return s.push.apply(s,arguments),t.apply(this,s)}}function K(t,e){function n(){}n.prototype=e.prototype,t.$=e.prototype,t.prototype=new n,t.prototype.constructor=t,t.ac=function(s,r,i){for(var o=Array(arguments.length-2),a=2;a<arguments.length;a++)o[a-2]=arguments[a];return e.prototype[r].apply(s,o)}}function Oe(){this.s=this.s,this.o=this.o}var Fl=0;Oe.prototype.s=!1;Oe.prototype.sa=function(){!this.s&&(this.s=!0,this.N(),Fl!=0)};Oe.prototype.N=function(){if(this.o)for(;this.o.length;)this.o.shift()()};const Fo=Array.prototype.indexOf?function(t,e){return Array.prototype.indexOf.call(t,e,void 0)}:function(t,e){if(typeof t=="string")return typeof e!="string"||e.length!=1?-1:t.indexOf(e,0);for(let n=0;n<t.length;n++)if(n in t&&t[n]===e)return n;return-1};function vr(t){const e=t.length;if(0<e){const n=Array(e);for(let s=0;s<e;s++)n[s]=t[s];return n}return[]}function Ni(t,e){for(let n=1;n<arguments.length;n++){const s=arguments[n];if(qn(s)){const r=t.length||0,i=s.length||0;t.length=r+i;for(let o=0;o<i;o++)t[r+o]=s[o]}else t.push(s)}}function ee(t,e){this.type=t,this.g=this.target=e,this.defaultPrevented=!1}ee.prototype.h=function(){this.defaultPrevented=!0};var Vl=(function(){if(!I.addEventListener||!Object.defineProperty)return!1;var t=!1,e=Object.defineProperty({},"passive",{get:function(){t=!0}});try{I.addEventListener("test",()=>{},e),I.removeEventListener("test",()=>{},e)}catch{}return t})();function Ot(t){return/^[\s\xa0]*$/.test(t)}function Kn(){var t=I.navigator;return t&&(t=t.userAgent)?t:""}function pe(t){return Kn().indexOf(t)!=-1}function wr(t){return wr[" "](t),t}wr[" "]=function(){};function $l(t,e){var n=xh;return Object.prototype.hasOwnProperty.call(n,t)?n[t]:n[t]=e(t)}var Ul=pe("Opera"),ot=pe("Trident")||pe("MSIE"),Vo=pe("Edge"),Ks=Vo||ot,$o=pe("Gecko")&&!(Kn().toLowerCase().indexOf("webkit")!=-1&&!pe("Edge"))&&!(pe("Trident")||pe("MSIE"))&&!pe("Edge"),Bl=Kn().toLowerCase().indexOf("webkit")!=-1&&!pe("Edge");function Uo(){var t=I.document;return t?t.documentMode:void 0}var Hs;e:{var bs="",Ns=(function(){var t=Kn();if($o)return/rv:([^\);]+)(\)|;)/.exec(t);if(Vo)return/Edge\/([\d\.]+)/.exec(t);if(ot)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(t);if(Bl)return/WebKit\/(\S+)/.exec(t);if(Ul)return/(?:Version)[ \/]?(\S+)/.exec(t)})();if(Ns&&(bs=Ns?Ns[1]:""),ot){var ks=Uo();if(ks!=null&&ks>parseFloat(bs)){Hs=String(ks);break e}}Hs=bs}var Gs;if(I.document&&ot){var ki=Uo();Gs=ki||parseInt(Hs,10)||void 0}else Gs=void 0;var jl=Gs;function Lt(t,e){if(ee.call(this,t?t.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,t){var n=this.type=t.type,s=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:null;if(this.target=t.target||t.srcElement,this.g=e,e=t.relatedTarget){if($o){e:{try{wr(e.nodeName);var r=!0;break e}catch{}r=!1}r||(e=null)}}else n=="mouseover"?e=t.fromElement:n=="mouseout"&&(e=t.toElement);this.relatedTarget=e,s?(this.clientX=s.clientX!==void 0?s.clientX:s.pageX,this.clientY=s.clientY!==void 0?s.clientY:s.pageY,this.screenX=s.screenX||0,this.screenY=s.screenY||0):(this.clientX=t.clientX!==void 0?t.clientX:t.pageX,this.clientY=t.clientY!==void 0?t.clientY:t.pageY,this.screenX=t.screenX||0,this.screenY=t.screenY||0),this.button=t.button,this.key=t.key||"",this.ctrlKey=t.ctrlKey,this.altKey=t.altKey,this.shiftKey=t.shiftKey,this.metaKey=t.metaKey,this.pointerId=t.pointerId||0,this.pointerType=typeof t.pointerType=="string"?t.pointerType:ql[t.pointerType]||"",this.state=t.state,this.i=t,t.defaultPrevented&&Lt.$.h.call(this)}}K(Lt,ee);var ql={2:"touch",3:"pen",4:"mouse"};Lt.prototype.h=function(){Lt.$.h.call(this);var t=this.i;t.preventDefault?t.preventDefault():t.returnValue=!1};var Hn="closure_listenable_"+(1e6*Math.random()|0),zl=0;function Kl(t,e,n,s,r){this.listener=t,this.proxy=null,this.src=e,this.type=n,this.capture=!!s,this.la=r,this.key=++zl,this.fa=this.ia=!1}function Gn(t){t.fa=!0,t.listener=null,t.proxy=null,t.src=null,t.la=null}function Er(t,e,n){for(const s in t)e.call(n,t[s],s,t)}function Hl(t,e){for(const n in t)e.call(void 0,t[n],n,t)}function Bo(t){const e={};for(const n in t)e[n]=t[n];return e}const Ri="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function jo(t,e){let n,s;for(let r=1;r<arguments.length;r++){s=arguments[r];for(n in s)t[n]=s[n];for(let i=0;i<Ri.length;i++)n=Ri[i],Object.prototype.hasOwnProperty.call(s,n)&&(t[n]=s[n])}}function Qn(t){this.src=t,this.g={},this.h=0}Qn.prototype.add=function(t,e,n,s,r){var i=t.toString();t=this.g[i],t||(t=this.g[i]=[],this.h++);var o=Ws(t,e,s,r);return-1<o?(e=t[o],n||(e.ia=!1)):(e=new Kl(e,this.src,i,!!s,r),e.ia=n,t.push(e)),e};function Qs(t,e){var n=e.type;if(n in t.g){var s=t.g[n],r=Fo(s,e),i;(i=0<=r)&&Array.prototype.splice.call(s,r,1),i&&(Gn(e),t.g[n].length==0&&(delete t.g[n],t.h--))}}function Ws(t,e,n,s){for(var r=0;r<t.length;++r){var i=t[r];if(!i.fa&&i.listener==e&&i.capture==!!n&&i.la==s)return r}return-1}var Tr="closure_lm_"+(1e6*Math.random()|0),Rs={};function qo(t,e,n,s,r){if(Array.isArray(e)){for(var i=0;i<e.length;i++)qo(t,e[i],n,s,r);return null}return n=Ho(n),t&&t[Hn]?t.O(e,n,zn(s)?!!s.capture:!1,r):Gl(t,e,n,!1,s,r)}function Gl(t,e,n,s,r,i){if(!e)throw Error("Invalid event type");var o=zn(r)?!!r.capture:!!r,a=Sr(t);if(a||(t[Tr]=a=new Qn(t)),n=a.add(e,n,s,o,i),n.proxy)return n;if(s=Ql(),n.proxy=s,s.src=t,s.listener=n,t.addEventListener)Vl||(r=o),r===void 0&&(r=!1),t.addEventListener(e.toString(),s,r);else if(t.attachEvent)t.attachEvent(Ko(e.toString()),s);else if(t.addListener&&t.removeListener)t.addListener(s);else throw Error("addEventListener and attachEvent are unavailable.");return n}function Ql(){function t(n){return e.call(t.src,t.listener,n)}const e=Wl;return t}function zo(t,e,n,s,r){if(Array.isArray(e))for(var i=0;i<e.length;i++)zo(t,e[i],n,s,r);else s=zn(s)?!!s.capture:!!s,n=Ho(n),t&&t[Hn]?(t=t.i,e=String(e).toString(),e in t.g&&(i=t.g[e],n=Ws(i,n,s,r),-1<n&&(Gn(i[n]),Array.prototype.splice.call(i,n,1),i.length==0&&(delete t.g[e],t.h--)))):t&&(t=Sr(t))&&(e=t.g[e.toString()],t=-1,e&&(t=Ws(e,n,s,r)),(n=-1<t?e[t]:null)&&Ir(n))}function Ir(t){if(typeof t!="number"&&t&&!t.fa){var e=t.src;if(e&&e[Hn])Qs(e.i,t);else{var n=t.type,s=t.proxy;e.removeEventListener?e.removeEventListener(n,s,t.capture):e.detachEvent?e.detachEvent(Ko(n),s):e.addListener&&e.removeListener&&e.removeListener(s),(n=Sr(e))?(Qs(n,t),n.h==0&&(n.src=null,e[Tr]=null)):Gn(t)}}}function Ko(t){return t in Rs?Rs[t]:Rs[t]="on"+t}function Wl(t,e){if(t.fa)t=!0;else{e=new Lt(e,this);var n=t.listener,s=t.la||t.src;t.ia&&Ir(t),t=n.call(s,e)}return t}function Sr(t){return t=t[Tr],t instanceof Qn?t:null}var xs="__closure_events_fn_"+(1e9*Math.random()>>>0);function Ho(t){return typeof t=="function"?t:(t[xs]||(t[xs]=function(e){return t.handleEvent(e)}),t[xs])}function z(){Oe.call(this),this.i=new Qn(this),this.S=this,this.J=null}K(z,Oe);z.prototype[Hn]=!0;z.prototype.removeEventListener=function(t,e,n,s){zo(this,t,e,n,s)};function Q(t,e){var n,s=t.J;if(s)for(n=[];s;s=s.J)n.push(s);if(t=t.S,s=e.type||e,typeof e=="string")e=new ee(e,t);else if(e instanceof ee)e.target=e.target||t;else{var r=e;e=new ee(s,t),jo(e,r)}if(r=!0,n)for(var i=n.length-1;0<=i;i--){var o=e.g=n[i];r=fn(o,s,!0,e)&&r}if(o=e.g=t,r=fn(o,s,!0,e)&&r,r=fn(o,s,!1,e)&&r,n)for(i=0;i<n.length;i++)o=e.g=n[i],r=fn(o,s,!1,e)&&r}z.prototype.N=function(){if(z.$.N.call(this),this.i){var t=this.i,e;for(e in t.g){for(var n=t.g[e],s=0;s<n.length;s++)Gn(n[s]);delete t.g[e],t.h--}}this.J=null};z.prototype.O=function(t,e,n,s){return this.i.add(String(t),e,!1,n,s)};z.prototype.P=function(t,e,n,s){return this.i.add(String(t),e,!0,n,s)};function fn(t,e,n,s){if(e=t.i.g[String(e)],!e)return!0;e=e.concat();for(var r=!0,i=0;i<e.length;++i){var o=e[i];if(o&&!o.fa&&o.capture==n){var a=o.listener,u=o.la||o.src;o.ia&&Qs(t.i,o),r=a.call(u,s)!==!1&&r}}return r&&!s.defaultPrevented}var Cr=I.JSON.stringify;class Yl{constructor(e,n){this.i=e,this.j=n,this.h=0,this.g=null}get(){let e;return 0<this.h?(this.h--,e=this.g,this.g=e.next,e.next=null):e=this.i(),e}}function Xl(){var t=Ar;let e=null;return t.g&&(e=t.g,t.g=t.g.next,t.g||(t.h=null),e.next=null),e}class Jl{constructor(){this.h=this.g=null}add(e,n){const s=Go.get();s.set(e,n),this.h?this.h.next=s:this.g=s,this.h=s}}var Go=new Yl(()=>new Zl,t=>t.reset());class Zl{constructor(){this.next=this.g=this.h=null}set(e,n){this.h=e,this.g=n,this.next=null}reset(){this.next=this.g=this.h=null}}function eh(t){var e=1;t=t.split(":");const n=[];for(;0<e&&t.length;)n.push(t.shift()),e--;return t.length&&n.push(t.join(":")),n}function th(t){I.setTimeout(()=>{throw t},0)}let Pt,Ft=!1,Ar=new Jl,Qo=()=>{const t=I.Promise.resolve(void 0);Pt=()=>{t.then(nh)}};var nh=()=>{for(var t;t=Xl();){try{t.h.call(t.g)}catch(n){th(n)}var e=Go;e.j(t),100>e.h&&(e.h++,t.next=e.g,e.g=t)}Ft=!1};function Wn(t,e){z.call(this),this.h=t||1,this.g=e||I,this.j=Z(this.qb,this),this.l=Date.now()}K(Wn,z);m=Wn.prototype;m.ga=!1;m.T=null;m.qb=function(){if(this.ga){var t=Date.now()-this.l;0<t&&t<.8*this.h?this.T=this.g.setTimeout(this.j,this.h-t):(this.T&&(this.g.clearTimeout(this.T),this.T=null),Q(this,"tick"),this.ga&&(Dr(this),this.start()))}};m.start=function(){this.ga=!0,this.T||(this.T=this.g.setTimeout(this.j,this.h),this.l=Date.now())};function Dr(t){t.ga=!1,t.T&&(t.g.clearTimeout(t.T),t.T=null)}m.N=function(){Wn.$.N.call(this),Dr(this),delete this.g};function _r(t,e,n){if(typeof t=="function")n&&(t=Z(t,n));else if(t&&typeof t.handleEvent=="function")t=Z(t.handleEvent,t);else throw Error("Invalid listener argument");return 2147483647<Number(e)?-1:I.setTimeout(t,e||0)}function Wo(t){t.g=_r(()=>{t.g=null,t.i&&(t.i=!1,Wo(t))},t.j);const e=t.h;t.h=null,t.m.apply(null,e)}class sh extends Oe{constructor(e,n){super(),this.m=e,this.j=n,this.h=null,this.i=!1,this.g=null}l(e){this.h=arguments,this.g?this.i=!0:Wo(this)}N(){super.N(),this.g&&(I.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Vt(t){Oe.call(this),this.h=t,this.g={}}K(Vt,Oe);var xi=[];function Yo(t,e,n,s){Array.isArray(n)||(n&&(xi[0]=n.toString()),n=xi);for(var r=0;r<n.length;r++){var i=qo(e,n[r],s||t.handleEvent,!1,t.h||t);if(!i)break;t.g[i.key]=i}}function Xo(t){Er(t.g,function(e,n){this.g.hasOwnProperty(n)&&Ir(e)},t),t.g={}}Vt.prototype.N=function(){Vt.$.N.call(this),Xo(this)};Vt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};function Yn(){this.g=!0}Yn.prototype.Ea=function(){this.g=!1};function rh(t,e,n,s,r,i){t.info(function(){if(t.g)if(i)for(var o="",a=i.split("&"),u=0;u<a.length;u++){var c=a[u].split("=");if(1<c.length){var l=c[0];c=c[1];var h=l.split("_");o=2<=h.length&&h[1]=="type"?o+(l+"="+c+"&"):o+(l+"=redacted&")}}else o=null;else o=i;return"XMLHTTP REQ ("+s+") [attempt "+r+"]: "+e+`
`+n+`
`+o})}function ih(t,e,n,s,r,i,o){t.info(function(){return"XMLHTTP RESP ("+s+") [ attempt "+r+"]: "+e+`
`+n+`
`+i+" "+o})}function et(t,e,n,s){t.info(function(){return"XMLHTTP TEXT ("+e+"): "+ah(t,n)+(s?" "+s:"")})}function oh(t,e){t.info(function(){return"TIMEOUT: "+e})}Yn.prototype.info=function(){};function ah(t,e){if(!t.g)return e;if(!e)return null;try{var n=JSON.parse(e);if(n){for(t=0;t<n.length;t++)if(Array.isArray(n[t])){var s=n[t];if(!(2>s.length)){var r=s[1];if(Array.isArray(r)&&!(1>r.length)){var i=r[0];if(i!="noop"&&i!="stop"&&i!="close")for(var o=1;o<r.length;o++)r[o]=""}}}}return Cr(n)}catch{return e}}var He={},Mi=null;function Xn(){return Mi=Mi||new z}He.Ta="serverreachability";function Jo(t){ee.call(this,He.Ta,t)}K(Jo,ee);function $t(t){const e=Xn();Q(e,new Jo(e))}He.STAT_EVENT="statevent";function Zo(t,e){ee.call(this,He.STAT_EVENT,t),this.stat=e}K(Zo,ee);function se(t){const e=Xn();Q(e,new Zo(e,t))}He.Ua="timingevent";function ea(t,e){ee.call(this,He.Ua,t),this.size=e}K(ea,ee);function Qt(t,e){if(typeof t!="function")throw Error("Fn must not be null and must be a function");return I.setTimeout(function(){t()},e)}var Jn={NO_ERROR:0,rb:1,Eb:2,Db:3,yb:4,Cb:5,Fb:6,Qa:7,TIMEOUT:8,Ib:9},ta={wb:"complete",Sb:"success",Ra:"error",Qa:"abort",Kb:"ready",Lb:"readystatechange",TIMEOUT:"timeout",Gb:"incrementaldata",Jb:"progress",zb:"downloadprogress",$b:"uploadprogress"};function br(){}br.prototype.h=null;function Oi(t){return t.h||(t.h=t.i())}function na(){}var Wt={OPEN:"a",vb:"b",Ra:"c",Hb:"d"};function Nr(){ee.call(this,"d")}K(Nr,ee);function kr(){ee.call(this,"c")}K(kr,ee);var Ys;function Zn(){}K(Zn,br);Zn.prototype.g=function(){return new XMLHttpRequest};Zn.prototype.i=function(){return{}};Ys=new Zn;function Yt(t,e,n,s){this.l=t,this.j=e,this.m=n,this.W=s||1,this.U=new Vt(this),this.P=uh,t=Ks?125:void 0,this.V=new Wn(t),this.I=null,this.i=!1,this.s=this.A=this.v=this.L=this.G=this.Y=this.B=null,this.F=[],this.g=null,this.C=0,this.o=this.u=null,this.ca=-1,this.J=!1,this.O=0,this.M=null,this.ba=this.K=this.aa=this.S=!1,this.h=new sa}function sa(){this.i=null,this.g="",this.h=!1}var uh=45e3,Xs={},_n={};m=Yt.prototype;m.setTimeout=function(t){this.P=t};function Js(t,e,n){t.L=1,t.v=ts(Se(e)),t.s=n,t.S=!0,ra(t,null)}function ra(t,e){t.G=Date.now(),Xt(t),t.A=Se(t.v);var n=t.A,s=t.W;Array.isArray(s)||(s=[String(s)]),fa(n.i,"t",s),t.C=0,n=t.l.J,t.h=new sa,t.g=Ma(t.l,n?e:null,!t.s),0<t.O&&(t.M=new sh(Z(t.Pa,t,t.g),t.O)),Yo(t.U,t.g,"readystatechange",t.nb),e=t.I?Bo(t.I):{},t.s?(t.u||(t.u="POST"),e["Content-Type"]="application/x-www-form-urlencoded",t.g.ha(t.A,t.u,t.s,e)):(t.u="GET",t.g.ha(t.A,t.u,null,e)),$t(),rh(t.j,t.u,t.A,t.m,t.W,t.s)}m.nb=function(t){t=t.target;const e=this.M;e&&me(t)==3?e.l():this.Pa(t)};m.Pa=function(t){try{if(t==this.g)e:{const l=me(this.g);var e=this.g.Ia();const h=this.g.da();if(!(3>l)&&(l!=3||Ks||this.g&&(this.h.h||this.g.ja()||Vi(this.g)))){this.J||l!=4||e==7||(e==8||0>=h?$t(3):$t(2)),es(this);var n=this.g.da();this.ca=n;t:if(ia(this)){var s=Vi(this.g);t="";var r=s.length,i=me(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Ve(this),_t(this);var o="";break t}this.h.i=new I.TextDecoder}for(e=0;e<r;e++)this.h.h=!0,t+=this.h.i.decode(s[e],{stream:i&&e==r-1});s.splice(0,r),this.h.g+=t,this.C=0,o=this.h.g}else o=this.g.ja();if(this.i=n==200,ih(this.j,this.u,this.A,this.m,this.W,l,n),this.i){if(this.aa&&!this.K){t:{if(this.g){var a,u=this.g;if((a=u.g?u.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!Ot(a)){var c=a;break t}}c=null}if(n=c)et(this.j,this.m,n,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Zs(this,n);else{this.i=!1,this.o=3,se(12),Ve(this),_t(this);break e}}this.S?(oa(this,l,o),Ks&&this.i&&l==3&&(Yo(this.U,this.V,"tick",this.mb),this.V.start())):(et(this.j,this.m,o,null),Zs(this,o)),l==4&&Ve(this),this.i&&!this.J&&(l==4?Na(this.l,this):(this.i=!1,Xt(this)))}else Nh(this.g),n==400&&0<o.indexOf("Unknown SID")?(this.o=3,se(12)):(this.o=0,se(13)),Ve(this),_t(this)}}}catch{}finally{}};function ia(t){return t.g?t.u=="GET"&&t.L!=2&&t.l.Ha:!1}function oa(t,e,n){let s=!0,r;for(;!t.J&&t.C<n.length;)if(r=ch(t,n),r==_n){e==4&&(t.o=4,se(14),s=!1),et(t.j,t.m,null,"[Incomplete Response]");break}else if(r==Xs){t.o=4,se(15),et(t.j,t.m,n,"[Invalid Chunk]"),s=!1;break}else et(t.j,t.m,r,null),Zs(t,r);ia(t)&&r!=_n&&r!=Xs&&(t.h.g="",t.C=0),e!=4||n.length!=0||t.h.h||(t.o=1,se(16),s=!1),t.i=t.i&&s,s?0<n.length&&!t.ba&&(t.ba=!0,e=t.l,e.g==t&&e.ca&&!e.M&&(e.l.info("Great, no buffering proxy detected. Bytes received: "+n.length),Pr(e),e.M=!0,se(11))):(et(t.j,t.m,n,"[Invalid Chunked Response]"),Ve(t),_t(t))}m.mb=function(){if(this.g){var t=me(this.g),e=this.g.ja();this.C<e.length&&(es(this),oa(this,t,e),this.i&&t!=4&&Xt(this))}};function ch(t,e){var n=t.C,s=e.indexOf(`
`,n);return s==-1?_n:(n=Number(e.substring(n,s)),isNaN(n)?Xs:(s+=1,s+n>e.length?_n:(e=e.slice(s,s+n),t.C=s+n,e)))}m.cancel=function(){this.J=!0,Ve(this)};function Xt(t){t.Y=Date.now()+t.P,aa(t,t.P)}function aa(t,e){if(t.B!=null)throw Error("WatchDog timer not null");t.B=Qt(Z(t.lb,t),e)}function es(t){t.B&&(I.clearTimeout(t.B),t.B=null)}m.lb=function(){this.B=null;const t=Date.now();0<=t-this.Y?(oh(this.j,this.A),this.L!=2&&($t(),se(17)),Ve(this),this.o=2,_t(this)):aa(this,this.Y-t)};function _t(t){t.l.H==0||t.J||Na(t.l,t)}function Ve(t){es(t);var e=t.M;e&&typeof e.sa=="function"&&e.sa(),t.M=null,Dr(t.V),Xo(t.U),t.g&&(e=t.g,t.g=null,e.abort(),e.sa())}function Zs(t,e){try{var n=t.l;if(n.H!=0&&(n.g==t||er(n.i,t))){if(!t.K&&er(n.i,t)&&n.H==3){try{var s=n.Ja.g.parse(e)}catch{s=null}if(Array.isArray(s)&&s.length==3){var r=s;if(r[0]==0){e:if(!n.u){if(n.g)if(n.g.G+3e3<t.G)kn(n),rs(n);else break e;Lr(n),se(18)}}else n.Fa=r[1],0<n.Fa-n.V&&37500>r[2]&&n.G&&n.A==0&&!n.v&&(n.v=Qt(Z(n.ib,n),6e3));if(1>=pa(n.i)&&n.oa){try{n.oa()}catch{}n.oa=void 0}}else $e(n,11)}else if((t.K||n.g==t)&&kn(n),!Ot(e))for(r=n.Ja.g.parse(e),e=0;e<r.length;e++){let c=r[e];if(n.V=c[0],c=c[1],n.H==2)if(c[0]=="c"){n.K=c[1],n.pa=c[2];const l=c[3];l!=null&&(n.ra=l,n.l.info("VER="+n.ra));const h=c[4];h!=null&&(n.Ga=h,n.l.info("SVER="+n.Ga));const d=c[5];d!=null&&typeof d=="number"&&0<d&&(s=1.5*d,n.L=s,n.l.info("backChannelRequestTimeoutMs_="+s)),s=n;const p=t.g;if(p){const E=p.g?p.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(E){var i=s.i;i.g||E.indexOf("spdy")==-1&&E.indexOf("quic")==-1&&E.indexOf("h2")==-1||(i.j=i.l,i.g=new Set,i.h&&(Rr(i,i.h),i.h=null))}if(s.F){const D=p.g?p.g.getResponseHeader("X-HTTP-Session-Id"):null;D&&(s.Da=D,x(s.I,s.F,D))}}n.H=3,n.h&&n.h.Ba(),n.ca&&(n.S=Date.now()-t.G,n.l.info("Handshake RTT: "+n.S+"ms")),s=n;var o=t;if(s.wa=xa(s,s.J?s.pa:null,s.Y),o.K){ma(s.i,o);var a=o,u=s.L;u&&a.setTimeout(u),a.B&&(es(a),Xt(a)),s.g=o}else _a(s);0<n.j.length&&is(n)}else c[0]!="stop"&&c[0]!="close"||$e(n,7);else n.H==3&&(c[0]=="stop"||c[0]=="close"?c[0]=="stop"?$e(n,7):Or(n):c[0]!="noop"&&n.h&&n.h.Aa(c),n.A=0)}}$t(4)}catch{}}function lh(t){if(t.Z&&typeof t.Z=="function")return t.Z();if(typeof Map<"u"&&t instanceof Map||typeof Set<"u"&&t instanceof Set)return Array.from(t.values());if(typeof t=="string")return t.split("");if(qn(t)){for(var e=[],n=t.length,s=0;s<n;s++)e.push(t[s]);return e}e=[],n=0;for(s in t)e[n++]=t[s];return e}function hh(t){if(t.ta&&typeof t.ta=="function")return t.ta();if(!t.Z||typeof t.Z!="function"){if(typeof Map<"u"&&t instanceof Map)return Array.from(t.keys());if(!(typeof Set<"u"&&t instanceof Set)){if(qn(t)||typeof t=="string"){var e=[];t=t.length;for(var n=0;n<t;n++)e.push(n);return e}e=[],n=0;for(const s in t)e[n++]=s;return e}}}function ua(t,e){if(t.forEach&&typeof t.forEach=="function")t.forEach(e,void 0);else if(qn(t)||typeof t=="string")Array.prototype.forEach.call(t,e,void 0);else for(var n=hh(t),s=lh(t),r=s.length,i=0;i<r;i++)e.call(void 0,s[i],n&&n[i],t)}var ca=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function fh(t,e){if(t){t=t.split("&");for(var n=0;n<t.length;n++){var s=t[n].indexOf("="),r=null;if(0<=s){var i=t[n].substring(0,s);r=t[n].substring(s+1)}else i=t[n];e(i,r?decodeURIComponent(r.replace(/\+/g," ")):"")}}}function Be(t){if(this.g=this.s=this.j="",this.m=null,this.o=this.l="",this.h=!1,t instanceof Be){this.h=t.h,bn(this,t.j),this.s=t.s,this.g=t.g,Nn(this,t.m),this.l=t.l;var e=t.i,n=new Ut;n.i=e.i,e.g&&(n.g=new Map(e.g),n.h=e.h),Li(this,n),this.o=t.o}else t&&(e=String(t).match(ca))?(this.h=!1,bn(this,e[1]||"",!0),this.s=It(e[2]||""),this.g=It(e[3]||"",!0),Nn(this,e[4]),this.l=It(e[5]||"",!0),Li(this,e[6]||"",!0),this.o=It(e[7]||"")):(this.h=!1,this.i=new Ut(null,this.h))}Be.prototype.toString=function(){var t=[],e=this.j;e&&t.push(St(e,Pi,!0),":");var n=this.g;return(n||e=="file")&&(t.push("//"),(e=this.s)&&t.push(St(e,Pi,!0),"@"),t.push(encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),n=this.m,n!=null&&t.push(":",String(n))),(n=this.l)&&(this.g&&n.charAt(0)!="/"&&t.push("/"),t.push(St(n,n.charAt(0)=="/"?ph:gh,!0))),(n=this.i.toString())&&t.push("?",n),(n=this.o)&&t.push("#",St(n,yh)),t.join("")};function Se(t){return new Be(t)}function bn(t,e,n){t.j=n?It(e,!0):e,t.j&&(t.j=t.j.replace(/:$/,""))}function Nn(t,e){if(e){if(e=Number(e),isNaN(e)||0>e)throw Error("Bad port number "+e);t.m=e}else t.m=null}function Li(t,e,n){e instanceof Ut?(t.i=e,vh(t.i,t.h)):(n||(e=St(e,mh)),t.i=new Ut(e,t.h))}function x(t,e,n){t.i.set(e,n)}function ts(t){return x(t,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),t}function It(t,e){return t?e?decodeURI(t.replace(/%25/g,"%2525")):decodeURIComponent(t):""}function St(t,e,n){return typeof t=="string"?(t=encodeURI(t).replace(e,dh),n&&(t=t.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),t):null}function dh(t){return t=t.charCodeAt(0),"%"+(t>>4&15).toString(16)+(t&15).toString(16)}var Pi=/[#\/\?@]/g,gh=/[#\?:]/g,ph=/[#\?]/g,mh=/[#\?@]/g,yh=/#/g;function Ut(t,e){this.h=this.g=null,this.i=t||null,this.j=!!e}function Le(t){t.g||(t.g=new Map,t.h=0,t.i&&fh(t.i,function(e,n){t.add(decodeURIComponent(e.replace(/\+/g," ")),n)}))}m=Ut.prototype;m.add=function(t,e){Le(this),this.i=null,t=pt(this,t);var n=this.g.get(t);return n||this.g.set(t,n=[]),n.push(e),this.h+=1,this};function la(t,e){Le(t),e=pt(t,e),t.g.has(e)&&(t.i=null,t.h-=t.g.get(e).length,t.g.delete(e))}function ha(t,e){return Le(t),e=pt(t,e),t.g.has(e)}m.forEach=function(t,e){Le(this),this.g.forEach(function(n,s){n.forEach(function(r){t.call(e,r,s,this)},this)},this)};m.ta=function(){Le(this);const t=Array.from(this.g.values()),e=Array.from(this.g.keys()),n=[];for(let s=0;s<e.length;s++){const r=t[s];for(let i=0;i<r.length;i++)n.push(e[s])}return n};m.Z=function(t){Le(this);let e=[];if(typeof t=="string")ha(this,t)&&(e=e.concat(this.g.get(pt(this,t))));else{t=Array.from(this.g.values());for(let n=0;n<t.length;n++)e=e.concat(t[n])}return e};m.set=function(t,e){return Le(this),this.i=null,t=pt(this,t),ha(this,t)&&(this.h-=this.g.get(t).length),this.g.set(t,[e]),this.h+=1,this};m.get=function(t,e){return t?(t=this.Z(t),0<t.length?String(t[0]):e):e};function fa(t,e,n){la(t,e),0<n.length&&(t.i=null,t.g.set(pt(t,e),vr(n)),t.h+=n.length)}m.toString=function(){if(this.i)return this.i;if(!this.g)return"";const t=[],e=Array.from(this.g.keys());for(var n=0;n<e.length;n++){var s=e[n];const i=encodeURIComponent(String(s)),o=this.Z(s);for(s=0;s<o.length;s++){var r=i;o[s]!==""&&(r+="="+encodeURIComponent(String(o[s]))),t.push(r)}}return this.i=t.join("&")};function pt(t,e){return e=String(e),t.j&&(e=e.toLowerCase()),e}function vh(t,e){e&&!t.j&&(Le(t),t.i=null,t.g.forEach(function(n,s){var r=s.toLowerCase();s!=r&&(la(this,s),fa(this,r,n))},t)),t.j=e}var wh=class{constructor(t,e){this.g=t,this.map=e}};function da(t){this.l=t||Eh,I.PerformanceNavigationTiming?(t=I.performance.getEntriesByType("navigation"),t=0<t.length&&(t[0].nextHopProtocol=="hq"||t[0].nextHopProtocol=="h2")):t=!!(I.g&&I.g.Ka&&I.g.Ka()&&I.g.Ka().ec),this.j=t?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}var Eh=10;function ga(t){return t.h?!0:t.g?t.g.size>=t.j:!1}function pa(t){return t.h?1:t.g?t.g.size:0}function er(t,e){return t.h?t.h==e:t.g?t.g.has(e):!1}function Rr(t,e){t.g?t.g.add(e):t.h=e}function ma(t,e){t.h&&t.h==e?t.h=null:t.g&&t.g.has(e)&&t.g.delete(e)}da.prototype.cancel=function(){if(this.i=ya(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const t of this.g.values())t.cancel();this.g.clear()}};function ya(t){if(t.h!=null)return t.i.concat(t.h.F);if(t.g!=null&&t.g.size!==0){let e=t.i;for(const n of t.g.values())e=e.concat(n.F);return e}return vr(t.i)}var Th=class{stringify(t){return I.JSON.stringify(t,void 0)}parse(t){return I.JSON.parse(t,void 0)}};function Ih(){this.g=new Th}function Sh(t,e,n){const s=n||"";try{ua(t,function(r,i){let o=r;zn(r)&&(o=Cr(r)),e.push(s+i+"="+encodeURIComponent(o))})}catch(r){throw e.push(s+"type="+encodeURIComponent("_badmap")),r}}function Ch(t,e){const n=new Yn;if(I.Image){const s=new Image;s.onload=hn(dn,n,s,"TestLoadImage: loaded",!0,e),s.onerror=hn(dn,n,s,"TestLoadImage: error",!1,e),s.onabort=hn(dn,n,s,"TestLoadImage: abort",!1,e),s.ontimeout=hn(dn,n,s,"TestLoadImage: timeout",!1,e),I.setTimeout(function(){s.ontimeout&&s.ontimeout()},1e4),s.src=t}else e(!1)}function dn(t,e,n,s,r){try{e.onload=null,e.onerror=null,e.onabort=null,e.ontimeout=null,r(s)}catch{}}function Jt(t){this.l=t.fc||null,this.j=t.ob||!1}K(Jt,br);Jt.prototype.g=function(){return new ns(this.l,this.j)};Jt.prototype.i=(function(t){return function(){return t}})({});function ns(t,e){z.call(this),this.F=t,this.u=e,this.m=void 0,this.readyState=xr,this.status=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.v=new Headers,this.h=null,this.C="GET",this.B="",this.g=!1,this.A=this.j=this.l=null}K(ns,z);var xr=0;m=ns.prototype;m.open=function(t,e){if(this.readyState!=xr)throw this.abort(),Error("Error reopening a connection");this.C=t,this.B=e,this.readyState=1,Bt(this)};m.send=function(t){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const e={headers:this.v,method:this.C,credentials:this.m,cache:void 0};t&&(e.body=t),(this.F||I).fetch(new Request(this.B,e)).then(this.$a.bind(this),this.ka.bind(this))};m.abort=function(){this.response=this.responseText="",this.v=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Zt(this)),this.readyState=xr};m.$a=function(t){if(this.g&&(this.l=t,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=t.headers,this.readyState=2,Bt(this)),this.g&&(this.readyState=3,Bt(this),this.g)))if(this.responseType==="arraybuffer")t.arrayBuffer().then(this.Ya.bind(this),this.ka.bind(this));else if(typeof I.ReadableStream<"u"&&"body"in t){if(this.j=t.body.getReader(),this.u){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.A=new TextDecoder;va(this)}else t.text().then(this.Za.bind(this),this.ka.bind(this))};function va(t){t.j.read().then(t.Xa.bind(t)).catch(t.ka.bind(t))}m.Xa=function(t){if(this.g){if(this.u&&t.value)this.response.push(t.value);else if(!this.u){var e=t.value?t.value:new Uint8Array(0);(e=this.A.decode(e,{stream:!t.done}))&&(this.response=this.responseText+=e)}t.done?Zt(this):Bt(this),this.readyState==3&&va(this)}};m.Za=function(t){this.g&&(this.response=this.responseText=t,Zt(this))};m.Ya=function(t){this.g&&(this.response=t,Zt(this))};m.ka=function(){this.g&&Zt(this)};function Zt(t){t.readyState=4,t.l=null,t.j=null,t.A=null,Bt(t)}m.setRequestHeader=function(t,e){this.v.append(t,e)};m.getResponseHeader=function(t){return this.h&&this.h.get(t.toLowerCase())||""};m.getAllResponseHeaders=function(){if(!this.h)return"";const t=[],e=this.h.entries();for(var n=e.next();!n.done;)n=n.value,t.push(n[0]+": "+n[1]),n=e.next();return t.join(`\r
`)};function Bt(t){t.onreadystatechange&&t.onreadystatechange.call(t)}Object.defineProperty(ns.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(t){this.m=t?"include":"same-origin"}});var Ah=I.JSON.parse;function P(t){z.call(this),this.headers=new Map,this.u=t||null,this.h=!1,this.C=this.g=null,this.I="",this.m=0,this.j="",this.l=this.G=this.v=this.F=!1,this.B=0,this.A=null,this.K=wa,this.L=this.M=!1}K(P,z);var wa="",Dh=/^https?$/i,_h=["POST","PUT"];m=P.prototype;m.Oa=function(t){this.M=t};m.ha=function(t,e,n,s){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.I+"; newUri="+t);e=e?e.toUpperCase():"GET",this.I=t,this.j="",this.m=0,this.F=!1,this.h=!0,this.g=this.u?this.u.g():Ys.g(),this.C=this.u?Oi(this.u):Oi(Ys),this.g.onreadystatechange=Z(this.La,this);try{this.G=!0,this.g.open(e,String(t),!0),this.G=!1}catch(i){Fi(this,i);return}if(t=n||"",n=new Map(this.headers),s)if(Object.getPrototypeOf(s)===Object.prototype)for(var r in s)n.set(r,s[r]);else if(typeof s.keys=="function"&&typeof s.get=="function")for(const i of s.keys())n.set(i,s.get(i));else throw Error("Unknown input type for opt_headers: "+String(s));s=Array.from(n.keys()).find(i=>i.toLowerCase()=="content-type"),r=I.FormData&&t instanceof I.FormData,!(0<=Fo(_h,e))||s||r||n.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[i,o]of n)this.g.setRequestHeader(i,o);this.K&&(this.g.responseType=this.K),"withCredentials"in this.g&&this.g.withCredentials!==this.M&&(this.g.withCredentials=this.M);try{Ia(this),0<this.B&&((this.L=bh(this.g))?(this.g.timeout=this.B,this.g.ontimeout=Z(this.ua,this)):this.A=_r(this.ua,this.B,this)),this.v=!0,this.g.send(t),this.v=!1}catch(i){Fi(this,i)}};function bh(t){return ot&&typeof t.timeout=="number"&&t.ontimeout!==void 0}m.ua=function(){typeof yr<"u"&&this.g&&(this.j="Timed out after "+this.B+"ms, aborting",this.m=8,Q(this,"timeout"),this.abort(8))};function Fi(t,e){t.h=!1,t.g&&(t.l=!0,t.g.abort(),t.l=!1),t.j=e,t.m=5,Ea(t),ss(t)}function Ea(t){t.F||(t.F=!0,Q(t,"complete"),Q(t,"error"))}m.abort=function(t){this.g&&this.h&&(this.h=!1,this.l=!0,this.g.abort(),this.l=!1,this.m=t||7,Q(this,"complete"),Q(this,"abort"),ss(this))};m.N=function(){this.g&&(this.h&&(this.h=!1,this.l=!0,this.g.abort(),this.l=!1),ss(this,!0)),P.$.N.call(this)};m.La=function(){this.s||(this.G||this.v||this.l?Ta(this):this.kb())};m.kb=function(){Ta(this)};function Ta(t){if(t.h&&typeof yr<"u"&&(!t.C[1]||me(t)!=4||t.da()!=2)){if(t.v&&me(t)==4)_r(t.La,0,t);else if(Q(t,"readystatechange"),me(t)==4){t.h=!1;try{const o=t.da();e:switch(o){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var e=!0;break e;default:e=!1}var n;if(!(n=e)){var s;if(s=o===0){var r=String(t.I).match(ca)[1]||null;!r&&I.self&&I.self.location&&(r=I.self.location.protocol.slice(0,-1)),s=!Dh.test(r?r.toLowerCase():"")}n=s}if(n)Q(t,"complete"),Q(t,"success");else{t.m=6;try{var i=2<me(t)?t.g.statusText:""}catch{i=""}t.j=i+" ["+t.da()+"]",Ea(t)}}finally{ss(t)}}}}function ss(t,e){if(t.g){Ia(t);const n=t.g,s=t.C[0]?()=>{}:null;t.g=null,t.C=null,e||Q(t,"ready");try{n.onreadystatechange=s}catch{}}}function Ia(t){t.g&&t.L&&(t.g.ontimeout=null),t.A&&(I.clearTimeout(t.A),t.A=null)}m.isActive=function(){return!!this.g};function me(t){return t.g?t.g.readyState:0}m.da=function(){try{return 2<me(this)?this.g.status:-1}catch{return-1}};m.ja=function(){try{return this.g?this.g.responseText:""}catch{return""}};m.Wa=function(t){if(this.g){var e=this.g.responseText;return t&&e.indexOf(t)==0&&(e=e.substring(t.length)),Ah(e)}};function Vi(t){try{if(!t.g)return null;if("response"in t.g)return t.g.response;switch(t.K){case wa:case"text":return t.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in t.g)return t.g.mozResponseArrayBuffer}return null}catch{return null}}function Nh(t){const e={};t=(t.g&&2<=me(t)&&t.g.getAllResponseHeaders()||"").split(`\r
`);for(let s=0;s<t.length;s++){if(Ot(t[s]))continue;var n=eh(t[s]);const r=n[0];if(n=n[1],typeof n!="string")continue;n=n.trim();const i=e[r]||[];e[r]=i,i.push(n)}Hl(e,function(s){return s.join(", ")})}m.Ia=function(){return this.m};m.Sa=function(){return typeof this.j=="string"?this.j:String(this.j)};function Sa(t){let e="";return Er(t,function(n,s){e+=s,e+=":",e+=n,e+=`\r
`}),e}function Mr(t,e,n){e:{for(s in n){var s=!1;break e}s=!0}s||(n=Sa(n),typeof t=="string"?n!=null&&encodeURIComponent(String(n)):x(t,e,n))}function Et(t,e,n){return n&&n.internalChannelParams&&n.internalChannelParams[t]||e}function Ca(t){this.Ga=0,this.j=[],this.l=new Yn,this.pa=this.wa=this.I=this.Y=this.g=this.Da=this.F=this.na=this.o=this.U=this.s=null,this.fb=this.W=0,this.cb=Et("failFast",!1,t),this.G=this.v=this.u=this.m=this.h=null,this.aa=!0,this.Fa=this.V=-1,this.ba=this.A=this.C=0,this.ab=Et("baseRetryDelayMs",5e3,t),this.hb=Et("retryDelaySeedMs",1e4,t),this.eb=Et("forwardChannelMaxRetries",2,t),this.xa=Et("forwardChannelRequestTimeoutMs",2e4,t),this.va=t&&t.xmlHttpFactory||void 0,this.Ha=t&&t.dc||!1,this.L=void 0,this.J=t&&t.supportsCrossDomainXhr||!1,this.K="",this.i=new da(t&&t.concurrentRequestLimit),this.Ja=new Ih,this.P=t&&t.fastHandshake||!1,this.O=t&&t.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.bb=t&&t.bc||!1,t&&t.Ea&&this.l.Ea(),t&&t.forceLongPolling&&(this.aa=!1),this.ca=!this.P&&this.aa&&t&&t.detectBufferingProxy||!1,this.qa=void 0,t&&t.longPollingTimeout&&0<t.longPollingTimeout&&(this.qa=t.longPollingTimeout),this.oa=void 0,this.S=0,this.M=!1,this.ma=this.B=null}m=Ca.prototype;m.ra=8;m.H=1;function Or(t){if(Aa(t),t.H==3){var e=t.W++,n=Se(t.I);if(x(n,"SID",t.K),x(n,"RID",e),x(n,"TYPE","terminate"),en(t,n),e=new Yt(t,t.l,e),e.L=2,e.v=ts(Se(n)),n=!1,I.navigator&&I.navigator.sendBeacon)try{n=I.navigator.sendBeacon(e.v.toString(),"")}catch{}!n&&I.Image&&(new Image().src=e.v,n=!0),n||(e.g=Ma(e.l,null),e.g.ha(e.v)),e.G=Date.now(),Xt(e)}Ra(t)}function rs(t){t.g&&(Pr(t),t.g.cancel(),t.g=null)}function Aa(t){rs(t),t.u&&(I.clearTimeout(t.u),t.u=null),kn(t),t.i.cancel(),t.m&&(typeof t.m=="number"&&I.clearTimeout(t.m),t.m=null)}function is(t){if(!ga(t.i)&&!t.m){t.m=!0;var e=t.Na;Pt||Qo(),Ft||(Pt(),Ft=!0),Ar.add(e,t),t.C=0}}function kh(t,e){return pa(t.i)>=t.i.j-(t.m?1:0)?!1:t.m?(t.j=e.F.concat(t.j),!0):t.H==1||t.H==2||t.C>=(t.cb?0:t.eb)?!1:(t.m=Qt(Z(t.Na,t,e),ka(t,t.C)),t.C++,!0)}m.Na=function(t){if(this.m)if(this.m=null,this.H==1){if(!t){this.W=Math.floor(1e5*Math.random()),t=this.W++;const r=new Yt(this,this.l,t);let i=this.s;if(this.U&&(i?(i=Bo(i),jo(i,this.U)):i=this.U),this.o!==null||this.O||(r.I=i,i=null),this.P)e:{for(var e=0,n=0;n<this.j.length;n++){t:{var s=this.j[n];if("__data__"in s.map&&(s=s.map.__data__,typeof s=="string")){s=s.length;break t}s=void 0}if(s===void 0)break;if(e+=s,4096<e){e=n;break e}if(e===4096||n===this.j.length-1){e=n+1;break e}}e=1e3}else e=1e3;e=Da(this,r,e),n=Se(this.I),x(n,"RID",t),x(n,"CVER",22),this.F&&x(n,"X-HTTP-Session-Id",this.F),en(this,n),i&&(this.O?e="headers="+encodeURIComponent(String(Sa(i)))+"&"+e:this.o&&Mr(n,this.o,i)),Rr(this.i,r),this.bb&&x(n,"TYPE","init"),this.P?(x(n,"$req",e),x(n,"SID","null"),r.aa=!0,Js(r,n,null)):Js(r,n,e),this.H=2}}else this.H==3&&(t?$i(this,t):this.j.length==0||ga(this.i)||$i(this))};function $i(t,e){var n;e?n=e.m:n=t.W++;const s=Se(t.I);x(s,"SID",t.K),x(s,"RID",n),x(s,"AID",t.V),en(t,s),t.o&&t.s&&Mr(s,t.o,t.s),n=new Yt(t,t.l,n,t.C+1),t.o===null&&(n.I=t.s),e&&(t.j=e.F.concat(t.j)),e=Da(t,n,1e3),n.setTimeout(Math.round(.5*t.xa)+Math.round(.5*t.xa*Math.random())),Rr(t.i,n),Js(n,s,e)}function en(t,e){t.na&&Er(t.na,function(n,s){x(e,s,n)}),t.h&&ua({},function(n,s){x(e,s,n)})}function Da(t,e,n){n=Math.min(t.j.length,n);var s=t.h?Z(t.h.Va,t.h,t):null;e:{var r=t.j;let i=-1;for(;;){const o=["count="+n];i==-1?0<n?(i=r[0].g,o.push("ofs="+i)):i=0:o.push("ofs="+i);let a=!0;for(let u=0;u<n;u++){let c=r[u].g;const l=r[u].map;if(c-=i,0>c)i=Math.max(0,r[u].g-100),a=!1;else try{Sh(l,o,"req"+c+"_")}catch{s&&s(l)}}if(a){s=o.join("&");break e}}}return t=t.j.splice(0,n),e.F=t,s}function _a(t){if(!t.g&&!t.u){t.ba=1;var e=t.Ma;Pt||Qo(),Ft||(Pt(),Ft=!0),Ar.add(e,t),t.A=0}}function Lr(t){return t.g||t.u||3<=t.A?!1:(t.ba++,t.u=Qt(Z(t.Ma,t),ka(t,t.A)),t.A++,!0)}m.Ma=function(){if(this.u=null,ba(this),this.ca&&!(this.M||this.g==null||0>=this.S)){var t=2*this.S;this.l.info("BP detection timer enabled: "+t),this.B=Qt(Z(this.jb,this),t)}};m.jb=function(){this.B&&(this.B=null,this.l.info("BP detection timeout reached."),this.l.info("Buffering proxy detected and switch to long-polling!"),this.G=!1,this.M=!0,se(10),rs(this),ba(this))};function Pr(t){t.B!=null&&(I.clearTimeout(t.B),t.B=null)}function ba(t){t.g=new Yt(t,t.l,"rpc",t.ba),t.o===null&&(t.g.I=t.s),t.g.O=0;var e=Se(t.wa);x(e,"RID","rpc"),x(e,"SID",t.K),x(e,"AID",t.V),x(e,"CI",t.G?"0":"1"),!t.G&&t.qa&&x(e,"TO",t.qa),x(e,"TYPE","xmlhttp"),en(t,e),t.o&&t.s&&Mr(e,t.o,t.s),t.L&&t.g.setTimeout(t.L);var n=t.g;t=t.pa,n.L=1,n.v=ts(Se(e)),n.s=null,n.S=!0,ra(n,t)}m.ib=function(){this.v!=null&&(this.v=null,rs(this),Lr(this),se(19))};function kn(t){t.v!=null&&(I.clearTimeout(t.v),t.v=null)}function Na(t,e){var n=null;if(t.g==e){kn(t),Pr(t),t.g=null;var s=2}else if(er(t.i,e))n=e.F,ma(t.i,e),s=1;else return;if(t.H!=0){if(e.i)if(s==1){n=e.s?e.s.length:0,e=Date.now()-e.G;var r=t.C;s=Xn(),Q(s,new ea(s,n)),is(t)}else _a(t);else if(r=e.o,r==3||r==0&&0<e.ca||!(s==1&&kh(t,e)||s==2&&Lr(t)))switch(n&&0<n.length&&(e=t.i,e.i=e.i.concat(n)),r){case 1:$e(t,5);break;case 4:$e(t,10);break;case 3:$e(t,6);break;default:$e(t,2)}}}function ka(t,e){let n=t.ab+Math.floor(Math.random()*t.hb);return t.isActive()||(n*=2),n*e}function $e(t,e){if(t.l.info("Error code "+e),e==2){var n=null;t.h&&(n=null);var s=Z(t.pb,t);n||(n=new Be("//www.google.com/images/cleardot.gif"),I.location&&I.location.protocol=="http"||bn(n,"https"),ts(n)),Ch(n.toString(),s)}else se(2);t.H=0,t.h&&t.h.za(e),Ra(t),Aa(t)}m.pb=function(t){t?(this.l.info("Successfully pinged google.com"),se(2)):(this.l.info("Failed to ping google.com"),se(1))};function Ra(t){if(t.H=0,t.ma=[],t.h){const e=ya(t.i);(e.length!=0||t.j.length!=0)&&(Ni(t.ma,e),Ni(t.ma,t.j),t.i.i.length=0,vr(t.j),t.j.length=0),t.h.ya()}}function xa(t,e,n){var s=n instanceof Be?Se(n):new Be(n);if(s.g!="")e&&(s.g=e+"."+s.g),Nn(s,s.m);else{var r=I.location;s=r.protocol,e=e?e+"."+r.hostname:r.hostname,r=+r.port;var i=new Be(null);s&&bn(i,s),e&&(i.g=e),r&&Nn(i,r),n&&(i.l=n),s=i}return n=t.F,e=t.Da,n&&e&&x(s,n,e),x(s,"VER",t.ra),en(t,s),s}function Ma(t,e,n){if(e&&!t.J)throw Error("Can't create secondary domain capable XhrIo object.");return e=n&&t.Ha&&!t.va?new P(new Jt({ob:!0})):new P(t.va),e.Oa(t.J),e}m.isActive=function(){return!!this.h&&this.h.isActive(this)};function Oa(){}m=Oa.prototype;m.Ba=function(){};m.Aa=function(){};m.za=function(){};m.ya=function(){};m.isActive=function(){return!0};m.Va=function(){};function Rn(){if(ot&&!(10<=Number(jl)))throw Error("Environmental error: no available transport.")}Rn.prototype.g=function(t,e){return new ue(t,e)};function ue(t,e){z.call(this),this.g=new Ca(e),this.l=t,this.h=e&&e.messageUrlParams||null,t=e&&e.messageHeaders||null,e&&e.clientProtocolHeaderRequired&&(t?t["X-Client-Protocol"]="webchannel":t={"X-Client-Protocol":"webchannel"}),this.g.s=t,t=e&&e.initMessageHeaders||null,e&&e.messageContentType&&(t?t["X-WebChannel-Content-Type"]=e.messageContentType:t={"X-WebChannel-Content-Type":e.messageContentType}),e&&e.Ca&&(t?t["X-WebChannel-Client-Profile"]=e.Ca:t={"X-WebChannel-Client-Profile":e.Ca}),this.g.U=t,(t=e&&e.cc)&&!Ot(t)&&(this.g.o=t),this.A=e&&e.supportsCrossDomainXhr||!1,this.v=e&&e.sendRawJson||!1,(e=e&&e.httpSessionIdParam)&&!Ot(e)&&(this.g.F=e,t=this.h,t!==null&&e in t&&(t=this.h,e in t&&delete t[e])),this.j=new mt(this)}K(ue,z);ue.prototype.m=function(){this.g.h=this.j,this.A&&(this.g.J=!0);var t=this.g,e=this.l,n=this.h||void 0;se(0),t.Y=e,t.na=n||{},t.G=t.aa,t.I=xa(t,null,t.Y),is(t)};ue.prototype.close=function(){Or(this.g)};ue.prototype.u=function(t){var e=this.g;if(typeof t=="string"){var n={};n.__data__=t,t=n}else this.v&&(n={},n.__data__=Cr(t),t=n);e.j.push(new wh(e.fb++,t)),e.H==3&&is(e)};ue.prototype.N=function(){this.g.h=null,delete this.j,Or(this.g),delete this.g,ue.$.N.call(this)};function La(t){Nr.call(this),t.__headers__&&(this.headers=t.__headers__,this.statusCode=t.__status__,delete t.__headers__,delete t.__status__);var e=t.__sm__;if(e){e:{for(const n in e){t=n;break e}t=void 0}(this.i=t)&&(t=this.i,e=e!==null&&t in e?e[t]:void 0),this.data=e}else this.data=t}K(La,Nr);function Pa(){kr.call(this),this.status=1}K(Pa,kr);function mt(t){this.g=t}K(mt,Oa);mt.prototype.Ba=function(){Q(this.g,"a")};mt.prototype.Aa=function(t){Q(this.g,new La(t))};mt.prototype.za=function(t){Q(this.g,new Pa)};mt.prototype.ya=function(){Q(this.g,"b")};function Rh(){this.blockSize=-1}function he(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.m=Array(this.blockSize),this.i=this.h=0,this.reset()}K(he,Rh);he.prototype.reset=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.i=this.h=0};function Ms(t,e,n){n||(n=0);var s=Array(16);if(typeof e=="string")for(var r=0;16>r;++r)s[r]=e.charCodeAt(n++)|e.charCodeAt(n++)<<8|e.charCodeAt(n++)<<16|e.charCodeAt(n++)<<24;else for(r=0;16>r;++r)s[r]=e[n++]|e[n++]<<8|e[n++]<<16|e[n++]<<24;e=t.g[0],n=t.g[1],r=t.g[2];var i=t.g[3],o=e+(i^n&(r^i))+s[0]+3614090360&4294967295;e=n+(o<<7&4294967295|o>>>25),o=i+(r^e&(n^r))+s[1]+3905402710&4294967295,i=e+(o<<12&4294967295|o>>>20),o=r+(n^i&(e^n))+s[2]+606105819&4294967295,r=i+(o<<17&4294967295|o>>>15),o=n+(e^r&(i^e))+s[3]+3250441966&4294967295,n=r+(o<<22&4294967295|o>>>10),o=e+(i^n&(r^i))+s[4]+4118548399&4294967295,e=n+(o<<7&4294967295|o>>>25),o=i+(r^e&(n^r))+s[5]+1200080426&4294967295,i=e+(o<<12&4294967295|o>>>20),o=r+(n^i&(e^n))+s[6]+2821735955&4294967295,r=i+(o<<17&4294967295|o>>>15),o=n+(e^r&(i^e))+s[7]+4249261313&4294967295,n=r+(o<<22&4294967295|o>>>10),o=e+(i^n&(r^i))+s[8]+1770035416&4294967295,e=n+(o<<7&4294967295|o>>>25),o=i+(r^e&(n^r))+s[9]+2336552879&4294967295,i=e+(o<<12&4294967295|o>>>20),o=r+(n^i&(e^n))+s[10]+4294925233&4294967295,r=i+(o<<17&4294967295|o>>>15),o=n+(e^r&(i^e))+s[11]+2304563134&4294967295,n=r+(o<<22&4294967295|o>>>10),o=e+(i^n&(r^i))+s[12]+1804603682&4294967295,e=n+(o<<7&4294967295|o>>>25),o=i+(r^e&(n^r))+s[13]+4254626195&4294967295,i=e+(o<<12&4294967295|o>>>20),o=r+(n^i&(e^n))+s[14]+2792965006&4294967295,r=i+(o<<17&4294967295|o>>>15),o=n+(e^r&(i^e))+s[15]+1236535329&4294967295,n=r+(o<<22&4294967295|o>>>10),o=e+(r^i&(n^r))+s[1]+4129170786&4294967295,e=n+(o<<5&4294967295|o>>>27),o=i+(n^r&(e^n))+s[6]+3225465664&4294967295,i=e+(o<<9&4294967295|o>>>23),o=r+(e^n&(i^e))+s[11]+643717713&4294967295,r=i+(o<<14&4294967295|o>>>18),o=n+(i^e&(r^i))+s[0]+3921069994&4294967295,n=r+(o<<20&4294967295|o>>>12),o=e+(r^i&(n^r))+s[5]+3593408605&4294967295,e=n+(o<<5&4294967295|o>>>27),o=i+(n^r&(e^n))+s[10]+38016083&4294967295,i=e+(o<<9&4294967295|o>>>23),o=r+(e^n&(i^e))+s[15]+3634488961&4294967295,r=i+(o<<14&4294967295|o>>>18),o=n+(i^e&(r^i))+s[4]+3889429448&4294967295,n=r+(o<<20&4294967295|o>>>12),o=e+(r^i&(n^r))+s[9]+568446438&4294967295,e=n+(o<<5&4294967295|o>>>27),o=i+(n^r&(e^n))+s[14]+3275163606&4294967295,i=e+(o<<9&4294967295|o>>>23),o=r+(e^n&(i^e))+s[3]+4107603335&4294967295,r=i+(o<<14&4294967295|o>>>18),o=n+(i^e&(r^i))+s[8]+1163531501&4294967295,n=r+(o<<20&4294967295|o>>>12),o=e+(r^i&(n^r))+s[13]+2850285829&4294967295,e=n+(o<<5&4294967295|o>>>27),o=i+(n^r&(e^n))+s[2]+4243563512&4294967295,i=e+(o<<9&4294967295|o>>>23),o=r+(e^n&(i^e))+s[7]+1735328473&4294967295,r=i+(o<<14&4294967295|o>>>18),o=n+(i^e&(r^i))+s[12]+2368359562&4294967295,n=r+(o<<20&4294967295|o>>>12),o=e+(n^r^i)+s[5]+4294588738&4294967295,e=n+(o<<4&4294967295|o>>>28),o=i+(e^n^r)+s[8]+2272392833&4294967295,i=e+(o<<11&4294967295|o>>>21),o=r+(i^e^n)+s[11]+1839030562&4294967295,r=i+(o<<16&4294967295|o>>>16),o=n+(r^i^e)+s[14]+4259657740&4294967295,n=r+(o<<23&4294967295|o>>>9),o=e+(n^r^i)+s[1]+2763975236&4294967295,e=n+(o<<4&4294967295|o>>>28),o=i+(e^n^r)+s[4]+1272893353&4294967295,i=e+(o<<11&4294967295|o>>>21),o=r+(i^e^n)+s[7]+4139469664&4294967295,r=i+(o<<16&4294967295|o>>>16),o=n+(r^i^e)+s[10]+3200236656&4294967295,n=r+(o<<23&4294967295|o>>>9),o=e+(n^r^i)+s[13]+681279174&4294967295,e=n+(o<<4&4294967295|o>>>28),o=i+(e^n^r)+s[0]+3936430074&4294967295,i=e+(o<<11&4294967295|o>>>21),o=r+(i^e^n)+s[3]+3572445317&4294967295,r=i+(o<<16&4294967295|o>>>16),o=n+(r^i^e)+s[6]+76029189&4294967295,n=r+(o<<23&4294967295|o>>>9),o=e+(n^r^i)+s[9]+3654602809&4294967295,e=n+(o<<4&4294967295|o>>>28),o=i+(e^n^r)+s[12]+3873151461&4294967295,i=e+(o<<11&4294967295|o>>>21),o=r+(i^e^n)+s[15]+530742520&4294967295,r=i+(o<<16&4294967295|o>>>16),o=n+(r^i^e)+s[2]+3299628645&4294967295,n=r+(o<<23&4294967295|o>>>9),o=e+(r^(n|~i))+s[0]+4096336452&4294967295,e=n+(o<<6&4294967295|o>>>26),o=i+(n^(e|~r))+s[7]+1126891415&4294967295,i=e+(o<<10&4294967295|o>>>22),o=r+(e^(i|~n))+s[14]+2878612391&4294967295,r=i+(o<<15&4294967295|o>>>17),o=n+(i^(r|~e))+s[5]+4237533241&4294967295,n=r+(o<<21&4294967295|o>>>11),o=e+(r^(n|~i))+s[12]+1700485571&4294967295,e=n+(o<<6&4294967295|o>>>26),o=i+(n^(e|~r))+s[3]+2399980690&4294967295,i=e+(o<<10&4294967295|o>>>22),o=r+(e^(i|~n))+s[10]+4293915773&4294967295,r=i+(o<<15&4294967295|o>>>17),o=n+(i^(r|~e))+s[1]+2240044497&4294967295,n=r+(o<<21&4294967295|o>>>11),o=e+(r^(n|~i))+s[8]+1873313359&4294967295,e=n+(o<<6&4294967295|o>>>26),o=i+(n^(e|~r))+s[15]+4264355552&4294967295,i=e+(o<<10&4294967295|o>>>22),o=r+(e^(i|~n))+s[6]+2734768916&4294967295,r=i+(o<<15&4294967295|o>>>17),o=n+(i^(r|~e))+s[13]+1309151649&4294967295,n=r+(o<<21&4294967295|o>>>11),o=e+(r^(n|~i))+s[4]+4149444226&4294967295,e=n+(o<<6&4294967295|o>>>26),o=i+(n^(e|~r))+s[11]+3174756917&4294967295,i=e+(o<<10&4294967295|o>>>22),o=r+(e^(i|~n))+s[2]+718787259&4294967295,r=i+(o<<15&4294967295|o>>>17),o=n+(i^(r|~e))+s[9]+3951481745&4294967295,t.g[0]=t.g[0]+e&4294967295,t.g[1]=t.g[1]+(r+(o<<21&4294967295|o>>>11))&4294967295,t.g[2]=t.g[2]+r&4294967295,t.g[3]=t.g[3]+i&4294967295}he.prototype.j=function(t,e){e===void 0&&(e=t.length);for(var n=e-this.blockSize,s=this.m,r=this.h,i=0;i<e;){if(r==0)for(;i<=n;)Ms(this,t,i),i+=this.blockSize;if(typeof t=="string"){for(;i<e;)if(s[r++]=t.charCodeAt(i++),r==this.blockSize){Ms(this,s),r=0;break}}else for(;i<e;)if(s[r++]=t[i++],r==this.blockSize){Ms(this,s),r=0;break}}this.h=r,this.i+=e};he.prototype.l=function(){var t=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);t[0]=128;for(var e=1;e<t.length-8;++e)t[e]=0;var n=8*this.i;for(e=t.length-8;e<t.length;++e)t[e]=n&255,n/=256;for(this.j(t),t=Array(16),e=n=0;4>e;++e)for(var s=0;32>s;s+=8)t[n++]=this.g[e]>>>s&255;return t};function R(t,e){this.h=e;for(var n=[],s=!0,r=t.length-1;0<=r;r--){var i=t[r]|0;s&&i==e||(n[r]=i,s=!1)}this.g=n}var xh={};function Fr(t){return-128<=t&&128>t?$l(t,function(e){return new R([e|0],0>e?-1:0)}):new R([t|0],0>t?-1:0)}function ye(t){if(isNaN(t)||!isFinite(t))return nt;if(0>t)return G(ye(-t));for(var e=[],n=1,s=0;t>=n;s++)e[s]=t/n|0,n*=tr;return new R(e,0)}function Fa(t,e){if(t.length==0)throw Error("number format error: empty string");if(e=e||10,2>e||36<e)throw Error("radix out of range: "+e);if(t.charAt(0)=="-")return G(Fa(t.substring(1),e));if(0<=t.indexOf("-"))throw Error('number format error: interior "-" character');for(var n=ye(Math.pow(e,8)),s=nt,r=0;r<t.length;r+=8){var i=Math.min(8,t.length-r),o=parseInt(t.substring(r,r+i),e);8>i?(i=ye(Math.pow(e,i)),s=s.R(i).add(ye(o))):(s=s.R(n),s=s.add(ye(o)))}return s}var tr=4294967296,nt=Fr(0),nr=Fr(1),Ui=Fr(16777216);m=R.prototype;m.ea=function(){if(ce(this))return-G(this).ea();for(var t=0,e=1,n=0;n<this.g.length;n++){var s=this.D(n);t+=(0<=s?s:tr+s)*e,e*=tr}return t};m.toString=function(t){if(t=t||10,2>t||36<t)throw Error("radix out of range: "+t);if(Ee(this))return"0";if(ce(this))return"-"+G(this).toString(t);for(var e=ye(Math.pow(t,6)),n=this,s="";;){var r=Mn(n,e).g;n=xn(n,r.R(e));var i=((0<n.g.length?n.g[0]:n.h)>>>0).toString(t);if(n=r,Ee(n))return i+s;for(;6>i.length;)i="0"+i;s=i+s}};m.D=function(t){return 0>t?0:t<this.g.length?this.g[t]:this.h};function Ee(t){if(t.h!=0)return!1;for(var e=0;e<t.g.length;e++)if(t.g[e]!=0)return!1;return!0}function ce(t){return t.h==-1}m.X=function(t){return t=xn(this,t),ce(t)?-1:Ee(t)?0:1};function G(t){for(var e=t.g.length,n=[],s=0;s<e;s++)n[s]=~t.g[s];return new R(n,~t.h).add(nr)}m.abs=function(){return ce(this)?G(this):this};m.add=function(t){for(var e=Math.max(this.g.length,t.g.length),n=[],s=0,r=0;r<=e;r++){var i=s+(this.D(r)&65535)+(t.D(r)&65535),o=(i>>>16)+(this.D(r)>>>16)+(t.D(r)>>>16);s=o>>>16,i&=65535,o&=65535,n[r]=o<<16|i}return new R(n,n[n.length-1]&-2147483648?-1:0)};function xn(t,e){return t.add(G(e))}m.R=function(t){if(Ee(this)||Ee(t))return nt;if(ce(this))return ce(t)?G(this).R(G(t)):G(G(this).R(t));if(ce(t))return G(this.R(G(t)));if(0>this.X(Ui)&&0>t.X(Ui))return ye(this.ea()*t.ea());for(var e=this.g.length+t.g.length,n=[],s=0;s<2*e;s++)n[s]=0;for(s=0;s<this.g.length;s++)for(var r=0;r<t.g.length;r++){var i=this.D(s)>>>16,o=this.D(s)&65535,a=t.D(r)>>>16,u=t.D(r)&65535;n[2*s+2*r]+=o*u,gn(n,2*s+2*r),n[2*s+2*r+1]+=i*u,gn(n,2*s+2*r+1),n[2*s+2*r+1]+=o*a,gn(n,2*s+2*r+1),n[2*s+2*r+2]+=i*a,gn(n,2*s+2*r+2)}for(s=0;s<e;s++)n[s]=n[2*s+1]<<16|n[2*s];for(s=e;s<2*e;s++)n[s]=0;return new R(n,0)};function gn(t,e){for(;(t[e]&65535)!=t[e];)t[e+1]+=t[e]>>>16,t[e]&=65535,e++}function Tt(t,e){this.g=t,this.h=e}function Mn(t,e){if(Ee(e))throw Error("division by zero");if(Ee(t))return new Tt(nt,nt);if(ce(t))return e=Mn(G(t),e),new Tt(G(e.g),G(e.h));if(ce(e))return e=Mn(t,G(e)),new Tt(G(e.g),e.h);if(30<t.g.length){if(ce(t)||ce(e))throw Error("slowDivide_ only works with positive integers.");for(var n=nr,s=e;0>=s.X(t);)n=Bi(n),s=Bi(s);var r=Xe(n,1),i=Xe(s,1);for(s=Xe(s,2),n=Xe(n,2);!Ee(s);){var o=i.add(s);0>=o.X(t)&&(r=r.add(n),i=o),s=Xe(s,1),n=Xe(n,1)}return e=xn(t,r.R(e)),new Tt(r,e)}for(r=nt;0<=t.X(e);){for(n=Math.max(1,Math.floor(t.ea()/e.ea())),s=Math.ceil(Math.log(n)/Math.LN2),s=48>=s?1:Math.pow(2,s-48),i=ye(n),o=i.R(e);ce(o)||0<o.X(t);)n-=s,i=ye(n),o=i.R(e);Ee(i)&&(i=nr),r=r.add(i),t=xn(t,o)}return new Tt(r,t)}m.gb=function(t){return Mn(this,t).h};m.and=function(t){for(var e=Math.max(this.g.length,t.g.length),n=[],s=0;s<e;s++)n[s]=this.D(s)&t.D(s);return new R(n,this.h&t.h)};m.or=function(t){for(var e=Math.max(this.g.length,t.g.length),n=[],s=0;s<e;s++)n[s]=this.D(s)|t.D(s);return new R(n,this.h|t.h)};m.xor=function(t){for(var e=Math.max(this.g.length,t.g.length),n=[],s=0;s<e;s++)n[s]=this.D(s)^t.D(s);return new R(n,this.h^t.h)};function Bi(t){for(var e=t.g.length+1,n=[],s=0;s<e;s++)n[s]=t.D(s)<<1|t.D(s-1)>>>31;return new R(n,t.h)}function Xe(t,e){var n=e>>5;e%=32;for(var s=t.g.length-n,r=[],i=0;i<s;i++)r[i]=0<e?t.D(i+n)>>>e|t.D(i+n+1)<<32-e:t.D(i+n);return new R(r,t.h)}Rn.prototype.createWebChannel=Rn.prototype.g;ue.prototype.send=ue.prototype.u;ue.prototype.open=ue.prototype.m;ue.prototype.close=ue.prototype.close;Jn.NO_ERROR=0;Jn.TIMEOUT=8;Jn.HTTP_ERROR=6;ta.COMPLETE="complete";na.EventType=Wt;Wt.OPEN="a";Wt.CLOSE="b";Wt.ERROR="c";Wt.MESSAGE="d";z.prototype.listen=z.prototype.O;P.prototype.listenOnce=P.prototype.P;P.prototype.getLastError=P.prototype.Sa;P.prototype.getLastErrorCode=P.prototype.Ia;P.prototype.getStatus=P.prototype.da;P.prototype.getResponseJson=P.prototype.Wa;P.prototype.getResponseText=P.prototype.ja;P.prototype.send=P.prototype.ha;P.prototype.setWithCredentials=P.prototype.Oa;he.prototype.digest=he.prototype.l;he.prototype.reset=he.prototype.reset;he.prototype.update=he.prototype.j;R.prototype.add=R.prototype.add;R.prototype.multiply=R.prototype.R;R.prototype.modulo=R.prototype.gb;R.prototype.compare=R.prototype.X;R.prototype.toNumber=R.prototype.ea;R.prototype.toString=R.prototype.toString;R.prototype.getBits=R.prototype.D;R.fromNumber=ye;R.fromString=Fa;var Mh=function(){return new Rn},Oh=function(){return Xn()},Os=Jn,Lh=ta,Ph=He,ji={xb:0,Ab:1,Bb:2,Ub:3,Zb:4,Wb:5,Xb:6,Vb:7,Tb:8,Yb:9,PROXY:10,NOPROXY:11,Rb:12,Nb:13,Ob:14,Mb:15,Pb:16,Qb:17,tb:18,sb:19,ub:20},Fh=Jt,pn=na,Vh=P,$h=he,st=R;const qi="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Y.UNAUTHENTICATED=new Y(null),Y.GOOGLE_CREDENTIALS=new Y("google-credentials-uid"),Y.FIRST_PARTY=new Y("first-party-uid"),Y.MOCK_USER=new Y("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let yt="9.23.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qe=new xo("@firebase/firestore");function zi(){return qe.logLevel}function v(t,...e){if(qe.logLevel<=k.DEBUG){const n=e.map(Vr);qe.debug(`Firestore (${yt}): ${t}`,...n)}}function Ce(t,...e){if(qe.logLevel<=k.ERROR){const n=e.map(Vr);qe.error(`Firestore (${yt}): ${t}`,...n)}}function at(t,...e){if(qe.logLevel<=k.WARN){const n=e.map(Vr);qe.warn(`Firestore (${yt}): ${t}`,...n)}}function Vr(t){if(typeof t=="string")return t;try{return e=t,JSON.stringify(e)}catch{return t}/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function T(t="Unexpected state"){const e=`FIRESTORE (${yt}) INTERNAL ASSERTION FAILED: `+t;throw Ce(e),new Error(e)}function O(t,e){t||T()}function C(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class y extends gt{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Te{constructor(){this.promise=new Promise(((e,n)=>{this.resolve=e,this.reject=n}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Va{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Uh{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable((()=>n(Y.UNAUTHENTICATED)))}shutdown(){}}class Bh{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable((()=>n(this.token.user)))}shutdown(){this.changeListener=null}}class jh{constructor(e){this.t=e,this.currentUser=Y.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){let s=this.i;const r=u=>this.i!==s?(s=this.i,n(u)):Promise.resolve();let i=new Te;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Te,e.enqueueRetryable((()=>r(this.currentUser)))};const o=()=>{const u=i;e.enqueueRetryable((async()=>{await u.promise,await r(this.currentUser)}))},a=u=>{v("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.auth.addAuthTokenListener(this.o),o()};this.t.onInit((u=>a(u))),setTimeout((()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?a(u):(v("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Te)}}),0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then((s=>this.i!==e?(v("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(O(typeof s.accessToken=="string"),new Va(s.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.auth.removeAuthTokenListener(this.o)}u(){const e=this.auth&&this.auth.getUid();return O(e===null||typeof e=="string"),new Y(e)}}class qh{constructor(e,n,s){this.h=e,this.l=n,this.m=s,this.type="FirstParty",this.user=Y.FIRST_PARTY,this.g=new Map}p(){return this.m?this.m():null}get headers(){this.g.set("X-Goog-AuthUser",this.h);const e=this.p();return e&&this.g.set("Authorization",e),this.l&&this.g.set("X-Goog-Iam-Authorization-Token",this.l),this.g}}class zh{constructor(e,n,s){this.h=e,this.l=n,this.m=s}getToken(){return Promise.resolve(new qh(this.h,this.l,this.m))}start(e,n){e.enqueueRetryable((()=>n(Y.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Kh{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Hh{constructor(e){this.I=e,this.forceRefresh=!1,this.appCheck=null,this.T=null}start(e,n){const s=i=>{i.error!=null&&v("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.T;return this.T=i.token,v("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable((()=>s(i)))};const r=i=>{v("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.appCheck.addTokenListener(this.o)};this.I.onInit((i=>r(i))),setTimeout((()=>{if(!this.appCheck){const i=this.I.getImmediate({optional:!0});i?r(i):v("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((n=>n?(O(typeof n.token=="string"),this.T=n.token,new Kh(n.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.appCheck.removeTokenListener(this.o)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gh(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let s=0;s<t;s++)n[s]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $a{static A(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let s="";for(;s.length<20;){const r=Gh(40);for(let i=0;i<r.length;++i)s.length<20&&r[i]<n&&(s+=e.charAt(r[i]%e.length))}return s}}function N(t,e){return t<e?-1:t>e?1:0}function ut(t,e,n){return t.length===e.length&&t.every(((s,r)=>n(s,e[r])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new y(f.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new y(f.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new y(f.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new y(f.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return U.fromMillis(Date.now())}static fromDate(e){return U.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),s=Math.floor(1e6*(e-1e3*n));return new U(n,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?N(this.nanoseconds,e.nanoseconds):N(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S{constructor(e){this.timestamp=e}static fromTimestamp(e){return new S(e)}static min(){return new S(new U(0,0))}static max(){return new S(new U(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt{constructor(e,n,s){n===void 0?n=0:n>e.length&&T(),s===void 0?s=e.length-n:s>e.length-n&&T(),this.segments=e,this.offset=n,this.len=s}get length(){return this.len}isEqual(e){return jt.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof jt?e.forEach((s=>{n.push(s)})):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,s=this.limit();n<s;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const s=Math.min(e.length,n.length);for(let r=0;r<s;r++){const i=e.get(r),o=n.get(r);if(i<o)return-1;if(i>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class M extends jt{construct(e,n,s){return new M(e,n,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}static fromString(...e){const n=[];for(const s of e){if(s.indexOf("//")>=0)throw new y(f.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);n.push(...s.split("/").filter((r=>r.length>0)))}return new M(n)}static emptyPath(){return new M([])}}const Qh=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class J extends jt{construct(e,n,s){return new J(e,n,s)}static isValidIdentifier(e){return Qh.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),J.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new J(["__name__"])}static fromServerFormat(e){const n=[];let s="",r=0;const i=()=>{if(s.length===0)throw new y(f.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(s),s=""};let o=!1;for(;r<e.length;){const a=e[r];if(a==="\\"){if(r+1===e.length)throw new y(f.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[r+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new y(f.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=u,r+=2}else a==="`"?(o=!o,r++):a!=="."||o?(s+=a,r++):(i(),r++)}if(i(),o)throw new y(f.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new J(n)}static emptyPath(){return new J([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class w{constructor(e){this.path=e}static fromPath(e){return new w(M.fromString(e))}static fromName(e){return new w(M.fromString(e).popFirst(5))}static empty(){return new w(M.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&M.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return M.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new w(new M(e.slice()))}}function Wh(t,e){const n=t.toTimestamp().seconds,s=t.toTimestamp().nanoseconds+1,r=S.fromTimestamp(s===1e9?new U(n+1,0):new U(n,s));return new Re(r,w.empty(),e)}function Yh(t){return new Re(t.readTime,t.key,-1)}class Re{constructor(e,n,s){this.readTime=e,this.documentKey=n,this.largestBatchId=s}static min(){return new Re(S.min(),w.empty(),-1)}static max(){return new Re(S.max(),w.empty(),-1)}}function Xh(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=w.comparator(t.documentKey,e.documentKey),n!==0?n:N(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jh="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Zh{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tn(t){if(t.code!==f.FAILED_PRECONDITION||t.message!==Jh)throw t;v("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)}),(n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)}))}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&T(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new g(((s,r)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(s,r)},this.catchCallback=i=>{this.wrapFailure(n,i).next(s,r)}}))}toPromise(){return new Promise(((e,n)=>{this.next(e,n)}))}wrapUserFunction(e){try{const n=e();return n instanceof g?n:g.resolve(n)}catch(n){return g.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction((()=>e(n))):g.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction((()=>e(n))):g.reject(n)}static resolve(e){return new g(((n,s)=>{n(e)}))}static reject(e){return new g(((n,s)=>{s(e)}))}static waitFor(e){return new g(((n,s)=>{let r=0,i=0,o=!1;e.forEach((a=>{++r,a.next((()=>{++i,o&&i===r&&n()}),(u=>s(u)))})),o=!0,i===r&&n()}))}static or(e){let n=g.resolve(!1);for(const s of e)n=n.next((r=>r?g.resolve(r):s()));return n}static forEach(e,n){const s=[];return e.forEach(((r,i)=>{s.push(n.call(this,r,i))})),this.waitFor(s)}static mapArray(e,n){return new g(((s,r)=>{const i=e.length,o=new Array(i);let a=0;for(let u=0;u<i;u++){const c=u;n(e[c]).next((l=>{o[c]=l,++a,a===i&&s(o)}),(l=>r(l)))}}))}static doWhile(e,n){return new g(((s,r)=>{const i=()=>{e()===!0?n().next((()=>{i()}),r):s()};i()}))}}function nn(t){return t.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $r{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=s=>this.ot(s),this.ut=s=>n.writeSequenceNumber(s))}ot(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ut&&this.ut(e),e}}$r.ct=-1;function os(t){return t==null}function On(t){return t===0&&1/t==-1/0}function ef(t){return typeof t=="number"&&Number.isInteger(t)&&!On(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ki(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function Ge(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function Ua(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(e,n){this.comparator=e,this.root=n||H.EMPTY}insert(e,n){return new L(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,H.BLACK,null,null))}remove(e){return new L(this.comparator,this.root.remove(e,this.comparator).copy(null,null,H.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return n.value;s<0?n=n.left:s>0&&(n=n.right)}return null}indexOf(e){let n=0,s=this.root;for(;!s.isEmpty();){const r=this.comparator(e,s.key);if(r===0)return n+s.left.size;r<0?s=s.left:(n+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((n,s)=>(e(n,s),!1)))}toString(){const e=[];return this.inorderTraversal(((n,s)=>(e.push(`${n}:${s}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new mn(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new mn(this.root,e,this.comparator,!1)}getReverseIterator(){return new mn(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new mn(this.root,e,this.comparator,!0)}}class mn{constructor(e,n,s,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=n?s(e.key,n):1,n&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class H{constructor(e,n,s,r,i){this.key=e,this.value=n,this.color=s??H.RED,this.left=r??H.EMPTY,this.right=i??H.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,s,r,i){return new H(e??this.key,n??this.value,s??this.color,r??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,s){let r=this;const i=s(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,n,s),null):i===0?r.copy(null,n,null,null,null):r.copy(null,null,null,null,r.right.insert(e,n,s)),r.fixUp()}removeMin(){if(this.left.isEmpty())return H.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let s,r=this;if(n(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,n),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),n(e,r.key)===0){if(r.right.isEmpty())return H.EMPTY;s=r.right.min(),r=r.copy(s.key,s.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,n))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,H.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,H.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw T();const e=this.left.check();if(e!==this.right.check())throw T();return e+(this.isRed()?0:1)}}H.EMPTY=null,H.RED=!0,H.BLACK=!1;H.EMPTY=new class{constructor(){this.size=0}get key(){throw T()}get value(){throw T()}get color(){throw T()}get left(){throw T()}get right(){throw T()}copy(t,e,n,s,r){return this}insert(t,e,n){return new H(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class te{constructor(e){this.comparator=e,this.data=new L(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((n,s)=>(e(n),!1)))}forEachInRange(e,n){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const r=s.getNext();if(this.comparator(r.key,e[1])>=0)return;n(r.key)}}forEachWhile(e,n){let s;for(s=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new Hi(this.data.getIterator())}getIteratorFrom(e){return new Hi(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach((s=>{n=n.add(s)})),n}isEqual(e){if(!(e instanceof te)||this.size!==e.size)return!1;const n=this.data.getIterator(),s=e.data.getIterator();for(;n.hasNext();){const r=n.getNext().key,i=s.getNext().key;if(this.comparator(r,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((n=>{e.push(n)})),e}toString(){const e=[];return this.forEach((n=>e.push(n))),"SortedSet("+e.toString()+")"}copy(e){const n=new te(this.comparator);return n.data=e,n}}class Hi{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ae{constructor(e){this.fields=e,e.sort(J.comparator)}static empty(){return new ae([])}unionWith(e){let n=new te(J.comparator);for(const s of this.fields)n=n.add(s);for(const s of e)n=n.add(s);return new ae(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return ut(this.fields,e.fields,((n,s)=>n.isEqual(s)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ba extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ne{constructor(e){this.binaryString=e}static fromBase64String(e){const n=(function(s){try{return atob(s)}catch(r){throw typeof DOMException<"u"&&r instanceof DOMException?new Ba("Invalid base64 string: "+r):r}})(e);return new ne(n)}static fromUint8Array(e){const n=(function(s){let r="";for(let i=0;i<s.length;++i)r+=String.fromCharCode(s[i]);return r})(e);return new ne(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return e=this.binaryString,btoa(e);var e}toUint8Array(){return(function(e){const n=new Uint8Array(e.length);for(let s=0;s<e.length;s++)n[s]=e.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return N(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}ne.EMPTY_BYTE_STRING=new ne("");const tf=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function xe(t){if(O(!!t),typeof t=="string"){let e=0;const n=tf.exec(t);if(O(!!n),n[1]){let r=n[1];r=(r+"000000000").substr(0,9),e=Number(r)}const s=new Date(t);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:V(t.seconds),nanos:V(t.nanos)}}function V(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function ze(t){return typeof t=="string"?ne.fromBase64String(t):ne.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ur(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function Br(t){const e=t.mapValue.fields.__previous_value__;return Ur(e)?Br(e):e}function qt(t){const e=xe(t.mapValue.fields.__local_write_time__.timestampValue);return new U(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nf{constructor(e,n,s,r,i,o,a,u,c){this.databaseId=e,this.appId=n,this.persistenceKey=s,this.host=r,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=u,this.useFetchStreams=c}}class zt{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new zt("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof zt&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yn={mapValue:{}};function Ke(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?Ur(t)?4:sf(t)?9007199254740991:10:T()}function we(t,e){if(t===e)return!0;const n=Ke(t);if(n!==Ke(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return qt(t).isEqual(qt(e));case 3:return(function(s,r){if(typeof s.timestampValue=="string"&&typeof r.timestampValue=="string"&&s.timestampValue.length===r.timestampValue.length)return s.timestampValue===r.timestampValue;const i=xe(s.timestampValue),o=xe(r.timestampValue);return i.seconds===o.seconds&&i.nanos===o.nanos})(t,e);case 5:return t.stringValue===e.stringValue;case 6:return(function(s,r){return ze(s.bytesValue).isEqual(ze(r.bytesValue))})(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return(function(s,r){return V(s.geoPointValue.latitude)===V(r.geoPointValue.latitude)&&V(s.geoPointValue.longitude)===V(r.geoPointValue.longitude)})(t,e);case 2:return(function(s,r){if("integerValue"in s&&"integerValue"in r)return V(s.integerValue)===V(r.integerValue);if("doubleValue"in s&&"doubleValue"in r){const i=V(s.doubleValue),o=V(r.doubleValue);return i===o?On(i)===On(o):isNaN(i)&&isNaN(o)}return!1})(t,e);case 9:return ut(t.arrayValue.values||[],e.arrayValue.values||[],we);case 10:return(function(s,r){const i=s.mapValue.fields||{},o=r.mapValue.fields||{};if(Ki(i)!==Ki(o))return!1;for(const a in i)if(i.hasOwnProperty(a)&&(o[a]===void 0||!we(i[a],o[a])))return!1;return!0})(t,e);default:return T()}}function Kt(t,e){return(t.values||[]).find((n=>we(n,e)))!==void 0}function ct(t,e){if(t===e)return 0;const n=Ke(t),s=Ke(e);if(n!==s)return N(n,s);switch(n){case 0:case 9007199254740991:return 0;case 1:return N(t.booleanValue,e.booleanValue);case 2:return(function(r,i){const o=V(r.integerValue||r.doubleValue),a=V(i.integerValue||i.doubleValue);return o<a?-1:o>a?1:o===a?0:isNaN(o)?isNaN(a)?0:-1:1})(t,e);case 3:return Gi(t.timestampValue,e.timestampValue);case 4:return Gi(qt(t),qt(e));case 5:return N(t.stringValue,e.stringValue);case 6:return(function(r,i){const o=ze(r),a=ze(i);return o.compareTo(a)})(t.bytesValue,e.bytesValue);case 7:return(function(r,i){const o=r.split("/"),a=i.split("/");for(let u=0;u<o.length&&u<a.length;u++){const c=N(o[u],a[u]);if(c!==0)return c}return N(o.length,a.length)})(t.referenceValue,e.referenceValue);case 8:return(function(r,i){const o=N(V(r.latitude),V(i.latitude));return o!==0?o:N(V(r.longitude),V(i.longitude))})(t.geoPointValue,e.geoPointValue);case 9:return(function(r,i){const o=r.values||[],a=i.values||[];for(let u=0;u<o.length&&u<a.length;++u){const c=ct(o[u],a[u]);if(c)return c}return N(o.length,a.length)})(t.arrayValue,e.arrayValue);case 10:return(function(r,i){if(r===yn.mapValue&&i===yn.mapValue)return 0;if(r===yn.mapValue)return 1;if(i===yn.mapValue)return-1;const o=r.fields||{},a=Object.keys(o),u=i.fields||{},c=Object.keys(u);a.sort(),c.sort();for(let l=0;l<a.length&&l<c.length;++l){const h=N(a[l],c[l]);if(h!==0)return h;const d=ct(o[a[l]],u[c[l]]);if(d!==0)return d}return N(a.length,c.length)})(t.mapValue,e.mapValue);default:throw T()}}function Gi(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return N(t,e);const n=xe(t),s=xe(e),r=N(n.seconds,s.seconds);return r!==0?r:N(n.nanos,s.nanos)}function lt(t){return sr(t)}function sr(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?(function(s){const r=xe(s);return`time(${r.seconds},${r.nanos})`})(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?ze(t.bytesValue).toBase64():"referenceValue"in t?(n=t.referenceValue,w.fromName(n).toString()):"geoPointValue"in t?`geo(${(e=t.geoPointValue).latitude},${e.longitude})`:"arrayValue"in t?(function(s){let r="[",i=!0;for(const o of s.values||[])i?i=!1:r+=",",r+=sr(o);return r+"]"})(t.arrayValue):"mapValue"in t?(function(s){const r=Object.keys(s.fields||{}).sort();let i="{",o=!0;for(const a of r)o?o=!1:i+=",",i+=`${a}:${sr(s.fields[a])}`;return i+"}"})(t.mapValue):T();var e,n}function Qi(t,e){return{referenceValue:`projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`}}function rr(t){return!!t&&"integerValue"in t}function jr(t){return!!t&&"arrayValue"in t}function Wi(t){return!!t&&"nullValue"in t}function Yi(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function En(t){return!!t&&"mapValue"in t}function bt(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return Ge(t.mapValue.fields,((n,s)=>e.mapValue.fields[n]=bt(s))),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=bt(t.arrayValue.values[n]);return e}return Object.assign({},t)}function sf(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oe{constructor(e){this.value=e}static empty(){return new oe({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let s=0;s<e.length-1;++s)if(n=(n.mapValue.fields||{})[e.get(s)],!En(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=bt(n)}setAll(e){let n=J.emptyPath(),s={},r=[];e.forEach(((o,a)=>{if(!n.isImmediateParentOf(a)){const u=this.getFieldsMap(n);this.applyChanges(u,s,r),s={},r=[],n=a.popLast()}o?s[a.lastSegment()]=bt(o):r.push(a.lastSegment())}));const i=this.getFieldsMap(n);this.applyChanges(i,s,r)}delete(e){const n=this.field(e.popLast());En(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return we(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let s=0;s<e.length;++s){let r=n.mapValue.fields[e.get(s)];En(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},n.mapValue.fields[e.get(s)]=r),n=r}return n.mapValue.fields}applyChanges(e,n,s){Ge(n,((r,i)=>e[r]=i));for(const r of s)delete e[r]}clone(){return new oe(bt(this.value))}}function ja(t){const e=[];return Ge(t.fields,((n,s)=>{const r=new J([n]);if(En(s)){const i=ja(s.mapValue).fields;if(i.length===0)e.push(r);else for(const o of i)e.push(r.child(o))}else e.push(r)})),new ae(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{constructor(e,n,s,r,i,o,a){this.key=e,this.documentType=n,this.version=s,this.readTime=r,this.createTime=i,this.data=o,this.documentState=a}static newInvalidDocument(e){return new X(e,0,S.min(),S.min(),S.min(),oe.empty(),0)}static newFoundDocument(e,n,s,r){return new X(e,1,n,S.min(),s,r,0)}static newNoDocument(e,n){return new X(e,2,n,S.min(),S.min(),oe.empty(),0)}static newUnknownDocument(e,n){return new X(e,3,n,S.min(),S.min(),oe.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(S.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=oe.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=oe.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=S.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof X&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new X(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ln{constructor(e,n){this.position=e,this.inclusive=n}}function Xi(t,e,n){let s=0;for(let r=0;r<t.position.length;r++){const i=e[r],o=t.position[r];if(i.field.isKeyField()?s=w.comparator(w.fromName(o.referenceValue),n.key):s=ct(o,n.data.field(i.field)),i.dir==="desc"&&(s*=-1),s!==0)break}return s}function Ji(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!we(t.position[n],e.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt{constructor(e,n="asc"){this.field=e,this.dir=n}}function rf(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qa{}class $ extends qa{constructor(e,n,s){super(),this.field=e,this.op=n,this.value=s}static create(e,n,s){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,s):new af(e,n,s):n==="array-contains"?new lf(e,s):n==="in"?new hf(e,s):n==="not-in"?new ff(e,s):n==="array-contains-any"?new df(e,s):new $(e,n,s)}static createKeyFieldInFilter(e,n,s){return n==="in"?new uf(e,s):new cf(e,s)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(ct(n,this.value)):n!==null&&Ke(this.value)===Ke(n)&&this.matchesComparison(ct(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return T()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}getFirstInequalityField(){return this.isInequality()?this.field:null}}class fe extends qa{constructor(e,n){super(),this.filters=e,this.op=n,this.lt=null}static create(e,n){return new fe(e,n)}matches(e){return za(this)?this.filters.find((n=>!n.matches(e)))===void 0:this.filters.find((n=>n.matches(e)))!==void 0}getFlattenedFilters(){return this.lt!==null||(this.lt=this.filters.reduce(((e,n)=>e.concat(n.getFlattenedFilters())),[])),this.lt}getFilters(){return Object.assign([],this.filters)}getFirstInequalityField(){const e=this.ft((n=>n.isInequality()));return e!==null?e.field:null}ft(e){for(const n of this.getFlattenedFilters())if(e(n))return n;return null}}function za(t){return t.op==="and"}function Ka(t){return of(t)&&za(t)}function of(t){for(const e of t.filters)if(e instanceof fe)return!1;return!0}function ir(t){if(t instanceof $)return t.field.canonicalString()+t.op.toString()+lt(t.value);if(Ka(t))return t.filters.map((e=>ir(e))).join(",");{const e=t.filters.map((n=>ir(n))).join(",");return`${t.op}(${e})`}}function Ha(t,e){return t instanceof $?(function(n,s){return s instanceof $&&n.op===s.op&&n.field.isEqual(s.field)&&we(n.value,s.value)})(t,e):t instanceof fe?(function(n,s){return s instanceof fe&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce(((r,i,o)=>r&&Ha(i,s.filters[o])),!0):!1})(t,e):void T()}function Ga(t){return t instanceof $?(function(e){return`${e.field.canonicalString()} ${e.op} ${lt(e.value)}`})(t):t instanceof fe?(function(e){return e.op.toString()+" {"+e.getFilters().map(Ga).join(" ,")+"}"})(t):"Filter"}class af extends ${constructor(e,n,s){super(e,n,s),this.key=w.fromName(s.referenceValue)}matches(e){const n=w.comparator(e.key,this.key);return this.matchesComparison(n)}}class uf extends ${constructor(e,n){super(e,"in",n),this.keys=Qa("in",n)}matches(e){return this.keys.some((n=>n.isEqual(e.key)))}}class cf extends ${constructor(e,n){super(e,"not-in",n),this.keys=Qa("not-in",n)}matches(e){return!this.keys.some((n=>n.isEqual(e.key)))}}function Qa(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map((s=>w.fromName(s.referenceValue)))}class lf extends ${constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return jr(n)&&Kt(n.arrayValue,this.value)}}class hf extends ${constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&Kt(this.value.arrayValue,n)}}class ff extends ${constructor(e,n){super(e,"not-in",n)}matches(e){if(Kt(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!Kt(this.value.arrayValue,n)}}class df extends ${constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!jr(n)||!n.arrayValue.values)&&n.arrayValue.values.some((s=>Kt(this.value.arrayValue,s)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gf{constructor(e,n=null,s=[],r=[],i=null,o=null,a=null){this.path=e,this.collectionGroup=n,this.orderBy=s,this.filters=r,this.limit=i,this.startAt=o,this.endAt=a,this.dt=null}}function Zi(t,e=null,n=[],s=[],r=null,i=null,o=null){return new gf(t,e,n,s,r,i,o)}function qr(t){const e=C(t);if(e.dt===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map((s=>ir(s))).join(","),n+="|ob:",n+=e.orderBy.map((s=>(function(r){return r.field.canonicalString()+r.dir})(s))).join(","),os(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map((s=>lt(s))).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map((s=>lt(s))).join(",")),e.dt=n}return e.dt}function zr(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!rf(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!Ha(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!Ji(t.startAt,e.startAt)&&Ji(t.endAt,e.endAt)}function or(t){return w.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sn{constructor(e,n=null,s=[],r=[],i=null,o="F",a=null,u=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=s,this.filters=r,this.limit=i,this.limitType=o,this.startAt=a,this.endAt=u,this.wt=null,this._t=null,this.startAt,this.endAt}}function pf(t,e,n,s,r,i,o,a){return new sn(t,e,n,s,r,i,o,a)}function Kr(t){return new sn(t)}function eo(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function Wa(t){return t.explicitOrderBy.length>0?t.explicitOrderBy[0].field:null}function Hr(t){for(const e of t.filters){const n=e.getFirstInequalityField();if(n!==null)return n}return null}function Ya(t){return t.collectionGroup!==null}function rt(t){const e=C(t);if(e.wt===null){e.wt=[];const n=Hr(e),s=Wa(e);if(n!==null&&s===null)n.isKeyField()||e.wt.push(new Nt(n)),e.wt.push(new Nt(J.keyField(),"asc"));else{let r=!1;for(const i of e.explicitOrderBy)e.wt.push(i),i.field.isKeyField()&&(r=!0);if(!r){const i=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";e.wt.push(new Nt(J.keyField(),i))}}}return e.wt}function Ae(t){const e=C(t);if(!e._t)if(e.limitType==="F")e._t=Zi(e.path,e.collectionGroup,rt(e),e.filters,e.limit,e.startAt,e.endAt);else{const n=[];for(const i of rt(e)){const o=i.dir==="desc"?"asc":"desc";n.push(new Nt(i.field,o))}const s=e.endAt?new Ln(e.endAt.position,e.endAt.inclusive):null,r=e.startAt?new Ln(e.startAt.position,e.startAt.inclusive):null;e._t=Zi(e.path,e.collectionGroup,n,e.filters,e.limit,s,r)}return e._t}function ar(t,e){e.getFirstInequalityField(),Hr(t);const n=t.filters.concat([e]);return new sn(t.path,t.collectionGroup,t.explicitOrderBy.slice(),n,t.limit,t.limitType,t.startAt,t.endAt)}function Pn(t,e,n){return new sn(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function as(t,e){return zr(Ae(t),Ae(e))&&t.limitType===e.limitType}function Xa(t){return`${qr(Ae(t))}|lt:${t.limitType}`}function ur(t){return`Query(target=${(function(e){let n=e.path.canonicalString();return e.collectionGroup!==null&&(n+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(n+=`, filters: [${e.filters.map((s=>Ga(s))).join(", ")}]`),os(e.limit)||(n+=", limit: "+e.limit),e.orderBy.length>0&&(n+=`, orderBy: [${e.orderBy.map((s=>(function(r){return`${r.field.canonicalString()} (${r.dir})`})(s))).join(", ")}]`),e.startAt&&(n+=", startAt: ",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map((s=>lt(s))).join(",")),e.endAt&&(n+=", endAt: ",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map((s=>lt(s))).join(",")),`Target(${n})`})(Ae(t))}; limitType=${t.limitType})`}function us(t,e){return e.isFoundDocument()&&(function(n,s){const r=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(r):w.isDocumentKey(n.path)?n.path.isEqual(r):n.path.isImmediateParentOf(r)})(t,e)&&(function(n,s){for(const r of rt(n))if(!r.field.isKeyField()&&s.data.field(r.field)===null)return!1;return!0})(t,e)&&(function(n,s){for(const r of n.filters)if(!r.matches(s))return!1;return!0})(t,e)&&(function(n,s){return!(n.startAt&&!(function(r,i,o){const a=Xi(r,i,o);return r.inclusive?a<=0:a<0})(n.startAt,rt(n),s)||n.endAt&&!(function(r,i,o){const a=Xi(r,i,o);return r.inclusive?a>=0:a>0})(n.endAt,rt(n),s))})(t,e)}function mf(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function Ja(t){return(e,n)=>{let s=!1;for(const r of rt(t)){const i=yf(r,e,n);if(i!==0)return i;s=s||r.field.isKeyField()}return 0}}function yf(t,e,n){const s=t.field.isKeyField()?w.comparator(e.key,n.key):(function(r,i,o){const a=i.data.field(r),u=o.data.field(r);return a!==null&&u!==null?ct(a,u):T()})(t.field,e,n);switch(t.dir){case"asc":return s;case"desc":return-1*s;default:return T()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),s=this.inner[n];if(s!==void 0){for(const[r,i]of s)if(this.equalsFn(r,e))return i}}has(e){return this.get(e)!==void 0}set(e,n){const s=this.mapKeyFn(e),r=this.inner[s];if(r===void 0)return this.inner[s]=[[e,n]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return void(r[i]=[e,n]);r.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return!1;for(let r=0;r<s.length;r++)if(this.equalsFn(s[r][0],e))return s.length===1?delete this.inner[n]:s.splice(r,1),this.innerSize--,!0;return!1}forEach(e){Ge(this.inner,((n,s)=>{for(const[r,i]of s)e(r,i)}))}isEmpty(){return Ua(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vf=new L(w.comparator);function De(){return vf}const Za=new L(w.comparator);function Ct(...t){let e=Za;for(const n of t)e=e.insert(n.key,n);return e}function eu(t){let e=Za;return t.forEach(((n,s)=>e=e.insert(n,s.overlayedDocument))),e}function Ue(){return kt()}function tu(){return kt()}function kt(){return new vt((t=>t.toString()),((t,e)=>t.isEqual(e)))}const wf=new L(w.comparator),Ef=new te(w.comparator);function _(...t){let e=Ef;for(const n of t)e=e.add(n);return e}const Tf=new te(N);function If(){return Tf}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nu(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:On(e)?"-0":e}}function su(t){return{integerValue:""+t}}function Sf(t,e){return ef(e)?su(e):nu(t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cs{constructor(){this._=void 0}}function Cf(t,e,n){return t instanceof Fn?(function(s,r){const i={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return r&&Ur(r)&&(r=Br(r)),r&&(i.fields.__previous_value__=r),{mapValue:i}})(n,e):t instanceof Ht?iu(t,e):t instanceof Gt?ou(t,e):(function(s,r){const i=ru(s,r),o=to(i)+to(s.gt);return rr(i)&&rr(s.gt)?su(o):nu(s.serializer,o)})(t,e)}function Af(t,e,n){return t instanceof Ht?iu(t,e):t instanceof Gt?ou(t,e):n}function ru(t,e){return t instanceof Vn?rr(n=e)||(function(s){return!!s&&"doubleValue"in s})(n)?e:{integerValue:0}:null;var n}class Fn extends cs{}class Ht extends cs{constructor(e){super(),this.elements=e}}function iu(t,e){const n=au(e);for(const s of t.elements)n.some((r=>we(r,s)))||n.push(s);return{arrayValue:{values:n}}}class Gt extends cs{constructor(e){super(),this.elements=e}}function ou(t,e){let n=au(e);for(const s of t.elements)n=n.filter((r=>!we(r,s)));return{arrayValue:{values:n}}}class Vn extends cs{constructor(e,n){super(),this.serializer=e,this.gt=n}}function to(t){return V(t.integerValue||t.doubleValue)}function au(t){return jr(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}function Df(t,e){return t.field.isEqual(e.field)&&(function(n,s){return n instanceof Ht&&s instanceof Ht||n instanceof Gt&&s instanceof Gt?ut(n.elements,s.elements,we):n instanceof Vn&&s instanceof Vn?we(n.gt,s.gt):n instanceof Fn&&s instanceof Fn})(t.transform,e.transform)}class _f{constructor(e,n){this.version=e,this.transformResults=n}}class le{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new le}static exists(e){return new le(void 0,e)}static updateTime(e){return new le(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Tn(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class ls{}function uu(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new Gr(t.key,le.none()):new rn(t.key,t.data,le.none());{const n=t.data,s=oe.empty();let r=new te(J.comparator);for(let i of e.fields)if(!r.has(i)){let o=n.field(i);o===null&&i.length>1&&(i=i.popLast(),o=n.field(i)),o===null?s.delete(i):s.set(i,o),r=r.add(i)}return new Pe(t.key,s,new ae(r.toArray()),le.none())}}function bf(t,e,n){t instanceof rn?(function(s,r,i){const o=s.value.clone(),a=so(s.fieldTransforms,r,i.transformResults);o.setAll(a),r.convertToFoundDocument(i.version,o).setHasCommittedMutations()})(t,e,n):t instanceof Pe?(function(s,r,i){if(!Tn(s.precondition,r))return void r.convertToUnknownDocument(i.version);const o=so(s.fieldTransforms,r,i.transformResults),a=r.data;a.setAll(cu(s)),a.setAll(o),r.convertToFoundDocument(i.version,a).setHasCommittedMutations()})(t,e,n):(function(s,r,i){r.convertToNoDocument(i.version).setHasCommittedMutations()})(0,e,n)}function Rt(t,e,n,s){return t instanceof rn?(function(r,i,o,a){if(!Tn(r.precondition,i))return o;const u=r.value.clone(),c=ro(r.fieldTransforms,a,i);return u.setAll(c),i.convertToFoundDocument(i.version,u).setHasLocalMutations(),null})(t,e,n,s):t instanceof Pe?(function(r,i,o,a){if(!Tn(r.precondition,i))return o;const u=ro(r.fieldTransforms,a,i),c=i.data;return c.setAll(cu(r)),c.setAll(u),i.convertToFoundDocument(i.version,c).setHasLocalMutations(),o===null?null:o.unionWith(r.fieldMask.fields).unionWith(r.fieldTransforms.map((l=>l.field)))})(t,e,n,s):(function(r,i,o){return Tn(r.precondition,i)?(i.convertToNoDocument(i.version).setHasLocalMutations(),null):o})(t,e,n)}function Nf(t,e){let n=null;for(const s of t.fieldTransforms){const r=e.data.field(s.field),i=ru(s.transform,r||null);i!=null&&(n===null&&(n=oe.empty()),n.set(s.field,i))}return n||null}function no(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!(function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&ut(n,s,((r,i)=>Df(r,i)))})(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class rn extends ls{constructor(e,n,s,r=[]){super(),this.key=e,this.value=n,this.precondition=s,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class Pe extends ls{constructor(e,n,s,r,i=[]){super(),this.key=e,this.data=n,this.fieldMask=s,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function cu(t){const e=new Map;return t.fieldMask.fields.forEach((n=>{if(!n.isEmpty()){const s=t.data.field(n);e.set(n,s)}})),e}function so(t,e,n){const s=new Map;O(t.length===n.length);for(let r=0;r<n.length;r++){const i=t[r],o=i.transform,a=e.data.field(i.field);s.set(i.field,Af(o,a,n[r]))}return s}function ro(t,e,n){const s=new Map;for(const r of t){const i=r.transform,o=n.data.field(r.field);s.set(r.field,Cf(i,o,e))}return s}class Gr extends ls{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class kf extends ls{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rf{constructor(e,n,s,r){this.batchId=e,this.localWriteTime=n,this.baseMutations=s,this.mutations=r}applyToRemoteDocument(e,n){const s=n.mutationResults;for(let r=0;r<this.mutations.length;r++){const i=this.mutations[r];i.key.isEqual(e.key)&&bf(i,e,s[r])}}applyToLocalView(e,n){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(n=Rt(s,e,n,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(n=Rt(s,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const s=tu();return this.mutations.forEach((r=>{const i=e.get(r.key),o=i.overlayedDocument;let a=this.applyToLocalView(o,i.mutatedFields);a=n.has(r.key)?null:a;const u=uu(o,a);u!==null&&s.set(r.key,u),o.isValidDocument()||o.convertToNoDocument(S.min())})),s}keys(){return this.mutations.reduce(((e,n)=>e.add(n.key)),_())}isEqual(e){return this.batchId===e.batchId&&ut(this.mutations,e.mutations,((n,s)=>no(n,s)))&&ut(this.baseMutations,e.baseMutations,((n,s)=>no(n,s)))}}class Qr{constructor(e,n,s,r){this.batch=e,this.commitVersion=n,this.mutationResults=s,this.docVersions=r}static from(e,n,s){O(e.mutations.length===s.length);let r=wf;const i=e.mutations;for(let o=0;o<i.length;o++)r=r.insert(i[o].key,s[o].version);return new Qr(e,n,s,r)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xf{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mf{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var F,b;function Of(t){switch(t){default:return T();case f.CANCELLED:case f.UNKNOWN:case f.DEADLINE_EXCEEDED:case f.RESOURCE_EXHAUSTED:case f.INTERNAL:case f.UNAVAILABLE:case f.UNAUTHENTICATED:return!1;case f.INVALID_ARGUMENT:case f.NOT_FOUND:case f.ALREADY_EXISTS:case f.PERMISSION_DENIED:case f.FAILED_PRECONDITION:case f.ABORTED:case f.OUT_OF_RANGE:case f.UNIMPLEMENTED:case f.DATA_LOSS:return!0}}function lu(t){if(t===void 0)return Ce("GRPC error has no .code"),f.UNKNOWN;switch(t){case F.OK:return f.OK;case F.CANCELLED:return f.CANCELLED;case F.UNKNOWN:return f.UNKNOWN;case F.DEADLINE_EXCEEDED:return f.DEADLINE_EXCEEDED;case F.RESOURCE_EXHAUSTED:return f.RESOURCE_EXHAUSTED;case F.INTERNAL:return f.INTERNAL;case F.UNAVAILABLE:return f.UNAVAILABLE;case F.UNAUTHENTICATED:return f.UNAUTHENTICATED;case F.INVALID_ARGUMENT:return f.INVALID_ARGUMENT;case F.NOT_FOUND:return f.NOT_FOUND;case F.ALREADY_EXISTS:return f.ALREADY_EXISTS;case F.PERMISSION_DENIED:return f.PERMISSION_DENIED;case F.FAILED_PRECONDITION:return f.FAILED_PRECONDITION;case F.ABORTED:return f.ABORTED;case F.OUT_OF_RANGE:return f.OUT_OF_RANGE;case F.UNIMPLEMENTED:return f.UNIMPLEMENTED;case F.DATA_LOSS:return f.DATA_LOSS;default:return T()}}(b=F||(F={}))[b.OK=0]="OK",b[b.CANCELLED=1]="CANCELLED",b[b.UNKNOWN=2]="UNKNOWN",b[b.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",b[b.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",b[b.NOT_FOUND=5]="NOT_FOUND",b[b.ALREADY_EXISTS=6]="ALREADY_EXISTS",b[b.PERMISSION_DENIED=7]="PERMISSION_DENIED",b[b.UNAUTHENTICATED=16]="UNAUTHENTICATED",b[b.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",b[b.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",b[b.ABORTED=10]="ABORTED",b[b.OUT_OF_RANGE=11]="OUT_OF_RANGE",b[b.UNIMPLEMENTED=12]="UNIMPLEMENTED",b[b.INTERNAL=13]="INTERNAL",b[b.UNAVAILABLE=14]="UNAVAILABLE",b[b.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wr{constructor(){this.onExistenceFilterMismatchCallbacks=new Map}static get instance(){return vn}static getOrCreateInstance(){return vn===null&&(vn=new Wr),vn}onExistenceFilterMismatch(e){const n=Symbol();return this.onExistenceFilterMismatchCallbacks.set(n,e),()=>this.onExistenceFilterMismatchCallbacks.delete(n)}notifyOnExistenceFilterMismatch(e){this.onExistenceFilterMismatchCallbacks.forEach((n=>n(e)))}}let vn=null;/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lf(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pf=new st([4294967295,4294967295],0);function io(t){const e=Lf().encode(t),n=new $h;return n.update(e),new Uint8Array(n.digest())}function oo(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),s=e.getUint32(4,!0),r=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new st([n,s],0),new st([r,i],0)]}class Yr{constructor(e,n,s){if(this.bitmap=e,this.padding=n,this.hashCount=s,n<0||n>=8)throw new At(`Invalid padding: ${n}`);if(s<0)throw new At(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new At(`Invalid hash count: ${s}`);if(e.length===0&&n!==0)throw new At(`Invalid padding when bitmap length is 0: ${n}`);this.It=8*e.length-n,this.Tt=st.fromNumber(this.It)}Et(e,n,s){let r=e.add(n.multiply(st.fromNumber(s)));return r.compare(Pf)===1&&(r=new st([r.getBits(0),r.getBits(1)],0)),r.modulo(this.Tt).toNumber()}At(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}vt(e){if(this.It===0)return!1;const n=io(e),[s,r]=oo(n);for(let i=0;i<this.hashCount;i++){const o=this.Et(s,r,i);if(!this.At(o))return!1}return!0}static create(e,n,s){const r=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new Yr(i,r,n);return s.forEach((a=>o.insert(a))),o}insert(e){if(this.It===0)return;const n=io(e),[s,r]=oo(n);for(let i=0;i<this.hashCount;i++){const o=this.Et(s,r,i);this.Rt(o)}}Rt(e){const n=Math.floor(e/8),s=e%8;this.bitmap[n]|=1<<s}}class At extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hs{constructor(e,n,s,r,i){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=s,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,n,s){const r=new Map;return r.set(e,on.createSynthesizedTargetChangeForCurrentChange(e,n,s)),new hs(S.min(),r,new L(N),De(),_())}}class on{constructor(e,n,s,r,i){this.resumeToken=e,this.current=n,this.addedDocuments=s,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,n,s){return new on(s,n,_(),_(),_())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In{constructor(e,n,s,r){this.Pt=e,this.removedTargetIds=n,this.key=s,this.bt=r}}class hu{constructor(e,n){this.targetId=e,this.Vt=n}}class fu{constructor(e,n,s=ne.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=n,this.resumeToken=s,this.cause=r}}class ao{constructor(){this.St=0,this.Dt=co(),this.Ct=ne.EMPTY_BYTE_STRING,this.xt=!1,this.Nt=!0}get current(){return this.xt}get resumeToken(){return this.Ct}get kt(){return this.St!==0}get Mt(){return this.Nt}$t(e){e.approximateByteSize()>0&&(this.Nt=!0,this.Ct=e)}Ot(){let e=_(),n=_(),s=_();return this.Dt.forEach(((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:n=n.add(r);break;case 1:s=s.add(r);break;default:T()}})),new on(this.Ct,this.xt,e,n,s)}Ft(){this.Nt=!1,this.Dt=co()}Bt(e,n){this.Nt=!0,this.Dt=this.Dt.insert(e,n)}Lt(e){this.Nt=!0,this.Dt=this.Dt.remove(e)}qt(){this.St+=1}Ut(){this.St-=1}Kt(){this.Nt=!0,this.xt=!0}}class Ff{constructor(e){this.Gt=e,this.Qt=new Map,this.jt=De(),this.zt=uo(),this.Wt=new L(N)}Ht(e){for(const n of e.Pt)e.bt&&e.bt.isFoundDocument()?this.Jt(n,e.bt):this.Yt(n,e.key,e.bt);for(const n of e.removedTargetIds)this.Yt(n,e.key,e.bt)}Xt(e){this.forEachTarget(e,(n=>{const s=this.Zt(n);switch(e.state){case 0:this.te(n)&&s.$t(e.resumeToken);break;case 1:s.Ut(),s.kt||s.Ft(),s.$t(e.resumeToken);break;case 2:s.Ut(),s.kt||this.removeTarget(n);break;case 3:this.te(n)&&(s.Kt(),s.$t(e.resumeToken));break;case 4:this.te(n)&&(this.ee(n),s.$t(e.resumeToken));break;default:T()}}))}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Qt.forEach(((s,r)=>{this.te(r)&&n(r)}))}ne(e){var n;const s=e.targetId,r=e.Vt.count,i=this.se(s);if(i){const o=i.target;if(or(o))if(r===0){const a=new w(o.path);this.Yt(s,a,X.newNoDocument(a,S.min()))}else O(r===1);else{const a=this.ie(s);if(a!==r){const u=this.re(e,a);if(u!==0){this.ee(s);const c=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Wt=this.Wt.insert(s,c)}(n=Wr.instance)===null||n===void 0||n.notifyOnExistenceFilterMismatch((function(c,l,h){var d,p,E,D,A,B;const j={localCacheCount:l,existenceFilterCount:h.count},ie=h.unchangedNames;return ie&&(j.bloomFilter={applied:c===0,hashCount:(d=ie==null?void 0:ie.hashCount)!==null&&d!==void 0?d:0,bitmapLength:(D=(E=(p=ie==null?void 0:ie.bits)===null||p===void 0?void 0:p.bitmap)===null||E===void 0?void 0:E.length)!==null&&D!==void 0?D:0,padding:(B=(A=ie==null?void 0:ie.bits)===null||A===void 0?void 0:A.padding)!==null&&B!==void 0?B:0}),j})(u,a,e.Vt))}}}}re(e,n){const{unchangedNames:s,count:r}=e.Vt;if(!s||!s.bits)return 1;const{bits:{bitmap:i="",padding:o=0},hashCount:a=0}=s;let u,c;try{u=ze(i).toUint8Array()}catch(l){if(l instanceof Ba)return at("Decoding the base64 bloom filter in existence filter failed ("+l.message+"); ignoring the bloom filter and falling back to full re-query."),1;throw l}try{c=new Yr(u,o,a)}catch(l){return at(l instanceof At?"BloomFilter error: ":"Applying bloom filter failed: ",l),1}return c.It===0?1:r!==n-this.oe(e.targetId,c)?2:0}oe(e,n){const s=this.Gt.getRemoteKeysForTarget(e);let r=0;return s.forEach((i=>{const o=this.Gt.ue(),a=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;n.vt(a)||(this.Yt(e,i,null),r++)})),r}ce(e){const n=new Map;this.Qt.forEach(((i,o)=>{const a=this.se(o);if(a){if(i.current&&or(a.target)){const u=new w(a.target.path);this.jt.get(u)!==null||this.ae(o,u)||this.Yt(o,u,X.newNoDocument(u,e))}i.Mt&&(n.set(o,i.Ot()),i.Ft())}}));let s=_();this.zt.forEach(((i,o)=>{let a=!0;o.forEachWhile((u=>{const c=this.se(u);return!c||c.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)})),a&&(s=s.add(i))})),this.jt.forEach(((i,o)=>o.setReadTime(e)));const r=new hs(e,n,this.Wt,this.jt,s);return this.jt=De(),this.zt=uo(),this.Wt=new L(N),r}Jt(e,n){if(!this.te(e))return;const s=this.ae(e,n.key)?2:0;this.Zt(e).Bt(n.key,s),this.jt=this.jt.insert(n.key,n),this.zt=this.zt.insert(n.key,this.he(n.key).add(e))}Yt(e,n,s){if(!this.te(e))return;const r=this.Zt(e);this.ae(e,n)?r.Bt(n,1):r.Lt(n),this.zt=this.zt.insert(n,this.he(n).delete(e)),s&&(this.jt=this.jt.insert(n,s))}removeTarget(e){this.Qt.delete(e)}ie(e){const n=this.Zt(e).Ot();return this.Gt.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}qt(e){this.Zt(e).qt()}Zt(e){let n=this.Qt.get(e);return n||(n=new ao,this.Qt.set(e,n)),n}he(e){let n=this.zt.get(e);return n||(n=new te(N),this.zt=this.zt.insert(e,n)),n}te(e){const n=this.se(e)!==null;return n||v("WatchChangeAggregator","Detected inactive target",e),n}se(e){const n=this.Qt.get(e);return n&&n.kt?null:this.Gt.le(e)}ee(e){this.Qt.set(e,new ao),this.Gt.getRemoteKeysForTarget(e).forEach((n=>{this.Yt(e,n,null)}))}ae(e,n){return this.Gt.getRemoteKeysForTarget(e).has(n)}}function uo(){return new L(w.comparator)}function co(){return new L(w.comparator)}const Vf={asc:"ASCENDING",desc:"DESCENDING"},$f={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Uf={and:"AND",or:"OR"};class Bf{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function cr(t,e){return t.useProto3Json||os(e)?e:{value:e}}function $n(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function du(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function jf(t,e){return $n(t,e.toTimestamp())}function ve(t){return O(!!t),S.fromTimestamp((function(e){const n=xe(e);return new U(n.seconds,n.nanos)})(t))}function Xr(t,e){return(function(n){return new M(["projects",n.projectId,"databases",n.database])})(t).child("documents").child(e).canonicalString()}function gu(t){const e=M.fromString(t);return O(vu(e)),e}function lr(t,e){return Xr(t.databaseId,e.path)}function Ls(t,e){const n=gu(e);if(n.get(1)!==t.databaseId.projectId)throw new y(f.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new y(f.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new w(pu(n))}function hr(t,e){return Xr(t.databaseId,e)}function qf(t){const e=gu(t);return e.length===4?M.emptyPath():pu(e)}function fr(t){return new M(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function pu(t){return O(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function lo(t,e,n){return{name:lr(t,e),fields:n.value.mapValue.fields}}function zf(t,e){let n;if("targetChange"in e){e.targetChange;const s=(function(u){return u==="NO_CHANGE"?0:u==="ADD"?1:u==="REMOVE"?2:u==="CURRENT"?3:u==="RESET"?4:T()})(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],i=(function(u,c){return u.useProto3Json?(O(c===void 0||typeof c=="string"),ne.fromBase64String(c||"")):(O(c===void 0||c instanceof Uint8Array),ne.fromUint8Array(c||new Uint8Array))})(t,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&(function(u){const c=u.code===void 0?f.UNKNOWN:lu(u.code);return new y(c,u.message||"")})(o);n=new fu(s,r,i,a||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const r=Ls(t,s.document.name),i=ve(s.document.updateTime),o=s.document.createTime?ve(s.document.createTime):S.min(),a=new oe({mapValue:{fields:s.document.fields}}),u=X.newFoundDocument(r,i,o,a),c=s.targetIds||[],l=s.removedTargetIds||[];n=new In(c,l,u.key,u)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const r=Ls(t,s.document),i=s.readTime?ve(s.readTime):S.min(),o=X.newNoDocument(r,i),a=s.removedTargetIds||[];n=new In([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const r=Ls(t,s.document),i=s.removedTargetIds||[];n=new In([],i,r,null)}else{if(!("filter"in e))return T();{e.filter;const s=e.filter;s.targetId;const{count:r=0,unchangedNames:i}=s,o=new Mf(r,i),a=s.targetId;n=new hu(a,o)}}return n}function Kf(t,e){let n;if(e instanceof rn)n={update:lo(t,e.key,e.value)};else if(e instanceof Gr)n={delete:lr(t,e.key)};else if(e instanceof Pe)n={update:lo(t,e.key,e.data),updateMask:ed(e.fieldMask)};else{if(!(e instanceof kf))return T();n={verify:lr(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map((s=>(function(r,i){const o=i.transform;if(o instanceof Fn)return{fieldPath:i.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(o instanceof Ht)return{fieldPath:i.field.canonicalString(),appendMissingElements:{values:o.elements}};if(o instanceof Gt)return{fieldPath:i.field.canonicalString(),removeAllFromArray:{values:o.elements}};if(o instanceof Vn)return{fieldPath:i.field.canonicalString(),increment:o.gt};throw T()})(0,s)))),e.precondition.isNone||(n.currentDocument=(function(s,r){return r.updateTime!==void 0?{updateTime:jf(s,r.updateTime)}:r.exists!==void 0?{exists:r.exists}:T()})(t,e.precondition)),n}function Hf(t,e){return t&&t.length>0?(O(e!==void 0),t.map((n=>(function(s,r){let i=s.updateTime?ve(s.updateTime):ve(r);return i.isEqual(S.min())&&(i=ve(r)),new _f(i,s.transformResults||[])})(n,e)))):[]}function Gf(t,e){return{documents:[hr(t,e.path)]}}function Qf(t,e){const n={structuredQuery:{}},s=e.path;e.collectionGroup!==null?(n.parent=hr(t,s),n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(n.parent=hr(t,s.popLast()),n.structuredQuery.from=[{collectionId:s.lastSegment()}]);const r=(function(u){if(u.length!==0)return yu(fe.create(u,"and"))})(e.filters);r&&(n.structuredQuery.where=r);const i=(function(u){if(u.length!==0)return u.map((c=>(function(l){return{field:Je(l.field),direction:Xf(l.dir)}})(c)))})(e.orderBy);i&&(n.structuredQuery.orderBy=i);const o=cr(t,e.limit);var a;return o!==null&&(n.structuredQuery.limit=o),e.startAt&&(n.structuredQuery.startAt={before:(a=e.startAt).inclusive,values:a.position}),e.endAt&&(n.structuredQuery.endAt=(function(u){return{before:!u.inclusive,values:u.position}})(e.endAt)),n}function Wf(t){let e=qf(t.parent);const n=t.structuredQuery,s=n.from?n.from.length:0;let r=null;if(s>0){O(s===1);const l=n.from[0];l.allDescendants?r=l.collectionId:e=e.child(l.collectionId)}let i=[];n.where&&(i=(function(l){const h=mu(l);return h instanceof fe&&Ka(h)?h.getFilters():[h]})(n.where));let o=[];n.orderBy&&(o=n.orderBy.map((l=>(function(h){return new Nt(Ze(h.field),(function(d){switch(d){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(h.direction))})(l))));let a=null;n.limit&&(a=(function(l){let h;return h=typeof l=="object"?l.value:l,os(h)?null:h})(n.limit));let u=null;n.startAt&&(u=(function(l){const h=!!l.before,d=l.values||[];return new Ln(d,h)})(n.startAt));let c=null;return n.endAt&&(c=(function(l){const h=!l.before,d=l.values||[];return new Ln(d,h)})(n.endAt)),pf(e,r,o,i,a,"F",u,c)}function Yf(t,e){const n=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return T()}})(e.purpose);return n==null?null:{"goog-listen-tags":n}}function mu(t){return t.unaryFilter!==void 0?(function(e){switch(e.unaryFilter.op){case"IS_NAN":const n=Ze(e.unaryFilter.field);return $.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=Ze(e.unaryFilter.field);return $.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=Ze(e.unaryFilter.field);return $.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const i=Ze(e.unaryFilter.field);return $.create(i,"!=",{nullValue:"NULL_VALUE"});default:return T()}})(t):t.fieldFilter!==void 0?(function(e){return $.create(Ze(e.fieldFilter.field),(function(n){switch(n){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return T()}})(e.fieldFilter.op),e.fieldFilter.value)})(t):t.compositeFilter!==void 0?(function(e){return fe.create(e.compositeFilter.filters.map((n=>mu(n))),(function(n){switch(n){case"AND":return"and";case"OR":return"or";default:return T()}})(e.compositeFilter.op))})(t):T()}function Xf(t){return Vf[t]}function Jf(t){return $f[t]}function Zf(t){return Uf[t]}function Je(t){return{fieldPath:t.canonicalString()}}function Ze(t){return J.fromServerFormat(t.fieldPath)}function yu(t){return t instanceof $?(function(e){if(e.op==="=="){if(Yi(e.value))return{unaryFilter:{field:Je(e.field),op:"IS_NAN"}};if(Wi(e.value))return{unaryFilter:{field:Je(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if(Yi(e.value))return{unaryFilter:{field:Je(e.field),op:"IS_NOT_NAN"}};if(Wi(e.value))return{unaryFilter:{field:Je(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Je(e.field),op:Jf(e.op),value:e.value}}})(t):t instanceof fe?(function(e){const n=e.getFilters().map((s=>yu(s)));return n.length===1?n[0]:{compositeFilter:{op:Zf(e.op),filters:n}}})(t):T()}function ed(t){const e=[];return t.fields.forEach((n=>e.push(n.canonicalString()))),{fieldPaths:e}}function vu(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _e{constructor(e,n,s,r,i=S.min(),o=S.min(),a=ne.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=n,this.purpose=s,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=u}withSequenceNumber(e){return new _e(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new _e(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new _e(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new _e(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class td{constructor(e){this.fe=e}}function nd(t){const e=Wf({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?Pn(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sd{constructor(){this.rn=new rd}addToCollectionParentIndex(e,n){return this.rn.add(n),g.resolve()}getCollectionParents(e,n){return g.resolve(this.rn.getEntries(n))}addFieldIndex(e,n){return g.resolve()}deleteFieldIndex(e,n){return g.resolve()}getDocumentsMatchingTarget(e,n){return g.resolve(null)}getIndexType(e,n){return g.resolve(0)}getFieldIndexes(e,n){return g.resolve([])}getNextCollectionGroupToUpdate(e){return g.resolve(null)}getMinOffset(e,n){return g.resolve(Re.min())}getMinOffsetFromCollectionGroup(e,n){return g.resolve(Re.min())}updateCollectionGroup(e,n,s){return g.resolve()}updateIndexEntries(e,n){return g.resolve()}}class rd{constructor(){this.index={}}add(e){const n=e.lastSegment(),s=e.popLast(),r=this.index[n]||new te(M.comparator),i=!r.has(s);return this.index[n]=r.add(s),i}has(e){const n=e.lastSegment(),s=e.popLast(),r=this.index[n];return r&&r.has(s)}getEntries(e){return(this.index[e]||new te(M.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht{constructor(e){this.Nn=e}next(){return this.Nn+=2,this.Nn}static kn(){return new ht(0)}static Mn(){return new ht(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class id{constructor(){this.changes=new vt((e=>e.toString()),((e,n)=>e.isEqual(n))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,X.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const s=this.changes.get(n);return s!==void 0?g.resolve(s):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class od{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ad{constructor(e,n,s,r){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=s,this.indexManager=r}getDocument(e,n){let s=null;return this.documentOverlayCache.getOverlay(e,n).next((r=>(s=r,this.remoteDocumentCache.getEntry(e,n)))).next((r=>(s!==null&&Rt(s.mutation,r,ae.empty(),U.now()),r)))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next((s=>this.getLocalViewOfDocuments(e,s,_()).next((()=>s))))}getLocalViewOfDocuments(e,n,s=_()){const r=Ue();return this.populateOverlays(e,r,n).next((()=>this.computeViews(e,n,r,s).next((i=>{let o=Ct();return i.forEach(((a,u)=>{o=o.insert(a,u.overlayedDocument)})),o}))))}getOverlayedDocuments(e,n){const s=Ue();return this.populateOverlays(e,s,n).next((()=>this.computeViews(e,n,s,_())))}populateOverlays(e,n,s){const r=[];return s.forEach((i=>{n.has(i)||r.push(i)})),this.documentOverlayCache.getOverlays(e,r).next((i=>{i.forEach(((o,a)=>{n.set(o,a)}))}))}computeViews(e,n,s,r){let i=De();const o=kt(),a=kt();return n.forEach(((u,c)=>{const l=s.get(c.key);r.has(c.key)&&(l===void 0||l.mutation instanceof Pe)?i=i.insert(c.key,c):l!==void 0?(o.set(c.key,l.mutation.getFieldMask()),Rt(l.mutation,c,l.mutation.getFieldMask(),U.now())):o.set(c.key,ae.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((c,l)=>o.set(c,l))),n.forEach(((c,l)=>{var h;return a.set(c,new od(l,(h=o.get(c))!==null&&h!==void 0?h:null))})),a)))}recalculateAndSaveOverlays(e,n){const s=kt();let r=new L(((o,a)=>o-a)),i=_();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next((o=>{for(const a of o)a.keys().forEach((u=>{const c=n.get(u);if(c===null)return;let l=s.get(u)||ae.empty();l=a.applyToLocalView(c,l),s.set(u,l);const h=(r.get(a.batchId)||_()).add(u);r=r.insert(a.batchId,h)}))})).next((()=>{const o=[],a=r.getReverseIterator();for(;a.hasNext();){const u=a.getNext(),c=u.key,l=u.value,h=tu();l.forEach((d=>{if(!i.has(d)){const p=uu(n.get(d),s.get(d));p!==null&&h.set(d,p),i=i.add(d)}})),o.push(this.documentOverlayCache.saveOverlays(e,c,h))}return g.waitFor(o)})).next((()=>s))}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next((s=>this.recalculateAndSaveOverlays(e,s)))}getDocumentsMatchingQuery(e,n,s){return(function(r){return w.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0})(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):Ya(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,s):this.getDocumentsMatchingCollectionQuery(e,n,s)}getNextDocuments(e,n,s,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,s,r).next((i=>{const o=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,s.largestBatchId,r-i.size):g.resolve(Ue());let a=-1,u=i;return o.next((c=>g.forEach(c,((l,h)=>(a<h.largestBatchId&&(a=h.largestBatchId),i.get(l)?g.resolve():this.remoteDocumentCache.getEntry(e,l).next((d=>{u=u.insert(l,d)}))))).next((()=>this.populateOverlays(e,c,i))).next((()=>this.computeViews(e,u,c,_()))).next((l=>({batchId:a,changes:eu(l)})))))}))}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new w(n)).next((s=>{let r=Ct();return s.isFoundDocument()&&(r=r.insert(s.key,s)),r}))}getDocumentsMatchingCollectionGroupQuery(e,n,s){const r=n.collectionGroup;let i=Ct();return this.indexManager.getCollectionParents(e,r).next((o=>g.forEach(o,(a=>{const u=(function(c,l){return new sn(l,null,c.explicitOrderBy.slice(),c.filters.slice(),c.limit,c.limitType,c.startAt,c.endAt)})(n,a.child(r));return this.getDocumentsMatchingCollectionQuery(e,u,s).next((c=>{c.forEach(((l,h)=>{i=i.insert(l,h)}))}))})).next((()=>i))))}getDocumentsMatchingCollectionQuery(e,n,s){let r;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,s.largestBatchId).next((i=>(r=i,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,s,r)))).next((i=>{r.forEach(((a,u)=>{const c=u.getKey();i.get(c)===null&&(i=i.insert(c,X.newInvalidDocument(c)))}));let o=Ct();return i.forEach(((a,u)=>{const c=r.get(a);c!==void 0&&Rt(c.mutation,u,ae.empty(),U.now()),us(n,u)&&(o=o.insert(a,u))})),o}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ud{constructor(e){this.serializer=e,this.cs=new Map,this.hs=new Map}getBundleMetadata(e,n){return g.resolve(this.cs.get(n))}saveBundleMetadata(e,n){var s;return this.cs.set(n.id,{id:(s=n).id,version:s.version,createTime:ve(s.createTime)}),g.resolve()}getNamedQuery(e,n){return g.resolve(this.hs.get(n))}saveNamedQuery(e,n){return this.hs.set(n.name,(function(s){return{name:s.name,query:nd(s.bundledQuery),readTime:ve(s.readTime)}})(n)),g.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cd{constructor(){this.overlays=new L(w.comparator),this.ls=new Map}getOverlay(e,n){return g.resolve(this.overlays.get(n))}getOverlays(e,n){const s=Ue();return g.forEach(n,(r=>this.getOverlay(e,r).next((i=>{i!==null&&s.set(r,i)})))).next((()=>s))}saveOverlays(e,n,s){return s.forEach(((r,i)=>{this.we(e,n,i)})),g.resolve()}removeOverlaysForBatchId(e,n,s){const r=this.ls.get(s);return r!==void 0&&(r.forEach((i=>this.overlays=this.overlays.remove(i))),this.ls.delete(s)),g.resolve()}getOverlaysForCollection(e,n,s){const r=Ue(),i=n.length+1,o=new w(n.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const u=a.getNext().value,c=u.getKey();if(!n.isPrefixOf(c.path))break;c.path.length===i&&u.largestBatchId>s&&r.set(u.getKey(),u)}return g.resolve(r)}getOverlaysForCollectionGroup(e,n,s,r){let i=new L(((c,l)=>c-l));const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===n&&c.largestBatchId>s){let l=i.get(c.largestBatchId);l===null&&(l=Ue(),i=i.insert(c.largestBatchId,l)),l.set(c.getKey(),c)}}const a=Ue(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((c,l)=>a.set(c,l))),!(a.size()>=r)););return g.resolve(a)}we(e,n,s){const r=this.overlays.get(s.key);if(r!==null){const o=this.ls.get(r.largestBatchId).delete(s.key);this.ls.set(r.largestBatchId,o)}this.overlays=this.overlays.insert(s.key,new xf(n,s));let i=this.ls.get(n);i===void 0&&(i=_(),this.ls.set(n,i)),this.ls.set(n,i.add(s.key))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jr{constructor(){this.fs=new te(q.ds),this.ws=new te(q._s)}isEmpty(){return this.fs.isEmpty()}addReference(e,n){const s=new q(e,n);this.fs=this.fs.add(s),this.ws=this.ws.add(s)}gs(e,n){e.forEach((s=>this.addReference(s,n)))}removeReference(e,n){this.ys(new q(e,n))}ps(e,n){e.forEach((s=>this.removeReference(s,n)))}Is(e){const n=new w(new M([])),s=new q(n,e),r=new q(n,e+1),i=[];return this.ws.forEachInRange([s,r],(o=>{this.ys(o),i.push(o.key)})),i}Ts(){this.fs.forEach((e=>this.ys(e)))}ys(e){this.fs=this.fs.delete(e),this.ws=this.ws.delete(e)}Es(e){const n=new w(new M([])),s=new q(n,e),r=new q(n,e+1);let i=_();return this.ws.forEachInRange([s,r],(o=>{i=i.add(o.key)})),i}containsKey(e){const n=new q(e,0),s=this.fs.firstAfterOrEqual(n);return s!==null&&e.isEqual(s.key)}}class q{constructor(e,n){this.key=e,this.As=n}static ds(e,n){return w.comparator(e.key,n.key)||N(e.As,n.As)}static _s(e,n){return N(e.As,n.As)||w.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ld{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.vs=1,this.Rs=new te(q.ds)}checkEmpty(e){return g.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,s,r){const i=this.vs;this.vs++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new Rf(i,n,s,r);this.mutationQueue.push(o);for(const a of r)this.Rs=this.Rs.add(new q(a.key,i)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return g.resolve(o)}lookupMutationBatch(e,n){return g.resolve(this.Ps(n))}getNextMutationBatchAfterBatchId(e,n){const s=n+1,r=this.bs(s),i=r<0?0:r;return g.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return g.resolve(this.mutationQueue.length===0?-1:this.vs-1)}getAllMutationBatches(e){return g.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const s=new q(n,0),r=new q(n,Number.POSITIVE_INFINITY),i=[];return this.Rs.forEachInRange([s,r],(o=>{const a=this.Ps(o.As);i.push(a)})),g.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,n){let s=new te(N);return n.forEach((r=>{const i=new q(r,0),o=new q(r,Number.POSITIVE_INFINITY);this.Rs.forEachInRange([i,o],(a=>{s=s.add(a.As)}))})),g.resolve(this.Vs(s))}getAllMutationBatchesAffectingQuery(e,n){const s=n.path,r=s.length+1;let i=s;w.isDocumentKey(i)||(i=i.child(""));const o=new q(new w(i),0);let a=new te(N);return this.Rs.forEachWhile((u=>{const c=u.key.path;return!!s.isPrefixOf(c)&&(c.length===r&&(a=a.add(u.As)),!0)}),o),g.resolve(this.Vs(a))}Vs(e){const n=[];return e.forEach((s=>{const r=this.Ps(s);r!==null&&n.push(r)})),n}removeMutationBatch(e,n){O(this.Ss(n.batchId,"removed")===0),this.mutationQueue.shift();let s=this.Rs;return g.forEach(n.mutations,(r=>{const i=new q(r.key,n.batchId);return s=s.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)})).next((()=>{this.Rs=s}))}Cn(e){}containsKey(e,n){const s=new q(n,0),r=this.Rs.firstAfterOrEqual(s);return g.resolve(n.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,g.resolve()}Ss(e,n){return this.bs(e)}bs(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Ps(e){const n=this.bs(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hd{constructor(e){this.Ds=e,this.docs=new L(w.comparator),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const s=n.key,r=this.docs.get(s),i=r?r.size:0,o=this.Ds(n);return this.docs=this.docs.insert(s,{document:n.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const s=this.docs.get(n);return g.resolve(s?s.document.mutableCopy():X.newInvalidDocument(n))}getEntries(e,n){let s=De();return n.forEach((r=>{const i=this.docs.get(r);s=s.insert(r,i?i.document.mutableCopy():X.newInvalidDocument(r))})),g.resolve(s)}getDocumentsMatchingQuery(e,n,s,r){let i=De();const o=n.path,a=new w(o.child("")),u=this.docs.getIteratorFrom(a);for(;u.hasNext();){const{key:c,value:{document:l}}=u.getNext();if(!o.isPrefixOf(c.path))break;c.path.length>o.length+1||Xh(Yh(l),s)<=0||(r.has(l.key)||us(n,l))&&(i=i.insert(l.key,l.mutableCopy()))}return g.resolve(i)}getAllFromCollectionGroup(e,n,s,r){T()}Cs(e,n){return g.forEach(this.docs,(s=>n(s)))}newChangeBuffer(e){return new fd(this)}getSize(e){return g.resolve(this.size)}}class fd extends id{constructor(e){super(),this.os=e}applyChanges(e){const n=[];return this.changes.forEach(((s,r)=>{r.isValidDocument()?n.push(this.os.addEntry(e,r)):this.os.removeEntry(s)})),g.waitFor(n)}getFromCache(e,n){return this.os.getEntry(e,n)}getAllFromCache(e,n){return this.os.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dd{constructor(e){this.persistence=e,this.xs=new vt((n=>qr(n)),zr),this.lastRemoteSnapshotVersion=S.min(),this.highestTargetId=0,this.Ns=0,this.ks=new Jr,this.targetCount=0,this.Ms=ht.kn()}forEachTarget(e,n){return this.xs.forEach(((s,r)=>n(r))),g.resolve()}getLastRemoteSnapshotVersion(e){return g.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return g.resolve(this.Ns)}allocateTargetId(e){return this.highestTargetId=this.Ms.next(),g.resolve(this.highestTargetId)}setTargetsMetadata(e,n,s){return s&&(this.lastRemoteSnapshotVersion=s),n>this.Ns&&(this.Ns=n),g.resolve()}Fn(e){this.xs.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.Ms=new ht(n),this.highestTargetId=n),e.sequenceNumber>this.Ns&&(this.Ns=e.sequenceNumber)}addTargetData(e,n){return this.Fn(n),this.targetCount+=1,g.resolve()}updateTargetData(e,n){return this.Fn(n),g.resolve()}removeTargetData(e,n){return this.xs.delete(n.target),this.ks.Is(n.targetId),this.targetCount-=1,g.resolve()}removeTargets(e,n,s){let r=0;const i=[];return this.xs.forEach(((o,a)=>{a.sequenceNumber<=n&&s.get(a.targetId)===null&&(this.xs.delete(o),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),r++)})),g.waitFor(i).next((()=>r))}getTargetCount(e){return g.resolve(this.targetCount)}getTargetData(e,n){const s=this.xs.get(n)||null;return g.resolve(s)}addMatchingKeys(e,n,s){return this.ks.gs(n,s),g.resolve()}removeMatchingKeys(e,n,s){this.ks.ps(n,s);const r=this.persistence.referenceDelegate,i=[];return r&&n.forEach((o=>{i.push(r.markPotentiallyOrphaned(e,o))})),g.waitFor(i)}removeMatchingKeysForTargetId(e,n){return this.ks.Is(n),g.resolve()}getMatchingKeysForTargetId(e,n){const s=this.ks.Es(n);return g.resolve(s)}containsKey(e,n){return g.resolve(this.ks.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gd{constructor(e,n){this.$s={},this.overlays={},this.Os=new $r(0),this.Fs=!1,this.Fs=!0,this.referenceDelegate=e(this),this.Bs=new dd(this),this.indexManager=new sd,this.remoteDocumentCache=(function(s){return new hd(s)})((s=>this.referenceDelegate.Ls(s))),this.serializer=new td(n),this.qs=new ud(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Fs=!1,Promise.resolve()}get started(){return this.Fs}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new cd,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let s=this.$s[e.toKey()];return s||(s=new ld(n,this.referenceDelegate),this.$s[e.toKey()]=s),s}getTargetCache(){return this.Bs}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.qs}runTransaction(e,n,s){v("MemoryPersistence","Starting transaction:",e);const r=new pd(this.Os.next());return this.referenceDelegate.Us(),s(r).next((i=>this.referenceDelegate.Ks(r).next((()=>i)))).toPromise().then((i=>(r.raiseOnCommittedEvent(),i)))}Gs(e,n){return g.or(Object.values(this.$s).map((s=>()=>s.containsKey(e,n))))}}class pd extends Zh{constructor(e){super(),this.currentSequenceNumber=e}}class Zr{constructor(e){this.persistence=e,this.Qs=new Jr,this.js=null}static zs(e){return new Zr(e)}get Ws(){if(this.js)return this.js;throw T()}addReference(e,n,s){return this.Qs.addReference(s,n),this.Ws.delete(s.toString()),g.resolve()}removeReference(e,n,s){return this.Qs.removeReference(s,n),this.Ws.add(s.toString()),g.resolve()}markPotentiallyOrphaned(e,n){return this.Ws.add(n.toString()),g.resolve()}removeTarget(e,n){this.Qs.Is(n.targetId).forEach((r=>this.Ws.add(r.toString())));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,n.targetId).next((r=>{r.forEach((i=>this.Ws.add(i.toString())))})).next((()=>s.removeTargetData(e,n)))}Us(){this.js=new Set}Ks(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return g.forEach(this.Ws,(s=>{const r=w.fromPath(s);return this.Hs(e,r).next((i=>{i||n.removeEntry(r,S.min())}))})).next((()=>(this.js=null,n.apply(e))))}updateLimboDocument(e,n){return this.Hs(e,n).next((s=>{s?this.Ws.delete(n.toString()):this.Ws.add(n.toString())}))}Ls(e){return 0}Hs(e,n){return g.or([()=>g.resolve(this.Qs.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Gs(e,n)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ei{constructor(e,n,s,r){this.targetId=e,this.fromCache=n,this.Fi=s,this.Bi=r}static Li(e,n){let s=_(),r=_();for(const i of n.docChanges)switch(i.type){case 0:s=s.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new ei(e,n.fromCache,s,r)}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class md{constructor(){this.qi=!1}initialize(e,n){this.Ui=e,this.indexManager=n,this.qi=!0}getDocumentsMatchingQuery(e,n,s,r){return this.Ki(e,n).next((i=>i||this.Gi(e,n,r,s))).next((i=>i||this.Qi(e,n)))}Ki(e,n){if(eo(n))return g.resolve(null);let s=Ae(n);return this.indexManager.getIndexType(e,s).next((r=>r===0?null:(n.limit!==null&&r===1&&(n=Pn(n,null,"F"),s=Ae(n)),this.indexManager.getDocumentsMatchingTarget(e,s).next((i=>{const o=_(...i);return this.Ui.getDocuments(e,o).next((a=>this.indexManager.getMinOffset(e,s).next((u=>{const c=this.ji(n,a);return this.zi(n,c,o,u.readTime)?this.Ki(e,Pn(n,null,"F")):this.Wi(e,c,n,u)}))))})))))}Gi(e,n,s,r){return eo(n)||r.isEqual(S.min())?this.Qi(e,n):this.Ui.getDocuments(e,s).next((i=>{const o=this.ji(n,i);return this.zi(n,o,s,r)?this.Qi(e,n):(zi()<=k.DEBUG&&v("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),ur(n)),this.Wi(e,o,n,Wh(r,-1)))}))}ji(e,n){let s=new te(Ja(e));return n.forEach(((r,i)=>{us(e,i)&&(s=s.add(i))})),s}zi(e,n,s,r){if(e.limit===null)return!1;if(s.size!==n.size)return!0;const i=e.limitType==="F"?n.last():n.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}Qi(e,n){return zi()<=k.DEBUG&&v("QueryEngine","Using full collection scan to execute query:",ur(n)),this.Ui.getDocumentsMatchingQuery(e,n,Re.min())}Wi(e,n,s,r){return this.Ui.getDocumentsMatchingQuery(e,s,r).next((i=>(n.forEach((o=>{i=i.insert(o.key,o)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yd{constructor(e,n,s,r){this.persistence=e,this.Hi=n,this.serializer=r,this.Ji=new L(N),this.Yi=new vt((i=>qr(i)),zr),this.Xi=new Map,this.Zi=e.getRemoteDocumentCache(),this.Bs=e.getTargetCache(),this.qs=e.getBundleCache(),this.tr(s)}tr(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new ad(this.Zi,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Zi.setIndexManager(this.indexManager),this.Hi.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(n=>e.collect(n,this.Ji)))}}function vd(t,e,n,s){return new yd(t,e,n,s)}async function wu(t,e){const n=C(t);return await n.persistence.runTransaction("Handle user change","readonly",(s=>{let r;return n.mutationQueue.getAllMutationBatches(s).next((i=>(r=i,n.tr(e),n.mutationQueue.getAllMutationBatches(s)))).next((i=>{const o=[],a=[];let u=_();for(const c of r){o.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}for(const c of i){a.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}return n.localDocuments.getDocuments(s,u).next((c=>({er:c,removedBatchIds:o,addedBatchIds:a})))}))}))}function wd(t,e){const n=C(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",(s=>{const r=e.batch.keys(),i=n.Zi.newChangeBuffer({trackRemovals:!0});return(function(o,a,u,c){const l=u.batch,h=l.keys();let d=g.resolve();return h.forEach((p=>{d=d.next((()=>c.getEntry(a,p))).next((E=>{const D=u.docVersions.get(p);O(D!==null),E.version.compareTo(D)<0&&(l.applyToRemoteDocument(E,u),E.isValidDocument()&&(E.setReadTime(u.commitVersion),c.addEntry(E)))}))})),d.next((()=>o.mutationQueue.removeMutationBatch(a,l)))})(n,s,e,i).next((()=>i.apply(s))).next((()=>n.mutationQueue.performConsistencyCheck(s))).next((()=>n.documentOverlayCache.removeOverlaysForBatchId(s,r,e.batch.batchId))).next((()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,(function(o){let a=_();for(let u=0;u<o.mutationResults.length;++u)o.mutationResults[u].transformResults.length>0&&(a=a.add(o.batch.mutations[u].key));return a})(e)))).next((()=>n.localDocuments.getDocuments(s,r)))}))}function Eu(t){const e=C(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(n=>e.Bs.getLastRemoteSnapshotVersion(n)))}function Ed(t,e){const n=C(t),s=e.snapshotVersion;let r=n.Ji;return n.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const o=n.Zi.newChangeBuffer({trackRemovals:!0});r=n.Ji;const a=[];e.targetChanges.forEach(((l,h)=>{const d=r.get(h);if(!d)return;a.push(n.Bs.removeMatchingKeys(i,l.removedDocuments,h).next((()=>n.Bs.addMatchingKeys(i,l.addedDocuments,h))));let p=d.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(h)!==null?p=p.withResumeToken(ne.EMPTY_BYTE_STRING,S.min()).withLastLimboFreeSnapshotVersion(S.min()):l.resumeToken.approximateByteSize()>0&&(p=p.withResumeToken(l.resumeToken,s)),r=r.insert(h,p),(function(E,D,A){return E.resumeToken.approximateByteSize()===0||D.snapshotVersion.toMicroseconds()-E.snapshotVersion.toMicroseconds()>=3e8?!0:A.addedDocuments.size+A.modifiedDocuments.size+A.removedDocuments.size>0})(d,p,l)&&a.push(n.Bs.updateTargetData(i,p))}));let u=De(),c=_();if(e.documentUpdates.forEach((l=>{e.resolvedLimboDocuments.has(l)&&a.push(n.persistence.referenceDelegate.updateLimboDocument(i,l))})),a.push(Td(i,o,e.documentUpdates).next((l=>{u=l.nr,c=l.sr}))),!s.isEqual(S.min())){const l=n.Bs.getLastRemoteSnapshotVersion(i).next((h=>n.Bs.setTargetsMetadata(i,i.currentSequenceNumber,s)));a.push(l)}return g.waitFor(a).next((()=>o.apply(i))).next((()=>n.localDocuments.getLocalViewOfDocuments(i,u,c))).next((()=>u))})).then((i=>(n.Ji=r,i)))}function Td(t,e,n){let s=_(),r=_();return n.forEach((i=>s=s.add(i))),e.getEntries(t,s).next((i=>{let o=De();return n.forEach(((a,u)=>{const c=i.get(a);u.isFoundDocument()!==c.isFoundDocument()&&(r=r.add(a)),u.isNoDocument()&&u.version.isEqual(S.min())?(e.removeEntry(a,u.readTime),o=o.insert(a,u)):!c.isValidDocument()||u.version.compareTo(c.version)>0||u.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(u),o=o.insert(a,u)):v("LocalStore","Ignoring outdated watch update for ",a,". Current version:",c.version," Watch version:",u.version)})),{nr:o,sr:r}}))}function Id(t,e){const n=C(t);return n.persistence.runTransaction("Get next mutation batch","readonly",(s=>(e===void 0&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(s,e))))}function Sd(t,e){const n=C(t);return n.persistence.runTransaction("Allocate target","readwrite",(s=>{let r;return n.Bs.getTargetData(s,e).next((i=>i?(r=i,g.resolve(r)):n.Bs.allocateTargetId(s).next((o=>(r=new _e(e,o,"TargetPurposeListen",s.currentSequenceNumber),n.Bs.addTargetData(s,r).next((()=>r)))))))})).then((s=>{const r=n.Ji.get(s.targetId);return(r===null||s.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.Ji=n.Ji.insert(s.targetId,s),n.Yi.set(e,s.targetId)),s}))}async function dr(t,e,n){const s=C(t),r=s.Ji.get(e),i=n?"readwrite":"readwrite-primary";try{n||await s.persistence.runTransaction("Release target",i,(o=>s.persistence.referenceDelegate.removeTarget(o,r)))}catch(o){if(!nn(o))throw o;v("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}s.Ji=s.Ji.remove(e),s.Yi.delete(r.target)}function ho(t,e,n){const s=C(t);let r=S.min(),i=_();return s.persistence.runTransaction("Execute query","readonly",(o=>(function(a,u,c){const l=C(a),h=l.Yi.get(c);return h!==void 0?g.resolve(l.Ji.get(h)):l.Bs.getTargetData(u,c)})(s,o,Ae(e)).next((a=>{if(a)return r=a.lastLimboFreeSnapshotVersion,s.Bs.getMatchingKeysForTargetId(o,a.targetId).next((u=>{i=u}))})).next((()=>s.Hi.getDocumentsMatchingQuery(o,e,n?r:S.min(),n?i:_()))).next((a=>(Cd(s,mf(e),a),{documents:a,ir:i})))))}function Cd(t,e,n){let s=t.Xi.get(e)||S.min();n.forEach(((r,i)=>{i.readTime.compareTo(s)>0&&(s=i.readTime)})),t.Xi.set(e,s)}class fo{constructor(){this.activeTargetIds=If()}lr(e){this.activeTargetIds=this.activeTargetIds.add(e)}dr(e){this.activeTargetIds=this.activeTargetIds.delete(e)}hr(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Ad{constructor(){this.Hr=new fo,this.Jr={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,s){}addLocalQueryTarget(e){return this.Hr.lr(e),this.Jr[e]||"not-current"}updateQueryState(e,n,s){this.Jr[e]=n}removeLocalQueryTarget(e){this.Hr.dr(e)}isLocalQueryTarget(e){return this.Hr.activeTargetIds.has(e)}clearQueryState(e){delete this.Jr[e]}getAllActiveQueryTargets(){return this.Hr.activeTargetIds}isActiveQueryTarget(e){return this.Hr.activeTargetIds.has(e)}start(){return this.Hr=new fo,Promise.resolve()}handleUserChange(e,n,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dd{Yr(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class go{constructor(){this.Xr=()=>this.Zr(),this.eo=()=>this.no(),this.so=[],this.io()}Yr(e){this.so.push(e)}shutdown(){window.removeEventListener("online",this.Xr),window.removeEventListener("offline",this.eo)}io(){window.addEventListener("online",this.Xr),window.addEventListener("offline",this.eo)}Zr(){v("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.so)e(0)}no(){v("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.so)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let wn=null;function Ps(){return wn===null?wn=268435456+Math.round(2147483648*Math.random()):wn++,"0x"+wn.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _d={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bd{constructor(e){this.ro=e.ro,this.oo=e.oo}uo(e){this.co=e}ao(e){this.ho=e}onMessage(e){this.lo=e}close(){this.oo()}send(e){this.ro(e)}fo(){this.co()}wo(e){this.ho(e)}_o(e){this.lo(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const W="WebChannelConnection";class Nd extends class{constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const n=e.ssl?"https":"http";this.mo=n+"://"+e.host,this.yo="projects/"+this.databaseId.projectId+"/databases/"+this.databaseId.database+"/documents"}get po(){return!1}Io(e,n,s,r,i){const o=Ps(),a=this.To(e,n);v("RestConnection",`Sending RPC '${e}' ${o}:`,a,s);const u={};return this.Eo(u,r,i),this.Ao(e,a,u,s).then((c=>(v("RestConnection",`Received RPC '${e}' ${o}: `,c),c)),(c=>{throw at("RestConnection",`RPC '${e}' ${o} failed with error: `,c,"url: ",a,"request:",s),c}))}vo(e,n,s,r,i,o){return this.Io(e,n,s,r,i)}Eo(e,n,s){e["X-Goog-Api-Client"]="gl-js/ fire/"+yt,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach(((r,i)=>e[i]=r)),s&&s.headers.forEach(((r,i)=>e[i]=r))}To(e,n){const s=_d[e];return`${this.mo}/v1/${n}:${s}`}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Ao(e,n,s,r){const i=Ps();return new Promise(((o,a)=>{const u=new Vh;u.setWithCredentials(!0),u.listenOnce(Lh.COMPLETE,(()=>{try{switch(u.getLastErrorCode()){case Os.NO_ERROR:const l=u.getResponseJson();v(W,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(l)),o(l);break;case Os.TIMEOUT:v(W,`RPC '${e}' ${i} timed out`),a(new y(f.DEADLINE_EXCEEDED,"Request time out"));break;case Os.HTTP_ERROR:const h=u.getStatus();if(v(W,`RPC '${e}' ${i} failed with status:`,h,"response text:",u.getResponseText()),h>0){let d=u.getResponseJson();Array.isArray(d)&&(d=d[0]);const p=d==null?void 0:d.error;if(p&&p.status&&p.message){const E=(function(D){const A=D.toLowerCase().replace(/_/g,"-");return Object.values(f).indexOf(A)>=0?A:f.UNKNOWN})(p.status);a(new y(E,p.message))}else a(new y(f.UNKNOWN,"Server responded with status "+u.getStatus()))}else a(new y(f.UNAVAILABLE,"Connection failed."));break;default:T()}}finally{v(W,`RPC '${e}' ${i} completed.`)}}));const c=JSON.stringify(r);v(W,`RPC '${e}' ${i} sending request:`,r),u.send(n,"POST",c,s,15)}))}Ro(e,n,s){const r=Ps(),i=[this.mo,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=Mh(),a=Oh(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(u.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(u.xmlHttpFactory=new Fh({})),this.Eo(u.initMessageHeaders,n,s),u.encodeInitMessageHeaders=!0;const l=i.join("");v(W,`Creating RPC '${e}' stream ${r}: ${l}`,u);const h=o.createWebChannel(l,u);let d=!1,p=!1;const E=new bd({ro:A=>{p?v(W,`Not sending because RPC '${e}' stream ${r} is closed:`,A):(d||(v(W,`Opening RPC '${e}' stream ${r} transport.`),h.open(),d=!0),v(W,`RPC '${e}' stream ${r} sending:`,A),h.send(A))},oo:()=>h.close()}),D=(A,B,j)=>{A.listen(B,(ie=>{try{j(ie)}catch(ge){setTimeout((()=>{throw ge}),0)}}))};return D(h,pn.EventType.OPEN,(()=>{p||v(W,`RPC '${e}' stream ${r} transport opened.`)})),D(h,pn.EventType.CLOSE,(()=>{p||(p=!0,v(W,`RPC '${e}' stream ${r} transport closed`),E.wo())})),D(h,pn.EventType.ERROR,(A=>{p||(p=!0,at(W,`RPC '${e}' stream ${r} transport errored:`,A),E.wo(new y(f.UNAVAILABLE,"The operation could not be completed")))})),D(h,pn.EventType.MESSAGE,(A=>{var B;if(!p){const j=A.data[0];O(!!j);const ie=j,ge=ie.error||((B=ie[0])===null||B===void 0?void 0:B.error);if(ge){v(W,`RPC '${e}' stream ${r} received error:`,ge);const ln=ge.status;let Is=(function(sc){const wi=F[sc];if(wi!==void 0)return lu(wi)})(ln),vi=ge.message;Is===void 0&&(Is=f.INTERNAL,vi="Unknown error status: "+ln+" with message "+ge.message),p=!0,E.wo(new y(Is,vi)),h.close()}else v(W,`RPC '${e}' stream ${r} received:`,j),E._o(j)}})),D(a,Ph.STAT_EVENT,(A=>{A.stat===ji.PROXY?v(W,`RPC '${e}' stream ${r} detected buffering proxy`):A.stat===ji.NOPROXY&&v(W,`RPC '${e}' stream ${r} detected no buffering proxy`)})),setTimeout((()=>{E.fo()}),0),E}}function Fs(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fs(t){return new Bf(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tu{constructor(e,n,s=1e3,r=1.5,i=6e4){this.ii=e,this.timerId=n,this.Po=s,this.bo=r,this.Vo=i,this.So=0,this.Do=null,this.Co=Date.now(),this.reset()}reset(){this.So=0}xo(){this.So=this.Vo}No(e){this.cancel();const n=Math.floor(this.So+this.ko()),s=Math.max(0,Date.now()-this.Co),r=Math.max(0,n-s);r>0&&v("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.So} ms, delay with jitter: ${n} ms, last attempt: ${s} ms ago)`),this.Do=this.ii.enqueueAfterDelay(this.timerId,r,(()=>(this.Co=Date.now(),e()))),this.So*=this.bo,this.So<this.Po&&(this.So=this.Po),this.So>this.Vo&&(this.So=this.Vo)}Mo(){this.Do!==null&&(this.Do.skipDelay(),this.Do=null)}cancel(){this.Do!==null&&(this.Do.cancel(),this.Do=null)}ko(){return(Math.random()-.5)*this.So}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iu{constructor(e,n,s,r,i,o,a,u){this.ii=e,this.$o=s,this.Oo=r,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=u,this.state=0,this.Fo=0,this.Bo=null,this.Lo=null,this.stream=null,this.qo=new Tu(e,n)}Uo(){return this.state===1||this.state===5||this.Ko()}Ko(){return this.state===2||this.state===3}start(){this.state!==4?this.auth():this.Go()}async stop(){this.Uo()&&await this.close(0)}Qo(){this.state=0,this.qo.reset()}jo(){this.Ko()&&this.Bo===null&&(this.Bo=this.ii.enqueueAfterDelay(this.$o,6e4,(()=>this.zo())))}Wo(e){this.Ho(),this.stream.send(e)}async zo(){if(this.Ko())return this.close(0)}Ho(){this.Bo&&(this.Bo.cancel(),this.Bo=null)}Jo(){this.Lo&&(this.Lo.cancel(),this.Lo=null)}async close(e,n){this.Ho(),this.Jo(),this.qo.cancel(),this.Fo++,e!==4?this.qo.reset():n&&n.code===f.RESOURCE_EXHAUSTED?(Ce(n.toString()),Ce("Using maximum backoff delay to prevent overloading the backend."),this.qo.xo()):n&&n.code===f.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.Yo(),this.stream.close(),this.stream=null),this.state=e,await this.listener.ao(n)}Yo(){}auth(){this.state=1;const e=this.Xo(this.Fo),n=this.Fo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([s,r])=>{this.Fo===n&&this.Zo(s,r)}),(s=>{e((()=>{const r=new y(f.UNKNOWN,"Fetching auth token failed: "+s.message);return this.tu(r)}))}))}Zo(e,n){const s=this.Xo(this.Fo);this.stream=this.eu(e,n),this.stream.uo((()=>{s((()=>(this.state=2,this.Lo=this.ii.enqueueAfterDelay(this.Oo,1e4,(()=>(this.Ko()&&(this.state=3),Promise.resolve()))),this.listener.uo())))})),this.stream.ao((r=>{s((()=>this.tu(r)))})),this.stream.onMessage((r=>{s((()=>this.onMessage(r)))}))}Go(){this.state=5,this.qo.No((async()=>{this.state=0,this.start()}))}tu(e){return v("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}Xo(e){return n=>{this.ii.enqueueAndForget((()=>this.Fo===e?n():(v("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class kd extends Iu{constructor(e,n,s,r,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,s,r,o),this.serializer=i}eu(e,n){return this.connection.Ro("Listen",e,n)}onMessage(e){this.qo.reset();const n=zf(this.serializer,e),s=(function(r){if(!("targetChange"in r))return S.min();const i=r.targetChange;return i.targetIds&&i.targetIds.length?S.min():i.readTime?ve(i.readTime):S.min()})(e);return this.listener.nu(n,s)}su(e){const n={};n.database=fr(this.serializer),n.addTarget=(function(r,i){let o;const a=i.target;if(o=or(a)?{documents:Gf(r,a)}:{query:Qf(r,a)},o.targetId=i.targetId,i.resumeToken.approximateByteSize()>0){o.resumeToken=du(r,i.resumeToken);const u=cr(r,i.expectedCount);u!==null&&(o.expectedCount=u)}else if(i.snapshotVersion.compareTo(S.min())>0){o.readTime=$n(r,i.snapshotVersion.toTimestamp());const u=cr(r,i.expectedCount);u!==null&&(o.expectedCount=u)}return o})(this.serializer,e);const s=Yf(this.serializer,e);s&&(n.labels=s),this.Wo(n)}iu(e){const n={};n.database=fr(this.serializer),n.removeTarget=e,this.Wo(n)}}class Rd extends Iu{constructor(e,n,s,r,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,s,r,o),this.serializer=i,this.ru=!1}get ou(){return this.ru}start(){this.ru=!1,this.lastStreamToken=void 0,super.start()}Yo(){this.ru&&this.uu([])}eu(e,n){return this.connection.Ro("Write",e,n)}onMessage(e){if(O(!!e.streamToken),this.lastStreamToken=e.streamToken,this.ru){this.qo.reset();const n=Hf(e.writeResults,e.commitTime),s=ve(e.commitTime);return this.listener.cu(s,n)}return O(!e.writeResults||e.writeResults.length===0),this.ru=!0,this.listener.au()}hu(){const e={};e.database=fr(this.serializer),this.Wo(e)}uu(e){const n={streamToken:this.lastStreamToken,writes:e.map((s=>Kf(this.serializer,s)))};this.Wo(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xd extends class{}{constructor(e,n,s,r){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=s,this.serializer=r,this.lu=!1}fu(){if(this.lu)throw new y(f.FAILED_PRECONDITION,"The client has already been terminated.")}Io(e,n,s){return this.fu(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([r,i])=>this.connection.Io(e,n,s,r,i))).catch((r=>{throw r.name==="FirebaseError"?(r.code===f.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),r):new y(f.UNKNOWN,r.toString())}))}vo(e,n,s,r){return this.fu(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.vo(e,n,s,i,o,r))).catch((i=>{throw i.name==="FirebaseError"?(i.code===f.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new y(f.UNKNOWN,i.toString())}))}terminate(){this.lu=!0}}class Md{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.wu=0,this._u=null,this.mu=!0}gu(){this.wu===0&&(this.yu("Unknown"),this._u=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this._u=null,this.pu("Backend didn't respond within 10 seconds."),this.yu("Offline"),Promise.resolve()))))}Iu(e){this.state==="Online"?this.yu("Unknown"):(this.wu++,this.wu>=1&&(this.Tu(),this.pu(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.yu("Offline")))}set(e){this.Tu(),this.wu=0,e==="Online"&&(this.mu=!1),this.yu(e)}yu(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}pu(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.mu?(Ce(n),this.mu=!1):v("OnlineStateTracker",n)}Tu(){this._u!==null&&(this._u.cancel(),this._u=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Od{constructor(e,n,s,r,i){this.localStore=e,this.datastore=n,this.asyncQueue=s,this.remoteSyncer={},this.Eu=[],this.Au=new Map,this.vu=new Set,this.Ru=[],this.Pu=i,this.Pu.Yr((o=>{s.enqueueAndForget((async()=>{Qe(this)&&(v("RemoteStore","Restarting streams for network reachability change."),await(async function(a){const u=C(a);u.vu.add(4),await an(u),u.bu.set("Unknown"),u.vu.delete(4),await ds(u)})(this))}))})),this.bu=new Md(s,r)}}async function ds(t){if(Qe(t))for(const e of t.Ru)await e(!0)}async function an(t){for(const e of t.Ru)await e(!1)}function Su(t,e){const n=C(t);n.Au.has(e.targetId)||(n.Au.set(e.targetId,e),si(n)?ni(n):wt(n).Ko()&&ti(n,e))}function Cu(t,e){const n=C(t),s=wt(n);n.Au.delete(e),s.Ko()&&Au(n,e),n.Au.size===0&&(s.Ko()?s.jo():Qe(n)&&n.bu.set("Unknown"))}function ti(t,e){if(t.Vu.qt(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(S.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}wt(t).su(e)}function Au(t,e){t.Vu.qt(e),wt(t).iu(e)}function ni(t){t.Vu=new Ff({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),le:e=>t.Au.get(e)||null,ue:()=>t.datastore.serializer.databaseId}),wt(t).start(),t.bu.gu()}function si(t){return Qe(t)&&!wt(t).Uo()&&t.Au.size>0}function Qe(t){return C(t).vu.size===0}function Du(t){t.Vu=void 0}async function Ld(t){t.Au.forEach(((e,n)=>{ti(t,e)}))}async function Pd(t,e){Du(t),si(t)?(t.bu.Iu(e),ni(t)):t.bu.set("Unknown")}async function Fd(t,e,n){if(t.bu.set("Online"),e instanceof fu&&e.state===2&&e.cause)try{await(async function(s,r){const i=r.cause;for(const o of r.targetIds)s.Au.has(o)&&(await s.remoteSyncer.rejectListen(o,i),s.Au.delete(o),s.Vu.removeTarget(o))})(t,e)}catch(s){v("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),s),await Un(t,s)}else if(e instanceof In?t.Vu.Ht(e):e instanceof hu?t.Vu.ne(e):t.Vu.Xt(e),!n.isEqual(S.min()))try{const s=await Eu(t.localStore);n.compareTo(s)>=0&&await(function(r,i){const o=r.Vu.ce(i);return o.targetChanges.forEach(((a,u)=>{if(a.resumeToken.approximateByteSize()>0){const c=r.Au.get(u);c&&r.Au.set(u,c.withResumeToken(a.resumeToken,i))}})),o.targetMismatches.forEach(((a,u)=>{const c=r.Au.get(a);if(!c)return;r.Au.set(a,c.withResumeToken(ne.EMPTY_BYTE_STRING,c.snapshotVersion)),Au(r,a);const l=new _e(c.target,a,u,c.sequenceNumber);ti(r,l)})),r.remoteSyncer.applyRemoteEvent(o)})(t,n)}catch(s){v("RemoteStore","Failed to raise snapshot:",s),await Un(t,s)}}async function Un(t,e,n){if(!nn(e))throw e;t.vu.add(1),await an(t),t.bu.set("Offline"),n||(n=()=>Eu(t.localStore)),t.asyncQueue.enqueueRetryable((async()=>{v("RemoteStore","Retrying IndexedDB access"),await n(),t.vu.delete(1),await ds(t)}))}function _u(t,e){return e().catch((n=>Un(t,n,e)))}async function gs(t){const e=C(t),n=Me(e);let s=e.Eu.length>0?e.Eu[e.Eu.length-1].batchId:-1;for(;Vd(e);)try{const r=await Id(e.localStore,s);if(r===null){e.Eu.length===0&&n.jo();break}s=r.batchId,$d(e,r)}catch(r){await Un(e,r)}bu(e)&&Nu(e)}function Vd(t){return Qe(t)&&t.Eu.length<10}function $d(t,e){t.Eu.push(e);const n=Me(t);n.Ko()&&n.ou&&n.uu(e.mutations)}function bu(t){return Qe(t)&&!Me(t).Uo()&&t.Eu.length>0}function Nu(t){Me(t).start()}async function Ud(t){Me(t).hu()}async function Bd(t){const e=Me(t);for(const n of t.Eu)e.uu(n.mutations)}async function jd(t,e,n){const s=t.Eu.shift(),r=Qr.from(s,e,n);await _u(t,(()=>t.remoteSyncer.applySuccessfulWrite(r))),await gs(t)}async function qd(t,e){e&&Me(t).ou&&await(async function(n,s){if(r=s.code,Of(r)&&r!==f.ABORTED){const i=n.Eu.shift();Me(n).Qo(),await _u(n,(()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s))),await gs(n)}var r})(t,e),bu(t)&&Nu(t)}async function po(t,e){const n=C(t);n.asyncQueue.verifyOperationInProgress(),v("RemoteStore","RemoteStore received new credentials");const s=Qe(n);n.vu.add(3),await an(n),s&&n.bu.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.vu.delete(3),await ds(n)}async function zd(t,e){const n=C(t);e?(n.vu.delete(2),await ds(n)):e||(n.vu.add(2),await an(n),n.bu.set("Unknown"))}function wt(t){return t.Su||(t.Su=(function(e,n,s){const r=C(e);return r.fu(),new kd(n,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,s)})(t.datastore,t.asyncQueue,{uo:Ld.bind(null,t),ao:Pd.bind(null,t),nu:Fd.bind(null,t)}),t.Ru.push((async e=>{e?(t.Su.Qo(),si(t)?ni(t):t.bu.set("Unknown")):(await t.Su.stop(),Du(t))}))),t.Su}function Me(t){return t.Du||(t.Du=(function(e,n,s){const r=C(e);return r.fu(),new Rd(n,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,s)})(t.datastore,t.asyncQueue,{uo:Ud.bind(null,t),ao:qd.bind(null,t),au:Bd.bind(null,t),cu:jd.bind(null,t)}),t.Ru.push((async e=>{e?(t.Du.Qo(),await gs(t)):(await t.Du.stop(),t.Eu.length>0&&(v("RemoteStore",`Stopping write stream with ${t.Eu.length} pending writes`),t.Eu=[]))}))),t.Du}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ri{constructor(e,n,s,r,i){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=s,this.op=r,this.removalCallback=i,this.deferred=new Te,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}static createAndSchedule(e,n,s,r,i){const o=Date.now()+s,a=new ri(e,n,o,r,i);return a.start(s),a}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new y(f.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function ii(t,e){if(Ce("AsyncQueue",`${e}: ${t}`),nn(t))return new y(f.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(e){this.comparator=e?(n,s)=>e(n,s)||w.comparator(n.key,s.key):(n,s)=>w.comparator(n.key,s.key),this.keyedMap=Ct(),this.sortedSet=new L(this.comparator)}static emptySet(e){return new it(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((n,s)=>(e(n),!1)))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof it)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;n.hasNext();){const r=n.getNext().key,i=s.getNext().key;if(!r.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((n=>{e.push(n.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const s=new it;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=n,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mo{constructor(){this.Cu=new L(w.comparator)}track(e){const n=e.doc.key,s=this.Cu.get(n);s?e.type!==0&&s.type===3?this.Cu=this.Cu.insert(n,e):e.type===3&&s.type!==1?this.Cu=this.Cu.insert(n,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.Cu=this.Cu.insert(n,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.Cu=this.Cu.insert(n,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.Cu=this.Cu.remove(n):e.type===1&&s.type===2?this.Cu=this.Cu.insert(n,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.Cu=this.Cu.insert(n,{type:2,doc:e.doc}):T():this.Cu=this.Cu.insert(n,e)}xu(){const e=[];return this.Cu.inorderTraversal(((n,s)=>{e.push(s)})),e}}class ft{constructor(e,n,s,r,i,o,a,u,c){this.query=e,this.docs=n,this.oldDocs=s,this.docChanges=r,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=u,this.hasCachedResults=c}static fromInitialDocuments(e,n,s,r,i){const o=[];return n.forEach((a=>{o.push({type:0,doc:a})})),new ft(e,n,it.emptySet(n),o,s,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&as(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,s=e.docChanges;if(n.length!==s.length)return!1;for(let r=0;r<n.length;r++)if(n[r].type!==s[r].type||!n[r].doc.isEqual(s[r].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kd{constructor(){this.Nu=void 0,this.listeners=[]}}class Hd{constructor(){this.queries=new vt((e=>Xa(e)),as),this.onlineState="Unknown",this.ku=new Set}}async function ku(t,e){const n=C(t),s=e.query;let r=!1,i=n.queries.get(s);if(i||(r=!0,i=new Kd),r)try{i.Nu=await n.onListen(s)}catch(o){const a=ii(o,`Initialization of query '${ur(e.query)}' failed`);return void e.onError(a)}n.queries.set(s,i),i.listeners.push(e),e.Mu(n.onlineState),i.Nu&&e.$u(i.Nu)&&oi(n)}async function Ru(t,e){const n=C(t),s=e.query;let r=!1;const i=n.queries.get(s);if(i){const o=i.listeners.indexOf(e);o>=0&&(i.listeners.splice(o,1),r=i.listeners.length===0)}if(r)return n.queries.delete(s),n.onUnlisten(s)}function Gd(t,e){const n=C(t);let s=!1;for(const r of e){const i=r.query,o=n.queries.get(i);if(o){for(const a of o.listeners)a.$u(r)&&(s=!0);o.Nu=r}}s&&oi(n)}function Qd(t,e,n){const s=C(t),r=s.queries.get(e);if(r)for(const i of r.listeners)i.onError(n);s.queries.delete(e)}function oi(t){t.ku.forEach((e=>{e.next()}))}class xu{constructor(e,n,s){this.query=e,this.Ou=n,this.Fu=!1,this.Bu=null,this.onlineState="Unknown",this.options=s||{}}$u(e){if(!this.options.includeMetadataChanges){const s=[];for(const r of e.docChanges)r.type!==3&&s.push(r);e=new ft(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.Fu?this.Lu(e)&&(this.Ou.next(e),n=!0):this.qu(e,this.onlineState)&&(this.Uu(e),n=!0),this.Bu=e,n}onError(e){this.Ou.error(e)}Mu(e){this.onlineState=e;let n=!1;return this.Bu&&!this.Fu&&this.qu(this.Bu,e)&&(this.Uu(this.Bu),n=!0),n}qu(e,n){if(!e.fromCache)return!0;const s=n!=="Offline";return(!this.options.Ku||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}Lu(e){if(e.docChanges.length>0)return!0;const n=this.Bu&&this.Bu.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}Uu(e){e=ft.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Fu=!0,this.Ou.next(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mu{constructor(e){this.key=e}}class Ou{constructor(e){this.key=e}}class Wd{constructor(e,n){this.query=e,this.Yu=n,this.Xu=null,this.hasCachedResults=!1,this.current=!1,this.Zu=_(),this.mutatedKeys=_(),this.tc=Ja(e),this.ec=new it(this.tc)}get nc(){return this.Yu}sc(e,n){const s=n?n.ic:new mo,r=n?n.ec:this.ec;let i=n?n.mutatedKeys:this.mutatedKeys,o=r,a=!1;const u=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,c=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal(((l,h)=>{const d=r.get(l),p=us(this.query,h)?h:null,E=!!d&&this.mutatedKeys.has(d.key),D=!!p&&(p.hasLocalMutations||this.mutatedKeys.has(p.key)&&p.hasCommittedMutations);let A=!1;d&&p?d.data.isEqual(p.data)?E!==D&&(s.track({type:3,doc:p}),A=!0):this.rc(d,p)||(s.track({type:2,doc:p}),A=!0,(u&&this.tc(p,u)>0||c&&this.tc(p,c)<0)&&(a=!0)):!d&&p?(s.track({type:0,doc:p}),A=!0):d&&!p&&(s.track({type:1,doc:d}),A=!0,(u||c)&&(a=!0)),A&&(p?(o=o.add(p),i=D?i.add(l):i.delete(l)):(o=o.delete(l),i=i.delete(l)))})),this.query.limit!==null)for(;o.size>this.query.limit;){const l=this.query.limitType==="F"?o.last():o.first();o=o.delete(l.key),i=i.delete(l.key),s.track({type:1,doc:l})}return{ec:o,ic:s,zi:a,mutatedKeys:i}}rc(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,s){const r=this.ec;this.ec=e.ec,this.mutatedKeys=e.mutatedKeys;const i=e.ic.xu();i.sort(((c,l)=>(function(h,d){const p=E=>{switch(E){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return T()}};return p(h)-p(d)})(c.type,l.type)||this.tc(c.doc,l.doc))),this.oc(s);const o=n?this.uc():[],a=this.Zu.size===0&&this.current?1:0,u=a!==this.Xu;return this.Xu=a,i.length!==0||u?{snapshot:new ft(this.query,e.ec,r,i,e.mutatedKeys,a===0,u,!1,!!s&&s.resumeToken.approximateByteSize()>0),cc:o}:{cc:o}}Mu(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({ec:this.ec,ic:new mo,mutatedKeys:this.mutatedKeys,zi:!1},!1)):{cc:[]}}ac(e){return!this.Yu.has(e)&&!!this.ec.has(e)&&!this.ec.get(e).hasLocalMutations}oc(e){e&&(e.addedDocuments.forEach((n=>this.Yu=this.Yu.add(n))),e.modifiedDocuments.forEach((n=>{})),e.removedDocuments.forEach((n=>this.Yu=this.Yu.delete(n))),this.current=e.current)}uc(){if(!this.current)return[];const e=this.Zu;this.Zu=_(),this.ec.forEach((s=>{this.ac(s.key)&&(this.Zu=this.Zu.add(s.key))}));const n=[];return e.forEach((s=>{this.Zu.has(s)||n.push(new Ou(s))})),this.Zu.forEach((s=>{e.has(s)||n.push(new Mu(s))})),n}hc(e){this.Yu=e.ir,this.Zu=_();const n=this.sc(e.documents);return this.applyChanges(n,!0)}lc(){return ft.fromInitialDocuments(this.query,this.ec,this.mutatedKeys,this.Xu===0,this.hasCachedResults)}}class Yd{constructor(e,n,s){this.query=e,this.targetId=n,this.view=s}}class Xd{constructor(e){this.key=e,this.fc=!1}}class Jd{constructor(e,n,s,r,i,o){this.localStore=e,this.remoteStore=n,this.eventManager=s,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.dc={},this.wc=new vt((a=>Xa(a)),as),this._c=new Map,this.mc=new Set,this.gc=new L(w.comparator),this.yc=new Map,this.Ic=new Jr,this.Tc={},this.Ec=new Map,this.Ac=ht.Mn(),this.onlineState="Unknown",this.vc=void 0}get isPrimaryClient(){return this.vc===!0}}async function Zd(t,e){const n=cg(t);let s,r;const i=n.wc.get(e);if(i)s=i.targetId,n.sharedClientState.addLocalQueryTarget(s),r=i.view.lc();else{const o=await Sd(n.localStore,Ae(e)),a=n.sharedClientState.addLocalQueryTarget(o.targetId);s=o.targetId,r=await eg(n,e,s,a==="current",o.resumeToken),n.isPrimaryClient&&Su(n.remoteStore,o)}return r}async function eg(t,e,n,s,r){t.Rc=(h,d,p)=>(async function(E,D,A,B){let j=D.view.sc(A);j.zi&&(j=await ho(E.localStore,D.query,!1).then((({documents:ln})=>D.view.sc(ln,j))));const ie=B&&B.targetChanges.get(D.targetId),ge=D.view.applyChanges(j,E.isPrimaryClient,ie);return vo(E,D.targetId,ge.cc),ge.snapshot})(t,h,d,p);const i=await ho(t.localStore,e,!0),o=new Wd(e,i.ir),a=o.sc(i.documents),u=on.createSynthesizedTargetChangeForCurrentChange(n,s&&t.onlineState!=="Offline",r),c=o.applyChanges(a,t.isPrimaryClient,u);vo(t,n,c.cc);const l=new Yd(e,n,o);return t.wc.set(e,l),t._c.has(n)?t._c.get(n).push(e):t._c.set(n,[e]),c.snapshot}async function tg(t,e){const n=C(t),s=n.wc.get(e),r=n._c.get(s.targetId);if(r.length>1)return n._c.set(s.targetId,r.filter((i=>!as(i,e)))),void n.wc.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await dr(n.localStore,s.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(s.targetId),Cu(n.remoteStore,s.targetId),gr(n,s.targetId)})).catch(tn)):(gr(n,s.targetId),await dr(n.localStore,s.targetId,!0))}async function ng(t,e,n){const s=lg(t);try{const r=await(function(i,o){const a=C(i),u=U.now(),c=o.reduce(((d,p)=>d.add(p.key)),_());let l,h;return a.persistence.runTransaction("Locally write mutations","readwrite",(d=>{let p=De(),E=_();return a.Zi.getEntries(d,c).next((D=>{p=D,p.forEach(((A,B)=>{B.isValidDocument()||(E=E.add(A))}))})).next((()=>a.localDocuments.getOverlayedDocuments(d,p))).next((D=>{l=D;const A=[];for(const B of o){const j=Nf(B,l.get(B.key).overlayedDocument);j!=null&&A.push(new Pe(B.key,j,ja(j.value.mapValue),le.exists(!0)))}return a.mutationQueue.addMutationBatch(d,u,A,o)})).next((D=>{h=D;const A=D.applyToLocalDocumentSet(l,E);return a.documentOverlayCache.saveOverlays(d,D.batchId,A)}))})).then((()=>({batchId:h.batchId,changes:eu(l)})))})(s.localStore,e);s.sharedClientState.addPendingMutation(r.batchId),(function(i,o,a){let u=i.Tc[i.currentUser.toKey()];u||(u=new L(N)),u=u.insert(o,a),i.Tc[i.currentUser.toKey()]=u})(s,r.batchId,n),await un(s,r.changes),await gs(s.remoteStore)}catch(r){const i=ii(r,"Failed to persist write");n.reject(i)}}async function Lu(t,e){const n=C(t);try{const s=await Ed(n.localStore,e);e.targetChanges.forEach(((r,i)=>{const o=n.yc.get(i);o&&(O(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1),r.addedDocuments.size>0?o.fc=!0:r.modifiedDocuments.size>0?O(o.fc):r.removedDocuments.size>0&&(O(o.fc),o.fc=!1))})),await un(n,s,e)}catch(s){await tn(s)}}function yo(t,e,n){const s=C(t);if(s.isPrimaryClient&&n===0||!s.isPrimaryClient&&n===1){const r=[];s.wc.forEach(((i,o)=>{const a=o.view.Mu(e);a.snapshot&&r.push(a.snapshot)})),(function(i,o){const a=C(i);a.onlineState=o;let u=!1;a.queries.forEach(((c,l)=>{for(const h of l.listeners)h.Mu(o)&&(u=!0)})),u&&oi(a)})(s.eventManager,e),r.length&&s.dc.nu(r),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function sg(t,e,n){const s=C(t);s.sharedClientState.updateQueryState(e,"rejected",n);const r=s.yc.get(e),i=r&&r.key;if(i){let o=new L(w.comparator);o=o.insert(i,X.newNoDocument(i,S.min()));const a=_().add(i),u=new hs(S.min(),new Map,new L(N),o,a);await Lu(s,u),s.gc=s.gc.remove(i),s.yc.delete(e),ai(s)}else await dr(s.localStore,e,!1).then((()=>gr(s,e,n))).catch(tn)}async function rg(t,e){const n=C(t),s=e.batch.batchId;try{const r=await wd(n.localStore,e);Fu(n,s,null),Pu(n,s),n.sharedClientState.updateMutationState(s,"acknowledged"),await un(n,r)}catch(r){await tn(r)}}async function ig(t,e,n){const s=C(t);try{const r=await(function(i,o){const a=C(i);return a.persistence.runTransaction("Reject batch","readwrite-primary",(u=>{let c;return a.mutationQueue.lookupMutationBatch(u,o).next((l=>(O(l!==null),c=l.keys(),a.mutationQueue.removeMutationBatch(u,l)))).next((()=>a.mutationQueue.performConsistencyCheck(u))).next((()=>a.documentOverlayCache.removeOverlaysForBatchId(u,c,o))).next((()=>a.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(u,c))).next((()=>a.localDocuments.getDocuments(u,c)))}))})(s.localStore,e);Fu(s,e,n),Pu(s,e),s.sharedClientState.updateMutationState(e,"rejected",n),await un(s,r)}catch(r){await tn(r)}}function Pu(t,e){(t.Ec.get(e)||[]).forEach((n=>{n.resolve()})),t.Ec.delete(e)}function Fu(t,e,n){const s=C(t);let r=s.Tc[s.currentUser.toKey()];if(r){const i=r.get(e);i&&(n?i.reject(n):i.resolve(),r=r.remove(e)),s.Tc[s.currentUser.toKey()]=r}}function gr(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const s of t._c.get(e))t.wc.delete(s),n&&t.dc.Pc(s,n);t._c.delete(e),t.isPrimaryClient&&t.Ic.Is(e).forEach((s=>{t.Ic.containsKey(s)||Vu(t,s)}))}function Vu(t,e){t.mc.delete(e.path.canonicalString());const n=t.gc.get(e);n!==null&&(Cu(t.remoteStore,n),t.gc=t.gc.remove(e),t.yc.delete(n),ai(t))}function vo(t,e,n){for(const s of n)s instanceof Mu?(t.Ic.addReference(s.key,e),og(t,s)):s instanceof Ou?(v("SyncEngine","Document no longer in limbo: "+s.key),t.Ic.removeReference(s.key,e),t.Ic.containsKey(s.key)||Vu(t,s.key)):T()}function og(t,e){const n=e.key,s=n.path.canonicalString();t.gc.get(n)||t.mc.has(s)||(v("SyncEngine","New document in limbo: "+n),t.mc.add(s),ai(t))}function ai(t){for(;t.mc.size>0&&t.gc.size<t.maxConcurrentLimboResolutions;){const e=t.mc.values().next().value;t.mc.delete(e);const n=new w(M.fromString(e)),s=t.Ac.next();t.yc.set(s,new Xd(n)),t.gc=t.gc.insert(n,s),Su(t.remoteStore,new _e(Ae(Kr(n.path)),s,"TargetPurposeLimboResolution",$r.ct))}}async function un(t,e,n){const s=C(t),r=[],i=[],o=[];s.wc.isEmpty()||(s.wc.forEach(((a,u)=>{o.push(s.Rc(u,e,n).then((c=>{if((c||n)&&s.isPrimaryClient&&s.sharedClientState.updateQueryState(u.targetId,c!=null&&c.fromCache?"not-current":"current"),c){r.push(c);const l=ei.Li(u.targetId,c);i.push(l)}})))})),await Promise.all(o),s.dc.nu(r),await(async function(a,u){const c=C(a);try{await c.persistence.runTransaction("notifyLocalViewChanges","readwrite",(l=>g.forEach(u,(h=>g.forEach(h.Fi,(d=>c.persistence.referenceDelegate.addReference(l,h.targetId,d))).next((()=>g.forEach(h.Bi,(d=>c.persistence.referenceDelegate.removeReference(l,h.targetId,d)))))))))}catch(l){if(!nn(l))throw l;v("LocalStore","Failed to update sequence numbers: "+l)}for(const l of u){const h=l.targetId;if(!l.fromCache){const d=c.Ji.get(h),p=d.snapshotVersion,E=d.withLastLimboFreeSnapshotVersion(p);c.Ji=c.Ji.insert(h,E)}}})(s.localStore,i))}async function ag(t,e){const n=C(t);if(!n.currentUser.isEqual(e)){v("SyncEngine","User change. New user:",e.toKey());const s=await wu(n.localStore,e);n.currentUser=e,(function(r,i){r.Ec.forEach((o=>{o.forEach((a=>{a.reject(new y(f.CANCELLED,i))}))})),r.Ec.clear()})(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await un(n,s.er)}}function ug(t,e){const n=C(t),s=n.yc.get(e);if(s&&s.fc)return _().add(s.key);{let r=_();const i=n._c.get(e);if(!i)return r;for(const o of i){const a=n.wc.get(o);r=r.unionWith(a.view.nc)}return r}}function cg(t){const e=C(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=Lu.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=ug.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=sg.bind(null,e),e.dc.nu=Gd.bind(null,e.eventManager),e.dc.Pc=Qd.bind(null,e.eventManager),e}function lg(t){const e=C(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=rg.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=ig.bind(null,e),e}class wo{constructor(){this.synchronizeTabs=!1}async initialize(e){this.serializer=fs(e.databaseInfo.databaseId),this.sharedClientState=this.createSharedClientState(e),this.persistence=this.createPersistence(e),await this.persistence.start(),this.localStore=this.createLocalStore(e),this.gcScheduler=this.createGarbageCollectionScheduler(e,this.localStore),this.indexBackfillerScheduler=this.createIndexBackfillerScheduler(e,this.localStore)}createGarbageCollectionScheduler(e,n){return null}createIndexBackfillerScheduler(e,n){return null}createLocalStore(e){return vd(this.persistence,new md,e.initialUser,this.serializer)}createPersistence(e){return new gd(Zr.zs,this.serializer)}createSharedClientState(e){return new Ad}async terminate(){this.gcScheduler&&this.gcScheduler.stop(),await this.sharedClientState.shutdown(),await this.persistence.shutdown()}}class hg{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>yo(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=ag.bind(null,this.syncEngine),await zd(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return new Hd}createDatastore(e){const n=fs(e.databaseInfo.databaseId),s=(r=e.databaseInfo,new Nd(r));var r;return(function(i,o,a,u){return new xd(i,o,a,u)})(e.authCredentials,e.appCheckCredentials,s,n)}createRemoteStore(e){return n=this.localStore,s=this.datastore,r=e.asyncQueue,i=a=>yo(this.syncEngine,a,0),o=go.D()?new go:new Dd,new Od(n,s,r,i,o);var n,s,r,i,o}createSyncEngine(e,n){return(function(s,r,i,o,a,u,c){const l=new Jd(s,r,i,o,a,u);return c&&(l.vc=!0),l})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}terminate(){return(async function(e){const n=C(e);v("RemoteStore","RemoteStore shutting down."),n.vu.add(5),await an(n),n.Pu.shutdown(),n.bu.set("Unknown")})(this.remoteStore)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $u{constructor(e){this.observer=e,this.muted=!1}next(e){this.observer.next&&this.Sc(this.observer.next,e)}error(e){this.observer.error?this.Sc(this.observer.error,e):Ce("Uncaught Error in snapshot listener:",e.toString())}Dc(){this.muted=!0}Sc(e,n){this.muted||setTimeout((()=>{this.muted||e(n)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fg{constructor(e,n,s,r){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=s,this.databaseInfo=r,this.user=Y.UNAUTHENTICATED,this.clientId=$a.A(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this.authCredentials.start(s,(async i=>{v("FirestoreClient","Received user=",i.uid),await this.authCredentialListener(i),this.user=i})),this.appCheckCredentials.start(s,(i=>(v("FirestoreClient","Received new app check token=",i),this.appCheckCredentialListener(i,this.user))))}async getConfiguration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}verifyNotTerminated(){if(this.asyncQueue.isShuttingDown)throw new y(f.FAILED_PRECONDITION,"The client has already been terminated.")}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Te;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const s=ii(n,"Failed to shutdown persistence");e.reject(s)}})),e.promise}}async function Vs(t,e){t.asyncQueue.verifyOperationInProgress(),v("FirestoreClient","Initializing OfflineComponentProvider");const n=await t.getConfiguration();await e.initialize(n);let s=n.initialUser;t.setCredentialChangeListener((async r=>{s.isEqual(r)||(await wu(e.localStore,r),s=r)})),e.persistence.setDatabaseDeletedListener((()=>t.terminate())),t._offlineComponents=e}async function Eo(t,e){t.asyncQueue.verifyOperationInProgress();const n=await gg(t);v("FirestoreClient","Initializing OnlineComponentProvider");const s=await t.getConfiguration();await e.initialize(n,s),t.setCredentialChangeListener((r=>po(e.remoteStore,r))),t.setAppCheckTokenChangeListener(((r,i)=>po(e.remoteStore,i))),t._onlineComponents=e}function dg(t){return t.name==="FirebaseError"?t.code===f.FAILED_PRECONDITION||t.code===f.UNIMPLEMENTED:!(typeof DOMException<"u"&&t instanceof DOMException)||t.code===22||t.code===20||t.code===11}async function gg(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){v("FirestoreClient","Using user provided OfflineComponentProvider");try{await Vs(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!dg(n))throw n;at("Error using user provided cache. Falling back to memory cache: "+n),await Vs(t,new wo)}}else v("FirestoreClient","Using default OfflineComponentProvider"),await Vs(t,new wo);return t._offlineComponents}async function Uu(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(v("FirestoreClient","Using user provided OnlineComponentProvider"),await Eo(t,t._uninitializedComponentsProvider._online)):(v("FirestoreClient","Using default OnlineComponentProvider"),await Eo(t,new hg))),t._onlineComponents}function pg(t){return Uu(t).then((e=>e.syncEngine))}async function Bu(t){const e=await Uu(t),n=e.eventManager;return n.onListen=Zd.bind(null,e.syncEngine),n.onUnlisten=tg.bind(null,e.syncEngine),n}function mg(t,e,n={}){const s=new Te;return t.asyncQueue.enqueueAndForget((async()=>(function(r,i,o,a,u){const c=new $u({next:h=>{i.enqueueAndForget((()=>Ru(r,l)));const d=h.docs.has(o);!d&&h.fromCache?u.reject(new y(f.UNAVAILABLE,"Failed to get document because the client is offline.")):d&&h.fromCache&&a&&a.source==="server"?u.reject(new y(f.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):u.resolve(h)},error:h=>u.reject(h)}),l=new xu(Kr(o.path),c,{includeMetadataChanges:!0,Ku:!0});return ku(r,l)})(await Bu(t),t.asyncQueue,e,n,s))),s.promise}function yg(t,e,n={}){const s=new Te;return t.asyncQueue.enqueueAndForget((async()=>(function(r,i,o,a,u){const c=new $u({next:h=>{i.enqueueAndForget((()=>Ru(r,l))),h.fromCache&&a.source==="server"?u.reject(new y(f.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):u.resolve(h)},error:h=>u.reject(h)}),l=new xu(o,c,{includeMetadataChanges:!0,Ku:!0});return ku(r,l)})(await Bu(t),t.asyncQueue,e,n,s))),s.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ju(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const To=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qu(t,e,n){if(!n)throw new y(f.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function vg(t,e,n,s){if(e===!0&&s===!0)throw new y(f.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function Io(t){if(!w.isDocumentKey(t))throw new y(f.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function So(t){if(w.isDocumentKey(t))throw new y(f.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function ps(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=(function(n){return n.constructor?n.constructor.name:null})(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":T()}function de(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new y(f.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=ps(t);throw new y(f.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Co{constructor(e){var n,s;if(e.host===void 0){if(e.ssl!==void 0)throw new y(f.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.cache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new y(f.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}vg("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=ju((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new y(f.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new y(f.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new y(f.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(n=this.experimentalLongPollingOptions,s=e.experimentalLongPollingOptions,n.timeoutSeconds===s.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams;var n,s}}class ms{constructor(e,n,s,r){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=s,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Co({}),this._settingsFrozen=!1}get app(){if(!this._app)throw new y(f.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!==void 0}_setSettings(e){if(this._settingsFrozen)throw new y(f.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Co(e),e.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new Uh;switch(n.type){case"firstParty":return new zh(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new y(f.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask||(this._terminateTask=this._terminate()),this._terminateTask}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(e){const n=To.get(e);n&&(v("ComponentProvider","Removing Datastore"),To.delete(e),n.terminate())})(this),Promise.resolve()}}function wg(t,e,n,s={}){var r;const i=(t=de(t,ms))._getSettings(),o=`${e}:${n}`;if(i.host!=="firestore.googleapis.com"&&i.host!==o&&at("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},i),{host:o,ssl:!1})),s.mockUserToken){let a,u;if(typeof s.mockUserToken=="string")a=s.mockUserToken,u=Y.MOCK_USER;else{a=pc(s.mockUserToken,(r=t._app)===null||r===void 0?void 0:r.options.projectId);const c=s.mockUserToken.sub||s.mockUserToken.user_id;if(!c)throw new y(f.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");u=new Y(c)}t._authCredentials=new Bh(new Va(a,u))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(e,n,s){this.converter=n,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ke(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new re(this.firestore,e,this._key)}}class We{constructor(e,n,s){this.converter=n,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new We(this.firestore,e,this._query)}}class ke extends We{constructor(e,n,s){super(e,n,Kr(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new re(this.firestore,null,new w(e))}withConverter(e){return new ke(this.firestore,e,this._path)}}function Kg(t,e,...n){if(t=Ie(t),qu("collection","path",e),t instanceof ms){const s=M.fromString(e,...n);return So(s),new ke(t,null,s)}{if(!(t instanceof re||t instanceof ke))throw new y(f.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(M.fromString(e,...n));return So(s),new ke(t.firestore,null,s)}}function Eg(t,e,...n){if(t=Ie(t),arguments.length===1&&(e=$a.A()),qu("doc","path",e),t instanceof ms){const s=M.fromString(e,...n);return Io(s),new re(t,null,new w(s))}{if(!(t instanceof re||t instanceof ke))throw new y(f.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(M.fromString(e,...n));return Io(s),new re(t.firestore,t instanceof ke?t.converter:null,new w(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tg{constructor(){this.Gc=Promise.resolve(),this.Qc=[],this.jc=!1,this.zc=[],this.Wc=null,this.Hc=!1,this.Jc=!1,this.Yc=[],this.qo=new Tu(this,"async_queue_retry"),this.Xc=()=>{const n=Fs();n&&v("AsyncQueue","Visibility state changed to "+n.visibilityState),this.qo.Mo()};const e=Fs();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.Xc)}get isShuttingDown(){return this.jc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Zc(),this.ta(e)}enterRestrictedMode(e){if(!this.jc){this.jc=!0,this.Jc=e||!1;const n=Fs();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Xc)}}enqueue(e){if(this.Zc(),this.jc)return new Promise((()=>{}));const n=new Te;return this.ta((()=>this.jc&&this.Jc?Promise.resolve():(e().then(n.resolve,n.reject),n.promise))).then((()=>n.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Qc.push(e),this.ea())))}async ea(){if(this.Qc.length!==0){try{await this.Qc[0](),this.Qc.shift(),this.qo.reset()}catch(e){if(!nn(e))throw e;v("AsyncQueue","Operation failed with retryable error: "+e)}this.Qc.length>0&&this.qo.No((()=>this.ea()))}}ta(e){const n=this.Gc.then((()=>(this.Hc=!0,e().catch((s=>{this.Wc=s,this.Hc=!1;const r=(function(i){let o=i.message||"";return i.stack&&(o=i.stack.includes(i.message)?i.stack:i.message+`
`+i.stack),o})(s);throw Ce("INTERNAL UNHANDLED ERROR: ",r),s})).then((s=>(this.Hc=!1,s))))));return this.Gc=n,n}enqueueAfterDelay(e,n,s){this.Zc(),this.Yc.indexOf(e)>-1&&(n=0);const r=ri.createAndSchedule(this,e,n,s,(i=>this.na(i)));return this.zc.push(r),r}Zc(){this.Wc&&T()}verifyOperationInProgress(){}async sa(){let e;do e=this.Gc,await e;while(e!==this.Gc)}ia(e){for(const n of this.zc)if(n.timerId===e)return!0;return!1}ra(e){return this.sa().then((()=>{this.zc.sort(((n,s)=>n.targetTimeMs-s.targetTimeMs));for(const n of this.zc)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.sa()}))}oa(e){this.Yc.push(e)}na(e){const n=this.zc.indexOf(e);this.zc.splice(n,1)}}class Ye extends ms{constructor(e,n,s,r){super(e,n,s,r),this.type="firestore",this._queue=new Tg,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}_terminate(){return this._firestoreClient||zu(this),this._firestoreClient.terminate()}}function Hg(t,e){const n=typeof t=="object"?t:Il(),s=typeof t=="string"?t:"(default)",r=yl(n,"firestore").getImmediate({identifier:s});if(!r._initialized){const i=dc("firestore");i&&wg(r,...i)}return r}function ui(t){return t._firestoreClient||zu(t),t._firestoreClient.verifyNotTerminated(),t._firestoreClient}function zu(t){var e,n,s;const r=t._freezeSettings(),i=(function(o,a,u,c){return new nf(o,a,u,c.host,c.ssl,c.experimentalForceLongPolling,c.experimentalAutoDetectLongPolling,ju(c.experimentalLongPollingOptions),c.useFetchStreams)})(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,r);t._firestoreClient=new fg(t._authCredentials,t._appCheckCredentials,t._queue,i),!((n=r.cache)===null||n===void 0)&&n._offlineComponentProvider&&(!((s=r.cache)===null||s===void 0)&&s._onlineComponentProvider)&&(t._firestoreClient._uninitializedComponentsProvider={_offlineKind:r.cache.kind,_offline:r.cache._offlineComponentProvider,_online:r.cache._onlineComponentProvider})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new dt(ne.fromBase64String(e))}catch(n){throw new y(f.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new dt(ne.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ys{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new y(f.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new J(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ci{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class li{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new y(f.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new y(f.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return N(this._lat,e._lat)||N(this._long,e._long)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ig=/^__.*__$/;class Sg{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return this.fieldMask!==null?new Pe(e,this.data,this.fieldMask,n,this.fieldTransforms):new rn(e,this.data,n,this.fieldTransforms)}}class Ku{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return new Pe(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function Hu(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw T()}}class hi{constructor(e,n,s,r,i,o){this.settings=e,this.databaseId=n,this.serializer=s,this.ignoreUndefinedProperties=r,i===void 0&&this.ua(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get ca(){return this.settings.ca}aa(e){return new hi(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}ha(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.aa({path:s,la:!1});return r.fa(e),r}da(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.aa({path:s,la:!1});return r.ua(),r}wa(e){return this.aa({path:void 0,la:!0})}_a(e){return Bn(e,this.settings.methodName,this.settings.ma||!1,this.path,this.settings.ga)}contains(e){return this.fieldMask.find((n=>e.isPrefixOf(n)))!==void 0||this.fieldTransforms.find((n=>e.isPrefixOf(n.field)))!==void 0}ua(){if(this.path)for(let e=0;e<this.path.length;e++)this.fa(this.path.get(e))}fa(e){if(e.length===0)throw this._a("Document fields must not be empty");if(Hu(this.ca)&&Ig.test(e))throw this._a('Document fields cannot begin and end with "__"')}}class Cg{constructor(e,n,s){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=s||fs(e)}ya(e,n,s,r=!1){return new hi({ca:e,methodName:n,ga:s,path:J.emptyPath(),la:!1,ma:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function vs(t){const e=t._freezeSettings(),n=fs(t._databaseId);return new Cg(t._databaseId,!!e.ignoreUndefinedProperties,n)}function Gu(t,e,n,s,r,i={}){const o=t.ya(i.merge||i.mergeFields?2:0,e,n,r);fi("Data must be an object, but it was:",o,s);const a=Qu(s,o);let u,c;if(i.merge)u=new ae(o.fieldMask),c=o.fieldTransforms;else if(i.mergeFields){const l=[];for(const h of i.mergeFields){const d=pr(e,h,n);if(!o.contains(d))throw new y(f.INVALID_ARGUMENT,`Field '${d}' is specified in your field mask but missing from your input data.`);Yu(l,d)||l.push(d)}u=new ae(l),c=o.fieldTransforms.filter((h=>u.covers(h.field)))}else u=null,c=o.fieldTransforms;return new Sg(new oe(a),u,c)}class ws extends ci{_toFieldTransform(e){if(e.ca!==2)throw e.ca===1?e._a(`${this._methodName}() can only appear at the top level of your update data`):e._a(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ws}}function Ag(t,e,n,s){const r=t.ya(1,e,n);fi("Data must be an object, but it was:",r,s);const i=[],o=oe.empty();Ge(s,((u,c)=>{const l=di(e,u,n);c=Ie(c);const h=r.da(l);if(c instanceof ws)i.push(l);else{const d=cn(c,h);d!=null&&(i.push(l),o.set(l,d))}}));const a=new ae(i);return new Ku(o,a,r.fieldTransforms)}function Dg(t,e,n,s,r,i){const o=t.ya(1,e,n),a=[pr(e,s,n)],u=[r];if(i.length%2!=0)throw new y(f.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let d=0;d<i.length;d+=2)a.push(pr(e,i[d])),u.push(i[d+1]);const c=[],l=oe.empty();for(let d=a.length-1;d>=0;--d)if(!Yu(c,a[d])){const p=a[d];let E=u[d];E=Ie(E);const D=o.da(p);if(E instanceof ws)c.push(p);else{const A=cn(E,D);A!=null&&(c.push(p),l.set(p,A))}}const h=new ae(c);return new Ku(l,h,o.fieldTransforms)}function _g(t,e,n,s=!1){return cn(n,t.ya(s?4:3,e))}function cn(t,e){if(Wu(t=Ie(t)))return fi("Unsupported field value:",e,t),Qu(t,e);if(t instanceof ci)return(function(n,s){if(!Hu(s.ca))throw s._a(`${n._methodName}() can only be used with update() and set()`);if(!s.path)throw s._a(`${n._methodName}() is not currently supported inside arrays`);const r=n._toFieldTransform(s);r&&s.fieldTransforms.push(r)})(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.la&&e.ca!==4)throw e._a("Nested arrays are not supported");return(function(n,s){const r=[];let i=0;for(const o of n){let a=cn(o,s.wa(i));a==null&&(a={nullValue:"NULL_VALUE"}),r.push(a),i++}return{arrayValue:{values:r}}})(t,e)}return(function(n,s){if((n=Ie(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return Sf(s.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const r=U.fromDate(n);return{timestampValue:$n(s.serializer,r)}}if(n instanceof U){const r=new U(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:$n(s.serializer,r)}}if(n instanceof li)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof dt)return{bytesValue:du(s.serializer,n._byteString)};if(n instanceof re){const r=s.databaseId,i=n.firestore._databaseId;if(!i.isEqual(r))throw s._a(`Document reference is for database ${i.projectId}/${i.database} but should be for database ${r.projectId}/${r.database}`);return{referenceValue:Xr(n.firestore._databaseId||s.databaseId,n._key.path)}}throw s._a(`Unsupported field value: ${ps(n)}`)})(t,e)}function Qu(t,e){const n={};return Ua(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Ge(t,((s,r)=>{const i=cn(r,e.ha(s));i!=null&&(n[s]=i)})),{mapValue:{fields:n}}}function Wu(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof U||t instanceof li||t instanceof dt||t instanceof re||t instanceof ci)}function fi(t,e,n){if(!Wu(n)||!(function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)})(n)){const s=ps(n);throw s==="an object"?e._a(t+" a custom object"):e._a(t+" "+s)}}function pr(t,e,n){if((e=Ie(e))instanceof ys)return e._internalPath;if(typeof e=="string")return di(t,e);throw Bn("Field path arguments must be of type string or ",t,!1,void 0,n)}const bg=new RegExp("[~\\*/\\[\\]]");function di(t,e,n){if(e.search(bg)>=0)throw Bn(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new ys(...e.split("."))._internalPath}catch{throw Bn(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function Bn(t,e,n,s,r){const i=s&&!s.isEmpty(),o=r!==void 0;let a=`Function ${e}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${s}`),o&&(u+=` in document ${r}`),u+=")"),new y(f.INVALID_ARGUMENT,a+t+u)}function Yu(t,e){return t.some((n=>n.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xu{constructor(e,n,s,r,i){this._firestore=e,this._userDataWriter=n,this._key=s,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new re(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Ng(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(gi("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class Ng extends Xu{data(){return super.data()}}function gi(t,e){return typeof e=="string"?di(t,e):e instanceof ys?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kg(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new y(f.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class pi{}class Ju extends pi{}function Gg(t,e,...n){let s=[];e instanceof pi&&s.push(e),s=s.concat(n),(function(r){const i=r.filter((a=>a instanceof mi)).length,o=r.filter((a=>a instanceof Es)).length;if(i>1||i>0&&o>0)throw new y(f.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(s);for(const r of s)t=r._apply(t);return t}class Es extends Ju{constructor(e,n,s){super(),this._field=e,this._op=n,this._value=s,this.type="where"}static _create(e,n,s){return new Es(e,n,s)}_apply(e){const n=this._parse(e);return Zu(e._query,n),new We(e.firestore,e.converter,ar(e._query,n))}_parse(e){const n=vs(e.firestore);return(function(r,i,o,a,u,c,l){let h;if(u.isKeyField()){if(c==="array-contains"||c==="array-contains-any")throw new y(f.INVALID_ARGUMENT,`Invalid Query. You can't perform '${c}' queries on documentId().`);if(c==="in"||c==="not-in"){Do(l,c);const d=[];for(const p of l)d.push(Ao(a,r,p));h={arrayValue:{values:d}}}else h=Ao(a,r,l)}else c!=="in"&&c!=="not-in"&&c!=="array-contains-any"||Do(l,c),h=_g(o,i,l,c==="in"||c==="not-in");return $.create(u,c,h)})(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}function Qg(t,e,n){const s=e,r=gi("where",t);return Es._create(r,s,n)}class mi extends pi{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new mi(e,n)}_parse(e){const n=this._queryConstraints.map((s=>s._parse(e))).filter((s=>s.getFilters().length>0));return n.length===1?n[0]:fe.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:((function(s,r){let i=s;const o=r.getFlattenedFilters();for(const a of o)Zu(i,a),i=ar(i,a)})(e._query,n),new We(e.firestore,e.converter,ar(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class yi extends Ju{constructor(e,n,s){super(),this.type=e,this._limit=n,this._limitType=s}static _create(e,n,s){return new yi(e,n,s)}_apply(e){return new We(e.firestore,e.converter,Pn(e._query,this._limit,this._limitType))}}function Wg(t){return yi._create("limit",t,"F")}function Ao(t,e,n){if(typeof(n=Ie(n))=="string"){if(n==="")throw new y(f.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Ya(e)&&n.indexOf("/")!==-1)throw new y(f.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const s=e.path.child(M.fromString(n));if(!w.isDocumentKey(s))throw new y(f.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return Qi(t,new w(s))}if(n instanceof re)return Qi(t,n._key);throw new y(f.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${ps(n)}.`)}function Do(t,e){if(!Array.isArray(t)||t.length===0)throw new y(f.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Zu(t,e){if(e.isInequality()){const s=Hr(t),r=e.field;if(s!==null&&!s.isEqual(r))throw new y(f.INVALID_ARGUMENT,`Invalid query. All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field. But you have inequality filters on '${s.toString()}' and '${r.toString()}'`);const i=Wa(t);i!==null&&Rg(t,r,i)}const n=(function(s,r){for(const i of s)for(const o of i.getFlattenedFilters())if(r.indexOf(o.op)>=0)return o.op;return null})(t.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(n!==null)throw n===e.op?new y(f.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new y(f.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}function Rg(t,e,n){if(!n.isEqual(e))throw new y(f.INVALID_ARGUMENT,`Invalid query. You have a where filter with an inequality (<, <=, !=, not-in, >, or >=) on field '${e.toString()}' and so you must also use '${e.toString()}' as your first argument to orderBy(), but your first orderBy() is on field '${n.toString()}' instead.`)}class xg{convertValue(e,n="none"){switch(Ke(e)){case 0:return null;case 1:return e.booleanValue;case 2:return V(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(ze(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 10:return this.convertObject(e.mapValue,n);default:throw T()}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const s={};return Ge(e,((r,i)=>{s[r]=this.convertValue(i,n)})),s}convertGeoPoint(e){return new li(V(e.latitude),V(e.longitude))}convertArray(e,n){return(e.values||[]).map((s=>this.convertValue(s,n)))}convertServerTimestamp(e,n){switch(n){case"previous":const s=Br(e);return s==null?null:this.convertValue(s,n);case"estimate":return this.convertTimestamp(qt(e));default:return null}}convertTimestamp(e){const n=xe(e);return new U(n.seconds,n.nanos)}convertDocumentKey(e,n){const s=M.fromString(e);O(vu(s));const r=new zt(s.get(1),s.get(3)),i=new w(s.popFirst(5));return r.isEqual(n)||Ce(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ec(t,e,n){let s;return s=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dt{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class tc extends Xu{constructor(e,n,s,r,i,o){super(e,n,s,r,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new Sn(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const s=this._document.data.field(gi("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,n.serverTimestamps)}}}class Sn extends tc{data(e={}){return super.data(e)}}class Mg{constructor(e,n,s,r){this._firestore=e,this._userDataWriter=n,this._snapshot=r,this.metadata=new Dt(r.hasPendingWrites,r.fromCache),this.query=s}get docs(){const e=[];return this.forEach((n=>e.push(n))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach((s=>{e.call(n,new Sn(this._firestore,this._userDataWriter,s.key,s,new Dt(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new y(f.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=(function(s,r){if(s._snapshot.oldDocs.isEmpty()){let i=0;return s._snapshot.docChanges.map((o=>{const a=new Sn(s._firestore,s._userDataWriter,o.doc.key,o.doc,new Dt(s._snapshot.mutatedKeys.has(o.doc.key),s._snapshot.fromCache),s.query.converter);return o.doc,{type:"added",doc:a,oldIndex:-1,newIndex:i++}}))}{let i=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((o=>r||o.type!==3)).map((o=>{const a=new Sn(s._firestore,s._userDataWriter,o.doc.key,o.doc,new Dt(s._snapshot.mutatedKeys.has(o.doc.key),s._snapshot.fromCache),s.query.converter);let u=-1,c=-1;return o.type!==0&&(u=i.indexOf(o.doc.key),i=i.delete(o.doc.key)),o.type!==1&&(i=i.add(o.doc),c=i.indexOf(o.doc.key)),{type:Og(o.type),doc:a,oldIndex:u,newIndex:c}}))}})(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function Og(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return T()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yg(t){t=de(t,re);const e=de(t.firestore,Ye);return mg(ui(e),t._key).then((n=>Lg(e,t,n)))}class nc extends xg{constructor(e){super(),this.firestore=e}convertBytes(e){return new dt(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new re(this.firestore,null,n)}}function Xg(t){t=de(t,We);const e=de(t.firestore,Ye),n=ui(e),s=new nc(e);return kg(t._query),yg(n,t._query).then((r=>new Mg(e,s,t,r)))}function Jg(t,e,n){t=de(t,re);const s=de(t.firestore,Ye),r=ec(t.converter,e,n);return Ts(s,[Gu(vs(s),"setDoc",t._key,r,t.converter!==null,n).toMutation(t._key,le.none())])}function Zg(t,e,n,...s){t=de(t,re);const r=de(t.firestore,Ye),i=vs(r);let o;return o=typeof(e=Ie(e))=="string"||e instanceof ys?Dg(i,"updateDoc",t._key,e,n,s):Ag(i,"updateDoc",t._key,e),Ts(r,[o.toMutation(t._key,le.exists(!0))])}function ep(t){return Ts(de(t.firestore,Ye),[new Gr(t._key,le.none())])}function tp(t,e){const n=de(t.firestore,Ye),s=Eg(t),r=ec(t.converter,e);return Ts(n,[Gu(vs(t.firestore),"addDoc",s._key,r,t.converter!==null,{}).toMutation(s._key,le.exists(!1))]).then((()=>s))}function Ts(t,e){return(function(n,s){const r=new Te;return n.asyncQueue.enqueueAndForget((async()=>ng(await pg(n),s,r))),r.promise})(ui(t),e)}function Lg(t,e,n){const s=n.docs.get(e._key),r=new nc(t);return new tc(t,r,e._key,s,new Dt(n.hasPendingWrites,n.fromCache),e.converter)}(function(t,e=!0){(function(n){yt=n})(El),Dn(new xt("firestore",((n,{instanceIdentifier:s,options:r})=>{const i=n.getProvider("app").getImmediate(),o=new Ye(new jh(n.getProvider("auth-internal")),new Hh(n.getProvider("app-check-internal")),(function(a,u){if(!Object.prototype.hasOwnProperty.apply(a.options,["projectId"]))throw new y(f.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new zt(a.options.projectId,u)})(i,s),i);return r=Object.assign({useFetchStreams:e},r),o._setSettings(r),o}),"PUBLIC").setMultipleInstances(!0)),tt(qi,"3.13.0",t),tt(qi,"3.13.0","esm2017")})();export{tp as A,Kg as B,xt as C,Qg as D,Ro as E,gt as F,Xg as G,Wg as H,xo as L,Hg as P,Gg as R,El as S,Dn as _,Ug as a,$g as b,Ie as c,ko as d,zg as e,k as f,Pg as g,ac as h,Fg as i,Il as j,yl as k,fc as l,$s as m,Bg as n,jg as o,dc as p,qg as q,tt as r,pc as s,Vg as t,Tl as u,Eg as v,Yg as w,Jg as x,ep as y,Zg as z};
