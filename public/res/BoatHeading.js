/* global d3 */
'use strict';


function BoatHeading(svgID, width) { //create all the clock elements

    const SMALL_THRESH = 32;
    const WIDTH_DIVIDER = 12;

    const isSmall = width / WIDTH_DIVIDER < SMALL_THRESH;
    const margin = Math.min(SMALL_THRESH, width / WIDTH_DIVIDER);
    const clockRadius = width / 2 - margin * 1.2;
    // const width = (clockRadius + margin) * 2;
    const height = width;

    const rim = {width: margin, colour: '#ddd'};
    const smallTicks = {name: 'small', num: isSmall ? 180 : 360, width: 1, length: 5, colour: '#aaa'};
    const mediumTicks = {name: 'medium', num: 36, width: 1.3, length: 8, colour: '#aaa'};
    const largeTicks = {name: 'large', num: 8, width: 2.2, length: 15, colour: '#aaa'};
    const boatOptions = {img: 'res/shape/boat-shape.svg', buffer: 8};

    const pointSize = margin / 3;
    const bufferSize = margin / 2 - pointSize;
    const waypointOptions = {colour: 'rgba(215, 0, 0, 0.5)', radius: pointSize, buffer: bufferSize};
    const apWindOptions = {colour: 'rgba(0, 0, 215, 0.5)', size: pointSize, buffer: bufferSize};

    const container = createSVGContainer(svgID, width, height, width / 2);

    container.append('circle')
                .attr('id', 'rim')
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('r', clockRadius + rim.width / 2)
                .style('fill', 'transparent')
                .style('stroke-width', rim.width)
                .style('stroke', rim.colour);

    this.boat = new Boat(container, clockRadius, boatOptions);
    this.nextWaypoint = new Waypoint(container, clockRadius, waypointOptions);
    this.apparentWind = new Wind(container, clockRadius, apWindOptions);

    // Add the boat-heading angle ticks
    const face = container.append('g')
        .attr('id', 'ticks');

    createTicks(face, clockRadius, smallTicks);
    createTicks(face, clockRadius, mediumTicks);
    createTicks(face, clockRadius, largeTicks);

    d3.select(self.frameElement).style('height', height + 'px');

    function createTicks(container, radius, options) {
        const name = options.name + 'Tick';
        const separation = 360 / options.num;
        const scale = d3.scaleLinear()
            .range([0, 360 - separation])
            .domain([0, options.num - 1]);

        // Add the marks
        container.selectAll('.' + name)
            .data(d3.range(0, options.num)).enter()
            .append('line')
            .attr('class', name)
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', radius)
            .attr('y2', radius - options.length)
            .attr('stroke', options.colour)
            .attr('transform', function (d) {
                return 'rotate(' + scale(d) + ')';
            })
            .style('stroke-width', options.width);

    }
}
BoatHeading.prototype.setHeadings = function(headings) {
    this.boat.setHeading(headings.boat);
    this.nextWaypoint.setHeading(headings.nextWaypoint);
    this.apparentWind.setHeading(headings.apparentWind);
};


/**
 * Draw the boat.
 * @param {object} container    The container we will attach the triangle to.
 * @param {number} clockRadius  The radius of the clock.
 * @param {object} options      E.g. {img: 'boat-shape.svg', buffer: 8}
 */
function Boat(container, clockRadius, options) {
    const length = (clockRadius - options.buffer) * 2;

    this.boat = container.append('svg:image')
        .attr('xlink:href', options.img)
        .attr('id', 'boat')
        .attr('width', length)
        .attr('height', length)
        .attr('x', -length / 2)
        .attr('y', -length / 2);

}
Boat.prototype.setHeading = function (angle) {
    this.boat.attr('transform', 'rotate(' + angle + ')');
};


/**
 * Draw the heading of a given Waypoint.
 * @param {object} container    The container we will attach the triangle to.
 * @param {number} clockRadius  The radius of the clock.
 * @param {object} options      E.g. {colour: 'rgba(0, 0, 215, 0.5)', size: pointSize, buffer: bufferSize};
 */
