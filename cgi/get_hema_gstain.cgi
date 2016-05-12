#!/usr/bin/python
## -*- coding: utf-8 -*-
#
import json
import cgi
import sys
import sqlite3

conn = sqlite3.connect('sqlite/hemap_gexp3.db')
conn.text_factory = str
c = conn.cursor()
qform = cgi.FieldStorage()
inparam = "MEIS1"#
inparam = qform.getvalue('inparameter')
mapsource = "hema_gsm_cluster"
if (qform.getvalue('mapsource') != None and qform.getvalue('mapsource') == "leukemia"):
        mapsource = "hema_gsm_cluster_leukemia";

#outcols = "gsm, gse, main_cat, lineage_tumor_cat, subtype_cat, spec_cat,cytogenetics, clinical, submaps, patient, sample_source, sample_isolation, notes"

"""
gsm text, gse text, main_cat text, lineage_tumor_cat text, subtype_cat text, spec_cat text, cytogenetics text, clinical text, submaps text, patient text, sample_source text, sample_isolation text, notes text

"""

c.execute("select pt, hc.gsm, stained_cat from _gstained_" + inparam + " ha, " + mapsource + " hc where ha.gsm = hc.gsm")
# and " + incol + " like '%" + inparam + "%'")
rows = c.fetchall()
print "Content-type: text/html;charset=utf-8\r\n"
pa = {}
pa['espts'] = []
pa['esgsms'] = {}
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
	if (grade == -1):
		pa['low'].append(pi)
	if (grade == 0):
                pa['medium'].append(pi)
	if (grade == 1):
                pa['high'].append(pi)
c.close()
print json.dumps(pa)
"""
print len(pa['low'])
print len(pa['medium'])
print len(pa['high'])
print len(pa['espts'])
"""

