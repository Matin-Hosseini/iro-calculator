import { pdfTableLayout } from "../constants/loan-demo.js";
import { addDays, addMonths, getDate } from "./date.js";
import {
  createDeliveryTitle,
  createPdfTableBody,
  createPdfTableHeader,
} from "./loan-demo.js";
import textReverser, { charReverser } from "./textReverser.js";

export const createPrePaymentPartsTable = (condition) => {
  return condition.prePayments
    ? [
        {
          text: textReverser(`شرایط ${condition.conditionMonths} ماهه`),
          alignment: "right",
          fontSize: 10,
          color: "#2563eb",
          // background: "#eff6ff",
          margin: [0, 10, 0, 5],
        },
        {
          table: {
            widths: ["*", "*", "*", "*"],
            body: [
              [
                createPdfTableHeader("عنوان"),
                createPdfTableHeader("نحوه پرداخت"),
                createPdfTableHeader("تاریخ پرداخت"),
                createPdfTableHeader("قیمت"),
              ].reverse(),

              ...condition.prePayments.map((prepayment) =>
                [
                  createPdfTableBody(prepayment.title),
                  createPdfTableBody(prepayment.comment),
                  createPdfTableBody(
                    prepayment.days !== 0
                      ? charReverser(
                          getDate(
                            addDays(Date.now(), prepayment.days)
                          ).getCompleteFormat()
                        )
                      : "همزمان با امضای قراداد"
                  ),
                  createPdfTableBody(
                    prepayment.prepaymentPrice.toLocaleString()
                  ),
                ].reverse()
              ),
            ],
          },
          pageBreak: "avoid",
          layout: pdfTableLayout,
          margin: [0, 0, 0, 5],
        },
        {
          table: {
            widths: ["*", "*", "*", "*", "*", "*"],
            body: [
              [
                createPdfTableHeader("الباقی قسط"),
                createPdfTableHeader("مبلغ هر قسط"),
                createPdfTableHeader("تاریخ اولین قسط"),
                createPdfTableHeader("تاریخ آخرین قسط"),
                createPdfTableHeader("تحویل"),
                createPdfTableHeader("مبلغ چک ضمانت"),
              ].reverse(),

              [
                createPdfTableBody(`${condition.conditionMonths} قسط`),
                createPdfTableBody(
                  `${condition.monthlyPayment.toLocaleString()} تومان`
                ),
                createPdfTableBody(
                  charReverser(
                    getDate(addDays(Date.now(), 45)).getCompleteFormat()
                  )
                ),
                createPdfTableBody(
                  charReverser(
                    getDate(
                      addMonths(Date.now(), condition.conditionMonths)
                    ).getCompleteFormat()
                  )
                ),
                createPdfTableBody(createDeliveryTitle(condition.delivery)),
                createPdfTableBody(
                  `${condition.guaranteePrice.toLocaleString()} تومان`
                ),
              ].reverse(),
            ],
          },
          pageBreak: "avoid",
          layout: pdfTableLayout,
          margin: [0, 0, 0, 5],
        },
      ]
    : [];
};
