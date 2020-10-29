class Bank:
    def __init__(self):
        self.name = ""
        self.address = ""
        self.acc = ""
        self.phone = ""
        self.balance = 0

    def getinfo(self):
        self.name = input()
        self.address = input()
        self.acc = int(input())
        self.phone = int(input())
        self.balance = 7000
    
    def withdraw(self):
        user_amount = 0
        user = int(input())
        user_amount += user 
        if user_amount <= 20000 or user_amount > 0:
            temp = self.balance
            temp -= user_amount
            if temp > 0:
                print('Withdraw Successfull')
                self.balance = temp
            else:
                print('Insufficient balance')
        else:
            print('You cant withdraw')

    def deposit(self):
        user_amount = int(input())
        self.balance += user_amount
        print('Deposit Successfull')
    
    def getbalance(self):
        print('CurrentAvailable Balance',self.balance)

if __name__ == "__main__":
    c = 0
    while(c != 5):
        print(" 1.Enter Customer Credentials \n 2.Withdraw \n 3.Deposit \n 4.GetBalance \n 5.exit \n Enter the choice")
        c = int(input())
        if c == 1:
            cust = Bank()
            cust.getinfo()
        elif  c == 2:
            cust.withdraw()
        elif c == 3:
            cust.deposit()
        elif c == 4:
            cust.getbalance()
        elif c <= 0  or c>5:
            print('Wrong input')
    else:
        print('Session Closed Thank You!!!')