"use strict";!function(){function e(e,r,s){this.growBy=s||t,this.objectFactory=r,this.objectsArray=new Array(e),this.freeIndicesArray=new Uint32Array(e),this.lastFreeIndex=e-1;for(var o,i=0;e>i;i++)this.objectsArray[i]=o=r(),o.__memoryAddress__=i,this.freeIndicesArray[i]=i}var r="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global||this,t=256;e.prototype={allocate:function(){if(-1==this.lastFreeIndex){var e=this.objectsArray.length,r=e+this.growBy;this.objectsArray.length=r,this.freeIndicesArray.length=r;var t,s=0;do t=this.objectFactory(),t.__memoryAddress__=e,this.objectsArray[e]=t,this.freeIndicesArray[s++]=e++;while(r>e);this.lastFreeIndex=this.growBy-1}return this.objectsArray[this.freeIndicesArray[this.lastFreeIndex--]]},free:function(e){this.freeIndicesArray[++this.lastFreeIndex]=e.__memoryAddress__}},"undefined"==typeof exports||exports.nodeType?r.MemoryPool=e:("undefined"!=typeof module&&!module.nodeType&&module.exports&&(exports=module.exports=e),exports.MemoryPool=e)}();