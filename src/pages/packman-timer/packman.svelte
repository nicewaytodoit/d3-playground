<script>
    import { onMount } from 'svelte';
    import Back from '../../controls/back-button.svelte';
    import * as d3 from "d3";

    const width = 450;
    const height = 450;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    let el;
    let timer = 0;
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

        const peiGenerator0 = d3.pie().startAngle(startAngle).endAngle(endAngle)([1]);
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

        let currentMinute = () => 45 - timer;
        let startAnglePman = (currentMinute) => startAngle + ((((totalMinute - currentMinute)/60)*360)  * rad);
        const peiGenerator1 = d3.pie().startAngle(startAnglePman(currentMinute())).endAngle(endAngle)([1]);
        let arc = d3.arc().innerRadius(20).outerRadius(160);
        let chunk = svg
            .selectAll('whatever')
            .data(peiGenerator1)
            .enter()
            .append('path')
            .attr('fill', function(d){ return "red" })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 1)
            .attr('d', arc);
        
        const interval = setInterval(() => {
            chunk.transition()
                .duration(1000)
                .call(arcTween, startAnglePman(currentMinute()));
            timer = (timer >= 45) ? 0: timer + 1;
		}, 1000);

        function arcTween(transition, newStartAngle) {
            transition.attrTween("d", (d) => {
                var interpolateStart = d3.interpolate(d.startAngle, newStartAngle);
                return (t) => {
                    d.startAngle = interpolateStart(t);
                    return arc(d);
                };
            });
        }

		return () => {
			clearInterval(interval);
		};
    });
</script>

<div>
    <h1>Packman Timer</h1>

    <div bind:this={el}></div>

    <Back/>
</div>