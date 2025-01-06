function register() {
    var name = document.getElementById('name')
    var email = document.getElementById('email')
    var phone = document.getElementById('phone')
    var password = document.getElementById('password')
    if (!name.value || !email.value || !phone.value || !password.value) {
        document.getElementById("message").innerHTML = `<p class="text-danger">please enter the all the field</p>`
        setTimeout(() => {
            document.getElementById("message").innerHTML = '';
        }, 2000)
    } else {
        fetch("http://127.0.0.1:3000/user/signup", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.value,
                    email: email.value,
                    mobile: phone.value,
                    password: password.value
                })
            }).then((res) => res.json())
            .then((data) => {
                if (data.status === 201) {
                    swal('Welcome', data.user.name, 'success', {
                        buttons: false
                    });
                    sessionStorage.setItem("AuthToken", data.token)
                    sessionStorage.setItem("UserName", data.user.name)
                    setTimeout(() => { window.location.href = "/profile" }, 2000);
                } else {
                    swal('Oops', 'Signup Failed', 'error', {
                        buttons: false
                    });
                    setTimeout(function() { window.location.href = "/signup" }, 2000);
                }
            })
    }
}

function Login() {
    var email = document.getElementById('email')
    var password = document.getElementById('password')
    if (!email.value || !password.value) {
        document.getElementById("message").innerHTML = `<p class="text-danger">please enter the all the field</p>`
        setTimeout(() => {
            document.getElementById("message").innerHTML = '';
        }, 2000)
    } else {
        fetch("http://127.0.0.1:3000/users/login", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value
                })
            }).then((res) => res.json())
            .then((data) => {
                if (data.status === 200) {
                    swal('Welcome', data.user.name, 'success', {
                        buttons: false
                    });
                    sessionStorage.setItem("AuthToken", data.token)
                    sessionStorage.setItem("UserName", data.user.name)
                    setTimeout(() => { window.location.href = "/profile" }, 2000);
                } else {
                    swal('Oops', 'Login Failed', 'error', {
                        buttons: false
                    });
                    setTimeout(function() { window.location.href = "/login" }, 2000);
                }
            })
    }
}

function loginCheck() {
    if (!sessionStorage.getItem("AuthToken")) {
        swal('Oops', 'Please Login', 'error', {
            buttons: false
        });
        setTimeout(function() { window.location.href = "/login" }, 2000);
    } else {
        document.getElementById('profilename').innerHTML = sessionStorage.getItem("UserName")
        return true
    }
}

function logout() {
    fetch("http://127.0.0.1:3000/users/logout", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("AuthToken"),
            },
            body: JSON.stringify({
                token: sessionStorage.getItem("AuthToken")
            })
        }).then((res) => res.json())
        .then((data) => {
            swal('Thanks', 'Come Again', 'success', {
                buttons: false
            });
            sessionStorage.clear();
            setTimeout(function() { window.location.href = "/" }, 2000);
        })
        .catch((e) => console.log(e))

}

function profile() {

    if (loginCheck()) {
        fetch("http://127.0.0.1:3000/users/me", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem("AuthToken"),
                }
            }).then((res) => res.json())
            .then((data) => {
                document.getElementById('username').innerHTML = data.name;
                document.getElementById('useremail').innerHTML = data.email;
                document.getElementById('userphone').innerHTML = data.mobile;
            })

    }
}

function navBar() {
    if (sessionStorage.getItem('AuthToken')) {
        document.getElementById('loginbtn').style.display = 'none';
        document.getElementById('signupbtn').style.display = 'none';
        document.getElementById('profile').style.display = 'inline';
        document.getElementById('logout').style.display = 'inline';
    } else {
        document.getElementById('loginbtn').style.display = 'inline';
        document.getElementById('signupbtn').style.display = 'inline';
        document.getElementById('profile').style.display = 'none';
        document.getElementById('logout').style.display = 'none';
    }
}

