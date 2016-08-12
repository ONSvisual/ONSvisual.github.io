	var graphic = $('#graphic');
		var keypoints = $('#keypoints');
		var footer = $(".footer");
		var pymChild = null;



		function drawGraphic() {
			
			
		format1 = d3.format(",.0f");
		
		   var threshold_md = 600;
		   var threshold_sm = dvc.optional.mobileBreakpoint; 
		  
		  	//set variables for chart dimensions dependent on width of #graphic
		    if (graphic.width() < threshold_sm) {        	
		            var margin = {top: dvc.optional.margin_sm[0], right: dvc.optional.margin_sm[1], bottom: dvc.optional.margin_sm[2], left: dvc.optional.margin_sm[3]}; 
					var chart_width = graphic.width() - margin.left - margin.right;
		            var height = Math.ceil((chart_width * dvc.optional.aspectRatio_sm[1]) / dvc.optional.aspectRatio_sm[0]) - margin.top - margin.bottom;
		    } else if (graphic.width() < threshold_md){
		        	var margin = {top: dvc.optional.margin_md[0], right: dvc.optional.margin_md[1], bottom: dvc.optional.margin_md[2], left: dvc.optional.margin_md[3]}; 
					var chart_width = graphic.width() - margin.left - margin.right;
		            var height = Math.ceil((chart_width * dvc.optional.aspectRatio_md[1]) / dvc.optional.aspectRatio_md[0]) - margin.top - margin.bottom;
		  	} else {
		        	var margin = {top: dvc.optional.margin_lg[0], right: dvc.optional.margin_lg[1], bottom: dvc.optional.margin_lg[2], left: dvc.optional.margin_lg[3]}
					var chart_width = graphic.width() - margin.left - margin.right;
		            var height = Math.ceil((chart_width * dvc.optional.aspectRatio_lg[1]) / dvc.optional.aspectRatio_lg[0]) - margin.top - margin.bottom;
			}

		    // clear out existing graphics
		    graphic.empty();
			keypoints.empty();
			footer.empty();
			

		    var x = d3.scale.linear()
		        .range([0, chart_width]);
				
		    var y = d3.scale.linear()
		        .range([height, 0]);

		    x.domain([d3.min(graphic_data, function(d) { return +d.date; }),d3.max(graphic_data, function(d) { return +d.date; })]);	

				
			function scaleFormat(d,i) {
				if (d > 0) {
					return dvc.essential.leftRight[i];
				} 
			}

			
		    var xAxis = d3.svg.axis()
		        .scale(x)
		        .orient("top")
				.tickPadding(7)

		    
			xAxis.tickValues([0,5])
				.tickFormat("");
		    var yAxis = d3.svg.axis()
		        .scale(y)
		        .orient('left');
		    			  
				
			//specify number or ticks on y axis
			if (graphic.width() <= threshold_sm) {
				yAxis.ticks(dvc.optional.y_num_ticks_sm_md_lg[0])
			 } else if (graphic.width() <= threshold_md){
				yAxis.ticks(dvc.optional.y_num_ticks_sm_md_lg[1])
			 } else {
				yAxis.ticks(dvc.optional.y_num_ticks_sm_md_lg[2])

			 }
				
		    //gridlines
		    var y_axis_grid = function() { return yAxis; }

		    var line = d3.svg.line()
		        .x(function(d,i) { return x(d.date);})
		        .y(function(d,i) { return y(d.alt); });

			
			// parse data into columns
		    var lines = {};
			
			
			alt = 31;
		    for (var column in graphic_data[0]) {
		        if (column == 'date') continue;
		        lines[column] = graphic_data.map(function(d) {
					if(+d[column] > 30) {
						alt = alt + 1;
						
						return {
							'date': d.date,
							'amt': +d[column],
							'alt': alt
							
						};
						
					} else {
					
						return {
							'date': d.date,
							'amt': +d[column],
							'alt': +d[column]
							
						};
					}
		        });
		    }
			
			
			first =Object.keys(lines)[0];
			
		  	//y domain calculations	: zero to intelligent max choice, or intelligent min and max choice,  or interval chosen manually
	   		if (dvc.essential.yAxisScale == "auto_zero_max"){
			   var yDomain = [
								0,
								d3.max(d3.entries(lines), function(c) {
									return d3.max(c.value, function(v) {
										var n = v.amt;
										return Math.ceil(n);
									});
								})
							 ];
			} else if (dvc.essential.yAxisScale == "auto_min_max"){
				var yDomain = [
								d3.min(d3.entries(lines), function(c) {
									return d3.min(c.value, function(v) {
										var n = v.amt;
										return Math.floor(n);
									});
								}),
							
								d3.max(d3.entries(lines), function(c) {
									return d3.max(c.value, function(v) {
										var n = v.amt;
										return Math.ceil(n);
									});
								})
					 		];
			} else {
			   var yDomain = dvc.essential.yAxisScale;
		    }
				 
		    y.domain(yDomain);
		    
//			//create legend
//			if(dvc.essential.legendLabels.length > 1){
//			var legend = d3.select('#graphic').append('ul')
//			                .attr('class', 'key')
//			            .selectAll('g')
//			                .data(dvc.essential.legendLabels)
//			            .enter().append('li')
//
//				    legend.append('b')
//						 .attr("class",function(d,i){return "border" + i})
//				    
//					legend.append('label')
//				         .html(function(d,i) { return dvc.essential.legendLabels[i]; });						
//			}

			

		    //create svg for chart
		    svg = d3.select('#graphic').append('svg')
				        .attr("width", chart_width + margin.left + margin.right)
				        .attr("height", height + margin.top + margin.bottom +30)
				        .append("g")
				        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			//y axis label
			svg.append("text")
		                .attr('class', 'unit')
						.attr("transform", "translate(" + (margin.left*-1) + ",-5)")
		  		        .text(function(d,i) { return dvc.essential.yAxisLabel; });
							
					svg.append("rect")
						.attr("class","svgRect")
						.attr("width", chart_width)
						.attr("height", height)
			    
				    svg.append('g')
				        .attr('class', 'y axis')
				        .call(yAxis);
						
				    svg.append('g')
				        .attr('class', 'y grid')
				        .call(y_axis_grid()
				            .tickSize(-chart_width, 0, 0)
				            .tickFormat('')
				        );
					
					//create x axis, if y axis doesn't start at 0 drop x axis accordingly	
					svg.append('g')
				        .attr('class', 'x axis')
				        .attr('transform', 'translate(0,-16)') 
				        .call(xAxis);
						
				
    		svg.append("text")
				.attr("x",-margin.left)
				.attr("y",-18)
				.attr("text-anchor","start")
				.attr("fill","#666")
				.attr("font-weight", "bold")
				.style("font-size","14px")
				.text(dvc.essential.leftRight[0])
				
			svg.append("text")
				.attr("y",-18)
				.attr("x",chart_width + margin.right)
				.attr("text-anchor","end")
				.attr("fill","#666")
				.attr("font-weight", "bold")
				.style("font-size","14px")
				.text(dvc.essential.leftRight[1])
			
			
				
				//create icon to symbolise break in y axis if required					
				if(yDomain[0] > 0 && dvc.essential.yAxisBreak == true){
					var paths = svg.append("defs")
								.append("g")
								.attr("id","icon")
								.append("g");
								
							paths.append("polyline")
								 .attr("points", "2.881,9.54 7.94,5.061 12.341,9.54 17.77,5.061")
								 .attr("stroke", "#666")
								 .attr("fill", "none")
							paths.append("polyline")
								.attr("points", "2.881,14.54 7.94,10.061 12.341,14.54 17.77,10.061")
								.attr("stroke", "#666")
								.attr("fill", "none");
				  
						//specify position of icon				  
						svg.append("g").attr("id","iconpath")
								.attr("transform","translate(-10,3)")
								.append("use")
								.attr("xlink:href","#icon")
								.attr("x", x(x.domain()[0]))
								.attr("y", function(){ 
									if (graphic.width() < threshold_sm) {
										return y(dvc.essential.yAxisBreak_sm_md_lg[0])
									} else if (graphic.width() < threshold_md){
										return y(dvc.essential.yAxisBreak_sm_md_lg[1])
									} else {
										return y(dvc.essential.yAxisBreak_sm_md_lg[2])
									}
								});
				}

				//create centre line if required
				if (dvc.optional.centre_line == true){
					svg.append("line")
						.attr("id","centreline")
						.attr('y1',y(dvc.optional.centre_line_value))
						.attr('y2',y(dvc.optional.centre_line_value))
						.attr('x1',0)
						.attr('x2',chart_width);
				} else if(yDomain[0] <0){
					svg.append("line")
						.attr("id","centreline")
						.attr('y1',y(0))
						.attr('y2',y(0))
						.attr('x1',0)
						.attr('x2',chart_width);
				}  


	
				//create lines 		
			    linegroups = svg.append('g').attr("id","slopelines").selectAll('path')
			        .data(d3.entries(lines))
			        .enter()
					.append("g")
					.attr("class",function(d,i){return "slopegroup slopegroup_" + i})
					.on("mouseover",function(){
							d3.selectAll(".slopegroup").transition().duration(300).attr("opacity","0.2");  
							var thisclass = d3.select(this).attr("class").split(" ",2)[1];
							
							d3.selectAll("." + thisclass).transition().duration(300).attr("opacity","1"); 
							d3.selectAll("." + thisclass).select("path").style("stroke-width","3px");
							d3.selectAll("." + thisclass).selectAll("text").classed("boldtext",true);
							
					})
					.on("mouseout",function(){
							d3.selectAll(".slopegroup").transition().duration(300).attr("opacity","1"); 
							d3.selectAll(".slopegroup").select("path").style("stroke-width","2px");
							d3.selectAll(".slopegroup").selectAll("text").classed("boldtext",false);
					});
					
			  linegroups.append('path')
			            .attr('class', function(d, i) {
							if(+d.value[0].amt > +d.value[1].amt){betterWorse = 0}
							else if(+d.value[0].amt < +d.value[1].amt){betterWorse = 1}
							else {betterWorse = 2}
							
						
			                return 'line line-' + i + " slopeEU" + betterWorse;
			            })
			            .attr('d', function(d) {
			                return line(d.value);
			            });	
				
				

						
						

							   
							   		linegroups.append('text')
										.attr("class","labelstext2")
										.text(function(d, i) {
											return "(" + format1(dvc.essential.dataper[1][i]) + " Golds) " + dvc.essential.legendLabels[i];
										})
										.attr('y', function(d) {
											return (y(d.value[1].alt) +5);

										})
										.attr('x', chart_width +30)
										.attr('text-anchor','start');
							   
							   
									linegroups.append('text')
										.attr("class","labelstext desk")
										.text(function(d, i) {
											return dvc.essential.legendLabels[i] + " (" + format1(dvc.essential.dataper[0][i]) + ")";
										})
										.attr('y', function(d) {
											return (y(d.value[0].alt)+5);
										})
										.attr('x', -25)
										.attr('text-anchor','end');
										
									linegroups.append('text')
										.attr("class","labelstext mob")
										.text(function(d, i) {
											return "(" + format1(dvc.essential.dataper[0][i]) + ")";
										})
										.attr('y', function(d) {
											return (y(d.value[0].alt)+5);
										})
										.attr('x', -25)
										.attr('text-anchor','end');
							
							
				

				linegroups.forEach(function(d,i){
					for (var j = 0; j < lines[first].length; j++) {			
					
					 linegroupsg = linegroups.append("g").attr("class",function(d,i){return "groups" + j});
					
							  
					linegroupsg.append("rect")
					 		   .attr("class", "rectno" + j) 
							   .attr("x", function(d,i){ 
									return x(d.value[j].date);  
									}) 
							   .attr("y",function(d) {
										return y(d.value[j].alt); 
							   }) 
							   .attr("width", "9px")
							   .attr("height","6px")
							   .attr("fill","#00b3b3");

							   linegroupsg.append("rect")
					 		   .attr("class", "rectno" + j) 
							   .attr("x", function(d,i){ 
									return x(d.value[j].date);  
									}) 
							   .attr("y",function(d) {
										return y(d.value[j].alt); 
							   }) 
							   .attr("width", "2px")
							   .attr("height","6px")
							   .attr("fill","#00b3b3");

					linegroupsg.append("circle")
					 		   .attr("class", "circleno" + j) 
							   .attr("cx", function(d,i){ 
									return x(d.value[j].date);  
									}) 
							   .attr("cy",function(d) {
										return y(d.value[j].alt); 
							   }) 
							   .attr("fill","#CFB53B")
							   .attr("r",10);
							  
					 linegroupsg.append("text")
					 		   .attr("class", "textno" + j) 
							   .text(function(d){return ""+ Math.round(d.value[j].amt) + ""})
							   .attr("x", function(d,i){ 
									return x(d.value[j].date);  
									}) 
							   .attr("y",function(d) {
										return y(d.value[j].alt) + 6; 
							   }) 
							   .attr('text-anchor','middle');
							   
					}
				});
				
				
				d3.select("#slopelines").append("line")
					 		   .attr("x1",x(0)-margin.left)
							   .attr("x2",x(5)+margin.right)
							   .attr("y1",y(31))
							   .attr("y2",y(31))	
							   .attr("stroke","#666")
							   .attr("stroke-width", "2px")
							   .attr("stroke-dasharray",4);
							   
				d3.select("#slopelines").append("text")
							   .attr("x",x(5) +28)
							   .attr("y",y(32))
							   .html("TOP 30 &#9650;")
				
				
				d3.selectAll(".textno1")
					.attr("transform","translate(6,0)");
					
				d3.selectAll(".textno0")
					.attr("transform","translate(-6,0)");
												
				d3.selectAll(".circleno1")
					.attr("transform","translate(6,2)");
					
				d3.selectAll(".circleno0")
					.attr("transform","translate(-6,2)");
												
												
				d3.selectAll(".rectno1")
					.attr("transform","translate(2,-11)");
					
				d3.selectAll(".rectno0")
					.attr("transform","translate(-10,-11)");
												
			//arrangeLabels();
			//arrangeLabels2();
			//arrangeGroups();	
			//arrangeGroups2();

			writeAnnotation();
							
			function writeAnnotation(){
			
				
											dvc.essential.annotationChart.forEach(function(d,i) {	
						
							// draw annotation text based on content of var annotationArray ...
							svg.append("text")
								.text(dvc.essential.annotationChart[i])
								.attr("class","annotext" + i)
								.attr("text-anchor", dvc.essential.annotationAlign[i])
								.attr('y',y(dvc.essential.annotationXY[i][1]))
								.attr('x',x(dvc.essential.annotationXY[i][0]));
										
							d3.selectAll(".annotext" + (i))
								.each(insertLinebreaks)
								.each(createBackRect);	
								
								


							
															
							function insertLinebreaks() {
								
								var str = this;
			
								var el1 = dvc.essential.annotationChart[i];
								var el = el1.data;
						
								var words = el1.split('  ');
								
								d3.select(this/*str*/).text('');
							
								for (var j = 0; j < words.length; j++) {
									var tspan = d3.select(this).append('tspan').text(words[j]);
									if (j > 0)
										tspan.attr('x', x(dvc.essential.annotationXY[i][0])).attr('dy', '18');													
								}
							};					
													
							function createBackRect() {
								
							var BBox = this.getBBox()
											
									svg.insert("rect", ".annotext" + (i))
										.attr("width", BBox.width)
										.attr("height", BBox.height)
										.attr("x", BBox.x)
										.attr("y", BBox.y)
										.attr("fill", "white")
										.attr("opacity", 0.4);
										
							}; // end function createBackRect()
						
						
							// draw circles, if var 'dvc.essential.circles' is set to true
							if ( dvc.essential.circles == true ) {
								
								svg.append("circle")
									.attr("class", "annocirc" + (i))
									.attr('cy',y(dvc.essential.annotationCXCY[i][1]))
									.attr('cx',x(d3.time.format(dvc.essential.dateFormat).parse(dvc.essential.annotationCXCY[i][0])))
									.attr("r", "3");
								
							} // end if ... 
							
						});	// end foreach 		
					
			
				
				return;
				
			}// end function writeAnnotation()
							
			d3.select("#keypoints").append("p").text("");	
							
			//create link to source				
			d3.select(".footer").append("p")
				.text("Source: ")
				.append("a")
				.attr("href", dvc.essential.sourceURL)
				.attr("target", "_blank")
				.html(dvc.essential.sourceText);
						
			//use pym to calculate chart dimensions	
		    if (pymChild) {
		        pymChild.sendHeight();
		    }
	

		}


