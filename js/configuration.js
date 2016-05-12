//Legend visible: <select id="legendenabled" style="width:80px"><option selected value=true>True</option><option value=false>False</option></select> ' + ' placement: <select id="legendpos" style="width:100px"><option selected value="ul">UpperLeft</option><option value="ur">UpperRight</option><option value="bl">BottomLeft</option><option value="br">BottomRight</option></select>&nbsp;

function settingsHemap(){
        $("#mapconfig").html('Max GSM mouse selection: <select id="maxgselection" style="width:80px"><option value="1000">1000</option><option value="500">500</option></select>&nbsp;Symbol size: <select id="symsizeop" style="width:100px"><option selected value="default">Default</option><option value="symdec">Smaller</option><option value="symdec--">Smaller--</option> <option value="syminc">Bigger</option><option value="syminc++">Bigger++</option></select>&nbsp;<input type="numeric" value="' + lowoutlier + '" style="display:inline;width:60px;" size="60" name="lowoutlier" id="lowoutlier"><= Outlier Pecentiles >=<input type="numeric" value="' + highoutlier + '" style="display:inline;width:60px;" size="60" name="highoutlier" id="highoutlier"><br><br>Pairwise rows limit:  <select id="pwxlimit" style="width:70px"><option value="500">500</option><option value="1000">1000</option><option selected value="5000">5000</option><option value="10000">10000</option><option value="50000">50000</option></select> shown on page:<input type="numeric" id="showrownum" value="' + showrownum + '" style="display:inline;width:60px;"> &nbsp;Map-PWTable WidthRatio<input type="numeric" id="mpratio" value="' + mpratio + '" style="display:inline;width:60px;">&nbsp;ePval <select id="pwpwfdr" style="width:70px"><option value=".001">.001</option><option value=".01">.01</option><option value=".05">.05</option></select>&nbsp;Order by<select id="xpwpworder" style="width:80px"><option value="sp_coeff">corr</option><option value="adj_pv">pval</option><option value="adj_hypgpv">adj_hypgeot</option></select><br>E-STAIN CUSTOM COLORS Low:&nbsp;&nbsp;<input type="color" name="stainlowcolor" id="stainlowcolor" value="' + lowcolor + '"/> &nbsp;Medium:<input type="color" name="stainmediumcolor" id="stainmediumcolor" value="' + medcolor + '"/>&nbsp;High:<input type="color" name="stainhighcolor" id="stainhighcolor" value="' + highcolor + '"/><button type="button" onclick="setSettings();">Save</button> <button type="button" onclick="cancelSettings();">Cancel</button>');
	$('#boxgene_init').typeahead({source: hg19genes});
        $('#boxgene_init').val(gexp_init);
        $('#boxgene_init').css("display","inline");
	$('#pwpwfdr').val(pwpwfdr);
	$('#pwxlimit').val(xlimit);
	$('#xpwpworder').val(pworder);
	$("#maxgselection").val(maxgsmsallowed);
	$("#mapconfig").show();
}

function cancelSettings() {
	$("#mapconfig").hide();
}

function setSettings(){
	pworder = $("#xpwpworder").val();
	pwpwfdr = $("#pwpwfdr").val();
        mpratio = $("#mpratio").val();
        hexpmapwidth = parseFloat(parseInt(mpratio.split(":")[0])/100);
	hexptblwidth = parseFloat(parseInt(mpratio.split(":")[1])/100);//mpratio.split(":")[1];
	if ($("#hexpmenu") != null){
		$("#hexpmap").width(hexpmapwidth+ "%");
                $("#hexpmenu").width(hexptblwidth+ "%");
	}
	showrownum = $("#showrownum").val();
	xlimit = $("#pwxlimit").val();	
        maxgsmsallowed = $("#maxgselection").val();
	lowoutlier = $("#lowoutlier").val();
	highoutlier = $("#highoutlier").val();
	lowcolor = $("#stainlowcolor").val();
	medcolor = $("#stainmediumcolor").val();
	highcolor = $("#stainhighcolor").val();
        /*
	var legendpos = $("#legendpos").val();
        if (legendpos == "br"){
                legendx = 0;
                legendy = 590;
                legendalign = "right";
        }
        if (legendpos == "ur"){
                legendx = 0;
                legendy = 40;
                legendalign = "right";
        }
        if (legendpos == "bl"){
                legendx = 65;
                legendy = 590;
                legendalign = "left";
        }
        if (legendpos == "ul"){
                legendx = 65;
                legendy = 40;
                legendalign = "left";
        }*/

        var ssop = $("#symsizeop").val();
        if (ssop == "symdec"){
                symSize = symSize - .5;
        }
        if (ssop == "symdec--"){
                symSize = symSize - 1;
        }
        if (ssop == "syminc"){
                symSize = symSize + 1;
        }
        if (ssop == "syminc++"){
                symSize = symSize + 2;
        }
	//legendenabled = eval($("#legendenabled").val());
	goshemap(sessionsource, null, null);
	$( "#tabs" ).tabs( "option", "active", 0 );
	//new Messi('Please replot to see configuration updates', {title:"Updated"});
        //$("#mapconfig").html("");
	/*
	},
	error: function (j){
		alert("Error saving");
	}});
	*/

}

