function estainTcgaCat(json, parameter){
        if ($.parseJSON(json) == null){
                new Messi('Error on gene e-stain data retrieval, please contact help', {title: 'Server error'});}
        var jo  = $.parseJSON(json);
        if (jo["notexists"] != null){
                new Messi('We do not have any TCGA Copy number information for ' + parameter, {title: 'Warning'});
                $( "#gpprogress" ).html("");
                return;
        }
	//#for each category (by integer), get colors and build scatter structure
	var _cats = jo["catkeys"];
	var ci = 0;
	var catslist = [];
	for (var _ca in _cats) {
		var cat = _cats[_ca];
		var ccolor = catcolor_list[ci];
		ci = ci + 1; //catcolor_list
                if (catcolors[cat] != null){
			ccolor = catcolors[cat];
		}	
                var catscat =
                                        {type:'scatter',
                                        name: cat,
                                        color: ccolor,
                                        marker: {
                                        symbol: 'circle'
                                        },
                                        data: jo[cat]
                                        };
		catslist.push(catscat);
	}//end for
        plotGeneStainedMap("tcga_cclin " + parameter, null, catslist,"hexpmap");
        $( "#gpprogress" ).html("");
	if ($("#xpwfeatureatype").val() == "drug" || $("#xpwfeatureatype").val() == "gsva"){
		$("#pwdialog").html("GSVA/FDR +/-:" + jo["fdrpv"]);
	}
}

function estainTcgaGexp(json, parameter){
	if ($.parseJSON(json) == null){
        	new Messi('Error on gene e-stain data retrieval, please contact help', {title: 'Server error'});}
        var jo  = $.parseJSON(json);
        if (jo["notexists"] != null){
        	new Messi('We do not have any TCGA Copy number information for ' + parameter, {title: 'Warning'});
                $( "#gpprogress" ).html("");
                return;
        }
                                var _gobj = {};
				_gobj["vlow"] = jo["vlow"];
                                _gobj["low"] = jo["low"];
                                _gobj["medium"] = jo["medium"];
                                _gobj["high"] = jo["high"];
				_gobj["vhigh"] = jo["vhigh"];
                                var lc = "#00BFFF";//$("#stainlowcolor").val();
                                var hc = "#C71585";//$("#stainhighcolor").val();
                                var mc = "#808080";//grey $("#stainmediumcolor").val();
				var vlc = "#0000FF"; //blue
				var vhc = "#FF0000"; //red
                                var _series = [];
                                var _vlow = [];
                                var _low = [];
                                var _vhigh = [];
                                var _high = [];
                                var _medium = [];
			//cuts = [-1.6, -1.5, -0.5, 0.5, 1.5, 1.6]
			var mn = 'zscore -0.5 .. 0.5';
			var ln = 'zscore -1.5 .. -0.5';
			var vln = 'zscore < -1.5';
			var hn = 'zscore 0.5 .. 1.5';
			var vhn = 'zscore > 1.5';

			//-1, -0.7, -0.3, 0.3, 0.7, 1
			if ($("#xpwfeatureatype").val() == "cnvr"){
				mn = 'cnvr -0.7 .. 0.7';
                        	ln = 'cnvr -.7 .. -1';
                        	vln = 'cnvr < -1';
                        	hn = 'cnvr 0.7 .. 1';
                        	vhn = 'cnvr > 1';
			}
			var medium = 
                                        {type:'scatter',
                                        name: mn,
                                        color: mc,
                                        marker: {
                                        symbol: 'circle'
                                        },
                                        data: _gobj["medium"]
                                        };

                               var low =          {type:'scatter',
                                        name: ln,
					color: lc,
                                        marker: {
                                        symbol: 'circle'
                                        },
                                        data: _gobj["low"]
                                        };

				var vlow= 	{type:'scatter',
                                        name: vln,
                                        color: vlc,
                                        marker: {
                                        symbol: 'circle'
                                        },
                                        data: _gobj["vlow"]
                                        };
                                var high =  {type:'scatter',
                                        name: hn,
                                        color: hc,
                                        marker: {
                                        symbol: 'circle'
                                        },
                                        data: _gobj["high"]
                                        };
				var vhigh ={type:'scatter',
                                        name: vhn,
                                        color: vhc,
                                        marker: {
                                        symbol: 'circle'
                                        },
                                        data: _gobj["vhigh"]
                                        };                                	
		plotGeneStainedMap("tcga_zscore " + parameter , null, {"vlow":vlow,"low":low,"medium":medium,"high":high,"vhigh":vhigh},"hexpmap");
        $( "#gpprogress" ).html("");
}

