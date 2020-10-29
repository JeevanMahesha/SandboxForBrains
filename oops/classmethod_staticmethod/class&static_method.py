# class ClassTest:
#     def instence_method(self):
#         print(f"Calling the instence method of {self}")

#     @classmethod
#     def class_method(cls):
#         print(f'Calling the class methon of {cls}')
    
#     @staticmethod
#     def static_method():
#         print('Calling the static method')


# test = ClassTest()
# test.instence_method()
# print()
# ClassTest.class_method()
# print()
# ClassTest.static_method()

# ==================================================================================================

class Book:
    Type = ('hardcover','papercover')

    def __init__(self,name,booktype,weight):
        self.name = name
        self.booktype = booktype
        self.weight = weight
    
    def __repr__(self):
        return(f'The Book {self.name} is {self.booktype} Type and {self.weight} Weight')
    
    @classmethod
    def hard_cover(cls,name,weight):
        return cls(name,cls.Type[0],weight)
        
    @classmethod
    def paper_cover(cls,name,weight):
        return cls(name,cls.Type[1],weight)

book1 = Book.hard_cover('Rich Dad Poor Dad',300)
book2 = Book.paper_cover('You Can win',500)
print(book1)
print()
print(book2)