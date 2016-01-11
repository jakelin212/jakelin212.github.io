/*function addBoxGene(){
	gsinc = gsinc+1;
	$('#boxplot_gexp').append('<div id="boxplot_gexp' + gsinc + '__' + $("#boxgene_ctl").val() + '" style="height: 400px; min-width: 1200px; margin: auto;"></div>');
	_stat_div = "boxplot_gexp" + gsinc + '__' + $("#boxgene_ctl").val();
	session_genes.push($("#boxgene_ctl").val());
	getNewGeneStat("boxplot_gexp" + gsinc + '__' + $("#boxgene_ctl").val());
}
*/

function replaceAll(str, token, newtk){
    return str.split(token).join(newtk);

}
function resetBoxPlot(){
	series = 1;
	gsinc = 0;
	gexp_init = "";
	firstbox = 0;	
	sample_groups = [];	
	session_genes = [];
	sample_group_gsm = {};
	gexp_sets = {};
	$('#hexpsearch').html("");
	$('#boxplot_gexp').html("");
	$("#boxgene_ctl").val(gexp_init);
	session_gexp = {};
	new Messi('Box plot sample groups and summaries fully cleared. Start over in annotations and set the genes afterwards', {title:"Reset success", autoclose:1800});
	initAnno();	
}

function updateBoxGene(){
	_stat_div = null;
	getNewGeneStat(null);	
}

