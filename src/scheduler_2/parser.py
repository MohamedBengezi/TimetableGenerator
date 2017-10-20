import json
from timetable import TimeTable as tb
from datetime import time

def printCourse(c, dat):
    i = 0
    for ty in t:
        only = True
        try:
            dat[c][ty]
            if (i > 0):
                print()
            for k,d in dat[c][ty].items():
                if (len(dat[c][ty]) == 1):
                    print(k + ' <' + '-'*60 + ' only one')
                else:
                    print(k)
                print(d)
            i += 1
        except KeyError:
            None

def findOnlyOnes(courses):
    onlyList = {}
    for course in courses:
        onlyOnce = []
        moreThanOnce = []
        count = 0 #number of sections with only one core
        countMoreThanOnce = 0
        for section, data in course[1].items():
            if (len(data) == 0):
                raise RuntimeError('empty section type' + section)
            if (len(data) == 1):
                for k in data.keys():
                    onlyOnce.append((section,k))
                count += 1
            else:
                lst = []
                for k in data.keys():
                    lst.append(k)
                    countMoreThanOnce += 1
                moreThanOnce.append((section, lst))
        onlyOnce.insert(0,count)
        moreThanOnce.insert(0, countMoreThanOnce)
        onlyList[course[0]] = (onlyOnce, moreThanOnce)
    return onlyList

def addToCourseList(ls, data, name, sectionType, section, movable):
    course = data[name]
    
    #multiday sections
    for day in course[sectionType][section]:
        data = {'name': name,
                'type': sectionType,
                'section': section,
                'start': day[1],
                'end': day[2],
                'movable': movable}
        ls[day[0]].append(data)
    
finalCourses = [[], [], [], [], []]
        
courses = ['SFWRENG 3BB4', 'SFWRENG 3RA3', 'SFWRENG 3DB3', 'SFWRENG 3MX3',
           'SFWRENG 3XA3', 'COMMERCE 1AA3']

allCourses = [('SFWRENG 3BB4', 'C'), ('SFWRENG 3RA3', 'C'),
              ('SFWRENG 3DB3', 'C'), ('SFWRENG 3MX3', 'C'),
              ('SFWRENG 3XA3', 'C'), ('SFWRENG 3BB4', 'T'),
              ('SFWRENG 3RA3', 'T'), ('SFWRENG 3DB3', 'T'),
              ('SFWRENG 3MX3', 'T'), ('SFWRENG 3XA3', 'L'),
              ('COMMERCE 1AA3', 'C'), ('SFWRENG 3A04', 'C'),
              ('SFWRENG 3DX4', 'C'), ('SFWRENG 2DA4', 'C'),
              ('SFWRENG 3A04', 'T'), ('ECON 1BB3', 'T'),
              ('COMMERCE 1BA3', 'C'), ('ECON 1BB3', 'C')]

f = open('D:/Backup/User/Docs/Books/Year 3/3xa3/data.txt', 'r')
pj = json.loads(f.read())
f.close()

##cr2017 = pj["timetables"]["2017"]["6"]["courses"]
##cr2017 = pj["timetables"]["2018"]["6"]["courses"]
##c17 = {}
##c18 = {}
def parseJsonSchedule(data, term):
    parsed = {}
    t = ['C', 'T', 'L']  #types of classes lectures, tutorials, labs
    for k,d in data.items():
        if (d['term'] == term):
            k = d['code']
            parsed[k] = {}
            for ty in t:
                try:
                    c = {}
                    for coname,co in d['sections'][ty].items():
                        co = co['r_periods']
                        a = []
                        for i in co:
                            a.append((i['day'],i['start'],i['end']))
                        c[coname] = a
                        parsed[k][ty] = c
                except KeyError:
                    None
    return parsed
    
sem1 = parseJsonSchedule(pj["timetables"]["2017"]["6"]["courses"], 2) #sem1
sem2 = parseJsonSchedule(pj["timetables"]["2017"]["6"]["courses"], 5) #sem2
##c18 = parseJsonSchedule(pj["timetables"]["2018"]["13"]["courses"])

#print all selected courses
##for i in courses:
##    print('\n' + '----' * 10)
##    print(i)
##    printCourse(i, c17)

#put the courses object associated with the course name
for i in range(len(courses)):
    try:
        courses[i] = (courses[i], sem1[courses[i]])
    except KeyError:
        print(courses[i])
        

a = findOnlyOnes(courses)

fc = finalCourses
addToCourseList(fc, sem1, 'SFWRENG 3BB4', 'C', 'C01', False)

t = tb({1: sem1, 2: sem2})
##t.addSection('2017', 'SFWRENG 3BB4', 'C', 'C01', False)
##t.addSection(1, 'COMMERCE 1BA3', 'C', 'C01', False)
##t.addSection(2, 'COMMERCE 1BA3', 'C', 'C01', False)
t.printDay(1, 1)

##for course, data in a.items():
##    for i in range(1, data[0][0] + 1):
##        t.addSection(1, course, data[0][i][0], data[0][i][1], False)

k = t.addSections(allCourses, 1, 2)
s = 0
for l in k:
    s += 1
    for i in l:
        if (t.listConflicts(s, i)):
            print(True)
##for s in k:
##    for c in s:
##        print(c)
##    print()
    
##for d in range(1, 6):
##	t.printDay('2017',d)
##	print('----'*16)
##t.sortDaysByTime()
##print()
##for d in range(1, 6):
##	t.printDay('2017',d)
##	print('----'*16)
