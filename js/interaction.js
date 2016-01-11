Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function toggleHCols(ccid){
        var sob = snptable;//$('#usnptable').dataTable();
        if (ccid == 'basicAll'){
                toggleRange(sob, 2, 17);
                $("#toggle_dialog").html("<font color='blue'> All patient background columns toggled.</font>");
        }else if (ccid == 'readsAll'){
                toggleRange(sob, 18, 36);
                $("#toggle_dialog").html("<font color='blue'> All read results toggled.</font>");
        }else if (ccid == 'ctPhagesAll'){
                toggleRange(sob, 37, 82);
                $("#toggle_dialog").html("<font color='blue'> All phage counts results toggled.</font>");
                var meganVis = sob.fnSettings().aoColumns[80].bVisible;
                if (meganVis == false){
                        toggleRange(sob, 83, 107);
                }
        }else if (ccid == 'meganAll'){
                toggleRange(sob, 83, 107);
                $("#toggle_dialog").html("<font color='blue'> All MEGAN columns toggled.</font>");
        }else if (ccid == 'contigsAll'){
                toggleRange(sob, 108, 753);
                $("#toggle_dialog").html("<font color='blue'> All contig columns toggled.</font>");
        }else{
                var bVis = sob.fnSettings().aoColumns[ccid].bVisible;
                sob.fnSetColumnVis( ccid, bVis ? false : true );
                if (bVis == true && $("#_" + ccid + "hsl" ).html().indexOf("*") == -1){
                        $("#_" + ccid + "hsl" ).html("*"+$("#_" + ccid + "hsl" ).html());
                }else{
                        var _cll = $("#_" + ccid + "hsl" ).html().split("*").join("");
                        $("#_" + ccid + "hsl" ).html(_cll);
                }
        }
}


/*$.fn.dataTableExt.ofnSearch['freq-num'] = function ( sData ) {
  var fval = $("#freqrange").val();
  if (parseFloat(sData) >= parseFloat(fval)){
    return sData;//.replace(/\n/g," ").replace( /<.*?>/g, "" );
  }
}
*/
var advancemsg = "";

function add2GEXP(){
        var col = $("#columns").val();//.toUpperCase();
	if (col == "gsms"){
		$("#gsmmapcontainer").val($("#search_input").val());
		gsm2GEXP();	
	}else{
	   //var gkey = $("#columns").val().toUpperCase() + ":" + $("#search_input").val();
	   var ingene = $("#boxgene_ctl").val();
	   if (ingene == undefined)
		ingene = gexp_init;
	   var gkey = $("#columns").val() + "--" + $("#search_input").val();

	   var advvis = $("#advspan").is(":visible");
	   var advop = "";//$("#advop").val();
           var advcol = "";//$("#advcolumns").val();
           var advparam = "";//$("#advsearch_input").val();
	   var advdash = "";
           if (advvis == true){
	   	advop = $("#advop").val();
		advop = advop.replace(" AND ", "_AND_")
		advop = advop.replace(" OR ", "_OR_")
        	advcol = $("#advcolumns").val();
        	advparam = previous_advance;//$("#advsearch_input").val();
		advdash = "--";
	   }	
		
	   sample_groups.push(col + "--" + $("#search_input").val() + advop + advcol + advdash + advparam);           
	   new Messi('Sample group ' + gkey + ' defined. Add more or go to Boxplot to assign to genes', {title:"Success", autoclose:1500});
                                
		/*	
	   $( "#gexp_dialog" ).html("Calculating...<img src='images/progress.gif' />");
		$.ajax({
                type: "POST",
                url:  "/cgi-bin/get_hema_gexp2.cgi",
                        data: {'inparameter': $("#search_input").val(),'column': $("#columns").val(), 'ingene': ingene, 'lowoutlier':lowoutlier, 'highoutlier':highoutlier, 'series':series},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
                                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
          			new Messi('Added subset ' + gkey + ' summary stats, add more or click GEXP Summary tab', {title:"Success", autoclose:1500});
	                        series = series + 1;
				var jo  = $.parseJSON(json);
				gexp_sets[gkey] = {};
				gexp_sets[gkey]["param"] = jo["param"];
				gexp_sets[gkey]["count"] = jo["count"];
				gexp_sets[gkey]["max"] = jo["max"];
				gexp_sets[gkey]["min"] = jo["min"];
				gexp_sets[gkey]["median"] = jo["median"];
				gexp_sets[gkey]["lower_quantile"] = jo["lower_quantile"];
				gexp_sets[gkey]["upper_quantile"] = jo["upper_quantile"];
				gexp_sets[gkey]["ogexp"] = jo["ogexp"];
				gexp_sets[gkey]["gsms"] = jo["gsms"];
				if (session_gexp[ingene] == undefined)
					session_gexp[ingene] = {};
				session_gexp[ingene][gkey] = gexp_sets[gkey];
				$( "#gexp_dialog" ).html("");                                
			},
                        error: function(){
				$( "#gexp_dialog" ).html("");
                        	new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
		*/
	}
}


function displayAdvance(){
  $("#geocolumn").val("advanced");
  $("#columns").val("advanced");
  $("#rnacolumns").val("advanced");
    new Messi(advancemsg, {title: 'Advance Query'});
}
/*
function settingsHemap()
	$("#mapconfig").html('Legend Show:' + '<select id="legendenabled" style="width:80px"><option selected value="true">True</option><option value="false">False</option></select> ' + ' placement: <select id="legendpos" style="width:100px"><option selected value="ul">UpperLeft</option><option value="ur">UpperRight</option><option value="bl">BottomLeft</option><option value="br">BottomRight</option></select>&nbsp;Max Selection: <select id="maxgselection" style="width:100px"><option value="50">50</option><option selected value="100">100</option><option value="200">200</option><option value="500">500</option></select>&nbsp;Symbol size: <select id="symsizeop" style="width:100px"><option selected value="symdec">Smaller</option><option value="symdec--">Smaller--</option> <option value="syminc">Bigger</option><option value="syminc++">Bigger++</option></select>&nbsp;<button type="button" title="Takes effect on next plot" onclick="setSettings();">Save</button>');

}

function setSettings(){
	maxgsmsallowed = $("#maxgselection").val();
	legendenabled = $("#legenabled").val();
	var legendpos = $("#legendpos").val();
	if (legendpos == "br"){
		legendx = 0;
		legendy = 578;
		legendalign = "right";
	}
	if (legendpos == "ur"){
                legendx = 0;
                legendy = 40;
                legendalign = "right";
        }
	if (legendpos == "bl"){
                legendx = 65;
                legendy = 578;
                legendalign = "left";
        }
        if (legendpos == "ul"){
                legendx = 65;
                legendy = 40;
                legendalign = "left";
        }
	var ssop = $("#symsizeop").val();
	if (ssop == "symdec"){
		symSize = symSize - 1;
	}
	if (ssop == "symdec--"){
                symSize = symSize - 2;
        }
	if (ssop == "syminc"){
		symSize = symSize + 1;
        }
	if (ssop == "syminc++"){
                symSize = symSize + 2;
        }
	$("#mapconfig").html("");
}
*/

