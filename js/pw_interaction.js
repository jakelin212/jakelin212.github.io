var pwaoc = [
{ "sTitle": "feature", sWidth: "40px" },
{ "sTitle": "corr." },
{ "sTitle": "adjpvalue" },
{ "sTitle": "BHadj"},
{ "sTitle": "hypergeom_test"},
{ "sTitle": "BHadj"},
{ "sTitle": "nsamples"},
{ "sTitle": "ndiff_1"},
{ "sTitle": "ndiff_2"},
{ "sTitle": "nna_1"},
{ "sTitle": "nna_2"}
];

function search_pwpw(clustercb){
	if (clustercb == null)
		$("#hexpsearch").html("");
	var clusterclass = $("#pwpwfeature").val();
	var ccsource = $("#xpwfeatureatype").val(); 
	if (ccsource == "c_clin"){
		new Messi('Clinical category pathways do not have any pair wise results, stain directly using Pathway typeaheads', {title: 'Validation error'});
                return;
	}
	if (clusterclass == ""){
                new Messi('Cluster/class input is required', {title: 'Validation error'});
                return;
        }
	var sortby = [[ 1, "desc" ]];
	if (pworder == "adj_pv")
		sortby = [[ 2, "desc" ]];
	if (pworder == "adj_hypgpv")
                sortby = [[ 3, "desc" ]];
	$("#pwdialog").html(" Searching... <img src='http://jakelin212.github.io/images/progress.gif'/>");	
	
	var xact = "/cgi-bin/get_pwpw.cgi";
	if ($("#xmapselect").val() == "aml")
		xact = "/cgi-bin/get_aml_pwpw.cgi";
	if ($("#xmapselect").val() == "tcga"){
	        xact = "/cgi-bin/get_tcga_pwpw.cgi";  
	}
	$.ajax({
                type: "POST",
                url:  xact,
                        data: {'incclass': clusterclass,'insource':ccsource,'inlimit':xlimit, 'inorder':pworder, 'inpv':$("#pwpwpvalue").val(), 'incorr':$("#pwpwcorr").val(), 'corrop':$("#corrop").val(), 'inhypgeo':$("#pwpwhypt").val()},
                        success: function(json)
                        {
	                         if ($.parseJSON(json) == null){
                                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _data = jo["aaData"];
				if (_data.length > 0)
					$("#pwctlspan").show();
				new Messi("Found " + _data.length + ":" + $("#xmapselect").val(), {title: "Results", autoclose:1200, titleClass: 'success', width:"600px"} );
				$("#pwdialog").html("");
				$("#dldialog").html('<a href="' + "http://compbio.uta.fi/cgi-bin/download_pwpw.cgi?incclass=" + clusterclass + "&insource=" + ccsource + "&inorder=" + pworder + "&inpv=" + $("#pwpwpvalue").val() + "&incorr=" + $("#pwpwcorr").val() + "&inhypgeo=" + $("#pwpwhypt").val() + '" target="_blank" title="limit to 5000 for performance contact authors for raw files"><font color="blue"> Download(' + _data.length + ')</font></a>'); 
				$('#pwtbldiv').DataTable( {
			        "aaData": _data,
        			"bProcessing": true,
        			"bLengthChange": false,
				"bAutoWidth": false,
        			"aaSorting": sortby,
        			"sDom": '<"H"lr>t<"F"ipf>', //'<"if">i<"l"><tpfi>', 
        			"iDisplayLength": showrownum,
        			"bDestroy": true,"oLanguage": {
         			"sSearch": "Filter results"// + clusterclass
       				},
        			"aoColumns": pwaoc
    				} );
				if (clustercb != null){
					clustercb();
				}
			},
			error: function(){
				$("#pwdialog").html("Error");
				new Messi('Error on search, please check pathway/feature input and contact authors if error persists ', {title: 'Error'});		
			}
	});
}

function toggle_clustermap(){
	if (showcentroids == true){
		showcentroids = false;
	}else{
		showcentroids = true;
	}
	updateHexpmap();
}

function updateHexpmap(){
	$("#pwpwfeature").val("");
	$("#hexpmap").html("Loading <img src='http://jakelin212.github.io/images/progress.gif'/>")
	var hexsource = $("#xmapselect").val();
	sessionsource = hexsource;
	$('#gene_stain_ctl').val("");
	if (hexsource == "tcga"){
		$("#xpwfeatureatype").html("");
		gotcga("hexpmap");
                //$("#xpwfeatureatype").val();
                $("#xpwfeatureatype").val("c_clin");
                //$('#pathway_stain_ctl').typeahead().data('typeahead').source = tcga_cclass_c_clin;
                $('#gene_stain_ctl').typeahead().data('typeahead').source = tcga_gexps;

		$("#xpwfeatureatype").append().append($('<option>', { value : "drug" }).text("DrugSigDB"));
		$("#xpwfeatureatype").append().append($('<option>', { value : "b_clin" }).text("Binary:Clinical"));
                $("#xpwfeatureatype").append().append($('<option>', { value : "c_clin" }).text("Categories:Clinical"));
		$("#xpwfeatureatype").append().append($('<option>', { value : "n_clin" }).text("Numeric:Clinical")); 
		$("#xpwfeatureatype").append().append($('<option>', { value : "gexp" }).text("Gene Expression"));
		$("#xpwfeatureatype").append().append($('<option>', { value : "gsva" }).text("Pathway"));
		$("#xpwfeatureatype").append().append($('<option>', { value : "meth" }).text("Methylation"));
		$("#xpwfeatureatype").append().append($('<option>', { value : "cnvr" }).text("Copy number variation"));
		$("#xpwfeatureatype").append().append($('<option>', { value : "mirn" }).text("MIRNA"));
		$("#xpwfeatureatype").append().append($('<option>', { value : "gnab" }).text("Mutations"));
	}else{
		$("#xpwfeatureatype").html("");
                $("#xpwfeatureatype").append().append($('<option>', { value : "drug" }).text("DrugSigDB"));
                $("#xpwfeatureatype").append().append($('<option>', { value : "clin" }).text("Clinical"));
                $("#xpwfeatureatype").append().append($('<option>', { value : "gexp" }).text("Gene Expression"));
                $("#xpwfeatureatype").append().append($('<option>', { value : "gsva" }).text("Pathway"));
		//$('#gene_stain_ctl').typeahead().data('typeahead').source = hg19genes; 
	}
	
	if (hexsource == "hemaall"){
		goshemap(hexsource, all_cluster, null, "hexpmap");
	}
	if (hexsource == "aml"){
		goshemap(hexsource, null, null, "hexpmap");
	}
	updateClusterTypeahead();
}

function flippw(){
	if ($("#hexpmap").width() > $("#hexpmenu").width()){
		$("#hexpmenu").width(hexpmapwidth);
		$("#hexpmap").width(hexptblwidth)
	}
	else{
                $("#hexpmenu").width(hexptblwidth);
                $("#hexpmap").width(hexpmapwidth)
        }
	updateHexpmap();
}

function updateClusterTypeahead(){
	//$('#pwtbldiv').hide();
	//$('#pwtbldiv_filter').hide();
	$("#reportingx").html("");
        $("#gene_stain_ctl").val("");
	$("#hexpmapselect").html("");
	var xmap = $("#xmapselect").val();
	var xftype = $("#xpwfeatureatype").val();
	if (xftype == "gexp"){
		$('#gene_stain_ctl').typeahead().data('typeahead').source = hg19genes;
	}else{
		$('#gene_stain_ctl').typeahead().data('typeahead').source = msig_pws;
	}

	if (xmap == "hemaall"){
		if (xftype == "clin"){
			$('#gene_stain_ctl').typeahead().data('typeahead').source = clin_aml_pathways;
			$('#pwpwfeature').typeahead().data('typeahead').source = fullmap_clin_pwcluster_list;			
			$("#pwpwhypt").val("0");	
		}else if (xftype == "gexp"){
                        $('#pwpwfeature').typeahead().data('typeahead').source = fullmap_gexp_pwcluster_list;            
			$("#pwpwhypt").val("0");        		 
	       }else if (xftype == "gsva"){
			$('#gene_stain_ctl').typeahead().data('typeahead').source = msig_pws;
                        $('#pwpwfeature').typeahead().data('typeahead').source = fullmap_gsva_pwcluster_list;
                        $("#reportingx").html(' <button onclick="javascript:getpwmember()">getGeneMembers</button>');
	       }else if (xftype == "drug"){
			$('#gene_stain_ctl').typeahead().data('typeahead').source = drugsig_pws;
                        $('#pwpwfeature').typeahead().data('typeahead').source = fullmap_drug_pwcluster_list;
			$("#reportingx").html(' <button onclick="javascript:getpwmember()">getGeneMembers</button>');
                }
	}
	if (xmap == "aml"){
                if (xftype == "clin"){
			$('#gene_stain_ctl').typeahead().data('typeahead').source = clin_aml_pathways;
                        $('#pwpwfeature').typeahead().data('typeahead').source = aml_clin_pwcluster_list;
                        $("#pwpwhypt").val("0");
                }else if (xftype == "gexp"){
                        $('#pwpwfeature').typeahead().data('typeahead').source = aml_gexp_pwcluster_list;
                        $("#pwpwhypt").val("0");
               }else if (xftype == "gsva"){
        		$('#gene_stain_ctl').typeahead().data('typeahead').source = msig_pws.concat(extra_aml);
	                $('#pwpwfeature').typeahead().data('typeahead').source = aml_gsva_pwcluster_list;
			$("#reportingx").html(' <button onclick="javascript:getpwmember()">getGeneMembers</button>');
                }else if (xftype == "drug"){
			$('#gene_stain_ctl').typeahead().data('typeahead').source = drugsig_pws;
			//$('#gene_stain_ctl').typeahead().data('typeahead').source = msig_pws.concat(extra_aml);
                        $('#pwpwfeature').typeahead().data('typeahead').source = aml_drug_pwcluster_list;
			$("#reportingx").html(' <button onclick="javascript:getpwmember()">getGeneMembers</button>');
                }
	}
	if (xmap == "tcga"){
		$("#pwpwhypt").val("0");
		$("#pwpwpvalue").val("0");	
		if (xftype == "n_clin"){
                        $('#pwpwfeature').typeahead().data('typeahead').source = tcga_pwpw_cclass_n_clin; 
                        $("#pwpwhypt").val("0");
                }else if (xftype == "c_clin"){
			$('#gene_stain_ctl').typeahead().data('typeahead').source = tcga_cclass_c_clin;
                        $('#pwpwfeature').typeahead().data('typeahead').source = [];
                        $("#pwpwhypt").val("0");
			//disable search						
		}else if (xftype == "b_clin"){
                        $('#pwpwfeature').typeahead().data('typeahead').source = tcga_pwpw_cclass_b_clin;
			$('#gene_stain_ctl').typeahead().data('typeahead').source = bclin_features;
                        $("#pwpwhypt").val("0");
                }else if (xftype == "gexp"){
                        $('#pwpwfeature').typeahead().data('typeahead').source = tcga_pwpw_cclass_gexp;
                        $("#pwpwhypt").val("0");
               }else if (xftype == "gsva"){
                        $('#gene_stain_ctl').typeahead().data('typeahead').source = msig_pws;
		 	$('#pwpwfeature').typeahead().data('typeahead').source = tcga_pwpw_cclass_gsva;
            		$("#reportingx").html(' <button onclick="javascript:getpwmember()">getGeneMembers</button>');
	       }else if (xftype == "drug"){
			$('#gene_stain_ctl').typeahead().data('typeahead').source = drugsig_pws;
                        $('#pwpwfeature').typeahead().data('typeahead').source = tcga_pwpw_cclass_drug;
			$("#reportingx").html(' <button onclick="javascript:getpwmember()">getGeneMembers</button>');
                }else if (xftype == "meth"){
                        $('#pwpwfeature').typeahead().data('typeahead').source = tcga_pwpw_cclass_meth;
        		$('#gene_stain_ctl').typeahead().data('typeahead').source = meth_pathways; 
	       }else if (xftype == "cnvr"){
                        $('#pwpwfeature').typeahead().data('typeahead').source = tcga_pwpw_cclass_cnvr;
			$('#gene_stain_ctl').typeahead().data('typeahead').source = cnvr_pathways;
			$("#reportingx").html(' <button onclick="javascript:lookupGenecnvr()">Gene2Cyto</button> <button onclick="javascript:lookupCytoGenes()">Cyto2Genes</button>');
                }else if (xftype == "mirn"){
                        $('#pwpwfeature').typeahead().data('typeahead').source = tcga_pwpw_cclass_mirn;
			$('#gene_stain_ctl').typeahead().data('typeahead').source = mirn_pathways;
                }else if (xftype == "gnab"){
                        $('#pwpwfeature').typeahead().data('typeahead').source = tcga_pwpw_cclass_gnab;
               		$('#gene_stain_ctl').typeahead().data('typeahead').source = gnab_pathways;
		 }		
	}
}

function lookupGenecnvr(){
	var ingene = $('#gene_stain_ctl').val();
	$.ajax({
                type: "POST",
                url:  "/cgi-bin/find_cnvr_by_gene.cgi",
                        data: {'ingene': ingene},
                        success: function(json)
                        {
				var jo  = $.parseJSON(json);
                                var cyto = jo["cytoband"];
				if (cyto == null || cyto == ""){
					new Messi('No CNVR feature exists for ' + ingene, {title: 'Info'});
				}else{
					$('#gene_stain_ctl').val(cyto);
				}
                        },
                        error: function(){
                               new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
        });   
}

function lookupCytoGenes(){
        var incyto = $('#gene_stain_ctl').val();
        $.ajax({
                type: "POST",
                url:  "/cgi-bin/find_genes_by_cnvr.cgi",
                        data: {'incyto': incyto},
                        success: function(json)
                        {
                                var jo  = $.parseJSON(json);
                                var cygenes = jo["genes"];
                                if (cygenes == null || cygenes == ""){
                                        new Messi('No Genes exists for ' + incyto, {title: 'Info'});
                                }else{
                                        new Messi(cygenes, {title: incyto + " Gene members"}); 
                                }
                        },
                        error: function(){
                               new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
        });  
}


function tcga_pwstain(feature){
	var titlef = feature;
	var clusterclass = $("#pwpwfeature").val();
        var ccsource = $("#xpwfeatureatype").val();
	if ( ccsource == "b_clin"){
                        feature = bclin_dic[feature.split(":")[2]];
        }
	if ( ccsource == "gnab"){
                        var tk = feature.split(":");
			feature = tk[2] + "_" + tk[tk.length-1]; 
        }	
	$.ajax({
                type: "POST",
                url:  "/cgi-bin/stain_pw_tcga.cgi",
                        data: {'inparameter': feature, 'pathwaytype':ccsource, 'ccluster':clusterclass},
                        success: function(json)
                        {
				var mtitle = feature;
				if (titlef.split(":")[2] != null){
					mtitle = titlef.split(":")[2];
				}
                        	if (ccsource == "b_clin" || ccsource == "c_clin" || ccsource == "gnab" || ccsource == "drug" || ccsource == "gsva"){
					estainTcgaCat(json, ccsource + ":" + mtitle);
				}else{
			        	estainTcgaGexp(json, ccsource + ":" + mtitle);
                        	}
			},
                        error: function(){
                               new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
        });	
}

function getpwmember(){
	var feature = $("#gene_stain_ctl").val();
	
$.ajax({
                        type: "POST",
                        url:  "/cgi-bin/get_pw_members.cgi",
                        data: {'infeature':feature},
                        success: function(mjo)
                        {
                                var jo  = $.parseJSON(mjo);
                                var members = jo["members"];
                                var ref = jo["refsource"];
                                if (ref.indexOf("http:") != -1){
                                        ref = '<a href="' + ref + '" target="_blank">' + feature + '</a>'
                                }
                                var tarea = '<textarea style="width: 350px;" rows="10" cols="300" name="usrtxt" wrap="hard">' + members + '</textarea>';
                                new Messi("Source:" + ref + "<br><br>Gene set:<br>" + tarea,{title: feature + " info",height:'400px',width:'500px'});
                                $("#pwdialog").html("");
                        },
                        error: function(){
                        }
                        });

}
function pwstain(feature){
	if ($("#xpwfeatureatype").val() == "gexp"){
		$("#gene_stain_ctl").val(feature);
		estainGene();
	}else{
		$("#gene_stain_ctl").val(feature);
			var parr = $('#gene_stain_ctl').typeahead().data('typeahead').source;
			var gsva = 0;
			for (var id in parr){ 
                		if (parr[id] == feature){
					gsva = 1;
					break;
				}
			}
			if (gsva == 1){
				estainPathway();
			}else{
				new Messi("Sorry the selected feature is not GSVA type and cannot be stain");	
			}
	}
}

function download_pwpw(){
        var clusterclass = $("#pwpwfeature").val();
        var ccsource = $("#xpwfeatureatype").val();
        var sortby = [[ 1, "desc" ]];
        if (pworder == "adj_pv")
                sortby = [[ 2, "desc" ]];
        if (pworder == "adj_hypgpv")
                sortby = [[ 3, "desc" ]];
        $("#pwdialog").html(" Processing... <img src='http://jakelin212.github.io/images/progress.gif'/>");

        $.ajax({
                type: "POST",
                url:  "/cgi-bin/download_pwpw.cgi",
                        data: {'incclass': clusterclass,'insource':ccsource,'inlimit':xlimit, 'inorder':pworder, 'inpv':$("#pwpwpv").val(), 'incorr':$("#pwpwcorr").val(), 'inhypgeo':$("#pwpwhypt").val()},
                        success: function(result)
                        {
                        	var link="http://compbio.uta.fi/cgi-bin/download_pwpw.cgi?incclass=" + clusterclass + "&insource=" + ccsource + "&inlimit=" + xlimit + "&inorder=" + pworder + "&inpv=" + $("#pwpwpv").val() + "&incorr=" + $("#pwpwcorr").val() + "&inhypgeo=" + $("#pwpwhypt").val();
        			new Messi("Records saving as " + ccsource + "_" + clusterclass + ".pw.csv", {title: 'Downloaded', autoclose:1800});
        			$("#pwdialog").html("");
				var uri = 'data:application/csv;charset=UTF-8,' + encodeURIComponent(result);
				window.open(uri, clusterclass + '.pw.csv');
			},
                        error: function(){
                                new Messi('Network error on download, please contact authors if error persists ', {title: 'Error'});
                        }
        });
}

function loadCLINSAMP(){
	var clusterclass = $("#gene_stain_ctl").val();
        if (clusterclass == "") return;
        var ccsource = $("#xmapselect").val();
        var gtype = null;
        $("#pwdialog").html(" Processing... <img src='http://jakelin212.github.io/images/progress.gif'/>");
        var purl = "/cgi-bin/get_cluster2_gsms.cgi";
        $.ajax({
                type: "POST",
                url:  purl, //"/cgi-bin/get_cluster2_gsms.cgi",
                        data: {'incclass': clusterclass,'insource':ccsource,'type':gtype},
                        success: function(mjo)
                        {
                                $("#pwdialog").html("");
                                var jo  = $.parseJSON(mjo);
                                var _gsm1 = jo["gsm1"];
                                var _gsm0 = jo["gsm0"];
                                var _gsmna = jo["gsmna"];
                                if (Object.keys(_gsm1).length != 0){
                                var _gsmptobj = {};
                                _gsmptobj["low"] = _gsm0;
                                _gsmptobj["medium"] = _gsmna;
                                _gsmptobj["high"] = _gsm1;
                                goshemap("PWEStain:"+clusterclass, all_cluster, _gsmptobj,"hexpmap");
                                }
                        },
                        error: function(){
                                new Messi('Network error on page load, please contact authors if error persists ', {title: 'Error'});
                        }
        });
}

function loadBSAMP(){
        var clusterclass = $("#pwpwfeature").val();
	if (clusterclass == "") return;
        var ccsource = $("#xmapselect").val();
	var gtype = null; 
        $("#pwdialog").html(" Processing... <img src='http://jakelin212.github.io/images/progress.gif'/>");
	var purl = "/cgi-bin/get_cluster2_gsms.cgi";
	if (ccsource == "tcga"){
		gtype = "SAMP";
		purl = "/cgi-bin/get_cluster2_tcga.cgi"
	}
        $.ajax({
                type: "POST",
                url:  purl, //"/cgi-bin/get_cluster2_gsms.cgi",
                        data: {'incclass': clusterclass,'insource':ccsource,'type':gtype},
                        success: function(mjo)
                        {
                                $("#pwdialog").html("");
                        	var jo  = $.parseJSON(mjo);
                                var _gsm1 = jo["gsm1"]; 
				var _gsm0 = jo["gsm0"]; 
				var _gsmna = jo["gsmna"];
				if (Object.keys(_gsm1).length != 0){
                                var _gsmptobj = {};
                                _gsmptobj["low"] = _gsm0;
                                _gsmptobj["medium"] = _gsmna;
                                _gsmptobj["high"] = _gsm1;
                                goshemap("ClusterEStain:"+clusterclass, all_cluster, _gsmptobj,"hexpmap");
 				}
			},
                        error: function(){
				new Messi('Network error on page load, please contact authors if error persists ', {title: 'Error'});
                        }
        });
}
