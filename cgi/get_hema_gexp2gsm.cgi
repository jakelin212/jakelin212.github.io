#!/usr/bin/python
## -*- coding: utf-8 -*-
#

import cgi
import sys
import sqlite3
import time
import json
import random
#import numpy as np
import percentile as p

conn = sqlite3.connect('sqlite/hemap_gexp_raw.db')
c = conn.cursor()
pa = {}
conn.text_factory = str
qform = cgi.FieldStorage()
inparam = "GSM38359 GSM38348 GSM38349"#
inparam = qform.getvalue('gsms')
insql = ""
for tk in inparam.split(" "):
	insql = "'" + tk + "'," + insql
insql = insql[:-1]
#print insql
grpname = "somename"#
grpname = qform.getvalue('grpname')
gene = "IRX3"#
gene = qform.getvalue('ingene')
lowoutlier = .2
highoutlier = .8
lowoutlier = float(qform.getvalue('lowoutlier'))
highoutlier = float(qform.getvalue('highoutlier'))
series = 1
series = int(qform.getvalue('series'))
"""
gsm text, gse text, main_cat text, lineage_tumor_cat text, subtype_cat text, spec_cat text, cytogenetics text, clinical text, submaps text, patient text, sample_source text, sample_isolation text,
 notes text
"""
select = "select g.gexp_log2, ha.gsm from _GEXP2_" + gene + " g, hema_annotationf ha where g.gsm = ha.gsm and g.gsm in ( " + insql + ") order by g.gexp_log2 asc"
c.execute(select)
rows = c.fetchall()

c.close()
conn.close()
pa = {}
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
pa["param"] = grpname + ":GSM"
pa["inparam"] = inparam
pa["median"] = gexps[len(gexps)/2]
pa["upper_quantile"] = p.percentile(gexps, .75)
pa["lower_quantile"] = p.percentile(gexps, .25)
lowoc = p.percentile(gexps, lowoutlier)
highoc = p.percentile(gexps, highoutlier)
pa["min"] = min(gexps)
pa["max"] = max(gexps)
pa["count"] = len(rows)
pa["ogexp"] = []
#pa["lgexp"] = []
ct = 0
xright = series
xleft = series
inc = .008
#if outlier count exceeds 500, then stopped 
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
print "Content-type: text/html;charset=utf-8\r\n"
print json.dumps(pa)
#print ("end " + time.strftime("%H:%M:%S"))

