#!/usr/bin/python
## -*- coding: utf-8 -*-
#
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import json
import cgi
import sqlite3
import full_pwpw_gexp
import full_pwpw_clin
import full_pwpw_drug
import full_pwpw_gsva

qform = cgi.FieldStorage()
source = qform.getvalue('insource')
cclass = qform.getvalue('incclass')

#cancermap_cluster_6_vs_7 'cancermap_cluster_27_vs_28': 1, 'cancermap_cluster_27_vs_29': 5, 'cancermap_cluster_7_vs_49': 6, 'cancermap_cluster_3_and_28': 3, 'cancermap_cluster_36_and_39': 4, 'annotated_class_na_vs_Erythroid': 2, 'annotated_class_NonCancer_and_Prolif_Myelo': 2, 'cancermap_cluster_3_and_29': 1, 'annotated_class_TCL_and_LP': 0, 'cancermap_cluster_36_and_37': 7, 'cancermap_cluster_18_and_19': 6, 'annotated_class_vs_cancermap_cluster_pre-B-ALL_vs_CLL': 7, 'annotated_class_vs_cancermap_cluster_Myeloid_vs_AML': 2

conn1 = sqlite3.connect('sqlite/tcga_pwpw_'+source+'.db')
c1 = conn1.cursor()
xlimit = qform.getvalue('inlimit')

"""
source = "drug"
cclass = "cancermap_cluster_7"
xlimit = "500"
orderby = "sp_coeff"
corrop = "gt"
"""

orderby = qform.getvalue('inorder')
corrop = qform.getvalue('corrop')
if (corrop == "gt"):
	corrop = "sp_coeff >="
if (corrop == "lt"):
	corrop = "sp_coeff <="
if (corrop == "abs"):
        corrop = "abs(sp_coeff) >"

corr = qform.getvalue('incorr')
if (corr == None or corr == ""):
	corr = "0"
inpv = qform.getvalue('inpv')
if (inpv == None or inpv == ""):
        inpv = "0"
hypgeo = qform.getvalue('inhypgeo')
if (hypgeo == None or hypgeo == ""):
        hypgeo = "0"

#[_pwpw_' + cclass + '] (featurea text, featureb text, coeff real, n_samples int, pv real, bh1 real, corrpv real, nnaa int, diffa int, nnab int, diffb int
#featurea text, featureb text, sp_coeff real, n_samples int, bh1 real, adj_pv real, nnaa int, diffa int, nnab int, diffb int, bh2 real, adj_hypgpv

c1.execute("select featurea,round(sp_coeff, 3), round(adj_pv, 3), round(bh1, 3), adj_hypgpv, bh2, n_samples, nnaa, diffa, nnab, diffb from [_pwpw_"  + cclass +"] where " + corrop + " %s and adj_pv >= %s and adj_hypgpv >= %s order by abs(%s) desc limit %s" %(corr, inpv, hypgeo, orderby, xlimit)) 

rows = c1.fetchall()
p = []
#"feature a needs to be in <a></a> form"
#print "select featurea,round(sp_coeff, 3), round(adj_pv, 3), round(bh1, 3), adj_hypgpv, bh2, n_samples, nnaa, diffa, nnab, diffb"
for r in rows:
	rec = []
        fa = r[0]
        if (fa.find('MCF7_UP') != -1 or fa.find('MCF7_DOWN') != -1 or fa.find('PC3_UP') != -1 or fa.find('PC3_DOWN') != -1 or fa.find('HL60_UP') != -1 or fa.find('HL60_DOWN') != -1):
            continue
	#rec.append(r[0])
	#"<a title='click to eStain' onclick='javascript:alert(\"estaining CD33\")';>CD33</a>"
	rec.append("<a title='click to stain' onclick='javascript:tcga_pwstain(\"%s\")';>%s</a>" %(r[0], r[0]))
	rec.append("{0:.3f}".format(r[1]))
	rec.append(float("{0:.3f}".format(r[2])))
	rec.append(float("{0:.3f}".format(r[3])))
	rec.append(r[4])
	rec.append(r[5])
	rec.append(r[6]) 
	rec.append(r[7])
	rec.append(r[8])
	rec.append(r[9]) 
        rec.append(r[10])              	
	p.append(rec)
#print len(p)
pa = {}
pa["aaData"] = p
c1.close()
conn1.close()
print "Content-type: text/html;charset=utf-8\r\n"
print json.dumps(pa)
