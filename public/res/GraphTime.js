/* global d3 */
'use strict';

/*
 * TODO: Make the transition smooth when adding a point (see https://bost.ocks.org/mike/path/)
 */


function GraphTime(svgID, options) {

    const margin = options.margin;
    const width = options.width - margin.left - margin.right;
    const height = options.height - margin.top - margin.bottom;
    const self = this;
    const textWidth = 80;
    const graphWidth = width - textWidth;

    self.maxDataPoints = graphWidth;
    self.data = [];
    self.container = createSVGContainer(svgID, options.width, options.height, margin);

    //noinspection JSUnresolvedFunction
    self.x = d3.scaleTime()
        .domain([0, self.maxDataPoints - 1])
        .range([0, graphWidth]);

    //noinspection JSUnresolvedFunction
    self.y = d3.scaleLinear()
        .domain([options.range.min, options.range.max])
        .range([height, 0]);

    //noinspection JSUnresolvedFunction
    self.line = d3.line()
        .x(function(d, i) {
            return self.x(i);
        })
        .y(function (d) { // eslint-disable-line no-unused-vars
            return self.y(d);
        });
    self.container.append('defs').append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', graphWidth)
        .attr('height', height);

    //noinspection JSUnresolvedFunction
    const xAxis = d3.axisBottom(self.x)
        .tickSize(0)
        .tickFormat('');
    self.container.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + self.y(0) + ')')
        .call(xAxis);

    //noinspection JSUnresolvedFunction
    const yAxis = d3.axisLeft(self.y)
        .tickSize(2)
        .tickValues(d3.range(options.range.min, options.range.max, options.range.step))
        .tickFormat(d3.format('0.0f'));

    self.container.append('g')
        .attr('class', 'axis axis--y')
        .call(yAxis)
        .append('text')
        .attr('dy', '1em')
        .attr('dx', 10)
        .attr('font-size', '2em')
        .style('fill', '#aaa')
        .style('text-anchor', 'start')
        .text(`${options.label} (${options.unit})`);

    self.container.selectAll('.axis--y').select('.domain').attr('stroke', '#aaa');
    self.container.selectAll('.axis--x').select('.domain').attr('stroke', '#aaa');
    self.container.selectAll('g.tick line').attr('stroke', '#aaa');
    self.container.selectAll('g.tick text').attr('fill', '#aaa');

    //
    // Add the data line
    //

    self.dataLine = self.container.append('g')
            .attr('clip-path', 'url(#clip)')
            .append('path')
            .datum(self.data)
            .attr('class', 'line')

    //
    // Add the text
    //

    self.dataText =  self.container.append('g')
        .append('text')
            .attr('class', 'text')
            .attr('x', graphWidth)
            .attr('y', 50)
            .style('fill', '#aaa')
            .attr('font-size', '2.5em')

}
GraphTime.prototype.addPoint = function(point) {
    // Push a new data point onto the back.
    this.data.push(point);
    this.redraw();

    // Pop the old data point off the front.
    if (this.data.length >= this.maxDataPoints) {
        this.data.shift();
    }
};
GraphTime.prototype.redraw = function() {
    this.dataLine
    // d3.select('#data-line')
        .attr('d', this.line)
        .attr('transform', 'translate(' + this.x(-1) + ',0)');

    const val = this.data[this.data.length - 1];
    const valStr = (val >= 0 ? '\u00A0' : '') + val.toFixed(1);
    this.dataText.text(valStr);
};

//noinspection JSUnresolvedFunction
const random = d3.randomNormal(0, 2);


