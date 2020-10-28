function StackedAreaChart(container) {
    // CHART INIT -----------------------------------------------------------
    // create margins, height and width of svg
    const margin = ({top: 20, right: 20, bottom: 20, left: 40});
    const width = 650 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // create svg
    const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // initialize scales
    const xScale = d3.scaleTime()
        .range([0,width]);

    const yScale = d3.scaleLinear()
        .range([height,0]);

    const colorScale = d3.scaleOrdinal(d3.schemeSet3);

    // initialize axis
    const xAxis = d3.axisBottom()
        .scale(xScale);

    const yAxis = d3.axisLeft()
        .scale(yScale);

    svg.append('g')
        .attr('class', 'axis x-axis');
    
    svg.append('g')
        .attr('class', 'axis y-axis');
    
    // added
    svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)// the size of clip-path is the same as
    .attr("height", height); // the chart area
    // stop

    // initialize category label
    const tooltip = svg
        .append('text');
    
    let selected = null, xDomain, data;
    
    // CHART UPDATE FUNCTION --------------------------------------------------
    function update(data1) {
        data = data1;
        console.log('update', data);
        
        const keys = selected ? [selected] : data.columns.slice(1);

        var stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        var series = stack(data);
        //console.log('series', series);

        // update domains
        xDomain ? xScale.domain(xDomain) : xScale.domain(d3.extent(data.map((d) => d.date)));
        //xScale.domain(d3.extent(data.map((d) => d.date)));
        //xScale.domain([d3.min(data, d => d.date), d3.max(data,d => d.date)]);

        yScale.domain([0, d3.max(series, d => d3.max(d, d => d[1]))]);

        colorScale.domain(series.map(d => d.key));

        // create area generator
        const area = d3.area()
            .x(d => xScale(d.data.date))
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]));

        const areas = svg.selectAll('.area')
            .data(series, d => d.key);
        
        areas.enter()
            .append('path')
            .attr('class','area')
            .merge(areas)
            .attr('fill', d => colorScale(d.key))
            .attr('d', area)
            .attr("clip-path", "url(#clip)") // added
            .on('mouseover', (event, d, i) => tooltip.text(d.key))
            .on('mouseout', (event, d, i) => tooltip.text(''))
            .on('click', (event, d) => {
                if (selected == d.key) {
                    selected = null;
                }
                else {
                    selected = d.key;
                }
                update(data);
            });

        areas.exit().remove();

        // update axis
        svg.select('.x-axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.select('.y-axis')
            .call(yAxis);
        
        
    }
    function filterByDate(range) {
        xDomain = range;
        update(data);
      }

    return {
        update,
        filterByDate
    };

}

 export default StackedAreaChart;
