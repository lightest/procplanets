var world = {
    lastTime: 0,
    init: function () {
        this.cnv = document.querySelector('canvas');
        this.cnv.width = 800;
        this.cnv.height = 600;
        this.ctx = this.cnv.getContext('2d');
        this.lastTime = new Date().getTime();
        this.ctx.strokeStyle = 'red';
    }
};

var observer = {
    z: 0
};

function generateRandom (seed) {
    if(!seed) { return Math.random(); }
    seed = seed << 6;
    seed = seed >>> 4;
    seed *= 4;
    seed = seed + seed % 13;
    return seed;
};

function Planet () {
    this.x = 0;
    this.y = 0;
    this.r = 0;
};


Planet.prototype.render = function () {
    var ctx = world.ctx;
    ctx.moveTo(this.x + this.r, this.y);
    ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
};

function periodic (arg) {
    var result = ( arg * .002 ) % (Math.PI * 2);
    return result;
};

periodic.getPeriod = function () {
    return (Math.PI * 2) / .002;
};

var time = 0;
function setupPlanets (dt) {
    time+=dt * 50;
    var multiplier = 100;
    var yGrowth1 = Math.exp(periodic(time) * 1.12 - 2) * 12;
    var radGrowth1 = Math.exp(periodic(time) * 1.225 - 4) * 33;
    // console.log(radGrowth1);

    var k = periodic.getPeriod() * .5;
    var yGrowth2 = Math.exp(periodic(time + k) * 1.12 - 2) * 12;
    var radGrowth2 = Math.exp(periodic(time + k) * 1.225 - 4) * 33;

    visiblePlanets[0].x = (world.cnv.width * .5) | 0;
    visiblePlanets[0].y = ( (world.cnv.height * .1) + yGrowth1 ) | 0;
    visiblePlanets[0].r = (radGrowth1) | 0;

    visiblePlanets[1].x = visiblePlanets[0].x;
    visiblePlanets[1].y = ( (world.cnv.height * .1) + yGrowth2 ) | 0;
    visiblePlanets[1].r = (radGrowth2) | 0;
};

function update (dt) {
    setupPlanets(dt);
};


function renderWorld () {
    world.ctx.beginPath();
    for(var i = visiblePlanets.length; --i >= 0;) {
        visiblePlanets[i].render();
    }
    world.ctx.closePath();
    world.ctx.stroke();
};

function render () {
    var ctx = world.ctx;
    ctx.fillRect(0, 0, world.cnv.width, world.cnv.height);
    renderWorld();
};

var planetsDist = 100;
var visiblePlanets = [];
function mainLoop () {
    requestAnimationFrame(mainLoop);
    var now = new Date().getTime();
    var dt = Math.min(now - world.lastTime, .1);
    update(dt);
    render();
    world.lastTime = now;
};

function initControls () {
    document.querySelector('#distance').addEventListener('input', function () {
        observer.z = parseInt(this.value) || 0;
    });
};

window.onload = function () {
    world.init();
    visiblePlanets[0] = new Planet();
    visiblePlanets[1] = new Planet();
    initControls();
    requestAnimationFrame(mainLoop);
};