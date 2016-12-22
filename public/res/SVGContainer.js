/**
 * Here we have the Container function that creates an SVG container within a div with d3 functionality.
 */

'use strict';

function createSVGContainer(targetDivId, width, height, margin) {

    if (margin === undefined) {
        margin = 0;
    }
    if (isNumeric(margin)) {
        margin = {
            top: margin,
            bottom: margin,
            left: margin,
            right: margin
        };
    }

    const div = d3.select(targetDivId);
    const svg = div.append('svg')
        .attr('width', width)
        .attr('height', height)
        .classed('svg-container', true);

    return svg.append('g')
                  .attr('transform', `translate(${margin.left}, ${margin.top})`);

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}

