const textReverser = (text) => {
  const firstSpaceIncex = text.indexOf(" ");

  if (firstSpaceIncex !== -1) {
    text =
      text.slice(0, firstSpaceIncex) + "  " + text.slice(firstSpaceIncex + 1);
  }

  return text.split(" ").reverse().join(" ");
};

export const charReverser = (text) => text.split("").reverse().join("");

export default textReverser;