function arrangeLabels2() {

  var move = 1;
  while(move > 0) {
    move = 0;
    d3.selectAll(".labelstext2")
       .each(function(i) {
         var that = this,
             a = this.getBoundingClientRect();
         d3.selectAll(".labelstext2")
            .each(function() {
              if(this != that) {
                var b = this.getBoundingClientRect();
                if((Math.abs(a.top - b.top) * 2.5 < (a.height + b.height))) {
                  // overlap, move labels
                  var dx = (Math.max(0, a.right - b.left) +
                           Math.min(0, a.left - b.right)) * 0.01,
                      dy = (Math.max(0, a.bottom - b.top) +
                           Math.min(0, a.top - b.bottom)) * 0.03;
					
                      tt = d3.transform(d3.select(this).attr("transform")),
                      to = d3.transform(d3.select(that).attr("transform"));
					
                  move += Math.abs(dx) + Math.abs(dy);
                
                  to.translate = [ 0, to.translate[1] + dy ];
                  tt.translate = [ 0, tt.translate[1] - dy ];

                  d3.select(this).attr("transform", "translate(" + tt.translate + ")");
                  d3.select(that).attr("transform", "translate(" + to.translate + ")");
                  a = this.getBoundingClientRect();
                }
              }
            });
       });
  }
}