function Waypoint(container, clockRadius, options) {
    this.offset = clockRadius + options.radius + options.buffer;
    this.waypoint = container.append('circle')
        .attr('r', options.radius)
        .attr('cx', 0)
        .attr('cy', -this.offset)
        .style('fill', options.colour)
        .style('stroke', 'transparent');
}
Waypoint.prototype.setHeading = function (angle) {
    this.waypoint.attr('transform', 'rotate(' + angle + ')');
};


/**
 * Draw the wind direction as a triangle.
 * @param {object} container    The container we will attach the triangle to.
 * @param {number} clockRadius  The radius of the clock.
 * @param {object} options      E.g. {colour: 'rgba(0, 0, 215, 0.5)', size: pointSize, buffer: bufferSize};
 */
function Wind(container, clockRadius, options) {

    const s = options.size.toString();
    let triangle = '';
        triangle += 'M -' + s + ' -' + s + ' ';
        triangle += 'L ' + s + ' -' + s + ' ';
        triangle += 'L 0 ' + s + ' z';

    this.offset = clockRadius + options.size + options.buffer;

    this.wind = container.append('path')
        .attr('d', triangle)
        .attr('transform', 'translate(0, ' + -this.offset + ')')
        .style('fill', options.colour)
        .style('stroke', 'transparent');
}
Wind.prototype.setHeading = function (angle) {
    this.wind.attr('transform', 'rotate(' + angle + ') translate(0, ' + -this.offset + ')');
};




