function AreaChart(container) {
    // CHART INIT ------------------------------------------------------------
    // create margins, height and width of svg
    const margin = ({top: 20, right: 20, bottom: 20, left: 40});
    const width = 650 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

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

    // initialize axis
    const xAxis = d3.axisBottom()
        .scale(xScale);

    const yAxis = d3.axisLeft()
        .scale(yScale);

    svg.append('g')
        .attr('class', 'axis x-axis');
    
    svg.append('g')
        .attr('class', 'axis y-axis');

    // create a single path for area and assign class name so we can select in update
    svg.append('path').attr('class', 'area');


    const listeners = {brushed : null};


     // create brush
     const brush = d3
     .brushX()
     .extent([0,0], [width,height])
     .on('brush', brushed)
     .on('end', brushended);
 
     // add brush
     svg.append('g')
         .attr('class', 'brush')
         .call(brush);

    // define event callbacks
    function brushed(event) {
        console.log('brushed', event.selection);
        if (event.selection) {
            
            listeners["brushed"](event.selection.map(xScale.invert));
        }
    }

    function brushended(event) {
        if (!event.selection) {
            if (listenters['brushed']) {
                listeners["brushed"]([xScale.invert(0),xScale.invert(width)]);
            }    
        }
    }


   
    // CHART UPDATE FUNCTION --------------------------------------------------
    function update(data) {
        // update domains
        xScale.domain([d3.min(data, d => d.date), d3.max(data,d => d.date)]);

        yScale.domain([0, d3.max(data, d => d.total)]);

        // create area generator
        let area = d3.area()
            .x(d => xScale(d.date))
            .y1(d => yScale(d.total))
            .y0(yScale.range()[0]); 

        // select path created during initialization, set data, call area function
        d3.select('.area')
            .datum(data)
            .attr('d', area);

        // update axis
        svg.select('.x-axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.select('.y-axis')
            .call(yAxis);
    }

    function on(event, listener) {
        listeners[event] = listener;
        }

    return {
        update,
        on
    };
}

 export default AreaChart;