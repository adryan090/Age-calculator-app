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
  const userInputs = [(yyyy = yearInput?.value), (mm = monthInput?.value), (dd = dayInput?.value)];

  let isValidYear = checkYear(...currentDate, ...userInputs);
  let isValidMonth = checkMonth(...currentDate, ...userInputs);
  let isValidDay = checkDay(...currentDate, ...userInputs);

  if (isValidDay && isValidMonth && isValidYear) {
    calculateAge(...userInputs);
  }
});

function calculateAge(...userInputs) {
  let birthDate = new Date(yyyy, mm - 1, dd);
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

    const counting = setInterval(updateCounting, 2000 / finalCount);

    function updateCounting() {
      initialCount = ++initialCount;
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

function checkYear(...[currentDate, userInputs]) {
  const isEmpty = yyyy.length === 0;

  yyyy = Number(yyyy);
  const isNumber = parseFloat(yyyy);
  const isInteger = Number.isInteger(yyyy);

  const isFutureYear = yyyy > currentYear;

  if (isEmpty) {
    toggleError(true, yearErrorMsg, "This field is required");
    return false;
  }
  if (!isInteger || yyyy < 1800) {
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

function checkMonth(...[currentDate, userInputs]) {
  const isEmpty = mm.length === 0;

  mm = Number(mm);
  const isNumber = parseFloat(mm);
  const isInteger = Number.isInteger(mm);

  const isInvalid = mm > 12 || mm < 1;

  const isFutureMonth = +mm > currentMonth && +yyyy === currentYear;
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

function checkDay(...[currentDate, userInputs]) {
  const isEmpty = dd.length === 0;

  dd = Number(dd);
  const isNumber = parseFloat(dd);
  const isInteger = Number.isInteger(dd);

  const totalDays = [
    null,
    (january = 31),
    (february = 28),
    (march = 31),
    (april = 30),
    (may = 31),
    (june = 30),
    (july = 31),
    (august = 31),
    (september = 30),
    (october = 31),
    (november = 30),
    (december = 31),
  ];

  let isLeapYear = checkLeapYear(yyyy);
  if (isLeapYear) totalDays[2] = 29;

  const isInvalid = dd > totalDays[mm] || dd < 1;

  const isFutureDay = +dd > currentDay && +mm === currentMonth && +yyyy === currentYear;

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

function checkLeapYear(yyyy) {
  return yyyy % 4 === 0 && !(yyyy % 100 === 0 && yyyy % 400 !== 0) ? true : false;
}
