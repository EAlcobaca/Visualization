/*
	Edesio Alcobaça
	M.Sc. Student in Computer Science
	Institute of Mathematical and Computer Sciences - ICMC
	University of São Paulo - USP
	São Carlos, São Paulo, Brazil.

    LICENSE - GNU GENERAL PUBLIC LICENSE Version 2
*/



window.onload = function() {
    //funcoes que precisam ser inicializadas
    parCoord();
    fillSelec("#xopt-section2");
    fillSelec("#yopt-section2");
    fillSelec("#yopt-section3");
    scatterplot("World_Rank","Teaching_Rating");
    barplot("Teaching_Rating");

};

var changeScatter = function(){
    //mudar atributos no scatter plot
    //selecionar campo enviado pelo usuario
    var nameX = $('#xopt-section2').find(":selected").text();
    var nameY = $('#yopt-section2').find(":selected").text();
    $("#graph-section2 svg").remove();//remover svg
    scatterplot(nameX,nameY);//re-escrever svg
}

var fillSelec = function(id) {
    //auto preenchimento dos dropdown
    d3.csv("data.csv", function(error, data) {
        var names = d3.keys(data[0]);
        for (var i = 0; i < names.length; i++) {
            if(i==0)
                $(id).append('<option value="foo">'+names[i]+'</option>').attr("selected",true);
            else
                $(id).append('<option value="foo">'+names[i]+'</option>');
        }
    });

}

var barplot = function(){

    // Baseada nos codigos vistos em aula

    var margin= {top: 20, right: 30, bottom: 30, left: 150};
    var width= 1200- margin.left- margin.right;		
    var height= 520- margin.top- margin.bottom;
    var space= 2;

    //criar svg
    var svg= d3.select("#graph-section3")
        .append("svg")
        .attr("width", width+ margin.left+ margin.right)
        .attr("height", height+ margin.top+ margin.bottom)
        .append("g")
        .attr("transform", "translate("+ margin.left +", "+ margin.top +")");

    //ler .csv
    d3.csv("dataSumm.csv", function(error, dataset){
        
        //tratamento de erro
        if (error) {
            console.log(error);
            return;
        }
        
        //definir escalas X e Y
        var scaleY = d3.scale.ordinal()
            .rangeBands([height, 0])
            .domain(dataset.map(function(d) { return d.Country; }));

        var scaleX = d3.scale.linear()
            .range([0, width])
            .domain([0, 65]);

        //desenhar retangulos
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

        //definir axis X e Y
        var xAxis = d3.svg.axis()
            .scale(scaleX)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(scaleY)
            .ticks(10, "")
            .orient("left");

        // adicionar axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(20, " + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
                .attr("y", height+ 20)
                .attr("x", 20+ 60 + (width/2))
                .attr("dy", ".75em")
                .style("text-anchor", "end")
                .text("Frequency of Occurrence");


    });

}

var scatterplot = function(nameX, nameY){
    // Este codigo foi baseado em:
    // https://bl.ocks.org/mbostock/3887118
    // 
    
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //definicao das escalas em X e Y (dependem da entrada selecionada pelo usuario)
    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);
    
    //definicao das axis X e Y
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // criando e plugando tag svg
    var svg = d3.select("#graph-section2").append("svg")
        .attr("width", width + margin.left + margin.right + 40)
        .attr("height", height + margin.top + margin.bottom + 40)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //lendo o dataset e gerando o plot
    d3.csv("data.csv", function(error, data) {
        data.forEach(function(d) {
            d[nameX] = +d[nameX];
            d[nameY] = +d[nameY];
        });

        //definindo dominio de X e Y
        x.domain(d3.extent(data, function(d) { return d[nameX]; })).nice();
        y.domain(d3.extent(data, function(d) { return d[nameY]; })).nice();

        //criando as x-axis e adicionando a legenda
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

        //criando as x-axis e adicionando a legenda
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
                .attr("class", "label")
                .attr("y", -15)
                .attr("x", 90)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(nameY)

        // criando e ajustando os pontos
        svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
                .attr("class", "dot")
                .attr("r", 3.5)
                .attr("cx", function(d) { return x(d[nameX]); })
                .attr("cy", function(d) { return y(d[nameY]); })
                .style("fill", '.dot');

    });

}

var parCoord = function(){
    // Este codigo foi baseado em:
    // https://bl.ocks.org/jasondavies/1341281
    // 
 
    var margin = {top: 30, right: 10, bottom: 10, left: 10},
        width = 1200 - margin.left - margin.right ,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangePoints([0, width], 1), y = {}, dragging = {};

    //definicao do dominio das cores, para colorir linhas
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

    //lendo o conjunto de dados
    d3.csv("data.csv", function(error, data) {

        // Extraindo a lista de dimensoes e criando uma escala para cada atributo(coluna)
        x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
            return d != "name" && (y[d] = d3.scale.linear()
                .domain(d3.extent(data, function(p) { return +p[d]; }))
                .range([height, 0]));
        }));

        // Adiciona o background como gray
        background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
                .attr("d", path);

        // Adiciona foreground das linhas em relacao a escala de cor antes definida
        foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", path)
            .attr('stroke', function(d) { return blue_to_brown(d['World_Rank']); });


        // Adiciona umm grupo de elemento para cada dimensao
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter()
            .append("g")
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

        // adicionar as axis e o titulo
        g.append("g")
            .attr("class", "axis")
            .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
            .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .attr("transform", "rotate(10)")
                .text(function(d) { return d; });

        // Adicionar os brush para selecionar as linhas nas axis
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

        // Criar os elementos svg:defs e definir o gradiente
        var svgDefs = svg.append('defs');

        var mainGradient = svgDefs.append('linearGradient')
            .attr('id', 'mainGradient');

        // Criar os stops no gradiente e linkar com os css
        mainGradient.append('stop')
            .attr('class', 'stop-top')
            .attr('offset', '0');

        mainGradient.append('stop')
            .attr('class', 'stop-bottom')
            .attr('offset', '1');

        //Desenhar o retangulo da legenda
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


        //Adicionar o titulo na legenda e os breaks
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

    // retorna o caminho para um ponto.
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
