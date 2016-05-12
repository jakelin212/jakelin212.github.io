#!/usr/bin/python
## -*- coding: utf-8 -*-
#

import sqlite3
import json
import cgi

qform = cgi.FieldStorage()
pathway = 'WNT_SIGNALING_PATHWAY_KEGG'
pathway = "Thiamine_Metabolism_Recon1"
pathway = qform.getvalue('inparameter')
gsvapw = .8
gsvapw = float(qform.getvalue('gsvapw'))
cnvrconn = sqlite3.connect('sqlite/hemap_tcga_pathway.db')
cc = cnvrconn.cursor()
sel = "select barcode, stained_score from _PWSTAINED_" + pathway #ACAP3"
pa = {}
try:
        cc.execute(sel)
except:
        #print("no such table " + gene)
	print "Content-type: text/html;charset=utf-8\r\n"
	pa["notexists"] = gene
	print json.dumps(pa)
        sys.exit()

rows = cc.fetchall()
pa['low'] = {}
pa['medium'] = {}
pa['high'] = {}

for row in rows:
        grade = row[1]
	barcode = row[0].replace("-", ".")
	
	if (grade < (-1*gsvapw)):
                pa['low'][barcode] = 1
        elif (grade > gsvapw):
                pa['high'][barcode] = 1
        else:
                pa['medium'][barcode] = 1
cc.close()
cnvrconn.close()
print "Content-type: text/html;charset=utf-8\r\n"
print json.dumps(pa)
