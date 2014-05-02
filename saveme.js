/** 
  CS171 Project
  The Changing Landscape of the American Economy
  Katherine Dai, Patrick Xu


Credits:
Pie chart code: http://blog.stephenboak.com/2011/08/07/easy-as-a-pie.html
Slider + Accompanying functions:
tooltip:
swiper:
**/


//setting margins for viz
var margin = {
    top: 50,
    right: 0,
    bottom: 50,
    left: 0
};

var width = 650 - margin.left - margin.right;
var height = 550 - margin.bottom - margin.top;

var dataSet = [];
//variable for year of certain viz
var savedWalmart = 1992;
var yearz = 1955;
var savedRockefella = 1955;

//variable for which viz was clicked
var rockefella = false;
var seventiesPlaying = false;
var pieShow = false;
var isChoro = false;
var isLoca = false;
var isPlaying = false;

//tooltip
var tip;

//variables for top10
var toptizzles = [];
var topTen = [];
var toptenrevenue = 0;
var single_bar_height = 40;
var format = d3.format("0,000");
var supa;
var bar_height = 325;
var bar_width = 225;
var bar_yScale = d3.scale.linear().domain([0, 11]).range([0, bar_height-35]);

//topTen dataset
var tenner = [];


//relevant pie chart variables PIE ------------
var groups;
var bars;
var overall_sum = 0;
var radius = Math.min(width, height) /2;
var gzz;

//pie chart svg
var gpie;

//labels for pie chart
var label_group;

//color function for variable
var color_1 = d3.scale.category20()
var pie;
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

//timer for the setTimeout
var timer;


//variable that sets delay
var delayz = 600;

//variable for selector/drag function
var selectorHand;
var drag = d3.behavior.drag()
    .origin(Object)
    .on("drag", dragSelectorHand);

//variable for the class of circles we will be looking at
var name = "notset";
var curr_10 = [];


//GDP variables
var datase =[];

//choroset variables 
var temp_choro;

//set variable for textTween
var val = 0;
var bbDetail = {
    width: 500,
    height: 200
}

//draws out the states
var states;

//initial choropleth dataset
var choroset = [];

//dataset for our line
var line_dataset = [];


//choropleth characteristcs
var choro_width = 500,
    choro_height = 500;

//creating the choropleth
var choro_svg = d3.select("tbody").append("tr").append("svg").attr("id", "choro")
    .attr("width", choro_width)
    .attr("height", choro_height);


//create main visualization
var gdp = d3.select("#gdp").append("svg").attr({
    width: 625,
    height: 150
})
.attr("class", "gdp")


//setting range for blues choropleth
var colorMin = colorbrewer.Blues[3][1];
var colorMax = colorbrewer.Blues[3][2];

//setting scale
var choro_color = d3.scale.linear()
      .interpolate(d3.interpolateRgb)
      .range([colorMin, colorMax]);


//setting pieTween for pie chart transitions
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


//removes the pieTween for pie chart transitions
function removePieTween(d, i) {
  s0 = 2 * Math.PI;
  e0 = 2 * Math.PI;
  var i = d3.interpolate({startAngle: d.startAngle, endAngle: d.endAngle}, {startAngle: s0, endAngle: e0});
  return function(t) {
    var b = i(t);
    return arc(b);
  };
}

//setting textTween for the text transitions
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

//projection for maps for US data
var projection = d3.geo.albersUsa().scale(800).translate([width / 2, height / 2]);//.precision(.1);
var path = d3.geo.path().projection(projection);

//overall dataset that takes in our master.csv data
var large_dataset;

//max and min object for scales
var maxmin = {};
//set scale for circles
var circleScale = d3.scale.linear().range([3, 20]);

//industries array
var industries = [];

//top10 array
var top10 = [];

//overall counter
var count = 0;


//function for dragging the selector
function dragSelectorHand() {

      var c = d3.mouse(this.parentNode);   // get mouse position relative to its container
      var datyeartho = getCurrentYear(c[0]);

    if(datyeartho >= 1955 && datyeartho <= 2005){
      yearz = datyeartho; 

      draw_viz(yearz, yearz + 1);

      // limit selector to graph
       $(this).attr("transform", "translate("+xGDP(datyeartho+4)+",0)");
    }
    }

//round to nearest year
function getCurrentYear(x) {
      var year = Math.round(xGDP.invert(x-40));
      return year;
    }

