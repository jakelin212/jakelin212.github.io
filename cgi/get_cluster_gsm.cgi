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
inparam = qform.getvalue('inparameter')
#inparam = '33'

select = "select gsm from hema_annotationf where cluster = '" + inparam + "'"
c.execute(select)
rows = c.fetchall()

print "Content-type: text/html;charset=utf-8\r\n"
pa = {}
pa['gsms'+inparam] = None
pi = []
for row in rows:
    pi.append(row[0])	
pa['gsms'+inparam] = " ".join(pi)
pa['gcount'] = len(pi)
c.close()
conn.close()
print json.dumps(pa)
