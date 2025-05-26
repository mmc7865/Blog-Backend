const ImageKit = require("imagekit");

var imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadImage = async (file)=>{
    let imageUrl = null;
    // console.log(file)
    if (file) {
      const uploadResponse = await imagekit.upload({
        file: file.buffer, 
        fileName: Date.now() + "_" + file.originalname,
        folder: "/blog-project-images",
      });

     return imageUrl = uploadResponse.url;
    }
}

module.exports = uploadImage