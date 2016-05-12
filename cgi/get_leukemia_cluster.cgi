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
"""
gsm text, gse text, main_cat text, lineage_tumor_cat text, subtype_cat text, spec_cat text, cytogenetics text, clinical text, submaps text, patient text, sample_source text, sample_isolation text, notes text
"""
#gsm, join with annotation to get category
import time
#print (time.strftime("%H:%M:%S"))
c.execute("select gc.pt, ha.mclass, gc.gsm from hema_gsm_cluster_leukemia gc, hema_annotationf ha where gc.gsm = ha.gsm")# where " + incol + " like '%" + inparam + "%' order by gsm asc limit 500")

rows = c.fetchall()
print "Content-type: text/html;charset=utf-8\r\n"
pa = {}
pa['aaData'] = []
pa['gsms'] = {}
pa['AML'] = []
pa['B-Lymphoid'] = []
pa['BCL'] = []
pa['CLL'] = []
pa['CML'] = []
pa['CellLine'] = []
pa['Erythroid'] = []
pa['LP'] = []
pa['Lymphoid'] = []
pa['MM'] = []
pa['MP'] = []
pa['Myeloid'] = []
pa['StemCell'] = []
pa['T-ALL'] = []
pa['T-Lymphoid'] = []
pa['TCL'] = []
pa['na'] = []
pa['pre-B-ALL'] = []
i = 0
for row in rows:
	pi = []
	cat = ""
	#x="";y=""
        for r in range(len(row)):
		col = row[r]
		if (col == None):
			col = ""
        	col = col.replace("'", "")
		if (r == 0):
                	#pi.append("<a href=javascript:highlightGSM(\"" + str(row[r]) + "\")>Highlight</a>")
                        pi.append(float(col.split(",")[0]))
			pi.append(float(col.split(",")[1]))
			#x = "%.4f" % float(col.split(",")[0]) #"3.161591234")
                        #y = "%.4f" % float(col.split(",")[1])
			x = col.split(",")[0]
			y = col.split(",")[1]
                cat = row[1]
                pa["gsms"][x + "_" + y] = row[2]#pi.append(col)
		 	
        pa[cat].append(pi)
	
        """
	if (cat == "Erythroid"):
		pa['Erythroid'].append(pi)
	elif (cat == "MDS"):
                pa['MDS'].append(pi)
	elif (cat == "AML"):
		pa['AML'].append(pi)
        elif (cat == "CML"):
		pa['CML'].append(pi)
	elif (cat == "Lymphoma"):
                pa['Lymphoma'].append(pi)
	elif (cat == "Myeloma"):
                pa['Myeloma'].append(pi)
	elif (cat == "Myeloid"):
                pa['Myeloid'].append(pi)
	"""
	i = i + 1
"""
c.execute("select pt from hema_centroid where htype = 'leukemia'")# where " + incol + " like '%" + inparam + "%' order by gsm asc limit 500")
#c.execute("select * from hema_annotation where notes like '%cancer%' limit 5")
rows = c.fetchall()
pa['centroid'] = []
i = 0
for row in rows:
        pi = []
        for r in range(len(row)):
                col = row[r]
                if (col == None):
                        col = ""
                col = col.replace("'", "")
                if (r == 0):
                        #pi.append("<a href=javascript:highlightGSM(\"" + str(row[r]) + "\")>Highlight</a>")
                        pi.append(float(col.split(",")[0]))
                        pi.append(float(col.split(",")[1]))
			pi.append(4)
        pa['centroid'].append(pi)
"""
c.close()
print json.dumps(pa)
