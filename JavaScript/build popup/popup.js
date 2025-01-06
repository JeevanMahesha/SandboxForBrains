const button = document.querySelector('button')
const popup = document.querySelector('.pop-wrapper')
const close = document.querySelector('.pop-close')

button.addEventListener('click', () => {
    popup.style.display = 'block'
})

close.addEventListener('click', () => {
    popup.style.display = 'none'
})

popup.addEventListener('click', () => {
    popup.style.display = 'none'
})