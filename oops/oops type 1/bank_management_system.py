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
    
    def withdram(self,user_withdraw_amount):
        if user_withdraw_amount <= 20000 or user_withdraw_amount > 0 :
        else:
            print('You cant ')