// function BoatHeading(svgID) { //create all the clock elements
//
//     const clockRadius = 128;
//     const margin = 32;
//     const width = (clockRadius + margin) * 2;
//     const height = (clockRadius + margin) * 2;
//
//     const rim = {width: margin, colour: '#ddd'};
//     const smallTicks = {name: 'small', num: 360, width: 1, length: 5, colour: '#aaa'};
//     const mediumTicks = {name: 'medium', num: 36, width: 1.3, length: 8, colour: '#aaa'};
//     const largeTicks = {name: 'large', num: 8, width: 2.2, length: 15, colour: '#aaa'};
//     const boatOptions = {img: 'boat-shape.svg', buffer: 8};
//
//     const pointSize = margin / 3;
//     const bufferSize = margin / 2 - pointSize;
//     const waypointOptions = {colour: 'rgba(215, 0, 0, 0.5)', radius: pointSize, buffer: bufferSize};
//     const apWindOptions = {colour: 'rgba(0, 0, 215, 0.5)', size: pointSize, buffer: bufferSize};
//
//     const svg = d3.select(svgID)
//         .append('svg')
//         .attr('id', 'boat-heading-svg')
//         .attr('width', width)
//         .attr('height', height);
//
//     const container = svg.append('g')
//         .attr('id', 'boat-heading-container')
//         .attr('transform', 'translate(' + (clockRadius + margin) + ',' + (clockRadius + margin) + ')');
//
//     container.append('circle')
//         .attr('id', 'rim')
//         .attr('cx', 0)
//         .attr('cy', 0)
//         .attr('r', clockRadius + rim.width / 2)
//         .style('fill', 'transparent')
//         .style('stroke-width', rim.width)
//         .style('stroke', rim.colour);
//
//     this.boat = new Boat(container, clockRadius, boatOptions);
//     this.nextWaypoint = new Waypoint(container, clockRadius, waypointOptions);
//     this.apparentWind = new Wind(container, clockRadius, apWindOptions);
//
//     // Add the boat-heading angle ticks
//     const face = container.append('g')
//         .attr('id', 'ticks');
//
//     createTicks(face, clockRadius, smallTicks);
//     createTicks(face, clockRadius, mediumTicks);
//     createTicks(face, clockRadius, largeTicks);
//
//     d3.select(self.frameElement).style('height', height + 'px');
//
//     function createTicks(container, radius, options) {
//         const name = options.name + 'Tick';
//         const separation = 360 / options.num;
//         const scale = d3.scale.linear()
//             .range([0, 360 - separation])
//             .domain([0, options.num - 1]);
//
//         // Add the marks
//         container.selectAll('.' + name)
//             .data(d3.range(0, options.num)).enter()
//             .append('line')
//             .attr('class', name)
//             .attr('x1', 0)
//             .attr('x2', 0)
//             .attr('y1', radius)
//             .attr('y2', radius - options.length)
//             .attr('stroke', options.colour)
//             .attr('transform', function (d) {
//                 return 'rotate(' + scale(d) + ')';
//             })
//             .style('stroke-width', options.width);
//
//     }
// }
// BoatHeading.prototype.setHeadings = function(headings) {
//     this.boat.setHeading(headings.boat);
//     this.nextWaypoint.setHeading(headings.nextWaypoint);
//     this.apparentWind.setHeading(headings.apparentWind);
// };
//
// const boatHeading = new BoatHeading('#boat-heading');
//
// const t0 = new Date().getTime();
// setInterval(function () {
//     const t = new Date().getTime();
//     boatHeading.setHeadings({
//         boat: ((t - t0) / 300),
//         nextWaypoint: (-(t - t0) / 200),
//         apparentWind: (-(t - t0) / 100)
//     });
// }, 20);
//
//
// /**
//  * Draw the boat.
//  * @param {object} container    The container we will attach the triangle to.
//  * @param {number} clockRadius  The radius of the clock.
//  * @param {object} options      E.g. {img: 'boat-shape.svg', buffer: 8}
//  */
// function Boat(container, clockRadius, options) {
//     const length = (clockRadius - options.buffer) * 2;
//
//     this.boat = container.append('svg:image')
//         .attr('xlink:href', options.img)
//         .attr('id', 'boat')
//         .attr('width', length)
//         .attr('height', length)
//         .attr('x', -length / 2)
//         .attr('y', -length / 2);
//
// }
// Boat.prototype.setHeading = function (angle) {
//     this.boat.attr('transform', 'rotate(' + angle + ')');
// };
//
//
// /**
//  * Draw the heading of a given Waypoint.
//  * @param {object} container    The container we will attach the triangle to.
//  * @param {number} clockRadius  The radius of the clock.
//  * @param {object} options      E.g. {colour: 'rgba(0, 0, 215, 0.5)', size: pointSize, buffer: bufferSize};
//  */
// function Waypoint(container, clockRadius, options) {
//     this.offset = clockRadius + options.radius + options.buffer;
//     this.waypoint = container.append('circle')
//         .attr('r', options.radius)
//         .attr('cx', 0)
//         .attr('cy', -this.offset)
//         .style('fill', options.colour)
//         .style('stroke', 'transparent');
// }
// Waypoint.prototype.setHeading = function (angle) {
//     this.waypoint.attr('transform', 'rotate(' + angle + ')');
// };
//
//
// /**
//  * Draw the wind direction as a triangle.
//  * @param {object} container    The container we will attach the triangle to.
//  * @param {number} clockRadius  The radius of the clock.
//  * @param {object} options      E.g. {colour: 'rgba(0, 0, 215, 0.5)', size: pointSize, buffer: bufferSize};
//  */
// function Wind(container, clockRadius, options) {
//
//     const s = options.size.toString();
//     let triangle = '';
//     triangle += 'M -' + s + ' -' + s + ' ';
//     triangle += 'L ' + s + ' -' + s + ' ';
//     triangle += 'L 0 ' + s + ' z';
//
//     this.offset = clockRadius + options.size + options.buffer;
//
//     this.wind = container.append('path')
//         .attr('d', triangle)
//         .attr('transform', 'translate(0, ' + -this.offset + ')')
//         .style('fill', options.colour)
//         .style('stroke', 'transparent');
// }
// Wind.prototype.setHeading = function (angle) {
//     this.wind.attr('transform', 'rotate(' + angle + ') translate(0, ' + -this.offset + ')');
// };