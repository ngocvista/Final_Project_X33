import ProductImage from "../models/productImage.model.js";
import Product from "../models/product.model.js";
import { uploadFileToFirebase } from "../services/firebase.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Lấy tất cả hình ảnh của một sản phẩm
export const getProductImages = async (req, res) => {
  try {
    const { productId } = req.params;
    const images = await ProductImage.find({ product: productId });

    const imageDTOs = images.map((image) => ({
      imageId: image._id,
      imageUrl: image.imageUrl,
      isDefault: image.isDefault,
    }));

    res
      .status(200)
      .json(
        new ApiResponse(200, imageDTOs, "Lấy hình ảnh sản phẩm thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi lấy hình ảnh sản phẩm"));
  }
};

// Tạo hình ảnh sản phẩm mới và cập nhật Product
export const createProductImage = async (req, res) => {
  try {
    const { productId } = req.params;
    const imageFile = req.file;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Không tìm thấy sản phẩm"));
    }

    const imageUrl = await uploadFileToFirebase(
      imageFile.buffer,
      imageFile.originalname,
      imageFile.mimetype
    );

    const productImage = new ProductImage({
      product: productId,
      imageUrl,
      isDefault: false,
    });

    const createdImage = await productImage.save();
    product.images.push(createdImage._id); // Thêm hình ảnh vào danh sách images của sản phẩm
    await product.save();

    const imageDTO = {
      imageId: createdImage._id,
      imageUrl: createdImage.imageUrl,
      isDefault: createdImage.isDefault,
    };

    res
      .status(201)
      .json(new ApiResponse(201, imageDTO, "Tạo hình ảnh sản phẩm thành công"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi tạo hình ảnh sản phẩm"));
  }
};

// Cập nhật hình ảnh sản phẩm
export const updateProductImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const imageFile = req.file;

    const productImage = await ProductImage.findById(imageId);
    if (!productImage) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Hình ảnh không tồn tại"));
    }

    const imageUrl = await uploadFileToFirebase(
      imageFile.buffer,
      imageFile.originalname,
      imageFile.mimetype
    );
    productImage.imageUrl = imageUrl;
    const updatedImage = await productImage.save();

    const imageDTO = {
      imageId: updatedImage._id,
      imageUrl: updatedImage.imageUrl,
      isDefault: updatedImage.isDefault,
    };

    res
      .status(200)
      .json(
        new ApiResponse(200, imageDTO, "Cập nhật hình ảnh sản phẩm thành công")
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi cập nhật hình ảnh sản phẩm"));
  }
};

// Xóa hình ảnh sản phẩm và cập nhật Product
export const deleteProductImage = async (req, res) => {
  try {
    const { productId, imageId } = req.params;

    const productImage = await ProductImage.findById(imageId);
    if (!productImage) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Hình ảnh không tồn tại"));
    }

    await ProductImage.deleteOne({ _id: imageId });

    // Cập nhật lại danh sách images trong Product
    await Product.findByIdAndUpdate(productId, { $pull: { images: imageId } });

    res
      .status(200)
      .json(new ApiResponse(200, null, "Xóa hình ảnh sản phẩm thành công"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi xóa hình ảnh sản phẩm"));
  }
};

// Thay đổi trạng thái hình ảnh mặc định cho sản phẩm
export const changeDefaultImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const isDefault = req.query.isDefault === "true";

    const selectedImage = await ProductImage.findById(imageId);
    if (!selectedImage) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Hình ảnh không tồn tại"));
    }

    // Nếu isDefault được đặt thành true, đặt tất cả các hình ảnh khác của sản phẩm này thành không mặc định
    if (isDefault) {
      await ProductImage.updateMany(
        { product: selectedImage.product, _id: { $ne: imageId } },
        { isDefault: false }
      );
    }

    // Cập nhật trạng thái mặc định cho hình ảnh được chọn
    selectedImage.isDefault = isDefault;
    await selectedImage.save();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Cập nhật trạng thái mặc định hình ảnh thành công"
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Lỗi khi cập nhật hình ảnh mặc định"));
  }
};
