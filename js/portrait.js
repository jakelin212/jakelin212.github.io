function goportrait(){
      var incellline = $("#celllinein").val();
      $( "#cldialog" ).html("Loading " + incellline + "... <img src='images/progress.gif' />");
      $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_hema_cellportrait.cgi",
                        data: {'celllinein': incellline,'column': 'cellline'},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
                                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _data = jo["aaData"];
                                var cmlset = jo["ycat"];
				var xcat = jo["xcat"];
				var min = jo["min"];
				var max = jo["max"];
      $('#containerheatmap').highcharts({
      chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80
        },
        title: {
            text: incellline
        },
        xAxis: {
            categories: cmlset
	},
        yAxis: {
        	labels: {
       			enabled: false
        	},	
	},
	credits: {
                enabled: false
       },
	colorAxis: {
            min: min,
            max: max,
            minColor: '#0000ff',//#FFFFFF',
            maxColor: '#FF0000'
//stops: [
  //              [0, '#3060cf'],
    //            [0.5, '#fffbbc'],
      //          [0.9, '#c4463a'],
        //        [1, '#c4463a']
          //  ],
//Highcharts.getOptions().colors[0]
        },
        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
	 enabled: legendenabled,
            symbolHeight: 500
        },
        tooltip: {
            formatter: function () {
                return this.point.value + " " + this.series.xAxis.categories[this.point.x];
            }
        },
        series: [{
            name: incellline,
            borderWidth: 1,
            data: _data,
 //_data,// [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]],
            dataLabels: {
                enabled: false,
                color: 'black',
                style: {
                    textShadow: 'none',
                    HcTextStroke: null
                }
            }
        }]
    });
    $( "#cldialog" ).html("");
    },//end success
    error: function(){
    	new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
    });
}

function initstainctl(){
	//Show cluster centroids: <input type='checkbox' id='clustercentroid'> 
	$("#stainctl").append("<br>Background:&nbsp;<input type='color' id='bgclr' style='width:50px' value='#C0C0C0' />&nbsp;&nbsp;AML<input type='checkbox' id='cataml'>&nbsp;&nbsp;CML<input type='checkbox' id='catcml' >&nbsp;&nbsp;MM<input type='checkbox' id='catmm'>&nbsp;&nbsp;MP<input type='checkbox' id='catmp'>&nbsp;&nbsp;LP<input type='checkbox' id='catlp'>&nbsp;&nbsp;T-ALL<input type='checkbox' id='cattall'>&nbsp;&nbsp;TCL<input type='checkbox' id='cattcl'>&nbsp;&nbsp;pre-B-ALL<input type='checkbox' id='catpreball'>&nbsp;&nbsp;BCL<input type='checkbox' id='catbcl'>&nbsp;&nbsp;CLL<input type='checkbox' id='catcll'>&nbsp;&nbsp;LP<input type='checkbox' id='catlp'>&nbsp;&nbsp;Erythroid<input type='checkbox' id='caterythroid'>&nbsp;&nbsp;B-Lymphoid<input type='checkbox' id='catblymphoid'>&nbsp;&nbsp;T-Lymphoid<input type='checkbox' id='cattlymphoid'>&nbsp;&nbsp;Myeloid<input type='checkbox' id='catmyeloid'>&nbsp;&nbsp;StemCell<input type='checkbox' id='catstemcell'>&nbsp;&nbsp;CellLine<input type='checkbox' id='catcellline'>&nbsp;<button type='button' onClick='javascript:greyBg();'>Go</button>&nbsp;<button type='button' onClick='javascript:resetGreyBg();'>Reset</button><span id='grey_dialog'></span>");
//$("#stainctl").append("<br>E-STAIN CUSTOM COLORS Low:&nbsp;&nbsp;<input type='color' name='stainlowcolor' id='stainlowcolor' value='#0000CC'/> &nbsp;Medium:<input type='color' name='stainmediumcolor' id='stainmediumcolor' value='#C2C2C6'/>&nbsp;High:<input type='color' name='stainhighcolor' id='stainhighcolor' value='#FF0000'/>");	
	$("#stainctl").append("<br>GSMs: <textarea id='gsmmapcontainer' rows='1' style='width:1000px;height=100px;' cols='1200'></textarea>&nbsp;<button type='button' onClick='javascript:gsm2Annotation();'>ViewAnnotations</button>");
        $("#stainctl").hide();
//<option value="aml">AML</option><option value="leukemia">Leukemia</option>
}

function getMemberInfo(){
	var inpw = $('#gene_stain_ctl').val();
	$.ajax({
                type: "POST",
                url:  "/cgi-bin/get_drug_pw_members.cgi",
                        data: {'inpw': inpw},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
                                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _data = jo[inpw];
				$('#gsmmapcontainer').val(_data[1]);
				var reflink = _data[0];
				if (reflink.indexOf("http://") != -1){
					reflink = "<a href='" + reflink + "' target='_blank'>See details:" + inpw + "</a>"
				}
				$('#pwref').html(reflink);
			}
			,error: function(){alert("error on member retrieve");}
		});
}

function genestainselection(){
    var column = $('#columns').val();
    var autocomplete = $('#search_input').typeahead();
    if (column == "name"){
        autocomplete.data('typeahead').source = hg19genes;
    }else{
        autocomplete.data('typeahead').source = [];
    }
}

function gsm2Annotation(){
	annoval = $('#gsmmapcontainer').val();
	if (annoval == ""){
		alert("Error on GSM select, refresh browser and try again. Please report if this does not fix error ");
		return;
	}
	annocol = "gsms";		
	initAnno();
	$( "#tabs" ).tabs( "option", "active", 2 );	
}

function hgsm2Annotation(){
        annoval = hgsmselected; //$('#gsmmapcontainer').val();
        if (annoval == ""){
		alert("Error on GSM select, refresh browser and try again. Please report if this does not fix error ");
                return;
        }
        annocol = "gsms";
        initAnno();
        $( "#tabs" ).tabs( "option", "active", 2 );
}
