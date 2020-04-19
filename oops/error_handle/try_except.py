def division(a,b):
    if a == 0:
        raise ZeroDivisionError ('0 Can not be divide')
    return a/b


if __name__ == "__main__":
    students = [
    {"name": "Bob", "grades": [75, 90]},
    {"name": "Rolf", "grades": [50]},
    {"name": "Jen", "grades": [100, 90]},
]
    print('Welcome \n')
    try:
        for student in students:
            Name = student['name']
            mark = student['grades']
            print(f"The {Name} average is {division(sum(mark),len(mark))}")
    except:
        print(f'\n{Name} has no Grades')
    else:
        print('\nAll Student avreage are calculated')
    finally:
        print('\nThank You....!')