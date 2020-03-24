<script>
    import { onMount } from 'svelte';
    import Back from '../../controls/back-button.svelte';
    import * as d3 from "d3";

    const width = 450;
    const height = 450;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    let el;
    onMount(() => {
        let svg = d3
                    .select(el)
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
        const totalMinute = 45
        const rad = 1 * (Math.PI/180);
        const startAngle = (90 + (90/2)) * rad;
        const endAngle = (((totalMinute/60)*360) * rad) + startAngle;
        const currentMinute = 43;
        const startAnglePman = startAngle + ((((totalMinute - currentMinute)/60)*360)  * rad);
        

        const peiGenerator0 = d3.pie().startAngle(startAngle).endAngle(endAngle)([1]);
        const peiGenerator1 = d3.pie().startAngle(startAnglePman).endAngle(endAngle)([1]);
    
        svg
            .selectAll('whatever')
            .data(peiGenerator0)
            .enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(10)
                .outerRadius(radius)
            )
            .attr('fill', function(d){ return "yellow" })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7);
    
        svg
            .selectAll('whatever')
            .data(peiGenerator1)
            .enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(20)
                .outerRadius(160)
            )
            .attr('fill', function(d){ return "red" })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 1);
    });
</script>

<div>
    <h1>Pie Test</h1>

    <div bind:this={el}></div>

    <Back/>
</div>