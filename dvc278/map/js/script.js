    // Copyright (c) 2013 Ryan Clark
    // https://gist.github.com/rclark/5779673
  
      L.TopoJSON = L.GeoJSON.extend({
      addData: function(jsonData) {    
        if (jsonData.type === "Topology") {
          for (key in jsonData.objects) {
            geojson = topojson.feature(jsonData, jsonData.objects[key]);
            L.GeoJSON.prototype.addData.call(this, geojson);
          }
        }    
        else {
          L.GeoJSON.prototype.addData.call(this, jsonData);
        }
      }  
    });
  
  	//Set-up pym
	pymChild = new pym.Child();

	//Check whether inline svg is supported
	if(Modernizr.inlinesvg) {	
	d3.select("#graphic").remove();
	dvc = {};
	
	function ready (error, data, config){
	
	if(config.ons.varcolour instanceof Array) {
		dvc.colour = config.ons.varcolour
	} else {
		dvc.colour = eval("colorbrewer." + config.ons.varcolour);
	}
	
	dvc.curr = config.ons.varload;
	a = 0;
	dvc.unittext = config.ons.varunit[a];
	dvc.label = config.ons.varlabel[a];
	dvc.prefix = config.ons.varprefix[a];


	
	data2 = data;
	config2 = config;
		
	if(config.ons.varlabel.length > 1)
		{navigation(config2,data2);}
	else {d3.selectAll("#varsel").attr("class","hidden")};
	selectlist(config2,data2);
	//Create a flat array of all the values of earnings / filter out any non-numbers / sort in ascending order ready to pass to jenks algorithm 
	var values =  data.map(function(d) { return +eval("d." + dvc.curr); }).filter(function(d) {return !isNaN(d)}).sort(d3.ascending);

	// Generate some breaks based on the Jenks algorithm - http://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization
	// Can use custom breaks
	//breaks = ss.jenks(values, 5);
	//breaks = [-6.1,0,5.4,9.1,14,29];
	
	if(config.ons.breaks =="jenks")
		{breaks = ss.jenks(values, 5);}
	else {breaks = config.ons.breaks[a];};

	
	
	
	//Set-up and create an object variable to hold the data for the currently selected variable and the 
	rateById = {};
	areaById = {};
	
	data.forEach(function(d) { rateById[d.AREACD] = +eval("d." + dvc.curr); areaById[d.AREACD] = d.AREANM});
	
		
	var layerx = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',{
	  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB background</a> Contains OS data &copy; Crown copyright 2015'
	});
   
    var map = L.map('map',{maxZoom:10,minZoom:3}),
    
	//Set-up new Topojson layer
	topoLayer = new L.TopoJSON();

	//Set-up colour scale
	color = d3.scale.threshold()
			.domain(breaks.slice(1,5))
			.range(dvc.colour);
			
    //Set initial centre view and zoom layer
    map.setView(eval(config.ons.centre), config.ons.zoom).addLayer(layerx)

	map.on("zoomstart", leaveLayer)
	map.on("zoomend", function(){setTimeout(function(){highlightArea()},50)})
	d3.select(".leaflet-top").style("top","70px");
	createKey(config);

    $.getJSON('data/geog.json').done(addTopoData);

    function addTopoData(topoData){
      topoLayer.addData(topoData);
      topoLayer.eachLayer(handleLayer);
      topoLayer.addTo(map);
	  
	  var xy = d3.select(".leaflet-overlay-pane").selectAll("path");
  
	  xy.on("mouseout",leaveLayer).on("mouseover",enterLayer).on("click",enterLayer);
	  
    }

    function handleLayer(layer){
		
		x = layer.feature.properties.AREACD;

		fillColor = color(rateById[x]);
		
        layer.setStyle({
		  fillColor: fillColor,
          fillOpacity: 0.7,
          color:'#fff',
          weight:0.7,
          opacity:1,
		  className: x
        });
	
    }
	
	function enterLayer(){
		currclass = d3.select(this).attr("class").split(' ')[0];
		highlightArea();
		
	}

    function highlightArea(){
		
		d3.select('#selected').remove();
		var currpath = d3.select("." + currclass).attr("d");
		
		d3.select(".leaflet-overlay-pane").select("svg").append("path")
				.attr("d",currpath)
				.attr("id","selected")
				.attr("class", "arcSelection")
				.attr("pointer-events", "none")
				.attr("fill", "none")
				.attr("stroke", "#b4005a")
				.attr("stroke-width", "2");
		
	
		/* Display name of area*/
		d3.select("#areanm").text(areaById[currclass]);
		d3.select("#areainfo").html(function(d,i){if (!isNaN(rateById[currclass]))  {return dvc.prefix + rateById[currclass] + "<span>" + dvc.unittext + "</span>"} else {return "Data unavailable"}});


    }

    function leaveLayer(){

		d3.select('#selected').remove();
		d3.select("#areanm").text("");
		d3.select("#areainfo").text("");
    }
	
	
	function createKey(config){

		var svgkey = d3.select("#keydiv")
			.append("svg")
			.attr("id", "key")
		    .attr("height", 400);
		
		newbreaks = breaks;
		
		var grey = d3.select("#keydiv").append("div").attr("class", "grey")
		
		grey.append("ul").append("li").append("b");
		grey.select("ul").select("li").append("label").text("data unavailable");
	
		var color = d3.scale.threshold()
		   .domain(newbreaks)
		   .range(dvc.colour);

		y = d3.scale.linear()
		    .domain([newbreaks[0], breaks[5]]) /*range for data*/
		    .range([350, 0]); /*range for pixels*/

		keywidth = $("#keydiv").width();	
		
		x = d3.scale.linear()
		    .domain([newbreaks[0], breaks[5]]) /*range for data*/
		    .range([0,keywidth-50]); /*range for pixels*/

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")
    		.tickSize(15)
		    .tickValues(color.domain())
			.tickFormat(d3.format(".2s"));

		
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
    		.tickSize(15)
		    .tickValues(color.domain())
			.tickFormat(d3.format(".2s"));

		var g = svgkey.append("g").attr("id","vert").attr("class","hidden-xs")
			.attr("transform", "translate(60,40)");
		
		
		g.selectAll("rect")
			.data(color.range().map(function(d, i) {
			  return {
				y0: i ? y(color.domain()[i]) : y.range()[0],
				y1: i < color.domain().length ? y(color.domain()[i+1]) : y.range()[1],
				z: d
			  };
			}))
			.enter().append("rect")
			.attr("width", 8)
			.attr("y", function(d) {return d.y1; })
			.attr("height", function(d) {return d.y0 - d.y1; })
			.style("opacity",0.8)
			.style("fill", function(d) {return d.z; });
		
		g.call(yAxis).append("text");
		
		g.append("line")
			.attr("x1","8")
			.attr("x2","65")
			.attr("y1",function(d,i){return y(config.ons.average[a])})
			.attr("y2",function(d,i){return y(config.ons.average[a])})
			.attr("stroke","blue")
			.attr("stoke-width",1);	
		
		g.append("text")
			.attr("x","10")
			.attr("y",function(d,i){return y(config.ons.average[a]) - 4})
			.attr("class","average")
			.text(config.ons.averagelabel);
			
		g.append("text")
			.attr("x","10")
			.attr("y",function(d,i){return y(config.ons.average[a]) + 11})
			.attr("class","average")
			.text(config.ons.average[a]);		
		
		//add units
		
		g.append("text").attr("id","keyunit").text(dvc.unittext).attr("transform","translate(-40,-20)");
		
		
		//horizontal key		
			
		var g2 = svgkey.append("g").attr("id","horiz").attr("class","visible-xs")
			.attr("transform", "translate(25,5)");
		
		keyhor = d3.select("#horiz");
		
		g2.selectAll("rect")
			.data(color.range().map(function(d, i) {
			  return {
				x0: i ? x(color.domain()[i]) : x.range()[0],
				x1: i < color.domain().length ? x(color.domain()[i+1]) : x.range()[1],
				z: d
			  };
			}))
		  .enter().append("rect")
			.attr("height", 8)
			.attr("x", function(d) { return d.x0; })
			.attr("width", function(d) { return d.x1 - d.x0; })
			.style("opacity",0.8)
			.style("fill", function(d) { return d.z; });

			
		keyhor.selectAll("rect")
			.data(color.range().map(function(d, i) {
			  return {
				x0: i ? x(color.domain()[i]) : x.range()[0],
				x1: i < color.domain().length ? x(color.domain()[i+1]) : x.range()[1],
				z: d
			  };
			}))
			.attr("x", function(d) { return d.x0; })
			.attr("width", function(d) { return d.x1 - d.x0; })
			.style("fill", function(d) { return d.z; });
		
		keyhor.call(xAxis).append("text")
			.attr("id", "caption")
			.attr("x", -63)
			.attr("y", -20)
			.text("");

		keyhor.append("rect")
			.attr("id","keybar")
			.attr("width",8)
			.attr("height",0)
			.attr("transform","translate(15,0)")
			.style("fill", "#ccc")
			.attr("x",x(0));	
			
			

		d3.select("#horiz").selectAll("text").attr("transform",function(d,i){if(i % 2){return "translate(0,10)"}});			
		
		g2.append("text").attr("id","keyunit").text(dvc.unittext).attr("transform","translate(0,-10)");
			
		}
		
		
		
		function navigation(data, datacsv){
			
			$("#navigation").show();

		//Build pills
		
			dvc.varname = data.ons.varname;
			dvc.varunit = data.ons.varunit;
			
			a = dvc.varname.indexOf(dvc.curr);
			dvc.unittext = dvc.varunit[a];
			dvc.label = data.ons.varlabel[a];
			dvc.prefix = data.ons.varprefix[a];
	
			var pills = d3.select("#pills")
					.append("ul")
					.attr("class","nav navbar nav-pills navbar-inverse nav-justified")
					
		
			pills.selectAll("li")
				.data(data.ons.varlabel)
				.enter()
				.append("li")
				.attr("id", function(d,i){return data.ons.varname[i]})
				.append("a")
				.attr("href","#")
				.attr("data-nm", function(d,i){return data.ons.varname[i]})
				.attr("data-toggle","pill")
				.text(function(d,i){return d;})
				.on("click", function(d,i){
					dvc.curr = d3.select(this).attr("data-nm");
					a = dvc.varname.indexOf(dvc.curr);
					updateMap(data2,config2);
					//updateHash(dvc.curr);
					dvc.unittext = dvc.varunit[a];
					dvc.label = data.ons.varlabel[a];
					d3.select("#keyunit").text(dvc.unittext);
				});
				
		
			d3.select("#" + dvc.curr).attr("class","active");
			
			 var highest = null;

			   $(".nav-pills a").each(function(){  //find the height of your highest link
				   var h = $(this).height();
				   if(h > highest){
					  highest = $(this).height();  
				   }    
				});
			
			   $(".nav-pills a").height(highest);  //set all your links to that height.
			
			d3.select("#varsel").html(dvc.label + " <span class='caret'></span>");
					
			dropnext = d3.select("#menu").append("ul")
					.attr("class","dropdown-menu")
					.attr("role","menu");
					
			dropnext.selectAll("li")
					.data(data.ons.varlabel)
					.enter()
					.append("li")
					.attr("id", function(d,i){return "drop" + data.ons.varname[i]})
					.append("a")
					.attr("href","#")
					.attr("data-nm", function(d,i){return data.ons.varname[i]})
					.text(function(d,i){return d;})
					.on("click", function(d,i){
						dvc.curr = d3.select(this).attr("data-nm");
						a = dvc.varname.indexOf(dvc.curr);
						updateMap(data2,config2);
						dvc.unittext = dvc.varunit[a];
						d3.select("#varsel").html(data.ons.varlabel[i] + " <span class='caret'></span>");
						dvc.label = data.ons.varlabel[a];
						d3.select("#keyunit").text(dvc.unittext);
						dropnext.selectAll("li").attr("class","")
						d3.select("#drop" + dvc.curr).attr("class","active");
					});
			
			d3.select("#drop" + dvc.curr).attr("class","active");
			
	}
	
	function selectlist(data, datacsv) {
	
			var areacodes =  datacsv.map(function(d) { return d.AREACD; });
			var areanames =  datacsv.map(function(d) { return d.AREANM; });
			var menuarea = d3.zip(areanames,areacodes).sort(function(a, b){ return d3.ascending(a[0], b[0]); });
			
			// Build option menu for occupations
			var optns = d3.select("#chosensel").append("div").attr("id","sel").append("select")
				.attr("id","occselect")
				.attr("style","width:98%")
				.attr("class","chosen-select");
			
			
			optns.append("option")
				.attr("value","first")
				.text("");
			
			optns.selectAll("p").data(menuarea).enter().append("option")
				.attr("value", function(d){ return d[1]}) 
				.text(function(d){ return d[0]});
			
			
			$('#occselect').chosen({width: "98%", allow_single_deselect:true}).on('change',function(evt,params){
		
								if(typeof params != 'undefined') {
									
										
										/* identify the data-nm attribute of the polygon you've hovered over */
										currclass=params.selected;
										leaveLayer();
										highlightArea();
										
										
										d3.select(".leaflet-overlay-pane").selectAll("path").attr("pointer-events","none");

								}
								else {
										// Remove any selections
										myId=null;
										leaveLayer();
										d3.select(".leaflet-overlay-pane").selectAll("path").attr("pointer-events","all");
										
								}
								
			});
	
	};
		
	function updateMap(data, config){
		var values =  data.map(function(d) { return +eval("d." + dvc.curr); }).filter(function(d) {return !isNaN(d)}).sort(d3.ascending);

		// Generate some breaks based on the Jenks algorithm - http://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization
		if(config.ons.breaks =="jenks")
			{breaks = ss.jenks(values, 5);}
		else {breaks = config.ons.breaks[a];};

		// Set up a colour scaling variable
		// This time using the jenks breaks we've defined		
		color = d3.scale.threshold()
			.domain(breaks.slice(1,5))
			.range(dvc.colour);
		
	
		d3.select("#keydiv").select("svg").remove();
		
		createKey(config);
	
	
		// Create an object to give yourself a pair of values for the parlicon code and data value
	
		rateById = {};
		data.forEach(function(d) { rateById[d.AREACD] = +eval("d." + dvc.curr); });

		topoLayer.eachLayer(handleLayer);
		var xy = d3.select(".leaflet-overlay-pane").selectAll("path");
		
		xy.on("mouseout",leaveLayer).on("mouseover",enterLayer).on("click",enterLayer);
		
	}	

		

    }; // End function ready


	//Load data and config file
	queue()
		.defer(d3.csv, "data/data.csv")
		.defer(d3.json, "data/config.json")
		.await(ready);
		
		
	
	} else {
		d3.select("#graphic").html("Sorry your browser does not support this interactive graphic");
		d3.select("#graphic")
			.append("img")
			.attr("src","./images/altlife.png")
			.attr("width","100%")
			.attr("height","100%");
		
		pymChild.sendHeight();
	}

