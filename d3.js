

var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");



var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-12, 0])
    .html(function(d) {
        return "<span style='color:red'>" + d + "</span>";
    })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

var data;
var i = 1;
var indexes;
var arr;
var intervalId;
var active = true;
var duration = 500;

d3.json("data.json", function(d) {
	data = d.data;
	arr = data[1];
	
	indexes = [];
	for (var i = 0; i < arr.length; i++) {
		indexes.push(i);
	}
	
	x.domain(indexes);
	y.domain([0, d3.max(arr)]);
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    svg.selectAll(".bar")
        .data(arr)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) { return x(i); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return height - y(d); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
	
	svg.select(".x.axis")
		.selectAll("text")
		.style("font-size", "10px")
		
	//svg.selectAll(".label")
	//	.data(arr)
	//  .enter().append("text")
	//	.attr("class", "label")
	//	.attr("x", function(d, i) { return x(i) + x.rangeBand() / 2; })
    //    .attr("y", function(d) { return y(d) - 3; })
	//	.text(function(d) { return d; })
    //    .attr("y", function(d) { return y(d) - 3; })
	//	.attr("font-size", "20px")
	//	.attr("text-anchor", "middle");
		
	$("#step").prop("disabled", false);
	
	intervalId = startShuffle();
});

function step() {
	startOrStop();
};

function update(arr) {
	y.domain([0, d3.max(arr)]);
	
	
		//.each("start", function(d, i) { if (i == 0) $("#step").prop("disabled", true); })
		//.each("end", function(d, i) { if (i == 0) $("#step").prop("disabled", false); });

	//arr.push(indexes.length * 10);
	//indexes.push(indexes.length);
	//x.domain(indexes);
	//y.domain([0, d3.max(arr)]);
    //
    //svg.append("g")
    //    .attr("class", "x axis")
    //    .attr("transform", "translate(0," + height + ")")
    //    .call(xAxis);
		
    svg.selectAll(".bar")
        .data(arr)
		.transition()
		.duration(duration)
    //    .attr("x", function(d, i) { return x(i); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return height - y(d); });
	
	//svg.selectAll(".label")
	//	.data(arr)
	//	.transition()
	//	.duration(duration)
    //    .attr("y", function(d) { return y(d) - 3; })
};

function startShuffle() {
	return setInterval(function() {
		d3.shuffle(arr);
		update(arr);
	}, duration);
};

$(document).keypress(function(e) {
	console.log(e);
	if (e.which === 32)
		startOrStop();
});

function startOrStop() {
	if (active)
		clearInterval(intervalId);
	else
		intervalId = startShuffle();
	
	active = !active;
};
