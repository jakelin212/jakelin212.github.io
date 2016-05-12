#!/usr/bin/python
## -*- coding: utf-8 -*-
#
import json
import cgi
import sys
import sqlite3

# Open database (will be created if not exists)
conn = sqlite3.connect('sqlite/hemap_gexp3.db')
conn.text_factory = str
c = conn.cursor()
qform = cgi.FieldStorage()
#inparam = "MEIS1"#
inparam = qform.getvalue('inparameter')
#inparam = "FLT3LG"
mapsource = "hema_annotationf"

#c.execute("select pt, hc.gsm, stained_cat from _gstained_" + inparam + " ha, " + mapsource + " hc where ha.gsm = hc.gsm")

c.execute("select mclass, hc.gsm, stained_cat from _gstained_" + inparam + " ha, " + mapsource + " hc where ha.gsm = hc.gsm")
rows = c.fetchall()
print "Content-type: text/html;charset=utf-8\r\n"
pa = {}
pa['low'] = []
pa['medium'] = []
pa['high'] = []
lowcts = {}
medcts = {}
highcts = {}
for row in rows:
	pi = []
	cat = row[0]
	grade = row[2]
	if (grade == -1):
		if (lowcts.get(cat) == None):
			lowcts[cat] = 1
		else:
			lowcts[cat] = lowcts[cat] + 1;
		#pa['low'].append(pi)
	if (grade == 0):
		#pa['high'].append(pi)
		if (highcts.get(cat) == None):
                        highcts[cat] = 1
                else:
                        highcts[cat] = highcts[cat] + 1;
	if (grade == 1):
		if (medcts.get(cat) == None):
                        medcts[cat] = 1
                else:
                        medcts[cat] = medcts[cat] + 1;
c.close()
pa["low"] = lowcts
pa["med"] = medcts
pa["high"] = highcts
print json.dumps(pa)

