<script>
    import { onMount } from 'svelte';
    import { select, selectAll, event } from 'd3-selection';
    import { geoMercator, geoPath } from 'd3-geo';
    import { keys } from 'd3-collection';
    import { min, extent, range, descending } from 'd3-array';
    import { format } from 'd3-format';
    import { scaleLinear, scaleSequential } from 'd3-scale';
    import { legendColor } from 'd3-svg-legend';
    import { json, csv } from 'd3-fetch';
    import { csvParse } from 'd3-dsv';
    import { zoom, zoomIdentity } from 'd3-zoom';
    import { interpolateOranges } from 'd3-scale-chromatic';
    import * as topojson from "topojson-client";
    import makeForest from './parts/forest.js';
    import engine from './parts/engine.js';
    import dataOptions from './data/statsOptions.js';
    import Spin from './parts/spinner.js';
    import africaTopo from './data/africa-topo.json';
    import africaStats from './data/africa-stats.csv';

    const d3 = Object.assign({}, {
            select,
            selectAll,
            event,
            min,
            extent,
            range,
            descending,
            format,
            scaleLinear,
            scaleSequential,
            legendColor,
            geoMercator,
            geoPath,
            keys,
            json,
            csv,
            zoom,
            zoomIdentity,
            interpolateOranges,
            csvParse,
        },
    );
    const { setResponsiveSVG, renderText, bindHover } = engine(d3);

    let el;

    onMount(() => { 
        const cols = dataOptions;
        const spinner = Spin(d3)();
        let tooltip = d3.select("#mapa").append("div").style("position", "absolute").style("z-index", "10").style("visibility", "hidden").attr("class", "tooltip");
        let measureSelect = d3.select('#dimensions');
        let width = 960;
        let height = 720;
        let measure = 'mortalityrate';
        
        let projection = d3
            .geoMercator()
            .scale(410)
            .translate([width / 3, height / 2]);
        
        let path = d3.geoPath()
            .projection(projection);

        let d3legend = d3
            .legendColor()
            .shapeWidth(width / 10)
            .cells(9)
            .orient("horizontal")
            .labelOffset(3)
            .ascending(true)
            .labelAlign("middle")
            .shapePadding(2);

        let svg = d3.select(el)
            .attr("width", width)
            .attr("height", height);
    
        // svg.append('svg:image')
        //     .attr('xlink:href', 'img/a.png')
        //     .attr('x', 55)
        //     .attr('y', 60)
        //     .attr("width", 733);

        makeForest(svg);

        var selectEnter = measureSelect.selectAll('option').data(d3.keys(cols).sort()).enter();
        var selectUpdate = selectEnter.append('option');

        selectUpdate.attr('value', function(d) {
            return d;
        }).text(function(d) {
            return cols[d].title;
        }).attr('selected', function(d) {
            if (d == measure) {
                return true;
            }
        });

        let countryObj = {};

        function createMap(result) {
            const africa = result[0];
            const data = result[1];
            console.log(africa, data);
            spinner.stop();
            data.forEach(function(d){
                d.mortalityrate = +d['Mortality Rate'];
                d.dyingyoung = +d['Prob of Dying'];
                const code = d.adm0_a3_is || d["adm0_a3_is"] || d['"adm0_a3_is"'];
                countryObj[code] = d;
            });
        
            let centered;
            function renderMap() {
                let countMissing = 0;

                let extent = d3.extent(data, function(d) {
                    return +countryObj[d.adm0_a3_is][measure];
                });

                let color = d3.scaleSequential().interpolator(d3.interpolateOranges);
                color.domain([extent[0], extent[1]]);

                d3legend
                    // .labelFormat(function(d) {
                    //     const value = (cols[measure].type == 'percentage') ? (d / 100) : d;
                    //     const format = cols[measure].format;
                    //     return d3.format(".1f")(value);
                    // })
                    .title(cols[measure].label)
                    .scale(color);

                svg.select('.legend').remove();
                let legend = svg.append("g")
                    .attr("class", "legend")
                    .attr("transform", "translate(" + (width / 24) + "," + (height * 6 / 7) + ")");

                legend.call(d3legend);
                countryPath
                    .transition()
                    .duration(1000)
                    .style("fill", (d) => {
                        let country = countryObj[d.properties.adm0_a3_is];
                        if(country && country[measure] === null) {
                            console.log(country.Country + " does not have data");
                            return '#ccf';
                        }
                        else if (country) {
                            const c = color(country[measure]);
                            return c;
                        }
                        else {
                            countMissing++;
                            console.log(d.properties.formal_en + " not found. Error #" + countMissing);
                            return '#cfc';
                        }
                    })
                    .style("opacity", () => 0.5);
            }

            // define zoom function
            function zoomed() {
                
                console.log('zoom========', d3.event);
                // group.attr("transform", d3.event.transform);

                // group.select(".nation").style("stroke-width", 0.5 / d3.event.scale + "px");
                // group.select(".state-border").style("stroke-width", 0.5 / d3.event.scale + "px");
                // group.select(".country-border").style("stroke-width", 0.1 / d3.event.scale + "px");
            }

            // When clicked, zoom in
            function clicked(d) {
                console.log('Clicked', d3.event);
                var x, y, k;

                if (d && centered !== d) {
                    // if (d) {
                    var centroid = path.centroid(d);
                    x = centroid[0];
                    y = centroid[1];
                    // k = zoom.scaleExtent()[1];
                    k = 10;
                    centered = d;
                }
                else {
                    x = width / 2;
                    y = height / 2;
                    k = 1;
                    centered = null;
                }

                svg.transition()
                    .duration(750)
                    .call(zoom.transform, d3.zoomIdentity
                        .translate(width / 2, height / 2)
                        .scale(k)
                        .translate(-x, -y));
            }

            svg.append("rect")
                .attr("class", "background")
                .attr("width", width)
                .attr("height", height)
                .style("fill", () => "pink");

            let zoom = d3.zoom()
                .scaleExtent([1, 15])
                .on("zoom", zoomed);

            svg.style("pointer-events", "all")
                .call(zoom);

            let group = svg.append("g").attr("class","continent");

            const dF = topojson.feature(africa, africa.objects.collection).features;
            console.log('path === draw ===> ', group, dF);
            let countryPath = group
                .selectAll(".countries")
                .data(dF)
                .enter()
                .append('path')
                .attr("class", "country-border")
                .on("click", clicked)
                .attr("d", path);
                
            renderMap();
            renderText(cols)(measure);
            bindHover(countryObj, tooltip, measure);
            // setResponsiveSVG(svg);

            measureSelect.on('change', function(d) {
                measure = this.value;
                renderMap();
                renderText(cols)(measure);
            });
        }

    setResponsiveSVG(svg);
    createMap([africaTopo, d3.csvParse(africaStats)])
});


