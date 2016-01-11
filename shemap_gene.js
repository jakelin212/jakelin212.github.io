function plotGeneStainedMap(mapsource, jo, genestains){
        var st = "Blood All";
	if (sessionsource == "leukemia")
		st = "Leukemia_Normal";
	var _title = mapsource + " E-Stain " + st;
        $( "#gpprogress" ).html("Preparing " + _title + " map ..." + "<img src='images/progress.gif' />");
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
        ,events:{
                click: function (e){
                }
            }
        },
        {type:'scatter',
            name: 'CML',
            color: '#C0C0C0',
        marker: {
                symbol: 'circle'
            },
            data: cmlset
        ,events:{
                click: function (e){
                }
            }
        },
        {
            type:'scatter',
            name: 'MM',
            color: '#C0C0C0',
        marker: {
                symbol: 'circle'
            },
            data: mmset
            ,events:{
                click: function (e){

                }
            }
        },
        {
        type:'scatter',
            name: 'MP',
            color: '#C0C0C0',
        marker: {
                symbol: 'circle'
            },
            data: mpset
        ,events:{
                click: function (e){
                }
            }
        },
        {
        type:'scatter',
            name: 'LP',
            color: '#C0C0C0',
        marker: {
                symbol: 'circle'
            },
            data:  lpset
        ,events:{
                click: function (e){
                }
            }
        },
{
        type:'scatter',
            name: 'T-ALL',
            color: '#C0C0C0',
        marker: {
                symbol: 'circle'
            },
            data:  tallset
        ,events:{
                click: function (e){
                }
            }
        },
{
        type:'scatter',
            name: 'TCL',
            color: '#C0C0C0',
                marker: {
                symbol: 'circle'
            },
            data:  tcl
        ,events:{
                click: function (e){
                }
            }
        },
        {
        type:'scatter',
            name: 'pre-B-ALL',
            color: '#C0C0C0',
            marker: {
                symbol: 'circle'
            },
            data:  preb
        ,events:{
                click: function (e){
                }
            }
        },
        {
            type:'scatter',
            name: 'BCL',
            color: '#C0C0C0',
            data: bclset,
            marker: {
                symbol: 'circle'
            }
            ,events:{
                click: function (e){
                        alert("associated xy to gsm id and show myeloid portrait");

                }
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
            ,events:{
                click: function (e){

                }
            }
        },
        {
            type:'scatter',
            name: 'LP',
            color: '#C0C0C0',
        marker: {
                symbol: 'circle'
            },
            data: lpset
            ,events:{
                click: function (e){
                        alert("associated xy to gsm id and show myeloid portrait");

                }
            }
        },
        {type:'scatter',
            name: 'Erythroid',
            color: '#C0C0C0',
        marker: {
                symbol: 'triangle'
            },
            data: erythroid
        ,events:{
                click: function (e){
                }
            }
        },
{
        type:'scatter',
            name: 'B-Lymphoid',
            color: '#C0C0C0',
            data:  blymphoid,
            marker: {
                symbol: 'triangle'
            },
        events:{
                click: function (e){
                        alert("associated xy to gsm id and show MDS portrait");
                }
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
        ,events:{
                click: function (e){
                        alert("associated xy to gsm id and show MDS portrait");
                }
            }
        },
        {
            type:'scatter',
            name: 'Myeloid',
            color: '#C0C0C0',
        marker: {
                symbol: 'triangle'
            },
            data: myeloid
            ,events:{
                click: function (e){
                        alert("associated xy to gsm id and show myeloid portrait");

                }
            }
        },
{
        type:'scatter',
            name: 'StemCell',
            color: '#C0C0C0',
        marker: {
                symbol: 'triangle'
            },
            data:  stemcellset
        ,events:{
                click: function (e){
                        alert("associated xy to gsm id and show MDS portrait");
                }
            }
        },
        {
            type:'scatter',
            name: 'CellLine',
            color: '#C0C0C0',
            marker: {
                symbol: 'diamond'
            },
            data: celllineset
            ,events:{
                click: function (e){

                }
            }
        }/*,
        {
        type: 'bubble',
        name:'Centroid',
            data: centroid,
        events:{
                click: function (e){
                        alert("anything interesting with clicking centoid?");
                }
            }
        }*/
	];//end shemap series
        shemap_series.push(genestains["low"]);
	shemap_series.push(genestains["medium"]);
	shemap_series.push(genestains["high"]);
        
	$( "#mapprogress" ).html("Plotting ..." + "<img src='images/progress.gif' />");
          $('#container').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: _title
        },
        /*subtitle: {
            text: 'mouse drag:zoom'
        },*/
        xAxis: {
            title: {
                enabled: true,
                text: 't-SNE'
            },gridLineWidth: 1,
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
s: {
            title: {
                text: 't-SNE'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
            borderWidth: 1
        },
 plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
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
                    pointFormat: '{point.x}, {point.y}'
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

