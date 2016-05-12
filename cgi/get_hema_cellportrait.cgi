#!/usr/bin/python
## -*- coding: utf-8 -*-
#
import json
#import db_conf
import cgi
import sys
import sqlite3

# Open database (will be created if not exists)
conn = sqlite3.connect('sqlite/hemap_portrait.db')
conn.text_factory = str
c = conn.cursor()
qform = cgi.FieldStorage()
inparam = "CellLine_Lymphoma_TCL_CTCL_SS_HuT78"#
inparam = qform.getvalue('celllinein')
incol = qform.getvalue('column')
#inparam = "notes:cancer"
#param:value
#outcols = "gsm, gse, main_cat, lineage_tumor_cat, subtype_cat, spec_cat,cytogenetics, clinical, submaps, patient, sample_source, sample_isolation, notes"

"""
gsm text, gse text, main_cat text, lineage_tumor_cat text, subtype_cat text, spec_cat text, cytogenetics text, clinical text, submaps text, patient text, sample_source text, sample_isolation text, notes text

f = open("hema/AnnotationTable.txt", "r")
c.execute('''create table hema_cellportrait
(cellline text, symbol text, exp_symbol text, gid INTEGER PRIMARY KEY AUTOINCREMENT
)''')
content = os.listdir("hema/CellLine_Normal_cellPortraits")

c.execute('select count(*) from hema_cellportrait limit 5')
rows = c.fetchall()
print "hema_cellportrait counts " + str(rows)
c.execute("select count(*) from hema_cellportrait where cellline = 'CellLine_Lymphoma_TCL_CTCL_SS_HuT78' limit 5")

"""

c.execute("select symbol, exp_symbol from hema_cellportrait where cellline = '" + inparam + "'")# where " + incol + " like '%" + inparam + "%' order by gsm asc")
#c.execute("select distinct(cellline) from hema_cellportrait")
rows = c.fetchall()
print "Content-type: text/html;charset=utf-8\r\n"
pa = {}
pa['aaData'] = []
pa['ycat'] = []
pa['xcat'] = []
sa = []
s = ""
min = 0
max = 0
rowc = 0
for row in rows:
	pi = []
        for r in range(len(row)):
		col = row[r]
		if (col == None):
			col = ""
        	#col = col.replace("'", "")
		if (r == 0):
			#"<a href=javascript:updateExperiment('" + str(row[r]) + "')>edit</a>")
			pa['ycat'].append(col)
			#s= s+ "<option value='%s'>%s</option>" %(col, col.upper())
                else:
		    	vallist = col.split(",")
			x = 0
			sa = []
		    	for v in vallist:
				pi = []
				pi.append(rowc)
				pi.append(x)
                    		pi.append(int(v.split(".")[0]))
				if (int(v.split(".")[0]) > max):
					max = int(v.split(".")[0])
				if (int(v.split(".")[0]) < min):
                                        min = int(v.split(".")[0])
				sa.append(x)
				x = x + 1
				pa['aaData'].append(pi)
	rowc = rowc + 1
        #pa['aaData'].append(pi)
pa['xcat'] = sa
pa['min'] = min
pa['max'] = max
c.close()
print json.dumps(pa)
#print s
