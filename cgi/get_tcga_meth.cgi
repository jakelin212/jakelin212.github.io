#!/usr/bin/python
## -*- coding: utf-8 -*-
#

import sqlite3
import json
import cgi
import sys
qform = cgi.FieldStorage()
gene = "TP53"
gene = qform.getvalue('inparameter')
cnvrconn = sqlite3.connect('sqlite/hemap_tcga_meth2.db')
cc = cnvrconn.cursor()
sel = "select barcode, meth from _METH_" + gene
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
	if (grade == 0):
                pa['medium'][barcode] = 1
        elif (grade == -1):
                pa['low'][barcode] = 1
        elif (grade == 1):
                pa['high'][barcode] = 1
cc.close()
cnvrconn.close()

print "Content-type: text/html;charset=utf-8\r\n"
print json.dumps(pa)
