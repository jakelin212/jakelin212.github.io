#!/usr/bin/python
## -*- coding: utf-8 -*-
#
import json
#import db_conf
import cgi
import sys
import sqlite3

qform = cgi.FieldStorage()
inparam = qform.getvalue('inpathway')
#inparam = "Citrate_cycle_tca_cycle_KEGG" #autophagy_article"#
intype = qform.getvalue('pathwaytype')
#intype = "all"#"leukemia"#"aml"
pw_src = inparam + intype
gsvapw = 0.4
gsvapw = float(qform.getvalue('gsvapw'))
mapsource = qform.getvalue('mapsource')
conn = sqlite3.connect('sqlite/hemap_pw2_' + intype + '.db')
conn.text_factory = str
c = conn.cursor()
mapsource = "hema_annotationf"

c.execute("select mclass, hc.gsm, stained_score from _pwstained_" + pw_src + " ha, " + mapsource + " hc where ha.gsm = hc.gsm")
rows = c.fetchall()
print "Content-type: text/html;charset=utf-8\r\n"
pa = {}
lowcts = {}
medcts = {}
highcts = {}
for row in rows:
	pi = []
	cat = row[0]
	grade = row[2]
        #pa['espts'].append(pi)
	if (grade < (-1*gsvapw)):
		if (lowcts.get(cat) == None):
			lowcts[cat] = 1
		else:
			lowcts[cat] = lowcts[cat] + 1;
		#pa['low'].append(pi)
	elif (grade > gsvapw):
		#pa['high'].append(pi)
		if (highcts.get(cat) == None):
                        highcts[cat] = 1
                else:
                        highcts[cat] = highcts[cat] + 1;
	else:
		if (medcts.get(cat) == None):
                        medcts[cat] = 1
                else:
                        medcts[cat] = medcts[cat] + 1;
c.close()
pa["low"] = lowcts
pa["med"] = medcts
pa["high"] = highcts
print json.dumps(pa)