//load data 
function loadData() {

    d3.tsv("../data/master.tsv",function(error,data){
      large_dataset = data;

      //find first year load information
      dataSet = data.filter( function(d){ 
          return d["Year"] == "1955";
        });

      //get the top 10 companies
      toptizzles = data.filter(function(d){
        return parseInt(d["Rank"]) <= 10;
      })

      //looping through to calculate the revenue
      for(var i = 0; i < 10; i++){
        topTen.push(dataSet[i]);
        toptenrevenue += parseInt(dataSet[i]["Revenue"]);
      }

      //append to factbox
      d3.select("#revenuefacts").append("g").append("text")
        .attr("class", "textbox")
        .html(function() {

            return "<h2><span id='revenuetitle'>$" + format(toptenrevenue) + 
            "B</span></h2>";
       });


      //start of code for actually appending top 10 information
      //first, we append an svg
      gzz = d3.select("#tableplace").append('svg')
                  .attr("width", bar_width)
                  .attr("height", 295);

      //take in data and add g's for the data
      groups = gzz
        .selectAll("g")
        .data(topTen)
        .enter()
        .append("g")
        .attr("class", "toptenbar")
        .attr("transform", function(d, i) {
          //move to correct location
          return "translate(0, " + (bar_yScale(parseInt(d["Rank"]))-20) +")"; 
        })
        .attr("id", function(d, i){
          //setting ids, watching out for periods
          comp = d["Company"];
          newstring = comp.split('.').join(' ');
          return newstring;
        })
        .attr("fill", function(d){
          //zebra chart
          if(parseInt(d["Rank"]) % 2 == 1){
            return "#383838"; 
          }
        });

        //appending rectangles inside groups
      bars = groups
        .append("rect")
        //setting border stroke
        .attr("stroke", "#383838")
        .attr("stroke-width",4)
        .attr("width", bar_width)
        .attr("height", single_bar_height)
        .on("mouseover", function(d){
          //mouseover - highlight the bar and circle
          highlight(d);
        })
        .on("mouseout", function(d){
          //mouseoff - return to normal
          unhighlight(d);
        });

        //setting the company names for the bars
      comp_text = groups.append("text")
            .attr("y", function() { return single_bar_height/2; })
            .attr("class", "comp_text")
            .text(function(d) { 
              //edge cases for ATT (improve aesthetics)
            if(d["Company"] == "ATT Technologies"){
                d["Company"] = "AT&T";
                return "AT&T";
              }
              else if(d["Company"] == "ATT"){
                d["Company"] = "AT&T";
                return "AT&T";
              }
              else{
                return d["Company"]; 
              }
            })
            //setting location of these addresses
            .attr("x", function(d) {
              return 90 - (d["Company"].length)*2;

             })


            //setting ranks
      groups.append("text")
            .attr("class", "rank_text")
            .attr("x", function(d) { return 15; })
            .attr("y", function(d) { return single_bar_height/2; })
            .text(function(d) {
              return d["Rank"]; 
            })
      //DONE WITH TOP TEN


      //START OF CHOROPLETH
      //initially chorset dataset
      for(var stat = 0; stat < 52; stat++){
        st = states[0][stat]["__data__"]["properties"]["code"];
        choroset[stat] = {St: st, Val: 0, Rev: 0};
      }

      //setting the number of companies per state and revenue per state
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
      
      //finding max and min for the initial choropleth viz
      dmax =  d3.max(choroset, function(d){return parseInt(d["Rev"])})
      dmin = d3.min(choroset, function(d){
        if(d["Val"] > 0) {
          return parseInt(d["Rev"])
        }
        else
        {
          return 10000000000;
        }
      })

      //actual setting of scale
      choro_color.domain([dmin, dmax]);

      //initializing maxmin for use
      for(var i = 1955; i <= 2005; i++){
        maxmin[i] = {max: 0, min: 0};
      }

      //finding max and min for each year
      for(var j = 0; j <= large_dataset.length-200; j = j + 200){
        maxmin[large_dataset[j]["Year"]]["max"] = large_dataset[j]["Revenue"];
        maxmin[large_dataset[j]["Year"]]["min"] = large_dataset[j+199]["Revenue"];
      }

      //determining the number of industries per year
      for(var k = 0; k < large_dataset.length; k++){
          ind = large_dataset[k]["Industry"];
          year = large_dataset[k]["Year"];
          if(industries.length == 0){
            //initializing
            industries[0] = {Industry: ind, Num: 1}
          }
          else{
          for(var z = 0; z < industries.length; z++){
            if(industries[z]["Industry"] == ind && industries[z]["Year"] == year){
              //incrementing
              industries[z]["Num"] = industries[z]["Num"] + 1;
              break;
            }
            else if(z == industries.length-1){
              //if state wasn't found
              industries[z+1] = {Industry: ind, Num: 1, Year: year}
              break;
            }
          }
      }
    }

    //more top 10
    supa = [];

    //determining overall sum for all the industries
    var overal_sum = 0;
    for(var l = 0; l < industries.length; l++){
      if(industries[l]["Year"] == 1955){
        supa.push(industries[l])
        overal_sum = overal_sum + industries[l]["Num"];
      }
    }

    //sort the industries by size
    supa.sort(function(a, b) {
        return b["Num"]-a["Num"];
    });

    //mannipulating for pie chart data
    var sum = 0;
    for(var i = 0; i < 6; i++){
      tenner[i] = supa[i];
      sum = sum + supa[i]["Num"];

      tenner[i]["Color"] = color_1(tenner[i]["Industry"]);
      tenner[i]["Year"] = 1955;

    }
    //setting the other array
    tenner[5] = {Industry: "Other", Num: overal_sum - sum, Color: "#C9C0B7", Year: 1955}

    //create tooltip with station name and total number of hours
    tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-5, 0])
      .html(function(d) {
        var company;
        if(d["Company"] == "ATT Technologies")
          company = "AT&T";
        else if(d["Company"] == "ATT")
          company = "AT&T"
        else
          company = d["Company"]

        var location = d["Address"];


        return "<strong><span style='color:deepskyblue'>" + company + 
        "</strong></span><p></p><p><span>" + location +"</span></p>";
      })

    map.call(tip);

    //create dots for each station, where color is determined by whether or not the station
        //has collected data, and radius is determined by the total hours of sunlight measured
        //at that station

    map.selectAll("circle")
      .data(dataSet)
      .enter()
      .append("circle")
      .attr("class", function(d, i){
        indus = d["Industry"].split(' ').join('');
        if(i < 10){
          //including an extra class
          return "circle_" + d["Year"] + " topTen " + indus;
        }
        else{
        return "circle_" + d["Year"] + " " + indus;
      }
      })
      .attr("id", function(d,i){
        //setting similar ids for the circles
        comp = d["Company"];
        newstring = comp.split('.').join(' ');
        return newstring;
      })
      .attr("cx", function(d){
        //checking if we had a non-US entry (sent to 34.7778702)
        if(d["Lon"] == 34.7778702){
          return 1000;
        }
        else{
          //projecting circles on map
          var screencord = projection([d["Lon"], d["Lat"]]);
          if(screencord!= null){ return screencord[0]; }
        }
      })
      .attr("cy", function(d){
        //checking if we had a non-US entry (sent to -96.2408367)
        if(d["Lon"] == -96.2408367){
          return 1000;
        }
        else{
          //projecting circles on map
          var screencord = projection([d["Lon"], d["Lat"]])
          if(screencord!= null){ return screencord[1]; }
        }

      })
      //filling white
      .attr("fill", "#FFFFFF")
      .attr("r", function(d, i){
        //setting size based off of revenue
        min = maxmin[d["Year"]]["min"];
        max = maxmin[d["Year"]]["max"];
          circleScale.domain([min, max]);
          return circleScale(d["Revenue"])
      })
      //setting stroke as white as well
      .attr("stroke", "#FFFFFF")
      .attr("fill-opacity", .4)
      .attr("stroke-width", 1.5)
      //hover functionality with functions we defined
      .on('mouseover', tip.show) 
      .on('mouseout', tip.hide);


        //legend for choropleth --- will stay the entire visualization, just might hide
        //setting initial variables
        var svgWidth = 490,
            svgHeight = 385,
            x1 = 415,
            barWidth = 75,
            y1 = 365,
            barHeight = 20,
            numberHues = 20;

            //setting id
        var idGradient = "legendGradient";

        //appending legend to the map
        var svgForLegendStuff = d3.select("#mapsyo").append("svg")
                            .attr("id", "legenwaitforit")
                            .attr("width", svgWidth)
                            .attr("height", svgHeight);

        //append more svg type items
        svgForLegendStuff.append("g")
                    .append("defs")
                    .append("linearGradient")
                        .attr("id",idGradient)
                        .attr("x1","0%")
                        .attr("x2","100%")
                        .attr("y1","0%")
                        .attr("y2","0%")

        //append the rectangle for the actual legend
        svgForLegendStuff.append("rect")
                    .attr("fill","url(#" + idGradient + ")")
                    .attr("x",x1)
                    .attr("y",y1)
                    .attr("width",barWidth)
                    .attr("height",barHeight);

        //append text. 2 parts, one word above another
        var textY = y1 + barHeight/2;
          svgForLegendStuff.append("text")
                                .attr("class","legendText")
                                .attr("text-anchor", "middle")
                                .attr("x",x1 - 35)
                                .attr("y",textY)
                                .attr("dy",0)
                                .text("Increasing");

          textY = y1 + barHeight/2 + 10;
          svgForLegendStuff.append("text")
                                .attr("class","legendText")
                                .attr("text-anchor", "middle")
                                .attr("x",x1 - 35)
                                .attr("y",textY)
                                .attr("dy",0)
                                .text("Revenue");

        //initializes variables
        var hueStart = 190, hueEnd = 210;
        var opacityStart = 1.0, opacityEnd = 1.0;
        var deltaPercent = 1/(numberHues-1);
        var deltaHue = (hueEnd - hueStart)/(numberHues - 1);
        var deltaOpacity = (opacityEnd - opacityStart)/(numberHues - 1);

        //holder array
        var theData = [];

        //goes through setting the hues for theData
        for (var i=0;i < numberHues;i++) {
            theHue = hueStart + deltaHue*i;
            //the second parameter, set to 1 here, is the saturation
            // the third parameter is "lightness"    
            rgbString = d3.hsl(theHue, .558, .5).toString();
            opacity = opacityStart + deltaOpacity*i;
            p = 0 + deltaPercent*i;
            theData.push({"rgb":rgbString, "opacity":opacity, "percent":p});       
        }

        //actually applies colors - creates legend
        var stops = d3.select('#' + idGradient).selectAll('stop')
                    .data(theData);
                    
              stops.enter().append('stop');
              stops.attr('offset',function(d) {
                            return d.percent;
                })
                .attr('stop-color',function(d) {
                            return d.rgb;
                })
                .attr('stop-opacity',function(d) {
                            return d.opacity;
                });

      //hides legend instantaneously for when we actually click on choropleth
      $("#legenwaitforit").fadeOut(0);

      //make circles come in
      $(".circle_1955").fadeIn(10);

      //applies strokecolor to all circles that are in the top ten
      d3.selectAll(".topTen")
        .attr("stroke", "hotpink");

  //actually drawing pie chart!
  var pie_width = 400, pie_height = 300;
    
  radius = (Math.min(pie_width, pie_height) / 3.5);

  //start functions to help draw pie chart
  arc = d3.svg.arc()
      .outerRadius(radius - 25)
      .innerRadius(0);

  pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d["Num"]; 
      });

  //appending svg
  svgizzle = d3.select("#pie").append("svg")
      .attr("width", pie_width)
      .attr("height", pie_height)

  //appending g
  realSVG = svgizzle
    .append("g").attr("id", "pie")
    .attr("transform", "translate(" + pie_width / 2 + "," + pie_height / 2 + ")");

    //adding in data, this will be used for all our parts of the pie chart
    gpie = realSVG.selectAll(".arc")
        .data(pie(tenner))
        .enter().append("g")
        .attr("class", "arc");

    //use paths to start drawing pie chart
    paths = gpie.selectAll("path").data(pie(tenner));

    //start adding attributes
    paths.enter().append("svg:path")
      //stroke and stroke-width functions
      .attr("stroke", "none")
      .attr("stroke-width", 0.5)
      //fill the preassigned color
      .attr("fill", function(d, i) { return d["data"]["Color"]; })
      .on("mouseover", function(d, i){
        //doesn't allow hover capability if its moving because it gets hectic
        if(isPlaying == false){
        indust = d["data"]["Industry"].split(' ').join('');
        indus = "." + indust;
        d3.selectAll(indus)
            .attr("stroke", function(e, g){
              //checks if we're using a storyline viz
              if(rockefella == true){
                if(e["Company"] == "Amoco" || e["Company"] == "Mobil" || e["Company"] == "Exxon Mobil" || e["Company"] == "ChevronTexaco"
                    || e["Company"] == "Atlantic Richfield" || e["Company"] == "Pennzoil"){
                      return "orange";
                }
                else{
                    return d["data"]["Color"];
                } 
              }
              else{
                //if not, let's do the normal visualization!
                if(z["Rank"] < 10){
                    return "hotpink";
                }
                else{                  
                  return d["data"]["Color"];
                }
            }
            })
            .attr("r", function(e, g){
              //enlarge circles of relevant
              return circleScale(e["Revenue"])*3;
            });

          }

        })
      .on("mouseout", function(d, i){
        //mouseout is very similar, but we just want to revert everything back to normal
        indust = d["data"]["Industry"].split(' ').join('');
        indus = "." + indust
          d3.selectAll(indus)
            .attr("stroke", function(z){
              //determining what our original visualization was
                if(rockefella == true){
                  if(e["Company"] == "Amoco" || e["Company"] == "Mobil" || e["Company"] == "Exxon Mobil" || e["Company"] == "ChevronTexaco"
                    || e["Company"] == "Atlantic Richfield" || e["Company"] == "Pennzoil"){
                      return "orange";
                  }
                  else{
                    return "#FFFFFF";
                  } 
                }
              else{
                if(z["Rank"] < 10)
                return "hotpink";
              else{
                return "#FFFFFF";
              }
            }
          })
            .attr("r", function(e, g){
              //return back to normal size
              return circleScale(e["Revenue"]);
            });
      })
      .transition()
        .duration(tweenDuration)
        .attrTween("d", pieTween)


