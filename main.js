import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js'; 

d3.csv('unemployment.csv', d3.autoType).then(data => {
    console.log('unemployment', data);

    // computing total unemployment and adding to file
    for (let i = 0; i < data.length; i++) {
        let total = 0;
        for(let col of data.columns) {
            if (col != 'date') {
                total = total + data[i][col];
            }
        }
        data[i]['total'] = total;
        }
    console.log('with total', data);

    // create area chart and update with data
    const areaChart = AreaChart('.area-chart');
    areaChart.update(data);
    
    // create stacked area chart and update with data
    const stackedAreaChart = StackedAreaChart('.stacked-chart');
    stackedAreaChart.update(data);

    // coordinating with stackedAreaChart
    areaChart.on("brushed", (range)=>{
        stackedAreaChart.filterByDate(range); 
    });
    
    
})
