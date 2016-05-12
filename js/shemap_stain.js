summarySM = function () {
    	//alert("process counts by categories, sort for mode " + smmode);

    	if (smmode == "hema_gexp"){
    		estainGeneSummary();
	}
	if (smmode == "hema_pw"){
                estainPWSummary();
        }	
};

function getObjCt(objCt){
	if (objCt == null)
		return 0;
	return objCt; 
}
function estainPWSummary(){
        var parameter = $("#gene_stain_ctl").val();
        if (parameter == ""){
                alert("Gene session cleared, please put in the symbol again");
                return;
        }
        $( "#gpprogress" ).html("<img src='http://jakelin212.github.io/images/progress.gif' /> Processing summary " + parameter + " ...");
	var pwsrc = ($("#pw_source").val());
        var gsvapw = $("#gsvapw").val();
        $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_hema_pwcounts.cgi",
                        data: {'inpathway': parameter, 'pathwaytype':pwsrc, 'mapsource':sessionsource, 'gsvapw':gsvapw},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
                                        new Messi('Error on gene e-stain data retrieval, please contact help', {title: 'Server error'});}
                        	var jo  = $.parseJSON(json);
                                var _low = jo["low"];
                                var _medium = jo["med"];
                                var _high = jo["high"];
                                $( "#gpprogress" ).html("");
				var stable = "<br><table>" + constructSummary(_low, _medium, _high) + "</table>";
                                new Messi(stable, {"titleClass":"success", "width":"700px", title: parameter + ' EStained Summary'});
			},
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
}


function constructSummary(_low, _medium, _high){
	var rows = "<tr><th>Category</th><th>Low</th><th>Medium</th><th>High</th></tr>";
                                rows = rows + "<tr><td>AML</td>" + "<td>" + getObjCt(_low["AML"]) + "</td><td>" + getObjCt(_medium["AML"]) + "</td><td>" + getObjCt(_high["AML"]) + "</td></tr>";
                                rows = rows + "<tr><td>CML</td>" + "<td>" + getObjCt(_low["CML"]) + "</td><td>" + getObjCt(_medium["CML"]) + "</td><td>" + getObjCt(_high["CML"]) + "</td></tr>";
                                rows = rows + "<tr><td>MM</td>" + "<td>" + getObjCt(_low["MM"]) + "</td><td>" + getObjCt(_medium["MM"]) + "</td><td>" + getObjCt(_high["MM"]) + "</td></tr>";
                                rows = rows + "<tr><td>MP</td>" + "<td>" + getObjCt(_low["MP"]) + "</td><td>" + getObjCt(_medium["MP"]) + "</td><td>" + getObjCt(_high["MP"]) + "</td></tr>";
                                rows = rows + "<tr><td>LP</td>" + "<td>" + getObjCt(_low["LP"]) + "</td><td>" + getObjCt(_medium["LP"]) + "</td><td>" + getObjCt(_high["LP"]) + "</td></tr>";
                                rows = rows + "<tr><td>T-ALL</td>" + "<td>" + getObjCt(_low["T-ALL"]) + "</td><td>" + getObjCt(_medium["T-ALL"]) + "</td><td>" + getObjCt(_high["T-ALL"]) + "</td></tr>";
                                rows = rows + "<tr><td>TCL</td>" + "<td>" + getObjCt(_low["TCL"]) + "</td><td>" + getObjCt(_medium["TCL"]) + "</td><td>" + getObjCt(_high["TCL"]) + "</td></tr>";
                                rows = rows + "<tr><td>pre-B-ALL</td>" + "<td>" + getObjCt(_low["pre-B-ALL"]) + "</td><td>" + getObjCt(_medium["pre-B-ALL"]) + "</td><td>" + getObjCt(_high["pre-B-ALL"]) + "</td></tr>";
                                rows = rows + "<tr><td>BCL</td>" + "<td>" + getObjCt(_low["BCL"]) + "</td><td>" + getObjCt(_medium["BCL"]) + "</td><td>" + getObjCt(_high["BCL"]) + "</td></tr>";
                                rows = rows + "<tr><td>CCL</td>" + "<td>" + getObjCt(_low["CLL"]) + "</td><td>" + getObjCt(_medium["CLL"]) + "</td><td>" + getObjCt(_high["CLL"]) + "</td></tr>";
                                rows = rows + "<tr><td>Erythroid</td>" + "<td>" + getObjCt(_low["Erythroid"]) + "</td><td>" + getObjCt(_medium["Erythroid"]) + "</td><td>" + getObjCt(_high["Erythroid"]) + "</td></tr>";
                                rows = rows + "<tr><td>B-Lymphoid</td>" + "<td>" + getObjCt(_low["B-Lymphoid"]) + "</td><td>" + getObjCt(_medium["B-Lymphoid"]) + "</td><td>" + getObjCt(_high["B-Lymphoid"]) + "</td></tr>";
                                rows = rows + "<tr><td>T-Lymphoid</td>" + "<td>" + getObjCt(_low["T-Lymphoid"]) + "</td><td>" + getObjCt(_medium["T-Lymphoid"]) + "</td><td>" + getObjCt(_high["T-Lymphoid"]) + "</td></tr>";
                                rows = rows + "<tr><td>Myeloid</td>" + "<td>" + getObjCt(_low["Myeloid"]) + "</td><td>" + getObjCt(_medium["Myeloid"]) + "</td><td>" + getObjCt(_high["Myeloid"]) + "</td></tr>";
                                rows = rows + "<tr><td>StemCell</td>" + "<td>" + getObjCt(_low["StemCell"]) + "</td><td>" + getObjCt(_medium["StemCell"]) + "</td><td>" + getObjCt(_high["StemCell"]) + "</td></tr>";
                                rows = rows + "<tr><td>CellLine</td>" + "<td>" + getObjCt(_low["CellLine"]) + "</td><td>" + getObjCt(_medium["CellLine"]) + "</td><td>" + getObjCt(_high["CellLine"]) + "</td></tr>";
	return rows;
}