paths.attr("fill", function(d, i) { return d["data"]["Color"]; })
      .transition()
        .duration(tweenDuration)
        .attrTween("d", pieTween);

        //drawing labels for pie chart
  label_group = svgizzle.append("svg:g")
    .attr("class", "label_group")
    .attr("transform", "translate(" + (pie_width/2) + "," + (pie_height/2) + ")");

    //lines to connect labels with specific section
    lines = label_group.selectAll("line").data(pie(tenner));

    //set lines in correct location and rotate it at an angle
    lines.enter().append("svg:line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", -80)
      .attr("y2", -90)
      .attr("stroke", "gray")
      .attr("transform", function(d) {
        return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
      });
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

      //value labels! 
    valueLabels.enter().append("svg:text")
      .attr("class", "value")
      .attr("transform", function(d) {
        return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (radius-20+textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (radius+textOffset) + ")";
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
        var percentage = (d["data"]["Num"]/overal_sum)*100;
        return percentage.toFixed(1) + "%";
      });

    //DRAW LABELS WITH ENTITY NAMES
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

      //setting attributes of both nameLabels and valueLabels
    nameLabels.enter().append("svg:text")
      .attr("class", "units")
      .attr("transform", function(d) {
        return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (radius-20+textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (radius+textOffset) + ")";
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

    })
  }

//SP500 graph
//setting scales
var xGDP = d3.scale.linear()
      .domain([1955, 2005])
      .range([20, bbDetail.width+50]);


var yGDP = d3.scale.linear()
      .range([125, 10]);

//setting axes for our line graph
var xAxisGDP = d3.svg.axis()
      .scale(xGDP)
      .orient("bottom")
      .tickSubdivide(4)
      .tickPadding(5)
      .tickFormat(d3.format("d"));

var yAxisGDP = d3.svg.axis()
      .scale(yGDP)
      .orient("left")
      .ticks(5);

//settng area below the line
var grapharea = d3.svg.area()
    .x(function(d) { return xGDP(parseInt(d["Year"])) + 40 })
    .y0(100)
    .y1(function(d) { return yGDP(parseFloat(d["change"])); });

//setting line
var graphline = d3.svg.line()
    .x(function(d) { return xGDP(parseInt(d["Year"])) + 40})
    .y(function(d) { return yGDP(parseFloat(d["change"])); })
    .interpolate("monotone");

  var line1 = d3.svg.line()
      .x(function(d) { return xGDP(d.x); })
      .y(function(d) { return yGDP(d.y); });


function loadSPGraph() {
  //load GDP data for line graph
  d3.csv("../data/GDP.csv", function(error,data){

    //settng correct domain dependent on data
    yGDP.domain(d3.extent(data, function(d) { return parseFloat(d["change"]); }));

    data.forEach(function(d, i){
      datase[i] = {x: parseInt(d["Year"]), y: parseFloat(d["change"])}
    });
    line_dataset = datase;

    //add x axis
    gdp.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(40, 125)")
        .call(xAxisGDP)

    //add y axis
    gdp.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(50, 0)")
        .call(yAxisGDP);

      //add y axis text
    gdp.append("text")
        .attr("transform", "rotate(-90)")
        .attr("class", "label")
        .attr("y", 5)
        .attr("x",0 - 70)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Trillions of dollars");

      //add area
    gdp.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", grapharea);

    //add line
    gdp.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", graphline);

    //include slider capabilties
    selectorHand = gdp.append("g")
      .attr("class", "selectorHand")
      .attr("transform", "translate(60,0)")
      .append("line")
      .attr("y1", 5)
      .attr("y2", 125);
      //.attr("transform", "translate("+(xGDP(yearz))+",0)");

       d3.select("#gdp .selectorHand").call(drag);

  })

}

//map of headquarters. append svg
var map = d3.select("#map").append("svg").attr("id", "mapsyo").attr({
    width: 650,
    height: 410
})
.append("g")
  .attr("transform", "translate(" + margin.left + ",-20)")

//function that loads data and creates our poitns and dots
function makeMap(){
  //create US map
  d3.json("../data/us-named.json", function(error, data) {

      //create US map
      var usMap = topojson.feature(data,data.objects.states).features

      states = map.selectAll(".country").data(usMap).enter().append("path")
          .attr("d", path).attr("class", "country").style("fill", "#585858"); 
      // see also: http://bl.ocks.org/mbostock/4122298

      loadData();
  });
}


//takes in information and redraws visualization
var draw_viz = function(yearz, end){

  timer = setTimeout(function(){
      redraw(yearz, end)
    }, delayz);

  d3.select("#gdp g.selectorHand")
    .attr("transform", "translate("+(xGDP(yearz) + 40)+",0)");

  d3.select(".textbox")
    .html(function() {
        return "<h2><span id='yeartitle'>" + yearz + "</span></h2>";
    })

  d3.select("#revenuefacts")
    .html(function() {
        return "<h2><span id='revenuetitle'>$" + format(toptenrevenue/100) + 
        "B</span></h2>";
    });
}

//starts visualization, makes sure that rectangle/slider moves to right spot
var start = function(){

  var movehand = function(){
    d3.select("#gdp g.selectorHand")
    .transition()
    .duration(600*51 - (yearz-1955)*600)
    .attr("transform", "translate("+590+",0)")
    .ease("linear");
  }

  setTimeout(movehand, 500)

  draw_viz(yearz, 2005); 
}

//show/hide the pie button
d3.select("#piebutton").on("click", function(){

  $('#piecol').toggleClass('col-lg-0 col-lg-2');
  $('#factcol').toggleClass('col-sm-offset-1 col-sm-offset-0');
  //$('#lastcol').toggleClass('col-lg-6 col-lg-4');

  var $pie = $("#pie"); 
  $pie.css("display", $pie.css("display") === 'none' ? '' : 'none');

  $("#yourUlId").toggle();
})

//on click of play button
d3.select("#play").on("click", function(d, i){
  //check if vis is playing
  if(isPlaying == false){
    isPlaying = true;
    //restarts visualization
    if(yearz==2005){
        yearz=1955;
    }
    seventiesPlaying = false;
    rockefella = false;
    //start the visualization!
    start();
    //make the play button a pause button
    this.innerHTML= "<span class='fa-stack'><i class='fa fa-pause fa-stack-1x' ></i></span> Pause"
  }
  else{
    //pause everything! and no longer playing
    isPlaying=false;
    clearTimeout(timer);
    d3.selectAll("path").transition().duration(0);
    d3.select("#gdp g.selectorHand").transition().duration(0);
    //play button takes place of pause button
    this.innerHTML= "<span class='fa-stack'><i class='fa fa-play-circle-o fa-stack-2x' ></i></span> Play"
  }
})

//large redraw function that draws visualization. also recursive
function redraw(i, end) {
  //stop redraw if we are at the end - play button shows again
  if(i == 2005){
    isPlaying = false;
    $("#play")[0].innerHTML= "<span class='fa-stack'><i class='fa fa-play-circle-o fa-stack-2x' ></i></span> Play"
  }

  //intializes variables
  temp_choro = [];
  init_choro = large_dataset.filter( function(d){ 
      return d["Year"] == i.toString();
  });

  //sets selectors so correct circles fade in and fade out
  pre = i - 1;
  name = ".circle_" + i;
  prename = ".circle_"+ pre;

    //recreates the circle by joining new circle data
    map.selectAll("circle")
      .data(init_choro)
      .attr("class", function(d, i){
        indus = d["Industry"].split(' ').join('');
        //sets multiple classes depending on rank and industry
        if(i < 10){
          return "circle_" + d["Year"] + " topTen " + indus;
        }
        else{
        return "circle_" + d["Year"] + " " + indus;
      }
      })
      .attr("id", function(d,i){
        //sets id relating to company
        return d["Company"];
      })
      .attr("cx", function(d){
        //checks for non-US
        if(d["Lon"] == 34.7778702){
          return 1000;
        }
        else{
          //sets circles down
          var screencord = projection([d["Lon"], d["Lat"]]);
          if(screencord!= null){ return screencord[0]; }
        }
      })
      .attr("cy", function(d){
        //checks for non-US
        if(d["Lon"] == -96.2408367){
          return 1000;
        }
        else{
          //sets circles down
          var screencord = projection([d["Lon"], d["Lat"]])
          if(screencord!= null){ return screencord[1]; }
        }

      })
      .attr("fill", function(d, i){
        //fill based off of the visualization that's playing
        if(seventiesPlaying == true){
          if(d["Company"] == "WalMart Stores"){
            return "hotpink";
          }
          else{
            return "#FFFFFF";
          }
        }
        else if(rockefella == true){
          if(d["Company"] == "Amoco" || d["Company"] == "Mobil" || d["Company"] == "Exxon Mobil" || d["Company"] == "ChevronTexaco"
            || d["Company"] == "Atlantic Richfield" || d["Company"] == "Pennzoil"){
            return "orange";
          }
          else{
            return "#FFFFFF"
          }
        }
        else{
          return "#FFFFFF";
        }
      })
      .attr("r", function(d, i){
        //sets size based off of revenue
        min = maxmin[d["Year"]]["min"];
        max = maxmin[d["Year"]]["max"];
          circleScale.domain([min, max]);
          if(rockefella == true){
            //increases size for easier viewing if we are looking at Standard Oil's legacy
            if(d["Company"] == "Amoco" || d["Company"] == "Mobil" || d["Company"] == "Exxon Mobil" || d["Company"] == "ChevronTexaco"
            || d["Company"] == "Atlantic Richfield" || d["Company"] == "Pennzoil"){
              return circleScale(d["Revenue"])*1.5;
            }
            else{
              return circleScale(d["Revenue"]);
            }
          }
          else{
          return circleScale(d["Revenue"])
        }
      })
      .attr("stroke", function(d, i){
        //again, dependent on visualization playing
        if(seventiesPlaying == true){
          if(d["Company"] == "WalMart Stores"){
              return "hotpink";
          }
          else{
            return "#FFFFFF";
          }
        }
        else if(rockefella == true){
          if(d["Company"] == "Amoco" || d["Company"] == "Mobil" || d["Company"] == "Exxon Mobil" || d["Company"] == "ChevronTexaco"
            || d["Company"] == "Atlantic Richfield" || d["Company"] == "Pennzoil"){
            return "orange";
          }
          else{
            return "#FFFFFF"
          }
        }
        else{
        if(i < 10){
          return "hotpink";
        }
        else{
          return "#FFFFFF";
        }
      }
      })
      //standard among all visualizations
      .attr("fill-opacity", .4)
      .attr("stroke-width", 1.5)
      .on('mouseover', tip.show) 
      .on('mouseout', tip.hide);

      //set top 10 as having pink stroke, as long as we aren't playing a visualization
      if(rockefella != true && seventiesPlaying != true){
      d3.selectAll(".topTen")
        .attr("stroke", "hotpink");
      }

  //sets visualizations as false when they reach their end
  if(i==2005 && rockefella == true){
    rockefella = false;
  }
  if(i==2005 && seventiesPlaying == true){
    seventiesPlaying = false;
  }

  //checks to see if the "Locations" button has been clicked
  if(isLoca == false){
    $(name).fadeIn("slow");
  }

        //figures out current top 10
        acurr_10 = {};
        curr_10 = [];
        var prev_year = [];
        var count = 0;
       count = 0;

       //creates dataset that is easy to manipulate and access
       for(var j = 0; j < toptizzles.length; j++){
          if(toptizzles[j]["Year"] == i.toString()){
            curr_10[count] = {Company: toptizzles[j]["Company"], Rank: toptizzles[j]["Rank"], Revenue: toptizzles[j]["Revenue"]};
            count++;
            acurr_10[toptizzles[j]["Company"]] = toptizzles[j]["Rank"];
            if(count >= 10){
              break;
            }
          }
        }

        //calculates topten revenue
      for(var hold = 0; hold<curr_10.length; hold++){
        toptenrevenue += parseInt(curr_10[hold]["Revenue"]);
      }

      //removes any stranding rectangles
      d3.select("#tableplace").selectAll("g").selectAll("rect").remove();

      //readds top 10 data, making new visualizaiton
        graw = d3.select("#tableplace").selectAll("g").data(curr_10)
            .attr("transform", function(d) {
                  return "translate(0, " + (bar_yScale(parseInt(d["Rank"]))-20) +")"; 
            })
            .attr("class", "toptenbar")
            .attr("id", function(d, i){
              comp = d["Company"];
              newstring = comp.split('.').join(' ');
              return newstring;
            })
            .attr("fill", function(d){
              //zebra pattern, again
              if(parseInt(d["Rank"]) % 2 == 1){
                return "#383838"; 
              }
            });

        // same as previously, we append a rect after g with same characteristics
        graw.append("rect")
        .attr("stroke", "#383838")
        .attr("stroke-width",4)
        .attr("width", function() { 
          return bar_width;
        })
        .attr("height", single_bar_height)
        .on("mouseover", function(d){
          highlight(d);
        })
        .on("mouseout", function(d){
          unhighlight(d);
        });

        //sets text of company again on bar
        comp_text = graw.append("text")
                  .attr("y", function(d) { return single_bar_height/2; })
                  .attr("class", "comp_text")
                  .text(function(d) { 
                  if(d["Company"] == "ATT"){
                    d["Company"] = "AT&T";
                    return "AT&TT";
                  }
                else if(d["Company"] == "ATT Technologies"){
                  d["Company"] = "AT&T";
                  return "AT&T";
                }
                else{
                  return d["Company"]; 
                }
              })
            .attr("x", function(d) {
              return 90 - (d["Company"].length)*2;

             })

        //sets rank of company
        graw.append("text")
                  .attr("class", "rank_text")
                  .attr("x", function(d) { return 15; })
                  .attr("y", function(d) { return single_bar_height/2; })
                  .text(function(d) {
                    if(d["Rank"] == 0){
                        return "Rank";
                    } 
                    else{
                      return d["Rank"]; 
                    }
                  })


  //UPDATING PIE CHART
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

    //holder will be array of ranked industries by number
    sum = 0;
    for(var zeb = 0; zeb < 5; zeb++){
      tenner[zeb] = holder[zeb];
      tenner[zeb]["Color"] = color_1(holder[zeb]["Industry"]);
      sum = sum + holder[zeb]["Num"];
    }
    //again, we use tenner to find top 5 industries + other
    tenner[5] = {Industry: "Other", Num: overall_sum - sum, Color: "#A9A9A9"} 
    filteredPieData = pie(tenner);

    //input data again
    paths = gpie.selectAll("path").data(filteredPieData);

    //updating pie chart
    paths.enter().append("svg:path")
      .attr("stroke", "none")
      .attr("stroke-width", 0.5)
      .attr("fill", function(d, i) { return d["data"]["Color"]; })
      .on("mouseover", function(d, i){
        indust = d["data"]["Industry"].split(' ').join('');
        indus = "." + indust;
        console.log(d);
        d3.selectAll(indus)
            .attr("stroke", function(e, g){
              return d["data"]["Color"];
            })
            .attr("r", function(e, g){
              console.log(e);
              return circleScale(e["Revenue"])*3;
            });

        })
      //same hover functionality, dependent on visualization
      .on("mouseout", function(d, i){
        indust = d["data"]["Industry"].split(' ').join('');
        indus = "." + indust
          d3.selectAll(indus)
            .attr("stroke", function(z){
              if(rockefella = true){
                return "#aec7e8";
              }
              else{
                if(z["Rank"] < 10)
                return "hotpink";
              else{
                return "#FFFFFF";
              }
            }
          })
            .attr("r", function(e, g){
              return circleScale(e["Revenue"]);
            });
      })
      .transition()
        .duration(tweenDuration)
        .attrTween("d", pieTween);

paths.attr("fill", function(d, i) { return d["data"]["Color"]; })
      .transition()
        .duration(tweenDuration)
        .attrTween("d", pieTween);

        //remove extra paths
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
      .attr("y1", -80)
      .attr("y2", -90)
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

      //draw values
    valueLabels.enter().append("svg:text")
      .attr("class", "value")
      .attr("transform", function(d) {
        return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (radius-20+textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (radius+textOffset) + ")";
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

    //transition and delete former
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

    //transition and delete former
    nameLabels.transition().duration(tweenDuration).attrTween("transform", textTween);
    nameLabels.exit().remove();


    //CHOROPLETH - initialize states
      for(var stat = 0; stat < 52; stat++){
        st = states[0][stat]["__data__"]["properties"]["code"];
        temp_choro[stat] = {St: st, Val: 0, Rev: 0};
      }

      //set array so that it is easy to draw choropleth 
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

      //set max and min for given year, based off of revenue
      dmax =  d3.max(temp_choro, function(d){return parseInt(d["Rev"])})
      dmin = d3.min(temp_choro, function(d){
        if(d["Val"] > 0) {
          return parseInt(d["Rev"])
        }
        else
        {
          return 10000000000;
        }
      })

      //sets the scale
      choro_color.domain([dmin, dmax]);

  //checks if chorobutton has been pressed. if not, keep states same color
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
        else if(temp_choro[u]["Val"] > 0){
          return choro_color(dmin);
        }
        else{
        return "#585858";
        }
      }
    }
  })
  }

