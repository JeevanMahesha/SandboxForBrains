class TooManyPagesReadError(ValueError):
    pass

class Book:
    def __init__(self,name:str,total_pages : int):
        self.name = name
        self.total_pages = total_pages
        self.pages_read = 0

    def __repr__(self):
        return f"The {self.name} having {self.total_pages} pages"



    def read_book(self,read):
        if self.pages_read + read>self.total_pages:
            raise TooManyPagesReadError(
        f"You tried to read {self.pages_read + read} pages, but this book only has {self.total_pages} pages."
        )
        self.pages_read += read
        print(f"You have now read {self.pages_read} pages out of {self.total_pages}")
    

if __name__ == "__main__":
    try:
        RDPD = Book('Rich Dad Poor Dad',150)
        print(RDPD)
        RDPD.read_book(50)
    except TooManyPagesReadError as e:
        print(e)
    finally:
        print('Thanks for Reading the book......!')