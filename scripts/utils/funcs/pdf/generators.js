import textReverser from "../textReverser.js";

export const generateList = ({ title, list }) => {
  return [
    { text: textReverser(title), margin: [0, 10, 0, 8] },
    ...list.map((item, index) => {
      return {
        text: textReverser(`-${index + 1} ${item}`),
        margin: [0, 0, 10, index === list.length - 1 ? 20 : 8],
        fontSize: 8,
      };
    }),
  ];
};
