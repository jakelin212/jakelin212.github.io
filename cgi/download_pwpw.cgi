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
#source = "gsva"#sys.argv[1]
# 'cancermap_cluster_3_and_21': 5, 'cancermap_cluster_CellLine_Leukemia_and_Cancer_Myeloma': 7
cclass = qform.getvalue('incclass')
#cclass = "annotated_class_MM_vs_CML"#cancermap_cluster_CellLine_Leukemia_and_Cancer_Myeloma"
#cclass = "annotated_class_CellLine_Lymphoma_and_Prolif_Myelo"
ddb = None

#add map type here to make it more generic, set path, *_pwpw_, ...

if (source == "gexp"):
	ddb = full_pwpw_gexp.full_pwpw_gexp[cclass]
if (source == "clin"):
        ddb = full_pwpw_clin.full_pwpw_clin[cclass]
if (source == "drug"):
        ddb = full_pwpw_drug.full_pwpw_drug[cclass]
if (source == "gsva"):
        ddb = full_pwpw_gsva.full_pwpw_gsva[cclass]

conn1 = sqlite3.connect('sqlite/hemap_pwpw_'+source+'%i.db' %ddb)
c1 = conn1.cursor()
xlimit = "5000"
orderby = qform.getvalue('inorder')
#orderby = "sp_coeff"
corr = qform.getvalue('incorr')
if (corr == None or corr == ""):
	corr = "0"
inpv = qform.getvalue('inpv')
if (inpv == None or inpv == ""):
        inpv = "0"
hypgeo = qform.getvalue('inhypgeo')
if (hypgeo == None or hypgeo == ""):
        hypgeo = "0"
c1.execute("select featurea,round(sp_coeff, 3), round(adj_pv, 3), round(bh1, 3), adj_hypgpv, bh2, n_samples, nnaa, diffa, nnab, diffb from [_pwpw_" + source + "_" + cclass +"] where abs(sp_coeff) > %s and adj_pv > %s and adj_hypgpv >= %s order by abs(%s) desc limit %s" %(corr, inpv, hypgeo, orderby, xlimit)) 
rows = c1.fetchall()
p = []
outlines = ""
for row in rows:
	#rec = []
	#rec.append(r[0])
	#"<a title='click to eStain' onclick='javascript:alert(\"estaining CD33\")';>CD33</a>"
	"""rec.append(r[0])
	rec.append(r[1])
	rec.append(r[2])
	rec.append(r[3])
	rec.append(r[4])
	rec.append(r[5])
	rec.append(r[6]) 
	rec.append(r[7])
	rec.append(r[8])
	rec.append(r[9]) 
        rec.append(r[10]) """             	
	outlines = outlines + "\t".join([str(ri) for ri in row]) + "\n"
c1.close()
conn1.close()
fileName = "%s_%s.pw.tsv" %(source, cclass)
print "Content-Type: text/plain"
print "Content-Disposition: attachment; filename=" + fileName
print
print "featurea,sp_coeff, adj_pv, bh1, adj_hypgpv, bh2, n_samples, nnaa, diffa, nnab, diffb\n" + outlines

