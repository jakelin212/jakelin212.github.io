#!/usr/bin/python
## -*- coding: utf-8 -*-
#

import cgi
import sqlite3
import time

conn = sqlite3.connect('sqlite/hemap_gexp_sum.db')
c = conn.cursor()
qform = cgi.FieldStorage()
gene = "IRX3"#
gene = qform.getvalue('ingene')


c.execute("SELECT min, lower_quantile, median, upper_quantile, max, mean from GEXP2_SUMMARY where gene = '" + gene + "'")
row = c.fetchone()
c.close()
conn.close()
pa = {}
min = str(row[0])
fq = str(row[1])
med = str(row[2])
mean = str(row[5])
tq = str(row[3])
max = str(row[4])

header = "#min:" + min +" 1stQuant:" + fq + " median:" + med + " mean:" + mean + " 3rdQuant:" + tq + " max:" + max   

conn = sqlite3.connect('sqlite/hemap_gexp_raw.db')
c = conn.cursor()
conn.text_factory = str
select = "select gsm, gexp_log2 from _GEXP2_" + gene + " order by gexp_log2 asc"
c.execute(select)
rows = c.fetchall()

c.close()
conn.close()
fileName = gene + "_gsmraws.csv"

gsmraws = ""
for r in rows:
	gsmraws = gsmraws + r[0] + "," + str(r[1]) + "\n"
#print "Content-type: text/html;charset=utf-8\r\n"
print "Content-Type: text/plain"
#print "Content-Type: application/octet-stream"
print "Content-Disposition: attachment; filename=" + fileName
print
print header + "\n" + gsmraws

#print ("end " + time.strftime("%H:%M:%S"))

