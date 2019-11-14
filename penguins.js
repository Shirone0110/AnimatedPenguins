var screen = {width: 800, height: 500};
var margins = {top: 50, right: 50, bottom: 50, left: 50};

var penPromise = d3.json("penguins/classData.json");

penPromise.then(
function (penguins)
{
    setup(penguins);
},
function (err)
{
    console.log("fail", err);
})

var setup = function(penguins)
{
    d3.select("svg")
        .attr("width", screen.width)
        .attr("height", screen.height)
        .append("g")
        .attr("id", "graph")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");
    
    var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;
    
    var xScale = d3.scaleLinear()
                    .domain([0, 37])
                    .range([0, width]);
    
    var yScale = d3.scaleLinear()
                    .domain([0, 10])
                    .range([height, 0]);
    
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    d3.select("svg")
        .append("g")
        .attr("class", "axis")
    
    d3.select(".axis")
        .append("g")
        .attr("id", "xAxis")
        .attr("transform", "translate(" + margins.left + "," + (margins.top + height) + ")")
        .call(xAxis)
    
    d3.select(".axis")
        .append("g")
        .attr("id", "yAxis")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .call(yAxis)
    
    d3.select("#graph")
        .selectAll("circle")
        .data(penguins[0].quizes.map(function(d){return d.grade;}))
        .enter()
        .append("circle")
        .on("mouseover", function(num, ind)
        {
            var label = "(" + ind + "," + num + ")";
            d3.select("#tooltip")
                .text(label)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 30) + "px")
                .classed("hidden", false);
        })
        .on("mouseout", function()
        {
            d3.select("#tooltip")
                .classed("hidden", true);
        })
    
    d3.select("#graph")
        .append("g")
        .attr("id", "line")
    
    d3.select("#line")
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
    
    d3.select("body")
        .selectAll("button")
        .data(penguins)
        .enter()
        .append("button")
        .attr("class", function(trash, index){return (index % 3 == 0) ? "down" : "not";})
        .on("click", function(trash, index)
        {
            drawGrades(penguins, xScale, yScale, index);
        })
        .append("img")
        .attr("src", function(d)
        {
            return "penguins/" + d.picture;
        })
}

var drawGrades = function(penguins, xScale, yScale, index)
{
    d3.select("#graph")
        .selectAll("circle")
        .data(penguins[index].quizes.map(function(d){return d.grade;}))
        .transition(1000)
        .attr("cx", function(num, ind)
        {
            return xScale(ind);
        })
        .attr("cy", function(num)
        {
            return yScale(num);
        })
        .attr("r", 3);
    
    var lineGenerator = d3.line()
                            .x(function(num, ind){return xScale(ind);})
                            .y(function(num){return yScale(num);})
                            .curve(d3.curveMonotoneX)
    
    d3.select("#line")
        .select("path")
        .datum(penguins[index].quizes.map(function(d){return d.grade;}))
        .transition(1000)
        .attr("d", lineGenerator);
}