#!/usr/bin/python
## -*- coding: utf-8 -*-
#
import json
#import db_conf
import cgi
import sys
import sqlite3

conn = sqlite3.connect('sqlite/hemap_core3.db')
conn.text_factory = str
c = conn.cursor()
qform = cgi.FieldStorage()
inparam = "CML"#
inparam = "GSM219392 GSM219393 GSM219394"
inparam = qform.getvalue('inparameter')
incol = "lineage_tumor_cat"#
incol = qform.getvalue('column')
#incol = "gsms"
mapsource = "hema_gsm_cluster"
if (qform.getvalue('mapsource') != None and qform.getvalue('mapsource') == "leukemia"):
	mapsource = "hema_gsm_cluster_leukemia";


"""
gsm text, gse text, main_cat text, lineage_tumor_cat text, subtype_cat text, spec_cat text, cytogenetics text, clinical text, submaps text, patient text, sample_source text, sample_isolation text, notes text
"""

#select = "select " + outcols + " from hema_annotationf where " + incol + " like '%" + inparam + "%' order by gsm asc"
select = "select pt, hc.gsm from hema_annotationf ha, " + mapsource + " hc where ha.gsm = hc.gsm and " + incol + " like '%" + inparam + "%'"
if (incol == "gsms"):
        ingsm = ""
        for p in inparam.split(" "):
                p = p.replace(" ", "")
                ingsm = ingsm + "'" + p + "',"
        ingsm = ingsm[:-1]
        select = "select pt, hc.gsm from hema_annotationf ha, " + mapsource + " hc where ha.gsm = hc.gsm and hc.gsm in (" + ingsm + ") order by hc.gsm asc"

#c.execute("select " + outcols + " from hema_annotationf where " + incol + " like '%" + inparam + "%' order by gsm asc")
c.execute(select)

#c.execute("select pt, hc.gsm from hema_annotationf ha, " + mapsource + " hc where ha.gsm = hc.gsm and " + incol + " like '%" + inparam + "%'")
rows = c.fetchall()
print "Content-type: text/html;charset=utf-8\r\n"
pa = {}
pa['espts'] = []
pa['esgsms'] = {}
for row in rows:
	pi = []
        for r in range(len(row)):
		col = row[r]
		if (col == None):
			col = ""
        	col = col.replace("'", "")
		if (r == 0):
			#"<a href=javascript:updateExperiment('" + str(row[r]) + "')>edit</a>")
                	pi.append(float(col.split(",")[0]))
                        pi.append(float(col.split(",")[1]))
			#pi.append("<a href='javascript:highlightGSM(\"" + col + "\")'>" + col + "</a>")
                else:
                    				
                        pa['esgsms'][col] = pi
        pa['espts'].append(pi)
c.close()
print json.dumps(pa)