function findSelectedGSM(minX, minY, maxX, maxY){
	//check mode to determine which set, blood all and leukemia
	var total = 0;
	var gsmselected = "";
	hgsmselected = "";	
	var tcgaids = [];
	var htotal = 0
	for (var gsm in gsms){
		var gsmid = gsms[gsm];		
		var dash = "_";
		if (sessionsource == "tcga")
			dash = ",";
		var _x = parseFloat(gsm.split("_")[0]);
		var _y = parseFloat(gsm.split("_")[1]);
		if (_x >= minX && _x <= maxX && _y >= minY && _y <= maxY ){
			gsmselected = gsmselected + gsmid + " "; 
			if (sessionsource == "tcga"){
				tcgaids.push(gsmid.replace(/\./g,'-'));
			}
			if (highgsm[gsmid] != null){
				htotal = htotal + 1;
				hgsmselected = hgsmselected + gsmid + " ";
			}
			total++;
		}
	}
	if (total <= maxgsmsallowed){
		if (sessionsource != "tcga"){
			$("#gsmmapcontainer").val(gsmselected);
			$("#sgsmannolink").html('<button onclick="gsm2GEXP();">AddSelected2BoxPlot</button>&nbsp;' + '<a href="#" onclick="gsm2Annotation();"><font color="blue">View_selected_annotations(' + total + ')</font></a>');
			$("#hexpmapselect").html('<button onclick="gsm2GEXP();">AddSelected2BoxPlot</button>&nbsp;' + '<a href="#" onclick="gsm2Annotation();"><font color="blue">View_selected_annotations(' + total + ')</font></a>');
			if (htotal > 0){
				$("#hexpmapselect").append('&nbsp;<button onclick="hgsm2GEXP();">AddHighExpGSM2BoxPlot</button>&nbsp;');
				$("#hexpmapselect").append('<a href="#" onclick="hgsm2Annotation();"><font color="blue">View_highexp_annotations(' + htotal + ')</font></a>');
			}
		}
		if (sessionsource == "tcga"){
			url = "http://www.cbioportal.org/study.do?cancer_study_id=laml_tcga#case_ids=" + tcgaids.join();
			$("#sgsmannolink").html('<a href="' + url + '" target="_blank""><font color="blue">View_CBIO_TCGA(' + total + ')</font></a>');

		}
		//$("#sgsmannolink").html('<a href="#" onclick="gsm2Annotation();"><font color="blue">View_selected_annotations(' + total + ')</font></a>');

	}else{
		$("#sgsmannolink").html(total + " selected");
	}
	
	
}

function showFlexCat(){
	new Messi("This implies category search will check on for matches across main, lineage and subtype", {title: 'Info'});
}

var outc = "gsm,gse,sample_type,main_cat,lineage_tumor_cat,subtype_cat,spec_cat,cytogenetics,alterations,clinical,sample_source,sample_isolation,tumor_type,tumor_purity";
outc = outc + ",patient,gender, race, age, phenotype, survival_status, survival_time, ef_pf_status, ef_survival, gsp, invivo_treatment, invivo_treatment_time, cultured, exvivo_treatment, exvivo_treatment_time,notes,altgsm,altgse,cluster";
var viewcontrol = " results <a href='javascript:show_cols()'><br><span id='mactl'><font color='blue'>Manage Annotation Columns&nbsp;</font></span></a><br><span id='manannocontainer' style='display:none;'>Click to view/hide: <a href='#' onclick='javascript:toggleHCols(\"0\");'><span id='_0hsl'>GSM </span></a><a href='#' onclick='javascript:toggleHCols(\"1\");'><span id='_1hsl'>GSE </span></a><a href='#' onclick='javascript:toggleHCols(\"2\");'><span id='_2hsl'>Sample type </span></a> <a href='#' onclick='javascript:toggleHCols(\"3\");'><span id='_3hsl'>Main category </span></a><a href='#' onclick='javascript:toggleHCols(\"4\");'><span id='_4hsl'>Cancer or cell type </span></a><a href='#' onclick='javascript:toggleHCols(\"5\");'><span id='_5hsl'>Subtype </span></a><a href='#' onclick='javascript:toggleHCols(\"6\");'><span id='_6hsl'>Further specification </span></a><a href='#' onclick='javascript:toggleHCols(\"7\");'><span id='_7hsl'>Cytogenetics </span></a><a href='#' onclick='javascript:toggleHCols(\"8\");'><span id='_8hsl'>Other genetic alterations </span></a> <a href='#' onclick='javascript:toggleHCols(\"9\");'><span id='_9hsl'>Clinical </span></a><a href='#' onclick='javascript:toggleHCols(\"10\");'><span id='_10hsl'>Sample source </span></a><a href='#' onclick='javascript:toggleHCols(\"11\");'><span id='_11hsl'>Sample Isolation </span></a><a href='#' onclick='javascript:toggleHCols(\"12\");'><span id='_12hsl'>Blood sample type </span></a><a href='#' onclick='javascript:toggleHCols(\"13\");'><span id='_13hsl'>Purity/Cancer cell content </span></a><a href='#' onclick='javascript:toggleHCols(\"14\");'><span id='_14hsl'>Patient </span></a><a href='#' onclick='javascript:toggleHCols(\"15\");'><span id='_15hsl'>Gender </span></a><a href='#' onclick='javascript:toggleHCols(\"16\");'><span id='_16hsl'>Race </span></a> <a href='#' onclick='javascript:toggleHCols(\"17\");'><span id='_17hsl'>Age </span></a><a href='#' onclick='javascript:toggleHCols(\"18\");'><span id='_18hsl'>Phenotype </span></a><a href='#' onclick='javascript:toggleHCols(\"19\");'><span id='_19hsl'>SurvivalStatus </span></a><a href='#' onclick='javascript:toggleHCols(\"20\");'><span id='_20hsl'>SurvivalTime </span></a><a href='#' onclick='javascript:toggleHCols(\"21\");'><span id='_21hsl'>*Recurrence </span></a><a href='#' onclick='javascript:toggleHCols(\"22\");'><span id='_22hsl'>*RecurrenceTime </span></a><a href='#' onclick='javascript:toggleHCols(\"23\");'><span id='_23hsl'>*Stage </span></a><a href='#' onclick='javascript:toggleHCols(\"24\");'><span id='_24hsl'>*InvivoTreatment </span></a><a href='#' onclick='javascript:toggleHCols(\"25\");'><span id='_25hsl'>*InvivoTreatmentTime </span></a><a href='#' onclick='javascript:toggleHCols(\"26\");'><span id='_26hsl'>*Cultured </span></a><a href='#' onclick='javascript:toggleHCols(\"27\");'><span id='_27hsl'>*ExvivoTreatment </span></a><a href='#' onclick='javascript:toggleHCols(\"28\");'><span id='_28hsl'>*ExvivoTreatmentTime </span></a><a href='#' onclick='javascript:toggleHCols(\"29\");'><span id='_29hsl'>*Additional notes </span></a><a href='#' onclick='javascript:toggleHCols(\"30\");'><span id='_30hsl'>*Alternate GSMs </span></a><a href='#' onclick='javascript:toggleHCols(\"31\");'><span id='_31hsl'>*Alternate GSEs </span></a><a href='#' onclick='javascript:toggleHCols(\"32\");'><span id='_32hsl'>*Cluster </span></a> *hidden</span>";

