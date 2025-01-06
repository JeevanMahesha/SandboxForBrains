class Employee:
    # ================= Non Perameter Constructor ===========================
    def __init__(self):
        self.emp_name = ''
        self.emp_id = ''
        self.des = ''
        self.salay = ''

    def Get_input(self):
        self.emp_name = input('Employee Name')
        self.emp_id = input('Employee ID')
        self.des = input('Employee Designation')
        self.salay = int(input('Employee Salary'))

    def Allocate_level(self):
        if self.salay >= 25000:
            return 'A'
        elif self.salay >= 20000 and self.salay < 25000:
            return 'B'
        elif self.salay >= 15000 and self.salay < 20000:
            return 'C'
        elif self.salay < 15000:
            return 'D'
        else:
            return 'Wrng Input'

    def show_data(self, emp_level):
        print('The Employee Name is :', self.emp_name)
        print('The Employee ID is :', self.emp_id)
        print('The Employee Designation is :', self.des)
        print('The Employee Salary is :', self.salay)
        print('The Employee Level is :', emp_level)


if __name__ == '__main__':
    obj = Employee()
    obj.Get_input()
    obj.show_data(obj.Allocate_level())
