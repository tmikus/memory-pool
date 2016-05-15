"use strict";

function TestObject()
{
    this.doSomething = function ()
    {

    };
}

function testWithoutMP()
{
    var object;
    for (var index = 0; index < 1000000; index++)
    {
        object = new TestObject();
        object.doSomething();
    }
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
    var withoutMPTime = document.getElementById("without-mp-time"),
        withoutMPStatus = document.getElementById("without-mp-status"),
        withMPTime = document.getElementById("with-mp-time"),
        withMPStatus = document.getElementById("with-mp-status");

    withoutMPTime.innerText = "Running...";
    withoutMPStatus.innerText = "Running...";
    withMPTime.innerText = "Pending";
    withMPStatus.innerText = "Pending";

    var timeBefore, timeAfter;

    timeBefore = performance.now();
    testWithoutMP();
    timeAfter = performance.now();

    withoutMPTime.innerText = (timeAfter - timeBefore) + "ms";
    withoutMPStatus.innerText = "Done";

    timeBefore = performance.now();
    testWithMP();
    timeAfter = performance.now();

    withMPTime.innerText = (timeAfter - timeBefore) + "ms";
    withMPStatus.innerText = "Done";
}

window.addEventListener("load", function ()
{
    document.getElementById("start-test").addEventListener("click", startTest);
});