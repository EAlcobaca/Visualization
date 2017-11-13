window.onload = function() {
    parCoord();
    fillSelec("#xopt-section2");
    fillSelec("#yopt-section2");
    fillSelec("#yopt-section3");
    //changeScatter();
    scatterplot("World_Rank","Teaching_Rating");
    barplot("Teaching_Rating");


};

var changeScatter = function(){
    var nameX = $('#xopt-section2').find(":selected").text();
    var nameY = $('#yopt-section2').find(":selected").text();
    $("#graph-section2 svg").remove();
    scatterplot(nameX,nameY);
}

var fillSelec = function(id) {
    d3.csv("data.csv", function(error, data) {
        var names = d3.keys(data[0]);
        for (var i = 0; i < names.length; i++) {
            if(i==0)
                $(id).append('<option value="foo">'+names[i]+'</option>').attr("selected",true);
            $(id).append('<option value="foo">'+names[i]+'</option>');
        }
    });

}

var barplot = function(){

    var margin= {top: 20, right: 30, bottom: 30, left: 130};

    var width= 1200- margin.left- margin.right;		
    var height= 520- margin.top- margin.bottom;

    var space= 2;

    var svg= d3.select("#graph-section3")
        .append("svg")
        .attr("width", width+ margin.left+ margin.right)
        .attr("height", height+ margin.top+ margin.bottom)
        .append("g")
        .attr("transform", "translate("+ margin.left +", "+ margin.top +")");

    d3.csv("dataSumm.csv", function(error, dataset){
        if (error) {
            console.log(error);
            return;
        }

        var scaleY = d3.scale.ordinal()
            .rangeBands([height, 0])
            .domain(dataset.map(function(d) { return d.Country; }));

        var scaleX = d3.scale.linear()
            .range([0, width])
            //.domain([0, d3.max(dataset, function(d) { return d.Frequency; })]);
            .domain([0, 65]);

        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("y", function(d, i) { return (dataset.length -i -1)* (height/ dataset.length); })
            .attr("x", 20)
            .attr("width", function(d){ return scaleX(d.Frequency); })
            .attr("height", (height/ dataset.length) -space )
            .attr("fill", '.bar');


        var xAxis = d3.svg.axis()
            .scale(scaleX)
            //.attr("transform", "rotate(-90)")
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(scaleY)
            .ticks(10, "")
            .orient("left");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(20, " + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            //.attr("transform", "rotate(0)")	// Label do eixo
            //.attr("transform", "translate("+(width/2)+","+(heigth/2)+")")	// Label do eixo
            .attr("y", height+ 20)
            .attr("x", 20+ 60 + (width/2))
            .attr("dy", ".75em")
            .style("text-anchor", "end")
            .text("Frequency of Occurence");


    });

}

var scatterplot = function(nameX, nameY){

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#graph-section2").append("svg")
        .attr("width", width + margin.left + margin.right + 40)
        .attr("height", height + margin.top + margin.bottom + 40)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    d3.csv("data.csv", function(error, data) {
        data.forEach(function(d) {
            d[nameX] = +d[nameX];
            d[nameY] = +d[nameY];
        });

        x.domain(d3.extent(data, function(d) { return d[nameX]; })).nice();
        y.domain(d3.extent(data, function(d) { return d[nameY]; })).nice();

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", 30)
            .style("text-anchor", "end")
            .text(nameX);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
        //.attr("transform", "rotate(-90)")
            .attr("y", -15)
            .attr("x", 90)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(nameY)

        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d[nameX]); })
            .attr("cy", function(d) { return y(d[nameY]); })
            .style("fill", '.dot');

    });

}

var parCoord = function(){

    var margin = {top: 30, right: 10, bottom: 10, left: 10},
        width = 1200 - margin.left - margin.right ,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangePoints([0, width], 1), y = {}, dragging = {};
    var blue_to_brown = d3.scale.linear()
        .domain([1, 200])
        .range(["#ef8a62","#67a9cf"])
        .interpolate(d3.interpolateLab);

    var line = d3.svg.line(),
        axis = d3.svg.axis()
        .orient("left"), background, foreground;

    var svg = d3.select("#section1").append("svg")
        .attr("width", width + margin.left + margin.right + 80)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data.csv", function(error, data) {

        // Extract the list of dimensions and create a scale for each.
        x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
            return d != "name" && (y[d] = d3.scale.linear()
                .domain(d3.extent(data, function(p) { return +p[d]; }))
                .range([height, 0]));
        }));

        // Add grey background lines for context.
        background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("d", path);

        // Add blue foreground lines for focus.
        foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", path)
            .attr('stroke', function(d) { return blue_to_brown(d['World_Rank']); });


        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
            .call(d3.behavior.drag()
                .origin(function(d) { return {x: x(d)}; })
                .on("dragstart", function(d) {
                    dragging[d] = x(d);
                    background.attr("visibility", "hidden");
                })
                .on("drag", function(d) {
                    dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                    foreground.attr("d", path);
                    dimensions.sort(function(a, b) { return position(a) - position(b); });
                    x.domain(dimensions);
                })
                .on("dragend", function(d) {
                    delete dragging[d];
                    transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                    transition(foreground).attr("d", path);
                    background
                        .attr("d", path)
                        .transition()
                        .delay(500)
                        .duration(0)
                        .attr("visibility", null);
                }));

        // Add an axis and title.
        g.append("g")
            .attr("class", "axis")
            .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .attr("transform", "rotate(10)")
            .text(function(d) { return d; });

        // Add and store a brush for each axis.
        g.append("g")
            .attr("class", "brush")
            .each(function(d) {
                d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

        var legendsvg = svg.append("g")
            .attr("class", "legendWrapper");

        // Create the svg:defs element and the main gradient definition.
        var svgDefs = svg.append('defs');

        var mainGradient = svgDefs.append('linearGradient')
            .attr('id', 'mainGradient');

        // Create the stops of the main gradient. Each stop will be assigned
        // a class to style the stop using CSS.
        mainGradient.append('stop')
            .attr('class', 'stop-top')
            .attr('offset', '0');

        mainGradient.append('stop')
            .attr('class', 'stop-bottom')
            .attr('offset', '1');

        //Draw the Rectangle
        var legendWidth = 40;
        var legendHeight = height/3;
        svg.append("rect")
            .attr('transform', 'rotate(90)')
            .attr({
                'y': -(width),
                //'x':height/3,
                'x':height/3,
                'width': legendHeight,
                'height': legendWidth,
            })
            .classed('filled', true);


        //Append title
        legendsvg.append("text")
            .attr("class", "legendTitle")
            .attr("x", width - (legendWidth/2))
            .attr("y", height/3 - 10)
            .style("text-anchor", "middle")
            .text("Rank");

        legendsvg.append("text")
            .attr("class", "text")
            .attr("x", width + 5)
            .attr("y", height/3 +10)
            .style("text-anchor", "left")
            .text("200");

        legendsvg.append("text")
            .attr("class", "text")
            .attr("x", width+5)
            .attr("y", 2*(height/3))
            .style("text-anchor", "left")
            .text("1");

        legendsvg.append("text")
            .attr("class", "text")
            .attr("x", width+5)
            .attr("y", (height/2))
            .style("text-anchor", "left")
            .text("100");



    });

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
            extents = actives.map(function(p) { return y[p].brush.extent(); });
        foreground.style("display", function(d) {
            return actives.every(function(p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? null : "none";
        });
    }


}
