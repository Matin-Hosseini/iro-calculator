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

const selectMonths = document.querySelectorAll(".selectopt");

//funcs
const showPaymentMonths = (conditions, method) => {
  const installmentsConditionsWrapper = document.querySelector(
    ".installments__conditions"
  );

  installmentsConditionsWrapper.innerHTML = "";

  conditions[method].months.forEach((item, index) => {
    installmentsConditionsWrapper.insertAdjacentHTML(
      "beforeend",
      `
        <button data-id="${item.id}" class="${index === 0 ? "active" : ""}">
          ${item.period} 
          ماهه
          ${item.desc ? ` (${item.desc})` : ""}
        </button>  
        `
    );
  });

  document
    .querySelectorAll(".installments__conditions button")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelector(".installments__conditions button.active")
          .classList.remove("active");
        btn.classList.add("active");
      });
    });
};
//funcs ends

//data layer
const conditions = {
  bank: {
    months: [
      {
        id: 1,
        period: 12,
        increasePercent: 25,
        checkPeriod: 13,
        minPrePaymentPercent: 0,
        loanInterestPercent: 23,
      },
      {
        id: 2,
        period: 18,
        increasePercent: 34,
        checkPeriod: 6,
        minPrePaymentPercent: 0,
        loanInterestPercent: 23,
      },
      {
        id: 3,
        period: 24,
        increasePercent: 34,
        checkPeriod: 6,
        minPrePaymentPercent: 0,
        loanInterestPercent: 23,
      },
      {
        id: 4,
        period: 36,
        increasePercent: 43,
        checkPeriod: 6,
        minPrePaymentPercent: 0,
        loanInterestPercent: 23,
      },
      {
        id: 5,
        period: 60,
        increasePercent: 35,
        checkPeriod: 6,
        minPrePaymentPercent: 60,
        loanInterestPercent: 26,
        desc: "فقط خودرو",
      },
    ],
  },
  promissory: {
    months: [
      {
        id: 1,
        period: 7,
        increasePercent: 30,
        checkPeriod: 6,
        minPrePaymentPercent: 40,
        loanInterestPercent: 23,
      },
      {
        id: 2,
        period: 12,
        increasePercent: 60,
        checkPeriod: 13,
        minPrePaymentPercent: 40,
        loanInterestPercent: 23,
      },
      {
        id: 3,
        period: 18,
        increasePercent: 90,
        checkPeriod: 6,
        minPrePaymentPercent: 40,
        loanInterestPercent: 23,
      },
    ],
  },
  biMonthlyCheck: {
    months: [
      { id: 1, period: 4, increasePercent: 5.5, minPrePaymentPercent: 0 },
      { id: 2, period: 8, increasePercent: 5.5, minPrePaymentPercent: 0 },
      { id: 3, period: 10, increasePercent: 5.5, minPrePaymentPercent: 0 },
    ],
  },
};
//data layer ends

selectMonths.forEach((monthInput) => {
  monthInput.addEventListener("input", (e) => {
    showPaymentMonths(conditions, e.target.value);
  });
});

showPaymentMonths(conditions, "bank");

separateNumberInput(productPriceInput);
separateNumberInput(prePaymentInput);

