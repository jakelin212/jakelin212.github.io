#!/usr/bin/python
## -*- coding: utf-8 -*-
#
import json
import cgi
import sqlite3

conn = sqlite3.connect('sqlite/hemap_tcga.db')
conn.text_factory = str
c = conn.cursor()
c.execute('select pt, gsm, cluster from tcga_gsm_cluster')
rows = c.fetchall()
pa = {}
print "Content-type: text/html;charset=utf-8\r\n"
pa['barcodes'] = {}
pa['pts'] = []
pa["samples"] = {}
pa["scluster"] = {}
pa["annocluster"] = {}

annoclass = {'TCGA-AB-2986-03': 'NPM1', 'TCGA-AB-2866-03': 'Not_mutated', 'TCGA-AB-2820-03': 'TP53', 'TCGA-AB-2984-03': 'NPM1', 'TCGA-AB-3008-03': 'CEBPA', 'TCGA-AB-2863-03': 'CEBPA', 'TCGA-AB-2920-03': 'Not_mutated', 'TCGA-AB-2914-03': 'CBFB-MYH11', 'TCGA-AB-2844-03': 'MLL_translocation', 'TCGA-AB-2924-03': 'NPM1', 'TCGA-AB-2970-03': 'RUNX1', 'TCGA-AB-2823-03': 'PML-RARA', 'TCGA-AB-2950-03': 'RUNX1-RUNX1T1', 'TCGA-AB-2977-03': 'Not_mutated', 'TCGA-AB-2978-03': 'RUNX1', 'TCGA-AB-2930-03': 'Not_mutated', 'TCGA-AB-2897-03': 'PML-RARA', 'TCGA-AB-2867-03': 'Not_mutated', 'TCGA-AB-3012-03': 'PML-RARA', 'TCGA-AB-2917-03': 'Not_mutated', 'TCGA-AB-2837-03': 'NPM1', 'TCGA-AB-2956-03': 'MLL_translocation', 'TCGA-AB-2826-03': 'NPM1', 'TCGA-AB-2846-03': 'CBFB-MYH11', 'TCGA-AB-3006-03': 'Not_mutated', 'TCGA-AB-2990-03': 'NPM1', 'TCGA-AB-2985-03': 'MLL_translocation', 'TCGA-AB-2862-03': 'PML-RARA', 'TCGA-AB-2836-03': 'NPM1', 'TCGA-AB-3011-03': 'NPM1', 'TCGA-AB-2987-03': 'NPM1', 'TCGA-AB-2991-03': 'PML-RARA', 'TCGA-AB-2913-03': 'NPM1', 'TCGA-AB-2865-03': 'RUNX1', 'TCGA-AB-2822-03': 'Not_mutated', 'TCGA-AB-2855-03': 'Not_mutated', 'TCGA-AB-2856-03': 'Not_mutated', 'TCGA-AB-2959-03': 'RUNX1', 'TCGA-AB-2928-03': 'Not_mutated', 'TCGA-AB-2916-03': 'Not_mutated', 'TCGA-AB-2969-03': 'NPM1', 'TCGA-AB-2838-03': 'TP53', 'TCGA-AB-2918-03': 'Not_mutated', 'TCGA-AB-3007-03': 'PML-RARA', 'TCGA-AB-2825-03': 'NPM1', 'TCGA-AB-2899-03': 'RUNX1', 'TCGA-AB-2954-03': 'CBFB-MYH11', 'TCGA-AB-2932-03': 'NPM1', 'TCGA-AB-2821-03': 'RUNX1', 'TCGA-AB-2861-03': 'NPM1', 'TCGA-AB-3005-03': 'MLL_translocation', 'TCGA-AB-2887-03': 'Not_mutated', 'TCGA-AB-2853-03': 'NPM1', 'TCGA-AB-2805-03': 'RUNX1', 'TCGA-AB-2877-03': 'NPM1', 'TCGA-AB-2854-03': 'Not_mutated', 'TCGA-AB-2955-03': 'CEBPA', 'TCGA-AB-2912-03': 'RUNX1', 'TCGA-AB-2948-03': 'Not_mutated', 'TCGA-AB-2965-03': 'NPM1', 'TCGA-AB-2966-03': 'Not_mutated', 'TCGA-AB-2879-03': 'NPM1', 'TCGA-AB-2983-03': 'RUNX1', 'TCGA-AB-2995-03': 'Not_mutated', 'TCGA-AB-2931-03': 'NPM1', 'TCGA-AB-2871-03': 'NPM1', 'TCGA-AB-2994-03': 'PML-RARA', 'TCGA-AB-2936-03': 'RUNX1', 'TCGA-AB-2874-03': 'CEBPA', 'TCGA-AB-2915-03': 'NPM1', 'TCGA-AB-2857-03': 'TP53', 'TCGA-AB-2980-03': 'PML-RARA', 'TCGA-AB-2858-03': 'RUNX1-RUNX1T1', 'TCGA-AB-2834-03': 'MLL_translocation', 'TCGA-AB-2898-03': 'Not_mutated', 'TCGA-AB-2963-03': 'NPM1', 'TCGA-AB-2935-03': 'TP53', 'TCGA-AB-2964-03': 'Not_mutated', 'TCGA-AB-2993-03': 'NPM1', 'TCGA-AB-2833-03': 'Not_mutated', 'TCGA-AB-2982-03': 'PML-RARA', 'TCGA-AB-2939-03': 'Not_mutated', 'TCGA-AB-2949-03': 'RUNX1', 'TCGA-AB-2870-03': 'CBFB-MYH11', 'TCGA-AB-3001-03': 'PML-RARA', 'TCGA-AB-2908-03': 'TP53', 'TCGA-AB-2842-03': 'MLL_translocation', 'TCGA-AB-2941-03': 'TP53', 'TCGA-AB-2882-03': 'Not_mutated', 'TCGA-AB-2839-03': 'CEBPA_NPM1', 'TCGA-AB-2881-03': 'CBFB-MYH11', 'TCGA-AB-2944-03': 'Not_mutated', 'TCGA-AB-2803-03': 'PML-RARA', 'TCGA-AB-2875-03': 'RUNX1-RUNX1T1', 'TCGA-AB-2873-03': 'Not_mutated', 'TCGA-AB-2843-03': 'Not_mutated', 'TCGA-AB-2811-03': 'NPM1', 'TCGA-AB-2808-03': 'CEBPA', 'TCGA-AB-3002-03': 'Not_mutated', 'TCGA-AB-2807-03': 'RUNX1', 'TCGA-AB-2904-03': 'TP53', 'TCGA-AB-2981-03': 'NPM1', 'TCGA-AB-2835-03': 'NPM1', 'TCGA-AB-2832-03': 'MLL_translocation', 'TCGA-AB-2910-03': 'Not_mutated', 'TCGA-AB-2872-03': 'PML-RARA', 'TCGA-AB-2934-03': 'Not_mutated', 'TCGA-AB-2885-03': 'TP53', 'TCGA-AB-2903-03': 'NPM1', 'TCGA-AB-3000-03': 'CEBPA', 'TCGA-AB-2900-03': 'CEBPA_NPM1', 'TCGA-AB-2992-03': 'NPM1', 'TCGA-AB-2940-03': 'CEBPA', 'TCGA-AB-2812-03': 'NPM1', 'TCGA-AB-2806-03': 'RUNX1-RUNX1T1', 'TCGA-AB-2909-03': 'Not_mutated', 'TCGA-AB-2815-03': 'Not_mutated', 'TCGA-AB-2895-03': 'NPM1', 'TCGA-AB-2933-03': 'RUNX1', 'TCGA-AB-2911-03': 'MLL_translocation', 'TCGA-AB-2943-03': 'TP53', 'TCGA-AB-2973-03': 'NPM1', 'TCGA-AB-2921-03': 'Not_mutated', 'TCGA-AB-2938-03': 'TP53', 'TCGA-AB-2937-03': 'RUNX1-RUNX1T1', 'TCGA-AB-2816-03': 'NPM1', 'TCGA-AB-2886-03': 'RUNX1-RUNX1T1', 'TCGA-AB-2942-03': 'CBFB-MYH11', 'TCGA-AB-2819-03': 'RUNX1-RUNX1T1', 'TCGA-AB-2884-03': 'NPM1', 'TCGA-AB-2869-03': 'NPM1', 'TCGA-AB-2828-03': 'CBFB-MYH11', 'TCGA-AB-2868-03': 'TP53', 'TCGA-AB-2813-03': 'TP53', 'TCGA-AB-2925-03': 'NPM1', 'TCGA-AB-2889-03': 'CBFB-MYH11', 'TCGA-AB-2972-03': 'NPM1', 'TCGA-AB-2952-03': 'CEBPA_TP53', 'TCGA-AB-2988-03': 'NPM1', 'TCGA-AB-2998-03': 'PML-RARA', 'TCGA-AB-2901-03': 'Not_mutated', 'TCGA-AB-2841-03': 'PML-RARA', 'TCGA-AB-2946-03': 'Not_mutated', 'TCGA-AB-2849-03': 'Not_mutated', 'TCGA-AB-2818-03': 'NPM1', 'TCGA-AB-2996-03': 'Not_mutated', 'TCGA-AB-2859-03': 'NPM1', 'TCGA-AB-2999-03': 'PML-RARA', 'TCGA-AB-2817-03': 'Not_mutated', 'TCGA-AB-2929-03': 'Not_mutated', 'TCGA-AB-2845-03': 'CEBPA', 'TCGA-AB-2848-03': 'NPM1', 'TCGA-AB-2890-03': 'RUNX1', 'TCGA-AB-2851-03': 'Not_mutated', 'TCGA-AB-2891-03': 'Not_mutated', 'TCGA-AB-3009-03': 'RUNX1', 'TCGA-AB-2810-03': 'NPM1', 'TCGA-AB-2888-03': 'CBFB-MYH11', 'TCGA-AB-2919-03': 'NPM1', 'TCGA-AB-2830-03': 'Not_mutated', 'TCGA-AB-2824-03': 'NPM1', 'TCGA-AB-2814-03': 'Not_mutated', 'TCGA-AB-2971-03': 'Not_mutated', 'TCGA-AB-2840-03': 'PML-RARA', 'TCGA-AB-2979-03': 'CEBPA', 'TCGA-AB-2860-03': 'TP53', 'TCGA-AB-2847-03': 'Not_mutated', 'TCGA-AB-2880-03': 'CEBPA', 'TCGA-AB-2927-03': 'RUNX1', 'TCGA-AB-2896-03': 'NPM1', 'TCGA-AB-2976-03': 'NPM1', 'TCGA-AB-2975-03': 'Not_mutated', 'TCGA-AB-2967-03': 'NPM1'}

for row in rows:
        pi = []
	pt = row[0]
	x = float(pt.split(",")[0])
	y = float(pt.split(",")[1])
	#x = round(float(x[0:5]))
	#y = round(float(y[0:5]))
        pi.append(x)
	pi.append(y)
        pa['pts'].append(pi)
	pa['samples'][row[1]] = pt
	pa['barcodes'][pt] = row[1]
	pa['scluster'][pt] = row[2]
	gsm = row[1].replace(".", "-")
        pa['annocluster'][pt] = annoclass[gsm]
print json.dumps(pa)
c.close()
conn.close()