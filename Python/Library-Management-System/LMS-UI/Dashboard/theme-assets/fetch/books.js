function getallbooks() {
    userLoginCheckToMenu();
    fetch('http://127.0.0.1:5000/getbookanduserdetails/ALLBOOK')
        .then((res) => res.json())
        .then((data) => {
            if (data.length === 0) {
                return document.getElementById('librarybooks').innerHTML = 'no records';
            }
            data.AllBook.forEach(function(book) {
                document.getElementById('librarybooks').innerHTML += ` 
                <div class="col-lg-4">
                <div class="course-one__content">
                    <h2 class="course-one__title">${book.bookname}</h2>
                    <div class="course-one__admin">
                        by <a href="#">${book.authorname}</a>
                    </div>
                    <div class="course-one__meta">
                        <a href=""><i class="fas fa-book-reader"></i>${book.remainingbook}</a>
                        <a href=""><i class="fas fa-book"></i> ${book.totalbook}</a>
                    </div>
                    <button onclick="issuebook(this.value)"  value="${book.bookid}" class="course-one__link">Borrow</button>
                </div>
            </div>
                `;
            });
        });
}

function issuebook(bookid) {
    if (userLoginCheck()) {
        let userid = sessionStorage.getItem('Userid');
        fetch('http://127.0.0.1:5000/issuebook', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    LMSBOOKID: bookid,
                    LMSID: userid
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 201) {
                    swal('Done', data.Message, 'success', {
                        buttons: false
                    });
                    setTimeout(function() { location.reload() }, 2000)
                } else {
                    swal('Oops', data.Message, 'error', { buttons: false });
                    setTimeout(function() { location.reload() }, 2000)
                }
            })
    }
}

function userLoginCheck() {
    if (sessionStorage.getItem('Userid')) {
        return true;
    } else {
        swal('Oops', 'Please Login', 'error', {
            buttons: false
        });
        setTimeout(function() { window.location.href = 'login.html' }, 2000);
    }
}

function userLoginCheckToMenu() {
    if (sessionStorage.getItem('Userid')) {
        document.getElementById('loginmenu').style.display = 'none';
        document.getElementById('signupmenu').style.display = 'none';
        document.getElementById('dashboardmenu').style.display = 'inline';
        document.getElementById('logout').style.display = 'inline';
    } else {
        document.getElementById('loginmenu').style.display = 'inline';
        document.getElementById('signupmenu').style.display = 'inline';
        document.getElementById('dashboardmenu').style.display = 'none';
        document.getElementById('logout').style.display = 'none';
    }
}

function userLogout() {
    sessionStorage.clear();
    swal('Thank You', '', 'info', {
        buttons: false
    });
    setTimeout(function() { location.reload(); }, 2000);
}