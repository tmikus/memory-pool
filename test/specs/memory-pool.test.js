"use strict";

function simpleObjectFactory(index)
{
    return { memoryAddress: index };
}

function checkFreeIndicesArray(pool, expectedValues)
{
    for (var index = 0; index < pool.freeIndicesArray.length; index++)
    {
        expect(pool.freeIndicesArray[index]).toEqual(expectedValues[index]);
    }
}

describe("Memory pool constructor tests.", function ()
{
    var objectFactory;

    beforeEach(function ()
    {
        objectFactory = jasmine.createSpy("objectFactory").and.callFake(simpleObjectFactory);
    });

    it("Should have MemoryPool defined.", function ()
    {
        expect(MemoryPool).not.toBeUndefined();
    });

    it("Should be able to create instance of MemoryPool with size and objectFactory.", function ()
    {
        function test()
        {
            new MemoryPool(10000, objectFactory);
        }

        expect(test).not.toThrow();
    });

    it("Should set default value to growBy.", function ()
    {
        var pool = new MemoryPool(10, objectFactory);
        expect(pool.growBy).toEqual(256);
    });

    it("Should set correct value to 'growBy'.", function ()
    {
        var pool = new MemoryPool(10, objectFactory);
        expect(pool.growBy).toEqual(256);
    });

    it("Should set correct value to 'objectFactory'.", function ()
    {
        var pool = new MemoryPool(10, objectFactory);
        expect(pool.objectFactory).toBe(objectFactory);
    });

    it("Should set 'objectsArray'.", function ()
    {
        var pool = new MemoryPool(10, objectFactory);
        expect(pool.objectsArray.constructor).toBe(Array);
    });

    it("'objectsArray' should be of correct size.", function ()
    {
        var pool = new MemoryPool(10, objectFactory);
        expect(pool.objectsArray.length).toEqual(10);
    });

    it("Should set 'freeIndicesArray'.", function ()
    {
        var pool = new MemoryPool(10, objectFactory);
        expect(pool.freeIndicesArray.constructor).toBe(Uint32Array);
    });

    it("'freeIndicesArray' should be of correct size.", function ()
    {
        var pool = new MemoryPool(10, objectFactory);
        expect(pool.freeIndicesArray.length).toEqual(10);
    });

    it("Should set correct value to 'lastFreeIndex'.", function ()
    {
        var pool = new MemoryPool(10, objectFactory);
        expect(pool.lastFreeIndex).toEqual(9);
    });

    it("Should call 'objectsFactory' correct number of times.", function ()
    {
        new MemoryPool(10, objectFactory);
        expect(objectFactory.calls.count()).toEqual(10);
    });

    it("Should fill 'objectsArray' with correct values.", function ()
    {
        var pool = new MemoryPool(3, objectFactory);
        expect(pool.objectsArray).toEqual([
            { memoryAddress: 0 },
            { memoryAddress: 1 },
            { memoryAddress: 2 }
        ]);
    });

    it("Should fill 'freeIndicesArray' with correct values.", function ()
    {
        var pool = new MemoryPool(3, objectFactory);
        var expectedValues = [0, 1, 2];
        checkFreeIndicesArray(pool, expectedValues);
    });
});

describe("Allocation and freeing without expanding.", function ()
{
    var pool;
    var objectsCount = 3;

    beforeEach(function ()
    {
        pool = new MemoryPool(objectsCount, simpleObjectFactory);
    });

    it("Should allocate correct objects.", function ()
    {
        for (var objectIndex = 0; objectIndex < objectsCount; objectIndex++)
        {
            var object = pool.allocate();
            expect(object.memoryAddress).toEqual(objectsCount - objectIndex - 1);
        }
    });

    it("Should not expand the memory array when allocated maximum number of objects.", function ()
    {
        for (var objectIndex = 0; objectIndex < objectsCount; objectIndex++)
        {
            pool.allocate();
        }

        expect(pool.objectsArray.length).toEqual(objectsCount);
    });

    it("Should return correct objects to 'freeIndicesArray' when freeing.", function ()
    {
        var first = pool.allocate();
        var second = pool.allocate();
        var third = pool.allocate();

        checkFreeIndicesArray(pool, [0, 1, 2]);
        expect(pool.lastFreeIndex).toEqual(-1);

        pool.free(first);
        checkFreeIndicesArray(pool, [2, 1, 2]);
        expect(pool.lastFreeIndex).toEqual(0);

        pool.free(third);
        checkFreeIndicesArray(pool, [2, 0, 2]);
        expect(pool.lastFreeIndex).toEqual(1);

        pool.free(second);
        checkFreeIndicesArray(pool, [2, 0, 1]);
        expect(pool.lastFreeIndex).toEqual(2);
    });
});

describe("Allocation and freeing without expanding.", function ()
{
    var pool;

    beforeEach(function ()
    {
        pool = new MemoryPool(1, simpleObjectFactory, 3);
        pool.allocate();
        pool.allocate();
    });

    it("Should expand the 'objectsArray' to new size.", function ()
    {
        expect(pool.objectsArray.length).toEqual(4);
    });

    it("Should have correct objects inside 'objectsArray'.", function ()
    {
        expect(pool.objectsArray).toEqual([
            { memoryAddress: 0 },
            { memoryAddress: 1 },
            { memoryAddress: 2 },
            { memoryAddress: 3 }
        ]);
    });

    it("Should have correct values inside 'freeIndicesArray'.", function ()
    {
        checkFreeIndicesArray(pool, [1, 0, 3, 2])
    });
});