function estainGeneSummary(){
        var parameter = ($("#gene_stain_ctl").val());
        if (parameter == ""){
		alert("Gene session cleared, please put in the symbol again");
                return;
        }
        $( "#gpprogress" ).html("<img src='http://jakelin212.github.io/images/progress.gif' /> Processing summary " + parameter + " ...");
        $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_hema_gexpcounts.cgi",
                        data: {'inparameter': parameter, 'mapsource':sessionsource},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
                                        new Messi('Error on gene e-stain data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _low = jo["low"];
                                var _medium = jo["med"];
                                var _high = jo["high"];
				$( "#gpprogress" ).html("");
				/*var rows = "<tr><th>Category</th><th>Low</th><th>Medium</th><th>High</th></tr>";
				rows = rows + "<tr><td>AML</td>" + "<td>" + _low["AML"] + "</td><td>" + _medium["AML"] + "</td><td>" + _high["AML"] + "</td></tr>"; 
				rows = rows + "<tr><td>CML</td>" + "<td>" + _low["CML"] + "</td><td>" + _medium["CML"] + "</td><td>" + _high["CML"] + "</td></tr>";
				rows = rows + "<tr><td>MM</td>" + "<td>" + _low["MM"] + "</td><td>" + _medium["MM"] + "</td><td>" + _high["MM"] + "</td></tr>";
				rows = rows + "<tr><td>MP</td>" + "<td>" + _low["MP"] + "</td><td>" + _medium["MP"] + "</td><td>" + _high["MP"] + "</td></tr>";
				rows = rows + "<tr><td>LP</td>" + "<td>" + _low["LP"] + "</td><td>" + _medium["LP"] + "</td><td>" + _high["LP"] + "</td></tr>";
				rows = rows + "<tr><td>T-ALL</td>" + "<td>" + _low["T-ALL"] + "</td><td>" + _medium["T-ALL"] + "</td><td>" + _high["T-ALL"] + "</td></tr>";
				rows = rows + "<tr><td>TCL</td>" + "<td>" + _low["TCL"] + "</td><td>" + _medium["TCL"] + "</td><td>" + _high["TCL"] + "</td></tr>";
				rows = rows + "<tr><td>pre-B-ALL</td>" + "<td>" + _low["pre-B-ALL"] + "</td><td>" + _medium["pre-B-ALL"] + "</td><td>" + _high["pre-B-ALL"] + "</td></tr>";
				rows = rows + "<tr><td>BCL</td>" + "<td>" + _low["BCL"] + "</td><td>" + _medium["BCL"] + "</td><td>" + _high["BCL"] + "</td></tr>";
				rows = rows + "<tr><td>CCL</td>" + "<td>" + _low["CLL"] + "</td><td>" + _medium["CLL"] + "</td><td>" + _high["CLL"] + "</td></tr>";
				rows = rows + "<tr><td>Erythroid</td>" + "<td>" + _low["Erythroid"] + "</td><td>" + _medium["Erythroid"] + "</td><td>" + _high["Erythroid"] + "</td></tr>";
				rows = rows + "<tr><td>B-Lymphoid</td>" + "<td>" + _low["B-Lymphoid"] + "</td><td>" + _medium["B-Lymphoid"] + "</td><td>" + _high["B-Lymphoid"] + "</td></tr>";
				rows = rows + "<tr><td>T-Lymphoid</td>" + "<td>" + _low["T-Lymphoid"] + "</td><td>" + _medium["T-Lymphoid"] + "</td><td>" + _high["T-Lymphoid"] + "</td></tr>";
				rows = rows + "<tr><td>Myeloid</td>" + "<td>" + _low["Myeloid"] + "</td><td>" + _medium["Myeloid"] + "</td><td>" + _high["Myeloid"] + "</td></tr>";
				rows = rows + "<tr><td>StemCell</td>" + "<td>" + _low["StemCell"] + "</td><td>" + _medium["StemCell"] + "</td><td>" + _high["StemCell"] + "</td></tr>";
				rows = rows + "<tr><td>CellLine</td>" + "<td>" + _low["CellLine"] + "</td><td>" + _medium["CellLine"] + "</td><td>" + _high["CellLine"] + "</td></tr>";
				*/
				var stable = "<br><table>" + constructSummary(_low, _medium, _high) + "</table>";
				new Messi(stable, {"titleClass":"success", "width":"500px", title: parameter + ' EStained Summary'});
                        },
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
}


