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
const installMentsContainer = document.querySelector(".installments__info");
const installMentsInfoWrapper = document.querySelector(".installments-info");

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

calculateBtn.addEventListener("click", () => {
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

  const period = +document.querySelector(
    ".installments__conditions button.active"
  ).dataset.period;

  const periodPercent = +document.querySelector(
    ".installments__conditions button.active"
  ).dataset.percent;

  const priceAfterIncrease = productPrice + productPrice * 0.05;
  const priceAfterPrePayment = priceAfterIncrease - prePayment;

  const loanPrice =
    priceAfterPrePayment + (priceAfterPrePayment * periodPercent) / 100;

  const { monthlyPayment, totalPayment } = loanCalculation(
    loanPrice,
    23,
    period
  );

  const checkDate = getDate(addDays(Date.now(), 180));
  const guaranteeCheckPrice = calculateGuaranteePrice(totalPayment, "check");

  // installMentsContainer.innerHTML = `

  //   <div class="installments__info-item">
  //       <div>
  //           <span>مبلغ قسط</span>
  //           <span>${monthlyPayment.toLocaleString()} تومان</span>
  //       </div>
  //       <div>
  //           <span>مبلغ وام</span>
  //           <span>${loanPrice.toLocaleString()} تومان</span>
  //       </div>

  //       <div>
  //           <span>تاریخ چک 6 ماهه</span>
  //           <span>
  //               ${checkDate.dayWeek}
  //               ${checkDate.year}/${checkDate.month}/${checkDate.day}
  //           </span>
  //       </div>
  //       <div>
  //           <span>مبلغ چک 6 ماهه</span>
  //           <span>
  //               ${monthlyPayment.toLocaleString()} تومان
  //           </span>
  //       </div>
  //       <div>
  //           <span>بازپرداخت وام</span>
  //           <span>${totalPayment.toLocaleString()} تومان</span>
  //       </div>
  //       <div>
  //           <div class="d-flex flex-column">
  //                   <span>بازپرداخت کل</span>
  //                   <span style="font-size: 0.7rem"
  //                     >بازپرداخت وام + پیش پرداخت + چک 6 ماهه</span
  //                   >
  //                 </div>
  //           <span>
  //             ${(totalPayment + prePayment + monthlyPayment).toLocaleString()}
  //             تومان
  //           </span>
  //       </div>
  //   </div>
  // `;

  installMentsInfoWrapper.innerHTML = `
  <div class="custom-info-box">
    <div class="custom-info-box__title">مبلغ تسهیلات</div>
    <div class="custom-info-box__content">${loanPrice.toLocaleString()} تومان</div>
  </div>
  <div class="custom-info-box">
    <div class="custom-info-box__title">مبلغ هر قسط</div>
    <div class="custom-info-box__content">
      <div class="d-flex align-items-center justify-content-around flex-wrap gap-2">
        <span>${period} قسط مساوی به مبلغ </span>
        <span>${monthlyPayment.toLocaleString()} تومان</span>
      </div>
    </div>
  </div>
  <div class="custom-info-box">
    <div class="custom-info-box__title">تاریخ و مبلغ چک 6 ماهه</div>
    <div class="custom-info-box__content">
      <div class="d-flex align-items-center justify-content-around flex-wrap gap-2">
        <span>
          یک فقره چک صیادی به  تاریخ 
          ${checkDate.year}/${checkDate.month}/${checkDate.day} 
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
      <div class="d-flex align-items-center justify-content-around flex-wrap gap-2">
        <span>
          یک فقره چک صیادی به  تاریخ 
          ${checkDate.year}/${checkDate.month}/${checkDate.day} 
        </span>
        <span>
          به مبلغ ${guaranteeCheckPrice.toLocaleString()} تومان
        </span>
      </div>
    </div>
  </div>
`;
});
