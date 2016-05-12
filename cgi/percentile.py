import math
import functools

def loaddict(filepath):
    f = open(filepath, 'r')
    s = eval(f.read())
    f.close()
    return s

def percentile(N, percent, key=lambda x:x):
    """
    Find the percentile of a list of values.

    @parameter N - is a list of values. Note N MUST BE already sorted.
    @parameter percent - a float value from 0.0 to 1.0.
    @parameter key - optional key function to compute value from each element of N.

    @return - the percentile of the values
    """
    if not N:
        return None
    k = (len(N)-1) * percent
    f = math.floor(k)
    c = math.ceil(k)
    if f == c:
        return key(N[int(k)])
    d0 = key(N[int(f)]) * (c-k)
    d1 = key(N[int(c)]) * (k-f)
    return d0+d1

# median is 50th percentile.

median = functools.partial(percentile, percent=0.5)
a = [1,2,3,4,7.9,10]
if __name__ == "__main__":
    #main()
    #print(percentile(a,.7))
    print "var pathways = \n"
    print loaddict("./_aml_session_pw.dict").keys()#['HOMOVANILLIC_ACID_CTD_00006103_DSigDB']
    print ";"
