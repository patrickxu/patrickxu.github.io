/** 
  CS171 Project
  The Changing Landscape of the American Economy
  Katherine Dai, Patrick Xu
  //YA
**/

var margin = {
    top: 50,
    right: 0,
    bottom: 50,
    left: 0
};
var toptizzles = [];
var gdp_data;
var groups;
var bars;
var timer;
var yearz = 1955;
var delayz = 500;
var e = d3.select("#time");
e.attr("T", 0);

var name = "notset";

var remains = [];
  var newCompany = [];
  var leftList = [];

var single_bar_height = 40;

var isChoro = false;
var isLoca = false;
var isPlaying = false;
var prev_10 = [];
var curr_10 = [];
var overall_sum = 0;
var topTen = [];
var aggregate = [];
var datase =[];
var temp_choro;

var width = 650 - margin.left - margin.right;
var height = 550 - margin.bottom - margin.top;
var centered, radius = Math.min(width, height) / 2, bars;
var dataSet = [];
var val = 0;
var bbDetail = {
    width: 500,
    height: 200
}
var states;
var choro_count = 0;
var choroset = [];
var path_count = 0;

var line_dataset = [];

var gpie;
var label_group;
var color_1 = d3.scale.category20()
var pie;
var tenner;
var tenner = [];
var supa;
var textOffset = 14;
var tweenDuration = 250;

var lines, valueLabels, nameLabels;
var pieData = [];    
var oldPieData = [];
var filteredPieData = [];
var arc;
var svgizzle;
var realSVG;
var radius;

var unique_top10 = [];

var choro_width = 500,
    choro_height = 500;
 
var rateById = d3.map();
 
var quantize = d3.scale.quantize()
    .domain([0, 200])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
 
var choro_projection = d3.geo.albersUsa()
    .scale(1280)
    .translate([choro_width / 2, choro_height / 2]);
 
var choro_path = d3.geo.path()
    .projection(choro_projection);
 
var choro_svg = d3.select("tbody").append("tr").append("svg").attr("id", "choro")
    .attr("width", choro_width)
    .attr("height", choro_height);

var parseDate = d3.time.format("%m-%d-%Y").parse;
var gzz;

    var bar_height = 350;
    var bar_width = 250;
    var bar_yScale = d3.scale.linear().domain([0, 11]).range([15, bar_height]);

//create main visualization
var gdp = d3.select("#gdp").append("svg").attr({
    width: 625,
    height: 150
})
.attr("class", "gdp")

function resumed_ease( ease, elapsed_time ) {
    var y = typeof ease == "function" ? ease : d3.ease.call(d3, ease);
    return function( x_resumed ) {
        var x_original = d3.scale
                        .linear()
                        .domain([0,1])
                        .range([elapsed_time,1])
                        ( x_resumed );
        return d3.scale
                 .linear()
                 .domain([ y(elapsed_time), 1 ])
                 .range([0,1])
                 ( y ( x_original ) );
    };
}

var colorMin = colorbrewer.Greens[3][0];
var colorMax = colorbrewer.Greens[3][2];

var choro_color = d3.scale.linear()
      .interpolate(d3.interpolateRgb)
      .range([colorMin, colorMax]);

    choro_color.domain([0, 1118051]);

function pieTween(d, i) {
  var s0;
  var e0;
  if(oldPieData[i]){
    s0 = oldPieData[i].startAngle;
    e0 = oldPieData[i].endAngle;
  } else if (!(oldPieData[i]) && oldPieData[i-1]) {
    s0 = oldPieData[i-1].endAngle;
    e0 = oldPieData[i-1].endAngle;
  } else if(!(oldPieData[i-1]) && oldPieData.length > 0){
    s0 = oldPieData[oldPieData.length-1].endAngle;
    e0 = oldPieData[oldPieData.length-1].endAngle;
  } else {
    s0 = 0;
    e0 = 0;
  }
  var i = d3.interpolate({startAngle: s0, endAngle: e0}, {startAngle: d.startAngle, endAngle: d.endAngle});
  return function(t) {
    var b = i(t);
    return arc(b);
  };
}



