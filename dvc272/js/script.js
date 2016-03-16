//namespace any global variables
var dvc = {}; 


if (Modernizr.inlinesvg)
{	
	pymChild = new pym.Child();
	//remove preview image/message if browser suppports SVG
	$("#altern").remove();

	//Load main script/data
	$(document).ready(function()
	{	
		
//		if (window.innerHeight > window.innerWidth) {
//			alert("hello");
//			$(".container-fluid").hide();
//			
//		}


drawsliderOnce = 0;

function handleOrientation() {
	
	width = $(".container-fluid").width();
	
	console.log(width);
	console.log(window.innerHeight)
	console.log(window.innerWidth)
	

			if(width<=400){
					$("#main").hide(); 
					$("#rotate").show();
				} else { 
					$("#main").show();
					drawSlider();
					$("#rotate").hide();
				}
			
	} 
	
	handleOrientation();
	
	$(window).resize(handleOrientation);
	
	function drawSlider() {
		
		if(drawsliderOnce == 0){
		
		
		console.log("I've started to draw and I'm not supposed to");
		
		//main script
		Totalspent = 257562;
		
		ActualSplit = [107966,40760,3473,26569,44358,34437];
		
		classes = ["first","second","third","fourth","fifth","sixth"];
		
//Pensions	83,527	87,306	93,699	100,939	104,442	41.6
//Incapacity, disability and injury benefits	30,626	32,372	33,916	36,416	37,537	14.9
//Unemployment benefits	5,533	5,231	5,633	5,939	4,945	2.0
//Housing benefits	22,812	24,399	25,366	26,360	26,386	10.5
//family benefits, income support and tax credits	21,943	21,282	20,308	18,484	16,134	6.4
//Personal social services and other benefits	58,560	59,807	61,075	62,336	61,828	24.6
		
		$("#revealslide").hide();
		$(".textResult").hide();
		
		categories = ["Pensions","Incapacity, disability & injury benefits","Unemployment benefits","Housing benefits","Family benefits, income support & tax credits","Personal social services and other benefits"];
		
		$.fn.digits = function(){ 
			return this.each(function(){ 
				$(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
			})
		}
		
		$("#submitbutton").click(revealresult);
		
		for(i = 0; i < classes.length; i++) {
			
			var percentshare =  Math.round((ActualSplit[i] / Totalspent)*100);
			var startshare = Math.round(Totalspent/classes.length);
			var startshareper = Math.round(100/classes.length);
			
			
			$("#revealrow").append('<td class="' + classes[i] + '" width=' + percentshare + '%</td>');
			$("#textrev" + i).append("<span>£" + Math.round(ActualSplit[i]/1000).toLocaleString() + "bn</span><br>" + percentshare + "%");
			$("#initialrow").append('<td class="' + classes[i] + '" width=' + startshare + '%</td>');
			$("#textnx" + i).append("<span>£" + Math.round(startshare/1000).toLocaleString() + "bn</span><br>" + Math.round(startshareper) + "%");

		};
	
	

	$(function(){	

		//callback function
		var onSlide = function(e){
			var columns = $(e.currentTarget).find("td");
			
			var ranges = [], total = 0, i, s ="Ranges: ", w;
			for(i = 0; i<columns.length; i++){
				w = columns.eq(i).width()-10 - (i==0?1:0);
				ranges.push(w);
				total+=w;
			}
					 
			for(i=0; i<columns.length; i++){	
			
				ranges[i] = 100*(ranges[i]/total);
				carriage = ranges[i]-w
				
				s =Math.round(ranges[i]) + "%";	
				number = Math.round((ranges[i]/1000)*Totalspent)
				
				$("#textnx" + i).html("<span>£" + Math.round(number/100).toLocaleString() + "bn</span><br> ("+ s + ")");
		
			}
			
			if (pymChild) {
		        pymChild.sendHeight();
		    }		
			//s=s.slice(0,-1);			
		}
		
		//colResize the table
		$("#range").colResizable({
			liveDrag:true, 
			draggingClass:"rangeDrag", 
			gripInnerHtml:"<div class='rangeGrip'></div>", 
			onResize:onSlide,
			minWidth:8
			});
	
	});	


}
		
		
	function revealresult() {
		$("#revealslide").show();
		$(".textResult").show();
		$("#submitbutton").addClass("hidden");
		$('#slider').attr("disabled",'disabled');
		$('#slider').css("pointer-events","none");
		$(".JCLRgrip").addClass("hidden");
			if (pymChild) {
		        pymChild.sendHeight();
		    }

	}

		drawsliderOnce = 1;
	}
	
	}
	) 
	
}

