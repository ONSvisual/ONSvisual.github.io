require.config({
    paths: {
        'jquery': 'js/jquery',
		'jqueryui': 'js/jqueryui.min',
        'd3js': 'js/d3.min',
        'modernizr' : 'js/modernizr',
		'TouchPunch': 'js/jquery.ui.touch-punch.min',
		'xdomain': 'js/xdomain',
		'jquerycsv':'js/jquery.csv.min',
		'pym':'js/pym'
    },
    shim: {
        'jqueryui': {
			   deps: ['jquery']
		 },
		 'xDomain': {
			   deps: ['jquery']
		 },
		 'TouchPunch': {
			   deps: ['jqueryui']
		 }
    }
});

require(['jquery','jqueryui','TouchPunch','modernizr','xdomain'], function ($) {
    if (Modernizr.inlinesvg)    {
        require(['d3js'], function(d3)   {
		require(['pym'], function(pym)   {

	pymChild = new pym.Child();
	pymChild.sendHeight();
	var dvc = {};
	
	$("#submitBtn").hide();
    $("#nextBtn").hide();
	$("#pcError").hide();
	$("#pcNodata").hide();
	
	firstclick = 0;
	//Get the code
	$("#submitPost").click(function( event ) {
                event.preventDefault();
                event.stopPropagation();
				myValue=$("#pcText").val();
				
				firstclick = firstclick+1;
				if(firstclick ==1) {
					getCODES(myValue);
				}
				
	});
	

	
	//setTimeout(function(){addressSubmit()},2000);
	//getCode("PO14 4RE");

function buildQuiz(area){
	
	pymChild.sendHeight();
	$("#pcForm").hide();
	$("#submitBtn").show();
	$("#nextBtn").show();
	
	$("#test").text("Test yourself with these two questions");
		
	dvc.format=d3.format(",");
	dvc.render = "person";
	$("#results").hide();
    //read config file
    $.getJSON("data/config.json", function(data) {
		
		dvc.config=data;
		
		//load csv data
        d3.csv("data/data.csv", function(data) {
			
			//Get width of quiz container
			var quizwidth = $("#quiz").width();

			setSize();
			$( window ).resize(function() {setSize()});
			
            //extract area code from url
            //var paramString = window.location.hash.split("#");
            //dvc.area = paramString[1];
            //#W07000061//test wales
           // E14000530";//Aldershot
		   
		   	
			//console.log(dvc.area);
			
            dvc.areaData = data.filter(function(row) {
                return row['AREACD'] == dvc.area;
            })
			
			if(dvc.areaData[0].pernonuk == ".") {
				$("#submitBtn").hide();
				$("#nextBtn").hide();
				$("#pcNodata").show();

			} else {;
            
            dvc.ukData = data.filter(function(row) {
                return row['AREACD'] == 'UK';
            })
    
//            dvc.countryData = data.filter(function(row) {
//                dvc.countryCode = dvc.area.substring(0,1);
//                return row['AREACD'] == dvc.countryCode;
//            })
//			
//			//What country am I?
//			if(dvc.countryCode == "E" || dvc.countryCode =="W") {
//				countryName = "England & Wales"
//			} else if(dvc.countryCode == "S") {
//				countryName = "Scotland"
//			} else {
//				countryName = "Northern Ireland"
//			}
//			
           
            //starting question index
            dvc.questionIndex=0;
    
             var myName="AREACD";
                $.each( dvc.areaData[0], function( key, value ) {
                    if (key==myName)   {
                       // dvc.areaName=value;
                    }
            });

            dvc.userAnswers=new Array();
            dvc.realAnswers=new Array();
			dvc.realAnswers2=new Array();
            dvc.userScore=0;//tracks running score...
            dvc.ukAnswers=new Array();
            dvc.countryAnswers=new Array();
            
		
            //populate array of real answers
            for (var i=0;i<dvc.config.config.questions.length;i++)
             {
                dvc.topic=dvc.config.config.questions[i][1];
				
				
                $.each( dvc.areaData[0], function( key, value ) {
                    if (key==dvc.topic)   {
                        dvc.realAnswers[i]=value;

						if(value != "-99"){
							//dvc.realAnswers2[i]=value;
						
							dvc.realAnswers2.push(value);
						}
                    }
                });
                 
                $.each( dvc.ukData[0], function( key, value ) {
                    if (key==dvc.topic)   {
                        dvc.ukAnswers[i]=value;
                    }
                });
                 
//                 $.each( dvc.countryData[0], function( key, value ) {
//                    if (key==dvc.topic)   {
//                        dvc.countryAnswers[i]=value;
//                    }
//                });
            }


            numberquestions = dvc.realAnswers2.length;
            //for first question
            dvc.question= dvc.config.config.questions[dvc.questionIndex][0];
            dvc.topic = dvc.config.config.questions[dvc.questionIndex][1];
            dvc.minVal = dvc.config.config.questions[dvc.questionIndex][2];
            dvc.maxVal = dvc.config.config.questions[dvc.questionIndex][3];
            dvc.render = dvc.config.config.questions[dvc.questionIndex][4];
            dvc.subtext = dvc.config.config.questions[dvc.questionIndex][5];
            dvc.prefix = dvc.config.config.questions[dvc.questionIndex][6];
			
			dvc.uk=true;
			dvc.natAnswer = Math.round(dvc.ukAnswers[dvc.questionIndex]);
					
			if(dvc.natAnswer=="-99") {dvc.uk=false; dvc.natAnswer =  Math.round(dvc.countryAnswers[dvc.questionIndex])};

			dvc.questionno = 1;

            $("#quizTitle").text(function()  {
              return "Quiz - What is migration like in "+dvc.areaName+"?";  
            });
			
            
            $("#quizQuestion").html(function()  {
                        return /*dvc.questionno +"/" + numberquestions + " - " + */dvc.question;  
            });
            $("#quizSubtext").text(function()  {
				return dvc.subtext;
			});
            $("#questionHint").text("Use the slider to make your guess");
            
        //create slider
		
        d3.select('#sliderVal').style("width", '100%').append("div").attr("id","slider");
            
        $('#slider').slider({range: 'min', min:dvc.minVal, max:dvc.maxVal, value:0, step:1, slide:function(event,ui){        
            //colour in icons
            if (dvc.render=="person")   {
                 d3.select("#pictoGuessValue").text(function()    {
                    return dvc.prefix + dvc.format(Math.round(dvc.maxVal*(ui.value/dvc.maxVal)));
                });
                 d3.selectAll("use").attr("class",function(d,i){
                       if (d<ui.value)  {
                           return "iconSelected";
                       }    else    {
                           return "iconPlain";
                       }
                    });
            }
            
            if (dvc.render=="bar")  {
                $("#guessValue").text(function()    {
                    return dvc.prefix + dvc.format(Math.round(dvc.maxVal*(ui.value/dvc.maxVal)));
                });
                $("#guessReveal").css("width",function(d){
                    return (ui.value/dvc.maxVal)*100 + "%";
                })  ;
            }
}});      
  
         //next button
        $("#nextBtn").hide()
            .click(function( event ) {
                event.preventDefault();
                event.stopPropagation();
                $("#submitBtn").show();
                $("#nextBtn").hide();
				enableSlider();
				dvc.uk=true;
				
                //prepare for next question
                dvc.questionIndex++;
					
				dvc.questionno++;
					
				while (dvc.realAnswers[dvc.questionIndex] == -99) {
					dvc.questionIndex++;
				}		

                if(dvc.questionIndex<=dvc.config.config.questions.length-1)    {

                    //for first question
                    dvc.question= dvc.config.config.questions[dvc.questionIndex][0];
                    dvc.topic = dvc.config.config.questions[dvc.questionIndex][1];
                    dvc.minVal = dvc.config.config.questions[dvc.questionIndex][2];
                    dvc.maxVal = dvc.config.config.questions[dvc.questionIndex][3];
                    dvc.render = dvc.config.config.questions[dvc.questionIndex][4];
                    dvc.subtext = dvc.config.config.questions[dvc.questionIndex][5];
                    dvc.prefix = dvc.config.config.questions[dvc.questionIndex][6];

	             	dvc.natAnswer = Math.round(dvc.ukAnswers[dvc.questionIndex]);
					
					if(dvc.natAnswer=="-99") {dvc.uk=false;dvc.natAnswer =   Math.round(dvc.countryAnswers[dvc.questionIndex])};


                    //new question text
                    d3.select("#quizQuestion").html(function()  {
                        return /*dvc.questionno +"/" + numberquestions + " - " +*/dvc.question;  
                    });
					
					d3.select("#quizSubtext").text(function()  {
						return dvc.subtext;
					});
                    
                    //reset slider
                    $('#slider').slider("option", "min",dvc.minVal);
                    $('#slider').slider("option", "max",dvc.maxVal);
                    $('#slider').slider("option", "value",dvc.minVal);
                    //reset graph panels
                    initPicto();
                    initGraph();
                    
                    //new render mode
                    dvc.render = dvc.config.config.questions[dvc.questionIndex][4];
					
					
					setSize();
					
                    if (dvc.render=="person") {
						$("#picto").show();
						$("#pictoText").show();
						$("#bar").hide();
						if(quizwidth < 700) {
							d3.select('#sliderVal').style("width", '100%')
						}
						else {
							d3.select('#sliderVal').style("width", '83%')
						};
						
					} else    {
						d3.select('#sliderVal').style("width", '100%')
						$("#picto").hide();
						$("#pictoText").hide();
						$("#bar").show();
					}

                } 
				
//				else    {
//                    //deliver results
//					//$("#picto").hide();
//					//$("#pictoText").hide();
//					//$("#bar").hide();
//					//$("#sliderVal").hide();
//					$("#submitDiv").hide();
//					$("#uiContainer").hide();
//					$("#test").hide();
//					//$("#results").show();
//					
//					$("#score").html(Math.round(dvc.userScore) + "<span class='picaarticle'> out of 100</span>");
//					
//                }
                
            });
            
            
        //submit button
        $("#submitBtn").click(function( event ) {
                event.preventDefault();
                event.stopPropagation();
				disableSlider();
				d3.select("#submitBtn").attr("disabled","disabled").attr("class","btnDisable");
                dvc.userAnswers[dvc.questionIndex]=$('#slider').slider("option", "value");
                
                
            //compare values
            var absDiff = Math.abs(dvc.userAnswers[dvc.questionIndex]-dvc.realAnswers[dvc.questionIndex]);
            
            /////////determine a score component for this answer
            var range= (dvc.maxVal-dvc.minVal)/6;
            var scoreMax=100/numberquestions;
            var cont;
            
            if (absDiff>=0 && absDiff< range)  {
				if(absDiff > 0) {
                	cont=scoreMax*((range-absDiff)/range);
				} else if(absDiff == 0) {
					//score max points because you got it spot on
                	cont=scoreMax;
				}
                
            }   else    {
				cont=0;
            }
            
            dvc.userScore=dvc.userScore+cont;
            
            
            var realDiff = dvc.userAnswers[dvc.questionIndex]-dvc.realAnswers[dvc.questionIndex];
                
            //animate the bar
             if (dvc.render=="bar")  {
               setTimeout(function (){
				    $("#actualValueText").text(dvc.prefix + dvc.format(Math.round(dvc.realAnswers[dvc.questionIndex])));
			   },800)
			   
//			   setTimeout(function (){
//				   
//               		$("#natValueText").text(dvc.prefix + dvc.format(Math.round(dvc.natAnswer)));
//			   },1600)
				
				var actual = (dvc.realAnswers[dvc.questionIndex]/dvc.maxVal)*100 + "%";
                var national = (dvc.natAnswer/dvc.maxVal)*100 + "%";
                 
                //animate real value
                $("#actualReveal").animate({width:actual},800).css('overflow', 'visible');
				
				
//				setTimeout(function (){
//					$("#natReveal").animate({width:national},800).css('overflow', 'visible');
//				},800);

				 
				setTimeout(function (){resetBtns()},1600);

				
             }
                
             if(dvc.render=="person") {
				 

                var transCount = Math.round(absDiff); ;//number of transitions
                var myAnswer = Math.round(dvc.userAnswers[dvc.questionIndex]);
                var realAnswer = Math.round(dvc.realAnswers[dvc.questionIndex]);
            
	
			
			
			//outlien the icons associated with user guess
			
             for (var k=0;k<myAnswer;k++)    {
                     d3.select("#icon"+k).attr("stroke","#444").attr("stroke-width","3px")
                }     
            
            //got an answer too low
            if (realDiff<0)    {
                for (var i=myAnswer;i<realAnswer;i++)
                {
                    d3.select("#icon"+i)
                        .transition()
                        .duration(100)
                        .delay(function(){
                            return (i-myAnswer)*50
                        })
                        .attr("class","iconSelected");
                } 
            }//end too low
                 
            //got an answer too high
            if (realDiff>0)    {
               for (var j=myAnswer;j>realAnswer;j--)
                {
                    d3.select("#icon"+(j-1))
                        .transition()
                        .duration(100)
                        .delay(function(){
                            return (myAnswer-j)*50
                        })
                        .attr("class","iconPlain");

                }
            }//end  too high
                 
            //set real text value
            d3.select("#pictoActualValue")
                        .transition()
                        .delay(transCount*50)
                        .text(realAnswer);
                     
						
						
			d3.select("#pictoNatValue")
                        .transition()
                        .delay((transCount*50)+800)
                        .text(dvc.natAnswer)
						.each("end",function(i)  {
                            //execute at end of transition
							resetBtns()
                        });

            }//end if pictogram
           
		
			if(dvc.questionIndex==dvc.config.config.questions.length-1) {
					$("#submitDiv").empty();
					setTimeout(function(){
						d3.select("#submitDiv").text("People leave the UK as well as enter. " + dvc.format(dvc.areaData[0].Outflow) + " people left "+ dvc.areaName + " intending to live outside the UK for more than a year.")
						pymChild.sendHeight()
					},1600);
			}
	
        });//end submit
        		
		
        //create svg element for quiz graphics
		
	
		if(quizwidth > 700) {

        var svgDocP = d3.select("#picto").append("svg").attr("id","svgpicto").attr("width", "100%")
		.attr("viewBox","0 0 100 43").attr("preserveAspectRatio","none");
		setSize();
		} else {
        var svgDocP = d3.select("#picto").append("svg").attr("id","svgpicto").attr("width", "100%")
		.attr("viewBox","0 0 100 43").attr("preserveAspectRatio","none");
		setSize();
		}
		
        //reference icon for people
        svgDocP.append("defs")
            .append("g")
            .attr("id","iconCustom")
            .append("path")
                .attr("d","M33.03,28.589c6.296,0,11.404-5.106,11.404-11.409c0-6.291-5.108-11.404-11.404-11.404 c-6.296,0-11.408,5.113-11.408,11.404C21.622,23.483,26.733,28.589,33.03,28.589 M58.042,49.122c0.478-6.87-4.657-18.019-16.174-18.019H23.141c-11.47,0-16.655,11.149-16.175,18.019 L6.684,81.823c0.149,2.165,2.021,3.792,4.18,3.646c2.162-0.147,3.565-1.986,3.64-4.175l1.741-26.736 c0.014-0.495,0.426-0.888,0.919-0.869c0.498,0.013,0.882,0.429,0.868,0.919v76.105c0,1.669,1.369,3.04,3.044,3.04h5.321 c1.674,0,2.941-1.172,3.044-3.04l1.881-42.319c0.111-1.15,0.092-1.897,1.14-0.897h0.06c1.052,0,1.033,0.747,1.14,1.897l1.882,42.319 c0.103,1.868,1.368,3.04,3.044,3.04h5.32c1.676,0,3.045-1.371,3.045-3.04l0.019-76.105h0.004c-0.015-0.49,0.376-0.906,0.868-0.919 c0.493-0.019,0.906,0.374,0.919,0.869l1.741,26.736c0.075,2.189,1.483,4.028,3.64,4.175c2.159,0.146,4.034-1.481,4.18-3.646 L58.042,49.122z");
        
        
        //build pictogram interface
		
		//if on mobile make a different size
		
		if(quizwidth > 700) {
		
            //specify the number of columns and rows for pictogram layout
            var numCols = 20;
            var numRows = 5;
            //padding for the grid
            var xPadding = 2;
            var yPadding = 2;
            //horizontal and vertical spacing between the icons
            var hBuffer = 140;
            var wBuffer = 83;
            //generate a d3 range for the total number of required elements
            var myIndex=d3.range(numCols*numRows);
			
		} else {

            //specify the number of columns and rows for pictogram layout
            var numCols = 20;
            var numRows = 5;
            //padding for the grid
            var xPadding = 2;
            var yPadding = 2;
            //horizontal and vertical spacing between the icons
            var hBuffer = 140;
            var wBuffer = 83;
            //generate a d3 range for the total number of required elements
            var myIndex=d3.range(numCols*numRows);
			

			
		}
		
		
            svgDocP.append("g").attr("id","pictoGram")
                .selectAll("use")
                .data(myIndex)
                .enter()
                .append("use")
                    .attr("xlink:href","#iconCustom")
                    .attr("transform","scale(0.06)")
                    .attr("id",function(d)    {
                        return "icon"+d;
                    })
                    .attr("x",function(d) {
                        var remainder=d % numCols;//calculates the x position (column number) using modulus
                        return xPadding+(remainder*wBuffer);//apply the buffer and return value
                    })
                      .attr("y",function(d) {
                        var whole=Math.floor(d/numCols)//calculates the y position (row number)
                        return yPadding+(whole*hBuffer);//apply the buffer and return the value
                    })
                    .classed("iconPlain",true);

	
            if (dvc.render=="person") {
						$("#picto").show();
						$("#pictoText").show();
						$("#bar").hide();
						if(quizwidth < 700)
							{
								d3.select('#sliderVal').style("width", '100%')
							}
						else {  
								d3.select('#sliderVal').style("width", '83%')
							  };
						
					}   else    {
						d3.select('#sliderVal').style("width", '100%');
						$("#picto").hide();
						$("#pictoText").hide();
						$("#bar").show();
					}
			}
		pymChild.sendHeight();
			
         })//end load data
    })//end read config
	}
	function initPicto()   {
		//reset text
		d3.select("#pictoGuessValue").text("0");
		d3.select("#pictoActualValue").text("");
		d3.select("#pictoNatValue").text("");
		
		if(dvc.uk == true){
			$(".natValLabel").text("UK");
		} else {
			$(".natValLabel").text(countryName);
		}
		
		
		//reset icons
		d3.select("#pictoGram").selectAll("use").attr("class","iconPlain").attr("stroke","none");
	}
	
	function initGraph()   {
		//reset text
		$("#actualValueText").html("&nbsp;");
		$("#natValueText").html("&nbsp;");
		$("#guessValue").html("&nbsp;");
		
		if(dvc.uk==true){
			$(".natValLabel").text("UK");
		} else {
			$(".natValLabel").text(countryName);
		}
		//reset bars
		$("#actualReveal").css("width","0%");
		$("#natReveal").css("width","0%");
		$("#guessReveal").css("width","0%");
	}
	
	function resetBtns() {
		
        $("#nextBtn").show();
        $("#submitBtn").attr("disabled",null).attr("class","btnEnable").hide();
			
	}
	
	function disableSlider() {
		$('#slider').slider('disable');
		
		$("#sliderVal").css("opacity",0.3);
			
	}
	
	function enableSlider() {
		
				
		$('#slider').slider('enable');

		$("#sliderVal").css("opacity",1);
			
	}

	//convert postcode to ward code using the postcodes.io
	
	function getCODES(myPC)	{
		
		//console.log(myPC);
		var myURIstring=encodeURI("https://api.postcodes.io/postcodes/"+myPC);
		//console.log(myPC);
		$.support.cors = true; 
		$.ajax({
			type: "GET",
			crossDomain: true,
			dataType: "jsonp",
			url: myURIstring,
			error: function (xhr, ajaxOptions, thrownError) {
				$("#pcError").show();
				firstclick = 0;
				},
			success: function(data1){
				$("#pcError").hide();
				dvc.area = data1.result.codes.admin_district;
				dvc.areaName = data1.result.admin_district;
				buildQuiz();	
				//data1[0].codes;
			}

	
		});
	
	}
	
	
	////convert postcode to ward code using the NeSS API
//	
//	function getCode(myPC)	{
//		
//	dvc.ie9check={};
//        //check for ie9, which is having issues with XmlHttpRequest on NeSS Deli service and regrettably means no support at this stage
//        dvc.ie9check.isIE9 = (function(){
//            var htmlElemClasses = document.querySelector('html').className.split(' ');
//            if (!htmlElemClasses){return false;}
//            for (var i = 0; i < htmlElemClasses.length; i += 1 ){
//            var classSnip = htmlElemClasses[i];
//                if (classSnip === 'ie9'){
//                return true;
//                }
//            }
//            return false;
//        }());
//
//	
//	$.support.cors = true;   
//	
//	   dvc.postCode=myPC;
//	
//		var myURIstring=encodeURI("http://neighbourhood.statistics.gov.uk/NDE2/Disco/FindAreas?Postcode="+dvc.postCode+"&LevelType=13&HierarchyId=26");
//	
//		$.ajax({
//			type: "GET",
//			dataType: "xml",
//			url: myURIstring,
//			error: function (xhr, ajaxOptions, thrownError) {
//				//alert(xhr.status);
//				//alert(xhr.responseText);
//				},
//			success: function(data1){
//	
//				//postcode validation - both for incorrect structures and non-England and Wales postcodes
//				var pcValid;
//				var pcGood;
//				var data;
//	
//				if (dvc.ie9check.isIE9==true)
//				{
//			   // if IE9 convert IXMLDomDucument2
//	
//				  var xmlstring = data1.xml;
//				  data = $.parseXML(xmlstring);
//				}
//				else
//				{
//					data = data1;
//				}
//				
//				
//				// PCValid - it's a valid postcode
//				// PCGood - There's a code available for it (Scotland codes not included?)
//				
//				if (data.firstChild.firstChild.childNodes[0])   {
//					pcValid="true";
//					if (data.firstChild.childNodes[0].firstChild.data=="validationFailure") {
//						pcGood="false";
//					}   else    {
//						pcGood="true"   
//					}
//				}   else    {
//					pcValid="false";
//					pcGood="false";
//				}
//	
//				if (pcValid=="false"||pcGood=="false") {
//					$("#pcError").show();
//				}   else    {
//					$("#pcError").hide();
//					console.log(data);
//					
//					dvc.areaCode=data.firstChild.firstChild.firstChild.firstChild.childNodes[0].childNodes[2].firstChild.data;//careful, this is an internal ness code - not the ONS Geog std
//					dvc.areaName=data.firstChild.firstChild.firstChild.firstChild.childNodes[0].childNodes[3].firstChild.data;
//					dvc.areaParent=data.firstChild.firstChild.firstChild.childNodes[0].firstChild.childNodes[3].firstChild.data;
//					//get the official ONS area code
//					console.log(dvc.areaCode);
//					console.log(dvc.areaName);
//					console.log(data.firstChild.firstChild.firstChild.firstChild.childNodes[0]);
//					
//					getSNAC(dvc.areaCode);
//					//$("#pcForm").hide();
//					// $("#instructionDiv").html("Loading quiz for the ward of <span class='areaText'>"+dvc.areaName+"</span> in <span class='areaText'>"+dvc.areaParent+"</span>...");
//					//we now have the geo information we need to start making calls to the NeSS API for data
//					//initAnswers();
//					}
//	
//				}
//	
//		});
//	
//	}
//
//	function getSNAC(area)  {
//	    var myURIString=encodeURI("http://neighbourhood.statistics.gov.uk/NDE2/Disco/GetAreaDetail?AreaId="+area);
//		$.ajax({ 
//			type: "GET",
//			dataType: "xml",
//			url: myURIString,
//			success: function(data1){
//				if (dvc.ie9check.isIE9==true)
//				{
//			   // if IE9 convert IXMLDomDucument2
//				  var xmlstring = data1.xml;
//				  data = $.parseXML(xmlstring);
//				  
//				}
//				else
//				{
//					data = data1;
//					console.log(data);
//				};
//				
//				console.log(data.firstChild.childNodes[0].firstChild.firstChild.data);
//				dvc.area=data.firstChild.childNodes[0].firstChild.firstChild.data;
//				buildQuiz(dvc.area);
//				//$("#map").fadeIn();
//				//getBoundaries(dvc.snacCode);//go build map
//				}
//		}); 	
//	}


	function setSize() {
	
			var quizwidth = $("#quizContent").width();
			var contentHeightRatio = 1;
			var contentWidthRatio = 2.39;
			
			contentHeight = (quizwidth/contentWidthRatio) * contentHeightRatio;
			
			if(quizwidth >= 670) {
						
						if(dvc.render=="person"){
							
							var quizwidth = quizwidth * (10/12);
							
							var contentHeightRatio = 1;
							var contentWidthRatio = 2.39;
							
							contentHeight = (quizwidth/contentWidthRatio) * contentHeightRatio;
						
						
							//d3.select("#quizContent").style("height",contentHeight + "px");
							d3.select("#picto").style("height",contentHeight + "px");
							//d3.select("#bar").style("height",contentHeight + "px");
							d3.select('#sliderVal').style("width", '83%');
						} else {
							var barheight = $("#bar").height();
							//d3.select("#quizContent").style("height",(barheight + 20)+ "px");
							d3.select("#picto").style("height",contentHeight + "px");
							d3.select('#sliderVal').style("width", '100%');
						}
						
						
					} else {
						if(dvc.render=="person"){
						//d3.select("#quizContent").style("height", (contentHeight+95) + "px");
						d3.select("#picto").style("height",(contentHeight+20) + "px");
						d3.select("#pictoText").style("height","90px");
						d3.select('#sliderVal').style("width", '100%');
						
						} else {
						var barheight = $("#bar").height();
						//d3.select("#quizContent").style("height",(barheight + 20)+ "px");
						d3.select("#picto").style("height",contentHeight + "px");
						d3.select('#sliderVal').style("width", '100%');

							
						}
					}
		
	}


        });
		});
    }
	

//////////////////////////////////////////////// IE8 ////////////////////////////////////////////
	
	
	// else    {
//		
//		require(['jquerycsv'], function()   {
//			
//			
//		if (!Array.prototype.filter)
//		{
//		  Array.prototype.filter = function(fun /*, thisp */)
//		  {
//			"use strict";
//		
//			if (this === void 0 || this === null)
//			  throw new TypeError();
//		
//			var t = Object(this);
//			var len = t.length >>> 0;
//			if (typeof fun !== "function")
//			  throw new TypeError();
//		
//			var res = [];
//			var thisp = arguments[1];
//			for (var i = 0; i < len; i++)
//			{
//			  if (i in t)
//			  {
//				var val = t[i]; // in case fun mutates this
//				if (fun.call(thisp, val, i, t))
//				  res.push(val);
//			  }
//			}
//		
//			return res;
//		  };
//		}
//		
//		var dvc = {};
//
//	    $.getJSON("data/config.json", function(data) {
//        dvc.config=data;
//		
//		$.get("data/data.csv", function(data) {
//			
//			y = data;
//		
//		}).done(function() {
//		
//			y = y.replace(/[\r|\r\n]/g, "\n"); 
//			data = $.csv.toObjects(y);
//			
//			var paramString = window.location.hash.split("#");
//            dvc.area = paramString[1];	
//					
//			dvc.areaData = data.filter(function(row) {
//                return row['AREACD'] == dvc.area;
//            })
//
//            dvc.ukData = data.filter(function(row) {
//                return row['AREACD'] == 'UK';
//            })
//    
//            dvc.countryData = data.filter(function(row) {
//                dvc.countryCode = dvc.area.substring(0,1);
//                return row['AREACD'] == dvc.countryCode;
//            })
//			
//			//What country am I?
//			if(dvc.countryCode == "E" || dvc.countryCode =="W") {
//				countryName = "England & Wales"
//			} else if(dvc.countryCode == "S") {
//				countryName = "Scotland"
//			} else {
//				countryName = "Northern Ireland"
//			}
//			
//           
//           
//            //starting question index
//            dvc.questionIndex=0;
//    
//             var myName="AREACD";
//                $.each( dvc.areaData[0], function( key, value ) {
//                    if (key==myName)   {
//                       // dvc.areaName=value;
//                    }
//            });
//
//            dvc.userAnswers=new Array();
//            dvc.realAnswers=new Array();
//			dvc.realAnswers2=new Array();
//            dvc.userScore=0;//tracks running score...
//            dvc.ukAnswers=new Array();
//            dvc.countryAnswers=new Array();
//            
//		
//            //populate array of real answers
//            for (var i=0;i<dvc.config.config.questions.length;i++)
//             {
//                dvc.topic=dvc.config.config.questions[i][1];
//				
//				
//                $.each( dvc.areaData[0], function( key, value ) {
//                    if (key==dvc.topic)   {
//                        dvc.realAnswers[i]=value;
//
//						if(value != "-99"){
//							//dvc.realAnswers2[i]=value;
//						
//							dvc.realAnswers2.push(value);
//						}
//                    }
//                });
//                 
//                $.each( dvc.ukData[0], function( key, value ) {
//                    if (key==dvc.topic)   {
//                        dvc.ukAnswers[i]=value;
//                    }
//                });
//                 
//                 $.each( dvc.countryData[0], function( key, value ) {
//                    if (key==dvc.topic)   {
//                        dvc.countryAnswers[i]=value;
//                    }
//                });
//            }
//
//
//            numberquestions = dvc.realAnswers2.length;
//            //for first question
//            dvc.question= dvc.config.config.questions[dvc.questionIndex][0];
//            dvc.topic = dvc.config.config.questions[dvc.questionIndex][1];
//            dvc.minVal = dvc.config.config.questions[dvc.questionIndex][2];
//            dvc.maxVal = dvc.config.config.questions[dvc.questionIndex][3];
//            dvc.render = dvc.config.config.questions[dvc.questionIndex][4];
//            dvc.subtext = dvc.config.config.questions[dvc.questionIndex][5];
//            dvc.prefix = dvc.config.config.questions[dvc.questionIndex][6];
//			
//			$("#bar").show();
//			dvc.uk=true;
//			initGraph();
//			
//			dvc.uk=true;
//			dvc.natAnswer = Math.round(dvc.ukAnswers[dvc.questionIndex]);
//					
//			if(dvc.natAnswer=="-99") {dvc.uk=false; dvc.natAnswer =  Math.round(dvc.countryAnswers[dvc.questionIndex])};
//
//			dvc.questionno = 1;
//
//            $("#quizTitle").text(function()  {
//              return "Quiz - What is migration like in "+dvc.areaName+"?";  
//            });
//			
//            $("#quizQuestion").html(function()  {
//              return dvc.questionno +"/" + numberquestions + " - " +dvc.question;  
//            });
//
//            $("#questionHint").text("Use the slider to make your guess");
//			
//	        $('#sliderVal').append("<div id='slider'></div>");
//            
//			$('#slider').slider({range: 'min', min:dvc.minVal, max:dvc.maxVal, value:0, step:1, slide:function(event,ui){        
//			$("#bar").show();
//				
//					$("#guessValue").text(function()    {
//						return dvc.prefix + Math.round(dvc.maxVal*(ui.value/dvc.maxVal));
//					});
//					$("#guessReveal").css("width",function(d){
//						return (ui.value/dvc.maxVal)*100 + "%";
//					})  ;
//				
//				
//			}});    
//
//
//			$("#nextBtn").hide()
//				.click(function( event ) {
//                event.preventDefault();
//                event.stopPropagation();
//                $("#submitBtn").show();
//                $("#nextBtn").hide();
//				enableSlider();
//				dvc.uk=true;
//				
//                //prepare for next question
//                dvc.questionIndex++;
//					
//				dvc.questionno++;
//					
//				while (dvc.realAnswers[dvc.questionIndex] == -99) {
//					dvc.questionIndex++;
//				}		
//
//                if(dvc.questionIndex<=dvc.config.config.questions.length-1)    {
//
//                    //for first question
//                    dvc.question= dvc.config.config.questions[dvc.questionIndex][0];
//                    dvc.topic = dvc.config.config.questions[dvc.questionIndex][1];
//                    dvc.minVal = dvc.config.config.questions[dvc.questionIndex][2];
//                    dvc.maxVal = dvc.config.config.questions[dvc.questionIndex][3];
//                    dvc.render = dvc.config.config.questions[dvc.questionIndex][4];
//                    dvc.subtext = dvc.config.config.questions[dvc.questionIndex][5];
//                    dvc.prefix = dvc.config.config.questions[dvc.questionIndex][6];
//
//	             	dvc.natAnswer = Math.round(dvc.ukAnswers[dvc.questionIndex]);
//					
//					if(dvc.natAnswer=="-99") {dvc.uk=false;dvc.natAnswer =   Math.round(dvc.countryAnswers[dvc.questionIndex])};
//
//
//                    //new question text
//                    $("#quizQuestion").html(function()  {
//                        return dvc.questionno +"/" + numberquestions + " - " +dvc.question;  
//                    });
//					
//					d3.select("#quizSubtext").text(function()  {
//						return dvc.subtext;
//					});
//                    
//                    //reset slider
//                    $('#slider').slider("option", "min",dvc.minVal);
//                    $('#slider').slider("option", "max",dvc.maxVal);
//                    $('#slider').slider("option", "value",dvc.minVal);
//                    //reset graph panels
//                    initGraph();
//                    
//                    //new render mode
//                    dvc.render = dvc.config.config.questions[dvc.questionIndex][4];
//					
//					
//					//setSize();
//					
//
//					$('#sliderVal').css("width", '100%')
//					$("#picto").hide();
//					$("#pictoText").hide();
//					$("#bar").show();
//					
//					
//                }   else    {
//                    //deliver results
//					$("#picto").hide();
//					$("#pictoText").hide();
//					$("#bar").hide();
//					$("#sliderVal").hide();
//					$("#submitDiv").hide();
//					$("#uiContainer").hide();
//					$("#test").hide();
//					$("#results").show();
//					
//					$("#score").html(Math.round(dvc.userScore) + "<span class='picaarticle'> out of 100</span>");
//					
//                }
//                
//            });
//			
//			
//        //submit button
//        $("#submitBtn").click(function( event ) {
//                event.preventDefault();
//                event.stopPropagation();
//				disableSlider();
//				$("#submitBtn").attr("disabled","disabled").attr("class","btnDisable");
//                dvc.userAnswers[dvc.questionIndex]=$('#slider').slider("option", "value");
//                
//                
//            //compare values
//            var absDiff = Math.abs(dvc.userAnswers[dvc.questionIndex]-dvc.realAnswers[dvc.questionIndex]);
//            
//            /////////determine a score component for this answer
//            var range= (dvc.maxVal-dvc.minVal)/6;
//            var scoreMax=100/numberquestions;
//            var cont;
//            
//            if (absDiff>=0 && absDiff< range)  {
//				if(absDiff > 0) {
//                	cont=scoreMax*((range-absDiff)/range);
//				} else if(absDiff == 0) {
//					//score max points because you got it spot on
//                	cont=scoreMax;
//				}
//                
//            }   else    {
//				cont=0;
//            }
//            
//            dvc.userScore=dvc.userScore+cont;
//            
//            
//            var realDiff = dvc.userAnswers[dvc.questionIndex]-dvc.realAnswers[dvc.questionIndex];
//                
//            //animate the bar
//               setTimeout(function (){
//				    $("#actualValueText").text(dvc.prefix + Math.round(dvc.realAnswers[dvc.questionIndex]));
//			   },800)
//			   
//			   setTimeout(function (){
//				   
//               		$("#natValueText").text(dvc.prefix + Math.round(dvc.natAnswer));
//			   },1600)
//				
//				var actual = (dvc.realAnswers[dvc.questionIndex]/dvc.maxVal)*100 + "%";
//                var national = (dvc.natAnswer/dvc.maxVal)*100 + "%";
//                 
//                //animate real value
//                $("#actualReveal").animate({width:actual},800).css('overflow', 'visible');
//				
//				
//				setTimeout(function (){
//					$("#natReveal").animate({width:national},800).css('overflow', 'visible');
//				},800);
//
//				 
//				setTimeout(function (){resetBtns()},1600);
//
//				
//                
//           
//        });//end submit
//			
//
//
//	function initGraph()   {
//		//reset text
//		$("#actualValueText").html("&nbsp;");
//		$("#natValueText").html("&nbsp;");
//		$("#guessValue").html("&nbsp;");
//		
//		if(dvc.uk==true){
//			$(".natValLabel").text("UK");
//		} else {
//			$(".natValLabel").text(countryName);
//		}
//		//reset bars
//		$("#actualReveal").css("width","0%");
//		$("#natReveal").css("width","0%");
//		$("#guessReveal").css("width","0%");
//	}
//	
//	function resetBtns() {
//		
//        $("#nextBtn").show();
//        $("#submitBtn").attr("disabled",null).attr("class","btnEnable").hide();
//			
//	}
//	
//	function disableSlider() {
//		$('#slider').slider('disable');
//		
//		$("#sliderVal").css("opacity",0.3);
//			
//	}
//	
//	function enableSlider() {
//		
//				
//		$('#slider').slider('enable');
//
//		$("#sliderVal").css("opacity",1);
//			
//	}
//	
//	function setSize() {
//	
//			var quizwidth = $("#quizContent").width();
//			var contentHeightRatio = 1;
//			var contentWidthRatio = 2.39;
//			
//			contentHeight = (quizwidth/contentWidthRatio) * contentHeightRatio;
//						
//			var barheight = $("#bar").height();
//			$("#quizContent").css("height",(barheight + 20)+ "px");
//			$("#picto").css("height",contentHeight + "px");
//			$('#sliderVal').css("width", '100%');
//		
//	}
//
//
//		  });
//		  
//		  }); // End getJson
//		
//
//		});
//		
//		
//		
//    }
});