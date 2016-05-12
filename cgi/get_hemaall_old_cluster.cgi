#!/usr/bin/python
## -*- coding: utf-8 -*-
#
import json
#import db_conf
import cgi
import sys
import sqlite3
# Open database (will be created if not exists)
conn = sqlite3.connect('sqlite/hemap_core.db')
conn.text_factory = str
c = conn.cursor()
qform = cgi.FieldStorage()
"""
gsm text, gse text, main_cat text, lineage_tumor_cat text, subtype_cat text, spec_cat text, cytogenetics text, clinical text, submaps text, patient text, sample_source text, sample_isolation text, notes text
"""
#gsm, join with annotation to get category
import time
#print (time.strftime("%H:%M:%S"))
c.execute("select gc.pt, ha.mclass, gc.gsm from hema_gsm_cluster gc, hema_annotationf ha where gc.gsm = ha.gsm")# where " + incol + " like '%" + inparam + "%' order by gsm asc limit 500")
#c.execute("select * from hema_annotation where notes like '%cancer%' limit 5")
#print (time.strftime("%H:%M:%S"))

rows = c.fetchall()
#print (time.strftime("%H:%M:%S"))
print "Content-type: text/html;charset=utf-8\r\n"
pa = {}
pa['aaData'] = []
#('AML',), ('B-Lymphoid',), ('BCL',), ('CLL',), ('CML',), ('CellLine',), ('Erythroid',), ('LP',), ('Lymphoid',), ('MM',), ('MP',), ('Myeloid',), ('StemCell',), ('T-ALL',), ('T-Lymphoid',), ('TCL',), ('na',), ('pre-B-ALL',)
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
pa["gsms"] = {}
for row in rows:
	pi = []
	cat = ""
        for r in range(len(row)):
		col = row[r]
		if (col == None):
			col = ""
        	col = col.replace("'", "")
		if (r == 0):
                	#pi.append("<a href=javascript:highlightGSM(\"" + str(row[r]) + "\")>Highlight</a>")
                        pi.append(float(col.split(",")[0]))
			pi.append(float(col.split(",")[1]))
			#if ()
			#x = "%f" % float(col.split(",")[0]) 
                        #y = "%f" % float(col.split(",")[1])
			x = col.split(",")[0]
			y = col.split(",")[1]
                cat = row[1]
		pa['gsms'][str(x) + '_' + str(y)] = row[2]
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

"""
c.execute("select pt from hema_centroid where htype='hemaall'")# where " + incol + " like '%" + inparam + "%' order by gsm asc limit 500")
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
