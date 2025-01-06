const weatherform = document.querySelector('form')
const searchvalue = document.querySelector('input')
const locationNameMessage = document.querySelector('#location-name-message')
const weatherdescription = document.querySelector('#weather_descriptions')
const temperature = document.getElementById('temperature')
const country = document.querySelector('#country')
const degree = document.getElementById('f')

weatherform.addEventListener('submit', (e) => {
    e.preventDefault()
    fetch('http://localhost:3000/weather?address=' + searchvalue.value)
        .then((res) => res.json())
        .then((data) => {
            if (data.Error) {
                locationNameMessage.textContent = data.Error
            } else {
                weatherdescription.textContent = data.description[0]
                country.textContent = data.location
                temperature.innerHTML = `<p class="display-1 degree" > ${data.temperatur}&#8451;</p>`

            }
        })

})