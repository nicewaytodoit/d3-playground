const engine = (d3) => {
    const showTooltip = (tooltip) => (event, content) => {
        let x_hover = 0;
        let y_hover = 0;
        let tooltipWidth = parseInt(tooltip.style('width'));
        let tooltipHeight = parseInt(tooltip.style('height'));
        let classed, notClassed;
        if (event.pageX > document.body.clientWidth / 2) {
            x_hover = tooltipWidth + 30;
            classed = 'right';
            notClassed = 'left';
        }
        else {
            x_hover = -30;
            classed = 'left';
            notClassed = 'right';
        }
        y_hover = (document.body.clientHeight - event.pageY < (tooltipHeight + 4)) ? event.pageY - (tooltipHeight + 4) : event.pageY - tooltipHeight / 2;
        return tooltip
            .classed(classed, true)
            .classed(notClassed, false)
            .style("visibility", "visible")
            .style("top", y_hover + "px")
            .style("left", (event.pageX - x_hover) + "px")
            .html(content);
    };
    const hideTooltip = (tooltip) => tooltip.style("visibility", "hidden");

    return {
        // https://css-tricks.com/scale-svg/#article-header-id-10
        setResponsiveSVG: (el) => {
            let width = +el.attr('width');
            let height = +el.attr('height');
            let calcString = (+(height / width) * 100) + "%";
            let svgElement = el;
            let svgParent = d3.select(el.node().parentNode);
            const viewBox = '0 0 ' + width + ' ' + height;
            console.log('--->>>>- box = ', width, height, viewBox);
            svgElement
                .attr('class', 'scaling-svg')
                .attr('preserveAspectRatio', 'xMinYMin')
                .attr('viewBox', viewBox)
                .attr('width', null)
                .attr('height', null);
            svgParent.style('padding-bottom', calcString);
        },
        renderText: (cols) => (measure) => {
            let textHeader = d3.select('#textDescription h3');
            let textDescription = d3.select('#textDescription p');
            let textFootnote = d3.select('#source > footnote');
    
            let title = cols[measure].title;
            let description = cols[measure].description;
            let url = cols[measure].url;
            let source = cols[measure].source;
    
            textHeader.style("opacity", 0).transition().duration(1000).style("opacity", 1).text(title);
            textDescription.style("opacity", 0).transition().duration(1000).style("opacity", 1).text(description);
            textFootnote.html('<em>Source: </em><span><a href="' + url + '" target="_blank">' + source + '</span></a>');
        },
        bindHover: (countryObj, tooltip, measure) => {
            document.body.addEventListener('mousemove', (e) => {
                if (e.target.nodeName == 'path') {
                    let d = d3.select(e.target).data()[0].properties;
                    let value = countryObj[d.adm0_a3_is][measure];
                    let content = '';
                    if (value === null) {
                        content = countryObj[d.adm0_a3_is].geounit + ': ' + 'No data';
                    } else {
                        content = "<b>" + d.admin + '</b><br>' + "Income Group: " + d.income_grp + '<br>' + 'Economy: ' + d.economy + '<br>' + 'Mortality Rate: ' + countryObj[d.adm0_a3_is]['mortalityrate'] + '<br>' + 'Probability of Dying Young: ' + d3.format('.1%')(countryObj[d.adm0_a3_is]['dyingyoung']/100);
                        
                    }
                    showTooltip(tooltip)(e, content);
                }
            });
            document.body.addEventListener('mouseout', (e) => {
                if (e.target.nodeName == 'path') {
                    hideTooltip(tooltip);
                }
            });
        },



    };
};

export default engine;