function uploadfile() {
    var uploadtype = document.getElementById('uploadtype').value
    var uploadfile = document.getElementById('customFile').files[0]
    const formData = new FormData();
    formData.append(uploadtype, uploadfile);


    if (!uploadtype || !uploadfile) {
        document.getElementById("message").innerHTML = `<p class="text-danger">please Select file Type and Upload the file</p>`
        setTimeout(() => {
            document.getElementById("message").innerHTML = '';
        }, 2000)
    } else {
        fetch("http://127.0.0.1:3000/upload/" + uploadtype, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem("AuthToken"),
                },
                body: formData
            }).then((res) => res.json())
            .then((data) => {
                if (data.status === 201) {
                    swal('Successfully', 'File Uploaed', 'success', {
                        buttons: false
                    });
                    setTimeout(function() { window.location.href = "/profile" }, 2000);
                } else {
                    swal('Oops', 'File Uploaed Failed', 'error', {
                        buttons: false
                    });
                    setTimeout(function() { window.location.href = "/profile" }, 2000);
                }
            })
    }
}


function mywallpaper() {
    if (loginCheck()) {
        fetch("http://127.0.0.1:3000/images/me", {
                method: "GET",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Bearer ' + sessionStorage.getItem("AuthToken"),
                }
            })
            .then((res) => (res.json()))
            .then((data) => {
                if (data.length === 0) {
                    document.getElementById('displayimg').innerHTML = `
                    <h1 class="font-weight-bolder">You Did Upload any Wallpaper</h1>
                    `
                }
                data.forEach((img) => {
                    document.getElementById('displayimg').innerHTML += `
                    <div class="col-sm-6 col-md-4">
                    <div class="thumbnail">
                        <a class="lightbox" href="${img.path}">
                            <img src="${img.path}" alt="Park">
                        </a>
                        <div class="caption">
                            <a href="${img.path}" download  class="btn btn-success">Download</a>

                        </div>
                    </div>
                </div>
                    `
                })
            })
    }
}


function myaudio() {
    if (loginCheck()) {
        fetch("http://127.0.0.1:3000/ringtone/me", {
                method: "GET",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Bearer ' + sessionStorage.getItem("AuthToken"),
                }
            })
            .then((res) => (res.json()))
            .then((data) => {
                if (data.length === 0) {
                    document.getElementById('displaytone').innerHTML = `
                    <h1 class="font-weight-bolder">You Did Upload any Ringtone</h1>
                    `
                }
                data.forEach((tone) => {
                    var fn = tone.ringtoneName.split('-')
                    document.getElementById('displaytone').innerHTML += `
                <div class="col-md-4 col-sm-6 mt-3">
                <div class="card ">
                    <h5 class="font-weight-bolder">File Type <span>${fn[1]}</span></h5>
                    <a href="${tone.path}" class="btn btn-primary btn-sm" role="button" aria-pressed="true" download>download</a>
                    <br>
                    <audio controls class="align-content-center">
                           <source src="${tone.path}">
                      </audio>
                </div>
            </div>
                `
                })
            })
    }
}

function allwallpaper() {
    navBar()
    fetch("http://127.0.0.1:3000/images/all", {
            method: "GET",
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then((res) => (res.json()))
        .then((data) => {
            if (data.length === 0) {
                document.getElementById('displayimg').innerHTML = `
                <h1 class="font-weight-bolder">NO images Uploaded </h1>
                `
            }
            data.forEach((img) => {
                document.getElementById('displayimg').innerHTML += `
                    <div class="col-sm-6 col-md-4">
                    <div class="thumbnail">
                        <a class="lightbox" href="${img.path}">
                            <img src="${img.path}" alt="Park">
                        </a>
                        <div class="caption">
                            <a href="${img.path}" download  class="btn btn-success">Download</a>

                        </div>
                    </div>
                </div>
                    `
            })
        })
}

function allaudio() {
    navBar()
    fetch("http://127.0.0.1:3000/ringtone/all", {
            method: "GET",
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then((res) => (res.json()))
        .then((data) => {
            if (data.length === 0) {
                document.getElementById('displaytone').innerHTML = `
                <h1 class="font-weight-bolder">NO Audio Uploaded </h1>
                `
            }
            data.forEach((tone) => {
                var fn = tone.ringtoneName.split('-')
                document.getElementById('displaytone').innerHTML += `
                <div class="col-md-4 col-sm-6 mt-3">
                <div class="card ">
                    <h5 class="font-weight-bolder">File Type <span>${fn[1]}</span></h5>
                    <a href="${tone.path}" class="btn btn-primary btn-sm" role="button" aria-pressed="true" download>download</a>
                    <br>
                    <audio controls class="align-content-center">
                           <source src="${tone.path}">
                      </audio>
                </div>
            </div>
                `
            })
        })

}