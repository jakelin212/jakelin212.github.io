#!/usr/bin/python
## -*- coding: utf-8 -*-
#
import json
#import db_conf
import cgi
import sys
import sqlite3

# Open database (will be created if not exists)
conn = sqlite3.connect('sqlite/hemap_core3.db')
conn.text_factory = str
c = conn.cursor()
qform = cgi.FieldStorage()
inparam = qform.getvalue('inparameter')
#inparam = "GSM1226121, GSM1254268, GSM1254280"
#inparam = 'AML'
incol = qform.getvalue('column')

#incol = 'lineage_tumor_cat'
#incol = 'gsm'
#param:value
#advancedparameter:
#advancedcolumn:lineage_tumor_cat
#advancedop: AND 
andor = qform.getvalue('advancedop')
adv_incol = ""
if (qform.getvalue('advancedcolumn') != None):
	adv_incol = qform.getvalue('advancedcolumn')
adv_inparam = ""
if (qform.getvalue('advancedparameter') != None):
	adv_inparam = qform.getvalue('advancedparameter')
outcols = qform.getvalue('outc')
#outcols = "gsm, gse, main_cat, lineage_tumor_cat, subtype_cat, spec_cat,cytogenetics, clinical, submaps, sample_source, sample_isolation ,alterations,tumor_type,tumor_purity,patient,gender, race, age, phenotype, survival_status, survival_time, ef_pf_status, ef_survival, gsp, invivo_treatment, invivo_treatment_time, cultured, exvivo_treatment, exvivo_treatment_time"
#gsm, gse, main_cat, lineage_tumor_cat, subtype_cat, spec_cat,cytogenetics, clinical, submaps, patient, sample_source, sample_isolation, notes"

"""
gsm text, gse text, main_cat text, lineage_tumor_cat text, subtype_cat text, spec_cat text, cytogenetics text, clinical text, submaps text, patient text, sample_source text, sample_isolation text, notes text

f = open("hema/AnnotationTable.txt", "r")
"""

wildc = "%"
if (incol == "cluster"):
        wildc = ""

select = "select " + outcols + " from hema_annotationf where " + incol + " like '" + wildc + inparam + wildc + "' order by gsm asc"
if (adv_inparam != "" and adv_incol != ""):
	select = "select " + outcols + " from hema_annotationf where " + incol + " like '" + wildc + inparam + wildc + "'" + andor + adv_incol + " like '" + wildc + adv_inparam + wildc + "' order by gsm asc"
#print select
if (incol == "gsms"):
	ingsm = ""
	for p in inparam.split(" "):
        	p = p.replace(" ", "")
        	ingsm = ingsm + "'" + p + "',"
	ingsm = ingsm[:-1]
	select = "select " + outcols + " from hema_annotationf where gsm in (" + ingsm + ") or altgse in (" + ingsm + ") order by gsm asc"

#during population, altgsm and altgse were swapped, for now we will swap the search to save data repopulation
if (incol == "gsm"):
	select = "select " + outcols + " from hema_annotationf where gsm = '" + inparam + "' or altgse like '%" + inparam + "%' order by gsm asc"

if (incol == "gse"):
        select = "select " + outcols + " from hema_annotationf where gse like '%" + inparam + "%' or altgsm like '%" + inparam + "%' order by gsm asc"

logf = open("./_sql.log", "a")
c.execute(select)
logf.write("\n" + select + "\n")
logf.close()
rows = c.fetchall()
print "Content-type: text/html;charset=utf-8\r\n"
pa = {}
pa['aaData'] = []
for row in rows:
	pi = []
        for r in range(len(row)):
		col = str(row[r])
		col = unicode(col, errors='ignore')
		if (col == None):
			col = ""
        	#col = col.replace("'", "")
		if (r == 0):
			#"<a href=javascript:updateExperiment('" + str(row[r]) + "')>edit</a>")
                	pi.append("<a href='javascript:highlightGSM(\"" + col + "\")'>" + col + "</a>")
                        #pi.append(col)
                else:
                    pi.append(col)
        pa['aaData'].append(pi)
c.close()
print json.dumps(pa)
