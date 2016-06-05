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
#inparam = "15_HYDROXY_11ALPHA_9ALPHA_EPOXYMETHANO_PROSTA_5_13_DIENOIC_ACID-DSigDB_D4"#SUCCINYL_COENZYME_A-DSigDB_D4" #CHRXQ12_MsigDB_c1"
#Citrate_cycle_tca_cycle_KEGG" #autophagy_article"#
intype = "tall"

session = percentile.loaddict("./_tall_session_pw.dict")[inparam]
conn = sqlite3.connect('sqlite/hemap_pw_kesa' + str(session) + "_" + intype + '.db')
conn.text_factory = str
c = conn.cursor()

ifdrpv = qform.getvalue('infdrpv')
#infdrpv = '0.05'

fdrcon = sqlite3.connect('sqlite/hemap_all_fdr.db')
fdrcur = fdrcon.cursor()
try:
    fdrcur.execute("select pv_05 real, pv_01 real, pv_001 from [_fdr_pv_lookup] where featurea like '" + inparam + "%'")
    row = fdrcur.fetchone()
    gsvapw = 0.0
    if (ifdrpv == "0.05" or ifdrpv == ".05"):
        gsvapw = row[0]
    elif (ifdrpv == "0.01" or ifdrpv == ".01"):
        gsvapw = row[1]
    else:
        gsvapw = row[2]
except:
    gsvapw = 0.4

fdrcur.close()
fdrcon.close()

mapsource = "hema_gsm_all_cluster"
try:
	c.execute("select pt, hc.gsm, stained_score from [_GSVA_" + inparam + "] ha, " + mapsource + " hc where ha.gsm = hc.gsm")
except:
	pa['nongsva'] = 'nongsva'
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
		if (r == 0):
                	pi.append(float(col.split(",")[0]))
                        pi.append(float(col.split(",")[1]))
		grade = row[2]
	if (grade < (-1*gsvapw)):
		pa['low'].append(pi)
	elif (grade > gsvapw):
		pa['high'].append(pi)
	else:
                pa['medium'].append(pi)
pa["fdrpv"] = str(gsvapw)[:4]
c.close()
print json.dumps(pa)
