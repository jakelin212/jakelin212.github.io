#!/usr/bin/python
## -*- coding: utf-8 -*-
#

import cgi
import sys
import sqlite3
import time
import json
import random
import percentile as p
import get_cluster_gsms 

qform = cgi.FieldStorage()
gene = qform.getvalue('ingene')
"""gene = "MEIS2"
sample_groups = "lineage_tumor_cat--AML,subtype_cat--M5"#
sample_groups = "cluster_class--cancermap_cluster_AML_and_CLL,main_cat--Erythroid,main_cat--Myeloid,main_cat--B-Lymphoid,main_cat--T-Lymphoid"
lowoutlier = .1
lowoutlier = float(qform.getvalue('lowoutlier'))
highoutlier = .9

Object {ingene: "IRX3 MEIS2", lowoutlier: 0.2, highoutlier: 0.8, sample_groups: "lineage_tumor_cat--AML,subtype_cat--M5", IRX3--lineage_tumor_cat--AML: true…}IRX3--lineage_tumor_cat--AML: trueIRX3--subtype_cat--M5: falseMEIS2--lineage_tumor_cat--AML: trueMEIS2--subtype_cat--M5: truehighoutlier: 0.8ingene: "IRX3 MEIS2"lowoutlier: 0.2sample_groups: "lineage_tumor_cat--AML,subtype_cat--M5"
"""

sample_groups = qform.getvalue('sample_groups')
#sample_groups = "lineage_tumor_cat--AML,subtype_cat--M5"#
#sample_groups = "cluster_class--cancermap_cluster_AML_and_CLL,main_cat--Erythroid,main_cat--Myeloid,main_cat--B-Lymphoid,main_cat--T-Lymphoid"
sample_groups = sample_groups.split(",")

#inparams = "IRX3==blood:GSM*GSM215000 GSM214999 GSM214983 GSM214984 GSM214988 GSM214985 GSM215005 GSM215002 GSM215004 GSM215003 GSM214982 |clinical:acute;;MEIS2==blood:GSM*GSM215000 GSM214999 GSM214983 GSM214984 GSM214988 GSM214985 GSM215005 GSM215002 GSM215004 GSM215003 GSM214982 |clinical:blasts"
"""qq = {}
qq["IRX3--lineage_tumor_cat--AML"] = "true"
qq["IRX3--subtype_cat--M5"] = "true"
qq["MEIS2--lineage_tumor_cat--AML"] = "true"
qq["MEIS2--subtype_cat--M5"] = "true"
"""
pg = {}
notexists = {}
conn = sqlite3.connect('sqlite/hemap_gexp_sum.db')
c = conn.cursor()
genein = "("
genes = gene.split(" ")
for g in genes:
	genein = genein + "'" + g + "'," 
genein = genein[:-1] + ")"
c.execute("SELECT gene, min, lower_quantile, median, upper_quantile, max, mean from GEXP2_SUMMARY where gene in " + genein)
rows = c.fetchall()
c.close()
conn.close()
for row in rows:
	gene = row[0]		
	pg[gene] = {};
	pg[gene]["global"] = {};
	pg[gene]["global"]["min"] = row[1]
	pg[gene]["global"]["lower_quantile"] = row[2]
	pg[gene]["global"]["median"] = row[3]
	pg[gene]["global"]["upper_quantile"] = row[4]
	pg[gene]["global"]["max"] = row[5]
	pg[gene]["global"]["mean"] = row[6]
if (sample_groups == None or len(sample_groups) < 1):
	print "Content-type: text/html;charset=utf-8\r\n"
	print json.dumps(pg)
	sys.exit()
