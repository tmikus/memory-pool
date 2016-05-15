"use strict";

(function ()
{
    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = typeof self == 'object' && self.self === self && self ||
               typeof global == 'object' && global.global === global && global ||
               this;

    var MEMORY_GROW_STEP = 256;

    function MemoryPool(size, objectFactory, growBy)
    {
        this.growBy = growBy || MEMORY_GROW_STEP;
        this.objectFactory = objectFactory;
        this.objectsArray = new Array(size);
        this.freeIndicesArray = new Uint32Array(size);
        this.lastFreeIndex = size - 1;

        for (var index = 0; index < size; index++)
        {
            this.objectsArray[index] = objectFactory(index);
            this.freeIndicesArray[index] = index;
        }
    }

    MemoryPool.prototype =
    {
        allocate: function ()
        {
            // Expand the array for new element
            if (this.lastFreeIndex == -1)
            {
                var objectsArraySize = this.objectsArray.length;
                var increasedObjectsArraySize = objectsArraySize + this.growBy;

                this.objectsArray.length = increasedObjectsArraySize;
                this.freeIndicesArray.length = increasedObjectsArraySize;

                var index = 0;
                do
                {
                    this.objectsArray[objectsArraySize] = this.objectFactory(objectsArraySize);
                    this.freeIndicesArray[index++] = objectsArraySize++;
                }
                while(objectsArraySize < increasedObjectsArraySize);

                this.lastFreeIndex = this.growBy - 1;
            }

            return this.objectsArray[this.freeIndicesArray[this.lastFreeIndex--]];
        },

        free: function (object)
        {
            this.freeIndicesArray[++this.lastFreeIndex] = object.memoryAddress;
        }
    };

    // Export the memory pool object for Node.js, with
    // backwards-compatibility for their old module API. If we're in
    // the browser, add `_` as a global object.
    // (`nodeType` is checked to ensure that `module`
    // and `exports` are not HTML elements.)
    if (typeof exports != 'undefined' && !exports.nodeType)
    {
        if (typeof module != 'undefined' && !module.nodeType && module.exports)
        {
            exports = module.exports = MemoryPool;
        }

        exports.MemoryPool = MemoryPool;
    }
    else
    {
        root.MemoryPool = MemoryPool;
    }
})();