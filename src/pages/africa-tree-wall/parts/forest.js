const forestCircles = [
    { "x": 206, "y": 255, "radius": 8 },
    { "x": 223, "y": 240, "radius": 6 },
    { "x": 231, "y": 230, "radius": 4 },
    { "x": 233, "y": 245, "radius": 2 },
    { "x": 232, "y": 257, "radius": 8 },
    { "x": 220, "y": 253, "radius": 3 },
    { "x": 219, "y": 262, "radius": 4 },
    { "x": 243, "y": 235, "radius": 8 },
    { "x": 255, "y": 242, "radius": 4 },
    { "x": 269, "y": 246, "radius": 10 },
    { "x": 285, "y": 257, "radius": 5 },
    { "x": 275, "y": 265, "radius": 6 },
    { "x": 291, "y": 271, "radius": 8 },
    { "x": 308, "y": 263, "radius": 5 },
    { "x": 306, "y": 273, "radius": 3 },
    { "x": 318, "y": 263, "radius": 4 },
    { "x": 329, "y": 258, "radius": 6 },
    { "x": 339, "y": 255, "radius": 3 },
    { "x": 327, "y": 268, "radius": 2 },
    { "x": 342, "y": 265, "radius": 7 },
    { "x": 357, "y": 263, "radius": 4 },
    { "x": 364, "y": 273, "radius": 6 },
    { "x": 376, "y": 265, "radius": 6 },
    { "x": 377, "y": 277, "radius": 3 },
    { "x": 390, "y": 265, "radius": 6 },
    { "x": 396, "y": 240, "radius": 2 },
    { "x": 392, "y": 251, "radius": 5 },
    { "x": 399, "y": 258, "radius": 3 },
    { "x": 405, "y": 245, "radius": 5 },
    { "x": 410, "y": 234, "radius": 6 },
    { "x": 421, "y": 238, "radius": 4 },
    { "x": 431, "y": 231, "radius": 5 },
    { "x": 444, "y": 232, "radius": 7 },
    { "x": 437, "y": 243, "radius": 4 },
    { "x": 458, "y": 231, "radius": 7 },
    { "x": 453, "y": 243, "radius": 5 },
    { "x": 464, "y": 239, "radius": 2 },
    { "x": 471, "y": 249, "radius": 6 },
    { "x": 473, "y": 239, "radius": 2 },
    { "x": 485, "y": 246, "radius": 5 },
    { "x": 498, "y": 246, "radius": 4 },
    { "x": 493, "y": 256, "radius": 3 },
    { "x": 508, "y": 244, "radius": 3 },
    { "x": 512, "y": 256, "radius": 9 },
    { "x": 523, "y": 245, "radius": 5 },
    { "x": 526, "y": 257, "radius": 3 },
    { "x": 534, "y": 250, "radius": 3 },
    { "x": 540, "y": 242, "radius": 4 },
    { "x": 548, "y": 247, "radius": 5 },
    { "x": 553, "y": 238, "radius": 3 },
    { "x": 567, "y": 245, "radius": 8 },
    { "x": 575, "y": 233, "radius": 4 },
    { "x": 582, "y": 243, "radius": 5 },
    { "x": 594, "y": 243, "radius": 6 },
    { "x": 588, "y": 254, "radius": 4 },
    { "x": 591, "y": 263, "radius": 4 },
    { "x": 598, "y": 256, "radius": 4 },
    { "x": 601, "y": 267, "radius": 4 },
    { "x": 595, "y": 273, "radius": 2 },
    { "x": 608, "y": 273, "radius": 3 },
    { "x": 615, "y": 265, "radius": 6 },
    { "x": 625, "y": 263, "radius": 3 },
    { "x": 625, "y": 270, "radius": 3 },
];

const circles = (svg) => svg
    .selectAll("circle")
    .data(forestCircles)
    .enter()
    .append("circle");

const makeForest = (svg) => circles(svg)
    .attr("cx", function (d) { return d.x; })
    .attr("cy", function (d) { return d.y; })
    .attr("r", function (d) { return d.radius; })
    .style("fill", function(d) { return "rgba(22, 155, 0, 0.7)"; });

export default makeForest;