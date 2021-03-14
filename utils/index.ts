export const driveToDirectImageURL = (imageURL) => {
  let finalURL = "";
  try {
    let fileId = imageURL
      .split("https://drive.google.com/file/d/")[1]
      .split("/")[0];
    finalURL = "https://drive.google.com/uc?export=view&id=" + fileId;
  } catch (err) {
    finalURL = imageURL;
  }
  return finalURL;
};
