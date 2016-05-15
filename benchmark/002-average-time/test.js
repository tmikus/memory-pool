"use strict";

function TestObject()
{
    this.doSomething = function ()
    {

    };
}

function testWithMP()
{
    function testObjectFactory(memoryAddress)
    {
        var object = new TestObject();
        object.memoryAddress = memoryAddress;
        return object;
    }
    var memoryPool = new MemoryPool(1, testObjectFactory);

    var object;
    for (var index = 0; index < 1000000; index++)
    {
        object = memoryPool.allocate();
        object.doSomething();
        memoryPool.free(object);
    }
}

function startTest()
{
    var testsToRun = 200;

    var withMPTime = document.getElementById("with-mp-time"),
        withMPStatus = document.getElementById("with-mp-status");

    withMPTime.innerText = "Pending";
    withMPStatus.innerText = "Pending";

    var timeBefore, timeAfter, totalTime = 0;

    for (var index = 0; index < testsToRun; index++)
    {
        timeBefore = performance.now();
        testWithMP();
        timeAfter = performance.now();

        totalTime += timeAfter - timeBefore;
    }

    withMPTime.innerText = "avg. " + (totalTime / testsToRun) + "ms";
    withMPStatus.innerText = "Done";
}

window.addEventListener("load", function ()
{
    document.getElementById("start-test").addEventListener("click", startTest);
});