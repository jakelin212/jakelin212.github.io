#!/usr/bin/python
## -*- coding: utf-8 -*-
#

import os
#import hemaall_gsmsxy2 

def getgsms_forcc(cc):
    source = "bsamp_hemaall" #+ source
    fi = open(source + "/gsms.tsv", "r")
    gsms = fi.readline().strip().split("\t")
    fi.close()

    #gsmxy = hemaall_gsmsxy2.gsmxy
    #if (source == "bsamp_aml"):
    #    gsmxy = hemaall_gsmsxy2.aml_gsmxy

    ccname = cc #qform.getvalue('incclass')
    #ccname = "cancermap_cluster_20_and_29" #cancermap_cluster_NonCancer_and_Cancer_Myeloma"#"annotated_class_CellLine_vs_T-ALL"#_list.py"
    ingsms = []
    annos = []
    if (os.path.isfile(source + "/" + ccname + "_list.py") == True):
        gi = open(source + "/" + ccname + "_list.py", "r")
        annos = gi.readline().strip().split("\t")
        i = 0
        for a in annos:
            if (a == "1"):
                ingsms.append(gsms[i])
            i = i + 1
        gi.close()
    gsms = None
    annos = None
    return ingsms

if __name__ == "__main__":
    gg = getgsms_forcc("annotated_class_BCL_and_AML")
    print gg, len(gg)
