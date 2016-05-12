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

qform = cgi.FieldStorage()
gene = "IRX3"#
gene = qform.getvalue('ingene')
inparams = ""
inparams = qform.getvalue('inparams')
#inparams = "|blood:GSM*GSM215000 GSM214999 GSM214983 GSM214984 GSM214988 GSM214985 GSM215005 GSM215002 GSM215004 GSM215003 GSM214982 |clinical:acute"
tk = []
pg = {}

conn = sqlite3.connect('sqlite/hemap_gexp_sum.db')
c = conn.cursor()
c.execute("SELECT min, lower_quantile, median, upper_quantile, max, mean from GEXP2_SUMMARY where gene = '" + gene + "'")
row = c.fetchone()
c.close()
conn.close()
pg["min"] = row[0]
pg["lower_quantile"] = row[1]
pg["median"] = row[2]
pg["upper_quantile"] = row[3]
pg["max"] = row[4]
pg["mean"] = row[5]

if (inparams == None or inparams.find("|") == -1):
	print "Content-type: text/html;charset=utf-8\r\n"
	print json.dumps(pg)
	sys.exit()

conn = sqlite3.connect('sqlite/hemap_gexp_raw.db')
c = conn.cursor()
conn.text_factory = str

if (qform.getvalue('inparams') == None or inparams.find("|") != -1):
	tk = inparams[1:].split("|")
lowoutlier = .1
lowoutlier = float(qform.getvalue('lowoutlier'))
highoutlier = .9
highoutlier = float(qform.getvalue('highoutlier'))

series = 1
for t in tk:
	param = t.split(":")
	pa = {}
	mykey = ""
	if (t.find(":GSM") != -1):
		inparam = t.split("*")[1]
		insql = ""
		for tk in inparam.split(" "):
			if (tk == " " or tk == ""):
				continue
        		insql = "'" + tk + "'," + insql
		insql = insql[:-1]
		select = "select g.gexp_log2, ha.gsm from _GEXP2_" + gene + " g, hema_annotationf ha where g.gsm = ha.gsm and g.gsm in ( " + insql + ") order by g.gexp_log2 asc"
		pa["inparam"] = inparam
		pa["param"] = param[0] + ":GSM" # same as group name
		incol = t.split("*")[0]
		mykey = incol
	else:
        	incol = param[0] #.upper()
		inparam = param[1]
		select = "select g.gexp_log2, ha.gsm from _GEXP2_" + gene + " g, hema_annotationf ha where g.gsm = ha.gsm and " + incol + " like '%" + inparam + "%' order by g.gexp_log2 asc"
		pa["param"] = incol + ":" + inparam
		mykey = incol + ":" + inparam  
	#print select
	c.execute(select)
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
	#pa["lgexp"] = []
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
	"""
	for g in gexps:
		if (g > pa["upper_quantile"]):
			pa["ugexp"].append(g)
		if (g < pa["lower_quantile"]):
                	pa["lgexp"].append(g)		
	"""
	pg[mykey] = pa
	series = series + 1
c.close()
conn.close()

"""
conn = sqlite3.connect('sqlite/hemap_gexp_sum.db')
c = conn.cursor()
c.execute("SELECT min, lower_quantile, median, upper_quantile, max, mean from GEXP2_SUMMARY where gene = '" + gene + "'")
row = c.fetchone()
c.close()
conn.close()
pg["min"] = row[0]
pg["lower_quantile"] = row[1]
pg["median"] = row[2]
pg["upper_quantile"] = row[3]
pg["max"] = row[4]
pg["mean"] = row[5]
"""

print "Content-type: text/html;charset=utf-8\r\n"
print json.dumps(pg)

