const loginform = document.querySelector('#login-form');
loginform.addEventListener('submit', e => {
    e.preventDefault();
    userLogin(loginform);
})

// const updateprofile = document.querySelector('#updateprofile');
// updateprofile.addEventListener('submit', e => {
//     e.preventDefault();
//     alert('hello');
// })


function userLoginCheck() {
    if (sessionStorage.getItem('Userid')) {
        document.getElementById('userid1').innerHTML = sessionStorage.getItem('Userid');
    } else {
        swal('Oops', 'Please Login', 'error', {
            buttons: false
        });
        setTimeout(function() { window.location.href = '../login.html' }, 2000);

    }
}

function getUserDetailsForEdit() {
    userLoginCheck();
    const userid = sessionStorage.getItem('Userid');
    fetch('http://127.0.0.1:5000/user/USERDETAILS,' + userid)
        .then((res) => res.json())
        .then((data) => {
            document.getElementById('username').value = data.Name;
            document.getElementById('useremail').value = data.Email;
            document.getElementById('userphone').value = data.Phone;
            document.getElementById('username1').innerHTML = data.Name;
            document.getElementById('username2').innerHTML = data.Name;
            document.getElementById('userid').innerHTML = data.Userid;

        })
}


function getuserdetails() {
    userLoginCheck();
    const userid = sessionStorage.getItem('Userid');
    fetch('http://127.0.0.1:5000/user/USERDETAILS,' + userid)
        .then((res) => res.json())
        .then((data) => {
            document.getElementById('username1').innerHTML = data.Name;
            document.getElementById('username2').innerHTML = data.Name;
            document.getElementById('userid').innerHTML = data.Userid;
            document.getElementById('username').innerHTML = data.Name;
            document.getElementById('useremail').innerHTML = data.Email;
            document.getElementById('userphone').innerHTML = data.Phone;
            document.getElementById('usertype').innerHTML = data.Type;
            document.getElementById('userissuedbook').innerHTML = data.nobookissue;
            document.getElementById('usertotalbook').innerHTML = data.maxbook;
            sessionStorage.setItem('Username', data.Name);
        })
}

function userProfileUpdate() {
    const userid = sessionStorage.getItem('Userid');
    const name = document.getElementById('username').value;
    const email = document.getElementById('useremail').value;
    const type = document.getElementById('usertype').value;
    const phone = document.getElementById('userphone').value;
    if (name && email && type && phone) {
        fetch('http://127.0.0.1:5000/userupdate', {
                method: 'put',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    LMSID: userid,
                    Name: name,
                    Email: email,
                    Type: type,
                    Phone: phone
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 200) {
                    swal('Done', data.Message, 'success', {
                        buttons: false
                    });
                    setTimeout(function() { window.location.href = './userdashboard.html' }, 2000)
                } else {
                    swal('Oops', data.Message, 'error', { buttons: false });
                    setTimeout(function() { location.reload() }, 2000)
                }
            })
    } else {
        document.getElementById('error-message').innerHTML = 'Enter All the Fields';
        setTimeout(function() { document.getElementById('error-message').innerHTML = ''; }, 3000)
    }
}

function userRegister() {
    const name = document.getElementById('signupname').value;
    const email = document.getElementById('signupemail').value;
    const type = document.getElementById('signuptype').value;
    const phone = document.getElementById('signupphone').value;
    const password = document.getElementById('signuppassword').value;
    if (name && email && type && phone && password) {
        fetch('http://127.0.0.1:5000/register', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    Name: name,
                    Email: email,
                    Type: type,
                    Phone: phone,
                    Password: password
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 201) {
                    // document.getElementById('signup-error-message').innerHTML = data.Message;
                    swal('Welcome You', data.Message + 'Please Login', 'success');
                    setTimeout(function() { window.location.href = './login.html'; }, 3000)
                } else {
                    document.getElementById('signup-error-message').innerHTML = data.Message;
                    setTimeout(function() { document.getElementById('signup-error-message').innerHTML = ''; }, 3000)
                }
            })
    } else {
        document.getElementById('signup-error-message').innerHTML = 'Enter all the Fields';
        setTimeout(function() { document.getElementById('signup-error-message').innerHTML = ''; }, 3000)
    }
}

function userLogout() {
    sessionStorage.clear();
    swal('Thank You', '', 'info', {
        buttons: false
    });
    setTimeout(function() { window.location.href = '../index.html' }, 2000);
}

function userLogin(loginform) {
    const email = loginform.loginemail.value;
    const password = loginform.loginpassword.value;

    if (email && password) {
        fetch('http://127.0.0.1:5000/userlogin', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    Email: email,
                    Password: password
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 200) {
                    swal('Welcome Back', data.Message, 'success');
                    sessionStorage.setItem('Userid', data.Userid);
                    setTimeout(function() { window.location.href = 'Dashboard/userdashboard.html'; }, 3000)
                } else {
                    document.getElementById('login-error-message').innerHTML = data.Message;
                    setTimeout(function() { document.getElementById('login-error-message').innerHTML = ''; }, 3000)
                }
            })
    } else {
        document.getElementById('login-error-message').innerHTML = 'Enter all the Fields';
        setTimeout(function() { document.getElementById('login-error-message').innerHTML = ''; }, 3000)
    }
}


function userissuedbooks() {
    userLoginCheck();
    document.getElementById('username1').innerHTML = sessionStorage.getItem('Username');
    document.getElementById('username2').innerHTML = sessionStorage.getItem('Username');
    fetch('http://127.0.0.1:5000/user/USERISSUEDBOOKS,' + sessionStorage.getItem('Userid'))
        .then((res) => res.json())
        .then((data) => {
            if (data.userissuebooks.length === 0) {
                return document.getElementById('allissuedbooks').innerHTML = '<h1 class="text-center">No Recored in DataBase</h1>';
            }
            let c = 1
            let issuebooks = ` <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Book ID</th>
                <th scope="col">Book Name</th>
                <th scope="col">Issue Date</th>
                <th scope="col">Return Date</th>
                <th scope="col">Renewal</th>
                <th scope="col">Return</th>
            </tr>
        </thead> `;
            data.userissuebooks.forEach(function(issuebook) {
                issuebooks += `
                <tr>
                <th scope="row">${c}</th>
                <td>${issuebook[0].bookid}</td>
                <td>${issuebook[0].bookname}</td>
                <td >${issuebook[2].borrow_date}</td>
                <td>${issuebook[2].return_date}</td>
                <td><button type="button" onclick="renewalBook(this.value)" value="${issuebook[0].bookid}" class="btn btn-icon btn-light"><i class="la la-retweet "></i></button></td>
                <td><button type="button" onclick="returnBook(this.value)" value="${issuebook[0].bookid}" class="btn btn-icon btn-secondary"><i class="la la-unlink"></i></button></td>
                </tr>`;
                c += 1
            });
            document.getElementById('allissuedbooks').innerHTML = issuebooks;
        });
}

function renewalBook(bookid) {
    let userid = sessionStorage.getItem('Userid');
    fetch('http://127.0.0.1:5000/issuebook', {
            method: 'put',
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
            if (data.status === 200) {
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

function returnBook(bookid) {
    let userid = sessionStorage.getItem('Userid');
    fetch('http://127.0.0.1:5000/issuebook', {
            method: 'delete',
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
            if (data.status === 200) {
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