
function estainCollected(){
	var parameter = ($("#gsmcollector").val());
        var column = $("#columns").val();
	$( "#snp_dialog" ).html("<img src='http://jakelin212.github.io/images/progress.gif' /> Processing eStain ...");
        $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_hema_annostain.cgi",
                        data: {'inparameter': parameter,'column': 'gsms', 'mapsource':sessionsource},
                        success: function(json)
                        {
				showRefMap();
                                if ($.parseJSON(json) == null){
                                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _pts = jo["espts"];
				var _gsmptobj = {};
				_gsmptobj[column + ":collected"] = _pts;
				goshemap(sessionsource, all_cluster, _gsmptobj);
                        	$( "#tabs" ).tabs( "option", "active", 0 );
			},
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
}


function estainAnno(){
        var ingsms = "";
	for (var i in annogsms){
		ingsms = ingsms + annogsms[i] + " "; 
	}
        var column = $("#columns").val();
        $( "#snp_dialog" ).html("<img src='http://jakelin212.github.io/images/progress.gif' /> Processing eStain ...");
        $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_hema_annostain.cgi",
                        data: {'inparameter': ingsms,'column': 'gsms', 'mapsource':sessionsource},
                        success: function(json)
                        {
                                showRefMap();
                                if ($.parseJSON(json) == null){
                                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _pts = jo["espts"];
                                var _gsmptobj = {};
                                //_gsmptobj[parameter] = jo["esgsms"];
                                _gsmptobj[column + ":" + $("#search_input").val()] = _pts;
                                goshemap(sessionsource, all_cluster, _gsmptobj);
                                $( "#tabs" ).tabs( "option", "active", 0 );
        			var fuwidth = $(window).width();
                		$('div#container').width(.95*fuwidth);
	                },
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
}


function estainMeth(){
	var parameter = ($("#gene_stain_ctl").val());
        if (parameter == ""){
                return;
        }
        $( "#gpprogress" ).html("<img src='http://jakelin212.github.io/images/progress.gif' /> Processing " + parameter + " eStain ...");
        if (sessionsource == "tcga"){
                $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_tcga_meth.cgi",
                        data: {'inparameter': parameter, 'mapsource':sessionsource},
                        success: function(json)
                        {
                                
				estainTcgaGexp(json, "Methylation:" + parameter);
                        },
                        error: function(){
                               new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });

        }
}

function estainGene(){
	if ($("#xpwfeatureatype").val() == "gexp"){
        var parameter = ($("#gene_stain_ctl").val());
	if (parameter == ""){
		return;
	}
	$("#pwdialog").html(" eStaining " + parameter + "... <img src='http://jakelin212.github.io/images/progress.gif'/>");
        $( "#gpprogress" ).html("<img src='http://jakelin212.github.io/images/progress.gif' /> Processing " + parameter + " eStain ...");
        if (sessionsource == "tcga"){
		$("#xpwfeatureatype").val("gexp");
		tcga_pwstain(parameter);
		$("#pwdialog").html("");	
	}else{
		var gurl = "/cgi-bin/get_hema_gstain2.cgi";
                sessionsource = $("#xmapselect").val();
		if (sessionsource == "aml"){
			gurl = "/cgi-bin/get_aml_gstain2.cgi";
		}
		$.ajax({
                	type: "POST",
                	url:  gurl,
                        data: {'inparameter': parameter, 'mapsource':sessionsource},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
                                        new Messi('Error on gene e-stain data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _low = jo["low"];
				var _medium = jo["medium"];
				var _high = jo["high"];	
				highgsm = jo["highgsm"];
                                var _gsmptobj = {};
                                _gsmptobj["low"] = _low;
				_gsmptobj["medium"] = _medium;
				_gsmptobj["high"] = _high;
                                goshemap("GeneEStain:"+parameter, all_cluster, _gsmptobj,"hexpmap");
				$("#pwdialog").html("");
                                //$( "#tabs" ).tabs( "option", "active", 0 );
                        },
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
	}
	}else{
		if ($("#xpwfeatureatype").val() == "clin" && sessionsource != "tcga"){
                        loadCLINSAMP();
                }else{
			estainPathway();
		}
	}
}

function estainPathway(){
        var parameter = ($("#gene_stain_ctl").val());
        if (parameter == ""){
                return;
        }
        $("#pwdialog").html(" eStaining " + parameter + "... <img src='http://jakelin212.github.io/images/progress.gif'/>");
	var pwsrc = ($("#pw_source").val());
	var fdrpv = "" + pwpwfdr; //$("#pwpwfdr").val();	
        $( "#gpprogress" ).html("<img src='http://jakelin212.github.io/images/progress.gif' /> Processing " + parameter + " eStain ...");
        if (sessionsource == "tcga"){
		if ( $("#xpwfeatureatype").val()== "b_clin"){
			parameter = bclin_dic[parameter];
		}
                $.ajax({
                type: "POST",
                url:  "/cgi-bin/stain_pw_tcga.cgi",
                        data: {'inparameter': parameter, 'pathwaytype':$("#xpwfeatureatype").val(), 'mapsource':sessionsource},
                        success: function(json)
                        {
				$("#pwdialog").html("");
				if ($("#xpwfeatureatype").val() == "c_clin" || $("#xpwfeatureatype").val() == "b_clin" || $("#xpwfeatureatype").val() == "gnab" || $("#xpwfeatureatype").val() == "drug" || $("#xpwfeatureatype").val() == "gsva"){
                                	estainTcgaCat(json, "Pathway:" + parameter);
				}else{
					estainTcgaGexp(json, "Pathway:" + parameter);
				}
                        },
                        error: function(){
                               new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });

        }else{
        var pwurl = "/cgi-bin/stain_pw_gsva.cgi";
        if (pwsrc == 'aml' || $("#xmapselect").val() == 'aml'){
		//pwurl = "/cgi-bin/get_hema_pwstain_aml.cgi";
		sessionsource = "aml";
	}
	$.ajax({
                type: "POST",
                url:  pwurl,
                        data: {'inpathway': parameter, 'mapsource':sessionsource, 'infdrpv':fdrpv},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
                                        new Messi('Error on gene e-stain data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                if (jo["nongsva"] != null && jo["nongsva"] == "nongsva"){
					new Messi(parameter + ' cannot be eStain as it is non-GSVA/DrugSign source', {title: 'NON GSVA/Drug Signature'});
					return;
				}
				var _low = jo["low"];
                                var _medium = jo["medium"];
                                var _high = jo["high"];
                                var _gsmptobj = {};
                                _gsmptobj["low"] = _low;
                                _gsmptobj["medium"] = _medium;
                                _gsmptobj["high"] = _high;
                                goshemap("PWEStain:"+parameter, all_cluster, _gsmptobj,"hexpmap");
                                //$( "#tabs" ).tabs( "option", "active", 0 );
				$("#pwdialog").html("GSVA/FDR +/-:" + jo["fdrpv"]);
                    		$("#showref").show();
			    },
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
	}
}

function collected_gsm(){
	$("#color2").val($("#color3").val());	
	estainCollected();
}


