import { addDays, getDate } from "./date.js";
import textReverser from "./textReverser.js";

export const loanCalculation = (
  loanPrice,
  annualInterestRate,
  returnMonths
) => {
  const monthlyInterestRate = annualInterestRate / 12 / 100;

  const monthlyPayment =
    (loanPrice *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, returnMonths)) /
    (Math.pow(1 + monthlyInterestRate, returnMonths) - 1);

  const totalPayment = monthlyPayment * returnMonths;
  const totalInterest = totalPayment - loanPrice;

  return {
    monthlyPayment: Math.ceil(+monthlyPayment),
    totalPayment: Math.ceil(+totalPayment),
    totalInterest: Math.ceil(+totalInterest),
  };
};

export const separateNumberInput = (input) => {
  input.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");

    const splittedValue = e.target.value.split(",");

    const numberedValue = Number(splittedValue.join(""));

    e.target.value = numberedValue.toLocaleString();

    if (e.target.value === "0") e.target.value = "";
  });
};

export const showPaymentMonths = (conditions, conditionType) => {
  const allConditions = conditions[conditionType];

  const months = allConditions.map((condition) => condition.conditionMonths);
  let montshWithoutDuplicate = [...new Set(months)];
  const sortedMonths = montshWithoutDuplicate.sort((a, b) => a - b);

  document.querySelector(".loan-installments-swiper-wrapper").innerHTML =
    sortedMonths
      .map(
        (month, index) => `
        <div class="swiper-slide">
          <button data-value="${month}" class="${index === 0 ? "active" : ""}">
            ${month} ماهه
          </button>
        </div>
      `
      )
      .join("");

  const swiper = new Swiper(".loan-installments-swiper", {
    loop: false,
    slidesPerView: 1,

    simulateTouch: false,

    breakpoints: {
      320: {
        slidesPerView: 1.5,
      },
      450: {
        slidesPerView: 2.5,
      },
      576: {
        slidesPerView: 3.5,
      },
      768: {
        slidesPerView: 4.5,
      },
    },

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  document.querySelectorAll(".loan-installments button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelector(".loan-installments button.active")
        .classList.remove("active");
      btn.classList.add("active");
    });
  });
};

export const getNumberSeparatedInputValue = (input) =>
  +input.value.trim().split(",").join("");

export const calculateGuaranteePrice = (price, guaranteeType) => {
  let guaranteePrice = null;

  switch (guaranteeType) {
    case "promissory":
      {
        guaranteePrice = price + (price * 50) / 100;
      }
      break;
    case "check":
      {
        guaranteePrice = price + (price * 25) / 100;
      }
      break;
    default: {
      guaranteePrice = price + (price * 25) / 100;
    }
  }

  guaranteePrice = Math.ceil(guaranteePrice);

  return guaranteePrice;
};

export const companyCalculation = (
  productPrice,
  condition,
  customPrepayment
) => {
  const initialIncrease =
    productPrice + (productPrice * condition.initialIncrease) / 100;

  const conditionTypeValue = document.querySelector(
    ".condition-types input[type='radio']:checked"
  ).value;

  let prePayment = 0;
  let loanPrice = 0;
  let remainPrice = 0;

  if (conditionTypeValue === "automobile") {
    if (condition.prePayments) {
      const prePayments = condition.prePayments.map((prePayment) => {
        const prePaymentPrice = Math.ceil(
          (initialIncrease * prePayment.percent) / 100
        );
        prePayment.prepaymentPrice = prePaymentPrice;

        return prePaymentPrice;
      });

      const prePaymentsSum = prePayments.reduce((a, b) => a + b);
      const remainingPrice = initialIncrease - prePaymentsSum;
      const loanPrice =
        remainingPrice + (remainingPrice * condition.secondaryIncrease) / 100;

      return { initialIncrease, loanPrice, prePayment: prePaymentsSum };
    }

    if (customPrepayment) {
      const remainingPrice = initialIncrease - customPrepayment;

      const loanPrice =
        remainingPrice + (remainingPrice * condition.secondaryIncrease) / 100;

      return { initialIncrease, loanPrice, prePayment: customPrepayment };
    }

    const prePayment = (initialIncrease * condition.prePayment) / 100;

    const remainingPrice = initialIncrease - prePayment;

    const loanPrice =
      remainingPrice + (remainingPrice * condition.secondaryIncrease) / 100;

    return { initialIncrease, loanPrice, prePayment };
  }

  if (customPrepayment) {
    prePayment = customPrepayment;
  } else {
    prePayment = (initialIncrease * condition.prePayment) / 100;
  }

  remainPrice = initialIncrease - prePayment;

  if (condition.secondaryIncrease) {
    loanPrice = remainPrice + (remainPrice * condition.secondaryIncrease) / 100;
  } else {
    loanPrice = initialIncrease - prePayment;
  }

  return { initialIncrease, loanPrice, prePayment };
};

