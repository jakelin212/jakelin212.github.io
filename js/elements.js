var sessionsource = "hemaall";
var sessionstains = [];

var clusters = ["1", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "2", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "3", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "4", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "5", "50", "51", "52", "53", "54", "55", "6", "7", "8", "9"];
var tumortypes = ["B-Lymphoid", "Erythroid", "Leukemia", "Lymphoid", "Lymphoma", "Lymphoproliferative", "Myeloid", "Myeloma", "Myeloproliferative", "NonCancerImmortalized", "StemCell", "T-Lymphoid", "mix", "na"]
var lineagetypes = ["ALL", "ALPS", "AML", "AlveolarMacrophage", "BCL", "BcellActivated", "CD16+Monocyte", "CD19-", "CD21lowBcell", "CD3+Tcell", "CD3+TcellActivated", "CD30+CD4+Tcell", "CD4+Tcell", "CD4+TcellActivated", "CD8+Tcell", "CD8+TcellActivated", "CLL", "CML", "CentralMemoryCD4+Tcell", "Dendritic-DifferentiatingMonocyte", "DendriticCell", "DendriticCellActivated", "EffectorMemoryCD4+Tcell", "Erythroblast", "Erythrocyte", "ErythroidProgenitor", "ErythroidProgenitorDifferentiated", "Gamma-delta-Tcell", "GerminCentre", "GerminalCentreCentroblast", "GerminalCentreCentrocyte", "HematopoieticStemCell", "LCH", "LangerhansCell", "LymphNode", "M1-DifferentiatingMonocyte", "M1-Macrophage", "M2-Macrophage", "M2-MacrophageActivated", "MDS", "MM", "MPN", "MemoryBcell", "Monocyte", "Mononuclear", "MyeloidProgenitor1", "MyeloidProgenitor2", "NKCL", "NKTCL", "NaiveBcell", "NaturalKillerCell", "NaturalKillerTcell", "Neutrophil", "PlasmaBcell", "PlasmacytoidDendriticCellActivated", "Platelet", "RegulatoryTcell", "RestingBcell", "RestingCD4+Tcell", "RestingCD8+Tcell", "TCL", "Tcell", "TcellActivated", "TcellActivatedMononuclear", "TcellResting", "mix", "na"];
var subtypes = ["AILT", "ALCL", "ANKCL", "ATL", "B-CLL", "BL", "CHL", "CML", "CTCL", "CTCL-MF", "CTCL-SS", "DLBCL", "DLBCL-ABC", "DLBCL-GCB", "DLBCL-PMBL", "ENKTL", "FL", "HCL", "HSTCL", "JMML", "LC", "M0", "M1", "M2", "M3", "M4", "M4eo", "M5", "M5a", "M6", "M7", "MALT", "MCL", "MLD", "MM", "MZL", "NLPHL", "PEL", "PTCLNOS", "RA", "RAEB", "RAEB-t", "RAEB2", "RARS", "T-ALL", "T-CLL", "T-HES", "TransientLeukemia", "eosinophilic", "mix", "na", "pre-B-ALL"];
var cytogenetics = [" +13 -21", " +13,i(17)(q10)", " +8 -17", " -7", " -7,del20(q1)", " -7,t(9;11)", " -Y", " -Y,t(8;21),del(9)", " t(11;14)(q13;q32)", "+ 21(q22) del(7)(p11.2)", "+12", "+13", "+14", "+21", "+8", "+9", "-5/7(q)", "-7", "-7(q)", "-9  add(9)(p22)  +mar", "-9q", "-X", "-Xt(5;21)(q31;q22) t(1;6)(q21;p23)", "1-50dmin,der(6)", "11q22.3;", "11q22.3; complex karyotype", "17p13; complex karyotype", "46,XX,del(6)(q13q23)[16]", "47,XY,+19[22]", "9qh+", ">3", "ALK-negative", "ALK-positive", "CN-AML", "HOX11", "HOX11L2", "HOXA", "LMO2", "MDS -Y", "MLL", "MLL, pseudoploid", "MLL-AF1", "MLL-AF4", "MLL-AF9", "MLL-ENL", "MLL-germline", "MLL-rearrangement", "NN", "NNN", "Normal", "TAL", "TAL1", "TEL deleted", "abn(3q)", "add(7)(p22)", "add(9)(p22)", "aneuploid", "complex aberrant karyotype", "complex karyotype", "crlf2 fish: Deletion", "crlf2 fish: Deletion;", "crlf2 fish: IGH@-CRLF2", "crlf2 fish: Normal;", "crlf2 fish: n/a", "del(11)(p12)", "del(11q)", "del(11q), del(13q)", "del(11q), del(17p)", "del(12)(p12.3p13.3)", "del(13q)", "del(13q), complex karyotype", "del(13q), del(17p)", "del(16)", "del(16)(q22), +21", "del(17p)", "del(5)(q22q33)", "del(5)(q22q33); t(10;11)(p13~p15;q22~q23) i(17)(q10)", "del(5q)", "del(5q) plus other", "del(5q), plus other", "del(6q)", "del(7)(p13p15)", "del(7)(q(11.2)", "del(7)(q21q36)", "del(7)(q22) trisomy 8  t(15;17)(q22;q21)", "del(9)", "del(9)(q21q33); del(20)(q12)", "del(9q)", "del(9q);", "del13q", "deletion 17p13: negative;deletion 11q22-q23: negative", "deletion 17p13: negative;deletion 11q22-q23: positive", "deletion 17p13: positive;deletion 11q22-q23: negative", "deletion 17p13: positive;deletion 11q22-q23: positive", "der(7)t(7;8)(p15;q13)t(8;21)(q22;q22)", "diploid", "hexaploid", "hyperdiploid", "hyperdiploid karyotype", "hypodiploid", "i(17)(q10),del(20)", "i(17), +13", "idic(21)(q10),add(21)", "idic(Y)q(12)", "idt(16)", "insertional activation of LMO2", "inv(16)", "inv(16)(p13q22)", "inv(16)(p13q22) + 22", "inv(16)(p13q22) +22", "inv(16)(p13q22) +Y", "inv(16)(p13q22) add(20)(q13.3)", "inv(16)(p13q22) t(2;4)(q34;q21)", "inv16, t(16;16)", "iso(11)(q10)", "monosomy7/del(7q)", "na", "no del13q", "normal", "normal karyotype", "normal karyotype or other abnormalities", "normal karyotype, other abnormalities", "other", "other chromosomal aberrations", "pseudoploid", "remaining cytogenetics", "t(11;14)(q13;q32)", "t(11;18)/API2-MALT1", "t(11;18)/API2-MALT1 negative", "t(11;19)(q(13;p13)", "t(11;19)(q23;p13); +X", "t(11;19)(q23;p13); del(20q)", "t(11;19)(q23;p13.1)", "t(11;19)(q23;p13.1); inv(12)(p12p13)", "t(12;21)", "t(14;18)(q32;q21)", "t(14;18)/IGH-MALT1", "t(15;17)", "t(15;17)(q22;q21)", "t(15;17)(q22;q21) + 8", "t(15;17)(q22;q21) inv(12)(p12p13)", "t(15;17)(q22;q21) trisomy 8", "t(15;17), t(16;19)", "t(16;16)(p13;q22) +22", "t(1;19)", "t(3;3)(q21;q26); +6", "t(4;12)(q12;p13),-21,+2r(21)", "t(6;11)", "t(6;9)", "t(6;9)(p23;q34)", "t(7;12)", "t(8;10;21)(q22;q26;q22) -Y", "t(8;14)(q24;11)", "t(8;14)(q24;q32)", "t(8;21)", "t(8;21)(q22;q22)", "t(8;21)(q22;q22) -Y", "t(8;21)(q22;q22) del(9)(q12q22)", "t(8;21)(q22;q22) del(9)(q21q31)", "t(8;21)(q22;q22) del(9)(q22q34)", "t(9;11)", "t(9;11)(p22;q23)", "t(9;22)", "t(9;22)(q34;q11.2)-7", "t(9;22), hyperdiploid karyotype", "t(9;22), pseudoploid", "trisomy 10; del(9)(q13q22)", "trisomy 11", "trisomy 13; iso(7)(p10)", "trisomy 21", "trisomy 21  trisomy 3", "trisomy 21; + 22", "trisomy 4 and 10", "trisomy 8", "trisomy Y", "trisomy12", "trisomy8", "unknown", "unknown cytogenetics", "without t(9;22)", "without t(9;22),without MLL", "without t(9;22),without MLL,TEL del"];
var tumor_types = ["?", "CCR", "IM b / pre ab", "IM g / IM b", "NEEDS CHECK", "NN", "RER", "RER, CCR", "RER, relapse", "Relapse", "SER", "SER, CCR", "SER, relapse", "TCRab", "TCRgd", "before treatment", "cell line", "check", "moved to normalCells", "na", "npm1: mutated", "primary", "progressive", "relapse", "second sample;no treatment", "stable", "tocheck", "treated", "untreated"];
var sample_types = ["Cancer", "CellLine", "NonCancerAML-M1", "NonCancerAML-M4", "NonCancerAnkylosingSpondylitis", "NonCancerAsthma", "NonCancerCLL", "NonCancerCOPD", "NonCancerCTCL", "NonCancerClinicallyIsolatedSyndrome", "NonCancerCommonVariableImmunodeficiency", "NonCancerDLBCL", "NonCancerEpilepsy", "NonCancerFamilialHypercholesterolemia", "NonCancerFollicularLymphoma", "NonCancerGraftVsHostDisease", "NonCancerHealthy", "NonCancerInflammation", "NonCancerJuvenileDermatomyositis", "NonCancerJuvenileIdiopathicArthritis", "NonCancerLCH", "NonCancerMALT", "NonCancerMDS", "NonCancerMGUS", "NonCancerMM", "NonCancerSLE", "NonCancerSickleCellDisease", "NonCancerT-largeGranularLymphocyteLymphocytosis", "NonCancerTransformedAML-M2-like", "NonCancerTransformedAML-M4eo-like", "NonCancerTransformedAML-M5-like", "NonCancerTransformedCML-like", "NonCancerTransformedMPS-like", "NonCancerTreatments", "NonCancerType1Diabetes", "NonCancerWM", "Prolif"];
var submaps = ["CELL_LINE", "LEUKEMIA", "LYMPHOMA", "MYELOMA", "NORMAL_CELL", "NORMAL_CTRL"];
var sample_sources = ["airway", "blood", "blood or bone marrow", "blood or tonsils", "bone marrow", "bowel", "brain", "breast dermal mass", "chest wall mass", "colon", "ear nose or throat", "gastric or lymph node", "gastrointestine", "hESC", "hilum", "ileum", "jejunum", "lesion", "lung", "lymph node", "mediastinum/atrium", "na", "neck", "ovary", "pleural fluid", "pulmonary mucosa-associated lymphoid tissue (MALT)", "skin", "small intestine", "spinal fluid", "spleen", "testis", "thyroid", "tissue biopsy", "toncils", "tonsils", "umbilical cord blood"];
var alterations = [" IgVH-mutated;ZAP70 negative;CD38 negative", " IgVH-mutated;ZAP70 negative;CD38 positive", " IgVH-na;ZAP70 positive;CD38 negative", " IgVH-unmutated;ZAP70 negative;CD38 negative", " IgVH-unmutated;ZAP70 positive;CD38 positive", " flt3 itd positive", "ALK-negative", "ALK-positive", "CARD11_mut", "CEBPA double mutant", "CEBPA silenced;idh1: neg;idh2: neg;score: FAB M0;risk: cytogenetic poor;cebpa: wild type;karyotype: ;npm1: Neg;flt3 itd mutation: Neg;flt3 tkd mutation: Neg;n-ras mutation: Neg;k-ras mutation: Neg;evi1 expression: Neg;cebpa mutation: Neg", "CEBPA silenced;idh1: neg;idh2: pos;score: FAB M1;risk: cytogenetic intermediate;cebpa: double mutant;karyotype: NN;npm1: Neg;flt3 itd mutation: Neg;flt3 tkd mutation: Neg;n-ras mutation: Neg;k-ras mutation: Neg;evi1 expression: Neg;cebpa mutation: Pos", "CEBPA single mutant", "CEBPA wild type", "FAS_mut", "IGVH_hypermutated", "IGVH_mutated", "IGVH_unmutated", "IgVH-mutated; ZAP70 +; LPL +; CD38 +", "IgVH-mutated; ZAP70 +; LPL -; CD38 -", "IgVH-mutated; ZAP70 -; LPL + ; CD38 +", "IgVH-mutated; ZAP70 -; LPL + ; CD38 -", "IgVH-mutated; ZAP70 -; LPL - ; CD38 +", "IgVH-mutated; ZAP70 -; LPL - ; CD38 -", "IgVH-mutated;ZAP70 negative", "IgVH-mutated;ZAP70 negative;LPL negative;CD38 negative", "IgVH-mutated;ZAP70 negative;LPL negative;CD38 positive", "IgVH-mutated;ZAP70 negative;LPL positive;CD38 positive", "IgVH-mutated;ZAP70 positive", "IgVH-mutated;ZAP70 positive;LPL negative;CD38 positive", "IgVH-unmutated; ZAP70 +; LPL +; CD38 +", "IgVH-unmutated; ZAP70 +; LPL +; CD38 -", "IgVH-unmutated; ZAP70 +; LPL - ; CD38 +", "IgVH-unmutated; ZAP70 -; LPL - ; CD38 +", "IgVH-unmutated;ZAP70 na;CD38 positive", "IgVH-unmutated;ZAP70 negative;CD38 negative", "IgVH-unmutated;ZAP70 positive", "IgVH-unmutated;ZAP70 positive;CD38 negative", "IgVH-unmutated;ZAP70 positive;LPL negative;CD38 positive", "IgVH-unmutated;ZAP70 positive;LPL positive;CD38 positive", "NRAS_mut", "RANK_mut", "TNFAIP3_mut", "TNFAIP3_mut, RANK_mut", "TNFAIP3_mut;TAK1_mut", "TRAF2_mut", "TRAF2_mut, RANK_mut", "TRAF5_mut", "ZAP70 negative", "ZAP70 positive", "cebpa mutated", "conclusions ig/tcr: N/A;", "conclusions ig/tcr: some clonal evolution;", "conclusions ig/tcr: stable;", "conclusions ig/tcr: unstable;", "dnmt3a: F909C;flt3 itd: positive;npm1: mutated", "dnmt3a: R882C;flt3 itd: positive;npm1: mutated", "dnmt3a: R882H;flt3 itd: positive;npm1: mutated", "dnmt3a: mutated", "dnmt3a: mutated;flt3 itd: 0;npm1: mutated", "dnmt3a: mutated;flt3 itd: positive;npm1: mutated", "dnmt3a: mutated;flt3 mutated;idh1: mutated;npm1: mutated", "dnmt3a: mutated;flt3 mutated;npm1: mutated", "dnmt3a: mutated;idh1: mutated", "dnmt3a: mutated;idh1: mutated;npm1: mutated", "dnmt3a: mutated;idh2: mutated", "dnmt3a: mutated;npm1: 0", "dnmt3a: mutated;npm1: mutated", "dnmt3a: positive", "dnmt3a_R882: mutated", "dnmt3a_R882: negative", "etv6 mutated", "flt3 d835: 0;flt3 itd: 0;nmp1 ins: 0", "flt3 d835: 0;flt3 itd: 0;npm1 ins: 0", "flt3 d835: 0;flt3 itd: 0;npm1 ins: 1", "flt3 d835: 0;flt3 itd: 1;npm1 ins: 0", "flt3 d835: 0;flt3 itd: 1;npm1 ins: 1", "flt3 d835: 1;flt3 itd: 0;npm1 ins: 0", "flt3 d835: 1;flt3 itd: 0;npm1 ins: 1", "flt3 d835: 1;flt3 itd: 1;npm1 ins: 0", "flt3 itd positive", "flt3 itd: 0;idh1: 0;idh2: 0", "flt3 itd: positive", "flt3 itd: positive;idh2: mutated;npm1: mutated", "flt3 itd: positive;npm1: mutated", "flt3 mutated", "flt3 mutated;idh1: mutated", "flt3 mutated;npm1: mutated", "flt3-itd: FLT3-ITD;c-kit: negative;n/k-ras: N/K-RAS;ptpn11: negative;npm1: negative;cebpa: negative;mll-ptd: negative", "flt3-itd: FLT3-ITD;c-kit: negative;n/k-ras: negative;ptpn11: negative;npm1: NPM1;cebpa: negative;mll-ptd: negative", "flt3-itd: FLT3-ITD;c-kit: negative;n/k-ras: negative;ptpn11: negative;npm1: negative;cebpa: CEBPA;mll-ptd: negative", "flt3-itd: FLT3-ITD;c-kit: negative;n/k-ras: negative;ptpn11: negative;npm1: negative;cebpa: negative;mll-ptd: MLL-PTD", "flt3-itd: FLT3-ITD;c-kit: negative;n/k-ras: negative;ptpn11: negative;npm1: negative;cebpa: negative;mll-ptd: negative", "flt3-itd: negative;c-kit: C-KIT;n/k-ras: negative;ptpn11: negative;npm1: negative;cebpa: negative;mll-ptd: negative", "flt3-itd: negative;c-kit: negative;n/k-ras: N/K-RAS;ptpn11: negative;npm1: NPM1;cebpa: negative;mll-ptd: negative", "flt3-itd: negative;c-kit: negative;n/k-ras: N/K-RAS;ptpn11: negative;npm1: negative;cebpa: CEBPA;mll-ptd: negative", "flt3-itd: negative;c-kit: negative;n/k-ras: N/K-RAS;ptpn11: negative;npm1: negative;cebpa: negative;mll-ptd: MLL-PTD", "flt3-itd: negative;c-kit: negative;n/k-ras: N/K-RAS;ptpn11: negative;npm1: negative;cebpa: negative;mll-ptd: negative", "flt3-itd: negative;c-kit: negative;n/k-ras: negative;ptpn11: PTPN11;npm1: negative;cebpa: negative;mll-ptd: negative", "flt3-itd: negative;c-kit: negative;n/k-ras: negative;ptpn11: negative;npm1: NPM1;cebpa: negative;mll-ptd: negative", "flt3-itd: negative;c-kit: negative;n/k-ras: negative;ptpn11: negative;npm1: negative;cebpa: CEBPA;mll-ptd: negative", "flt3-itd: negative;c-kit: negative;n/k-ras: negative;ptpn11: negative;npm1: negative;cebpa: negative;mll-ptd: MLL-PTD", "flt3-itd: negative;c-kit: negative;n/k-ras: negative;ptpn11: negative;npm1: negative;cebpa: negative;mll-ptd: negative", "idh1: mutated", "idh1: mutated;npm1: mutated", "idh2: mutated", "idh2: mutated;npm1: mutated", "jak1 R724H", "jak1 S512L", "jak1 wt", "jak_L681-I682ins;crlf2_wt", "jak_R683Gmut;crlf2_wt", "jak_R683K;crlf2_wt", "jak_R683Smut;crlf2_wt", "jak_wt;crlf2_F232Cmut_V244Mmut", "jak_wt;crlf2_V244Mmut", "jak_wt;crlf2_wt", "jak_wt;na", "na", "na;ZAP70 negative", "na;crlf2_wt", "npm1 mutation: mutated; flt3-itd mutation: mutated", "npm1 mutation: mutated; flt3-itd mutation: wild type", "npm1 mutation: mutated;flt3-itd mutation: negative", "npm1: 0", "npm1: mutated", "npm1: negative", "npm1: negative;flt3-itd: negative;cebpa: n./a.", "npm1: negative;flt3-itd: negative;cebpa: negative", "npm1: negative;flt3-itd: negative;cebpa: positive", "npm1: negative;flt3-itd: positive;cebpa: n./a.", "npm1: negative;flt3-itd: positive;cebpa: negative", "npm1: negative;flt3-itd: positive;cebpa: positive", "npm1: positive", "npm1: positive;flt3-itd: negative;cebpa: n./a.", "npm1: positive;flt3-itd: negative;cebpa: negative", "npm1: positive;flt3-itd: negative;cebpa: positive", "npm1: positive;flt3-itd: positive;cebpa: n./a.", "npm1: positive;flt3-itd: positive;cebpa: negative", "runx1 deleted", "runx1 mutated"];
var sample_isolations = [" ", " CD303+CD304+CD123+CD4+CD45RA+CD141lowCD1c?CD2?CD3-CD14-CD16-CD19-CD20-CD56-CD13-CD33-CD16-CD64-Fc_RI-", "7 day differentiated from CD34+ cells", "AttachmentToThePlate", "B lymphocytes", "BlasticCells", "CD10+", "CD10+ leukocytes", "CD11b+", "CD138+ plasma cells", "CD14", "CD14+", "CD14+ Macs bead separated  monocytes", "CD14+ Macs bead separated monocytes", "CD14+ macs bead separated monocytes", "CD19+", "CD19+ cells", "CD19+ leukocytes", "CD19+CD10-IgM+CD27-", "CD19+CD27-CD38+CD21+", "CD19+CD27-CD38+CD21+ naive B cells", "CD19+CD38++IgD_", "CD19+CD38_IgD+", "CD19- cells", "CD19hiCD27-CD38lowCD21low B cells", "CD20+ CD27+CD3-CD11b-", "CD20++CD38+ CD77-", "CD20++CD38+CD77+", "CD207+CD3-", "CD20lowCD38++", "CD235a+CD45+CD11b+", "CD27+CD10-CD38-CD3-", "CD27-CD10-CD3-IgD+", "CD3+", "CD3+CD30+", "CD3+CD4+", "CD3+CD4+CD25+", "CD3+CD4+CD25++", "CD3+CD4+CD25-", "CD3+CD4-TCRVb+CD57+", "CD3+CD4-TCRVb+CD57-", "CD3+CD8+HLA-DR+", "CD3+CD8+HLA-DR-", "CD3+Valpha24JalphaQ+Vbeta11+", "CD3-CD4+", "CD34+", "CD34+ cells", "CD34+ mononuclear leukocytes", "CD34+CD38- cells", "CD4+", "CD4+ CD69+", "CD4+ CD69-", "CD4+ T lymphocytes", "CD4+CCR10+CLA+", "CD4+CCR10-CLA+", "CD4+CD25+", "CD4+CD25++", "CD4+CD25-", "CD4+CD25-CD38-CD69-HLA-DR-", "CD4+CD45RA+CCR7+", "CD4+CD45RO+CCR7+CD62L+", "CD4+CD45RO+CCR7_CD62L+/_", "CD4+CD69+", "CD56+CD16+CD3-", "CD56+CD3-", "CD7+ cells", "CD77+", "CD77-CD39-CD3-CD10+ ", "CD8+", "CD8+ T lymphocytes", "CD8+CCR7-NKp80+", "CD9-CD14-CD15++CD16++", "CD9-CD14-CD15++CD16low", "DensityGradient", "GradientCentrifugation", "GradientCentrifugationAndRedBloodCellLysis", "HLA-DR+", "HLA-DR-", "IgD+ CD27-CD11b-", "IgM+IgD+CD27+", "Lin-CD34+CD38-CD90+", "Lin-CD34+CD38-CD90- leukemic stem cells", "MACS separation", "NegativeMonocyteSelection", "NegativeMonocyteSelection and CD16+", "NegativeMonocyteSelection and CD16-", "Negative_B_cell_selection", "Negative_B_cell_selection and CD10+CD44lowCXCR4+", "Negative_B_cell_selection and CD10+CD44lowCXCR4-", "Negative_NK_cell_selection and CD3-CD56+", "Samples are from untreated patients.", "T lymphocytes", "TCRVgamma9+", "TCRVgamma9+ gamma delta T cells", "blast cells", "check", "hemolysis", "leukocytes", "microdissected", "microdissection", "monocyte derived DCs", "monocyte-derived", "mononuclear", "mononuclear cells", "mononuclear cells = mononuclear leukocytes", "mononuclear cells = mononuclear leukocytes and negative selection", "mononuclear cells and non-malignant cell depletion", "mononuclear leukocytes followed by non-malignant cell depletion", "na", "negative selection", "none"];
var survival_status = [" status (0=alive/1=dead): 0", " status (0=alive/1=dead): 1", "Clinical info: Follow up status: ALIVE;", "Clinical info: Follow up status: DEAD;", "Clinical info: Follow up status: NA;", "Relapse: Yes", "alive", "alive with disease", "alive without disease", "code_os: alive;", "code_os: dead;", "code_pfs: dead;", "dead", "death with disease", "died of squamous cell carcinoma of the larynx", "died of squamous cell carcinoma of the lung", "na", "os milestone outcome (24 months): 1= deceased by 24 months, 0= alive at 24 months: 0", "os milestone outcome (24 months): 1= deceased by 24 months, 0= alive at 24 months: 1", "vital status: Alive;", "vital status: Dead;"];