</script>

<!-- <link href="./africa.css" /> -->

<style>
:global(body) {
    font-family: serif;
}

:global(.country-border) {
    fill: none;
    stroke: #000000;
    stroke-width: 0.5px;
    pointer-events:all;
    stroke-linejoin: round;
    stroke-linecap: round;
}

:global(.background) {
    fill: #f5f5f5;
    /* fill-opacity: 0.9; */
}

:global(.continent) {
    fill: #222;
    stroke: #fff;
}

:global(.continent :hover) {
    fill: #70aa70 !important;
}

:global(.tooltip) {
    top: 100px;
    left: 100px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    /*border: 2px solid #000;*/
    background: #333;
    opacity: .9;
    color: white;
    padding: 10px;
    min-width: 375px;
    min-width: 36.75vmin;
    font-size: 2.25vmin;
    line-height: 24pt;
    font-family: 'Lora', serif;
    font-weight: lighter;
    visibility: visible;
}

:global(.tooltip.right::before) {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    opacity: .9;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 8px solid #333;
    right: -8px;
    top: 65px;
    /* arbitrarily set */
}

:global(.tooltip.left::before) {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    opacity: .9;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    left: -8px;
    border-right: 8px solid #333;
    top: 65px;
    /* arbitrarily set */
}
/* SVG Scaling */
/*body,*/
/*svg {*/
/*    height: 100%;*/
/*    margin: 0;*/
/*    width: 100%;*/
/*    float: left;*/
/*}*/

:global(.scaling-svg-container) {
    position: relative;
    height: 0;
    width: 100%;
    padding: 0
}

:global(.scaling-svg) {
    position: absolute;
    height: 99%;
    width: 100%;
    left: 0;
    top: 0
}

</style>

<div class="container">
    <div class="row">
        <div class="col-xs-12 col-md-12">
            <div id="title" class="page-header">
                <h2>Africa Lambert Conformal Conic <small>Incorporating R, Shiny, and D3.js</small></h2>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-4 col-md-4">
            <div class="form-group">
                <label for="dimensions" class="col-form-label">Factor </label>
                <select class="form-control" id="dimensions"></select>
            </div>
        </div>
        <div class="col-xs-8 col-md-8"></div>
    </div>
    <div class="row" id="canvas">
        <div class="col-md-9 col-xs-9">
            <div class="scaling-svg-container">
                <svg bind:this={el}></svg>
            </div>
        </div>
        <div class="col-md-3 col-xs-3">
            <div id="textDescription" style="height:250px;">
                <h3> </h3>
                <p></p>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12 col-md-12" id="source">
            <footnote></footnote>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12 col-md-12">
            <footer>
                <span>Visualization by <a href="https://twitter.com/tonmcg">Tony McGovern</a></span>
            </footer>
        </div>
    </div>
    <div id="mapa"></div>
</div>
<div id="aa" style="width: 45px; height: 45px;"></div>          
