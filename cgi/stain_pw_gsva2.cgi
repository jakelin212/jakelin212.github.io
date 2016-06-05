#!/usr/bin/python
## -*- coding: utf-8 -*-
#

import json
import cgi
import sys
import sqlite3
import percentile

qform = cgi.FieldStorage()
inparam = qform.getvalue('inpathway')
#inparam = "HEMATOPOIETIC_STEM_CELL_DIFFERENTIATION_HOMO_SAPIENS_WIKIPW"#_GSVA"#HOMOVANILLIC_ACID_CTD_00006103_DSigDB"
#FASUDIL_HYDROCHLORIDE-DSigDB_D4
inparam = "GYROPHORIC_ACID-DSigDB_D4" #FLT_3_INHIBITOR_II-DSigDB_D4"
#inparam = "RNA_POLYMERASE_III_TRANSCRIPTION_INITIATION-PWCOMMONS" #AML GENETICS_AML_CBFB_MYH11"#Citrate_cycle_tca_cycle_KEGG" #autophagy_article"#
insource = qform.getvalue('mapsource')
insource = "tall"
ifdrpv = qform.getvalue('infdrpv')

#inparam = 'VITAMIN_METABOLIC_PROCESS-MsigDB_c5'
#insource = 'hemaall'
#infdrpv = '0.05'

fdrcon = sqlite3.connect('sqlite/hemap_'+insource+'_fdr.db')
fdrcur = fdrcon.cursor()
try:
    fdrcur.execute("select pv_05 real, pv_01 real, pv_001 from [_fdr_pv_lookup] where featurea like '" + inparam + "%'")
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
    gsvapw = 0.4
fdrcur.close()
fdrcon.close()
 
# (featurea text, geneset_len int, geneset_len_rounded int, pv_05 real, pv_01 real, pv_001 real, PRIMARY KEY(featurea) )')
#session = loaddict("./_all_session_pw.dict")['HOMOVANILLIC_ACID_CTD_00006103_DSigDB']
sesparam = inparam.replace("_GSVA", "")
pa = {}
pa['low'] = []
pa['medium'] = []
pa['high'] = []
try:
    session = percentile.loaddict("./_" + insource + "_session_pw.dict")[sesparam]
    #print session
    conn = sqlite3.connect('sqlite/hemap_gsva_' + insource + str(session) + '.db')
    conn.text_factory = str
    c = conn.cursor()
    gsm_cluster = "hema_gsm_cluster"
    c.execute("select pt, hc.gsm, stained_score from [_" + inparam + "] ha, " + gsm_cluster + " hc where ha.gsm = hc.gsm")
    rows = c.fetchall()
    for row in rows:
        pi = []
        pi.append(float(row[0].split(",")[0]))
        pi.append(float(row[0].split(",")[1]))
        grade = row[2]
        if (grade < (-1*gsvapw)):
            #col = col.replace("'", "")
            pa['low'].append(pi)
        elif (grade > gsvapw):
            pa['high'].append(pi)
        else:
            pa['medium'].append(pi)
    c.close()
    pa["fdrpv"] = str(gsvapw)[:4]
except:
    pa['nongsva'] = 'nongsva'

print "Content-type: text/html;charset=utf-8\r\n"
print json.dumps(pa)