(() => {
  productPriceInput.focus();
})();

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

  const selectedCalculationMethod =
    document.querySelector(".selectopt:checked").value;

  const selectedMonth = document.querySelector(
    ".installments__conditions button.active"
  );

  const targetMonth = conditions[selectedCalculationMethod].months.find(
    (item) => item.id === +selectedMonth.dataset.id
  );

  if (
    selectedCalculationMethod === "bank" ||
    selectedCalculationMethod === "promissory"
  ) {
    const priceAfterIncrease = productPrice + productPrice * 0.05;

    const minPrePayment =
      (priceAfterIncrease * targetMonth.minPrePaymentPercent) / 100;

    if (prePayment < minPrePayment) {
      Swal.fire({
        title: "خطا!",
        text: `حداقل پیش پرداخت 
          ${Math.ceil(minPrePayment).toLocaleString()}
         تومان می باشد.`,
        icon: "error",
        confirmButtonText: "بازگشت",
      });

      return;
    }

    const priceAfterPrePayment = priceAfterIncrease - prePayment;

    const loanPrice =
      priceAfterPrePayment +
      (priceAfterPrePayment * targetMonth.increasePercent) / 100;

    const { monthlyPayment, totalPayment } = loanCalculation(
      loanPrice,
      targetMonth.loanInterestPercent,
      targetMonth.period
    );

    const guaranteeCheckDate = getDate(addDays(Date.now(), 180));
    const guaranteeCheckPrice = calculateGuaranteePrice(totalPayment, "check");

    const guaranteePromissoryPrice = calculateGuaranteePrice(
      totalPayment,
      "promissory"
    );

    const companyCheckDate = getDate(
      addDays(Date.now(), targetMonth.checkPeriod * 30)
    );

    installMentsInfoWrapper.innerHTML = `
      <div class="custom-info-box">
        <div class="custom-info-box__title">مبلغ تسهیلات</div>
        <div class="custom-info-box__content">${loanPrice.toLocaleString()} تومان</div>
      </div>
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
        <div class="custom-info-box__title">بازپرداخت </div>
        <div class="custom-info-box__content">
          <div class="d-flex align-items-center justify-content-around flex-wrap gap-2">
            <div class="d-flex flex-column align-items-center gap-1">
              <span style="color: #3b82f6;">تسهیلات</span>
              <span>${totalPayment.toLocaleString()} تومان</span>
            </div>
            <div class="d-flex flex-column align-items-center gap-1">
              <span style="color: #3b82f6;">کل</span>
              <span>
                ${(totalPayment + prePayment + monthlyPayment).toLocaleString()}
                تومان
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="custom-info-box">
        <div class="custom-info-box__title">ضمانت</div>
        <div class="custom-info-box__content">
          ${
            selectedCalculationMethod === "bank"
              ? `
                <div class="d-flex align-items-center justify-content-around flex-wrap gap-2">
                  <span>
                      چک صیادی به  تاریخ
                    ${guaranteeCheckDate.day}/
                    ${guaranteeCheckDate.month}/
                    ${guaranteeCheckDate.year}
                  </span>
                  <span>
                    به مبلغ ${guaranteeCheckPrice.toLocaleString()} تومان
                  </span>
              </div>
            `
              : ``
          }

          ${
            selectedCalculationMethod === "promissory"
              ? `
              <span>سفته به مبلغ ${guaranteePromissoryPrice.toLocaleString()} تومان</span>
            `
              : ``
          }
            
        </div>
      </div>
    `;
  } else if (selectedCalculationMethod === "biMonthlyCheck") {
    const increasePercent = targetMonth.period * targetMonth.increasePercent;

    const priceAfterIncrease =
      productPrice + (productPrice * increasePercent) / 100;

    const priceAfterPrepayment = priceAfterIncrease - prePayment;

    const paymentMonthPeriod = 2;

    const installMentPrice =
      (priceAfterPrepayment / targetMonth.period) * paymentMonthPeriod;

    const calculateInstallMentChecks = (
      targetMonthPeriod,
      paymentMonthPeriod
    ) => {
      let checks = [];

      for (let i = 0; i < targetMonthPeriod / paymentMonthPeriod; i++) {
        console.log("running for loop");
        if (i === 0) {
          checks.push({
            id: 1,
            date: getDate(addDays(Date.now(), 45)),
            price: installMentPrice,
          });
        } else {
          console.log(i);
          checks.push({
            id: i + 1,
            date: getDate(addDays(Date.now(), i * 60 + 45)),
            price: installMentPrice,
          });
        }
      }

      return checks;
    };

    const installmentChecks = calculateInstallMentChecks(
      targetMonth.period,
      paymentMonthPeriod
    );

    const guaranteeCheckPrice =
      priceAfterPrepayment + priceAfterPrepayment * 0.5;

    const guaranteeCheckDate = getDate(
      addDays(Date.now(), (targetMonth.period / 2) * 30)
    );

    installMentsInfoWrapper.innerHTML = `
      <div class="custom-info-box">
        <div class="custom-info-box__title">نحوه پرداخت اقساط</div>
        <div class="custom-info-box__content">
          <p class="fw-bold fs-6">چک صیادی</p>
          <div>
              ${installmentChecks
                .map(
                  (item) => `
                    <div class="d-flex align-items-center justify-content-around flex-wrap mb-2">
                      <span>
                        تاریخ: 
                        ${item.date.day}/
                        ${item.date.month}/
                        ${item.date.year}
                      </span>
                      <span>
                        مبلغ: ${Math.ceil(item.price).toLocaleString()} تومان
                      </span>
                    </div>
                `
                )
                .join("")}          
          </div>
        </div>
      </div>
      
      <div class="custom-info-box">
        <div class="custom-info-box__title">ضمانت</div>
        <div class="custom-info-box__content">
          <div class="d-flex align-items-center justify-content-around flex-wrap gap-2">
            <span>
             چک صیادی به  تاریخ 
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

      <div class="custom-info-box">
        <div class="custom-info-box__title">بازپرداخت(مجموع اقساط)</div>
        <div class="custom-info-box__content">
          <div class="d-flex align-items-center justify-content-around flex-wrap gap-2">
            <span>
                ${Math.floor(
                  (installMentPrice * targetMonth.period) / paymentMonthPeriod
                ).toLocaleString()} تومان
            </span>
          </div>
        </div>
      </div>
    `;
  }
};

calculateBtn.addEventListener("click", calculate);
document.addEventListener("keypress", (e) => {
  if (e.code === "Enter") {
    calculate();
  }
});
