const [dayInput, monthInput, yearInput] = document.querySelectorAll(".input__field");
const [dayErrorMsg, monthErrorMsg, yearErrorMsg] = document.querySelectorAll(".input__error");
const [yearResult, monthResult, dayResult] = document.querySelectorAll(".result span:first-child");
const submitBtn = document.querySelector(".form__button");

submitBtn.addEventListener("click", () => {
  const now = new Date();
  const currentDate = [
    (currentYear = now.getFullYear()), // (e.g. 2023)
    (currentMonth = now.getMonth() + 1), // (0-11)
    (currentDay = now.getDate()), // (1-31)
  ];

  let isValidYear = checkYear(...currentDate);
  let isValidMonth = checkMonth(...currentDate);
  let isValidDay = checkDay(...currentDate);

  if (isValidDay && isValidMonth && isValidYear) {
    calculateAge();
  }
});

function calculateAge() {
  let birthDate = new Date(yearInput.value, monthInput.value - 1, dayInput.value);
  const now = new Date();

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  let days = now.getDate() - birthDate.getDate();
  if (days < 0) {
    months--;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
  }

  const age = [years, months, days];

  [yearResult, monthResult, dayResult].forEach((el, ind) => {
    el.style.letterSpacing = "initial";
    el.setAttribute("data-count", age[ind]);
  });

  document.querySelectorAll(".result span:last-child").forEach((el) => (el.style.marginLeft = "2rem"));

  [yearResult, monthResult, dayResult].forEach((counter) => {
    let initialCount = 0;
    const finalCount = counter.dataset.count;

    const counting = setInterval(updateCounting, 50);

    function updateCounting() {
      initialCount = finalCount > 99 ? initialCount + 10 : ++initialCount;
      counter.innerHTML = initialCount;
      if (initialCount >= finalCount) clearInterval(counting);
    }
  });
}

function toggleError(isBadInput, errorElement, errorText) {
  isBadInput
    ? errorElement.classList.add("input__error--active")
    : errorElement.classList.remove("input__error--active");

  errorElement.innerHTML = errorText;
}

function checkYear(...currentDate) {
  let value = yearInput.value;
  const isEmpty = value.length === 0;

  value = Number(value);
  const isNumber = parseFloat(value);
  const isInteger = Number.isInteger(value);

  const isFutureYear = value > currentYear;

  if (isEmpty) {
    toggleError(true, yearErrorMsg, "This field is required");
    return false;
  }
  if (!isInteger || value < 0) {
    toggleError(true, yearErrorMsg, "Must be a valid year");
    return false;
  }
  if (isFutureYear) {
    toggleError(true, yearErrorMsg, "Must be in the past");
    return false;
  }

  toggleError(false, yearErrorMsg, "");
  return true;
}

function checkMonth(...currentDate) {
  let value = monthInput.value;
  const isEmpty = value.length === 0;

  value = Number(value);
  const isNumber = parseFloat(value);
  const isInteger = Number.isInteger(value);

  const isInvalid = value > 12 || value < 1;

  const isFutureMonth = +monthInput.value > currentMonth && +yearInput.value === currentYear;
  if (isEmpty) {
    toggleError(true, monthErrorMsg, "This field is required");
    return false;
  }
  if (!isInteger || isInvalid) {
    toggleError(true, monthErrorMsg, "Must be a valid month");
    return false;
  }

  if (isFutureMonth) {
    toggleError(true, monthErrorMsg, "Must be in the past");
    return false;
  }

  toggleError(false, monthErrorMsg, "");
  return true;
}

function checkDay(...currentDate) {
  let value = dayInput.value;
  const isEmpty = value.length === 0;

  value = Number(value);
  const isNumber = parseFloat(value);
  const isInteger = Number.isInteger(value);

  const daysInMonth = [
    { totalDays: 31 },
    { totalDays: 28 },
    { totalDays: 31 },
    { totalDays: 30 },
    { totalDays: 31 },
    { totalDays: 30 },
    { totalDays: 31 },
    { totalDays: 31 },
    { totalDays: 30 },
    { totalDays: 31 },
    { totalDays: 30 },
    { totalDays: 31 },
  ];

  let isLeapYear = checkLeapYear(yearInput);
  if (isLeapYear) daysInMonth[1].totalDays = 29;

  const isInvalid =
    dayInput.value > daysInMonth[monthInput.value - 1]?.totalDays || dayInput.value < 1 || dayInput.value > 31;

  const isFutureDay =
    +dayInput.value > currentDay && +monthInput.value === currentMonth && +yearInput.value === currentYear;

  if (isEmpty) {
    toggleError(true, dayErrorMsg, "This field is required");
    return false;
  }
  if (!isInteger || isInvalid) {
    toggleError(true, dayErrorMsg, "Must be a valid date");
    return false;
  }

  if (isFutureDay) {
    toggleError(true, dayErrorMsg, "Must be in the past");
    return false;
  }

  toggleError(false, dayErrorMsg, "");
  return true;
}

function checkLeapYear(input) {
  const year = input.value;
  if (year % 100 === 0 && year % 400 !== 0) return false;
  else if (year % 4 === 0) return true;
  else return false;
}