var symSize = 2;
var maxgsmsallowed = 500;
var legendenabled = true;
var showrownum = 15;
var pworder = "adj_pv";
var pwpwfdr = ".05";
var mpratio = "60:40";
var xlimit = 5000;
var hexpmapwidth = "60%";
var hexptblwidth = "40%";
var legendx = 0;
var legendy = 620;
var legendalign = 'right';
var lowoutlier = .2;
var highoutlier = .8;
var series = 1;
var resetHMap = false;
var smmode = "";
var annoval = "AML";
var lowcolor = "#0000CC";
var medcolor = "#C2C2C6";
var highcolor = "#FF0000";

var catcolors = {"AML":"#3cb371","CML":"#006400","MM":"#8b475d","MP":"#caff70","LP":"#cc8540","T-ALL":"#6495ed","TCL":"#27408b","pre-B-ALL":"#ed82ed","BCL":"#bb8e8e","CLL":"#a020f0","LP":"#658a8a","Erythroid":"#cc8540","B-Lymphoid":"#fe1392","T-Lymphoid":"#00fefe","Myeloid":"#658a8a","StemCell":"#feb90f","CellLine":"#00d9b3","No fusions":"#696969", "t8;21 RUNX1-RUNT1X1":"#00FFFF", "inv16 CBF-MYH":"#FF00FF","MLL fusions":"#FFC0CB","t15;17 PML-RARA":"#800080", "NA":"#a0a0a0", "NO":"#0000FF", "YES":"#FF0000", "Na":"#a0a0a0", "na":"#a0a0a0", "0":"#0000FF", "1":"#FF0000", "medium":"#a0a0a0", "low":"#0000FF", "high":"#FF0000"};