//recursive function - restart as long as we're not over 2005 (the limit)!
if(i < end && isPlaying == true){
  yearz=yearz+1;
  draw_viz(yearz, end);
}
}

//if we click the locations button
d3.select("#locations").on("click", function(){
  //is it set?
  if(isLoca == false){
    isLoca = true; 
    //call the circles on the screen to fade out
    if(name == "notset"){
      $(".circle_1955").fadeOut("fast");
    }
    else{
      $(name).fadeOut("fast");
    }
    $(this).removeClass('btn-primary'); 
    $(this).addClass('btn-default');
  }
  else{
    //call circles to fade in slow
    isLoca = false;
    if(name == "notset"){
      $(".circle_1955").fadeIn("slow");
    }
    else{
      $(name).fadeIn("slow");
    }
    $(this).addClass('btn-primary'); 
    $(this).removeClass('btn-default');
  }
})


//if we click the choropleth button
d3.select("#chorobutton").on("click", function(){
  if(isChoro == false){
    isChoro = true;
    if(yearz==1955){
      //set color based off of 1955
      states.transition().duration(500).style("fill", function(d, i){
        for(var u = 0; u < choroset.length; u++){
            if(choroset[u]["St"] == d["properties"]["code"]){
              if(choroset[u]["Rev"] > 0){
                return choro_color(choroset[u]["Rev"]);
              }
              else if(choroset[u]["Val"] > 0){
                return choro_color(dmin);
              }
              else{
                return "#585858";
              }
            }
          }
        })
    }
    else{
      //set colors based off of other, later years
      states.transition().duration(500).style("fill", function(d, i){
      for(var u = 0; u < temp_choro.length; u++){
              if(temp_choro[u]["St"] == d["properties"]["code"]){
                if(temp_choro[u]["Rev"] > 0){
                  return choro_color(temp_choro[u]["Rev"]);
                }
                else if(temp_choro[u]["Val"] > 0){
                  return choro_color(dmin);
                }
                else{
                  return "#585858";
                }
              }
            }
          })
    }
    $("#legenwaitforit").fadeIn();
      $(this).addClass('btn-primary'); 
      $(this).removeClass('btn-default');
    }
    else{
      //fadeOut the legend, change color to the default
      isChoro = false;
          $("#legenwaitforit").fadeOut();
            states.transition().duration(500).style("fill", function(d, i){
                return "#585858";
          })
      $(this).removeClass('btn-primary'); 
      $(this).addClass('btn-default');
    }
  })
