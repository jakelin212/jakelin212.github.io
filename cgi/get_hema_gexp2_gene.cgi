#!/usr/bin/python
## -*- coding: utf-8 -*-
#

import cgi
import sys
import sqlite3
import time
import json
#import numpy as np
import percentile as p

conn = sqlite3.connect('sqlite/hemap_gexp_raw.db')
c = conn.cursor()
#print ("start " + time.strftime("%H:%M:%S"))
c.execute("select * from _GEXP2_meis2")
rows = c.fetchall()
paw = {}
for r in rows:
        paw[r[0]] = r[1]
#print (rows[0][0])
#print (rows[0][1])
pa = {}
pa['_gexp2_tp53'] = paw
#print paw['GSM109793']
#print paw['GSM109794']

conn.text_factory = str
qform = cgi.FieldStorage()
inparam = "AML"#
inparam = qform.getvalue('inparameter')
incol = "lineage_tumor_cat"#
incol = qform.getvalue('column')
"""
gsm text, gse text, main_cat text, lineage_tumor_cat text, subtype_cat text, spec_cat text, cytogenetics text, clinical text, submaps text, patient text, sample_source text, sample_isolation text,
 notes text
"""
select = "select g.gexp_log2, ha.gsm from _GEXP2_MEIS2 g, hema_annotationf ha where g.gsm = ha.gsm and " + incol + " like '%" + inparam + "%' order by g.gexp_log2 asc"
#select = "select * from hema_annotationf where " + incol + " like '%" + inparam + "%' order by gsm asc"
c.execute(select)
rows = c.fetchall()

#select = "select g.gexp_log2, ha.gsm from _GEXP2_MEIS2 g, hema_annotationf ha where g.gsm = ha.gsm and " + incol + " like '%AML%' order by g.gexp_log2 asc"
#c.execute(select)
#rrows = c.fetchall()

c.close()
conn.close()
pa = {}
gexps = []
gsms = []
for r in rows:
	gexps.append(r[0])
	gsms.append(r[1])
#pa["gexps"] = gexps
#pa["gsms"] = gsms

pa["median"] = gexps[len(gexps)/2]
pa["upper_quantile"] = p.percentile(gexps, .75)
pa["lower_quantile"] = p.percentile(gexps, .25)
pa["min"] = min(gexps)
pa["max"] = max(gexps)
pa["count"] = len(rows)
pa["ugexp"] = []
pa["lgexp"] = []
ct = 0
for g in gexps:
	if (g > pa["upper_quantile"]):
		pa["ugexp"].append(g)
	if (g < pa["lower_quantile"]):
                pa["lgexp"].append(g)		
print "Content-type: text/html;charset=utf-8\r\n"
print json.dumps(pa)
#print ("end " + time.strftime("%H:%M:%S"))