conn = sqlite3.connect('sqlite/hemap_gexp_raw.db')
c = conn.cursor()
conn.text_factory = str
lowoutlier = float(qform.getvalue('lowoutlier'))
highoutlier = float(qform.getvalue('highoutlier'))
for gene in genes:
	series = 1
	for sg in sample_groups:
		pa = {}
		mykey = ""
		gesg_on = qform.getvalue(gene + "--" + sg) #qq[xxx]
                if (gesg_on == "false"):
                	continue

		if (sg.find("--gsm") != -1 or sg.find("cluster_class--") != -1):
			if (sg.find("cluster_class") != -1):
				incol = sg.split("--")[0]
                                cluster_class = sg.split("--")[1]
				gg = get_cluster_gsms.getgsms_forcc(cluster_class)
				insql = ""
				for _gsm in gg:
					insql = "'" + _gsm + "'," + insql
			else:
				inparam = qform.getvalue(gene + "--" + sg) #sg.split("*")[1]			
				insql = ""
				for tk in inparam.split(" "):
					if (tk == " " or tk == ""):
						continue
        				insql = "'" + tk + "'," + insql			
			insql = insql[:-1]			
			select = "select g.gexp_log2, ha.gsm from _GEXP2_" + gene + " g, hema_annotationf ha where g.gsm = ha.gsm and g.gsm in ( " + insql + ") order by g.gexp_log2 asc"
			#pa["inparam"] = inparam
			pa["param"] = sg #param[0] + ":GSM" # same as group name
			mykey = sg
		else:
        		#gesg_on = qform.getvalue(gene + "--" + sg) #qq[xxx]
			#if (gesg_on == "false"):
			#	continue "lineage_tumor_cat--AML AND cytogenetics--12"
			if (sg.find("_AND_") != -1 or sg.find("_OR_") != -1):
				andor = "_AND_"
				if (sg.find("_OR_") != -1):
					andor = "_OR_"
				gtk = sg.split(andor)
				sg0 = gtk[0]
				incol0 = sg0.split("--")[0]
                                inparam0 = sg0.split("--")[1]
				sg1 = gtk[1]
				incol1 = sg1.split("--")[0]
                                inparam1 = sg1.split("--")[1]
				andor = andor.replace("_", " ")
				select = "select g.gexp_log2, ha.gsm from _GEXP2_" + gene + " g, hema_annotationf ha where g.gsm = ha.gsm and (" + incol0 + " like '%" + inparam0 + "%' " + andor + incol1 + " like '%" + inparam1 + "%') order by g.gexp_log2 asc"
			else:
				incol = sg.split("--")[0]				
				inparam = sg.split("--")[1]
				select = "select g.gexp_log2, ha.gsm from _GEXP2_" + gene + " g, hema_annotationf ha where g.gsm = ha.gsm and " + incol + " like '%" + inparam + "%' order by g.gexp_log2 asc"
			
			pa["param"] = sg
			mykey = sg #incol + ":" + inparam  
		try:
			c.execute(select)
		except:			
			notexists[gene] = 1
			continue

		rows = c.fetchall()
		gexps = []
		gsms = []
		for r in rows:
			gexps.append(r[0])
			#gsms.append(r[1])
			gt = []
			gt.append(r[0])
        		gt.append(r[1])
        		gsms.append(gt)
		pa["gsms"] = gsms
		pa["median"] = gexps[len(gexps)/2]
		pa["upper_quantile"] = p.percentile(gexps, .75)
		pa["lower_quantile"] = p.percentile(gexps, .25)
		lowoc = p.percentile(gexps, lowoutlier)
		highoc = p.percentile(gexps, highoutlier)
		pa["min"] = min(gexps)
		pa["max"] = max(gexps)
		pa["count"] = len(rows)
		pa["ogexp"] = []
		ct = 0
		xright = series
		xleft = series
		inc = .002
		if (pa["count"] > 500):
        		inc = .001
		if (pa["count"] > 1000):
        		inc = .0005
		if (pa["count"] > 2000):
        		inc = .00025
		if (pa["count"] > 5000):
        		inc = .00001
		random.shuffle(gexps)	
		for g in gexps:
        		ot = []
        		if (g >= highoc):
                		if ct & 1:
                        		xright = xright + inc
                        		x = xright
                		else:
                        		xleft = xleft - inc
                        		x = xleft
                		ot.append(x)
                		ot.append(g)
                		pa["ogexp"].append(ot)
                		ct = ct + 1
        		if (g <= lowoc):
                		if ct & 1:
                        		xright = xright + inc
                        		x = xright
                		else:
                        		xleft = xleft - inc
                        		x = xleft
                		ot.append(x)
                		ot.append(g)
                		pa["ogexp"].append(ot)
                	ct = ct + 1
			#series = series + 1			
		pg[gene][mykey] = pa
		#print pa["ogexp"]
		series = series + 1
c.close()
conn.close()
pg["invalid_genes"] = ",".join(notexists.keys())
print "Content-type: text/html;charset=utf-8\r\n"
print json.dumps(pg)
#print ",".join(notexists.keys())
