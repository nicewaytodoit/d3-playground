const opts = {
    lines: 9, // The number of lines to draw
    length: 9, // The length of each line
    width: 5, // The line thickness
    radius: 14, // The radius of the inner circle
    color: '#c10e19', // #rgb or #rrggbb or array of colors
    speed: 1.9, // Rounds per second
    trail: 40, // Afterglow percentage
    // className: 'spinner', // The CSS class to assign to the spinner
};
const target = (d3) => d3.select("#mapa").node();
const spinner = (d3) => () => new Spinner(opts).spin(target(d3));

export default spinner;