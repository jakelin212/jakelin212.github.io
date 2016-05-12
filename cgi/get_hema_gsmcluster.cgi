#!/usr/bin/python
## -*- coding: utf-8 -*-
#
import json
#import db_conf
import cgi
import sys
import sqlite3

# Open database (will be created if not exists)
conn = sqlite3.connect('sqlite/hemap_core2.db')
conn.text_factory = str
c = conn.cursor()
qform = cgi.FieldStorage()
inparam = qform.getvalue('inparameter')
inparam = "GSM1226121, GSM1254268, GSM1254280"
ingsm = ""
for p in inparam.split(","):
	p = p.replace(" ", "")
	ingsm = ingsm + "'" + p + "',"
ingsm = ingsm[:-1]
#print ingsm

"""
gsm text, gse text, main_cat text, lineage_tumor_cat text, subtype_cat text, spec_cat text, cytogenetics text, clinical text, submaps text, patient text, sample_source text, sample_isolation text, notes text
"""
#gsm, join with annotation to get category
c.execute("select gc.pt, ha.mclass, gc.gsm from hema_gsm_cluster gc, hema_annotationf ha where gc.gsm = ha.gsm and gc.gsm in (" + ingsm + ")")

rows = c.fetchall()
print "Content-type: text/html;charset=utf-8\r\n"
pa = {}
pa['aaData'] = []
pa['CML'] = []
pa['gsms'] = {}
i = 0
for row in rows:
	pi = []
	cat = ""
        for r in range(len(row)):
		col = row[r]
		if (col == None):
			col = ""
        	col = col.replace("'", "")
		if (r == 0):
			#pi.append(float(D(col.split(",")[0])))
			#pi.append(col.split(",")[0]);pi.append(col.split(",")[1])
                        #round(float("1.67921"), 5) pi.append(col.split(",")[1])
			x = "%.4f" % float(col.split(",")[0]) #"3.161591234")
                        y = "%.4f" % float(col.split(",")[1])
				
			pi.append(float(x));pi.append(float(y));pi.append(row[2])
		
			#pi.append(float(".4f" % float(col.split(",")[0])))
			#pi.append(float(".4f" % float(col.split(",")[1])))
			#pi.append(locale.atof(col.split(",")[1]))
                cat = row[1]
		pa['gsms'][str(x) + '_' + str(y)] = row[2]		
	pa["CML"].append(pi)
	i = i + 1

c.close()
print json.dumps(pa)