export const showAllPayment = (rows) => {
  const allConditionsElem = document.querySelector(".condition-table tbody");
  const allConditionsTableHeader = document.querySelector(
    ".condition-table thead"
  );

  const hasSecondaryIncrease = rows.some((row) => row.secondaryIncrease);

  const rowConditionCounts = rows.map((row) =>
    row.prePayments ? row.prePayments.length : 0
  );
  const maxConditionCounts = Math.max(...rowConditionCounts);

  rows.map((row) => {
    if (row.prePayments) {
      console.log(row);

      const prePaymentsPercentages = row.prePayments.map(
        (prePayment) => prePayment.percent
      );
      const prePaymentsSum = prePaymentsPercentages.reduce((a, b) => a + b);
    }
  });

  allConditionsTableHeader.innerHTML = `
    <tr>
      <th>نام شرایط</th>
      <th>ضمانت</th>
      <th>ضامن</th>
      <th>مدت اقساط</th>
      <th>نرخ افزایش</th>
      <th>مبلغ افزایش</th>
      <th>پیش پرداخت</th>
      <th>مبلغ پیش پرداخت</th>
      ${
        maxConditionCounts > 0
          ? [...Array(maxConditionCounts).keys()]
              .map((item) => `<th>پیش پرداخت ${item + 1}</th>`)
              .join("")
          : ""
      }
      ${hasSecondaryIncrease ? "<th>درصد افزایش ثانویه</th>" : ""}
      <th>مبلغ تسهیلات</th>
      <th>مبلغ قسط</th>
      <th>مبلغ چک/سفته ضمانت</th>
      <th>تحویل</th>
    </tr>
  `;

  allConditionsElem.innerHTML = rows
    .map((row) => {
      return `
        <tr>
        <td>${row.title}</td>
          <td>${row.guaranteeTypeTitle}</td>
          <td>
            <span
              class="
              ${row.hasGuarantor ? "withGuarantor" : "withoutGuarantor"}"
            >
                ${row.hasGuarantorTitle}
            </span>
          </td>
          <td>${row.conditionMonths} ماهه</td>
          <td>${row.initialIncrease}%</td>
          <td>${row.initialIncreasePrice.toLocaleString()} تومان</td>
          <td>${
            row.prePayments
              ? row.prePayments
                  .map((prePayment) => prePayment.percent)
                  .reduce((a, b) => a + b)
              : row.prePayment
          }%</td>
          <td>${row.prePaymentPrice.toLocaleString()} تومان</td>
           ${
             maxConditionCounts > 0
               ? [...Array(maxConditionCounts).keys()]
                   .map((item) =>
                     row.prePayments
                       ? row.prePayments[item]
                         ? `
                          <td>
                            ${row.prePayments[item].percent}% 
                            <br/>
                            ${row.prePayments[
                              item
                            ].prepaymentPrice.toLocaleString()} تومان 
                            <br/>
                            ${getDate(
                              addDays(Date.now(), row.prePayments[item].days)
                            ).getCompleteFormat()}
                          </td>`
                         : "<td>--------</td>"
                       : "<td>--------</td>"
                   )
                   .join("")
               : ""
           }
          ${hasSecondaryIncrease ? `<td>${row.secondaryIncrease}%</td>` : ""}
          <td>${row.loanPrice.toLocaleString()} تومان</td>
          <td>${row.monthlyPayment.toLocaleString()} تومان</td>
          <td>${row.guaranteePrice.toLocaleString()} تومان</td>
          <td>${row.deliveryTitle}</td>

        </tr>
      `;
    })
    .join("");
};

export const createPdfTableHeader = (text) => {
  return {
    text: textReverser(text),
    style: "tableHeader",
    // fillColor: "#d97706",
  };
};

export const createPdfTableBody = (text) => {
  return { text: textReverser(text), style: "tableContent" };
};

export const createDeliveryTitle = (amount) => {
  switch (amount) {
    case 0: {
      return "فوری";
    }
    case 3: {
      return "72 ساعته";
    }
    case 21: {
      return "21 روزه";
    }
    case 30: {
      return "1 ماهه";
    }
    case 60: {
      return "2 ماهه";
    }
    case 90: {
      return "سه ماهه";
    }
    case 180: {
      return "6 ماهه";
    }
    case 270: {
      return "9 ماهه";
    }
    case 365: {
      return "1 ساله";
    }
    default: {
      return "نا مشخص";
    }
  }
};
