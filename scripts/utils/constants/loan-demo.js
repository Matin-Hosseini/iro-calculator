export const pdfTableLayout = {
  fillColor: function (rowIndex) {
    return rowIndex % 2 === 0 ? "#e9ecef" : null;
  },
  hLineWidth: function (i, node) {
    return 0.1;
  },
  vLineWidth: function (i, node) {
    // Check if it's the last vertical line (right border)
    if (i === 0) return 0.1;
    // if (i === 3) return 0.1;

    return i === node.table.body[0].length ? 0.1 : 0;
  },
  hLineColor: function () {
    return "#94a3b8";
  },
  vLineColor: function () {
    return "#94a3b8";
  },
};
