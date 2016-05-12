#!/usr/bin/python
## -*- coding: utf-8 -*-
#

import cgi
import json

#C:CNVR:11q23.3:chr11:118345795:118354342::LAML-TB_Gistic_ROI_d_amp      2       KMT2A,MLL
qform = cgi.FieldStorage()
ingene = qform.getvalue('ingene').upper()
#ingene = "SRGAP2".upper()

fi = open("tcga_aml_cnvr_gene.tsv", "r")
features = ""

for l in fi.readlines():
	tk = l.strip().split("\t")
	if (len(tk) < 3):
		continue
	genes = tk[2].split(",")
	#print genes
	for g in genes:
		if g.upper().find(ingene) != -1:
			#if (ingene in genes == True):
			features = tk[0].split(":")[2]	 
			break;
fi.close()
pa = {}
print "Content-type: text/html;charset=utf-8\r\n"
pa["cytoband"] = features 
print json.dumps(pa)
