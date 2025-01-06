const form = document.querySelector('.form')
const message = document.querySelector('.error')
    // form.addEventListener('submit', e => {
    //     e.preventDefault();
    //     const username = form.username.value;
    //     const pattern = /^[a-z]{6,}$/
    //     if (!pattern.test(username)) {
    //         message.textContent = 'Invalid username'
    //     }
    // })

// live feedback
form.username.addEventListener('keyup', e => {
    // console.log(e.target.value);
    const username = form.username.value;
    const pattern = /^[a-z]{6,12}$/
    if (!pattern.test(username)) {
        form.username.setAttribute('class', 'success')
    } else {
        form.username.setAttribute('class', 'error')
    }

})