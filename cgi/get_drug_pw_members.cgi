#!/usr/bin/python
## -*- coding: utf-8 -*-
#

import sqlite3
import json
import cgi
import sys

qform = cgi.FieldStorage()
name = qform.getvalue('inpw')
conn0 = sqlite3.connect('sqlite/hemap_pw_member.db')
c0 = conn0.cursor()
pa = {}
try:
        c0.execute("select refsource, members from _GSVA_members where name = '%s'" %name)
except:
        print "Content-type: text/html;charset=utf-8\r\n"
        pa["notexists"] = name
        print json.dumps(pa)
        sys.exit()

row = c0.fetchone()
pa[name] = [row[0], row[1]]

c0.close()
conn0.close()
print "Content-type: text/html;charset=utf-8\r\n"
print json.dumps(pa)

