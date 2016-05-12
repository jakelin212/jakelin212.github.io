#!/usr/bin/python
## -*- coding: utf-8 -*-
#

import cgi
import json

#C:CNVR:11q23.3:chr11:118345795:118354342::LAML-TB_Gistic_ROI_d_amp      2       KMT2A,MLL
qform = cgi.FieldStorage()
incyto = qform.getvalue('incyto')
#incyto = "20q132.2"#"SRGAP2".upper()

fi = open("tcga_aml_cnvr_gene.tsv", "r")
features = ""
genes = ""
for l in fi.readlines():
	tk = l.strip().split("\t")
	if (len(tk) < 3):
		continue
	if (incyto == tk[0].split(":")[2]):
		genes = tk[2]
	
fi.close()
pa = {}
print "Content-type: text/html;charset=utf-8\r\n"
pa["genes"] = genes 
print json.dumps(pa)
