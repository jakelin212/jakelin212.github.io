#!/usr/bin/python
## -*- coding: utf-8 -*-
#

#import cgi
import json

#conn = sqlite3.connect('sqlite/hemap_gexp_sum.db')
#c = conn.cursor()
#_gene = "IRX5"
#qform = cgi.FieldStorage()
#_gene = qform.getvalue('_gene')

#c.execute("SELECT min, lower_quantile, median, upper_quantile, max, mean from GEXP2_SUMMARY where gene = '" + _gene + "'")
mof = open("populate/methylation.out", "r")
mgenes = []
for l in mof.readlines():
	mgenes.append(l.strip())
mof.close()

pa = {}
pa["mgenes"] = mgenes
print "Content-type: text/html;charset=utf-8\r\n"
print json.dumps(pa)


