var dvc = {};


		if (Modernizr.inlinesvg){ 

		d3.select("#graphic").remove();
		pymChild = new pym.Child();
		
		//globals
		var dvc ={};//global namespace
		dvc.chartWidth=450;
		dvc.chartHeight=400;
		dvc.xPadding=205;
		dvc.yPadding=50;
		dvc.timeIndex=0;
		dvc.gapRatio=0.2;//gap ratio beteen bars
		dvc.index;
		dvc.bMark=false;
		dvc.bAnimate=false;
		dvc.bZoom=false;
		
        //init function
        $(document).ready(function(){
			//load some data - config file
			d3.json("data/config.json", function(json)	{
				dvc.chartConfig=json;
				
				var pills = d3.select("#pills")
					.append("ul")
					.attr("class","nav nav-pills nav-justified");
					
		
				pills.selectAll("li")
					.data(dvc.chartConfig.vars)
					.enter()
					.append("li")
					.attr("class", function(d,i){if(i==3){return "active"}})
					.append("a")
					.attr("href","#")
					.attr("data-nm", function(d,i){return dvc.chartConfig.filenames[i]})
					.attr("data-toggle","pill")
					.text(function(d,i){return d;})
					.on("click", killChart);
			
							var drop = d3.select("#menu")
					.append("ul")
					.attr("class","nav navbar-nav navbar-right")
					.append("li")
					.attr("class","dropdown");
					
			drop.append("a")
					.attr("href","#")
					.attr("class","dropdown-toggle")
					.attr("data-toggle", "dropdown")
					.text("Select earnings type")
					.append("span")
					.attr("class","caret");
					
			dropnext = drop.append("ul")
					.attr("class","dropdown-menu")
					.attr("role","menu");
					
			dropnext.selectAll("li")
					.data(dvc.chartConfig.vars)
					.enter()
					.append("li")
					//.attr("class", function(d,i){if(i==0){return "active"}})
					.append("a")
					.attr("href","#")
					.attr("data-nm", function(d,i){return dvc.chartConfig.filenames[i]})
					//.attr("data-toggle","pill")
					.text(function(d,i){return d;})
					.on("click", killChart);
				
				dvc.sel = "fulltime.json";
				loadchartData();
			});
		})
		
		
		// to load json data driving the chart	
		function loadchartData()
		{
		
		
		//var filename = selector.options[selector.selectedIndex].id;
	
		var filepth = 'data/' + dvc.sel;
		
		d3.json(filepth, function(json)	{
				dvc.chartData=json;
				makeChart();
		});
		} //end loadchartData
	
		
		
		
		//killChart function - remove everything from chart space including controls
		function killChart()
		{
		dvc.sel = d3.select(this).attr("data-nm");		

		//console.log(meplease);
		d3.select("#zoombutt").remove();
		d3.select("#markText").remove();
		d3.select("#myAxes").remove();	
		d3.select("#grpBars").remove();	
		d3.select("#txtTime").remove();		
		d3.select("#chartUnits").remove();		
		d3.select("#note").select("p").remove();		
		d3.select("#meanLine").remove();		
		d3.select(".credit").remove();	
		d3.select("#aniControls").remove();		
		
		dvc.bMark=false;	
		dvc.bZoom=false;	
			
		loadchartData();
		
		
		}//end killChart
	
		
		//make a chart function
		
		function makeChart()
		{
			//LET'S FIND OUT MORE ABOUT THE DATA
			//find length of series
			dvc.recordLength=dvc.chartData.dataValues.length;//number of records (bars that will be created)
			dvc.index=d3.range(dvc.recordLength);//the number of records as a d3.range object
			dvc.timeLength=dvc.chartData.dataValues[0].length;//the number of elements in the time series

			
			//find true minValue
			dvc.minTrueValue = d3.min(dvc.chartData.dataValues, function(array) {
  				return d3.min(array);
			});
			
			///find  true max values
			dvc.maxTrueValue = d3.max(dvc.chartData.dataValues, function(array) {
  				return d3.max(array);
			});
			
			
			dvc.minValue=dvc.chartData.minValue;
			
			dvc.maxValue=dvc.chartData.maxValue;
			
			//create x axis scale
			
			var domainZoom = [dvc.minTrueValue-10,dvc.maxTrueValue+10];
			
			dvc.xScale=d3.scale.linear()
				.domain([Math.min(0,dvc.minValue),dvc.maxValue])
				.range([0,dvc.chartWidth])
				.nice();
				
			
			dvc.xScaleZoom=d3.scale.linear()
				.domain(domainZoom)
				.range([0,dvc.chartWidth])
				.nice();
				
			//create ordinal scale for y axis
			dvc.yScale = d3.scale.ordinal()
				.domain(dvc.chartData.dataValues)
				.rangeRoundBands([0, dvc.chartHeight], dvc.gapRatio);
				
			//for some reason, yScale.rangeBand is not reurning the right cellHeight so we manually calc here...	
			dvc.cellHeight=(1-dvc.gapRatio)*dvc.chartHeight/dvc.chartData.dataValues.length;
			
			//set up svg and append containers for chart and axes
			d3.select("#mainChart")
				.attr("viewBox", "0 0 655 500")
                .attr("preserveAspectRatio","xMidYMid meet")
				.append("g")
				.attr("id","myAxes");
			
			//create basic graph
			d3.select("#mainChart")
				.append("g")
				.attr("id","grpBars")
				.attr("transform", "translate(" + dvc.xPadding + "," +dvc.yPadding + ")");

			d3.select("#mainChart")
				.append("g")
				.attr("id","meanLine")
				.attr("transform", "translate(" + dvc.xPadding + "," +dvc.yPadding + ")");
				
			//create main axis
			dvc.xAxis=d3.svg.axis()
					.scale(dvc.xScale)
					.orient("bottom")
					.ticks(8);
					
			d3.select("#myAxes").append("g")
				.attr("class","axis")
				.attr("id","xAxis")
				.attr("transform","translate("+dvc.xPadding+","+(dvc.yPadding+dvc.chartHeight+10)+")")
				.call(dvc.xAxis);
				
				//create secondary axis
			dvc.xGrid=d3.svg.axis()
					.scale(dvc.xScale)
					.orient("bottom")
					.ticks(8)
					.tickSize(-(dvc.chartHeight+10));
			
			d3.select("#myAxes").append("g")
				.attr("class","grid")
				.attr("transform","translate("+dvc.xPadding+","+(dvc.yPadding+dvc.chartHeight+10)+")")
				.call(dvc.xGrid);
				
				var bar = d3.select("#grpBars").selectAll(".bar")
					.data(dvc.chartData.dataValues)
					.enter().append("g")
					.attr("class", "bar")
					.attr("transform", function(d, i) { return "translate(0," + dvc.yScale(i) + ")"; });
					 
				bar.append("rect")
					.attr("class","chartBars")
					.attr("height", dvc.cellHeight)
					.attr("x", function(d) { 
						return dvc.xScale(Math.min(0, d[dvc.timeIndex]));
					})
					.attr("width", function(d)	{
						return Math.abs(dvc.xScale(d[dvc.timeIndex]) - dvc.xScale(0));	
					});
 
				 //append some text to bar
				bar.append("text")
					.attr("x", function(d) {
						return dvc.xScale(0)-5;
					})
					.attr("class","barText")
					.attr("y", dvc.yScale.rangeBand() / 2)
					.attr("dy", ".35em")
					.text(function(d, i) { 
					//what text do you want on the label?
					return dvc.chartData.catLabels[i]; //we'll have the names from catLabels please
					});
					
				//add secondary bar for time series comparison...
				bar.append("rect")
					.attr("class","barMarker")
					.attr("x",0)
					.attr("y",function (d,i)	{
						return dvc.cellHeight/2;
					})
					.attr("width",10)
					.attr("height",function (d,i)	{
						return 0;//dvc.cellHeight/2;
					});

					
				//add interaction bars...
				bar.append("rect")
					.attr("class","intBar")
					.attr("data-nm", function(d,i)	{
						return dvc.chartData.catLabels[i];
					})
					.attr("height",dvc.chartHeight/dvc.chartData.dataValues.length)
					.attr("x",0)
					.attr("width",dvc.chartWidth)
					.on("mouseover",function(d)	{
						d3.select(this).attr("class","intBarActive");
						//var objName = d3.select(this).attr("data-nm");
					})
					.on("mouseout",function(d)	{
						d3.select(this).attr("class","intBar");
					})
					.on("click",function(d)	{
						var bar=$(this).siblings()[0];
						var txt=$(this).siblings()[1];
						var status=d3.select(bar).attr("class");
						if (status=="chartBars")
						{
							d3.select(bar).attr("class","chartBarSel");
							d3.select(txt).attr("class","selText");
						}	else
						{
							d3.select(bar).attr("class","chartBars");
							d3.select(txt).attr("class","barText");
						}	
					})

			//add a mean line
			var meanl=d3.select("#meanLine").selectAll(".mean")
				.data(dvc.chartData.meanValues)
				.enter()
				.append("g")
				.attr("class","mean");
				
				
				meanl.append("rect")
				.attr("class","meanLine")
				.attr("width",1)
				.attr("height", dvc.chartHeight+9)
				.attr("y",0)
				.attr("x", function(d)	{
						return Math.abs(dvc.xScale(d[dvc.timeIndex]) - dvc.xScale(0));	
				});
				
				meanl.append("text")
				.text("UK")
				.attr("class","meanLine")
				.attr("y", -10)
				.attr("x", function(d)	{
						return Math.abs(dvc.xScale(d[dvc.timeIndex]) - dvc.xScale(0)-12);	
				});
			
					
					
					
					
		
	/*	var bar = d3.select("#grpBars").selectAll(".bar")
					.data(dvc.chartData.dataValues)
					.enter().append("g")
					.attr("class", "bar")
					.attr("transform", function(d, i) { return "translate(0," + dvc.yScale(i) + ")"; });
					 
				bar.append("rect")
					.attr("class","chartBars")
					.attr("height", dvc.cellHeight)
					.attr("x", function(d) { 
						return dvc.xScale(Math.min(0, d[dvc.timeIndex]));
					})
					.attr("width", function(d)	{
						return Math.abs(dvc.xScale(d[dvc.timeIndex]) - dvc.xScale(0));	
					});
					*/
						
			
				
			//add the time display
			d3.select("svg").append("text")
				.text(dvc.chartData.timeLabels[dvc.timeIndex])
				.attr("id","txtTime")
				.attr("x",dvc.xPadding+dvc.chartWidth)
				.attr("y",dvc.yPadding+dvc.chartHeight-100)
				.attr("pointer-events","none");
			
			//having sized and position the x for the bars, we now need to sort them into the default starting year
			dvc.index.sort(function(b, a) {
				return dvc.chartData.dataValues[a][dvc.timeIndex] - dvc.chartData.dataValues[b][dvc.timeIndex];
			})		
			dvc.yScale.domain(dvc.index);
			bar.attr("transform", function(d, i) {
					return "translate(0," + dvc.yScale(i) + ")";
			});
			

			
			
			//create and set titles and footnotes
			
				
			d3.select("svg").append("text")
				.attr("id","chartUnits")
				.attr("x",10)
				.attr("y",dvc.yPadding-20)
				.text(dvc.chartData.units);
			
						
			d3.select("#note")
				.attr("width",100)
				.append("p")
				.html(dvc.chartData.footnote);
				
			//create animation controls if needed
			if (dvc.timeLength>1)
			{
				//create the controls
			var play = d3.select("#wrapper").append("div")
				.attr("id","aniControls")
				.append("button")
				.attr("id","btnPlay")
				.attr("class","btn btn-primary");
				
			play.append("span")
				.attr("class","glyphicon glyphicon-play")
				.attr("aria-hidden","true");
				
			//play.text(" play");
				
				
				d3.select("#aniControls")
				.append("div")
				.attr("id","timeSlider");
	
			var mark = d3.select("#aniControls")
				.append("button")
				.attr("id","btnMark")
				.attr("class","btn btn-primary");
			
			mark.append("span")
				.attr("class","glyphicon glyphicon-pushpin")
				.attr("aria-hidden","true");
			
			//mark.text("mark");
				
				d3.select("svg")
				.append("text")
				.attr("id","markText")
				.attr("x",dvc.xPadding+dvc.chartWidth-172)
				.attr("y",dvc.yPadding+dvc.chartHeight-80)
				.attr("pointer-events","none")
				.text(" ");
				
		
				$("#btnPlay").click(function() { 
					aniPlay();
				});
				

		
				$('#timeSlider').slider({
					min: 0,
					max: dvc.timeLength-1,
					step: 1,
					value: dvc.timeIndex,
					slide: function(event, ui)
					{	
						dvc.timeIndex = ui.value;
						updateChart();
					}
				});	
		
				$("#btnMark").click(function() { 
					markBars();
				});
				
				
				d3.select("#mainChart")
					.append("svg")
					.attr('id', "zoombutt")
					.append("image")
					.attr("xlink:href", "images/zoomin.png")
					.attr("id", "in")
					.attr("width", "50px")
					.attr("height", "50px")
					.attr("x", "593px")
					.attr("y", "403px")
					.style("opacity",1);
				
				d3.select("#zoombutt")
					.append("image")
					.attr("xlink:href", "images/zoomout.png")
					.attr("id", "out")
					.attr("width", "50px")
					.attr("height", "50px")
					.attr("x", "593px")
					.attr("y", "403px")
					.style("opacity",0);
							
				$("#zoombutt").click(function() { 
					chartZoom();
				});
				
				
			}	
			
					
			if (pymChild) {
				pymChild.sendHeight();
			}
			
		}//end of makeChart
		
		function markBars()
		{		
			//need to set some text to explain what the marks mean...
			if (dvc.bMark)
			{
				//reset
				d3.select("#grpBars").selectAll("rect.barMarker")
					.transition()
					.duration(500)
					.attr("height",function (d,i)	{
						return 0;;
					});
				d3.select("#grpBars").selectAll(".chartBars,.chartBarSel")
					.transition()
					.delay(100)
					.duration(500)
					.attr("height",function (d,i)	{
						return dvc.cellHeight;
					})
					.attr("width",  function(d){	
									if(dvc.bZoom==true){
										return Math.abs(dvc.xScaleZoom(d[dvc.timeIndex]));
									} else {
										return Math.abs(dvc.xScale(d[dvc.timeIndex]));
									}
					});
				d3.select("#btnMark").select("span").attr("class","glyphicon glyphicon-pushpin");
				dvc.bMark=false;
				d3.select("#markText").text("");
				dvc.marked=dvc.timeIndex;
				
			}	else
			{
				//set marker
				d3.select("#grpBars").selectAll("rect.barMarker")
					//.attr("width", function(d)	{
					//	return Math.abs(dvc.xScale(d[dvc.timeIndex]) - dvc.xScale(0));	
					//})
					.attr("width", function(d) 	{	if(dvc.bZoom){
														return Math.abs(dvc.xScaleZoom(d[dvc.timeIndex]));
													} else {
														return Math.abs(dvc.xScale(d[dvc.timeIndex]));
													}
					})
					.transition()
					.duration(500)
					.attr("height",function (d,i)	{
						return dvc.cellHeight/2;
					});
					
					
					
				d3.select("#grpBars").selectAll(".chartBars,.chartBarSel")
					.transition()
					.duration(500)
					.attr("height",function (d,i)	{
						return dvc.cellHeight/2;
					})
					
					
					
					
				
				d3.select("#btnMark").select("span").attr("class","glyphicon glyphicon-remove");
				dvc.bMark=true;
				d3.select("#markText").text("pale blue bars show "+dvc.chartData.timeLabels[dvc.timeIndex]);
				dvc.marked=dvc.timeIndex;
			}
		}
		
		
			function chartZoom(){
			
			if(dvc.bZoom==true){
						
						
						
						dvc.bZoom=false;
						d3.select("#in").transition()
										.duration(1000)
										.style("opacity",0)
										
						d3.select("#in").transition()
										.delay(2000)
										.duration(1000)
										.style("opacity",1)
										
						d3.select("#out").transition()
										.duration(1000)
										.style("opacity",0)
										
						d3.select("#out").transition()
										.delay(2000)
										.duration(1000)
										.style("opacity",0)
						
						
						dvc.xAxis=d3.svg.axis()
										.scale(dvc.xScale)
										.orient("bottom")
										.ticks(8);
					
						
						d3.select("#xAxis")	
										.transition()
										.delay(100)
										.duration(4000)
										.call(dvc.xAxis)
						
						dvc.xGrid=d3.svg.axis()
										.scale(dvc.xScale)
										.orient("bottom")
										.ticks(8)
										.tickSize(-(dvc.chartHeight+10));
													
						d3.select(".grid")	
										.transition()
										.delay(100)
										.duration(4000)
										.call(dvc.xGrid)
						
						//var barId = dvc.chartData.topic[dvc.timeIndex];
						
						d3.selectAll(".chartBars, .chartBarSel")
										.transition()
										.delay(100)
										.duration(4000)
										.attr("width", function(d)	{
											if(dvc.bMark==true){
													return Math.abs(dvc.xScale(d[dvc.timeIndex]));
											} else {
													return Math.abs(dvc.xScale(d[dvc.timeIndex]));
											}
										})
										.attr("height", function(d){ if(dvc.bMark==true){
																		return dvc.cellHeight/2;
																	} else {
																		return dvc.cellHeight;
																	}
															
															});
						
						
						var meanl = d3.select("#meanLine").selectAll(".mean");			
						meanl.selectAll("rect")
							.transition()
							.duration(4000)
							.attr("x", function(d)	{
									return Math.abs(dvc.xScale(d[dvc.timeIndex]) - dvc.xScale(0));	
						});
							
						meanl.selectAll("text")
							.transition()
							.duration(4000)
							.attr("x", function(d)	{
									return Math.abs(dvc.xScale(d[dvc.timeIndex]) - dvc.xScale(0) - 12);	
						});
						

						
						
						d3.select("#grpBars").selectAll("rect.barMarker")
										/*.attr("x", 0)*/
										.transition()
										.delay(100)
										.duration(4000)
										.attr("width", function(d)	{	if(dvc.bMark==true){
																			return Math.abs(dvc.xScale(d[dvc.marked]));
																		} else {
																			return 0;
																		}
																	})
										.attr("height",function (d,i){	if(dvc.bMark==true){
																			return dvc.cellHeight/2;
																		} else {
																			return 0;
																		}
																	});
				
				
				$("#btnZoom").button( "option", "label", "Zoom in" );
				$("#btnZoom").button( "option", "icons", {primary:'ui-icon-pin-s'} );
				
				
			} else {	dvc.bZoom=true;
						d3.select("#in").transition()
										.duration(1000)
										.style("opacity",0)
										
						d3.select("#in").transition()
										.delay(2000)
										.duration(1000)
										.style("opacity",0)
										
						d3.select("#out").transition()
										.duration(1000)
										.style("opacity",0)
									
						d3.select("#out").transition()
										.delay(2000)
										.duration(1000)
										.style("opacity",1)
			
						dvc.xAxisZoom=d3.svg.axis()
										.scale(dvc.xScaleZoom)
										.orient("bottom")
										.ticks(8);
					
						
						d3.select("#xAxis")	
										.transition()
										.delay(100)
										.duration(4000)
										.call(dvc.xAxisZoom)
						
						dvc.xGridZoom=d3.svg.axis()
										.scale(dvc.xScaleZoom)
										.orient("bottom")
										.ticks(8)
										.tickSize(-(dvc.chartHeight+10));
													
						d3.select(".grid")	
										.transition()
										.delay(100)
										.duration(4000)
										.call(dvc.xGridZoom)
						
						//var barId = dvc.chartData.topic[dvc.timeIndex];
						
						d3.selectAll(".chartBars, .chartBarSel")
										.transition()
										.delay(100)
										.duration(4000)
										.attr("width", function(d)	{ 	if (dvc.bMark==true){ 
																				return Math.abs(dvc.xScaleZoom(d[dvc.timeIndex]));
																		} else {
																				return Math.abs(dvc.xScaleZoom(d[dvc.timeIndex]));
																		}
										})
										.attr("height", function(d) { 	if(dvc.bMark==true){
																				return dvc.cellHeight/2;
																		} else {
																				return dvc.cellHeight;
																		}
											
																	});
										
							d3.select("#grpBars").selectAll("rect.barMarker")
										.transition()
										.delay(100)
										.duration(4000)
										.attr("width", function(d)	{	if(dvc.bMark==true){
																			return Math.abs(dvc.xScaleZoom(d[dvc.marked]));
																		} else {
																			return 0;
																		}
																	})
										/*.attr("x", 0)*/
										.attr("height", function (d,i){ 	if(dvc.bMark==true){
																			return dvc.cellHeight/2; 
																		} else {
																			return 0;
																		}
										});
				
									
						
						
//						d3.select("#meanLine")	
//										.transition()
//										.delay(100)
//										.duration(4000)
//										.attr("x",function (d){	if(dvc.bMark==true){
//																		return dvc.xScaleZoom(d3.round(dvc.chartData.meanValues[1],1).toFixed(1))
//																	} else {
//																		return dvc.xScaleZoom(d3.round(dvc.chartData.meanValues[dvc.timeIndex],1).toFixed(1))
//																	}
//										}
//											 );
						var meanl = d3.select("#meanLine").selectAll(".mean");			
						meanl.selectAll("rect")
							.transition()
							.duration(4000)
							.attr("x", function(d)	{
									return Math.abs(dvc.xScaleZoom(d[dvc.timeIndex]) - dvc.xScale(0));	
						});
							
						meanl.selectAll("text")
							.transition()
							.duration(4000)
							.attr("x", function(d)	{
									return Math.abs(dvc.xScaleZoom(d[dvc.timeIndex]) - dvc.xScale(0) - 12);	
						});
						
						d3.select("#txtMean")	
										.transition()
										.delay(100)
										.duration(4000)
										.attr("x",dvc.xScaleZoom(/*d3.round(*/dvc.chartData.meanValues[dvc.timeIndex]/*,1)*/)-20);
										
						d3.select("#txtMean2")	
										.transition()
										.delay(100)
										.duration(4000)
										.attr("x",dvc.xScaleZoom(/*d3.round(*/dvc.chartData.meanValues[dvc.timeIndex]/*,1)*/));
				
				//$("#btnZoom").button( "option", "label", "Zoom out" );
				//$("#btnZoom").button( "option", "icons", {primary:'ui-icon-pin-s'} );
				
			}
			console.log("mark: "+ dvc.bMark+ "         zoom: "+ dvc.bZoom);	
			
		};
		
		
		function aniPlay()
		{
			if (dvc.bAnimate)
			{
				//pause the animation
				dvc.bAnimate=false;
			
				clearInterval(dvc.theInterval);
			}	else
			{
				//play animation
				dvc.bAnimate=true;
				
				d3.select("#btnPlay").select("span").attr("class","glyphicon glyphicon-pause");

				dvc.theInterval=setInterval(function() {
					
					if (dvc.timeIndex<dvc.timeLength-1)	{
			 			dvc.timeIndex++;
						updateChart();	
					} else {
						clearInterval(dvc.theInterval);
						dvc.bAnimate=false;
				d3.select("#btnPlay").select("span").attr("class","glyphicon glyphicon-play");
					}
					
				},2000);
			}
		}
		
		function updateChart()
		{
			//select the bar groups
			var bar = d3.select("#grpBars").selectAll(".bar")
			var meanl = d3.select("#meanLine").selectAll(".mean")
			
			//sort the data
			dvc.index.sort(function(b, a) {
				return dvc.chartData.dataValues[a][dvc.timeIndex] - dvc.chartData.dataValues[b][dvc.timeIndex];
			})		
			
			//then apply it to the yscale
			dvc.yScale.domain(dvc.index);
			
			//select bars and apply transitions to width and x
			bar.selectAll(".chartBars, .chartBarSel")
				.transition()
				.duration(300)
				.attr("width", function(d)	{if(dvc.bZoom==true){
													return Math.abs(dvc.xScaleZoom(d[dvc.timeIndex]) );	
											} 
											else {
													return Math.abs(dvc.xScale(d[dvc.timeIndex]) );	
											}
				})
				.attr("x", function(d) { 
						return dvc.xScale(Math.min(0, d[dvc.timeIndex]));
			});
			
			meanl.selectAll("rect")
				.transition()
				.duration(300)
				.attr("x", function(d)	{if(dvc.bZoom==true){
								return Math.abs(dvc.xScaleZoom(d[dvc.timeIndex]) - dvc.xScale(0));	
						} 
						else {
								return Math.abs(dvc.xScale(d[dvc.timeIndex]) - dvc.xScale(0));
						}
			});
				
			meanl.selectAll("text")
				.transition()
				.duration(300)
				.attr("x", function(d)	{if(dvc.bZoom==true){
								return Math.abs(dvc.xScaleZoom(d[dvc.timeIndex]) - dvc.xScale(0) - 12);	
						} 
						else {
								return Math.abs(dvc.xScale(d[dvc.timeIndex]) - dvc.xScale(0) - 12);
						}
			});
				
					
			//update time slider and time label
			$("#timeSlider").slider( "option", "value", dvc.timeIndex );
			d3.select("#txtTime")
			.text(dvc.chartData.timeLabels[dvc.timeIndex]);
			
			//apply transition on the y axis
			bar.transition()
				.duration(1000)
				.delay(function(d, i) {
					return i * 50;
				})
				.attr("transform", function(d, i) {
					return "translate(0," + dvc.yScale(i) + ")";
				});
		}
		} else {
						
		}