function arrangeLabels() {

  var move = 1;
  while(move > 0) {
    move = 0;
    d3.selectAll(".labelstext")
       .each(function(i) {
         var that = this,
             a = this.getBoundingClientRect();
         d3.selectAll(".labelstext")
            .each(function() {
              if(this != that) {
                var b = this.getBoundingClientRect();
                if((Math.abs(a.top - b.top) * 2.5 < (a.height + b.height))) {
                  // overlap, move labels
                  var dx = (Math.max(0, a.right - b.left) +
                           Math.min(0, a.left - b.right)) * 0.01,
                      dy = (Math.max(0, a.bottom - b.top) +
                           Math.min(0, a.top - b.bottom)) * 0.03;
					
                      tt = d3.transform(d3.select(this).attr("transform")),
                      to = d3.transform(d3.select(that).attr("transform"));
					
                  move += Math.abs(dx) + Math.abs(dy);
                
                  to.translate = [ 0, to.translate[1] + dy ];
                  tt.translate = [ 0, tt.translate[1] - dy ];

                  d3.select(this).attr("transform", "translate(" + tt.translate + ")");
                  d3.select(that).attr("transform", "translate(" + to.translate + ")");
                  a = this.getBoundingClientRect();
                }
              }
            });
       });
  }
}




function arrangeGroups() {

  var move = 1;
  while(move > 0) {
    move = 0;
    d3.selectAll(".groups0")
       .each(function(i) {
         var that = this,
             a = this.getBoundingClientRect();
         d3.selectAll(".groups0")
            .each(function() {
              if(this != that) {
                var b = this.getBoundingClientRect();
                if((Math.abs(a.top - b.top) * 2.5 < (a.height + b.height))) {
                  // overlap, move labels
                  var dx = (Math.max(0, a.right - b.left) +
                           Math.min(0, a.left - b.right)) * 0.01,
                      dy = (Math.max(0, a.bottom - b.top) +
                           Math.min(0, a.top - b.bottom)) * 0.03;
					
                      tt = d3.transform(d3.select(this).attr("transform")),
                      to = d3.transform(d3.select(that).attr("transform"));
					
                  move += Math.abs(dx) + Math.abs(dy);
                
                  to.translate = [ 0, to.translate[1] + dy ];
                  tt.translate = [ 0, tt.translate[1] - dy ];

                  d3.select(this).attr("transform", "translate(" + tt.translate + ")");
                  d3.select(that).attr("transform", "translate(" + to.translate + ")");
                  a = this.getBoundingClientRect();
                }
              }
            });
       });
  }
  
  d3.selectAll(".groups0").selectAll('text').attr("transform", "translate(-5,0)");
}


