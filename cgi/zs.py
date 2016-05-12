import numpy
import scipy

def zs(inlist):
    mmean = (sum(inlist)/len(inlist)*1.0)
    msigma = numpy.std(inlist)
    #print msigma, mmean
    outlist= [(e1-mmean)/msigma for e1 in inlist]
    return (mmean, msigma, outlist)


if __name__ == "__main__":
	zmetric = zs([.5,1,2,3,4,5,.4])
	#print zmetric[0], 'mean'
