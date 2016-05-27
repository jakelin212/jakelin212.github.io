/**
 * Return an Object sorted by it's Key
 */
var sortObjectByKey = function(obj){
    var keys = [];
    var sorted_obj = {};

    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            keys.push(key);
        }
    }

    // sort keys
    keys.sort();

    // create new array based on Sorted Keys
    jQuery.each(keys, function(i, key){
        sorted_obj[key] = obj[key];
    });

    return sorted_obj;
};

function showRefMap(){
	$( "#container" ).show();
	$( "#showref" ).show();
	$( "#hideref" ).show();  	
}

function hideRefMap(){
        $( "#container" ).hide();
        $( "#showref" ).show();
        $( "#hideref" ).hide();
}

function prepshemap(){
	//if mapdata 
}

function gotcgax(){
	tcga_tsne_mode = 1;	
	gotcga("hexpmap");
	//tcga_tsne_mode = 0;	
}

function gotcga(mapcontainer){
 	mapcontainer = mapcontainer || "container";
 	$( "#mapprogress" ).html("Preparing TCGA map ..." + "<img src='http://jakelin212.github.io/images/progress.gif' />");
        $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_hema_tcga.cgi",
                        data: {'inparameter': 'na','column': 'cats'},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
                                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
				$("#pw_source").val("TCGA");
                                var jo  = $.parseJSON(json);
                                var _data = jo["pts"];
                                var  _series1 = [];
				var _series2 = [];
				var _series3 = [];
				var _series4 = [];
				var _series5 = [];
				var _series6 = [];
				var _series7 = [];
				var scluster = jo["scluster"];
				var annocluster = jo["annocluster"];
				for (var d in _data){
					var _sa = [];
					var x = parseFloat(_data[d][0]);
					var y = parseFloat(_data[d][1]);
					_sa.push(x);
					_sa.push(y);
					var cl = scluster[_data[d][0] + "," + _data[d][1]];
					if (cl == 1)
						_series1.push(_sa);
					if (cl == 2) 
                                                _series2.push(_sa);  
					if (cl == 3)
                                                _series3.push(_sa); 
					if (cl == 4)
                                                _series4.push(_sa); 
					if (cl == 5)
                                                _series5.push(_sa); 
					if (cl == 6)
                                                _series6.push(_sa); 
					if (cl == 7)
                                                _series7.push(_sa); 	
					var ancl = annocluster[_data[d][0] + "," + _data[d][1]];
					if (tcga_annoseries[ancl] == null)
						tcga_annoseries[ancl] = [];
					tcga_annoseries[ancl].push(_sa);
				}
				tcgasamples = jo["samples"];
				gsms = jo["barcodes"];
				var _annoseries = [];
				//var sortseries = sortObjectByKey(tcga_annoseries);
				for (var ts in sortObjectByKey(tcga_annoseries)){
					var _tsobj = {type:'scatter',
                                	name: ts,
                                	color: tcga_annocolors[ts],
                                	marker: {
                                	symbol: 'circle'
                                	},
                                	data: tcga_annoseries[ts]};
					_annoseries.push(_tsobj);
				}
        			var tcga_series = [
         			{type:'scatter',
            			name: 'Cluster 1',
            			color: '#E41A1C',
            			marker: {
                		symbol: 'circle'
            			},
            			data: _series1
        			},
				{type:'scatter',
                                name: 'Cluster 2',
                                color: '#377EB8',
                                marker: {
                                symbol: 'circle'
                                },
                                data: _series2
                                },
				{type:'scatter',
                                name: 'Cluster 3',
                                color: '#4DAF4A',
                                marker: {
                                symbol: 'circle'
                                },
                                data: _series3
                                },
				{type:'scatter',
                                name: 'Cluster 4',
                                color: '#984EA3',
                                marker: {
                                symbol: 'circle'
                                },
                                data: _series4
                                },
				{type:'scatter',
                                name: 'Cluster 5',
                                color: '#FF7F00',
                                marker: {
                                symbol: 'circle'
                                },
                                data: _series5
                                },
				{type:'scatter',
                                name: 'Cluster 6',
                                color: '#FFFF33',
                                marker: {
                                symbol: 'circle'
                                },
                                data: _series6
                                },
				{type:'scatter',
                                name: 'Cluster 7',
                                color: '#A65628',
                                marker: {
                                symbol: 'circle'
                                },
                                data: _series7
                                }
				];
				//check if the plotting is for numeric clusters or annotation clusters
				if (tcga_tsne_mode == 0){
					plotTcga(_annoseries, "", mapcontainer);
					tcga_tsne_mode = 1;
					$("#tcgactl").html('<a href="#" onclick="javascript:gotcga();"><font color="blue">View TCGA t-SNE Cluster Map</font></a>');
					$("#tcgactlx").html('<a href="#" onclick="javascript:gotcgax();"><font color="blue">View TCGA t-SNE Cluster Map</font></a>');
				}else{
					plotTcga(tcga_series, "", mapcontainer);
					tcga_tsne_mode = 0;
					$("#tcgactl").html('<a href="#" onclick="javascript:gotcga();"><font color="blue">View TCGA Annotation Cluster Map</font></a>');
					$("#tcgactlx").html('<a href="#" onclick="javascript:gotcga(\'hexpmap\');"><font color="blue">View TCGA Annotation Cluster Map</font></a>');
				}
				$("#stainctl").hide();
				$("#tcgactl").show();
				$("#tcgactlx").show();
					
		},
			error: function(){
				alert("system error");
			}
	});
}