function arrangeGroups2() {

  var move = 1;
  while(move > 0) {
    move = 0;
    d3.selectAll(".groups1")
       .each(function(i) {
         var that = this,
             a = this.getBoundingClientRect();
         d3.selectAll(".groups1")
            .each(function() {
              if(this != that) {
                var b = this.getBoundingClientRect();
                if((Math.abs(a.top - b.top) * 2.5 < (a.height + b.height))) {
                  // overlap, move labels
                  var dx = (Math.max(0, a.right - b.left) +
                           Math.min(0, a.left - b.right)) * 0.01,
                      dy = (Math.max(0, a.bottom - b.top) +
                           Math.min(0, a.top - b.bottom)) * 0.03;
					
                      tt = d3.transform(d3.select(this).attr("transform")),
                      to = d3.transform(d3.select(that).attr("transform"));
					

                  move += Math.abs(dx) + Math.abs(dy);
                
                  to.translate = [ 0, to.translate[1] + dy ];
                  tt.translate = [ 0, tt.translate[1] - dy ];
				  

                  d3.select(this).attr("transform", "translate(" + tt.translate + ")");
                  d3.select(that).attr("transform", "translate(" + to.translate + ")");
                  a = this.getBoundingClientRect();
                }
              }
            });
       });
  }
  
   d3.selectAll(".groups2").selectAll('text').attr("transform", "translate(10,0)");
}



		//check whether browser can cope with svg	
		if (Modernizr.svg) {
		   //load config 
			d3.json("config.json", function(error, config) {
			dvc=config

				//load chart data
				d3.csv("data.csv", function(error, data) {
					graphic_data = data;
					
					graphic_data.forEach(function(d) {
						//d.date = d3.time.format(dvc.essential.dateFormat).parse(d.date); 
						
					});
					
					//use pym to create iframed chart dependent on specified variables
					pymChild = new pym.Child({ renderCallback: drawGraphic});
	
				});
			})

		} else {
			 //use pym to create iframe containing fallback image (which is set as default)
			 pymChild = new pym.Child();
			if (pymChild) {
		        pymChild.sendHeight();
		    }
		}
		
		
		

		