function removePieTween(d, i) {
  s0 = 2 * Math.PI;
  e0 = 2 * Math.PI;
  var i = d3.interpolate({startAngle: d.startAngle, endAngle: d.endAngle}, {startAngle: s0, endAngle: e0});
  return function(t) {
    var b = i(t);
    return arc(b);
  };
}

function textTween(d, i) {
  var a;
  if(oldPieData[i]){
    a = (oldPieData[i].startAngle + oldPieData[i].endAngle - Math.PI)/2;
  } else if (!(oldPieData[i]) && oldPieData[i-1]) {
    a = (oldPieData[i-1].startAngle + oldPieData[i-1].endAngle - Math.PI)/2;
  } else if(!(oldPieData[i-1]) && oldPieData.length > 0) {
    a = (oldPieData[oldPieData.length-1].startAngle + oldPieData[oldPieData.length-1].endAngle - Math.PI)/2;
  } else {
    a = 0;
  }
  var b = (d.startAngle + d.endAngle - Math.PI)/2;

  var fn = d3.interpolateNumber(a, b);
  return function(t) {
    var val = fn(t);
    return "translate(" + Math.cos(val) * (radius+textOffset) + "," + Math.sin(val) * (radius+textOffset) + ")";
  };
}

//create map elements
var projection = d3.geo.albersUsa().scale(850).translate([width / 2, height / 2]);//.precision(.1);
var path = d3.geo.path().projection(projection);
var large_dataset;
var maxmin = {};
var circleScale = d3.scale.linear().range([3, 10]);
var industries = [];
var top10 = [];
var count = 0;

