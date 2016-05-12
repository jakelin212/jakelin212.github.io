#!/usr/bin/python
## -*- coding: utf-8 -*-
#
import json
import cgi
import sys
import sqlite3
import percentile

qform = cgi.FieldStorage()
#inparam = "CTD-3080P12.3" #MEIS1"#
inparam = qform.getvalue('inparameter')
session = percentile.loaddict("./_all_session_genestain.dict")[inparam]

conn = sqlite3.connect('sqlite/hemap_gstain' + str(session) + '.db')
conn.text_factory = str
c = conn.cursor()

mapsource = "hema_gsm_cluster"
#AML
if (qform.getvalue('mapsource') != None and qform.getvalue('mapsource') == "leukemia"):
        mapsource = "hema_gsm_cluster_leukemia";

c.execute("select pt, hc.gsm, stained_cat from [_gstained_" + inparam + "] ha, " + mapsource + " hc where ha.gsm = hc.gsm")
rows = c.fetchall()
print "Content-type: text/html;charset=utf-8\r\n"
pa = {}
#pa['espts'] = []
#pa['esgsms'] = {}
pa['low'] = []
pa['medium'] = []
pa['high'] = []
pa['highgsm'] = {}

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
		grade = row[2]
	if (grade == -1):
		pa['low'].append(pi)
	if (grade == 0):
                pa['medium'].append(pi)
	if (grade == 1):
                pa['high'].append(pi)
		pa['highgsm'][row[1]] = 1
c.close()
print json.dumps(pa)
"""
print len(pa['low'])
print len(pa['medium'])
print len(pa['high'])
"""
