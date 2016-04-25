/* Create a scatter plot of 1960 life expectancy (gdp) versus 2013 life expectancy (life_expectancy).
		The variable "data" is accessible to you, as you read it in from data.js
*/
$(function() {
	// Read in prepped_data file
	d3.csv('data/prepped_data.csv', function(error, allData){
		// Variables that should be accesible within the namespace
		var xScale, yScale, currentData;

		// Track the sex (male, female) and drinking type (any, binge) in variables
		var sex = 'female';
		var type = 'binge';

		// Margin: how much space to put in the SVG for axes/titles
		var margin = {
			left:70,
			bottom:100,
			top:50,
			right:50,
		};

		// Height/width of the drawing area for data symbols
		var height = 600 - margin.bottom - margin.top;
		var width = 1000 - margin.left - margin.right;


		// Append all non-data placeholder elements for you chart (svg, g, axis labels, axes), but do not call the axis functions that render them.
        var svg = d3.select('#vis')
                    .append('svg')
                    .attr('width', 1000)
                    .attr('height', 600);
                    
        var g = svg.append('g')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
                    
        var xAxisLabel = svg.append('g')
                            .attr('class', 'axis')
                            .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
                    
        var yAxisLabel = svg.append('g')
                            .attr('class', 'axis')
                            .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')
                            
        var xAxisText = svg.append('text')
                            .attr('transform', 'translate(' + (margin.left + width/2) + ', ' + (height + margin.top + 40) + ')')
                            .attr('class', 'title');
                            
        var yAxisText = svg.append('text')
                            .attr('transform', 'translate(' + (margin.left - 40) + ', ' + (margin.top + height/2) + ') rotate(-90)')
                            .attr('class', 'title');

		// Write a function for setting the scales based on the current data selection.
        var setScales = function(data) {
            var states = data.map(function(d) {return d.state;});
            xScale = d3.scale.ordinal()
                        .domain(states)
                        .rangeBands([0, width], 0.2);
            
            var yMax = d3.max(data, function(d) {return +d.percent;});
            var yMin = d3.min(data, function(d) {return +d.percent;});
            yScale = d3.scale.linear().range([height, 0]).domain([0, yMax]);
        }


		// Write a function for updating your axis elements (both the axes, and their labels).
        var setAxes = function() {
            var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient('bottom')
                        
            var yAxis = d3.svg.axis()
						.scale(yScale)
						.orient('left')
						.tickFormat(d3.format('.2s'));
                        
            xAxisLabel.transition().duration(1500).call(xAxis);
            
            yAxisLabel.transition().duration(1500).call(yAxis);
            
            xAxisText.text('State');
            
            yAxisText.text('Percent Drinking (' + sex + ', ' + type + ')');
        };


		// Write a function to filter down your data to the current selection based on the current sex and type
        var filterData = function() {
            currentData = allData.filter(function(d) {
                return d.type == type && d.sex == sex;
            }).sort(function(a, b) {
                if (a.state_name > b.state_name) {
                    return 1;
                } else if (a.state_name < b.state_name) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }

		// Write a reusable function to perform your data-join. Within this function you should set your scales and update your axes.
        var draw = function(data) {
            
            setScales(data);
            
            setAxes();
            
            var rects = g.selectAll('rect')
                            .data(currentData, function(d) {return d.state});
                            
            rects.enter().append('rect')
                .attr('x', function(d) {return xScale(d.state);})
                .attr('y', height)
                .attr('height', function(d) {return height - d.percent;})
                .attr('width', xScale.rangeBand())
                .attr('class', 'bar')
                .attr('title', function(d) {return d.state_name;});
                
            rects.exit().remove();
            
            rects.transition()
                    .duration(500)
                    .attr('x', function(d) {return xScale(d.state);})
                    .attr('y', function(d) {return yScale(d.percent);})
                    .attr('width', xScale.rangeBand())
                    .attr('height', function(d) {return height - yScale(d.percent);})
                    .attr('title', function(d) {return d.state_name;})
        }

		// Assign an event handler to your input elements to set the sex and/or type, filter your data, then update your chart.
        $('input').on('change', function() {
            var val = $(this).val();
            var isSex = $(this).hasClass('sex');
            if (isSex) {
                sex = val;
            } else {
                type = val;
            }
            
            filterData();
            draw(currentData);
        });
        
        filterData();
        draw(currentData);
	});
});
