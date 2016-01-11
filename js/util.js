function list2float(flist){
        var fl = [];
        for (var li in flist){
                var temp = [];
                temp.push(parseFloat(flist[li][0]));
                temp.push(parseFloat(flist[li][1]));
                fl.push(temp);
        }
        return fl;
}

function padzero(dval){
        var dvalstr = dval + "";
        var zeroes = "";
        for (var l = dval.length; l < 6; l++){
                zeroes = zeroes + "0";
        }
        return dval + zeroes;
}

function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

//thanks http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
//need to be seven chars, including #
/*
function shadeColor1(color, percent) {  
    var num = parseInt(color,16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
    return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}*/


function shadeColor1(color, percent) {  
    var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

