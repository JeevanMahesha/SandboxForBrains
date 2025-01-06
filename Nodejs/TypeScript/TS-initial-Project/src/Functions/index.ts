function calculateTax(income: number, taxYear = 2022): number {
	let x = 0;
	if (taxYear <= 1999) {
		return income * 2;
	} else {
		return income * 3;
	}
}

calculateTax(10000, 2000);

const printResult = (result: number): void => console.log(result);

function add(
	number1: number,
	number2: number,
	callBackFun: (result: number) => void
) {
	let finalValue = number1 + number2;
	callBackFun(finalValue);
}

add(5, 10, printResult);
