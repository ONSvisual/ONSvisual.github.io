


if (Modernizr.inlinesvg) {
	
d3.selectAll(".container").classed("hidden",false);	
	
dvc = {};

pymChild = new pym.Child();

if (pymChild) {
    pymChild.sendHeight();
}

clicked1 = false;
clicked2 = false;
clicked3 = false;
clicked4 = false;
clickedPcode = false;

q1answer = null;
q2answer = null;
q3answer = null;
q4answer = null;

firstFour = null;
myValue2 = null;
firstTimeThru = null;

var numberFormat = d3.format(".1f"); 

// _____ _             _  __     __    _                                       
//|  ___(_)_ __   __ _| | \ \   / /_ _| |_   _  ___  ___                       
//| |_  | | '_ \ / _` | |  \ \ / / _` | | | | |/ _ \/ __|                      
//|  _| | | | | | (_| | |   \ V / (_| | | |_| |  __/\__ \ 
//|_|   |_|_| |_|\__,_|_|    \_/ \__,_|_|\__,_|\___||___/ 

//Personal
	//hosehold
		burglaryValue = null;
		householdtheftValue = null;
		criminaldamageValue = null;
		theftvehicleValue = null;
	//personal
		violentValue = null;
		robberyValue = null;
//Country        	
	//hosehold
		burglaryCountry = null;
		householdtheftCountry = null;
		criminaldamageCountry = null;
		theftvehicleCountry = null;
	//personal
		violentCountry = null;
		robberyCountry = null;


//  ___                  _   _                 
// / _ \ _   _  ___  ___| |_(_) ___  _ __  ___ 
//| | | | | | |/ _ \/ __| __| |/ _ \| '_ \/ __|
//| |_| | |_| |  __/\__ \ |_| | (_) | | | \__ \
// \__\_\\__,_|\___||___/\__|_|\___/|_| |_|___/
	
	
	
d3.selectAll(".gender").on("click",function(){

        d3.selectAll(".gender").classed("active" ,false);
        d3.select(this).classed("active" ,true);
        
        if (this.id == "man") {
        d3.select("#manpic").attr('src','images/man2.png');
        d3.select("#womanpic").attr('src','images/woman.png');
        } else {
         d3.select("#womanpic").attr('src','images/woman2.png');
        d3.select("#manpic").attr('src','images/man.png');
        } 
            
        d3.selectAll(".gender").classed("franksbutton" ,false);
        d3.select(this).classed("franksbutton",true);
        
        //passes answer to data filtering function
        dvc.q1answer = d3.select(this).attr("data-nm");
            
        //Selection checker 
        clicked1 = true;
        checkIfFinished();   
		
			if (firstTimeThru == "done") {
				setTimeout(function(){lookupArea(firstFour,myValue2)},500);	
			};
		
		
})

d3.select(".manOption").on("click", function(){
		d3.select("#manpic").attr('src','images/man2.png');
		d3.select("#womanpic").attr('src','images/woman.png');
		d3.select("#manButton").style('color','#007F7F');
		d3.select("#womanButton").style('color','grey');
		
		//passes answer to data filtering function
		dvc.q1answer = "Male";
			
		//Selection checker 
		clicked1 = true;
		checkIfFinished();	
		
			if (firstTimeThru == "done") {
				setTimeout(function(){lookupArea(firstFour,myValue2)},500);	
			};
});
d3.select(".womanOption").on("click", function(){
		d3.select("#womanpic").attr('src','images/woman2.png');
		d3.select("#manpic").attr('src','images/man.png');
		d3.select("#womanButton").style('color','#007F7F');
		d3.select("#manButton").style('color','grey');
		
		//passes answer to data filtering function
		dvc.q1answer = "Female";
			
		//Selection checker 
		clicked1 = true;
		checkIfFinished();	
		
			if (firstTimeThru == "done") {
				setTimeout(function(){lookupArea(firstFour,myValue2)},500);	
			};
});


d3.selectAll(".age").on("click",function(){

		d3.selectAll(".age").classed("active" ,false);
		d3.select(this).classed("active" ,true);
		d3.selectAll(".age").classed("franksbutton" ,false);
		d3.select(this).classed("franksbutton",true);
		
		//passes answer to data filtering function
		dvc.q2answer = d3.select(this).attr("data-nm");
			
		//Selection checker 
		clicked2 = true;
		checkIfFinished();
		
			if (firstTimeThru == "done") {
				setTimeout(function(){lookupArea(firstFour,myValue2)},500);	
			};
})

d3.select("#qtwolist").selectAll("a").on("click",function(){
		var eleText = $(this).text()
		d3.select("#qtwo").html(eleText + " <span class='caret'></span>");
		d3.selectAll(".qtwolist").classed("franksdropdown" ,false);
		d3.select("#qtwo").classed("franksdropdown",true);
		
		//passes answer to data filtering function
		dvc.q3answer = d3.select(this).attr("data-nm");
			
		//Selection checker 
		clicked3 = true;
		checkIfFinished();
		
			if (firstTimeThru == "done") {
				setTimeout(function(){lookupArea(firstFour,myValue2)},500);	
			};
		
		if (pymChild) {
		   pymChild.sendHeight();
		}
})

d3.select("#qfourlist").selectAll("a").on("click",function(){
		var eleText = $(this).text()
		d3.select("#qEmp").html(eleText + " <span class='caret'></span>");
		d3.selectAll(".qfourlist").classed("franksdropdown" ,false);
		d3.select("#qEmp").classed("franksdropdown",true);
		
		//passes answer to data filtering function
		dvc.q4answer = d3.select(this).attr("data-nm");
			
		//Selection checker 
		clicked4 = true;
		checkIfFinished();
		
			if (firstTimeThru == "done") {
				setTimeout(function(){lookupArea(firstFour,myValue2)},500);	
			};

		if (pymChild) {
		   pymChild.sendHeight();
		}
})

function checkIfFinished() {
	if(clicked1 == true && clicked2 == true && clicked3 == true && clicked4 == true) {
		d3.select("#inputPcode").style("display","block");
		d3.select("#inputPcode").transition().duration(750).style("opacity",1);
		
		
			if (pymChild) {
				pymChild.sendHeight();
			}
	}
};


//  ____      _                             __                                       _                _      
// / ___| ___| |_    __ _ _ __ ___  __ _   / _|_ __ ___  _ __ ___    _ __   ___  ___| |_ ___ ___   __| | ___ 
//| |  _ / _ \ __|  / _` | '__/ _ \/ _` | | |_| '__/ _ \| '_ ` _ \  | '_ \ / _ \/ __| __/ __/ _ \ / _` |/ _ \
//| |_| |  __/ |_  | (_| | | |  __/ (_| | |  _| | | (_) | | | | | | | |_) | (_) \__ \ || (_| (_) | (_| |  __/
// \____|\___|\__|  \__,_|_|  \___|\__,_| |_| |_|  \___/|_| |_| |_| | .__/ \___/|___/\__\___\___/ \__,_|\___|
//                                                                  |_|                                      
//This section deals with the postcode input
$("#pcError").hide();
$("#successMessage").hide();

$("#pcGo").click(function( event ) {
	
			event.preventDefault();
			event.stopPropagation();
			myValue=$("#pcText").val(); 
			myValue = myValue.toUpperCase();
			//getCodes(myValue);
			clickedPcode = true;
			
			setTimeout(function(){checkIfFinished()},1000);
			
				//manual method for area lookup
				myValue2 = myValue.replace(/\s+/g, ''); 
				firstFour = myValue2.substring(0,4);
				
				lookupArea(firstFour,myValue2);
});

$("#pcText").keypress(function( event ) {
	if (event.which == 13) {
			event.preventDefault();
			event.stopPropagation();
			myValue=$("#pcText").val();
			myValue = myValue.toUpperCase();
			//getCodes(myValue);
			clickedPcode = true;
			
			setTimeout(function(){checkIfFinished()},1000);
				
				//manual method for area lookup
				myValue2 = myValue.replace(/\s+/g, ''); 
				firstFour = myValue2.substring(0,4);
				
				lookupArea(firstFour,myValue2);
	}
});

var area = null;
var country = null;
var areaNoGap = null;
var loadedFile = null;
var lookupAreaData = null;


function lookupArea(firstFour,myValue2) {
	
	firstTimeThru = "done";
	
	//referencing github repository
	d3.csv("https://cdn.ons.gov.uk/assets/postcode-to-lsoa/" + firstFour + ".csv", function(data) {
		
		lookupAreaData = data;
		
		lookupArea2(lookupAreaData);
		
		if (pymChild) {
			pymChild.sendHeight();
		}
	})
};

//function lookupArea(firstFour,myValue2) {
//	d3.csv("data/Postcodes/" + firstFour + ".csv", function(data) {
//		
//		lookupAreaData = data;
//		
//		lookupArea2(lookupAreaData);
//	})
//};

function lookupArea2(lookupAreaData) {
	
	loadedFile = lookupAreaData;
	
		if (loadedFile == null && myValue2 != null){
			$("#pcError").text("Sorry, that's not a valid postcode. Try an English or Welsh postcode eg PO15 5RR.").show();			
		}
		else {
			$("#pcError").hide();
			filteredLSOAName = loadedFile.filter(function(d) {return d.pcd_comp == myValue2});
			
			
			
			if (filteredLSOAName.length == 0){
				$("#pcError").text("Sorry, that's not a valid postcode. Try an English or Welsh postcode eg PO15 5RR.").show();	
			} else {
				
			$("#pcError").hide();
				
			//Setting up variables needed in the deprivation lookup stage
			area = filteredLSOAName[0].Lower_Super_Output_Area_Name;
			country = filteredLSOAName[0].Country_Name;
			
			areaNoGap = area.replace(/ /g,"");
			
			//Invoke the lookup function
				lookup()	
				$("#pcError").hide();	
			};
			

		}
		
		if (pymChild) {
			pymChild.sendHeight();
		}
};

//function getCodes(myPC)	{
//	var myURIstring=encodeURI("https://api.postcodes.io/postcodes/"+myPC);
//	$.support.cors = true; 
//	$.ajax({
//		type: "GET",
//		crossDomain: true,
//		dataType: "jsonp",
//		url: myURIstring,
//		error: function (xhr, ajaxOptions, thrownError) {
//				$("#pcError").text("couldn't process this request").show();
//			},
//		success: function(data1){
//			if(data1.status == 200 ){
//				
//				$("#pcError").hide();
//				area =data1.result.lsoa;
//				areaName = data1.result.admin_district;
//				areaNoGap = area.replace(" ","");
//				country = data1.result.country;
//
//					
//				lookup()
//			} else {
//	  $("#successMessage").hide();
//				$("#pcError").text("Sorry, that's not a valid postcode. Try an English or Welsh postcode eg PO15 5RR.").show();
//			}
//		} 
//
//	});
//}

// ____                  _            _   _               _             _                
//|  _ \  ___ _ __  _ __(_)_   ____ _| |_(_) ___  _ __   | | ___   ___ | | ___   _ _ __  
//| | | |/ _ \ '_ \| '__| \ \ / / _` | __| |/ _ \| '_ \  | |/ _ \ / _ \| |/ / | | | '_ \ 
//| |_| |  __/ |_) | |  | |\ V / (_| | |_| | (_) | | | | | | (_) | (_) |   <| |_| | |_) |
//|____/ \___| .__/|_|  |_| \_/ \__,_|\__|_|\___/|_| |_| |_|\___/ \___/|_|\_\\__,_| .__/ 
//           |_|                                                                  |_|    
var employment = null;

function lookup(){

	//referencing github repository
	d3.csv("https://cdn.ons.gov.uk/assets/employment-deprivation/" + areaNoGap + ".csv", function(data) {
		
		dvc.dataObj1 = data;
		
		filterdeprivation = dvc.dataObj1.filter(function(d) {  return d.LSOAname == area});
		employment = filterdeprivation[0].Employment;
		

			
				if (employment == "20% least deprived") {
					
					//populates text	
					d3.select("#empText")
						.style("display","block")
						.transition().duration(750)
						.style("opacity","1");
						
					d3.select("#empTextPopulate")
						.style("display","block")
						.text("Employment in your area is high.")
						.transition().duration(750)
						.style("opacity","1");
						
					//sorts bar					
					d3.selectAll(".unemployedBar").style("background-color","rgb(231, 231, 231)");
					d3.select(".unemploymentRow").style("display","block");
					d3.select(".unemploymentRow").transition().duration(750).style("opacity",1);
					
					d3.select(".unemployedBar1").transition().duration(750).style("background-color","#007F7F");
					
				} else if (employment == "20% most deprived") {
					
					//populates text	
					d3.select("#empText")
						.style("display","block")
						.transition().duration(750)
						.style("opacity","1");
						
					d3.select("#empTextPopulate")
						.style("display","block")
						.text("Employment in your area is low.")
						.transition().duration(750)
						.style("opacity","1");
						
					//sorts bar	
					d3.selectAll(".unemployedBar").style("background-color","rgb(231, 231, 231)");
					d3.select(".unemploymentRow").style("display","block");
					d3.select(".unemploymentRow").transition().duration(750).style("opacity",1);
					
					d3.select(".unemployedBar3").transition().duration(750).style("background-color","#007F7F");
					
				} else if (employment == "Other") {
					
					//populates text	
					d3.select("#empText")
						.style("display","block")
						.text("Crime may be higher in areas with low employment.")
						.transition().duration(750)
						.style("opacity","1");
						
					d3.select("#empTextPopulate")
						.style("display","block")
						.text("Employment in your area is neither very high nor very low.")
						.transition().duration(750)
						.style("opacity","1");
						
					//sorts bar	
					d3.selectAll(".unemployedBar").style("background-color","rgb(231, 231, 231)");
					d3.select(".unemploymentRow").style("display","block");
					d3.select(".unemploymentRow").transition().duration(750).style("opacity",1);
					
					d3.select(".unemployedBar2").transition().duration(750).style("background-color","#007F7F");
					
					
				
				}	
				
				setTimeout(function(){filter()},500);
				setTimeout(function(){filter2()},500);
	});
};  

// ____                _   _                  __ _ _ _                  _       _        
//|  _ \ ___  __ _  __| | (_)_ __      _     / _(_) | |_ ___ _ __    __| | __ _| |_ __ _ 
//| |_) / _ \/ _` |/ _` | | | '_ \   _| |_  | |_| | | __/ _ \ '__|  / _` |/ _` | __/ _` |
//|  _ <  __/ (_| | (_| | | | | | | |_   _| |  _| | | ||  __/ |    | (_| | (_| | || (_| |
//|_| \_\___|\__,_|\__,_| |_|_| |_|   |_|   |_| |_|_|\__\___|_|     \__,_|\__,_|\__\__,_|
       
	   
yourArray = null;
countryArray = null;
finalArray = null;
                                                                          	
//PERSONAL																																					
	//reading in the data
		d3.csv("data/Personal.csv", function(data) {
			dvc.dataObj = data;		
			
			data.forEach(function(d) {
				 d["Chancein1000ofbeingavictimofviolentCrime"] = +d["Chancein1000ofbeingavictimofviolentCrime"];
				 d["Chancein1000ofbeingavictimofrobberyortheftfromtheperson"] = +d["Chancein1000ofbeingavictimofrobberyortheftfromtheperson"];
				 d["Chancein1000ofbeingavictimofotherpersonaltheft"] = +d["Chancein1000ofbeingavictimofotherpersonaltheft"];
			});
		});
	//Filter the data
		function filter(){	
			filtereddata = dvc.dataObj.filter(function(d) {return d.Sex == dvc.q1answer && 
																  d.Age == dvc.q2answer && 
																  d.EmploymentStatus == dvc.q4answer && 
																  d.EmploymentDeprivation == employment});
														
																  
				violentValue = filtereddata[0].Chancein1000ofbeingavictimofviolentCrime;
				robberyValue = filtereddata[0].Chancein1000ofbeingavictimofrobberyortheftfromtheperson;
				OPTValue = filtereddata[0].Chancein1000ofbeingavictimofotherpersonaltheft;
																  
			if (country == "England") {
				
			filtereddataEngland = dvc.dataObj.filter(function(d) {return d.Sex == "All in England" && 
																  d.Age == "All in England" && 
																  d.EmploymentStatus == "All in England" && 
																  d.EmploymentDeprivation == "All in England"});
				violentCountry = filtereddataEngland[0].Chancein1000ofbeingavictimofviolentCrime;
				robberyCountry = filtereddataEngland[0].Chancein1000ofbeingavictimofrobberyortheftfromtheperson;
				OPTCountry = filtereddataEngland[0].Chancein1000ofbeingavictimofotherpersonaltheft;
					
				
			} else if (country == "Wales") {
				
			filtereddataWales = dvc.dataObj.filter(function(d) {return d.Sex == "All in Wales" && 
																  d.Age == "All in Wales" && 
																  d.EmploymentStatus == "All in Wales" && 
																  d.EmploymentDeprivation == "All in Wales"});
			    violentCountry = filtereddataWales[0].Chancein1000ofbeingavictimofviolentCrime;
				robberyCountry = filtereddataWales[0].Chancein1000ofbeingavictimofrobberyortheftfromtheperson;
				OPTCountry = filtereddataWales[0].Chancein1000ofbeingavictimofotherpersonaltheft;
			}
		}
                                                                                 	
//HOUSEHOLD																																					
	//reading in the data
		d3.csv("data/Household.csv", function(data) {
			dvc.dataObj3 = data;		 
			data.forEach(function(d) {
				 d["Chancein1000ofhouseholdbeingavictimofburglary"] = +d["Chancein1000ofhouseholdbeingavictimofburglary"];
				 d["Chancein1000ofhouseholdbeingavictimofotherhouseholdtheft"] = +d["Chancein1000ofhouseholdbeingavictimofotherhouseholdtheft"];
				 d["Chancein1000ofhouseholdbeingavictimofcriminaldamage"] = +d["Chancein1000ofhouseholdbeingavictimofcriminaldamage"];
				 d["Chancein1000ofhouseholdbeingavictimofvehiclerelatedtheft"] = +d["Chancein1000ofhouseholdbeingavictimofvehiclerelatedtheft"];
			});
		});
	//Filter the data
		function filter2(){
			filtereddata2 = dvc.dataObj3.filter(function(d) {return d.Sex == dvc.q1answer && 
																    d.Age == dvc.q2answer && 
																    d.Tenure == dvc.q3answer && 
																    d.EmploymentDeprivation == employment});
																	
																	
				burglaryValue = filtereddata2[0].Chancein1000ofhouseholdbeingavictimofburglary;
				householdtheftValue = filtereddata2[0].Chancein1000ofhouseholdbeingavictimofotherhouseholdtheft;
				criminaldamageValue = filtereddata2[0].Chancein1000ofhouseholdbeingavictimofcriminaldamage;
				theftvehicleValue = filtereddata2[0].Chancein1000ofhouseholdbeingavictimofvehiclerelatedtheft;
			
			if (country == "England") {
				
			filtereddataEngland2 = dvc.dataObj3.filter(function(d) {return d.Sex == "All in England" && 
																  d.Age == "All in England" && 
																  d.Tenure == "All in England" && 
																  d.EmploymentDeprivation == "All in England"});
				burglaryCountry = filtereddataEngland2[0].Chancein1000ofhouseholdbeingavictimofburglary;
				householdtheftCountry = filtereddataEngland2[0].Chancein1000ofhouseholdbeingavictimofotherhouseholdtheft;
				criminaldamageCountry = filtereddataEngland2[0].Chancein1000ofhouseholdbeingavictimofcriminaldamage;
				theftvehicleCountry = filtereddataEngland2[0].Chancein1000ofhouseholdbeingavictimofvehiclerelatedtheft;

				
			} else if (country == "Wales") {
				
			filtereddataWales2 = dvc.dataObj3.filter(function(d) {return d.Sex == "All in Wales" && 
																  d.Age == "All in Wales" && 
																  d.Tenure == "All in Wales" && 
																  d.EmploymentDeprivation == "All in Wales"});
				burglaryCountry = filtereddataWales2[0].Chancein1000ofhouseholdbeingavictimofburglary;
				householdtheftCountry = filtereddataWales2[0].Chancein1000ofhouseholdbeingavictimofotherhouseholdtheft;
				criminaldamageCountry = filtereddataWales2[0].Chancein1000ofhouseholdbeingavictimofcriminaldamage;
				theftvehicleCountry = filtereddataWales2[0].Chancein1000ofhouseholdbeingavictimofvehiclerelatedtheft;

			}
				
					
				
		yourArray = [violentValue,robberyValue,OPTValue,burglaryValue,householdtheftValue,criminaldamageValue,theftvehicleValue];
		countryArray = [violentCountry,robberyCountry,OPTCountry,burglaryCountry,householdtheftCountry,criminaldamageCountry,theftvehicleCountry];
		
		finalArray = d3.zip(crimeCategory,crimeTypes,yourArray,countryArray,numberArray);
				
		PopulateResults();	
		}

// ____                       ____                 _ _       
//|  _ \ _ __ __ ___      __ |  _ \ ___  ___ _   _| | |_ ___ 
//| | | | '__/ _` \ \ /\ / / | |_) / _ \/ __| | | | | __/ __|
//| |_| | | | (_| |\ V  V /  |  _ <  __/\__ \ |_| | | |_\__ \
//|____/|_|  \__,_| \_/\_/   |_| \_\___||___/\__,_|_|\__|___/
function PopulateResults(){
	d3.select("#resultsGrid").style("display","block");
	d3.select("#resultsGrid").transition().duration(750).style("opacity",1);

    //we'll draw our charts and update numbers here
    
    //first we'll give england or wales in the legend depending on pcode
    //d3.select(".countryAverages").html(function(d) { return country + " average" })
    
    //chart 1
    d3.select(".yoNum1").html(function(d) { if (isNaN(finalArray[0][2])==true) {return "Your risk: Sorry, data unavailable"}
                                            else if (finalArray[0][2] == 0) { return "Your risk: Less than 0.1%"}
                                            else {return "Your risk: " + numberFormat(finalArray[0][2]) + "%"}});
    d3.select(".avNum1").html(function(d) { if (isNaN(finalArray[0][3])==true) {return "\xa0\xa0\xa0" + country + ": Sorry, data unavailable"}
                                            else if (finalArray[0][3] == 0) { return "\xa0\xa0\xa0" + country + ": Less than 0.1%"}
                                            else {return "\xa0\xa0\xa0" + country + ": " + numberFormat(finalArray[0][3]) + "%"}});
    
    d3.select(".ViolenceBar").style("width","0%");
    d3.select(".ViolenceBar").transition().duration(2000).style("width", function(d) { return (finalArray[0][2] * 10) + "%" });
    d3.select(".ViolenceBarA").style("width","0%");
    d3.select(".ViolenceBarA").transition().duration(2000).style("width", function(d) { return (finalArray[0][3] * 10) + "%" });
    
    
    
    
    
    
    //chart 2
    d3.select(".yoNum2").html(function(d) { if (isNaN(finalArray[1][2])==true) {return "Your risk: Sorry, data unavailable"}
                                            else if (finalArray[1][2] == 0) { return "Your risk: Less than 0.1%"}
                                            else {return "Your risk: " + numberFormat(finalArray[1][2]) + "%"}});
    d3.select(".avNum2").html(function(d) { if (isNaN(finalArray[1][3])==true) {return "\xa0\xa0\xa0" + country + ": Sorry, data unavailable"}
                                            else if (finalArray[1][3] == 0) { return "\xa0\xa0\xa0" + country + ": Less than 0.1%"}
                                            else {return "\xa0\xa0\xa0" + country + ": " + numberFormat(finalArray[1][3]) + "%"}});
    
    d3.select(".RobberyandtheftfromthepersonBar").style("width","0%");
    d3.select(".RobberyandtheftfromthepersonBar").transition().duration(2000).style("width", function(d) { return (finalArray[1][2] * 10) + "%" });
    d3.select(".RobberyandtheftfromthepersonBarA").style("width","0%");
    d3.select(".RobberyandtheftfromthepersonBarA").transition().duration(2000).style("width", function(d) { return (finalArray[1][3] * 10) + "%" });
    
    
    
    
    
    
    //chart 3
    d3.select(".yoNum3").html(function(d) { if (isNaN(finalArray[2][2])==true) {return "Your risk: Sorry, data unavailable"}
                                            else if (finalArray[2][2] == 0) { return "Your risk: Less than 0.1%"}
                                            else {return "Your risk: " + numberFormat(finalArray[2][2]) + "%"}});
    d3.select(".avNum3").html(function(d) { if (isNaN(finalArray[2][3])==true) {return "\xa0\xa0\xa0" + country + ": Sorry, data unavailable"}
                                            else if (finalArray[2][3] == 0) { return "\xa0\xa0\xa0" + country + ": Less than 0.1%"}
                                            else {return "\xa0\xa0\xa0" + country + ": " + numberFormat(finalArray[2][3]) + "%"}});
    
    d3.select(".OthertheftofpersonalpropertyBar").style("width","0%");
    d3.select(".OthertheftofpersonalpropertyBar").transition().duration(2000).style("width", function(d) { return (finalArray[2][2] * 10) + "%" });
    d3.select(".OthertheftofpersonalpropertyBarA").style("width","0%");
    d3.select(".OthertheftofpersonalpropertyBarA").transition().duration(2000).style("width", function(d) { return (finalArray[2][3] * 10) + "%" });
    
    
    
    
    
    
    //chart 4
    d3.select(".yoNum4").html(function(d) { if (isNaN(finalArray[3][2])==true) {return "Your risk: Sorry, data unavailable"}
                                            else if (finalArray[3][2] == 0) { return "Your risk: Less than 0.1%"}
                                            else {return "Your risk: " + numberFormat(finalArray[3][2]) + "%"}});
    d3.select(".avNum4").html(function(d) { if (isNaN(finalArray[3][3])==true) {return "\xa0\xa0\xa0" + country + ": Sorry, data unavailable"}
                                            else if (finalArray[3][3] == 0) { return "\xa0\xa0\xa0" + country + ": Less than 0.1%"}
                                            else {return "\xa0\xa0\xa0" + country + ": " + numberFormat(finalArray[3][3]) + "%"}});
    
    d3.select(".BurglaryBar").style("width","0%");
    d3.select(".BurglaryBar").transition().duration(2000).style("width", function(d) { return (finalArray[3][2] * 10) + "%" });
    d3.select(".BurglaryBarA").style("width","0%");
    d3.select(".BurglaryBarA").transition().duration(2000).style("width", function(d) { return (finalArray[3][3] * 10) + "%" });
    
    
    
    
    
    
    //chart 5
    d3.select(".yoNum5").html(function(d) { if (isNaN(finalArray[4][2])==true) {return "Your risk: Sorry, data unavailable"}
                                            else if (finalArray[4][2] == 0) { return "Your risk: Less than 0.1%"}
                                            else {return "Your risk: " + numberFormat(finalArray[4][2]) + "%"}});
    d3.select(".avNum5").html(function(d) { if (isNaN(finalArray[4][3])==true) {return "\xa0\xa0\xa0" + country + ": Sorry, data unavailable"}
                                            else if (finalArray[4][3] == 0) { return "\xa0\xa0\xa0" + country + ": Less than 0.1%"}
                                            else {return "\xa0\xa0\xa0" + country + ": " + numberFormat(finalArray[4][3]) + "%"}});
    
    d3.select(".OtherhouseholdtheftBar").style("width","0%");
    d3.select(".OtherhouseholdtheftBar").transition().duration(2000).style("width", function(d) { return (finalArray[4][2] * 10) + "%" });
    d3.select(".OtherhouseholdtheftBarA").style("width","0%");
    d3.select(".OtherhouseholdtheftBarA").transition().duration(2000).style("width", function(d) { return (finalArray[4][3] * 10) + "%" });
    
    
    
    
    
    
    //chart 6
    d3.select(".yoNum6").html(function(d) { if (isNaN(finalArray[5][2])==true) {return "Your risk: Sorry, data unavailable"}
                                            else if (finalArray[5][2] == 0) { return "Your risk: Less than 0.1%"}
                                            else {return "Your risk: " + numberFormat(finalArray[5][2]) + "%"}});
    d3.select(".avNum6").html(function(d) { if (isNaN(finalArray[5][3])==true) {return "\xa0\xa0\xa0" + country + ": Sorry, data unavailable"}
                                            else if (finalArray[5][3] == 0) { return "\xa0\xa0\xa0" + country + ": Less than 0.1%"}
                                            else {return "\xa0\xa0\xa0" + country + ": " + numberFormat(finalArray[5][3]) + "%"}});
    
    d3.select(".CriminaldamageBar").style("width","0%");
    d3.select(".CriminaldamageBar").transition().duration(2000).style("width", function(d) { return (finalArray[5][2] * 10) + "%" });
    d3.select(".CriminaldamageBarA").style("width","0%");
    d3.select(".CriminaldamageBarA").transition().duration(2000).style("width", function(d) { return (finalArray[5][3] * 10) + "%" });
    
    
    
    
    
    
    //chart 7
    d3.select(".yoNum7").html(function(d) { if (isNaN(finalArray[6][2])==true) {return "Your risk: Sorry, data unavailable"}
                                            else if (finalArray[6][2] == 0) { return "Your risk: Less than 0.1%"}
                                            else {return "Your risk: " + numberFormat(finalArray[6][2]) + "%"}});
    d3.select(".avNum7").html(function(d) { if (isNaN(finalArray[6][3])==true) {return "\xa0\xa0\xa0" + country + ": Sorry, data unavailable"}
                                            else if (finalArray[6][3] == 0) { return "\xa0\xa0\xa0" + country + ": Less than 0.1%"}
                                            else {return "\xa0\xa0\xa0" + country + ": " + numberFormat(finalArray[6][3]) + "%"}});
    
    d3.select(".VehiclerelatedtheftBar").style("width","0%");
    d3.select(".VehiclerelatedtheftBar").transition().duration(2000).style("width", function(d) { return (finalArray[6][2] * 10) + "%" });
    d3.select(".VehiclerelatedtheftBarA").style("width","0%");
    d3.select(".VehiclerelatedtheftBarA").transition().duration(2000).style("width", function(d) { return (finalArray[6][3] * 10) + "%" });
	
	
	$("#share1").empty();
	$("#share2").empty();
	d3.select("#share").style("display","block");
	fireSocial();
	
	if (pymChild) {
			pymChild.sendHeight();
	}
};


// ____                        ____ _                _       
//|  _ \ _ __ __ ___      __  / ___| |__   __ _ _ __| |_ ___ ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//| | | | '__/ _` \ \ /\ / / | |   | '_ \ / _` | '__| __/ __|::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//| |_| | | | (_| |\ V  V /  | |___| | | | (_| | |  | |_\__ \::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//|____/|_|  \__,_| \_/\_/    \____|_| |_|\__,_|_|   \__|___/::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                                                           
crimeTypes = ["Violence","Robbery and theft from the person","Other theft of personal property*","Burglary","Other household theft**","Criminal damage","Vehicle related theft"];
crimeCategory = ["personal","personal","personal","household","household","household","vehicle"];
numberArray = [1,2,3,4,5,6,7];

function drawCharts() {	

// ____                                 _ 
//|  _ \ ___ _ __ ___  ___  _ __   __ _| |
//| |_) / _ \ '__/ __|/ _ \| '_ \ / _` | |
//|  __/  __/ |  \__ \ (_) | | | | (_| | |
//|_|   \___|_|  |___/\___/|_| |_|\__,_|_|
                                        
$("#personal").html("");

personalArray = finalArray	.filter(function(d) { return d[0] == "personal" })
var chartDivs = d3.select("#personal").selectAll('div')
	.data(personalArray)
	.enter()
	.append('div') // box for whole thing
	.style("height","50px")
	.style("margin-bottom","10px");
	
	//1st div MAIN CRIME TYPE DIV
	chartDivs.append('div')
	.style("min-width","85px")
	.style("width","100%")
	.style("float","left")
	.append('text')
	.html(function(d) { return d[1] });
	
	//2nd div YOUR RISK & 
	chartDivs.append('div')
	.attr("class","blue")
	.style("width","15%")
	.style("min-width","30px")
	.style("float","left")
	.style("text-align","right")
	.append('text')
	.html(function(d){ if(isNaN(d[2]) == true) { return "<span class='blue'>Sorry, no data</span></br><span class='orange'>" + (numberFormat(d[3])) } 
						else if (d[2] == 0) { return "<span class='blue'>Less than 1</span></br><span class='orange'>" + (numberFormat(d[3])) }
						else { return "<span class='blue'>" + (numberFormat(d[2])) + "</span></br><span class='orange'>" + (numberFormat(d[3])) }});
	

	//4th graphic container div
	chartDivs.append('div')
	.attr("id", function(d,i) {return "chart" + d[4]})
	//.style("width","85%")
	.style("float","left")
	
	
	drawGraphic(personalArray,1);
		

// _   _                      _           _     _ 
//| | | | ___  _   _ ___  ___| |__   ___ | | __| |
//| |_| |/ _ \| | | / __|/ _ \ '_ \ / _ \| |/ _` |
//|  _  | (_) | |_| \__ \  __/ | | | (_) | | (_| |
//|_| |_|\___/ \__,_|___/\___|_| |_|\___/|_|\__,_|

$("#household").html("");
                                                
householdArray = finalArray.filter(function(d) { return d[0] == "household" })
var chartDivs = d3.select("#household").selectAll('div')
	.data(householdArray)
	.enter()
	.append('div') // box for whole thing
	.style("height","50px")
	.style("margin-bottom","10px");
	
	//1st div MAIN CRIME TYPE DIV
	chartDivs.append('div')
	.style("min-width","85px")
	.style("width","100%")
	.style("float","left")
	.append('text')
	.html(function(d) { return d[1] });
	
	
	//2nd div YOUR RISK & 
	chartDivs.append('div')
	.attr("class","blue")
	.style("width","15%")
	.style("min-width","30px")
	.style("float","left")
	.style("text-align","right")
	.append('text')
	.html(function(d){ if(isNaN(d[2]) == true) { return "<span class='blue'>Sorry, no data</span></br><span class='orange'>" + d[3] } 
						else if (d[2] == 0) { return "<span class='blue'>Less than 1</span></br><span class='orange'>" + d[3] }
						else { return "<span class='blue'>" + d[2] + "</span></br><span class='orange'>" + d[3] }});
    
 
	

	//4th graphic container div
	chartDivs.append('div')
	.attr("id", function(d,i) {return "chart" + d[4]})
	//.style("width","85%")
	.style("float","left")
	
	drawGraphic(householdArray,2);

	
	
	
//__     __   _     _      _      
//\ \   / /__| |__ (_) ___| | ___ 
// \ \ / / _ \ '_ \| |/ __| |/ _ \
//  \ V /  __/ | | | | (__| |  __/
//   \_/ \___|_| |_|_|\___|_|\___|

$("#vehicle").html("");

vehicleArray = finalArray.filter(function(d) { return d[0] == "vehicle" })
var chartDivs = d3.select("#vehicle").selectAll('div')
	.data(vehicleArray)
	.enter()
	.append('div') // box for whole thing
	.style("height","50px")
	.style("margin-bottom","10px")
	.attr("class","changeHeightV");
	
	//1st div MAIN CRIME TYPE DIV
	chartDivs.append('div')
	.style("min-width","85px")
	.style("width","100%")
	.style("float","left")
	.attr("id","changeHeightV")
	.append('text')
	.html(function(d) { return d[1] });
	
	//2nd div YOUR RISK & 
	chartDivs.append('div')
	.attr("class","blue")
	.style("width","15%")
	.style("min-width","30px")
	.style("float","left")
	.style("text-align","right")
	.append('text')
	.html(function(d){ if(isNaN(d[2]) == true) { return "<span class='blue'>Sorry, no data</span></br><span class='orange'>" + d[3] } 
						else if (d[2] == 0) { return "<span class='blue'>Less than 1</span></br><span class='orange'>" + d[3] }
						else { return "<span class='blue'>" + d[2] + "</span></br><span class='orange'>" + d[3] }});
	

	//4th graphic container div
	chartDivs.append('div')
	.attr("id", function(d,i) {return "chart" + d[4]})
	//.style("width","85%")
	.style("float","left")
	
	drawGraphic(vehicleArray,3);     
	
	if (pymChild) {
			pymChild.sendHeight();
		}                   
}

// End draw charts :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// End draw charts :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// End draw charts :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// End draw charts :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::



// ____                            ____ _                _        
//|  _ \ _ __ __ ___      _____   / ___| |__   __ _ _ __| |_ ___  
//| | | | '__/ _` \ \ /\ / / __| | |   | '_ \ / _` | '__| __/ __| 
//| |_| | | | (_| |\ V  V /\__ \ | |___| | | | (_| | |  | |_\__ \ 
//|____/|_|  \__,_| \_/\_/ |___/  \____|_| |_|\__,_|_|   \__|___/ 

//smoother transitions (transition from previous point)
var blueWidth = 0;
var orangeWidth = 0;

function drawGraphic(data,sectionNumber) {

		 	graphic = $(".sec" + sectionNumber);
		 
		 	//set variables for chart dimensions dependent on width of #chart
//		   if (graphic.width() < threshold_sm) {        	
//		           var margin = {top: dvc.optional.margin_sm[0], right: dvc.optional.margin_sm[1], bottom: dvc.optional.margin_sm[2], left: dvc.optional.margin_sm[3]}; 
//					var graphic_width = graphic.width() - margin.left - margin.right;
//		           height = (dvc.essential.barHeight * graphic_data.length) + margin.top + margin.bottom;
//		   } else if (graphic.width() < threshold_md){
//		       	var margin = {top: dvc.optional.margin_md[0], right: dvc.optional.margin_md[1], bottom: dvc.optional.margin_md[2], left: dvc.optional.margin_md[3]}; 
//					var graphic_width = graphic.width() - margin.left - margin.right;
//		           height = (dvc.essential.barHeight * graphic_data.length) + margin.top + margin.bottom;
//		 	} else {
//		       	var margin = {top: dvc.optional.margin_lg[0], right: dvc.optional.margin_lg[1], bottom: dvc.optional.margin_lg[2], left: dvc.optional.margin_lg[3]}
//					var graphic_width = graphic.width() - margin.left - margin.right;
//				   height = (dvc.essential.barHeight * graphic_data.length) + margin.top + margin.bottom;
//			}	

			barheight = 15;
			margin = {}
			margin.left = 275;
			margin.right = 15;
			margin.top = 20;
			margin.bottom = 40;
			graphic_width = graphic.width() - margin.left - margin.right;
			var height = data.length * barheight + margin.top + margin.bottom;
			
			if(sectionNumber ==3) {
				var height = 10;
			};
			

		   // clear out existing graphics
		   graphic.empty();
			
			x = d3.scale.linear()
		       .range([ 0, graphic_width]);

			y = d3.scale.ordinal()
				.rangePoints([0, height], .1)
			
		   y.domain(data.map(function(d) {
					return d[1];
				}))
				
		
		   var yAxis = d3.svg.axis()
		       .scale(y)
		       .orient("left")
		   
		   xAxis = d3.svg.axis()
		       .scale(x)
		       .orient('bottom')
				.tickSize(height + margin.top + margin.bottom - 30, 0, 0);
							

			 //gridlines
		    var y_axis_grid = function() { return yAxis; }
	
		   x.domain([0,10]);
		   
						
		   //create svg for chart
		   var svg = d3.select(".sec" + sectionNumber).append('svg')
				       .attr("width", graphic_width + margin.left + margin.right)
				       .attr("height", height + margin.top + margin.bottom)
				       .append("g")
				       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
					svg.append("rect")
						.attr("class","svgRect")
						.attr("width", graphic_width)
						.attr("height", height);
			   
				   svg.append('g').attr("id","xAxis" + sectionNumber)
				       .attr('class', 'x axis')
				       .attr("transform", "translate(0,0)")
					   .style("display","none")//got rid of axis
				       .call(xAxis);
						

					//create y axis, if x axis doesn't start at 0 drop x axis accordingly	
					svg.append('g')
						.attr("id","yAxis")
				       .attr('class', 'y axis')
					   .attr("text-anchor","start") 
				       .call(yAxis);
				
			
		//bars on the chart...................................................
					
			svg.append('g').attr("class","bars").selectAll('.blah')
					.data(data)
					.enter()
					.append('rect')
					.attr('id',function(d,i){return "bar" + i})
					.attr("width", 0)
					.attr("fill","#007F7F")	
					.attr('class', "bar bar_pos teelBar")
					.transition()
					.duration(1000)
					.attr("width", function(d) { return x(d[2]);})
					// .attr("width",0)
					.attr("x",x(0))
					.attr("y", function(d) { return y(d[1]);})
					.attr("height",19); // y.rangeBand());
		
			svg.append('g').attr("class","bars").selectAll('.gary')
					.data(data)
					.enter()
					.append('rect')
					.attr('id',function(d,i){return "bar" + i})
					.attr("width", 0)
					.attr("fill","rgb(247,147,30)")	
					.attr('class', "bar bar_pos orangeBar")
					.attr("transform","translate(0,19)")
					.transition()
					.duration(1000)
					.attr("width", function(d) { return x(d[3]);})
					// .attr("width",0)
					.attr("x",x(0))
					.attr("y", function(d) { return y(d[1]);})
					.attr("height",19); // y.rangeBand());
					
								
					
		//text elements to the left of the chart............................
					
			svg.append('g')
					.selectAll('.watermelon')
					.data(data)
					.enter()
					.append('text')
					.text(function(d) { 
						if (isNaN(d[2]) == true) { return "data unavailable***";}
						else { return numberFormat(d[2]) + "%";};
					})
					.attr('class', "blue")
					.style("opacity",0)
					.style("text-anchor","start")
					.style("font-weight","bold")
					.attr("x",-35)
					.attr("y", function(d) { return y(d[1]) + (barheight / 2) + 6})
					.transition()
					.duration(1000)
					.style("opacity",1);
					
			svg.append('g')
					.selectAll('.stubentiger')
					.data(data)
					.enter()
					.append('text')
					.text(function(d) { 
						if (isNaN(d[3]) == true) { return "data unavailable***";}
						else { return numberFormat(d[3]) + "%";};
					})
					.attr('class', "orange")
					.style("opacity",0)
					.style("text-anchor","start")
					.style("font-weight","bold")
					.attr("x",-35)
					.attr("y", function(d) { return y(d[1]) + barheight + 17})
					.transition()
					.duration(1000)
					.style("opacity",1);
					
			svg.append('g')
					.selectAll('.watermelon')
					.data(data)
					.enter()
					.append('text')
					.text(" ")
					.attr('class', "chlab")
					.style("opacity",0)
					.style("text-anchor","start")
					.attr("x",-115)
					.attr("y", function(d) { return y(d[1]) + (barheight / 2)})
					.transition()
					.duration(1000)
					.style("opacity",1);
					
			svg.append('g')
					.selectAll('.stubentiger')
					.data(data)
					.enter()
					.append('text')
					.text(country + " average")
					.attr('class', "chlab")
					.style("opacity",0)
					.style("text-anchor","start")
					.attr("x",-115)
					.attr("y", function(d) { return y(d[1]) + barheight + 17})
					.style("opacity",1);
		
				
						
			d3.selectAll('#yAxis').selectAll('text')
				.attr("transform", "translate(-35,8)")
				.attr("class","crimeType")
				.style("font-size","14px")
				.style("colour","grey")
				.style("text-anchor","end"); 
				
			d3.selectAll('#yAxis').selectAll('tick').selectAll("text")
				.attr("class","crimeType")
				.style("font-size","14px")
				.style("text-anchor","start"); 

			d3.selectAll('.chlab')
				.attr("transform", "translate(70,0)")
				.style("text-anchor","end"); 
				
				
		$("#share1").empty();
		$("#share2").empty();
		d3.select("#share").style("display","block");
		fireSocial();
				

				
//	rescale(height, sectionNumber);
	

						
			//use pym to calculate chart dimensions	
		   if (pymChild) {
		       pymChild.sendHeight();
		   }
		

	}







//
//function rescale(currentHeight, sectionNumber) {
//	
//	xAxis = d3.svg.axis()
//		   .scale(x)
//		   .orient('bottom')
//		   .tickSize(currentHeight + margin.top + margin.bottom - 30, 0, 0);
//	
//	x.domain([0,10]);
//	
//	d3.select("#xAxis" + sectionNumber)
//			.transition()
//			.delay(4000)
//			.duration(1500)
//			.call(xAxis);  
//			
//	d3.selectAll(".teelBar")
//		.transition()
//		.delay(4000)
//		.duration(1500)
//		.attr("width", function(d) { return x(d[2]);})	
//		
//	d3.selectAll(".#orangeBar")
//		.transition()
//		.delay(4000)
//		.duration(1500)
//		.attr("width", function(d) { return x(d[3]);})		
//	
//}


//Social media
function fireSocial() {

if(document.referrer == ""){
	urlshare = document.URL;
} else {
	urlshare = document.referrer;	
}
	
	
d3.select("#share1").append("a")
	.attr("href","https://www.facebook.com/sharer/sharer.php?u=" + urlshare)
	.attr("target","_blank")
	.attr("class","share")
	.style("display","block")
	.style("height","25px")
	.style("width","25px")
	.style("background","#3B5998")
	.style("margin-top","5px")
	.style("margin-bottom","10px")
	.append("img")
	.style("padding-left","5px")
	.style("padding-top","5px")
	.attr("src","./images/facebook.svg");
	
d3.select("#share2").append("a")
	.attr("href",encodeURI("https://twitter.com/intent/tweet?text=Find out your chance of experiencing burglary, violent crime and car crime at " + urlshare))
	.attr("target","_blank")
	.attr("class","share")
	.style("display","block")
	.style("height","25px")
	.style("width","25px")
	.style("background","#4099FF")
	.append("img")
	.style("height","22px")
	.style("width","22px")
	.style("padding-left","3px")
	.style("padding-top","3px")
	.attr("src","./images/twitter.svg");
}

//methodology section

var more = "inactive";

d3.select("#moreMethodology").on("click", function(){
		if(more == "inactive"){
			d3.select("#moreMethodology").text("Less...");
			d3.select("#methodologytext1").text("These estimations are based on data from the CSEW victimisation survey, for the years ending March 2014 to March 2016, in which adults from the resident household population are asked about their experiences of crime over the preceding 12-month period as well as about various demographic and personal characteristics.  ‘Your likelihood’  is based on the estimated proportion of individuals in England or Wales (who have characteristics similar to yours) having been a victim of a crime.")
			d3.select("#methodologytext2").style("display","block");
			d3.select("#methodologytext3").text("Characteristics which are fed into the risk of burglary, other household theft, criminal damage and vehicle crime include; age, sex, housing tenure as well as the recorded level of employment deprivation in your local area. ")
			d3.select("#methodologytext4").text("Whilst there is an association between these demographics and crime risk, it is important to note, that there is no evidence to show that sex, age, employment status or home ownership have a direct causal relationship to your risk of experiencing crime. We are unable to explain the causal mechanisms behind these relationships. There are a number of other factors measured and unmeasured by the CSEW, that may mitigate or enhance associations between demographics and the risk of victimisation (such as safety and risk taking behaviours). It is also likely that a number of lifestyle factors associated with these demographics, contribute to the relationships observed by the CSEW.")
		
			 more = "active"
			 
		   if (pymChild) {
		       pymChild.sendHeight();
		   }
			 
		} else if (more == "active"){
			
			d3.select("#moreMethodology").text("More...");
			d3.select("#methodologytext1").text("These estimations are based on data from the CSEW victimisation survey...")
			d3.select("#methodologytext2").style("display","none")
			d3.select("#methodologytext3").text("")
			d3.select("#methodologytext4").text("")
			
			 more = "inactive"	
			 
		   if (pymChild) {
		       pymChild.sendHeight();
		   }
		   	
		}
});

} else {
	
		d3.select("#altern").attr("class","show");	
	
		var pymChild = new pym.Child();
		
		setInterval(function(){pymChild.sendHeight();},1000)
	
}