//load data
function loadData() {

    d3.tsv("../data/master.tsv",function(error,data){
      large_dataset = data;

      dataSet = data.filter( function(d){ 
          return d["Year"] == "1955";
        });

      toptizzles = data.filter(function(d){
        return parseInt(d["Rank"]) <= 10;
      })

        
        unique_top10[0] = {Company: "Company", Rank: 0}
        topTen[0] = {Company: "Company", Rank: 0};

          for(var i = 0; i < 10; i++){
            topTen.push(dataSet[i]);
          }

      for(var u = 0; u < toptizzles.length; u++){
        if(unique_top10.length == 0){
          unique_top10.push(toptizzles[u])
        }
        else{
          for(var e = 0; e < unique_top10.length; e++){
            if(unique_top10[e]["Company"] == toptizzles[u]["Company"]){
              break;
            }
            else if(e == unique_top10.length - 1){
              unique_top10.push(toptizzles[u]);
            }
          }
        }
      }


      //barzzz
      gzz = d3.select("#tableplace").append('svg')
                  .attr("width", bar_width)
                  .attr("height", bar_height);


      groups = gzz
        .selectAll("g")
        //takes data we parsed
        .data(topTen)
        .enter()
        //add g's
        .append("g")
        //places g's in correct location
        .attr("transform", function(d, i) {
        if(parseInt(d["Year"]) == 1955 || parseInt(d["Rank"]) == 0){
          return "translate(0, " + bar_yScale(parseInt(d["Rank"])) +")"; 
        }
        else{
          return "translate(0, " + 500 + ")";;
        }
        })
        .attr("id", function(d, i){
          comp = d["Company"];
          newstring = comp.split('.').join(' ');
          newstring1 = newstring.split('&').join(' ');
          return newstring1;
        });

      bars = groups
        .append("rect")
        .attr("width", function() { 
          return bar_width;
        })
        .attr("height", single_bar_height)
        .style("fill", function(d){
          if(parseInt(d["Rank"]) % 2 == 1){
            return "#383838"; 
          }
        });

      comp_text = groups.append("text")
            .attr("x", function(d) { return 15; })
            .attr("y", function(d) { return single_bar_height/2; })
            .attr("id", "Comp")
            .text(function(d) { 
              return d["Company"]; 
            })


      groups.append("text")
            .attr("id", "Rank")
            .attr("x", function(d) { return 200; })
            .attr("y", function(d) { return single_bar_height/2; })
            .text(function(d) {
            if(d["Rank"] == 0){
                return "Rank";
            } 
            else{
              return d["Rank"]; 
            }
            })






      for(var stat = 0; stat < 52; stat++){
        st = states[0][stat]["__data__"]["properties"]["code"];
        choroset[stat] = {St: st, Val: 0, Rev: 0};
      }


      choro_count = 0;
      dataSet.forEach(function(d, i){
        st = dataSet[i]["Address"].substring(dataSet[i]["Address"].length-2, dataSet[i]["Address"].length);
        rev = dataSet[i]["Revenue"];
        for(var t = 0; t < 52; t++){
          if(st == choroset[t]["St"]){
            choroset[t]["Val"] = choroset[t]["Val"] + 1;
            choroset[t]["Rev"] = choroset[t]["Rev"] + parseInt(rev);
            break;
          }
      }

      })
      for(var i = 1955; i <= 2005; i++){
        maxmin[i] = {max: 0, min: 0};
      }

      for(var j = 0; j <= large_dataset.length-200; j = j + 200){
        maxmin[large_dataset[j]["Year"]]["max"] = large_dataset[j]["Revenue"];
        maxmin[large_dataset[j]["Year"]]["min"] = large_dataset[j+199]["Revenue"];
      }

      for(var k = 0; k < large_dataset.length; k++){
          ind = large_dataset[k]["Industry"];
          year = large_dataset[k]["Year"];
          if(industries.length == 0){
            industries[0] = {Industry: ind, Num: 1}
          }
          else{
          for(var z = 0; z < industries.length; z++){
            if(industries[z]["Industry"] == ind && industries[z]["Year"] == year){
              industries[z]["Num"] = industries[z]["Num"] + 1;
              break;
            }
            else if(z == industries.length-1){
              industries[z+1] = {Industry: ind, Num: 1, Year: year}
              break;
            }
          }
      }
    }
    supa = [];
    var overal_sum = 0;
    for(var l = 0; l < industries.length; l++){
      if(industries[l]["Year"] == 1955){
        supa.push(industries[l])
        overal_sum = overal_sum + industries[l]["Num"];
      }
    }
    supa.sort(function(a, b) {
        return b["Num"]-a["Num"];
    });
    var sum = 0;
    for(var i = 0; i < 6; i++){
      tenner[i] = supa[i];
      sum = sum + supa[i]["Num"];

      tenner[i]["Color"] = color_1(tenner[i]["Industry"]);
      tenner[i]["Year"] = 1955;

    }
    tenner[5] = {Industry: "Other", Num: overal_sum - sum, Color: "#C9C0B7", Year: 1955}

    //create tooltip with station name and total number of hours
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-5, 0])
      .html(function(d) {

        var company = d["Company"];


        var location = d["Address"];


        return "<strong><span style='color:deepskyblue'>" + company + 
        "</strong></span><p></p><p><span>" + location +"</span></p>";
    })

    map.call(tip);

    //create dots for each station, where color is determined by whether or not the station
        //has collected data, and radius is determined by the total hours of sunlight measured
        //at that station

    map.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", function(d, i){
        return "circle_" + d["Year"];
      })
      .attr("cx", function(d){
          var screencord = projection([d["Lon"], d["Lat"]]);
          if(screencord!= null){ return screencord[0]; }
      })
      .attr("cy", function(d){
        var screencord = projection([d["Lon"], d["Lat"]])
        if(screencord!= null){ return screencord[1]; }
      })
      .attr("fill", "#FFFFFF")
      .attr("r", function(d, i){
        min = maxmin[d["Year"]]["min"];
        max = maxmin[d["Year"]]["max"];
          circleScale.domain([min, max]);
          return circleScale(d["Revenue"])
      })
      .attr("id", function(d, i){
        if(d["Year"] == 1955){
          return "yes";
        }
        else{
          return "no";
        }
      })
      .style("stroke", "#FFFFFF")
      .style("fill-opacity", .4)
      .style("stroke-width", 1.5)
      .on('mouseover', tip.show) 
      .on('mouseout', tip.hide);

