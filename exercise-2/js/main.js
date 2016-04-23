/* Create a scatter plot of 1960 life expectancy (gdp) versus 2013 life expectancy (life_expectancy).
		The variable "data" is accessible to you, as you read it in from data.js
*/
$(function() {
	// Read in your data. On success, run the rest of your code
	d3.csv('data/prepped_data.csv', function(error, data){
	 	// Select SVG to work with, setting width and height (the vis <div> is defined in the index.html file)
         var svg = d3.select('#vis')
                    .append('svg')
                    .attr('width', 600)
                    .attr('height', 600);

		// Margin: how much space to put in the SVG for axes/titles
		var margin = {
			left:70,
			bottom:100,
			top:50,
			right:50,
		};

		// Height/width of the drawing area for symbols
		var height = 600 - margin.bottom - margin.top;
		var width = 600 - margin.left - margin.right;

		// Append a 'g' element in which to place the circles, 
		// shifted down and right from the top left corner using the margin values
        var g = svg.append('g')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');


		// Find minimum and maximum values, then define x (log) and y (linear) scales
        var xMin = d3.min(data, function(d) {return +d.gdp});
        var xMax = d3.max(data, function(d) {return +d.gdp});
        var xScale = d3.scale.log()
                    .range([0, width])
                    .domain([xMin, xMax]);
                    
                    
        var yMin = d3.min(data, function(d) {return +d.life_expectancy});
        var yMax = d3.max(data, function(d) {return +d.life_expectancy});
        var yScale = d3.scale.linear()
                    .range([height, 0])
                    .domain([yMin, yMax]);
                    


		// Perform a data-join for your data, creating circle element in your chart `g`

		// Select all circles and bind data
        var colorScale = d3.scale.category10();
        
        var circles = g.selectAll('circle')
                        .data(data);

		// Use the .enter() method to get your entering elements, and assign initial positions
        circles.enter()
                .append('circle')
                .attr('r', 10)
                .attr('fill', function(d) {return colorScale(d.region)})
                .attr('cy', height)
                .attr('title', function(d) {return d.country + ', ' + d.region})
                .style('opacity', 0.4);
                
                

		// Use the .exit() and .remove() methods to remove elements that are no longer in the data
		circles.exit().remove()

	  	// Transition properties of the update selection
		circles.transition()
                .duration(500)
                .attr('cx', function(d) {return xScale(d.gdp)})
                .attr('cy', function(d) {return yScale(d.life_expectancy)});

		// Define x axis using d3.svg.axis(), assigning the scale as the xScale
		var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .ticks(5, 's')
                        .orient('bottom');

		// Define y axis using d3.svg.axis(), assigning the scale as the yScale
		var yAxis = d3.svg.axis()
                        .scale(yScale)
                        .ticks(d3.format('.2s'))
                        .orient('left');

		// Append x axis to your SVG, specifying the 'transform' attribute to position it
		svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
            .call(xAxis);

		// Append y axis to your SVG, specifying the 'transform' attribute to position it
		svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
            .call(yAxis);

		// Append a text element to label your x axis, and position it appropriately
        svg.append('text')
            .attr('class', 'title')
            .attr('transform', 'translate(' + (width/2 + margin.left) + ', ' + (height + margin.top + 40) + ')')
            .text('Gross Domestic Product');

		// Append a text element to label your y axis, and position it appropriately
		svg.append('text')
            .attr('class', 'title')
            .attr('transform', 'translate(' + (margin.left - 40) + ', ' + (margin.top + height/2) + ') rotate(-90)')
            .text('Life Expectancy');

		/* Using jQuery, select all circles and apply a tooltip
		If you want to use bootstrap, here's a hint:
		http://stackoverflow.com/questions/14697232/how-do-i-show-a-bootstrap-tooltip-with-an-svg-object
		*/
        $('circle').tooltip({
            'container': 'body',
            'placement': 'bottom'
        })

	});
});