function plotTcga(series, gene, mapcontainer){
	mapcontainer = mapcontainer || "container";
	var title = "TCGA AML";
	if (gene != ""){
		title = title + " e-staining " + gene;
	}
	var adjwidth = $(window).width()*.72;
	if  (showcentroids == true && mapcontainer != "container"){
		adjwidth = $(window).width()*.6;
               var acentroids = {
                type: 'bubble',
                name:'Clusters',
                data: tcga_clusters,
                marker: {
                        fillOpacity:0.1
                },
                events:{
                    click: function (e){
                        $("#pwpwfeature").val("cancermap_cluster_" + e.point.name);
                        search_pwpw(); 
		    }
                }
              };
            series.push(acentroids);
        }
	$('#' + mapcontainer).highcharts({
        chart: {
            zoomType: 'xy',
	    width: adjwidth,	
            height: adjwidth, 
            events: {
                selection: function (event) {
                        if (event.xAxis != null){
                                var minx = event.xAxis[0].min;
                                var maxx = event.xAxis[0].max;
                                var miny = event.yAxis[0].min;
                                var maxy = event.yAxis[0].max;
                		findSelectedGSM(minx, miny, maxx, maxy);
		        }
                }
            },//events
        },
        title: {
            text: title
        },
        xAxis: {
            title: {
                enabled: true,
                text: 't-SNE'
            },gridLineWidth: 1,
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
	yAxis: {
            title: {
                enabled: true,
                text: 'Samples'
            }
	},
	credits: {
                enabled: false
       },
        exporting: {
        sourceHeight: 800,
        sourceWidth: 1200,
        scale: 1,
	filename: "hemap_tcga_laml",
        buttons: {
            contextButton: {
                menuItems: buttons.slice(0,6)
            }
        }},
        s: {
            title: {
                text: 't-SNE'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
	plotOptions: {
	    bubble:{
               tooltip: {
                    headerFormat: '<b>Sample Cancermap cluster</b><br>'
                    ,pointFormat: 'Click for paired wise results and GSM'
                 },
                color: 'rgba(200,70,67,1)',
                marker: {
                        fillOpacity:0.1
                },
                minSize:16,
                maxSize: 17,
                dataLabels: {
                    enabled: true,
                        formatter: function() {
                        return this.point.name;
                    }
                }
           },
            scatter: {
                marker: {
                    radius: symSize+1,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x},{point.y}' +  'click for cbio details'
                },
                events: {
                        click: function(e){
                                var pxstr = e.point.x;
                                var pystr = e.point.y;
                                for (var po in gsms){
                                        var ptstr = po.split(",");
                                        if (parseFloat(ptstr[0]) == e.point.x && parseFloat(ptstr[1]) == e.point.y){
						var tid = gsms[po];
						tid = tid.replace(/\./g,'-');
                                                window.open('http://www.cbioportal.org/case.do?sample_id='+ tid + '&cancer_study_id=laml_tcga_pub');//,'_blank';//GSM1226121
                                                return;
                                        }
                                }
                        }
                 }, 	
	      point: {
               events: {
                        mouseOver: function (e) {
                            $("#reporting").html(' GSM ' + gsms[e.target.x + ',' + e.target.y]);
			 }
                        ,mouseOut: function () {
                            $("#reporting").html('');
                        }
               }
            }
        },//end scatter
	},//end plotOptions
	series:series
    });
    $("#stainctl").show();
    $( "#mapprogress" ).html("");	
}

function plotStainedMap(mapsource, jo, stainedobj, mapcontainer){
        var adjwidth = $(window).width()*.72;
	$("#stainctl").show();
        $("#tcgactl").hide();
	$("#tcgactlx").hide();
	mapcontainer = mapcontainer || "container";
        $("#sgsmannolink").html("");
	$("#mapconfig").html("");
	var _title = "HEMAP samples";
	if (stainedobj.name != null){
		_title = _title + " " + stainedobj.name;
	}
        if (mapsource == "leukemia"){
                _title = "Leukemia_Normal";
        }
        $( "#mapprogress" ).html("Preparing " + _title + " map ..." + "<img src='http://jakelin212.github.io/images/progress.gif' />");
	var cmlset = jo["CML"];
        var amlset = jo["AML"];
        var blymphoid = jo["B-Lymphoid"];
        var bclset = jo["BCL"];
        var cllset = jo["CLL"];
        var cmlset = jo["CML"];
        var celllineset = jo["CellLine"];
        var lpset = jo["LP"];
        var mmset = jo["MM"];
        var mpset = jo["MP"];
        var myeloid = jo["Myeloid"];
        var lymphoid = jo["Lymphoid"];
        var erythroid = jo["Erythroid"];
        var stemcellset = jo["StemCell"];
        var tallset = jo["T-ALL"];
        var tlymphoid = jo["T-Lymphoid"];
        var tcl = jo["TCL"];
        var preb = jo["pre-B-ALL"];
	var shemap_series = [
         {type:'scatter',
            name: 'AML',
            color: '#C0C0C0',
        marker: {
                symbol: 'circle'
            },
            data: amlset
        },
        {type:'scatter',
            name: 'CML',
            color: '#C0C0C0',
        marker: {
                symbol: 'circle'
            },
            data: cmlset
        },
        {
            type:'scatter',
            name: 'MM',
            color: '#C0C0C0',
        marker: {
                symbol: 'circle'
            },
            data: mmset
        },
        {
        type:'scatter',
            name: 'MP',
            color: '#C0C0C0',
        marker: {
                symbol: 'circle'
            },
            data: mpset
        },
        {
        type:'scatter',
            name: 'LP',
            color: '#C0C0C0',
        marker: {
                symbol: 'circle'
            },
            data:  lpset
        },
{
        type:'scatter',
            name: 'T-ALL',
            color: '#C0C0C0',
        marker: {
                symbol: 'circle'
            },
            data:  tallset
        },
{
        type:'scatter',
            name: 'TCL',
            color: '#C0C0C0',
                marker: {
                symbol: 'circle'
            },
            data:  tcl
        },
        {
        type:'scatter',
            name: 'pre-B-ALL',
            color: '#C0C0C0',
            marker: {
                symbol: 'circle'
            },
            data:  preb
        },
        {
            type:'scatter',
            name: 'BCL',
            color: '#C0C0C0',
            data: bclset,
            marker: {
                symbol: 'circle'
            }
        },
 {
            type:'scatter',
            name: 'CLL',
            color: '#C0C0C0',
            marker: {
                symbol: 'circle'
            },
            data: cllset
        },
        {type:'scatter',
            name: 'Erythroid',
            color: '#C0C0C0',
        marker: {
                symbol: 'triangle'
            },
            data: erythroid
        },
{
        type:'scatter',
            name: 'B-Lymphoid',
            color: '#C0C0C0',
            data:  blymphoid,
            marker: {
                symbol: 'triangle'
            }
        },
        {
        type:'scatter',
            name: 'T-Lymphoid',
            color: '#C0C0C0',
                marker: {
                symbol: 'triangle'
            },
            data:  tlymphoid
        },
        {
            type:'scatter',
            name: 'Myeloid',
            color: '#C0C0C0',
        marker: {
                symbol: 'triangle'
            },
            data: myeloid
        },
{
        type:'scatter',
            name: 'StemCell',
            color: '#C0C0C0',
        marker: {
                symbol: 'triangle'
            },
            data:  stemcellset
        },
        {
            type:'scatter',
            name: 'CellLine',
            color: '#C0C0C0',
            marker: {
                symbol: 'diamond'
            },
            data: celllineset
        }
	];//end shemap series
        shemap_series.push(stainedobj);
	$("#showref").hide();
	$("#hideref").hide();
	$( "#mapprogress" ).html("Plotting ..." + "<img src='http://jakelin212.github.io/images/progress.gif' />");
        $('#' + mapcontainer).highcharts({
        chart: {
            zoomType: 'xy',
	    width: adjwidth,   
            height: adjwidth,
            events: {
                selection: function (event) {
			if (event.xAxis != null){
                		var minx = event.xAxis[0].min;
                        	var maxx = event.xAxis[0].max;
                        	var miny = event.yAxis[0].min;
                        	var maxy = event.yAxis[0].max;
			}
                }
            },//events
	},
        title: {
            text: _title
        },
        xAxis: {
            title: {
                enabled: true,
                text: 't-SNE'
            },gridLineWidth: 1,
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
	yAxis: {
            title: {
                enabled: true,
                text: 'GSM'
            }
        },
	exporting: {
        sourceHeight: 800,
        sourceWidth: 1200,
	scale: 1,
	filename: "hemap_fig",
	buttons: {
            contextButton: {
                menuItems: buttons.slice(0,6)
            }
        }
        },
	s: {
            title: {
                text: 't-SNE'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        /*legend: {
            layout: 'vertical',
            align: legendalign,
            verticalAlign: 'top',
            x: legendx,
            y: legendy,
            floating: true,
	    enabled: legendenabled,
            backgroundColor:  (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
            borderWidth: 0
        },*/
	 plotOptions: {
            scatter: {
                marker: {
                    radius: symSize,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
               headerFormat: '<b>{series.name}</b><br>'
                    ,pointFormat: '{point.x}, {point.y}<br>click:add gsm/view geo' //+ gsms[{point.x} + "_" + {point.y}]
		 }
		,events: {
			click: function(e){
                                var pxstr = e.point.x;
                                var pystr = e.point.y;
                                for (var po in gsms){
                                        var ptstr = po.split("_");
                                        if (parseFloat(ptstr[0]) == e.point.x && parseFloat(ptstr[1]) == e.point.y){
                                                $("#gsmmapcontainer").append(gsms[po] + " ");
                                                //window.open('http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc='+gsms[po]),'_blank';//GSM1226121
						return;
                                        }
                                }
                        }
               }
	,point: {
                    events: {
                        mouseOver: function (e) {
                            $("#reporting").html(' GSM ' + gsms[e.target.x + '_' + e.target.y]);
                        }
                        ,mouseOut: function () {
                            $("#reporting").html('');// GSM x: ' + this.x + ', y: ' + this.y);
                        }
                    }
                }
	   }, //end scatter plot Options
	   /*,series: {
                point: {
                    events: {
                        mouseOver: function () {
                            $("#reporting").html(' GSM x: ' + this.x + ', y: ' + this.y);
                        }
                    }
                }
	   }*/
        },//end of plotOptions
	credits: {
                enabled: false
       },
        series:shemap_series
    });
    $("#stainctl").show();
    $( "#mapprogress" ).html("");
}

function goshemap(mapsource, mapdata, stainsource, mapcontainer){
	$("#stainctl").show();
	$("#tcgactl").hide();
	$("#tcgactlx").hide();
        mapcontainer = mapcontainer || "container";
	var stainedobj = null;
	if (mapsource.indexOf("GeneEStain") != -1 || mapsource.indexOf("PWEStain") != -1 || mapsource.indexOf("ClusterEStain") != -1){
		$('#stainedcontainer').show(); 
		var gin = mapsource.split(":")[1];
		var lowl = "Low ";
		var medl = "Medium ";
		var highl = "High ";
		if (mapsource.indexOf("ClusterEStain") != -1){
			lowl = "0 ";
                	medl = "NA ";
                	highl = "1 ";
		}
		var lowobj = {
                                type: 'scatter',
                                name: lowl + gin,
                                marker: {
                                        symbol: 'square'
                                },
                                color: lowcolor,
                                fillColor: {
                                        radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 }
                                },
                                data: stainsource["low"]
                };
		var mediumobj = {
                                type: 'scatter',
                                name: medl + gin,
                                marker: {
                                        symbol: 'square'
                                },
                                color: medcolor,
                                fillColor: {
                                        radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 }
                                },
                                data: stainsource["medium"]
                };
		var highobj = {
                                type: 'scatter',
                                name: highl + gin,
                                marker: {
                                        symbol: 'square'
                                },
                                color: highcolor,
                                fillColor: {
                                        radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 }
                                },
                                data: stainsource["high"]
                };	
		smmode = "hema_gexp";
		if (mapsource.indexOf("PWEStain") != -1)
			smmode = "hema_pw";	
		plotGeneStainedMap(mapsource.split(":")[1], mapdata, {"low":lowobj, "medium":mediumobj, "high":highobj},mapcontainer);	
	}else if (stainsource != null && mapdata != null){
		for (var akey in stainsource){
			var scolor = $("#color2").val();
			if (scolor == null)
				scolor = "#3355cc";
			stainedobj = {
        			type: 'scatter',
        			name:akey,
				marker: {
                			symbol: 'square'
            			},	
				color: scolor,
				fillColor: {
                    			radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 }
				},
            			data: stainsource[akey]
        		};
		}	
		plotStainedMap(mapsource, mapdata, stainedobj,mapcontainer);
	}else{
	$('#stainedcontainer').hide(); 
	//if mapdata is null, then it is init, pass prep_shemap	
	var _title = "HEMAP samples";
	if (mapsource == "aml"){
		_title = "AML Fusions";
		$("#pw_source").val("aml");
	}
	if (mapsource == "all"){
                $("#pw_source").val("all");
        }
	//catcolors = {"AML":"#3cb371","CML":"#006400","MM":"#8b475d","MP":"#caff70","LP":"#cc8540","T-ALL":"#6495ed","TCL":"#27408b","pre-B-ALL":"#ed82ed","BCL":"#bb8e8e","CLL":"#a020f0","LP":"#658a8a","Erythroid":"#cc8540","B-Lymphoid":"#fe1392","T-Lymphoid":"#00fefe","Myeloid":"#658a8a","StemCell":"#feb90f","CellLine":"#00d9b3","No fusions":"#696969", "t8;21 RUNX1-RUNT1X1":"#00FFFF", "inv16 CBF-MYH":"#FF00FF","MLL fusions":"#FFC0CB","t15;17 PML-RARA":"#800080"};
	var bgclr = $("#bgclr").val();//"#C0C0C0"; 
	if (resetHMap != true){
	if ($("#cataml").prop("checked"))
		catcolors["AML"] = bgclr;//"#C0C0C0";
	if ($("#catcml").prop("checked")) 
                catcolors["CML"] = bgclr;//"#C0C0C0";   
	if ($("#catmm").prop("checked")) 
                catcolors["MM"] = bgclr;//"#C0C0C0";   
	if ($("#catmp").prop("checked")) 
                catcolors["MP"] = bgclr;//"#C0C0C0";   
	if ($("#catlp").prop("checked")) 
                catcolors["LP"] = bgclr;//"#C0C0C0";   
	if ($("#cattall").prop("checked")) 
                catcolors["T-ALL"] = bgclr;//"#C0C0C0"; 
	if ($("#cattcl").prop("checked")) 
                catcolors["TCL"] = bgclr;//"#C0C0C0";   
	if ($("#catpreball").prop("checked")) 
                catcolors["pre-B-ALL"] = bgclr;//"#C0C0C0";   
	if ($("#catbcl").prop("checked")) 
                catcolors["BCL"] = bgclr;//"#C0C0C0";   
	if ($("#catcll").prop("checked")) 
                catcolors["CLL"] = bgclr;//"#C0C0C0";
	if ($("#caterythroid").prop("checked")) 
                catcolors["Erythroid"] = bgclr;//"#C0C0C0";   
	if ($("#catblymphoid").prop("checked")) 
                catcolors["B-Lymphoid"] = bgclr;//"#C0C0C0";   
	if ($("#cattlymphoid").prop("checked")) 
                catcolors["T-Lymphoid"] = bgclr;//"#C0C0C0";   
	if ($("#catmyeloid").prop("checked")) 
                catcolors["Myeloid"] = bgclr;//"#C0C0C0";
	if ($("#catstemcell").prop("checked"))
                catcolors["StemCell"] = bgclr;//"#C0C0C0"; 
	if ($("#catcellline").prop("checked"))
                catcolors["CellLine"] = bgclr;//"#C0C0C0";       
	}
	if (mapsource.indexOf('allold') != -1){
		mapsource = "hemaall_old";
	}		
	$( "#mapprogress" ).html("Preparing " + _title + " map ..." + "<img src='http://jakelin212.github.io/images/progress.gif' />");
	$.ajax({
                type: "POST",
                url:  "/cgi-bin/get_" + mapsource + "_cluster.cgi",
                        data: {'inparameter': 'na','column': 'cats'},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
                                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _data = jo["aaData"];
                                gsms = jo["gsms"];
				//gsmsxy = jo["gsmsxy"];
				var cmlset = jo["CML"];
                                var amlset = jo["AML"];
                                var blymphoid = jo["B-Lymphoid"];
                                var bclset = jo["BCL"];
                                var cllset = jo["CLL"];
                                var cmlset = jo["CML"];
                                var celllineset = jo["CellLine"];
                                var lpset = jo["LP"];
                                var mmset = jo["MM"];
                                var mpset = jo["MP"];
                                var myeloid = jo["Myeloid"];
                                var lymphoid = jo["Lymphoid"];
                                var erythroid = jo["Erythroid"];
                                var stemcellset = jo["StemCell"];
                                var tallset = jo["T-ALL"];
                                var tlymphoid = jo["T-Lymphoid"];
                                var tcl = jo["TCL"];
                                var preb = jo["pre-B-ALL"];
                                var naset = [];//jo["na"];
                                var centroid = jo["centroid"];
                                all_cluster = jo;
				$( "#grey_dialog" ).html("");
	var shemap_series = [
	 {type:'scatter',
            name: 'AML',
            color: catcolors["AML"], //'#3cb371',
        marker: {
                symbol: 'circle'
            },
            data: amlset
        },
	{type:'scatter',
            name: 'CML',
            color: catcolors["CML"], //'#006400',
        marker: {
                symbol: 'circle'
            },
            data: cmlset
        },
        {
            type:'scatter',
            name: 'MM',
            color: catcolors["MM"],
        marker: {
                symbol: 'circle'
            },
            data: mmset
        },
        {
        type:'scatter',
            name: 'MP',
            color: catcolors["MP"],
        marker: {
                symbol: 'circle'
            },
            data: mpset
        },
        {
        type:'scatter',
            name: 'LP',
            color: catcolors["LP"],
        marker: {
                symbol: 'circle'
            },
            data:  lpset
        },
	{
        type:'scatter',
            name: "T-ALL",
            color: catcolors["T-ALL"],//'#6495ed', 6495ed
        marker: {
                symbol: 'circle'
            },
            data:  tallset
        },
	{
        type:'scatter',
            name: 'TCL',
            color: catcolors['TCL'],//'#27408b',
                marker: {
                symbol: 'circle'
            },
            data:  tcl
        },
        {
        type:'scatter',
            name: 'pre-B-ALL',
            color: catcolors['pre-B-ALL'],
            marker: {
                symbol: 'circle'
            },
            data:  preb
        },
        {
            type:'scatter',
            name: 'BCL',
            color: catcolors['BCL'],//#'#bb8e8e',//rgba(223, 83, 83, .5)',
            data: bclset,
            marker: {
                symbol: 'circle'
            }
        },
        {
            type:'scatter',
            name: 'CLL',
            color: catcolors['CLL'],//'#a020f0',
            marker: {
                symbol: 'circle'
            },
            data: cllset
        },
	{type:'scatter',
            name: 'Erythroid',
            color: catcolors['Erythroid'],//#cc8540',
        marker: {
                symbol: 'triangle'
            },
            data: erythroid
        },	
	{
        type:'scatter',
            name: 'B-Lymphoid',
            color: catcolors['B-Lymphoid'],//#fe1392',
            data:  blymphoid,
            marker: {
                symbol: 'triangle'
            }
        },
        {
        type:'scatter',
            name: 'T-Lymphoid',
            color: catcolors['T-Lymphoid'], //'#00fefe',
                marker: {
                symbol: 'triangle'
            },
            data:  tlymphoid
        },
        {
            type:'scatter',
            name: 'Myeloid',
            color: catcolors['Myeloid'],//'#658a8a',//rgba(223, 83, 83, .5)',
        marker: {
                symbol: 'triangle'
            },
            data: myeloid
        },
        {
        type:'scatter',
            name: 'StemCell',
            color: catcolors['StemCell'],//'#feb90f',
        marker: {
                symbol: 'triangle'
            },
            data:  stemcellset
        },
	{
            type:'scatter',
            name: 'CellLine',
            color: catcolors['CellLine'],//'#00d9b3',
            marker: {
                symbol: 'diamond'
            },
            data: celllineset
        }
	];//end shemap series
        var adjwidth = $(window).width()*.72;
	if  (showcentroids == true && mapcontainer != "container"){
		adjwidth = $(window).width()*.6;
	       var acentroids = {
        	type: 'bubble',
        	name:'Clusters',
                data: all_clusters,
		marker: {
              		fillOpacity:0.1
                },
                events:{
                    click: function (e){
			$( "#hexpsearch" ).html();
			$("#pwpwfeature").val("cancermap_cluster_" + e.point.name);
			selected_cluster = e.point.name;
			var prep_clustergsm = function (){
        			$( "#hexpsearch" ).html(' <button onclick="javascript:get_clustergsm();">AddCluster' + selected_cluster +'_2Boxplot</button>');
			};
                        search_pwpw(prep_clustergsm);
                    }
                }
              };
	    shemap_series.push(acentroids);
	
	}
	if (mapsource == "aml"){
	var mllfusionset = jo["MLL fusions"];
	var nofusionset = jo["No fusions"];
        var t8_21 = jo["t8;21 RUNX1-RUNT1X1"];
        var t15_17 = jo["t15;17 PML-RARA"];
	var inv16 = jo["inv16 CBF-MYH"];
	shemap_series = [
	{type:'scatter',
            name: 't8;21 RUNX1-RUNT1X1',
            color: catcolors["t8;21 RUNX1-RUNT1X1"],
        marker: {
                symbol: 'circle'
            },
            data: t8_21
        },
	{type:'scatter',
            name: 't15;17 PML-RARA',
            color: catcolors["t15;17 PML-RARA"],
        marker: {
                symbol: 'circle'
            },
            data: t15_17
        },
	{type:'scatter',
            name: 'inv16 CBF-MYH',
            color: catcolors["inv16 CBF-MYH"], //'#3cb371',
        marker: {
                symbol: 'circle'
            },
            data: inv16
        },
         {type:'scatter',
            name: 'MLL fusions',
            color: catcolors["MLL fusions"], //'#3cb371',
        marker: {
                symbol: 'circle'
            },
            data: mllfusionset
        },
	{type:'scatter',
            name: 'No fusions',
            color: catcolors["No fusions"], //'#3cb371',
        marker: {
                symbol: 'circle'
            },
            data: nofusionset
        }	
        ];
        if  (showcentroids == true && mapcontainer != "container"){
               var acentroids = {
                type: 'bubble',
                name:'Clusters',
                data: aml_clusters,
                marker: {
                        fillOpacity:0.1
                },
                events:{
                    click: function (e){
                        $("#pwpwfeature").val("cancermap_cluster_" + e.point.name);
                        search_pwpw();
                    }
                }
              };
            shemap_series.push(acentroids);

        }

	}
       	if (stainsource != null){
		shemap_series.push(stainedobj);
	} 
        $( "#mapprogress" ).html("Plotting ..." + "<img src='http://jakelin212.github.io/images/progress.gif' />"); 
        $("#showref").hide();
	$("#hideref").hide(); 
	$('#' + mapcontainer).highcharts({
        chart: {
            zoomType: 'xy',
            width: adjwidth,   
            height: adjwidth,
            events: {
    		selection: function (event) {
			if (event.xAxis != null){
                        	var minX = event.xAxis[0].min;
                        	var maxX = event.xAxis[0].max;
                        	var minY = event.yAxis[0].min;
                        	var maxY = event.yAxis[0].max; 
				findSelectedGSM(minX, minY, maxX, maxY);
			}
		}
             }//events
	},
        title: {
            text: _title
        },
        xAxis: {
            title: {
                enabled: true,
                text: 't-SNE'
            },gridLineWidth: 1,
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
	},
	yAxis: {
            title: {
                enabled: true,
                text: 'GSM'
            }
        },
	exporting: {
        sourceHeight: 800,
        sourceWidth: 1200,
	scale: 1,
        filename: "hemap_fig",
	buttons: {
            contextButton: {
                menuItems: buttons.slice(0,6)
            }
        }
    	},
	s: {
            title: {
                text: 't-SNE'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: symSize,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    borderWidth: 0, 	
		    headerFormat: '<b>{series.name}</b><br>'
		    ,pointFormat: '{point.x}, {point.y}<br>click:add gsm/view geo' //+ gsms[{point.x} + "_" + {point.y}]
		},
		events: {
                        click: function(e){
                                var pxstr = e.point.x;
                                var pystr = e.point.y;
                                var xdec = (e.point.x + "").split(".")[1];
                                var ydec = (e.point.y + "").split(".")[1];
                                for (var po in gsms){
					var ptstr = po.split("_");
					if (parseFloat(ptstr[0]) == e.point.x && parseFloat(ptstr[1]) == e.point.y){
						$("#gsmmapcontainer").append(gsms[po] + " ");
						//window.open('http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc='+gsms[po]),'_blank';//GSM1226121
						return;
					}
				}
                        }
               }
	,point: {
                    events: {
                        mouseOver: function (e) {
                            $("#reporting").html(' GSM ' + gsms[e.target.x + '_' + e.target.y]);
                        }
                        ,mouseOut: function () {
                            $("#reporting").html('');// GSM x: ' + this.x + ', y: ' + this.y);
                        }
                    }
                }
	   },//end scatter plotO
            bubble:{
	    tooltip: {
               headerFormat: '<b>Sample Cancermap cluster</b><br>'
                    ,pointFormat: 'Click for paired wise features and GSMs'
                 },

                color: 'rgba(200,70,67,1)',
	        marker: {
                        fillOpacity:0.1
                },
                minSize: 16,
                maxSize: 17,
                dataLabels: {
                    enabled: true,
			formatter: function() {
                        return this.point.name;
                    }	
                }
           }
        },
	credits: {
                enabled: false
       },
        series:shemap_series 
    });
	$("#" + mapcontainer).show();
	$("#stainctl").show();
        $( "#mapprogress" ).html("");
},//success
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
	}
}//end of function

function viewtcga_tsne(){
	tcga_tsne_mode = 1;
	gotcga();
}

function prep_clustergsm(){
	$( "#hexpsearch" ).html(' <button onclick="javascript:get_clustergsm();">AddCluster' + selected_cluster +'_2Boxplot</button>');
}

function get_clustergsm(){
	$.ajax({
                type: "POST",
                url:  "/cgi-bin/get_cluster_gsm.cgi",
                        data: {'inparameter': selected_cluster},
                        success: function(mjo)
                        {
                                var jo  = $.parseJSON(mjo);
				sample_groups.push("cluster"+selected_cluster+"--gsms");
				sample_group_gsm["cluster"+selected_cluster+"--gsms"] = jo["gsms"+selected_cluster];
				var ct = jo["gcount"];
				new Messi('Cluster sample group ' + selected_cluster + ' added ' + ct + ' samples. Add more or go to Boxplot to define genes', {title:"Success", autoclose:1800});	
                        },
                        error: function(){
                                alert("network error on retrieving cluster samples");
                        }
        });
}