$("circle").fadeOut(10);
$(".circle_1955").fadeIn(10);

  var pie_width = 400, pie_height = 300;
    
  radius = Math.min(pie_width, pie_height) / 3;

  //Pie chart!
  arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

  pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d["Num"]; 
      });

  svgizzle = d3.select("#pie").append("svg")
      .attr("width", pie_width)
      .attr("height", pie_height);

  realSVG = svgizzle
    .append("g").attr("id", "pie")
    .attr("transform", "translate(" + pie_width / 2 + "," + pie_height / 2 + ")");

    gpie = realSVG.selectAll(".arc")
        .data(pie(tenner))
        .enter().append("g")
        .attr("class", "arc");



  label_group = svgizzle.append("svg:g")
    .attr("class", "label_group")
    .attr("transform", "translate(" + (pie_width/2) + "," + (pie_height/2) + ")");

    lines = label_group.selectAll("line").data(pie(tenner));


   valueLabels = label_group.selectAll("text.value").data(pie(tenner))
        .attr("dy", function(d){
          if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
            return 5;
          } else {
            return -7;
          }
        })
        .attr("text-anchor", function(d){
          if ( (d.startAngle+d.endAngle)/2 < Math.PI ){
            return "beginning";
          } else {
            return "end";
          }
        })
        .text(function(d){
          var percentage = (d["data"]["Num"]/overal_sum)*100;
          return percentage.toFixed(1) + "%";
        });



      nameLabels = label_group.selectAll("text.units").data(pie(tenner))
        .attr("dy", function(d){
          if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
            return 17;
          } else {
            return 5;
          }
        })
        .attr("text-anchor", function(d){
          if ((d.startAngle+d.endAngle)/2 < Math.PI ) {
            return "beginning";
          } else {
            return "end";
          }
        }).text(function(d){
          return d["data"]["Industry"];
        });
          
  //mouseover functionality to let us know what country it would
    })
  }




//SP500 graph
var xGDP = d3.scale.linear()
      .domain([1955, 2005])
      .range([20, bbDetail.width+50]);


var yGDP = d3.scale.linear()
      .range([125, 10]);

var xAxisGDP = d3.svg.axis()
      .scale(xGDP)
      .orient("bottom")
      .tickSubdivide(5)
      .tickFormat(d3.format("d"));

var yAxisGDP = d3.svg.axis()
      .scale(yGDP)
      .orient("left")
      .ticks(5);


var grapharea = d3.svg.area()
    .x(function(d) { return xGDP(parseInt(d["Year"])) + 42 })
    .y0(100)
    .y1(function(d) { return yGDP(parseFloat(d["change"])); });

var graphline = d3.svg.line()
    .x(function(d) { return xGDP(parseInt(d["Year"])) + 42})
    .y(function(d) { return yGDP(parseFloat(d["change"])); })
    .interpolate("monotone");

  var line1 = d3.svg.line()
      .x(function(d) { return xGDP(d.x); })
      .y(function(d) { return yGDP(d.y); });


function loadSPGraph() {

  d3.csv("../data/GDP.csv", function(error,data){
    gdp_data = data;


    yGDP.domain(d3.extent(data, function(d) { return parseFloat(d["change"]); }));

    data.forEach(function(d, i){
      datase[i] = {x: parseInt(d["Year"]), y: parseFloat(d["change"])}
    });
    line_dataset = datase;

    gdp.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(42, 125)")
        .call(xAxisGDP)

    gdp.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(50, 0)")
        .call(yAxisGDP);

    gdp.append("text")
        .attr("transform", "rotate(-90)")
        .attr("class", "label")
        .attr("y", 5)
        .attr("x",0 - 70)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Trillions of dollars");

    gdp.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", grapharea);

    gdp.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", graphline);
  })
}


//map of headquarters
var map = d3.select("#map").append("svg").attr({
    width: 650,
    height: 500
})
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

function makeMap(){
  //create US map
  d3.json("../data/us-named.json", function(error, data) {

      //create US map
      var usMap = topojson.feature(data,data.objects.states).features

      states = map.selectAll(".country").data(usMap).enter().append("path")
          .attr("d", path).attr("class", "country").style("fill", "#383838"); 
      // see also: http://bl.ocks.org/mbostock/4122298

      loadData();
  });
}

var yearIter = 1955;

