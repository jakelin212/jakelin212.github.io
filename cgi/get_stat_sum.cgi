#!/usr/bin/python
## -*- coding: utf-8 -*-
#

import cgi
import sqlite3
import json

conn = sqlite3.connect('sqlite/hemap_gexp_sum.db')
c = conn.cursor()
#_gene = "IRX5"
qform = cgi.FieldStorage()
_gene = qform.getvalue('_gene')

c.execute("SELECT min, lower_quantile, median, upper_quantile, max, mean from GEXP2_SUMMARY where gene = '" + _gene + "'")
row = c.fetchone()
c.close()
conn.close()
pa = {}
pa["min"] = row[0]
pa["lower_quantile"] = row[1]
pa["median"] = row[2]
pa["upper_quantile"] = row[3]
pa["max"] = row[4]
pa["mean"] = row[5]
print "Content-type: text/html;charset=utf-8\r\n"
print json.dumps(pa)