var buttons = Highcharts.getOptions().exporting.buttons.contextButton.menuItems;

/*
buttons.push({
    text: "View Summary Counts",
    onclick: summarySM
});
*/

function plotGeneStainedMap(mapsource, jo, genestains,mapcontainer){
	mapcontainer = mapcontainer || "container";
        var adjwidth = $(window).width()*hexpmapwidth;
	var sradius = symSize;
        $("#sgsmannolink").html("");
	$("#mapconfig").html("");
	var st = "HEMAP ALL";
	$("#showref").show();
	if (sessionsource == "leukemia")
		st = "Leukemia_Normal";
	if (sessionsource == "aml")
                st = "AML";
	if (sessionsource == "tcga"){
                st = "TCGA";
		sradius = symSize + 1;
	}
	var _title = mapsource.replace("tcga", "") + " e-staining " + st;
	_title = _title.replace("_cclin", "");
	_title = _title.replace("_bclin", "");
	_title = _title.replace("_zscore", "");
	var shemap_series = [];
        showcentroids = false; 
        /*if  (showcentroids == true && mapcontainer != "container"){
               var acentroids = {
                type: 'bubble',
                name:'Clusters',
                data: all_clusters,
                marker: {
                        fillOpacity:0.1
                },
                events:{
                    click: function (e){
                        $("#pwpwfeature").val("cancermap_cluster_" + e.point.name);
                    }
                }
              };
            shemap_series.push(acentroids);

        }*/
	if (mapsource.indexOf("tcga_zscore") != -1){
		shemap_series.push(genestains["vlow"]);
        	shemap_series.push(genestains["low"]);
                shemap_series.push(genestains["medium"]);
                shemap_series.push(genestains["high"]);
		shemap_series.push(genestains["vhigh"]);
	}else if (mapsource.indexOf("tcga_cclin") != -1 || mapsource.indexOf("tcga_bclin") != -1){
		shemap_series = genestains;
        }else{
		shemap_series.push(genestains["low"]);
                shemap_series.push(genestains["medium"]);
                shemap_series.push(genestains["high"]);
	}
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
             }
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
	exporting: {
        	sourceHeight: 800,
        	sourceWidth: 1200,
        	scale: 1,
		filename: "hemap_fig",
		buttons: {
            	contextButton: {
                	menuItems: buttons
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
                    radius: sradius,
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
                    headerFormat: '<b>{series.name}</b><br>',
		    pointFormat: '{point.x}, {point.y}<br>click:add gsm/view geo'// + gsms[{point.x} + "_" + {point.y}]
                },
                events: {
                        click: function(e){
                                var pxstr = e.point.x;
                                var pystr = e.point.y;
                                for (var po in gsms){
					if ($("#xmapselect").val() == "tcga"){
						var tid = gsms[e.point.x + "," + e.point.y].replace(/-/g, "."); 
						window.open('http://www.cbioportal.org/case.do?sample_id='+ tid + '&cancer_study_id=laml_tcga_pub')
                                                return;
					}else{ 
                                        var ptstr = po.split("_");
                                        if (parseFloat(ptstr[0]) == e.point.x && parseFloat(ptstr[1]) == e.point.y){
                                                $("#gsmmapcontainer").append(gsms[po] + " ");
                               			//window.open('http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc='+gsms[po]),'_blank';//GSM1226121
				                return;
                                        }
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
            },
            bubble:{
                color: "red",
                minSize: 10,
                maxSize: 10,
                dataLabels: {
                    enabled: true,
                    //color: "brown",
                    formatter:function (){
                        return "";//this.x;
                    }
                }
           }
        },
credits: {
                enabled: false
       },
        series:shemap_series
    });
    $( "#gpprogress" ).html("");	
    $("#stainctl").show();
    $( "#mapprogress" ).html("");
}

