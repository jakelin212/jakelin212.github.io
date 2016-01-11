function initstainctl(){
	//Show cluster centroids: <input type='checkbox' id='clustercentroid'> 
	$("#stainctl").append("<br>Background:&nbsp;<input type='color' id='bgclr' style='width:50px' value='#C0C0C0' />&nbsp;&nbsp;AML<input type='checkbox' id='cataml'>&nbsp;&nbsp;CML<input type='checkbox' id='catcml' >&nbsp;&nbsp;MM<input type='checkbox' id='catmm'>&nbsp;&nbsp;MP<input type='checkbox' id='catmp'>&nbsp;&nbsp;LP<input type='checkbox' id='catlp'>&nbsp;&nbsp;T-ALL<input type='checkbox' id='cattall'>&nbsp;&nbsp;TCL<input type='checkbox' id='cattcl'>&nbsp;&nbsp;pre-B-ALL<input type='checkbox' id='catpreball'>&nbsp;&nbsp;BCL<input type='checkbox' id='catbcl'>&nbsp;&nbsp;CLL<input type='checkbox' id='catcll'>&nbsp;&nbsp;LP<input type='checkbox' id='catlp'>&nbsp;&nbsp;Erythroid<input type='checkbox' id='caterythroid'>&nbsp;&nbsp;B-Lymphoid<input type='checkbox' id='catblymphoid'>&nbsp;&nbsp;T-Lymphoid<input type='checkbox' id='cattlymphoid'>&nbsp;&nbsp;Myeloid<input type='checkbox' id='catmyeloid'>&nbsp;&nbsp;StemCell<input type='checkbox' id='catstemcell'>&nbsp;&nbsp;CellLine<input type='checkbox' id='catcellline'>&nbsp;<button type='button' onClick='javascript:greyBg();'>Go</button>&nbsp;<button type='button' onClick='javascript:resetGreyBg();'>Reset</button><span id='grey_dialog'></span>");
//$("#stainctl").append("<br>E-STAIN CUSTOM COLORS Low:&nbsp;&nbsp;<input type='color' name='stainlowcolor' id='stainlowcolor' value='#0000CC'/> &nbsp;Medium:<input type='color' name='stainmediumcolor' id='stainmediumcolor' value='#C2C2C6'/>&nbsp;High:<input type='color' name='stainhighcolor' id='stainhighcolor' value='#FF0000'/>");	
	$("#stainctl").append("<br>GSMs: <textarea id='gsmmapcontainer' rows='1' style='width:1000px;height=100px;' cols='1200'></textarea>&nbsp;<button type='button' onClick='javascript:gsm2Annotation();'>ViewAnnotations</button>");
        $("#stainctl").hide();
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