function prepPlotGeneSampleGroup(){
	var ingene = $("#boxgene_ctl").val().toUpperCase();
        if (ingene == "" || ingene == undefined){
		return;
	}
	gexp_init = ingene;
	var inparams = "";
	if (Object.size(gexp_sets) > 1){
                for (var gs in gexp_sets){
                        if (gs != "global" && gs.indexOf(":GSM") == -1){
                                var gsobj = gexp_sets[gs];
			        inparams = inparams + ":" + gsobj["param"];
                        }
			if (gs != "global" && gs.indexOf(":GSM") != -1){
                                var gsobj = gexp_sets[gs];
                                inparams = inparams + ":" + gsobj["param"] + "*" + gsobj["inparam"];
                        }
                }
        }
        if (Object.size(sample_groups) == 0){
		new Messi('You must add sample groups from annotations search or map selection.', {title: 'Sample groups required'});
		return;
	}
	/*gene = "IRX3 MEIS2"#
#gene = qform.getvalue('ingene')
inparams = qform.getvalue('inparams')
inparams = "IRX3==blood:GSM*GSM215000 GSM214999 GSM214983 GSM214984 GSM214988 GSM214985 GSM215005 GSM215002 GSM215004 GSM215003 GSM214982 |clinical:acute;;MEIS2==blood:GSM*GSM215000 GSM214999 GSM214983 GSM214984 GSM214988 GSM214985 GSM215005 GSM215002 GSM215004 GSM215003 GSM214982 |clinical:blasts"
*/
	var paramobj = {};
	//ingene = ingene.toUpperCase();
	paramobj["ingene"] = ingene;
        $("#boxgene_ctl").val(ingene);
	paramobj["lowoutlier"] = lowoutlier;
	paramobj["highoutlier"] = highoutlier;
	paramobj["sample_groups"] = sample_groups;
	//loop thru genes/sample group and pass to cgi, cgi then will return values as ["gene"]
        var gtk = ingene.split(" ");
	for (var g in gtk){
		var ge = gtk[g];
		for (var s in sample_groups){
			var sg = sample_groups[s];
			var alias = sg;
			//alias = alias.replace(";", "semi");
                        alias = replaceAll(alias, ";", "semi");
			alias = replaceAll(alias, ":", "colon");
			alias = replaceAll(alias, "+", "plus");
			alias = alias.replace("(", "");
                        alias = alias.replace(")", "");
			alias = replaceAll(alias, " ", "");
			var gesg = ge + "--" + alias;
			var gesg_checked = $("#"+gesg).prop("checked");
			paramobj[gesg] = gesg_checked;	 
			if (gesg_checked == true && sg.indexOf("--gsms") != -1){
				paramobj[gesg] = sample_group_gsm[sg]; 
			}
		}
	}

	paramobj["sample_groups"] = sample_groups.join();	
	$( "#sgexp_dialog" ).html("Working...<img src='images/progress.gif' />");
        $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_hema_box2.cgi",
		data: paramobj,
                success: function(json)
                        {
				session_gexp[ingene] = {};
                                var jo  = $.parseJSON(json);
				if (jo == null){
                                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
				var invalid_genes = jo["invalid_genes"];
				var bgval = $("#boxgene_ctl").val();
				if (invalid_genes != ""){
					new Messi(invalid_genes + ' Invalid/not found in our system. Make sure they are HUGO compliant', {title: 'Invalid genes'});
					var igtk = invalid_genes.split(",");
					for (var g in igtk){
						var ig = igtk[g];
						bgval = bgval.replace(ig, "");
						bgval = bgval.replace("  ", " ");	
					}
					$("#boxgene_ctl").val(bgval.trim());					
				}
				var sgenes = bgval.trim().split(" "); //$("#boxgene_ctl").val().split(" ");
				$('#boxplot_gexp').html("");
				gsinc = 0;
				$( "#gene_dl" ).html("Download:");
				for (var g in sgenes){
					var ge = sgenes[g];
					$('#boxplot_gexp').append('<div id="boxplot_gexp' + gsinc + '__' + ge + '" style="height: 400px; min-width: 1200px; margin: auto;"></div>');
					gexp_sets[ge] = {};
					gexp_sets[ge]["global"] = jo[ge]["global"];
					for (var sg in sample_groups){
						var sgk = sample_groups[sg];
						var alias = sgk;
						alias = replaceAll(alias, ";", "semi");
                        			alias = replaceAll(alias, ":", "colon");
						alias = replaceAll(alias, "+", "plus");
						alias = alias.replace("(", "");
						alias = alias.replace(")", "");
						alias = replaceAll(alias, " ", "");
						var gesg = ge + "--" + alias;
			                        var gesg_checked = $("#"+gesg).prop("checked");
						if (gesg_checked == false){
							continue;
						}
						gexp_sets[ge][sgk] = jo[ge][sgk];						
					}
					$("#gene_dl").append('&nbsp;<a id="myLink" href="#" onclick="downloadGene(\'' + ge + '\');">' + ge + '</a>');
					session_genes.push(ge);
					
					var _stat_div = "boxplot_gexp" + gsinc + '__' + ge;					
					gsinc = gsinc + 1;
					plotBoxes(_stat_div, ge, gexp_sets[ge]);
				}
				hideAssignment();
				$( "#sgexp_dialog" ).html("");
                        },
                        error: function(){
                                $( "#gexp_dialog" ).html("");
                                new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
}

function downloadSelectedGroup(gene, categ){
	var odata = '<div style="height:350px;overflow:auto;"><table>';
	var gkey = categ.split(" cnt:")[0];
	var sset = session_gexp[gene][gkey]["gsms"];	
	var rows = "";
	var string8 = ""
	//<a href="data:application/octet-stream;charset=utf-8;base64,U29tZSBjb250ZW50">Download</a>
	for (var r in sset){
		rows = rows + "<tr><td>" + sset[r][1] + "</td><td>" + sset[r][0] + "</td></tr>";
		string8 = string8 + sset[r][1] + "," + sset[r][0] + "\n";
	}
	odata = odata + rows + '</table></div>';	
	var estring64 = window.btoa(string8);
	new Messi('<a href="data:application/octet-stream;charset=utf-8;base64,' + estring64 + '">Download</a><br>' + odata, {title: gene + ' ' + gkey + ' outliers', width:"300px"});

}
function downloadGene(ingene){
	$( "#sgexp_dialog" ).html("Downloading...<img src='images/progress.gif' />");
	$.ajax({
                type: "POST",
                url:  "/cgi-bin/download_hema_gexp.cgi",
                data: {'ingene': ingene},
                success: function(json)
                        {
        			window.location="/cgi-bin/download_hema_gexp.cgi?ingene=" + ingene;
	                        new Messi('Downloaded ' + ingene + ' gsmraws.csv', {title:"Success", autoclose:1000});
                                $( "#sgexp_dialog" ).html("");
                        },
                        error: function(){
                                $( "#gexp_dialog" ).html("");
                                new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });	
}



function deleteSampleGroup(sg){
	new Messi('Are you sure you want to delete sample group ' + sg +'?', {title: 'Sample groups', buttons: [{id: 0, label: 'Yes', val: 'Y'}, {id: 1, label: 'No', val: 'N'}], callback: function(val) { if (val == 'Y'){
							for (var i in sample_groups){
								if (sample_groups[i] == sg){
									sample_groups.splice(i, 1);
									updateGeneSampleGroup();
									return;
								}
							}	
							} 
	}});
}

function updateGeneSampleGroup(){
	var tablestr = "<span id='gesgtable'><table><tr><td><b>ASSIGN</b></td>";
	var ct = 0;
	var sggenes = $("#boxgene_ctl").val();
	if (sggenes == "")
		return;
	for (var sg in sample_groups){
		var sgstr = sample_groups[sg];
        	tablestr = tablestr + "<td>" + "<a id='showMyLink' href='#' onclick='deleteSampleGroup(\"" + sample_groups[sg] +"\");'>" + sample_groups[sg] + "</a>" + "</td>";
        }
	var sgenes = $("#boxgene_ctl").val().split(" ");
	for (var ge in sgenes){
		var _ge = sgenes[ge];
		tablestr = tablestr + "<tr><td>" + _ge + "</td>";
		for (var sg in sample_groups){
			var alias = sample_groups[sg];
			//alias = alias.replace(";", "semi");
			alias = replaceAll(alias, ";", "semi");
                        alias = replaceAll(alias, ":", "colon");
			alias = replaceAll(alias, "+", "plus");
			alias = replaceAll(alias, " ", "");
			alias = alias.replace("(", "");
                        alias = alias.replace(")", "");
                	//tablestr = tablestr + "<td>" + "<input type='checkbox' name='" + _ge + "--" + sample_groups[sg] + "' id='" + _ge + "--" + sample_groups[sg] +"' checked></td>";
			tablestr = tablestr + "<td>" + "<input type='checkbox'" + " id='" + _ge + "--" + alias +"' checked></td>";
                }
		tablestr = tablestr + "</tr>";		
		ct = ct + 1;
	}

	tablestr = tablestr + "</table></span>";		
	$("#gene_sg").html(tablestr);
}

function plotBoxes(pdiv, ge, gexp_sets)
{
	var categories = [];
        categories.push(ge + ' Full');
        var dataseries = [];
        var gglobal = gexp_sets["global"];
        dataseries.push([gglobal["min"], gglobal["lower_quantile"],gglobal["median"],gglobal["upper_quantile"],gglobal["max"]]);
        var ymean = [{
                value: gglobal["mean"],
                color: 'red',
                width: 1,
                label: {
                    text: ge + ' mean: ' + gglobal["mean"].toFixed(3),
                    align: 'right',
                    style: {
                        color: 'blue'
                    }
                }
            }];
        var outliers = [];
        if (Object.size(gexp_sets) > 1){
                for (var gs in gexp_sets){
                        if (gs != "global"){
                                var gsobj = gexp_sets[gs];
                                dataseries.push([gsobj["min"], gsobj["lower_quantile"],gsobj["median"],gsobj["upper_quantile"],gsobj["max"]]);
                                var label = gsobj["param"] + " cnt:" + gsobj["count"];
                                categories.push(gsobj["param"] + " cnt:" + gsobj["count"]);
                                //outliers = gsobj["ogexp"];
				outliers = outliers.concat(gsobj["ogexp"]);
                        }
                }
        }

 	$('#' + pdiv).highcharts({
	chart: {
                type: 'boxplot',
                zoomType: 'xy'
            },
            title: {
                text: ge + ' Summary Statistic'
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: 'GEXP log2'
                },
                plotLines: ymean
            },
            plotOptions: {
            boxplot: {
                fillColor: '#F0F0E0',
                lineWidth: 2,
                medianColor: '#0C5DA5',
                medianWidth: 4,
                stemColor: '#A63400',
                stemDashStyle: 'dot',
                stemWidth: 1,
                whiskerColor: '#3D9200',
                whiskerLength: '20%',
                whiskerWidth: 3
            },
            scatter: {
                marker: {
                    radius: symSize
                }
             }
        },
            series: [
            {
            name: ge,
            pointWidth: 80,
                data: dataseries,
            events:{
                click: function(eventa){
                        //downloadSelectedGroup(gexp_init, eventa.delegateTarget.data[eventa.AT_TARGET - 1].category);
                }
             }
            },
	{
            name: 'Outlier',
            color: $("#color4").val(),//Highcharts.getOptions().colors[0],
            type: 'scatter',
            data: outliers,
            marker: {
                fillColor: $("#color4").val(),
                lineWidth: 1,
                lineColor: Highcharts.getOptions().colors[0]
            },
            radius: symSize,
            tooltip: {
                pointFormat: 'Outlier: {point.y}'
            }
        }
        ]
        });

        $('.highcharts-axis-labels text, .highcharts-axis-labels span').click(function () {
                try {
                var poparent = event.srcElement.parentElement.parentElement.parentElement.parentElement.parentElement;
		var pogene = poparent.id;
		if (pogene == "")
			pogene = poparent.parentElement.id;
                if (pogene == "boxplot_gexp"){
                        pogene = session_genes[1];
                }else{
                        pogene = pogene.split("__")[1];
                }
                var cate = this.textContent;
                if (cate.indexOf("cnt:") != -1){
                        downloadSelectedGroup(pogene, cate);
                }
                }catch(err){
                        new Messi('Caught error while retrieving outliers and download, the code is using SVG and older version of IE is not supported. Please contact help if this is not the case.', {title:"Caught error"});
                }
        });
}

function hideAssignment(){
	$("#gesgtable").hide();
	$("#showhidegesg").html("<a id='showMyLink' href='#' onclick='showAssignment();'>ShowAssignment</a>");
}

function showAssignment(){
	//updateGeneSampleGroup();
	$("#gesgtable").show();
        $("#showhidegesg").html("<a id='showMyLink' href='#' onclick='hideAssignment();'>HideAssignment</a>");
}


function initBoxplot(pdiv){
	if (firstbox == 0){
		firstbox = 1;
		$("#boxplot_op").html("");
        	$("#boxplot_op").append('<br>Genes:<input type="search" value="" style="display:block;width:500px;" size="400" name="boxgene_ctl" id="boxgene_ctl" data-provide="typeahead" data-items="10" placeholder="" onchange="javascript:updateGeneSampleGroup();">');
        	$("#boxplot_op").append("&nbsp;&nbsp;<button type='button' onClick='javascript:prepPlotGeneSampleGroup();'>Plot</button>&nbsp;<span id='sgexp_dialog'></span>&nbsp;<a id='resetMyLink' href='#' onclick='resetBoxPlot();'>Reset</a>&nbsp;<span id='showhidegesg'><a id='hideMyLink' href='#' onclick='hideAssignment();'>HideAssignment</a></span>&nbsp;<span id='gene_dl'>Download:</span><span id='bop_container'></span>");
		$("#bop_container").html("<span id='outlier_ctl1'></span>&nbsp;Outlier cutoff:" + lowoutlier + '<=Percentile<=' + highoutlier + "&nbsp;<input type='color' id='color4' name='color4' style='width:50px' value='#3355cc' />");
        	$("#bop_container").css("float", "right");		
        	$('#boxgene_ctl').typeahead({source: hg19genes});
        	$('#boxgene_ctl').val(gexp_init);
		$("#boxgene_ctl").css("display","inline");
	}
	var sgstr= "";
        for (var sg in sample_groups){
        	if (sg == "gsms"){
                	sgstr = sgtr + " " + sg + ":...";
                }else{
                        sgstr = sgstr + " " + sg + ":" + sample_groups[sg];
                }
        }
	if ($("#boxgene_ctl").val() == "")
		return;
	updateGeneSampleGroup();

}