var columns = '<select id = "columns" name="columns" onchange="snp_selection()" style="display:inline"><option value="gsm">GSM</option><option value="gse">GSE</option><option value="sample_type">Sample type</option><option value="main_cat">Main Category</option><option value="lineage_tumor_cat" selected>Cancer or cell type category</option><option value="subtype_cat">Subtype</option><option value="spec_cat">Further specification</option><option value="cytogenetics">Cytogenetics</option><option value="alterations">Other genetic alterations</option><option value="clinical">Clinical</option><option value="patient">Patient</option><option value="sample_source">Sample source</option><option value="sample_isolation">Sample isolation</option><option value="tumor_type">Blood sample type</option><option value="tumor_purity">Purity/Cancer cell content</option><option value="gender">Gender</option><option value="race">Race</option><option value="age">Age</option><option value="phenotype">Phenotype</option><option value="survival_status">SurvivalStatus</option><option value="survival_time">SurvivalTime</option><option value="ef_pf_status">Recurrence</option><option value="ef_survival">RecurrenceTime</option><option value="gsp">Stage</option><option value="invivo_treatment">InvivoTreatment</option><option value="invivo_treatment_time">InvivoTreatmentTime</option><option value="cultured">Cultured</option><option value="exvivo_treatment">ExvivoTreatment</option><option value="exvivo_treatment_time">ExvivoTreatmentTime</option><option value="notes">Additional notes</option><option value="gsms">GSMids</option><option value="cluster">Cluster</option></select>';

var advcolumns = '<select id = "advop" name="advop" style="display:inline;width:100px;"><option value=" AND ">AND</option><option value=" OR ">OR</option></select>&nbsp;<select id = "advcolumns" name="advcolumns" onchange="advance_selection()" style="display:inline;"><option value="gsm">GSM</option><option value="gse">GSE</option><option value="sample_type">Sample type</option><option value="main_cat">Main Category</option><option value="lineage_tumor_cat" selected>Cancer or cell type category</option><option value="subtype_cat">Subtype</option><option value="spec_cat">Further specification</option><option value="cytogenetics">Cytogenetics</option><option value="alterations">Other genetic alterations</option><option value="clinical">Clinical</option><option value="patient">Patient</option><option value="sample_source">Sample source</option><option value="sample_isolation">Sample isolation</option><option value="tumor_type">Blood sample type</option><option value="tumor_purity">Purity/Cancer cell content</option><option value="gender">Gender</option><option value="race">Race</option><option value="age">Age</option><option value="phenotype">Phenotype</option><option value="survival_status">SurvivalStatus</option><option value="survival_time">SurvivalTime</option><option value="ef_pf_status">Recurrence</option><option value="ef_survival">RecurrenceTime</option><option value="gsp">Stage</option><option value="invivo_treatment">InvivoTreatment</option><option value="invivo_treatment_time">InvivoTreatmentTime</option><option value="cultured">Cultured</option><option value="exvivo_treatment">ExvivoTreatment</option><option value="exvivo_treatment_time">ExvivoTreatmentTime</option><option value="notes">Additional notes</option><option value="gsms">GSMids</option><option value="cluster">Cluster</option></select>';
var aoc = [
                                        { "sTitle": "GSM identifier (sample)" },
                                        { "sTitle": "GSE identifier (experiment)" },
                                        { "sTitle": "Sample type" },
					{ "sTitle": "Main category" },
                                        { "sTitle": "Cancer or cell type" },
                                        { "sTitle": "Subtype" },
                                        { "sTitle": "Further specification" },
                                        { "sTitle": "Cytogenetics" },
				        { "sTitle": "Other genetic alterations" },
                                        { "sTitle": "Clinical" },
                                        { "sTitle": "Sample source" },
                                        { "sTitle": "Sample isolation" }];
        aoc.push({ "sTitle": "Blood sample type" });
        aoc.push({ "sTitle": "Purity/Cancer cell content" });
aoc.push({ "sTitle": "Patient", "bVisible": false });
aoc.push({ "sTitle": "Gender", "bVisible": true });
aoc.push({ "sTitle": "Race", "bVisible": true });
aoc.push({ "sTitle": "Age", "bVisible": true });
aoc.push({ "sTitle": "Phenotype", "bVisible": true });
aoc.push({ "sTitle": "SurvivalStatus", "bVisible": true });
aoc.push({ "sTitle": "SurvivalTime", "bVisible": true });
aoc.push({ "sTitle": "Recurrence", "bVisible": false });
aoc.push({ "sTitle": "RecurrenceTime", "bVisible": false });
aoc.push({ "sTitle": "Stage", "bVisible": false });
aoc.push({ "sTitle": "InvivoTreatment", "bVisible": false });
aoc.push({ "sTitle": "InvivoTreatmentTime", "bVisible": false });
aoc.push({ "sTitle": "Cultured", "bVisible": false });
aoc.push({ "sTitle": "ExvivoTreatment", "bVisible": false });
aoc.push({ "sTitle": "ExvivoTreatmentTime", "bVisible": false });
aoc.push({ "sTitle": "Additional notes", "bVisible": false });
aoc.push({ "sTitle": "Alternate GSM identifiers", "bVisible": false });
aoc.push({ "sTitle": "Alternate GSE identifiers", "bVisible": false });
aoc.push({ "sTitle": "Cluster", "bVisible": false });

