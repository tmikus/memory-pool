"use strict";

function Vector3(x, y, z)
{
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

Vector3.prototype =
{
    add: function (a, b)
    {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
    }
};

function testWithoutMP()
{
    var result, a, b;
    for (var index = 0; index < 1000000; index++)
    {
        result = new Vector3();
        a = new Vector3(1, 2, 3);
        b = new Vector3(4, 5, 6);

        result.add(a, b);
    }
}

function vector3Factory()
{
    return new Vector3(0, 0, 0);
}

var memoryPool = new MemoryPool(3, vector3Factory);

function testWithMP()
{
    var result, a, b;
    for (var index = 0; index < 1000000; index++)
    {
        result = memoryPool.allocate();
        a = memoryPool.allocate();
        b = memoryPool.allocate();

        a.x = 1;
        a.y = 2;
        a.z = 3;

        b.x = 4;
        b.y = 5;
        b.z = 6;

        result.add(a, b);

        memoryPool.free(b);
        memoryPool.free(a);
        memoryPool.free(result);
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
    testWithMP();
    timeAfter = performance.now();

    withMPTime.innerText = (timeAfter - timeBefore) + "ms";
    withMPStatus.innerText = "Done";

    timeBefore = performance.now();
    testWithoutMP();
    timeAfter = performance.now();

    withoutMPTime.innerText = (timeAfter - timeBefore) + "ms";
    withoutMPStatus.innerText = "Done";
}

window.addEventListener("load", function ()
{
    document.getElementById("start-test").addEventListener("click", startTest);
});