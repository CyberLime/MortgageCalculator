const calculator = document.getElementById("calculator")! as HTMLFormElement;
const clear = document.querySelector(".clear")! as HTMLButtonElement;

const amount = document.getElementById("amount")! as HTMLInputElement;
const term = document.getElementById("term")! as HTMLInputElement;
const rate = document.getElementById("rate")! as HTMLInputElement;

amount.addEventListener("keydown", inputChangeHandler);
term.addEventListener("keydown", inputChangeHandler);
rate.addEventListener("keydown", inputChangeHandler);

calculator.addEventListener("submit", formSubmitHandler);
clear.addEventListener("click", clearHandler);

function inputChangeHandler(event: any) {
  const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];

  if (
    nums.indexOf(event.key) === -1 &&
    event.key !== "Backspace" &&
    event.key !== "Delete"
  ) {
    event.preventDefault();
  }

  setTimeout(() => {
    if (event.target.id === "term" && +event.target.value > 99) {
      event.preventDefault();
      event.target.value = "99";
    } else if (event.target.id === "rate" && +event.target.value > 100) {
      event.preventDefault();
      event.target.value = "100";
    }
  }, 0);

  if (
    event.target.value.split("").filter((e: string) => e === ".").length >= 1 &&
    event.key === "."
  ) {
    event.preventDefault();
  }

  if (
    event.target.id === "term" &&
    event.target.value === "99" &&
    event.key !== "Backspace" &&
    event.key !== "Delete"
  ) {
    event.preventDefault();
  } else if (
    event.target.id === "rate" &&
    event.target.value === "100" &&
    event.key !== "Backspace" &&
    event.key !== "Delete"
  ) {
    event.preventDefault();
  }
}

function clearHandler(): void {
  const amount = document.getElementById("amount")! as HTMLInputElement;
  const term = document.getElementById("term")! as HTMLInputElement;
  const rate = document.getElementById("rate")! as HTMLInputElement;
  const repayment = document.getElementById("repayment")! as HTMLInputElement;
  const interest = document.getElementById("interest")! as HTMLInputElement;

  amount.value = "";
  term.value = "";
  rate.value = "";
  repayment.checked = false;
  interest.checked = false;
}

function formSubmitHandler(event: Event): void {
  event.preventDefault();

  const amount = document.getElementById("amount")! as HTMLInputElement;
  const term = document.getElementById("term")! as HTMLInputElement;
  const rate = document.getElementById("rate")! as HTMLInputElement;
  const repayment = document.getElementById("repayment")! as HTMLInputElement;
  const interest = document.getElementById("interest")! as HTMLInputElement;

  const inputs = document.querySelectorAll(
    ".input"
  )! as NodeListOf<HTMLDivElement>;
  
  if (
    !amount.value ||
    !term.value ||
    !rate.value ||
    (!repayment.checked && !interest.checked)
  ) {
    if (!amount.value) {
      inputs[0].className = "amount input error";
    } else {
      inputs[0].className = "amount input";
    }

    if (!term.value) {
      inputs[1].className = "term input error";
    } else {
      inputs[1].className = "term input";
    }

    if (!rate.value) {
      inputs[2].className = "interest input error";
    } else {
      inputs[2].className = "interest input";
    }

    if (!repayment.checked && !interest.checked) {
      inputs[3].className = "type input error";
    } else {
      inputs[3].className = "type input";
    }

    return;
  }

  
  inputs[0].className = "amount input";
  inputs[1].className = "term input";
  inputs[2].className = "interest input";
  inputs[3].className = "type input";

  const monthly = document.querySelector(
    ".ready > .price > h2"
  )! as HTMLHeadingElement;
  const total = document.querySelector(
    ".ready > .price > h3"
  )! as HTMLHeadingElement;
  const sections = document.querySelectorAll(
    ".result"
  )! as NodeListOf<HTMLElement>;

  const repayments = calculateMortgage(amount.value, term.value, rate.value);

  monthly.innerHTML = formatter.format(+repayments);
  total.innerHTML = formatter.format(+repayments * +term.value * 12);

  sections.forEach((e, i) => {
    if (i == 0) {
      e.classList.add("hidden");
    } else {
      e.classList.remove("hidden");
    }
  });
}

function calculateMortgage(a: string, t: string, r: string): string | void {
  const amount = +a;
  const term = +t;
  const rate = +r;

  const repayment = document.getElementById("repayment")! as HTMLInputElement;
  const interest = document.getElementById("interest")! as HTMLInputElement;

  if (repayment.checked) {
    return (
      (((amount * rate) / 1200) * (1 + rate / 1200) ** (term * 12)) /
      ((1 + rate / 1200) ** (term * 12) - 1)
    ).toFixed(2);
  } else if (interest.checked) {
    return ((amount * rate) / 1200).toFixed(2);
  }
}

const formatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "GBP",
});

const amountFormatter = Intl.NumberFormat("en-US", {
  style: "decimal",
});
