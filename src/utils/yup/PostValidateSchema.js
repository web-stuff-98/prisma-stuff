import * as Yup from "yup";

export default Yup.object().shape({
  title: Yup.string().required().max(80),
  description: Yup.string().required().max(160),
  tags: Yup.string()
    .max(70, "Tags too long. Maximum 80 characters")
    .test(
      "missingHashtag",
      "You need an # symbol for each tag.",
      (value) => value && value.charAt(0) === "#"
    )
    .test(
      "tooManyTags",
      "Maximum 6 tags.",
      (value) =>
        value && value.split("#").filter((t) => t.trim() !== "").length < 7
    )
    .test(
      "tagTooLong",
      "One of your tags is too long. Max 24 characters for each tag.",
      (value) => {
        if (!value) return true;
        const tags = value.split("#");
        for (const tag of tags) {
          if (tag.length > 24) return false;
        }
        return true;
      }
    )
    .required(),
  content: Yup.string().required().max(6000),
  base64coverImage: Yup.string().notRequired(),
});
