class TimeTable:
    def __init__(self, dataSet):
        self.courses = {}
        for year in dataSet.keys():
            self.courses[year] = [[], [], [], [], [], []]
        self.data = dataSet

    #adds the specified section to the timetable
    #if checkForConflicts is true, then an exception is thrown when there is
    #is a timing conflict
    def addSection(s, year, courseName, sectionType, section, movable,
                   checkForConflict=True):
        course = s.data[year][courseName]
    
        for day in course[sectionType][section]:
            if (checkForConflict):
                check = s.checkForConflicts(year, day[0], day[1], day[2])
                if (check[0]):
                    raise RuntimeError('%s %s interferes with %s %s. day:%s %s-%s'
                                       %(courseName, section, check[1], check[2],
                                         day[0], day[1], day[2]))
                
            data = {'name': courseName,
                    'type': sectionType,
                    'section': section,
                    'start': day[1],
                    'end': day[2],
                    'movable': movable}
            s.courses[year][day[0]].append(data)

    #returns 1 if t1 is earlier than t2
    #returns -1 if t1 is later than t2
    #returns 0 if t1 is same time as t2
    def compareTime(t1, t2):
        t1 = t1.split(':')
        t2 = t2.split(':')
        t1[0], t1[1] = int(t1[0]), int(t1[1])
        t2[0], t2[1] = int(t2[0]), int(t2[1])

        if (t1[0] == t2[0]):
            if (t1[1] == t2[1]):
                return 0
            else:
                return (1 if t1[1] < t2[1] else -1)
        else:
            return (1 if t1[0] < t2[0] else -1)
        
    #checks if time of the day in the specified year is already taken
    #returns a tuple
    #(conflicts, conflictingCourseName, conflictingCourseSection,
    # conflictingCourseMovable)
    def checkForConflicts(s, year, day, start, end):
        day = s.courses[year][day] #a list containting course dictionaries

        for entry in day:
            st = TimeTable.compareTime(entry['start'], start)
            en = TimeTable.compareTime(entry['end'], start)
            if (st >= 0 and en <= 0):
                return (True, entry['name'], entry['section'], entry['movable'])

            st = TimeTable.compareTime(start, entry['start'])
            en = TimeTable.compareTime(end, entry['start'])
            if (st >= 0 and en <= 0):
                return (True, entry['name'], entry['section'], entry['movable'])
        return (False, None, None, None)

    #returns a list of tuples that contains all sections that conflict
    #[(conflictingCourseName, conflictingCourseSection,
    # conflictingCourseMovable)]
    def checkForConflictsWithCourse(s, year, courseName, sectionType, section):
        section = s.data[year][courseName][sectionType][section]
        conflicts = []
        
        for time in section:
            con = s.checkForConflicts(year, time[0], time[1], time[2])
            if (con[0] and ((con[1], con[2], con[3]) not in conflicts)):
                conflicts.append((con[1], con[2], con[3]))
        return conflicts

    #checks if 2 sections conflict with each other.
    #sem = semester, c1 = course name of the first course, st1 = section type
    #for the first course, s1 = section of the first course. c2, st2, s2 are the
    #same info except it is for the second course.
    def checkConflict(s, sem, c1, st1, s1, c2, st2, s2):
        c1 = s.data[sem][c1][st1][s1]
        c2 = s.data[sem][c2][st2][s2]
        if (len(c1) < len(c2)):
            c2, c1 = c1, c2
            
        for cls1 in c1:
            for cls2 in c2:
                if (cls1[0] != cls2[0]):
                    continue #different days
                st = TimeTable.compareTime(cls1[1], cls2[1])
                en = TimeTable.compareTime(cls1[2], cls2[1])
                #start time of cls2 is in between the time of cls1
                #therefore a conflict
                if (st >= 0 and en <= 0):
                    return True

                st = TimeTable.compareTime(cls2[1], cls1[1])
                en = TimeTable.compareTime(cls2[2], cls1[1])
                #start time of cls1 is in between the time of cls2
                #therefore a conflict
                if (st >= 0 and en <= 0):
                    return True                
        return False

    #returns True if any section in the sections conflict any other section in
    #the list. Returns False otherwirse.
    def listConflicts(s, sem, sections):
        for i in range(len(sections) - 1):
            c1 = sections[i]
            for j in range(i+1, len(sections)):
                c2 = sections[j]
                if (s.checkConflict(sem, c1[0], c1[1][0], c1[1], c2[0],
                                     c2[1][0], c2[1])):
                    #two courses conflict
                    return True
        return False

    #checks if the provided section conflicts with any section in the provided list.
    #c = courseName, st = sectionType, s = section, lst = list to check agianst for
    #conflicts. The list contains tuples of form (courseName, section)
    #sem = semester
    #Returns True if there are conflicts, returns False otherwise
    def checkSectionAgainstList(self, sem, c, st, s, lst):
        for name, section in lst:
            if (self.checkConflict(sem, c, st, s, name, section[0], section)):
                return True
        return False

    #returns a list of courses that are in sections that does not conflict
    #with c,st,s.
    #c = courseName, st = sectionType, sc=section, sections=courses to check
    #against. sections list contains tuples = (courseName, ['C01', 'C02', ...])
    #semester where the courses take place
    def nonConflictingList(self, semester, c, st, s, sections):
        cName = sections[0]
        lst = sections[1]
        for sc in lst:
            return [sc for sc in lst if not self.checkConflict(
                    semester, c, st, s, cName, sc[0], sc)]

    #adds the provided section types to the time table.
    #sections is a list of tuples of form (courseName, sectionType)
    #sem1year is the year that the semester 1 takes place.
    #sem2year is the year that the semester 2 takes place.
    def addSections(s, sections, sem1year, sem2year):
        #the following lists contain (courseName, sectionToBeAdded)
        s1 = [] #semester 1 courses
        s2 = [] #semester 2 courses
        bothSem = [] #courses available in both semesters


        #seperates sections in to semester 1 and semester 2 depending on which
        #section they are happening
        for sem, semlst in ((sem1year, s1), (sem2year, s2)):
            if (sem is None):
                continue
            data = s.data[sem].keys()
            for section in sections:
                if (section[0] in data):
                    semlst.append(section)

        #find out which courses are offered in both semeters and add them to
        #to bothSem. Processing the longer list is faster.
        l1 = (s1, s2) if len(s1) > len(s2) else (s2, s1)
        l1, l2 = l1[0], l1[1]
        for course in l1:
            if (course in l2):
                bothSem.append(course)
        #remove courses that occure in both semesters from each semester list
        for course in bothSem:
            s1.remove(course)
            s2.remove(course)

        #add sections to section list
        #this expands (courseName, 'C') to (courseName, ['C01', 'C02', ...])
        expanded = [[], [], [], []] #expanded courses, [sem1, sem2, bothSem1, bothSem2]
        for sections, semester in [(s1, 1), (s2, 2)]:
            for course, section in sections:
                expanded[semester-1].append(
                    (course,
                     [core for core in s.data[semester][course][section]]))

        #expand courses that are offered in both semesters
        for semester in [1,2]:
            for course, section in bothSem:
                expanded[semester+1].append((course,
                    [core for core in s.data[semester][course][section]]))

        #sections that are must be taken together in a single semester must be
        #paired. ex: ECON 1BB3 T and ECON 1BB3 C must be taken together in a
        #single semester
        for sem in [2,3]:
            semlst = expanded[sem]
            i = 0
            paired = [] #list that contains paired sections
            while (i < len(semlst)):
                tmp = [semlst[i]]
                course = semlst[i][0]
                #look for other sections with the same course name                
                for j in range(i+1, len(semlst)):
                    if (semlst[j][0] == course):
                        tmp.append(semlst[j])
                        semlst.pop(j)
                paired.append(tmp)
                i += 1
            expanded[sem] = paired
                    
        #semlst = semester data, list of (courseName, [sections])
        #courseIndex = index of the course in the semester data
        #sectionIndex = index of the section inside a section list
        #courseIndex and sectionIndex choses which course, section pair
        #is chosed to be in the timetable
        def calcTimeTableRecursive(semlst, sem):
            possibleSections = [] #combinations of sections that do not
                                      #create time conflicts

            courseIndex = 0
            mainName = semlst[courseIndex][0]
            #iterate through all sections
            for mainSection in semlst[courseIndex][1]:
                #get a list of non conflicting sections of all courses
                toBe = semlst[courseIndex+1:]
                for i in range(len(toBe)):
                    r = s.nonConflictingList(sem, mainName, mainSection[0],
                                                     mainSection, toBe[i])
                    if (len(r) == 0):
                        toBe = None
                        break
                    else:
                        toBe[i] = (toBe[i][0], r)
                        
                if toBe is not None:
                    if (courseIndex == len(semlst) - 2):
                        #second last course is being processed.
                        #recursion ends here
                        for section in toBe[0][1]:
                            t = [(mainName, mainSection)]
                            t.append((toBe[0][0], section))
                            possibleSections.append(t)
                    else:
                        #recursively find available courses for the next
                        #course in the list
                        tb = calcTimeTableRecursive(toBe, sem)
                        if (len(tb) > 0):
                            for possibility in tb:
                                possibility.insert(0, (mainName, mainSection))
                                possibleSections.append(possibility)

                
            return possibleSections

        #calculate timetables for semester 1 and 2
        s1 = calcTimeTableRecursive(expanded[0], 1)
        s2 = calcTimeTableRecursive(expanded[1], 2)

        for l in [s1, s2]:
            for i in range(len(l)):
                l[i] = [l[i], []]
            
        #add courses that are in both semesters
        for semlst, sem in [(s1, 1), (s2, 2)]:
            for course, sections in expanded[sem+1]:
                i = 0
                while (i < len(semlst)):                
                    currentSchedule = semlst[i]
                    i += 1
                    for section in sections:
                        if not s.checkSectionAgainstList(sem, course, section[0], section, currentSchedule[0]):
                            tmp = [list(currentSchedule[0]),
                                   list(currentSchedule[0])]
                            tmp[0].insert(0, (course, section))
                            tmp[1].append((course, section[0]))
                            semlst.insert(i, tmp)
                            i += 1

        #takes in a paired list of course sections and adds non-conflicting
        #combinations to the semlst
        #semlst = list of possible timetables without courses offered in both
        #semesters
        #courselst = paired list of courses offered in both semesters. has the
        #form [(c1, [a,b,c]), (c1, [t1, t2]), ...]
        def addBothSemSections(s, sem, schedule, courselst, courseIndex,
                               scheduledCourses):
            if (courseIndex < len(courselst)-1):
                course, sections = courselst[courseIndex]
                for section in sections:
                    scheduledCourses.append((course, section))
                    addBothSemSections(s, sem, schedule, courselst,
                                       courseIndex+1, scheduledCourse)
            else if not s.listConflicts(sem, scheduledCourses):
                return True
            else:
                return False
                
        for semlst, sem in [(s1, 1), (s2, 2)]:
            for courses in expanded[sem+1]:
                i = 0
                while (i < len(semlst)):
                    c0 = courses[0][0]
                    for s0 in courses[0][1]:
                        if (len(courses) > 1):
                            for j in range(1, len(courses)):
                        
        return (s1, s2)
        
    def printDay(s, year, day):
        for entry in s.courses[year][day]:
            print('%s | %s | %s | %s'%(entry['name'], entry['section'],
                                       entry['start'], entry['end']))

    #sorts courses in each day of the year by the start time
    def sortDaysByTime(s):
        #transforms HH:MM in to minutes
        def cmp(c):
            t = c['start']
            t = t.split(':')
            return ((t[0] * 60) + t[1])
            
            
        for year, d in s.courses.items():
            for i in range(len(d)):
                s.courses[year][i] = sorted(d[i], key=cmp)