//Swiper 
window.onload = function() {

  //determine which parts of the visualization stay/go during load
  $("#pie").hide();
  $("#mapbuttons").hide();
  $("#catfacts").hide();
  $("#play").hide();
  $("#piebutton").hide();

  //"Next" button - some HTML element with "button-next" class
  $('.arrow-right').click(function(){mySwiper.swipeNext();})
  //"Prev" button - some HTML element with "button-prev" class
  $('.arrow-left').click(function(){mySwiper.swipePrev();})
  $('.exitintro').click(function(){
    $("#guide").fadeOut();
    $("#mapbuttons").fadeIn();
    $("#catfacts").fadeIn();
    $("#play").fadeIn();
    $("#piebutton").fadeIn();
  })

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

//function to move the selectorhand to the correct year
  var move10hand = function(dist, timez){
    d3.select("#gdp g.selectorHand")
    .transition()
    .duration(timez)
    .attr("transform", "translate("+dist+",0)")
    .ease("linear");
  }

//if we click on first slider page
d3.select("#seventiesPlay").on("click", function(d, i){
  //if it's not cilcked yet..
  if(isPlaying == false){
  isPlaying = true;
  seventiesPlaying = true;
  //start visualization
  yearz = savedWalmart;
  //set walmart to pink so it's obvious
  d3.select("#map").selectAll("circle").attr("stroke", "#FFFFFF");
  d3.select("#WalMart Stores").attr("fill", "hotpink").attr("stroke", "hotpink");
  idd = "WalMart Stores";

//move the selectorhand to the right page
setTimeout(move10hand(590, 15*600), 600);
  
  //puts down two orange bars so it's obvious what region we're looking at 
  d3.select(".gdp").append("rect")
    .attr("width", 2)
    .attr("height", 125)
    .attr("transform", function(){
      val = xGDP(1992) + 40;
      return"translate("+val+ ",0)";
    })
    .attr("fill", "orange");

  d3.select(".gdp").append("rect")
    .attr("width", 2)
    .attr("height", 125)
    .attr("transform", function(){
      val = 590;
      return "translate("+val+ ",0)";
    })
    .attr("fill", "orange");

  draw_viz(yearz, 2005);
}
else{
  //pause everything!
  savedWalmart = yearz;
  isPlaying = false;
  clearTimeout(timer);
  d3.selectAll("path").transition().duration(0);
   d3.select("#gdp g.selectorHand").transition().duration(0);

}
})

d3.select("#eightiesPlay").on("click", function(d, i){
  if(isPlaying == false){
  isPlaying = true;
  yearz = savedRockefella;
  rockefella = true;
  //select correct circles and make them a nice orange color!
  d3.select("#map").selectAll("circle").attr("stroke", "#FFFFFF");
  d3.select("#Amoco").attr("fill", "#aec7e8").attr("stroke", "#aec7e8");
  d3.select("#Exxon Mobil").attr("fill", "#aec7e8").attr("stroke", "orange");
  d3.select("#Pennzoil").attr("fill", "#aec7e8").attr("stroke", "orange");
  d3.select("#Mobil").attr("fill", "#aec7e8").attr("stroke", "orange");
  d3.select("#Atlantic Richfield").attr("fill", "#aec7e8").attr("stroke", "orange");
  d3.select("#ChevronTexaco").attr("fill", "#aec7e8").attr("stroke", "orange");
  setTimeout(move10hand(590, 53*600), 250);
  draw_viz(yearz, 2005);
}
else{
  //pause everything!
     isPlaying=false;
     savedRockefella = yearz;
    clearTimeout(timer);
    d3.selectAll("path").transition().duration(0);
    d3.select("#gdp g.selectorHand").transition().duration(0);
}
})

//looking at the page we're on with swiper
function slideSelected() {
  switch (mySwiper.activeIndex) {
    case 0: 
      console.log("first")
    break;
    case 1:
      console.log("second")
    break;
    case 2:
      console.log("third")
    break;
    case 3:
      console.log("fourth")
    break;
    }
  };
}

