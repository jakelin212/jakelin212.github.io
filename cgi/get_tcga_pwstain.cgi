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
inparam = qform.getvalue('inparameter')
#inparam = "HOMOVANILLIC_ACID_CTD_00006103_DSigDB"

conn = sqlite3.connect('sqlite/hemap_pw_tcga_aml.db')
conn.text_factory = str
c = conn.cursor()

gsvapw = float(qform.getvalue('gsvapw'))
#gsvapw = .4
mapsource = "hema_gsm_cluster"

c.execute("select pt, hc.gsm, stained_score from [_GSVA_" + inparam + "_TCGA] ha, " + mapsource + " hc where ha.gsm = hc.gsm")
rows = c.fetchall()
print "Content-type: text/html;charset=utf-8\r\n"
pa = {}
pa['low'] = {}
pa['medium'] = {}
pa['high'] = {}

for row in rows:
	pi = []
	grade = 99
	barcode = row[1]
        for r in range(len(row)):
		col = row[r]
		if (col == None):
			col = ""
		if (r == 0):
                	pi.append(float(col.split(",")[0]))
                        pi.append(float(col.split(",")[1]))
                #else:                    				
                #        pa['esgsms'][col] = pi
		grade = row[2]
        #pa['espts'].append(pi)
	if (grade < (-1*gsvapw)):
		#pa['low'].append(pi)
		pa['low'][barcode] = 1
	elif (grade > gsvapw):
		#pa['high'].append(pi)
		pa['high'][barcode] = 1
	else:
		pa['medium'][barcode] = 1
                #pa['medium'].append(pi)
c.close()
print json.dumps(pa)