var draw_viz = function(yearz, end){
    if(path_count > 0){
    var prev = path_count - 1;
  }
  path_count++;
  d3.select("#gdp g.selectorHand")
    .attr("transform", "translate("+(xGDP(yearz) + 40)+",0)");


  timer = setTimeout(function(){
      redraw(yearz, end)
    }, delayz);
  
var start = function(){

  d3.select("#gdp").select("path").remove();

  var path = gdp.append("path")
      .attr("id", "path" + path_count)
      .attr("d", line1(line_dataset))
      .attr("stroke", "deepskyblue")
      .attr("stroke-width", "2")
      .attr("fill", "none")
      .attr("transform", "translate(" + 40 + ",0)");
    

  var totalLength = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
      .duration(250+25500-((yearz-1955)*500))
      .ease("linear")
      .attr("stroke-dashoffset", 0);

  draw_viz(yearz, 2005); 
}

d3.select("#play").on("click", function(d, i){
  if(isPlaying == false){
    isPlaying = true;
    start();
  }
  else{
    clearTimeout(timer);
    d3.selectAll("path").transition().duration(0);
    isPlaying=false;
      line_dataset = line_dataset.filter( function(d){ 
      return d["x"] >= yearz - 2;
  });

    console.log("stop!");
  }

})


function redraw(i, end) {

  pre = i - 1;
  name = ".circle_" + i;
    prename = ".circle_"+ pre;

if(isLoca == false){
  $(prename).fadeOut("slow");
  $(name).fadeIn("slow");
}

   temp_choro = [];
  init_choro = large_dataset.filter( function(d){ 
      return d["Year"] == i.toString();

  });

  
if(i >= yearz+1){


  aprev_10 = {};
  acurr_10 = {};
  prev_10 = [];
  curr_10 = [];
  var prev_year = [];
  var count = 0;
  obje = {Company: "Company", Rank: "0"};
  curr_10[0] = obje;
  prev_10[0] = obje;


  for(var j = 0; j < toptizzles.length; j++){
    if(toptizzles[j]["Year"] == pre.toString()){
      prev_10[count+1] = {Company: toptizzles[j]["Company"], Rank: toptizzles[j]["Rank"]};
      count++;
      aprev_10[toptizzles[j]["Company"]] = toptizzles[j]["Rank"];
      if(count >= 10){
        break;
      }
    }
  }
 
 count = 0;
  for(var j = 0; j < toptizzles.length; j++){
    if(toptizzles[j]["Year"] == i.toString()){
      curr_10[count+1] = {Company: toptizzles[j]["Company"], Rank: toptizzles[j]["Rank"]};
      count++;
      acurr_10[toptizzles[j]["Company"]] = toptizzles[j]["Rank"];
      if(count >= 10){
        break;
      }
    }
  }

  d3.select("#tableplace").selectAll("g").selectAll("rect").remove();

 graw = d3.select("#tableplace").selectAll("g").data(curr_10)
      .attr("transform", function(d) {
            return "translate(0, " + bar_yScale(parseInt(d["Rank"])) +")"; 
        })

        graw.append("rect")
        .attr("width", function() { 
          return bar_width;
        })
        .attr("height", single_bar_height)
        .style("fill", function(d){
          if(parseInt(d["Rank"]) % 2 == 1){
            return "#383838"; 
          }
        });;


  comp_text = graw.append("text")
            .attr("x", function(d) { return 15; })
            .attr("y", function(d) { return single_bar_height/2; })
            .attr("id", "Comp")
            .text(function(d) { 
              return d["Company"]; 
            })


      graw.append("text")
            .attr("id", "Rank")
            .attr("x", function(d) { return 200; })
            .attr("y", function(d) { return single_bar_height/2; })
            .text(function(d) {
            if(d["Rank"] == 0){
                return "Rank";
            } 
            else{
              return d["Rank"]; 
            }
            })

}
  oldPieData = pie(tenner);

  var holder = [];
  var count = 0;
  overall_sum = 0;
    for(var l = 0; l < industries.length; l++){
      if(industries[l]["Year"] == i.toString()){
        holder[count] = industries[l];
        overall_sum = overall_sum + industries[l]["Num"];
        count++;
      }
    }

    holder.sort(function(a, b) {
        return b["Num"]-a["Num"];
    });   

    sum = 0;
    for(var zeb = 0; zeb < 5; zeb++){
      tenner[zeb] = holder[zeb];
      tenner[zeb]["Color"] = color_1(holder[zeb]["Industry"]);
      sum = sum + holder[zeb]["Num"];
    }
    tenner[5] = {Industry: "Other", Num: overall_sum - sum, Color: "#A9A9A9"} 
    filteredPieData = pie(tenner);


    paths = gpie.selectAll("path").data(filteredPieData);



    paths.enter().append("svg:path")
      .attr("stroke", "none")
      .attr("stroke-width", 0.5)
      .attr("fill", function(d, i) { return d["data"]["Color"]; })
      .transition()
        .duration(tweenDuration)
        .attrTween("d", pieTween);
paths.attr("fill", function(d, i) { return d["data"]["Color"]; })
      .transition()
        .duration(tweenDuration)
        .attrTween("d", pieTween);


    paths.exit()
      .transition()
        .duration(tweenDuration)
        .attrTween("d", removePieTween)
      .remove();

    //DRAW TICK MARK LINES FOR LABELS
    lines = label_group.selectAll("line").data(filteredPieData);
    lines.enter().append("svg:line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", -radius-3)
      .attr("y2", -radius-8)
      .attr("stroke", "gray")
      .attr("transform", function(d) {
        return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
      });
    lines.transition()
      .duration(tweenDuration)
      .attr("transform", function(d) {
        return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
      });
    lines.exit().remove();

    //DRAW LABELS WITH PERCENTAGE VALUES
    valueLabels = label_group.selectAll("text.value").data(filteredPieData)
      .attr("dy", function(d){
        if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
          return 5;
        } else {
          return -7;
        }
      })
      .attr("text-anchor", function(d){
        if ( (d.startAngle+d.endAngle)/2 < Math.PI ){
          return "beginning";
        } else {
          return "end";
        }
      })
      .text(function(d){
        var percentage = (d["data"]["Num"]/overall_sum)*100;
        return percentage.toFixed(1) + "%";
      });

    valueLabels.enter().append("svg:text")
      .attr("class", "value")
      .attr("transform", function(d) {
        return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (radius+textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (radius+textOffset) + ")";
      })
      .attr("dy", function(d){
        if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
          return 5;
        } else {
          return -7;
        }
      })
      .attr("text-anchor", function(d){
        if ( (d.startAngle+d.endAngle)/2 < Math.PI ){
          return "beginning";
        } else {
          return "end";
        }
      }).text(function(d){
        var percentage = (d["data"]["Num"]/overall_sum)*100;
        return percentage.toFixed(1) + "%";
      });

    valueLabels.transition().duration(tweenDuration).attrTween("transform", textTween);

    valueLabels.exit().remove();


    //DRAW LABELS WITH ENTITY NAMES
    nameLabels = label_group.selectAll("text.units").data(filteredPieData)
      .attr("dy", function(d){
        if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
          return 17;
        } else {
          return 5;
        }
      })
      .attr("text-anchor", function(d){
        if ((d.startAngle+d.endAngle)/2 < Math.PI ) {
          return "beginning";
        } else {
          return "end";
        }
      }).text(function(d){
        return d["data"]["Industry"];
      });

    nameLabels.enter().append("svg:text")
      .attr("class", "units")
      .attr("transform", function(d) {
        return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (radius+textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (radius+textOffset) + ")";
      })
      .attr("dy", function(d){
        if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
          return 17;
        } else {
          return 5;
        }
      })
      .attr("text-anchor", function(d){
        if ((d.startAngle+d.endAngle)/2 < Math.PI ) {
          return "beginning";
        } else {
          return "end";
        }
      }).text(function(d){
        return d["data"]["Industry"];
      });

    nameLabels.transition().duration(tweenDuration).attrTween("transform", textTween);

    nameLabels.exit().remove();


      for(var stat = 0; stat < 52; stat++){
        st = states[0][stat]["__data__"]["properties"]["code"];
        temp_choro[stat] = {St: st, Val: 0, Rev: 0};
      }

      choro_count = 0;
      init_choro.forEach(function(d, i){
        st = init_choro[i]["Address"].substring(init_choro[i]["Address"].length-2, init_choro[i]["Address"].length);
        rev = init_choro[i]["Revenue"];
        for(var t = 0; t < temp_choro.length; t++){
          if(st == temp_choro[t]["St"]){
            temp_choro[t]["Val"] = temp_choro[t]["Val"] + 1;
            temp_choro[t]["Rev"] = temp_choro[t]["Rev"] + parseInt(rev);
            break;
        }
      }
    })
  if(isChoro == false){ 


        states.style("fill", function(d, i){
            for(var u = 0; u < temp_choro.length; u++){
                return "#585858";
              }
          })
  }
  else{
            states.style("fill", function(d, i){
            for(var u = 0; u < temp_choro.length; u++){
              if(temp_choro[u]["St"] == d["properties"]["code"]){
                if(temp_choro[u]["Rev"] > 0){
                  return choro_color(temp_choro[u]["Rev"]);
                }
                else{
                return "#585858";
                }
              }
            }
          })
  }

