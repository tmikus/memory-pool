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