var catcolor_list = ["#3cb371","#006400","#8b475d","#caff70","#cc8540","#6495ed","#27408b","#ed82ed","#bb8e8e","#a020f0","#658a8a","#cc8540","#fe1392","#00fefe","#658a8a","#feb90f","#00d9b3","#696969","#00FFFF","#FF00FF","#FFC0CB","#800080"]; 
var annocol = "lineage_tumor_cat";
var gsms = {};
//var gsmsxy = {};
var tcgasamples = {};
var leukemia_cluster = [];
var all_cluster = [];
var firstbox = 0;
var session_gexp = {};
var tcga_annocolors = {'NPM1':'#0b0c0a',
'CEBPA':'#2b2e6e',
'CEBPA-NPM1':'#6e6b2b',
'CEBPA-TP53':'#6e492b',
'TP53':'#dc7278',
'RUNX1':'#cd92a8',
'PML-RARA':'#d1abe8',
'CBFB-MYH11':'#f45cf4',
'MLL_translocation':'#f5cfd6',
'RUNX1-RUNX1T1':'#5df4f4',
'Not_mutated':'#a0a0a0'};
var tcga_annoseries = {};
var tcga_tsne_mode = 0;
var gexp_init = "IRX3";
var currentchart = null;
var _stat_div = null;
var mgenes = [];
var gexp_sets = {};
var gsinc = 0;
var selected_cluster = null;
var sample_groups = [];
var sample_group_gsm = {};
var gene_sample_groups = {};
var session_genes = [];
session_genes.push(gexp_init);
var highgsm = {};
var annogsms = [];
var showcentroids = true;
//var all_clusters = null;
var previous_advance = "";
gexp_sets["global"] = {"count":10669,"min":2.4869667251033301, "lower_quantile":3.3068214321859499, "median":3.5938491843890499,"mean":4.2235312058312289, "upper_quantile":4.2338592458067703, "max":11.538000298166001};
