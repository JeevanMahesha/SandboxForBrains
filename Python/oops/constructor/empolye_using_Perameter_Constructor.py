class Employee:
    # ================= Perameter Constructor ===========================
    def __init__(self, name, id, e_des, e_sal):
        self.emp_name = name
        self.emp_id = id
        self.des = e_des
        self.salay = e_sal

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


if __name__ == "__main__":
    obj = Employee(input('Employee Name\n'), input('Employee ID\n'), input(
        'Employee Designation\n'), int(input('Employee Salary\n')))
    obj.show_data(obj.Allocate_level())
