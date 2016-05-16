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
    for (var index = 0; index < 1000000; index++)
    {
        result = new Vector3();
        a = new Vector3(1, 2, 3);
        b = new Vector3(4, 5, 6);

        result.add(a, b);
    }
}

function testWithMP()
{
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

function vector3Factory()
{
    return new Vector3(0, 0, 0);
}

var timeBefore = 0,
    timeAfter = 0,
    repetitions = 0,
    memoryPool = new MemoryPool(3, vector3Factory),
    result,
    a,
    b;

var nextAnimationFrame,
    testMethod = testWithMP;

var withoutMPTime,
    withoutMPStatus,
    withMPTime,
    withMPStatus;

function renderLoop()
{
    if (timeBefore == 0)
    {
        timeBefore = performance.now();
    }

    testMethod();
    repetitions++;

    nextAnimationFrame = requestAnimationFrame(renderLoop);
}

function onTimerOver()
{
    timeAfter = performance.now();
    cancelAnimationFrame(nextAnimationFrame);

    var totalTime = timeAfter - timeBefore;

    if (testMethod === testWithMP)
    {
        withMPTime.innerText = "avg. " + (totalTime / repetitions) + "ms";
        withMPStatus.innerText = (repetitions / (totalTime / 1000)) + " FPS";

        withoutMPTime.innerText = "Running...";
        withoutMPStatus.innerText = "Running...";

        testMethod = testWithoutMP;
        repetitions = 0;
        timeBefore = 0;

        requestAnimationFrame(renderLoop);
        setTimeout(onTimerOver, 10000);
    }
    else
    {
        withoutMPTime.innerText = "avg. " + (totalTime / repetitions) + "ms";
        withoutMPStatus.innerText = (repetitions / (totalTime / 1000)) + " FPS";
    }
}

function startTest()
{
    withoutMPTime = document.getElementById("without-mp-time");
    withoutMPStatus = document.getElementById("without-mp-status");
    withMPTime = document.getElementById("with-mp-time");
    withMPStatus = document.getElementById("with-mp-status");

    withMPTime.innerText = "Running...";
    withMPStatus.innerText = "Running...";
    withoutMPTime.innerText = "Pending";
    withoutMPStatus.innerText = "Pending";

    nextAnimationFrame = requestAnimationFrame(renderLoop);
    setTimeout(onTimerOver, 10000);
}

window.addEventListener("load", function ()
{
    document.getElementById("start-test").addEventListener("click", startTest);
});