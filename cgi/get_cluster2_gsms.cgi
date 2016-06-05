#!/usr/bin/python
## -*- coding: utf-8 -*-
#

import cgi
import json
import os

import hemaall_gsmsxy2 

qform = cgi.FieldStorage()
source = qform.getvalue('insource')
#source = "all" #"hemaall"

source = "bsamp_" + source
#path will depend on map selection
fi = open(source + "/gsms.tsv", "r")
gsms = fi.readline().strip().split("\t")

jo = {}
jo["gsm0"] = []
jo["gsm1"] = []
jo["gsmna"] = []
fi.close()


gsmxy = hemaall_gsmsxy2.gsmxy
if (source == "bsamp_aml"):
	gsmxy = hemaall_gsmsxy2.aml_gsmxy
if (source == "bsamp_all"):
        gsmxy = hemaall_gsmsxy2.all_gsmxy

#cluster class
ccname = qform.getvalue('incclass')
#ccname = "GENETICS_preBALL_hypodiploid"
#ccname = "cancermap_cluster_15pct_ROSS_CLU_6_BW_0.9"#cancermap_cluster_20_and_29" #cancermap_cluster_NonCancer_and_Cancer_Myeloma"#"annotated_class_CellLine_vs_T-ALL"#_list.py"
if (os.path.isfile(source + "/" + ccname + "_list.py") == True):
    gi = open(source + "/" + ccname + "_list.py", "r")
    annos = gi.readline().strip().split("\t")
    i = 0
    for a in annos:
        spt = gsmxy[gsms[i]].split("_")
        fpt = [float(spt[0]),float(spt[1])]
        if (a == "1"):
            jo["gsm1"].append(fpt)#[float(spt[0]),float(spt[1])])
        elif (a == "0"):
            jo["gsm0"].append(fpt)#gsmxy[gsms[i]])
        else:
            jo["gsmna"].append(fpt)#gsmxy[gsms[i]]) 	
        i = i + 1   
    gi.close()
    

print "Content-type: text/html;charset=utf-8\r\n"
print json.dumps(jo)