function estainTcgaCopy(){
        var parameter = $("#gene_stain_ctl").val();
        if (parameter == ""){
                return;
        }
        $( "#gpprogress" ).html("<img src='images/progress.gif' /> Processing " + parameter + " TCGA CNVR staining...");
        $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_tcga_cnvr.cgi",
                        data: {'ingene': parameter},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
                                        new Messi('Error on gene e-stain data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
				if (jo["notexists"] != null){
					new Messi('We do not have any TCGA Copy number information for ' + parameter, {title: 'Warning'});
					$( "#gpprogress" ).html("");
					return;
				}
                                var _gobj = {};
                                _gobj["_vlow"] = jo["vlow"];
                                _gobj["_low"] = jo["low"];
                                _gobj["_medium"] = jo["medium"];
                                _gobj["_high"] = jo["high"];
                                _gobj["_vhigh"] = jo["vhigh"];
				var lc = $("#stainlowcolor").val();
				var vlc = shadeColor1(lc, -40);
				var hc = $("#stainhighcolor").val();
				var vhc = shadeColor1(hc, -40);
				var mc = $("#stainmediumcolor").val();
	                        var _series = [];
				var _vlow = [];
				var _low = [];
				var _vhigh = [];
                                var _high = [];
				var _medium = [];
                                for (var d in tcgasamples){
                                        var _sa = [];
                                        var xy = tcgasamples[d];
					var x = parseFloat(xy.split(",")[0]);
					var y = parseFloat(xy.split(",")[1]);
                                        _sa.push(x);
                                        _sa.push(y);
                                        if (_gobj["_vlow"] != null && _gobj["_vlow"][d] != null){
						_vlow.push(_sa);
					}else if (_gobj["_low"] != null && _gobj["_low"][d] != null){
						 _low.push(_sa);
					}else if (_gobj["_high"] != null && _gobj["_high"][d] != null){
                                                 _high.push(_sa);
                                        }else if (_gobj["_vhigh"] != null && _gobj["_vhigh"][d] != null){
                                                 _vhigh.push(_sa);
                                        }else{
						_medium.push(_sa);
					}
                                }
                                var tcga_series = [
                                	{type:'scatter',
                                	name: 'TCGA CNVR:0',
                                	color: mc, 
                                	marker: {
                                	symbol: 'circle'
                                	},
                                	data: _medium
                                	},
					{type:'scatter',
                                        name: 'TCGA CNVR:-2',
                                        color: vlc,
                                        marker: {
                                        symbol: 'circle'
                                        },
                                        data: _vlow
                                        },
					{type:'scatter',
                                        name: 'TCGA CNVR:-1',
                                        color: lc,
                                        marker: {
                                        symbol: 'circle'
                                        },
                                        data: _low
                                        },
					{type:'scatter',
                                        name: 'TCGA CNVR:+1',
                                        color: hc,
                                        marker: {
                                        symbol: 'circle'
                                        },
                                        data: _high
                                        },
                                        {type:'scatter',
                                        name: 'TCGA CNVR:+2',
                                        color: vhc,
                                        marker: {
                                        symbol: 'circle'
                                        },
                                        data: _vhigh
                                        }
				];
                                plotTcga(tcga_series, parameter);
				$( "#gpprogress" ).html("");	
                        },
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
}

