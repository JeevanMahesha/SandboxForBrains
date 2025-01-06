// This File is Admin fetch api call
document.getElementById('Admin-Login-Button').onclick = AdminLogin;

function getcount() {
    if (AdminLoginCheck()) {
        fetch('http://127.0.0.1:5000/getbookanduserdetails/ALLUSERBOOKISSUECOUNT')
            .then((res) => res.json())
            .then((data) => {
                document.getElementById('totalbook').innerHTML = data.issuebookcount;
                document.getElementById('totaluser').innerHTML = data.usercount;
                document.getElementById('totalissuebook').innerHTML = data.bookcount;
            })
    }

}

function AdminLogin() {
    const username = document.getElementById('Admin-username').value;
    const password = document.getElementById('Admin-password').value;
    if (username && password) {
        fetch('http://127.0.0.1:5000/AdminLogin', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }).then((res) => res.json())
            .then((data) => {
                if (data.status === 200) {
                    swal('Done', data.Message, 'success', {
                        buttons: false
                    });
                    sessionStorage.setItem('AdminName', 'Admin');
                    setTimeout(function() {
                        window.location.href = "./admindashboard.html";
                    }, 1000)

                } else {
                    return document.getElementById('error-message').innerHTML = data.Message;
                }
            })
    } else {
        return document.getElementById('error-message').innerHTML = 'Please enter all the fields';
    }
}

function AdminLoginCheck() {
    if (sessionStorage.getItem('AdminName')) {
        //console.log(sessionStorage.getItem('AdminName'));
        document.getElementById('Admin1').innerHTML = sessionStorage.getItem('AdminName');
        document.getElementById('Admin2').innerHTML = sessionStorage.getItem('AdminName');
        return true;
    } else {
        swal('Oops', 'Please Login', 'error', {
            buttons: false
        });
        setTimeout(function() { window.location.href = "./adminlogin.html"; }, 2000);
    }
}

function AdminLogout() {
    swal('Done', 'Logout Successfull', 'success', {
        buttons: false
    });
    sessionStorage.clear();
    setTimeout(function() { window.location.href = "./adminlogin.html"; }, 2000);
}

function getallbooksinlibrary() {
    AdminLoginCheck();
    fetch('http://127.0.0.1:5000/getbookanduserdetails/ALLBOOK')
        .then((res) => res.json())
        .then((data) => {
            if (data.AllBook.length === 0) {
                return document.getElementById('allbooks').innerHTML = '<h1 class="text-center">No Recored in DataBase</h1>';
            }
            let allbook = ` <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Book ID</th>
                <th scope="col">Book Name</th>
                <th scope="col">Author Name</th>
                <th scope="col">Remaining Book</th>
                <th scope="col">Total Book</th>
            </tr>
        </thead> `;
            data.AllBook.forEach(function(books) {
                allbook += `
                <tr>
                <th scope="row">${books.id}</th>
                <td>${books.bookid}</td>
                <td>${books.bookname}</td>
                <td>${books.authorname}</td>
                <td>${books.remainingbook}</td>
                <td>${books.totalbook}</td>
                </tr>`;
            });
            document.getElementById('allbooks').innerHTML = allbook;
        });
}

function getallusersinlibrary() {
    AdminLoginCheck();
    fetch('http://127.0.0.1:5000/getbookanduserdetails/ALLUSER')
        .then((res) => res.json())
        .then((data) => {
            if (data.AllUser.length === 0) {
                return document.getElementById('allusers').innerHTML = '<h1 class="text-center">No Recored in DataBase</h1>';
            }
            let alluser = `<thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">User ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email Address</th>
                <th scope="col">User Type</th>
                <th scope="col">Phone</th>
                <th scope="col">Book issued</th>
            </tr>
        </thead> `;
            data.AllUser.forEach(function(users) {
                alluser += ` <tr>
                <th scope="row">${users.id}</th>
                <td>${users.Userid}</td>
                <td>${users.Name}</td>
                <td>${users.Email}</td>
                <td>${users.Type}</td>
                <td>${users.Phone}</td>
                <td>${users.nobookissue}</td>
                </tr>`;
            });
            document.getElementById('allusers').innerHTML = alluser;
        });
}

function getallissuedbook() {
    AdminLoginCheck();
    fetch('http://127.0.0.1:5000/getbookanduserdetails/ISSUEBOOK')
        .then(res => res.json())
        .then((data) => {
            // console.log(data.issuebook[0][0].bookid);
            if (data.issuebook.length === 0) {
                return document.getElementById('issuedbooks').innerHTML = '<h1 class="text-center">No Recored in DataBase</h1>';
            }
            let count = 1
            let bookissuedlist = `<thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Book ID</th>
                <th scope="col">Book Name</th>
                <th scope="col">User ID</th>
                <th scope="col">User Name</th>
            </tr>
        </thead> `;
            data.issuebook.forEach(function(bookissue) {
                bookissuedlist += `<tr>
                <th scope="row">${count}</th>
                <td>${bookissue[0].bookid}</td>
                <td>${bookissue[0].bookname}</td>
                <td>${bookissue[1].Userid}</td>
                <td>${bookissue[1].Name}</td>
                </tr>
                `;
                count++;
            });
            document.getElementById('issuedbooks').innerHTML = bookissuedlist;
        });
}

function uploadnewbook() {
    const authorname = document.getElementById('authorname').value;
    const bookname = document.getElementById('bookname').value;
    const totalbook = document.getElementById('totalbook').value;
    if (authorname && bookname && totalbook) {
        fetch('http://127.0.0.1:5000/insertbook', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    AuthorName: authorname,
                    BookName: bookname,
                    TotalBook: totalbook
                })
            }).then((res) => res.json())
            .then((data) => {
                if (data.status === 201) {
                    document.getElementById('success-message').innerHTML = data.Message;
                    setTimeout(function() {
                        location.href = 'uploadbook.html';
                    }, 3000)

                } else {
                    document.getElementById('error-message').innerHTML = data.Message;
                    setTimeout(function() {
                        document.getElementById('error-message').innerHTML = '';
                    }, 3000)
                }
            })
    } else {
        document.getElementById('error-message').innerHTML = 'Please Enter all fileds';
        setTimeout(function() {
            document.getElementById('error-message').innerHTML = '';
        }, 3000)
    }
}