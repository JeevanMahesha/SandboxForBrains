class Bookshelf:
    def __init__(self,*books):
        self.books = books
    
    def __str__(self):
        return (f"{len(self.books)} are in the shelf")

class Books:
    def __init__(self,name):
        self.name = name
    
    def __str__(self):
        return(f"{self.name} in the shelf")
    
if __name__ == "__main__":
    book1 = Books('You can win')
    book2 = Books('Rich dad Poor dad')
    checkshelf = Bookshelf(book1,book2)
    print( book1,'\n',book2,'\n')
    print(checkshelf)