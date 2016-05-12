#!/usr/bin/python
## -*- coding: utf-8 -*-
#

import sqlite3
import cgi
import json

conn1 = sqlite3.connect('sqlite/hemap_pw_member.db')
conn1.text_factory = str
ccur = conn1.cursor()
qform = cgi.FieldStorage()
feature = qform.getvalue('infeature')
#feature = "ANISOMYCIN_PC3_UP-DSigDB_D3"

ccur.execute("select featurea text, source text, membership from [_pwmember] where featurea ='%s'" % feature)
row = ccur.fetchone()

pa = {}
pa["refsource"] = row[1]
pa["members"] = row[2]

conn1.commit()
ccur.close()
print "Content-type: text/html;charset=utf-8\r\n"
print json.dumps(pa)

