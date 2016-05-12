#!/usr/bin/python
## -*- coding: utf-8 -*-
#
import json
#import db_conf
import cgi
import sys
import sqlite3
import percentile

qform = cgi.FieldStorage()
inparam = qform.getvalue('inpathway')
#inparam = "CHRXQ12_MsigDB_c1"
#Citrate_cycle_tca_cycle_KEGG" #autophagy_article"#
intype = "aml"

session = percentile.loaddict("./_aml_session_pw.dict")[inparam]
conn = sqlite3.connect('sqlite/hemap_pw_kesa' + str(session) + "_" + intype + '.db')
conn.text_factory = str
c = conn.cursor()

gsvapw = .4
gsvapw = float(qform.getvalue('gsvapw'))
mapsource = "hema_gsm_aml_cluster"

c.execute("select pt, hc.gsm, stained_score from [_GSVA_" + inparam + "] ha, " + mapsource + " hc where ha.gsm = hc.gsm")
rows = c.fetchall()
print "Content-type: text/html;charset=utf-8\r\n"
pa = {}
pa['low'] = []
pa['medium'] = []
pa['high'] = []

for row in rows:
	pi = []
	grade = 99
        for r in range(len(row)):
		col = row[r]
		if (col == None):
			col = ""
        	#col = col.replace("'", "")
		if (r == 0):
                	pi.append(float(col.split(",")[0]))
                        pi.append(float(col.split(",")[1]))
                #else:                    				
                #        pa['esgsms'][col] = pi
		grade = row[2]
        #pa['espts'].append(pi)
	if (grade < (-1*gsvapw)):
		pa['low'].append(pi)
	elif (grade > gsvapw):
		pa['high'].append(pi)
	else:
                pa['medium'].append(pi)
c.close()
print json.dumps(pa)