//highlight both bars and circles of a certain id
var highlight = function(d){
    //console.log(target);
    var idd = d["Company"];
    var id = d["Company"].split('.').join(' ');
    var newid = id.split('&').join(' ');

    $("[id= '"+idd+"']")
      .attr("fill", "deepskyblue")
      .attr("r", 20)
      .d3MouseOver();
}

//unhighlight, so make them smaller
var unhighlight = function(d){

    var id = d["Company"].split('.').join(' ');
    var newid = id.split('&').join(' ');
    $("[id='"+newid+"']")
      .attr("fill", function(){
        if(parseInt(d["Rank"]) % 2 == 1){
          return "#383838"; 
        }
        else{
          return "black";
        }
      })
      .attr("r", function(){
        return circleScale(d["Revenue"]);
      })
      .d3MouseOut();

      //make sure circles' fills are white
      d3.selectAll("circle").attr("fill", "#FFFFFF");
}

//tough jQuery functions written by kat
jQuery.fn.d3MouseOver = function () {
  this.each(function (i, e) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("mouseover", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    e.dispatchEvent(evt);
  });
};

jQuery.fn.d3MouseOut = function () {
  this.each(function (i, e) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("mouseout", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    e.dispatchEvent(evt);
  });
};

//facts on the left side
var textbox = d3.select("#facts").append("g").append("text")
    .attr("class", "textbox")
    .html(function() {
        return "<h2><span id='yeartitle'>" + yearz + 
        "</span></h2>";
    });

// make everything!
makeMap();
loadSPGraph();








