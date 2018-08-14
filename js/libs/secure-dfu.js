!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).SecureDfu=e()}}(function(){return function o(s,a,c){function h(n,e){if(!a[n]){if(!s[n]){var t="function"==typeof require&&require;if(!e&&t)return t(n,!0);if(u)return u(n,!0);var r=new Error("Cannot find module '"+n+"'");throw r.code="MODULE_NOT_FOUND",r}var i=a[n]={exports:{}};s[n][0].call(i.exports,function(e){var t=s[n][1][e];return h(t||e)},i,i.exports,o,s,a,c)}return a[n].exports}for(var u="function"==typeof require&&require,e=0;e<c.length;e++)h(c[e]);return h}({1:[function(e,t,n){"use strict";var r,i=this&&this.__extends||(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])},function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(n,"__esModule",{value:!0});var o=function(n){function e(){return null!==n&&n.apply(this,arguments)||this}return i(e,n),e.prototype.addEventListener=function(e,t){return n.prototype.addListener.call(this,e,t)},e.prototype.removeEventListener=function(e,t){return n.prototype.removeListener.call(this,e,t)},e.prototype.dispatchEvent=function(e,t){return n.prototype.emit.call(this,e,t)},e}(e("events").EventEmitter);n.EventDispatcher=o},{events:4}],2:[function(e,t,n){"use strict";var r,i=this&&this.__extends||(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])},function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(n,"__esModule",{value:!0});var o=e("./dispatcher"),s="8ec90001-f315-4f60-9fb8-838830daea50",a="8ec90002-f315-4f60-9fb8-838830daea50",h=!0,u={BUTTON_COMMAND:[1],CREATE_COMMAND:[1,1],CREATE_DATA:[1,2],RECEIPT_NOTIFICATIONS:[2],CACULATE_CHECKSUM:[3],EXECUTE:[4],SELECT_COMMAND:[6,1],SELECT_DATA:[6,2],RESPONSE:[96,32]},f={0:"Invalid opcode",1:"Operation successful",2:"Opcode not supported",3:"Missing or invalid parameter value",4:"Not enough memory for the data object",5:"Data object does not match the firmware and hardware requirements, the signature is wrong, or parsing the command failed",7:"Not a valid object type for a Create request",8:"The state of the DFU process does not allow this operation",10:"Operation failed",11:"Extended error"},l={0:"No extended error code has been set. This error indicates an implementation problem",1:"Invalid error code. This error code should never be used outside of development",2:"The format of the command was incorrect",3:"The command was successfully parsed, but it is not supported or unknown",4:"The init command is invalid. The init packet either has an invalid update type or it is missing required fields for the update type",5:"The firmware version is too low. For an application, the version must be greater than the current application. For a bootloader, it must be greater than or equal to the current version",6:"The hardware version of the device does not match the required hardware version for the update",7:"The array of supported SoftDevices for the update does not contain the FWID of the current SoftDevice",8:"The init packet does not contain a signature",9:"The hash type that is specified by the init packet is not supported by the DFU bootloader",10:"The hash of the firmware image cannot be calculated",11:"The type of the signature is unknown or not supported by the DFU bootloader",12:"The hash of the received firmware image does not match the hash in the init packet",13:"The available space on the device is insufficient to hold the firmware"},c=function(r){function c(e,t){var n=r.call(this)||this;return n.crc32=e,n.bluetooth=t,n.notifyFns={},n.controlChar=null,n.packetChar=null,!n.bluetooth&&window&&window.navigator&&window.navigator.bluetooth&&(n.bluetooth=navigator.bluetooth),n}return i(c,r),c.prototype.log=function(e){this.dispatchEvent(c.EVENT_LOG,{message:e})},c.prototype.progress=function(e){this.dispatchEvent(c.EVENT_PROGRESS,{object:"unknown",totalBytes:0,currentBytes:e})},c.prototype.connect=function(e){var t=this;return e.addEventListener("gattserverdisconnected",function(){t.notifyFns={},t.controlChar=null,t.packetChar=null}),this.gattConnect(e).then(function(e){if(t.log("found "+e.length+" characteristic(s)"),t.packetChar=e.find(function(e){return e.uuid===a}),!t.packetChar)throw new Error("Unable to find packet characteristic");if(t.log("found packet characteristic"),t.controlChar=e.find(function(e){return e.uuid===s}),!t.controlChar)throw new Error("Unable to find control characteristic");if(t.log("found control characteristic"),!t.controlChar.properties.notify&&!t.controlChar.properties.indicate)throw new Error("Control characteristic does not allow notifications");return t.controlChar.startNotifications()}).then(function(){return t.controlChar.addEventListener("characteristicvaluechanged",t.handleNotification.bind(t)),t.log("enabled control notifications"),e})},c.prototype.gattConnect=function(e){var t=this;return Promise.resolve().then(function(){return e.gatt.connected?e.gatt:e.gatt.connect()}).then(function(e){return t.log("connected to gatt server"),e.getPrimaryService(c.SERVICE_UUID).catch(function(){throw new Error("Unable to find DFU service")})}).then(function(e){return t.log("found DFU service"),e.getCharacteristics()})},c.prototype.handleNotification=function(e){var t=e.target.value;if(u.RESPONSE.indexOf(t.getUint8(0))<0)throw new Error("Unrecognised control characteristic response notification");var n=t.getUint8(1);if(this.notifyFns[n]){var r=t.getUint8(2),i=null;if(1===r){var o=new DataView(t.buffer,3);this.notifyFns[n].resolve(o)}else if(11===r){var s=t.getUint8(3);i="Error: "+l[s]}else i="Error: "+f[r];i&&(this.log("notify: "+i),this.notifyFns[n].reject(i)),delete this.notifyFns[n]}},c.prototype.sendOperation=function(o,s,a){var c=this;return new Promise(function(e,t){var n=s.length;a&&(n+=a.byteLength);var r=new Uint8Array(n);if(r.set(s),a){var i=new Uint8Array(a);r.set(i,s.length)}c.notifyFns[s[0]]={resolve:e,reject:t},o.writeValue(r)})},c.prototype.sendControl=function(e,t){return this.sendOperation(this.controlChar,e,t)},c.prototype.transferInit=function(e){return this.transfer(e,"init",u.SELECT_COMMAND,u.CREATE_COMMAND)},c.prototype.transferFirmware=function(e){return this.transfer(e,"firmware",u.SELECT_DATA,u.CREATE_DATA)},c.prototype.transfer=function(i,o,e,s){var a=this;return this.sendControl(e).then(function(e){var t=e.getUint32(0,h),n=e.getUint32(4,h),r=e.getInt32(8,h);if("init"!==o||n!==i.byteLength||!a.checkCrc(i,r))return a.progress=function(e){a.dispatchEvent(c.EVENT_PROGRESS,{object:o,totalBytes:i.byteLength,currentBytes:e})},a.progress(0),a.transferObject(i,s,t,n);a.log("init packet already available, skipping transfer")})},c.prototype.transferObject=function(i,e,t,o){var s=this,n=o-o%t,r=Math.min(n+t,i.byteLength),a=new DataView(new ArrayBuffer(4));return a.setUint32(0,r-n,h),this.sendControl(e,a.buffer).then(function(){var e=i.slice(n,r);return s.transferData(e,n)}).then(function(){return s.sendControl(u.CACULATE_CHECKSUM)}).then(function(e){var t=e.getInt32(4,h),n=e.getUint32(0,h),r=i.slice(0,n);if(s.checkCrc(r,t))return s.log("written "+n+" bytes"),o=n,s.sendControl(u.EXECUTE);s.log("object failed to validate")}).then(function(){if(r<i.byteLength)return s.transferObject(i,e,t,o);s.log("transfer complete")})},c.prototype.transferData=function(e,t,n){var r=this;n=n||0;var i=Math.min(n+20,e.byteLength),o=e.slice(n,i);return this.packetChar.writeValue(o).then(function(){if(r.progress(t+i),i<e.byteLength)return r.transferData(e,t,i)})},c.prototype.checkCrc=function(e,t){return this.crc32?t===this.crc32(new Uint8Array(e)):(this.log("crc32 not found, skipping CRC check"),!0)},c.prototype.requestDevice=function(t,e){var n=this;t||e||(e=[{services:[c.SERVICE_UUID]}]);var r={optionalServices:[c.SERVICE_UUID]};return e?r.filters=e:r.acceptAllDevices=!0,this.bluetooth.requestDevice(r).then(function(e){return t?n.setDfuMode(e):e})},c.prototype.setDfuMode=function(i){var o=this;return this.gattConnect(i).then(function(e){o.log("found "+e.length+" characteristic(s)");var t=e.find(function(e){return e.uuid===s}),n=e.find(function(e){return e.uuid===a});if(t&&n)return i;var r=e.find(function(e){return"8ec90003-f315-4f60-9fb8-838830daea50"===e.uuid});if(!r)throw new Error("Unsupported device");if(o.log("found buttonless characteristic"),!r.properties.notify&&!r.properties.indicate)throw new Error("Buttonless characteristic does not allow notifications");return new Promise(function(e,t){function n(){this.notifyFns={},e(null)}r.startNotifications().then(function(){return o.log("enabled buttonless notifications"),i.addEventListener("gattserverdisconnected",n.bind(o)),r.addEventListener("characteristicvaluechanged",o.handleNotification.bind(o)),o.sendOperation(r,u.BUTTON_COMMAND)}).then(function(){o.log("sent DFU mode"),n()})})})},c.prototype.update=function(n,r,i){var o=this;return new Promise(function(e,t){return n?r?i?void o.connect(n).then(function(){return o.log("transferring init"),o.transferInit(r)}).then(function(){return o.log("transferring firmware"),o.transferFirmware(i)}).then(function(){o.log("complete, disconnecting..."),n.addEventListener("gattserverdisconnected",function(){o.log("disconnected"),e(n)})}).catch(function(e){return t(e)}):t("Firmware not specified"):t("Init not specified"):t("Device not specified")})},c.SERVICE_UUID=65113,c.EVENT_LOG="log",c.EVENT_PROGRESS="progress",c}(o.EventDispatcher);n.SecureDfu=c},{"./dispatcher":1}],3:[function(e,t,n){"use strict";var r=e("./secure-dfu");t.exports=r.SecureDfu},{"./secure-dfu":2}],4:[function(e,t,n){function r(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function c(e){return"function"==typeof e}function h(e){return"object"==typeof e&&null!==e}function u(e){return void 0===e}((t.exports=r).EventEmitter=r).prototype._events=void 0,r.prototype._maxListeners=void 0,r.defaultMaxListeners=10,r.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},r.prototype.emit=function(e){var t,n,r,i,o,s;if(this._events||(this._events={}),"error"===e&&(!this._events.error||h(this._events.error)&&!this._events.error.length)){if((t=arguments[1])instanceof Error)throw t;var a=new Error('Uncaught, unspecified "error" event. ('+t+")");throw a.context=t,a}if(u(n=this._events[e]))return!1;if(c(n))switch(arguments.length){case 1:n.call(this);break;case 2:n.call(this,arguments[1]);break;case 3:n.call(this,arguments[1],arguments[2]);break;default:i=Array.prototype.slice.call(arguments,1),n.apply(this,i)}else if(h(n))for(i=Array.prototype.slice.call(arguments,1),r=(s=n.slice()).length,o=0;o<r;o++)s[o].apply(this,i);return!0},r.prototype.on=r.prototype.addListener=function(e,t){var n;if(!c(t))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,c(t.listener)?t.listener:t),this._events[e]?h(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,h(this._events[e])&&!this._events[e].warned&&(n=u(this._maxListeners)?r.defaultMaxListeners:this._maxListeners)&&0<n&&this._events[e].length>n&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace()),this},r.prototype.once=function(e,t){if(!c(t))throw TypeError("listener must be a function");var n=!1;function r(){this.removeListener(e,r),n||(n=!0,t.apply(this,arguments))}return r.listener=t,this.on(e,r),this},r.prototype.removeListener=function(e,t){var n,r,i,o;if(!c(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(i=(n=this._events[e]).length,r=-1,n===t||c(n.listener)&&n.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t);else if(h(n)){for(o=i;0<o--;)if(n[o]===t||n[o].listener&&n[o].listener===t){r=o;break}if(r<0)return this;1===n.length?(n.length=0,delete this._events[e]):n.splice(r,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},r.prototype.removeAllListeners=function(e){var t,n;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(c(n=this._events[e]))this.removeListener(e,n);else if(n)for(;n.length;)this.removeListener(e,n[n.length-1]);return delete this._events[e],this},r.prototype.listeners=function(e){return this._events&&this._events[e]?c(this._events[e])?[this._events[e]]:this._events[e].slice():[]},r.prototype.listenerCount=function(e){if(this._events){var t=this._events[e];if(c(t))return 1;if(t)return t.length}return 0},r.listenerCount=function(e,t){return e.listenerCount(t)}},{}]},{},[3])(3)});
//# sourceMappingURL=secure-dfu.js.map