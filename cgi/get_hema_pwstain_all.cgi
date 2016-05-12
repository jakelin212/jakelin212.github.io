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
inparam = "HEMATOPOIETIC_STEM_CELL_DIFFERENTIATION_HOMO_SAPIENS_WIKIPW"#_GSVA"#HOMOVANILLIC_ACID_CTD_00006103_DSigDB"
inparam = "FLT_3_INHIBITOR_II-DSigDB_D4_GSVA"
#Citrate_cycle_tca_cycle_KEGG" #autophagy_article"#
intype = qform.getvalue('pathwaytype')
intype = "all"#"leukemia"#"aml"

#session = loaddict("./_all_session_pw.dict")['HOMOVANILLIC_ACID_CTD_00006103_DSigDB']
session = percentile.loaddict("./_all_session_pw.dict")[inparam]

conn = sqlite3.connect('sqlite/hemap_pw_kesa' + str(session) + "_" + intype + '.db')
conn.text_factory = str
c = conn.cursor()
if (intype == "all"):
        intype = ""


#gsvapw = float(qform.getvalue('gsvapw'))
gsvapw = .4
#mapsource = qform.getvalue('mapsource')
mapsource = "hema_gsm_cluster"
#if (qform.getvalue('mapsource') != None and qform.getvalue('mapsource') == "leukemia"):
#        mapsource = "hema_gsm_cluster_leukemia";

"""
gsm text, gse text, main_cat text, lineage_tumor_cat text, subtype_cat text, spec_cat text, cytogenetics text, clinical text, submaps text, patient text, sample_source text, sample_isolation text, notes text
try:
    c.execute('select * from _PWSTAINED_AUTOPHAGY_articleaml limit 12')
    print "_PWSTAINED_KUMAR_AUTOPHAGY_NETWORK_aml " + json.dumps(c.fetchall())
except Exception, e:
    print "okay e" + str(e)

try:
    c.execute('select count(*) from _PWSTAINED_AUTOPHAGY_ARTICLEleukemia limit 10')
    print "_PWSTAINED_AUTOPHAGY_ARTICLE_leukemia " + str(c.fetchall())
except Exception, e:
    print "okay e" + str(e)

[_GSVA_' + p + source + ']

"""

#c.execute("select ha.gsm, stained_score from [_GSVA_" + inparam + "_fm] ha limit 1")
#print c.fetchall()

c.execute("select pt, hc.gsm, stained_score from [_GSVA_" + inparam + "_fm] ha, " + mapsource + " hc where ha.gsm = hc.gsm")
rows = c.fetchall()
print "Content-type: text/html;charset=utf-8\r\n"
pa = {}
pa['low'] = []
pa['medium'] = []
pa['high'] = []

for row in rows:
	pi = []
	grade = 99
        if (row[1] == "GSM101527" or row[1] == "GSM101529" ):
            print row
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
#print json.dumps(pa)