if(i < end && isPlaying == true){
  yearz=yearz+1;
  draw_viz(yearz, end);
}
}

d3.select("#locations").on("click", function(){
  if(isLoca == false){
    isLoca = true;
    if(name == "notset"){
      $(".circle_1955").fadeOut("fast");
    }
    else{
      $(name).fadeOut("fast");
    }
  }
  else{
    isLoca = false;
    if(name == "notset"){
      $(".circle_1955").fadeIn("slow");
    }
    else{
      $(name).fadeIn("fast");
    }
  }
})


d3.select("#chorobutton").on("click", function(){
  if(isChoro == false){
    isChoro = true;
      states.style("fill", function(d, i){
          for(var u = 0; u < choroset.length; u++){
              if(choroset[u]["St"] == d["properties"]["code"]){
                if(choroset[u]["Rev"] > 0){
                  return choro_color(choroset[u]["Rev"]);
                }
                else{
                return "#585858";
                }
              }
            }
          })
    }
    else{
      isChoro = false;
            states.style("fill", function(d, i){
                return "#585858";
          })

    }
  })
//Swiper 
window.onload = function() {
  //"Next" button - some HTML element with "button-next" class
  $('.arrow-right').click(function(){mySwiper.swipeNext()})
  //"Prev" button - some HTML element with "button-prev" class
  $('.arrow-left').click(function(){mySwiper.swipePrev()})

  var howManySlides = $('.swiper-wrapper .swiper-slide').length - 1;
  $(".arrow-left").addClass('hide');
  
  var mySwiper = new Swiper('.swiper-container',{
      //Your options here:
      mode:'horizontal',
      loop: false,
      simulateTouch: false,
      followFinger: false,
      onSlideChangeEnd : function() {
       slideSelected();
      },
      onSlideChangeStart: function(){
        $(".arrow-left,.arrow-right").removeClass('hide');
        if(mySwiper.activeIndex === 0) {
            $(".arrow-left").addClass('hide');
        }
        if(mySwiper.activeIndex === howManySlides) {
            $(".arrow-right").addClass('hide');
        }
      }
  });  



d3.select("#seventiesPlay").on("click", function(d, i){
  isPlaying = true;
  yearz = 1970;

  line_dataset = line_dataset.filter( function(d){ 
      return d["x"] >= 1970 && d["x"] <= 1980;
  });

  d3.select("#gdp").select("path").remove();

  var path = gdp.append("path")
      .attr("id", "path" + path_count)
      .attr("d", line1(line_dataset))
      .attr("stroke", "deepskyblue")
      .attr("stroke-width", "2")
      .attr("fill", "none")
      .attr("transform", "translate(" + 40 + ",0)");
    

  var totalLength = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
      .duration(17*500)
      .ease("linear")
      .attr("stroke-dashoffset", 0);


  d3.select(".gdp").append("rect")
    .attr("width", 2)
    .attr("height", 125)
    .attr("transform", function(){
      val = xGDP(1970) + 40;
      return"translate("+val+ ",0)";
    })
    .attr("fill", "orange");


  d3.select(".gdp").append("rect")
    .attr("width", 2)
    .attr("height", 125)
    .attr("transform", function(){
      val = xGDP(1979) + 50;
      return "translate("+val+ ",0)";
    })
    .attr("fill", "orange");

  draw_viz(yearz, 1980);
})

d3.select("#eightiesPlay").on("click", function(d, i){
  isPlaying = true;
  yearz = 1980;

  line_dataset = line_dataset.filter( function(d){ 
      return d["x"] >= 1980 && d["x"] <= 1990;
  });

  d3.select("#gdp").select("path").remove();

  var path = gdp.append("path")
      .attr("id", "path" + path_count)
      .attr("d", line1(line_dataset))
      .attr("stroke", "deepskyblue")
      .attr("stroke-width", "2")
      .attr("fill", "none")
      .attr("transform", "translate(" + 40 + ",0)");
    

  var totalLength = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
      .duration(17*500)
      .ease("linear")
      .attr("stroke-dashoffset", 0);

        d3.select(".gdp").append("rect")
    .attr("width", 2)
    .attr("height", 125)
    .attr("transform", function(){
      val = xGDP(1980) + 40;
      return"translate("+val+ ",0)";
    })
    .attr("fill", "orange");


  d3.select(".gdp").append("rect")
    .attr("width", 2)
    .attr("height", 125)
    .attr("transform", function(){
      val = xGDP(1989) + 50;
      return "translate("+val+ ",0)";
    })
    .attr("fill", "orange");


  draw_viz(yearz, 1990);
})

d3.select("#ninetiesPlay").on("click", function(d, i){
  isPlaying = true;
  yearz = 1990;

  line_dataset = line_dataset.filter( function(d){ 
      return d["x"] >= 1990 && d["x"] <= 2000;
  });

  d3.select("#gdp").select("path").remove();

  var path = gdp.append("path")
      .attr("id", "path" + path_count)
      .attr("d", line1(line_dataset))
      .attr("stroke", "deepskyblue")
      .attr("stroke-width", "2")
      .attr("fill", "none")
      .attr("transform", "translate(" + 40 + ",0)");
    

  var totalLength = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
      .duration(17*500)
      .ease("linear")
      .attr("stroke-dashoffset", 0);

    d3.select(".gdp").append("rect")
    .attr("width", 2)
    .attr("height", 125)
    .attr("transform", function(){
      val = xGDP(1990) + 40;
      return"translate("+val+ ",0)";
    })
    .attr("fill", "orange");


  d3.select(".gdp").append("rect")
    .attr("width", 2)
    .attr("height", 125)
    .attr("transform", function(){
      val = xGDP(1999) + 50;
      return "translate("+val+ ",0)";
    })
    .attr("fill", "orange");

  draw_viz(yearz, 2000);
})

function slideSelected() {
  switch (mySwiper.activeIndex) {
    case 0: 
      console.log("hi")
    break;
    case 1:
      console.log("bye")
    break;
    case 2:
      $("#guide").fadeOut();
    break;
    }
  };
}

var selectorHand = gdp.append("g")
      .attr("class", "selectorHand")
      .attr("transform", "translate(60,0)");
      //.attr("transform", "translate("+(xGDP(yearz))+",0)");

    selectorHand.append("line")
      .attr("y1", 5)
      .attr("y2", 125);

var drag = d3.behavior.drag()
    .origin(Object)
    .on("drag", dragSelectorHand);

 d3.select("#gdp .selectorHand").call(drag);

function dragSelectorHand() {

      var c = d3.mouse(this.parentNode);   // get mouse position relative to its container
      var datyeartho = getCurrentYear(c[0]);
      console.log(getCurrentYear(c[0]));

      //limit selector to graph
      if(datyeartho >= 1955 && datyeartho <= 2005)  {
       d3.select(this).attr("transform", "translate("+xGDP(datyeartho+4)+",0)");
      }
    }

//round to nearest year
function getCurrentYear(x) {
      var year = Math.round(xGDP.invert(x-40));
      return year;
      //yearz = year;
    }



makeMap();
loadSPGraph();


