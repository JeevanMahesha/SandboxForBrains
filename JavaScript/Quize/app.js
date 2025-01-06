const correctAnswer = ['B', 'B', 'B', 'B']
const form = document.querySelector('.quiz-form')
const result = document.querySelector('.result')

form.addEventListener('submit', e => {
    e.preventDefault();
    let score = 0
    const userAnswers = [form.q1.value, form.q2.value, form.q3.value, form.q4.value]
        // Check answer
    userAnswers.forEach((answer, index) => {
            if (answer === correctAnswer[index]) {
                score += 25
            }
        })
        // console.log(score);
        // show result on page
    scrollTo(0, 0)
    result.classList.remove('d-none')
    let output = 0
    const final_result = setInterval(() => {
        result.querySelector('span').textContent = `${output}%`
        if (output === score) {
            clearInterval(final_result)
        } else {
            output++
        }
    }, 10)
})