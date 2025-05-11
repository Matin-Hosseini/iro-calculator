import { addDays, getDate } from "./utils/funcs/date.js";
import {
  calculateGuaranteePrice,
  getNumberSeparatedInputValue,
  loanCalculation,
  separateNumberInput,
} from "./utils/funcs/loan-demo.js";

const calculateBtn = document.querySelector(".calculate-btn");
const productPriceInput = document.querySelector("#price-input");
const prePaymentInput = document.querySelector("#custom-prepayment");
const installMentsInfoWrapper = document.querySelector(".installments-info");
const installmentsConditionsWrapper = document.querySelector(
  ".installments__conditions"
);

const conditionMonths = [
  { id: 1, period: 12, increasePercent: 25, checkPeriod: 13 },
  { id: 2, period: 18, increasePercent: 34, checkPeriod: 6 },
  { id: 3, period: 24, increasePercent: 34, checkPeriod: 6 },
  { id: 4, period: 36, increasePercent: 43, checkPeriod: 6 },
];

installmentsConditionsWrapper.innerHTML = "";
conditionMonths.forEach((item, index) => {
  installmentsConditionsWrapper.insertAdjacentHTML(
    "beforeend",
    `
      <button data-id="${item.id}" class="${index === 0 ? "active" : ""}">
        ${item.period} 
        ماهه
      </button>  
    `
  );
});

const date = new Date();

separateNumberInput(productPriceInput);
separateNumberInput(prePaymentInput);

(() => {
  productPriceInput.focus();
})();

document.querySelectorAll(".installments__conditions button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelector(".installments__conditions button.active")
      .classList.remove("active");
    btn.classList.add("active");
  });
});

const calculate = () => {
  const productPrice = getNumberSeparatedInputValue(productPriceInput);
  const prePayment = getNumberSeparatedInputValue(prePaymentInput);

  if (!productPrice) {
    Swal.fire({
      title: "خطا!",
      text: "قیمت کالا را وارد کنید.",
      icon: "error",
      confirmButtonText: "بازگشت",
    });

    return;
  } else if (productPrice < 1_000_000) {
    Swal.fire({
      title: "خطا!",
      text: "حداقل قیمت کالا 1 میلیون تومان می باشد.",
      icon: "error",
      confirmButtonText: "بازگشت",
    });

    return;
  } else if (prePayment >= productPrice) {
    Swal.fire({
      title: "خطا!",
      text: "پیش پرداخت نمی تواند بیشتر یا معادل مبلغ کالا باشد.",
      icon: "error",
      confirmButtonText: "بازگشت",
    });

    return;
  }

  const selectedMonth = document.querySelector(
    ".installments__conditions button.active"
  );

  const targetMonth = conditionMonths.find(
    (item) => item.id === +selectedMonth.dataset.id
  );

  console.log(targetMonth);

  const priceAfterIncrease = productPrice + productPrice * 0.05;
  const priceAfterPrePayment = priceAfterIncrease - prePayment;

  const loanPrice =
    priceAfterPrePayment +
    (priceAfterPrePayment * targetMonth.increasePercent) / 100;

  const { monthlyPayment, totalPayment } = loanCalculation(
    loanPrice,
    23,
    targetMonth.period
  );

  const guaranteeCheckDate = getDate(addDays(Date.now(), 180));
  const guaranteeCheckPrice = calculateGuaranteePrice(totalPayment, "check");

  const companyCheckDate = getDate(
    addDays(Date.now(), targetMonth.checkPeriod * 30)
  );

  installMentsInfoWrapper.innerHTML = `
  <div class="custom-info-box">
    <div class="custom-info-box__title">مبلغ هر قسط</div>
    <div class="custom-info-box__content">
      <div class="d-flex align-items-center justify-content-around flex-wrap gap-2">
        <span>${targetMonth.period} قسط مساوی به مبلغ </span>
        <span>${monthlyPayment.toLocaleString()} تومان</span>
      </div>
    </div>
  </div>
  <div class="custom-info-box">
    <div class="custom-info-box__title">تاریخ و مبلغ چک 
      ${targetMonth.checkPeriod} 
      ماهه
    </div>
    <div class="custom-info-box__content">
      <div class="d-flex align-items-center justify-content-around flex-wrap gap-2">
        <span>
          یک فقره چک صیادی به  تاریخ 
          ${companyCheckDate.day}/
          ${companyCheckDate.month}/
          ${companyCheckDate.year}
        </span>
        <span>
          به مبلغ یک قسط معادل ${monthlyPayment.toLocaleString()} تومان
        </span>
      </div>
    </div>
  </div>
  <div class="custom-info-box">
    <div class="custom-info-box__title">ضمانت</div>
    <div class="custom-info-box__content">
      <div class="d-flex align-items-center justify-content-around flex-wrap gap-2">
        <span>
          یک فقره چک صیادی به  تاریخ 
          ${guaranteeCheckDate.day}/
          ${guaranteeCheckDate.month}/
          ${guaranteeCheckDate.year}
        </span>
        <span>
          به مبلغ ${guaranteeCheckPrice.toLocaleString()} تومان
        </span>
      </div>
    </div>
  </div>
`;
};

calculateBtn.addEventListener("click", calculate);
document.addEventListener("keypress", (e) => {
  if (e.code === "Enter") {
    calculate();
  }
});