function searchAnnotations(){
	//snptable.fnClearTable();   
	//var panno = $('#panno').attr('checked'); 
  	var parameter = $("#search_input").val();
	var column = $("#columns").val();
	if (column == "cluster"){
		if (isNaN(parameter) == true || parseInt(parameter) > 55){
			new Messi("Cluster values are integer values from [1..55]", {title: 'Cluster validation'});	
			return;
		}
	}
	var advop = $("#advop").val();
	var advcol = $("#advcolumns").val();
	var advparam = $("#advsearch_input").val();
	var advvis = $("#advspan").is(":visible");

	annoval = parameter;
	var searchin = '&nbsp;<input type="search" value="' + annoval + '" style="display:block;width:400px;" size="400" name="search_input" id="search_input" data-provide="typeahead" data-items="10" TITLE="Enter multiple GSMids separated by spaces. Partial search is supported for all columns; typeahead recommendations supported for columns Main Category, Cancer or cell type category, Subtype, Cytogenetics, Sample type, Sample source, Sample isolation, Alterations, Tumor types and Survival status. Use Advanced function for AND/OR searches. Manage Annotations can display/hide columns. Results can be subfiltered using Refine results. Please check User guide for more details."  placeholder="Enter value">';
	var advsearchin = '<input type="search" value="' + "" + '" style="display:inline;width:250px;" size="250" name="advsearch_input" id="advsearch_input" data-provide="typeahead" data-items="10" TITLE="Enter multiple GSMids separated by spaces. Partial search is supported for all columns; typeahead recommendations supported for columns Main Category, Cancer or cell type category, Subtype, Cytogenetics, Sample type, Sample source, Sample isolation, Alterations, Tumor types and Survival status. Use Advanced function for AND/OR searches. Manage Annotations can display/hide columns. Results can be subfiltered using Refine results. Please check User guide for more details." placeholder="Enter value">';
	$("#columns").val(annocol);
	
	var button = '&nbsp;<button id="searchHemaAnnotations" value="Filter" onClick="searchAnnotations()">Search</button>&nbsp;<button onclick="add2GEXP();">AddResults2Boxplot</button><span id="gexp_dialog"></span><span id="snp_dialog"></span><br><span id="op_container"></span>';
        $('#annoSNP').html(columns + searchin + ' <a href="javascript:show_advanced()"><font color="blue"> Advanced </font></a><span id="advspan" style="display:none">' + advcolumns + " "+ advsearchin + "</span>" + button + '<br><table cellpadding="0" cellspacing="0" border="0" class="display" id="usnptable"></table>' );

	$("#columns").val(column);
//$('#SNP').html( rawdata + '<br>' + columns + searchin + button + '<br><table cellpadding="0" cellspacing="0" border="0" class="display" id="snptable"></table>' );
	if (advvis == true){
		$("#advspan").show();
	}	
	$( "#snp_dialog" ).html("<img src='images/progress.gif' />");
	$.ajax({
                type: "POST",
                url:  "/cgi-bin/get_hema_annotations_prog.cgi",
                        data: {'inparameter': parameter,'column': column, 'outc':outc, 'advancedparameter': advparam,'advancedcolumn':advcol,'advancedop':advop},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
					new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
       				$("#advop").val(advop);
			        $("#advcolumns").val(advcol);
        			$("#advsearch_input").val(advparam);

	                        var jo  = $.parseJSON(json);
				$("#search_input").css("display","inline");
				$("#search_input").val(parameter);
                                var _data = jo["aaData"];
				annogsms = [];
				for (var d in _data){
					annogsms.push(_data[d][0].split(")")[0].split("(")[1].replace(/"/g,''));
					//annogsms.push(_data[d][0]);
				}
				var adv = "";
				if (advparam != "" )
					adv = " " + advop + " " + advparam;
				previous_advance = advparam; 
				$("#snp_dialog").html(" Found " + _data.length + viewcontrol);
                        	snptable = $("#usnptable").dataTable( {
                                        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 20,
                                        "oLanguage": { "sSearch": "Refine results:" },
                                        "aaData": _data,
                                        "aoColumns": aoc, 
                                        });
				$("#op_container").html("<a href='javascript:about_anno_estain()'>info&nbsp;</a><input type='color' id='color2' name='color2' style='width:50px' value='#3355cc' /> &nbsp;<button type='button' onClick='javascript:estainAnno();'>See Results on Map</button>");
				 $("#op_container").css("float", "right");
				resnp_selection();
				advance_selection();
			},
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
}



function show_cols(){
	//new Messi("You can custom visibility of each of the annotations by clicking on them. The Refine results function will search the annotation even if it is hidden", {title: "Annotation info", autoclose:1500, titleClass: 'success', width:"600px"} );
	//manannocontainer
	if ($("#manannocontainer").is(":visible") == false){
		$("#manannocontainer").show();	
		//<span id="mactl">
		$("#mactl").html("<font color='blue'>Hide Manage Annotation Columns</font>");
	}
	else{// if ($("#manannocontainer").is(":visible") == true){
                $("#manannocontainer").hide();
		$("#mactl").html("<font color='blue'>Manage Annotation Columns</font>");
        }
}

function snp_selection(){
    var column = $('#columns').val();
    var autocomplete = $('#search_input').typeahead();
    if (column == "main_cat"){
	autocomplete.data('typeahead').source = tumortypes;
    }else if (column == "lineage_tumor_cat"){
	autocomplete.data('typeahead').source = lineagetypes; 
    }else if (column == "subtype_cat"){
        autocomplete.data('typeahead').source = subtypes;
    }else if (column == "cytogenetics"){
	autocomplete.data('typeahead').source = cytogenetics;
    }else if (column == "sample_type"){
        autocomplete.data('typeahead').source = sample_types;
    }else if (column == "sample_source"){
        autocomplete.data('typeahead').source = sample_sources;
    }else if (column == "sample_isolation"){
        autocomplete.data('typeahead').source = sample_isolations;
    }else if (column == "alterations"){
        autocomplete.data('typeahead').source = alterations;
    }else if (column == "tumor_type"){
        autocomplete.data('typeahead').source = tumor_types;
    }else if (column == "survival_status"){
        autocomplete.data('typeahead').source = survival_status;
    }else if (column == "cluster"){
        autocomplete.data('typeahead').source = clusters;
    }
    else{
	autocomplete.data('typeahead').source = [];
    }
    $('#search_input').val("");
    //advance_selection();
}

function resnp_selection(){
    var column = $('#columns').val();
    var autocomplete = $('#search_input').typeahead();
    if (column == "main_cat"){
        autocomplete.data('typeahead').source = tumortypes;
    }else if (column == "lineage_tumor_cat"){
        autocomplete.data('typeahead').source = lineagetypes;
    }else if (column == "subtype_cat"){
        autocomplete.data('typeahead').source = subtypes;
    }else if (column == "cytogenetics"){
        autocomplete.data('typeahead').source = cytogenetics;
    }else if (column == "sample_type"){
        autocomplete.data('typeahead').source = sample_types;
    }else if (column == "sample_source"){
        autocomplete.data('typeahead').source = sample_sources;
    }else if (column == "sample_isolation"){
        autocomplete.data('typeahead').source = sample_isolations;
    }else if (column == "alterations"){
        autocomplete.data('typeahead').source = alterations;
    }else if (column == "tumor_type"){
        autocomplete.data('typeahead').source = tumor_types;
    }else if (column == "survival_status"){
        autocomplete.data('typeahead').source = survival_status;
    }else if (column == "cluster"){
        autocomplete.data('typeahead').source = clusters;
    }
    else{
        autocomplete.data('typeahead').source = [];
    }
}
function advance_selection(){
    $('#advsearch_input').val("");
    var column = $('#advcolumns').val();
    var autocomplete = $('#advsearch_input').typeahead();
    if (column == "main_cat"){
        autocomplete.data('typeahead').source = tumortypes;
    }else if (column == "lineage_tumor_cat"){
        autocomplete.data('typeahead').source = lineagetypes;
    }else if (column == "subtype_cat"){
        autocomplete.data('typeahead').source = subtypes;
    }else if (column == "cytogenetics"){
        autocomplete.data('typeahead').source = cytogenetics;
    }else if (column == "sample_type"){
        autocomplete.data('typeahead').source = sample_types;
    }else if (column == "sample_source"){
        autocomplete.data('typeahead').source = sample_sources;
    }else if (column == "sample_isolation"){
        autocomplete.data('typeahead').source = sample_isolations;
    }else if (column == "alterations"){
        autocomplete.data('typeahead').source = alterations;
    }else if (column == "tumor_type"){
        autocomplete.data('typeahead').source = tumor_types;
    }else if (column == "survival_status"){
        autocomplete.data('typeahead').source = survival_status;
    }
    else{
        autocomplete.data('typeahead').source = [];
    }
}

var snptable = null;
function initAnno(){
	advancemsg = "The Advanced column function, selected with Query drop down, allows for custom queries. Essentially the field becomes free sql select WHERE clause meaning that syntax must be correct; use the column headers in the table below since they match exactly the column in the db, such as xref = xref. Multiple columns and using AND OR clause are ok. An example is (name='TP53' AND Var_Type='del') finds all snps for gene TP53 and del var_types,<br>Another example is (name='CEP104' AND refGene='exonic') It is very important that text(String) values require single quotes and LIKE requires %";
	if ($('#gsmmapcontainer').val() == ""){
		annoval = "CD4";//AML";
	}
	var searchin = '&nbsp;<input type="search" value="' + annoval + '" style="display:inline;width:250px;" size="250" name="search_input" id="search_input" data-provide="typeahead" data-items="10" TITLE="By default, Search does partial match, multiple GSMs need to use GSMids and separate by space. Typeahead supported columns are Main Category, Cancer or cell type category, Subtype and Cytogenetics. AltGSM and AltGSE are supported using GSM and GSE fields. Check See All Annotations to see all columns. Returned results can be subfiltered for any matching expression using Refine results (right)"  placeholder="Enter value">';
	var advsearchin = '<input type="search" value="' + "" + '" style="display:inline;width:250px;" size="250" name="advsearch_input" id="advsearch_input" data-provide="typeahead" data-items="10" TITLE="By default, Search does partial match, multiple GSMs need to use GSMids and separate by space. Typeahead supported columns are Main Category, Cancer or cell type, Subtype and Cytogenetics. AltGSM and AltGSE are supported using GSM and GSE fields. Check See All Annotations to see all columns. Returned results can be subfiltered for any matching expression using Refine results (right)"  placeholder="Enter value">';

	$("#columns").val(annocol);
        var button = '&nbsp;<button id="searchHemaAnnotations" value="Filter" onClick="searchAnnotations()">Search</button>&nbsp;<button onclick="add2GEXP();">AddResults2Boxplot</button>&nbsp;<span id="gexp_dialog"></span><span id="snp_dialog"></span><br><span id="op_container"></span>'; 
	$('#annoSNP').html(columns + searchin + ' <a href="javascript:show_advanced()"><font color="blue"> Advanced </font></a><span id="advspan" style="display:none">' + advcolumns + " " + advsearchin + "</span>" + button + '<br><table cellpadding="0" cellspacing="0" border="0" class="display" id="snptable"></table>' );
	//$("#aesctl").hide();
        $( "#snp_dialog" ).html("<img src='images/progress.gif' />");
var advparam = "";
var advcol = "";
var advop = " AND ";
	$.ajax({
                type: "POST",
                url:  "/cgi-bin/get_hema_annotations_prog.cgi",
                        data: {'inparameter': annoval,'column':annocol, 'outc': outc, 'advancedparameter': advparam,'advancedcolumn':advcol,'advancedop':advop},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
					new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _data = jo["aaData"];
				annogsms = [];
                                for (var d in _data){
                                	annogsms.push(_data[d][0].split(")")[0].split("(")[1].replace(/"/g,''));
				}
				previous_advance = advparam;
				$("#search_input").css("display","inline"); 
				$("#snp_dialog").html(" Found " + _data.length + viewcontrol); 
				$('#search_input').typeahead({source: lineagetypes});
                                snptable = $('#snptable').dataTable( {
                                        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 20,
					"oLanguage": { "sSearch": "Refine results" },    
                                        "aaData": _data,
                                        "aoColumns": aoc
                                        });
				$("#op_container").html("<a href='javascript:about_anno_estain()'>info&nbsp;</a><input type='color' id='color2' name='color2' style='width:50px' value='#3355cc' /> &nbsp;<button type='button' onClick='javascript:estainAnno();'>See Results on Map</button>");
				$("#op_container").css("float", "right");
				//$( "#tabs" ).tabs( "option", "active", 1 );
				$("#columns").val(annocol);
                        },
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
}

function initPortrait(){
	var options = "<option value='CellLine_Leukemia_ALL_ATL_MT4'>CELLLINE_LEUKEMIA_ALL_ATL_MT4</option><option value='CellLine_Leukemia_ALL_T-ALL_CCRF-CEM'>CELLLINE_LEUKEMIA_ALL_T-ALL_CCRF-CEM</option><option value='CellLine_Leukemia_ALL_T-ALL_CCRF-CEM-C7H2'>CELLLINE_LEUKEMIA_ALL_T-ALL_CCRF-CEM-C7H2</option><option value='CellLine_Leukemia_ALL_T-ALL_HPB-ALL'>CELLLINE_LEUKEMIA_ALL_T-ALL_HPB-ALL</option><option value='CellLine_Leukemia_ALL_T-ALL_Jurkat'>CELLLINE_LEUKEMIA_ALL_T-ALL_JURKAT</option><option value='CellLine_Leukemia_ALL_T-ALL_KOPT-K1'>CELLLINE_LEUKEMIA_ALL_T-ALL_KOPT-K1</option><option value='CellLine_Leukemia_ALL_T-ALL_MOLT-4'>CELLLINE_LEUKEMIA_ALL_T-ALL_MOLT-4</option><option value='CellLine_Leukemia_ALL_pre-B-ALL_697'>CELLLINE_LEUKEMIA_ALL_PRE-B-ALL_697</option><option value='CellLine_Leukemia_ALL_pre-B-ALL_REH'>CELLLINE_LEUKEMIA_ALL_PRE-B-ALL_REH</option><option value='CellLine_Leukemia_AML_CMK'>CELLLINE_LEUKEMIA_AML_CMK</option><option value='CellLine_Leukemia_AML_HEL92.1.7'>CELLLINE_LEUKEMIA_AML_HEL92.1.7</option><option value='CellLine_Leukemia_AML_HL-60'>CELLLINE_LEUKEMIA_AML_HL-60</option><option value='CellLine_Leukemia_AML_KG-1'>CELLLINE_LEUKEMIA_AML_KG-1</option><option value='CellLine_Leukemia_AML_M-07e_MO7e'>CELLLINE_LEUKEMIA_AML_M-07E_MO7E</option><option value='CellLine_Leukemia_AML_MonoMac6_MM6'>CELLLINE_LEUKEMIA_AML_MONOMAC6_MM6</option><option value='CellLine_Leukemia_AML_NB-4'>CELLLINE_LEUKEMIA_AML_NB-4</option><option value='CellLine_Leukemia_AML_NOMO-1'>CELLLINE_LEUKEMIA_AML_NOMO-1</option><option value='CellLine_Leukemia_AML_SKM-1'>CELLLINE_LEUKEMIA_AML_SKM-1</option><option value='CellLine_Leukemia_AML_THP-1'>CELLLINE_LEUKEMIA_AML_THP-1</option><option value='CellLine_Leukemia_CLL_CLL-I83E95'>CELLLINE_LEUKEMIA_CLL_CLL-I83E95</option><option value='CellLine_Leukemia_CLL_T-CLL_Kit-225'>CELLLINE_LEUKEMIA_CLL_T-CLL_KIT-225</option><option value='CellLine_Leukemia_CML_K-562'>CELLLINE_LEUKEMIA_CML_K-562</option><option value='CellLine_Lymphoma_BCL_BL_BL-41'>CELLLINE_LYMPHOMA_BCL_BL_BL-41</option><option value='CellLine_Lymphoma_BCL_BL_Raji'>CELLLINE_LYMPHOMA_BCL_BL_RAJI</option><option value='CellLine_Lymphoma_BCL_BL_Ramos'>CELLLINE_LYMPHOMA_BCL_BL_RAMOS</option><option value='CellLine_Lymphoma_BCL_DLBCL_Farage'>CELLLINE_LYMPHOMA_BCL_DLBCL_FARAGE</option><option value='CellLine_Lymphoma_BCL_DLBCL_NU-DHL-1'>CELLLINE_LYMPHOMA_BCL_DLBCL_NU-DHL-1</option><option value='CellLine_Lymphoma_BCL_DLBCL_OCI-LY-19_OCI-Ly19'>CELLLINE_LYMPHOMA_BCL_DLBCL_OCI-LY-19_OCI-LY19</option><option value='CellLine_Lymphoma_BCL_DLBCL_PR-9'>CELLLINE_LYMPHOMA_BCL_DLBCL_PR-9</option><option value='CellLine_Lymphoma_BCL_DLBCL_UMCL01-101'>CELLLINE_LYMPHOMA_BCL_DLBCL_UMCL01-101</option><option value='CellLine_Lymphoma_BCL_HL_HDLM-2'>CELLLINE_LYMPHOMA_BCL_HL_HDLM-2</option><option value='CellLine_Lymphoma_BCL_HL_KM-H2'>CELLLINE_LYMPHOMA_BCL_HL_KM-H2</option><option value='CellLine_Lymphoma_BCL_HL_L-1236'>CELLLINE_LYMPHOMA_BCL_HL_L-1236</option><option value='CellLine_Lymphoma_BCL_HL_L-428'>CELLLINE_LYMPHOMA_BCL_HL_L-428</option><option value='CellLine_Lymphoma_BCL_HL_L-540'>CELLLINE_LYMPHOMA_BCL_HL_L-540</option><option value='CellLine_Lymphoma_BCL_MCL_HBL2'>CELLLINE_LYMPHOMA_BCL_MCL_HBL2</option><option value='CellLine_Lymphoma_BCL_MCL_JeKo-1'>CELLLINE_LYMPHOMA_BCL_MCL_JEKO-1</option><option value='CellLine_Lymphoma_BCL_PEL_BC-3'>CELLLINE_LYMPHOMA_BCL_PEL_BC-3</option><option value='CellLine_Lymphoma_DLBCL_SU-DHL-4'>CELLLINE_LYMPHOMA_DLBCL_SU-DHL-4</option><option value='CellLine_Lymphoma_NKTCL_SNT-13'>CELLLINE_LYMPHOMA_NKTCL_SNT-13</option><option value='CellLine_Lymphoma_NKTCL_SNT-15'>CELLLINE_LYMPHOMA_NKTCL_SNT-15</option><option value='CellLine_Lymphoma_NKTCL_SNT-8'>CELLLINE_LYMPHOMA_NKTCL_SNT-8</option><option value='CellLine_Lymphoma_TCL_CTCL_MF_HuT102'>CELLLINE_LYMPHOMA_TCL_CTCL_MF_HUT102</option><option value='CellLine_Lymphoma_TCL_CTCL_SS_HuT78'>CELLLINE_LYMPHOMA_TCL_CTCL_SS_HUT78</option><option value='CellLine_Lymphoma_TCL_CTCL_SS_Sez-4'>CELLLINE_LYMPHOMA_TCL_CTCL_SS_SEZ-4</option><option value='CellLine_Lymphoma_TCL_PTCL-ATL_TaY'>CELLLINE_LYMPHOMA_TCL_PTCL-ATL_TAY</option><option value='CellLine_Lymphoma_na_na_U-937'>CELLLINE_LYMPHOMA_NA_NA_U-937</option><option value='CellLine_Myeloma_MM_8226_S_RPMI-8226'>CELLLINE_MYELOMA_MM_8226_S_RPMI-8226</option><option value='CellLine_Myeloma_MM_IM9'>CELLLINE_MYELOMA_MM_IM9</option><option value='CellLine_Myeloma_MM_INA-1'>CELLLINE_MYELOMA_MM_INA-1</option><option value='CellLine_Myeloma_MM_KMS-11'>CELLLINE_MYELOMA_MM_KMS-11</option><option value='CellLine_Myeloma_MM_MM1-R'>CELLLINE_MYELOMA_MM_MM1-R</option><option value='CellLine_Myeloma_MM_MM1-S_MM1S_MM.1S'>CELLLINE_MYELOMA_MM_MM1-S_MM1S_MM.1S</option><option value='CellLine_Myeloma_MM_NCI-H929_H929'>CELLLINE_MYELOMA_MM_NCI-H929_H929</option><option value='CellLine_Myeloma_MM_OPM-1'>CELLLINE_MYELOMA_MM_OPM-1</option><option value='CellLine_Myeloma_MM_OPM-2'>CELLLINE_MYELOMA_MM_OPM-2</option><option value='CellLine_Myeloma_MM_RPMI-826'>CELLLINE_MYELOMA_MM_RPMI-826</option><option value='CellLine_Myeloma_MM_RPMI8226'>CELLLINE_MYELOMA_MM_RPMI8226</option><option value='CellLine_Myeloma_MM_Sachi'>CELLLINE_MYELOMA_MM_SACHI</option><option value='CellLine_Myeloma_MM_U266B1_U-266'>CELLLINE_MYELOMA_MM_U266B1_U-266</option><option value='CellLine_NonCancerImmortalized_ATL_MT2'>CELLLINE_NONCANCERIMMORTALIZED_ATL_MT2</option><option value='CellLine_NonCancerImmortalized_ATL_Tesi'>CELLLINE_NONCANCERIMMORTALIZED_ATL_TESI</option><option value='CellLine_NonCancerImmortalized_BL_P493-6'>CELLLINE_NONCANCERIMMORTALIZED_BL_P493-6</option><option value='CellLine_NonCancerImmortalized_na_EBNA3CHT'>CELLLINE_NONCANCERIMMORTALIZED_NA_EBNA3CHT</option><option value='NonCancerHealthy_B-Lymphoid_Bcell'>NONCANCERHEALTHY_B-LYMPHOID_BCELL</option><option value='NonCancerHealthy_B-Lymphoid_BcellActivated'>NONCANCERHEALTHY_B-LYMPHOID_BCELLACTIVATED</option><option value='NonCancerHealthy_B-Lymphoid_GerminalCentreCentroblast'>NONCANCERHEALTHY_B-LYMPHOID_GERMINALCENTRECENTROBLAST</option><option value='NonCancerHealthy_B-Lymphoid_GerminalCentreCentrocyte'>NONCANCERHEALTHY_B-LYMPHOID_GERMINALCENTRECENTROCYTE</option><option value='NonCancerHealthy_B-Lymphoid_MemoryBcell'>NONCANCERHEALTHY_B-LYMPHOID_MEMORYBCELL</option><option value='NonCancerHealthy_B-Lymphoid_NaiveBcell'>NONCANCERHEALTHY_B-LYMPHOID_NAIVEBCELL</option><option value='NonCancerHealthy_B-Lymphoid_PlasmaBcell'>NONCANCERHEALTHY_B-LYMPHOID_PLASMABCELL</option><option value='NonCancerHealthy_Erythroid_Erythroblast'>NONCANCERHEALTHY_ERYTHROID_ERYTHROBLAST</option><option value='NonCancerHealthy_Erythroid_Erythrocyte'>NONCANCERHEALTHY_ERYTHROID_ERYTHROCYTE</option><option value='NonCancerHealthy_Erythroid_ErythroidProgenitor'>NONCANCERHEALTHY_ERYTHROID_ERYTHROIDPROGENITOR</option><option value='NonCancerHealthy_Erythroid_ErythroidProgenitorDifferentiated'>NONCANCERHEALTHY_ERYTHROID_ERYTHROIDPROGENITORDIFFERENTIATED</option><option value='NonCancerHealthy_Erythroid_Platelet'>NONCANCERHEALTHY_ERYTHROID_PLATELET</option><option value='NonCancerHealthy_Lymphoid_NaturalKillerCell'>NONCANCERHEALTHY_LYMPHOID_NATURALKILLERCELL</option><option value='NonCancerHealthy_Lymphoid_PlasmacytoidDendriticCellActivated'>NONCANCERHEALTHY_LYMPHOID_PLASMACYTOIDDENDRITICCELLACTIVATED</option><option value='NonCancerHealthy_Myeloid_AlveolarMacrophage'>NONCANCERHEALTHY_MYELOID_ALVEOLARMACROPHAGE</option><option value='NonCancerHealthy_Myeloid_CD16+Monocyte'>NONCANCERHEALTHY_MYELOID_CD16+MONOCYTE</option><option value='NonCancerHealthy_Myeloid_Dendritic-DifferentiatingMonocyte'>NONCANCERHEALTHY_MYELOID_DENDRITIC-DIFFERENTIATINGMONOCYTE</option><option value='NonCancerHealthy_Myeloid_DendriticCell'>NONCANCERHEALTHY_MYELOID_DENDRITICCELL</option><option value='NonCancerHealthy_Myeloid_DendriticCellActivated'>NONCANCERHEALTHY_MYELOID_DENDRITICCELLACTIVATED</option><option value='NonCancerHealthy_Myeloid_LangerhansCell'>NONCANCERHEALTHY_MYELOID_LANGERHANSCELL</option><option value='NonCancerHealthy_Myeloid_M1-DifferentiatingMonocyte'>NONCANCERHEALTHY_MYELOID_M1-DIFFERENTIATINGMONOCYTE</option><option value='NonCancerHealthy_Myeloid_M1-Macrophage'>NONCANCERHEALTHY_MYELOID_M1-MACROPHAGE</option><option value='NonCancerHealthy_Myeloid_M2-Macrophage'>NONCANCERHEALTHY_MYELOID_M2-MACROPHAGE</option><option value='NonCancerHealthy_Myeloid_M2-MacrophageActivated'>NONCANCERHEALTHY_MYELOID_M2-MACROPHAGEACTIVATED</option><option value='NonCancerHealthy_Myeloid_Monocyte'>NONCANCERHEALTHY_MYELOID_MONOCYTE</option><option value='NonCancerHealthy_Myeloid_MyeloidProgenitor1'>NONCANCERHEALTHY_MYELOID_MYELOIDPROGENITOR1</option><option value='NonCancerHealthy_Myeloid_MyeloidProgenitor2'>NONCANCERHEALTHY_MYELOID_MYELOIDPROGENITOR2</option><option value='NonCancerHealthy_Myeloid_Neutrophil'>NONCANCERHEALTHY_MYELOID_NEUTROPHIL</option><option value='NonCancerHealthy_StemCell_HematopoieticStemCell'>NONCANCERHEALTHY_STEMCELL_HEMATOPOIETICSTEMCELL</option><option value='NonCancerHealthy_T-Lymphoid_CD3+Tcell'>NONCANCERHEALTHY_T-LYMPHOID_CD3+TCELL</option><option value='NonCancerHealthy_T-Lymphoid_CD3+TcellActivated'>NONCANCERHEALTHY_T-LYMPHOID_CD3+TCELLACTIVATED</option><option value='NonCancerHealthy_T-Lymphoid_CD30+CD4+Tcell'>NONCANCERHEALTHY_T-LYMPHOID_CD30+CD4+TCELL</option><option value='NonCancerHealthy_T-Lymphoid_CD4+Tcell'>NONCANCERHEALTHY_T-LYMPHOID_CD4+TCELL</option><option value='NonCancerHealthy_T-Lymphoid_CD4+TcellActivated'>NONCANCERHEALTHY_T-LYMPHOID_CD4+TCELLACTIVATED</option><option value='NonCancerHealthy_T-Lymphoid_CD8+Tcell'>NONCANCERHEALTHY_T-LYMPHOID_CD8+TCELL</option><option value='NonCancerHealthy_T-Lymphoid_CD8+TcellActivated'>NONCANCERHEALTHY_T-LYMPHOID_CD8+TCELLACTIVATED</option><option value='NonCancerHealthy_T-Lymphoid_CentralMemoryCD4+Tcell'>NONCANCERHEALTHY_T-LYMPHOID_CENTRALMEMORYCD4+TCELL</option><option value='NonCancerHealthy_T-Lymphoid_EffectorMemoryCD4+Tcell'>NONCANCERHEALTHY_T-LYMPHOID_EFFECTORMEMORYCD4+TCELL</option><option value='NonCancerHealthy_T-Lymphoid_Gamma-delta-Tcell'>NONCANCERHEALTHY_T-LYMPHOID_GAMMA-DELTA-TCELL</option><option value='NonCancerHealthy_T-Lymphoid_NaiveCD4+Tcell'>NONCANCERHEALTHY_T-LYMPHOID_NAIVECD4+TCELL</option><option value='NonCancerHealthy_T-Lymphoid_NaiveCD8+Tcell'>NONCANCERHEALTHY_T-LYMPHOID_NAIVECD8+TCELL</option><option value='NonCancerHealthy_T-Lymphoid_NaturalKillerTcell'>NONCANCERHEALTHY_T-LYMPHOID_NATURALKILLERTCELL</option><option value='NonCancerHealthy_T-Lymphoid_RegulatoryTcell'>NONCANCERHEALTHY_T-LYMPHOID_REGULATORYTCELL</option><option value='NonCancerHealthy_T-Lymphoid_Tcell'>NONCANCERHEALTHY_T-LYMPHOID_TCELL</option><option value='NonCancerHealthy_T-Lymphoid_TcellActivated'>NONCANCERHEALTHY_T-LYMPHOID_TCELLACTIVATED</option><option value='NonCancerHealthy_T-Lymphoid_TcellResting'>NONCANCERHEALTHY_T-LYMPHOID_TCELLRESTING</option><option value='NonCancerHealthy_na_naGerminalCentre'>NONCANCERHEALTHY_NA_NAGERMINALCENTRE</option>";
	$('#celllines').html("Cellline: <select id='celllinein' style='width:500px' onChange='javascript:goportrait();'>" + options + "</select>");
	goportrait();
}


var stvTable;
function initSTV(){
	$('#STV').append("matti.nykter@uta.fi merja.heinaniemi@uef.fi");
}

function viewHemap(htype){
	sessionsource = htype;
	if (htype == 'tcga'){				
                gotcga();
		var gt = $('#gene_stain_ctl').typeahead();
		gt.data('typeahead').source = hg19genes.concat(methxgenes);	
                $("#bycnvrbt").show();
		$("#bymethbt").show();
	}else{
		methgenes = [];
		var gt = $('#gene_stain_ctl').typeahead();
                gt.data('typeahead').source = hg19genes;
		goshemap(htype, null, null);
		$("#bycnvrbt").hide();
		$("#bymethbt").hide();
	}
}

function greyBg(){
	$( "#grey_dialog" ).html("<img src='images/progress.gif' />");
	goshemap(sessionsource, null, null);
}

function resetGreyBg(){
        $( "#grey_dialog" ).html("<img src='images/progress.gif' />");
        resetHMap = true;
	goshemap(sessionsource, null, null);
}

function highlightGSM(gsm){
      //$("a.link").on("click",function(){
	window.open('http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=' + gsm,'_blank');
     //});
     $("#gsmcollector").append(gsm + " ");	
}
function about_anno_estain(){
	new Messi('Selected/Active annotation results will be layered on the HEMAP.', {title: 'Anno E-Stain'});
}

function viewAnnoInfo(){
	if ($("#annoinfo").is(":visible") == false){ 
		$("#annoinfo").show();
		$("#annoinfoctl").html('<a href="#" onclick="javascript:viewAnnoInfo();"><font color="blue">Hide Annotations Info</font></a>');
	}else{
		$("#annoinfo").hide();
		$("#annoinfoctl").html('<a href="#" onclick="javascript:viewAnnoInfo();"><font color="blue">See Annotations Info</font></a>');
	}
}

function show_advanced(){
	if ($("#advspan").is(":visible") == false){
               	 advance_selection();
		 $("#advspan").show();
	}else{
		$("#advsearch_input").val("");
		$("#advspan").hide();
	}
}

function gsm2GEXP(){
	var grpname = prompt("Please enter unique group name (alphanumeric with no spaces) as identifier", "");
	if (grpname !=null && grpname != ""){
                grpname = grpname.replace(" ", "_");
		grpname = grpname.replace("(", "_");
		grpname = grpname.replace(")", "_");
		sample_groups.push(grpname + "--gsms");
		sample_group_gsm[grpname + "--gsms"] = $("#gsmmapcontainer").val();
		new Messi('Defined sample gsm group ' + grpname + ', add more or select genes/plot at Boxplot', {title:"Success", autoclose:2000});
		$('#container').highcharts().zoomOut();

	}else{
		new Messi('Sample group name is required.', {title: 'Error'});
	}
}

function hgsm2GEXP(){
        var grpname = prompt("Please enter unique group name (alphanumeric with no spaces) for highly expressed sample identifier", "");
        if (grpname !=null && grpname != ""){
                grpname = grpname.replace(" ", "_");
                grpname = grpname.replace("(", "_");
                grpname = grpname.replace(")", "_");
                sample_groups.push(grpname + "--gsms");
                sample_group_gsm[grpname + "--gsms"] = hgsmselected;
                new Messi('Defined highly expressed group ' + grpname + ', add more or select genes/plot at Boxplot', {title:"Success", autoclose:2000});
                $('#container').highcharts().zoomOut();

        }else{
                new Messi('Sample group name is required.', {title: 'Error'});
        }
}
