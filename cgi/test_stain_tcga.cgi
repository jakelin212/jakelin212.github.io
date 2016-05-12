#!/usr/bin/python
## -*- coding: utf-8 -*-
#

import cgi
import json
import sys
import zs
import hemaall_gsmsxy2
import os
import sqlite3


gsmxy = hemaall_gsmsxy2.tcga_xy
fi = open("./bsamp_tcga/gsms.tsv", "r")
gsms = fi.readline().strip().split("\t")
fi.close()

qform = cgi.FieldStorage()
inparam = qform.getvalue('inparameter')
#inparam = "B:GNAB:GIGYF2:chr2:233562015:233725289:+:y_n_somatic"#N:MIRN:hsa-miR-196b-5p:chr7:27209099:27209182:+:MIMAT0001080" RNA_POLYMERASE_III_TRANSCRIPTION_INITIATION-PWCOMMONS" #AML GENETICS_AML_CBFB_MYH11"#Citrate_cycle_tca_cycle_KEGG" #autophagy_article"#
#inparam = "73"#xÂfish_evaluation_performed_ind"
#inparam = "FAM5C_code_potential_somatic"
#inparam = "FUROXAN-DSigDB_D4"
inparam = "MS4A6A"
intype = qform.getvalue('pathwaytype')
intype = "gexp" 
#inccluster = qform.getvalue('ccluster')
#inccluster = "molecular_analysis_abnormal_result_indicator" #"Percentage_BM_Blast"

"""
copy number cutoffs, no need to Z-score, discretize using these values:
-1, -0.7, -0.3, 0.3, 0.7, 1
These are pretty close to -2, -1, 0, 1, 2 gistic scores with similar biological interpretation.methylation, Z-score
-3, -2, -1, 1, 2, 3
gene expression, Z-score
-3, -2, -1, 1, 2, 3
blue-lightblue-white-lightred-red
"""

pa = {}
pa['vlow'] = []
pa['low'] = []
pa['medium'] = []
pa['high'] = []
pa['vhigh'] = []
catkeys = {}

feature = inparam
ftype = intype.upper()
if (len(inparam.split(":")) > 2):
    feature = inparam.split(":")[2]
    ftype = inparam.split(":")[1]
else:
    if (ftype == "GSVA" or ftype == "DRUG"):
        feature = feature + "_GSVA"
        ftype = "SAMP"		

if (ftype == "GNAB"):
    feature = feature #+ "_" + inparam.split(":")[-1]
if (ftype == "B_CLIN"):
    feature = inparam
#print feature
#print ftype

featurefile = "./bsamp_tcga/" + ftype + "_" + feature + "_list.py"
#print featurefile
if (os.path.isfile(featurefile) == True):
    fi = open(featurefile, "r")
    if (intype == "c_clin" or intype == "b_clin" or intype=="gnab"):
        catvals = fi.next().strip().split("\t")
        i = 0
        for c in catvals:
            xy = [float(coor) for coor in gsmxy[gsms[i]].split("_")]
            if (pa.get(c) == None):
                pa[c] = []
                pa[c].append(xy)
            else:
                pa[c].append(xy)
            catkeys[c] = 1
            i = i + 1    
    else:
        line = fi.next()
        line = line.replace("NA", "0")
        vals = [float(fv) for fv in line.strip().split("\t")]
        try:
	    #for cnvr	
            #cuts = [-1, -0.7, -0.3, 0.3, 0.7, 1]
            #zscores = vals
            if (intype == "gsva" or intype == "drug" ):
                ifdrpv = qform.getvalue('infdrpv')
                #ifdrpv = "0.01"
                fdrcon = sqlite3.connect('sqlite/hemap_tcga_fdr.db')
                fdrcur = fdrcon.cursor()
                try:
                    fdrcur.execute("select pv_05 real, pv_01 real, pv_001 from [_fdr_pv_lookup] where featurea like '" + feature + "%'")
                    row = fdrcur.fetchone()
                    gsvapw = 0.0
                    if (ifdrpv == "0.05" or ifdrpv == ".05"):
                        gsvapw = row[0]
                    elif (ifdrpv == "0.01" or ifdrpv == ".01"):
                        gsvapw = row[1]
                    else:
                        gsvapw = row[2]
                    #print gsvapw
                except:
                    #print "error fdr lookup"
                    gsvapw = 0.4
                i = 0
                for v in vals:
                    xy = [float(coor) for coor in gsmxy[gsms[i]].split("_")]
                    if (v < (-1*gsvapw)):
                        pa['low'].append(xy)
                    elif (v > gsvapw):
                        pa['high'].append(xy)
                    else:
                        pa['medium'].append(xy)
                    i = i + 1
                pa["fdrpv"] = str(gsvapw)[:4]   
                catkeys["low"] = 1
                catkeys["high"] = 1
                catkeys["medium"] = 1              
            #cnvr cutoffs
            cnvrcuts = [-1, -0.7, -0.3, 0.3, 0.7, 1]
            zscores = vals	
            if (intype == "gexp" or intype == "n_clin" or intype == "mirn" or intype == "meth" or intype == "cnvr"):
                zmetrics = zs.zs(vals)
                zscores = zmetrics[2]
                print(len(zscores))
                cuts = [-1.5, -1.5, -0.5, 0.5, 1.5, 1.5]
                if (intype == "cnvr"):
                    cuts = cnvrcuts
                i = 0
                
                for z in zscores:
                    xy = [float(coor) for coor in gsmxy[gsms[i]].split("_")]
                    if (z < cuts[0]):
                        pa['vlow'].append(xy)
                    elif (z > cuts[1] and z <= cuts[2]):
                        pa['low'].append(xy)
                    elif (z > cuts[3] and z <= cuts[4]):
                        pa['high'].append(xy)
                    elif (z > cuts[5]):
                        pa['vhigh'].append(xy)
                    else:
                        pa['medium'].append(xy)
                    i = i + 1
        except:
            pa['error'] = 'value error'
            print sys.exc_info()
    fi.close()     
else:
    pa['error'] = 'feature no data'
pa["catkeys"] = sorted(catkeys.keys())
print "Content-type: text/html;charset=utf-8\r\n"
#print json.dumps(pa)
print len(pa['vlow'])
print len(pa['low'])
print len(pa['medium'])
print len(pa['high'])
print len(pa['vhigh'])
