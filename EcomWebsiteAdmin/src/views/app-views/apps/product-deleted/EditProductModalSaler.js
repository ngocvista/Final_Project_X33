import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Spin,
  Switch,
  Tabs,
  notification,
  Button,
  Select,
  Row,
  Col,
  message,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import { updateProduct } from "services/productService"; // Đảm bảo rằng bạn có API để cập nhật sản phẩm

const { TabPane } = Tabs;
const { Option } = Select;

const EditProductModal = ({
  visible,
  onCancel,
  refreshProducts,
  categories,
  brands,
  productData, // Dữ liệu sản phẩm để chỉnh sửa
  users, // Danh sách người dùng (saler)
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState([]);
  const [content, setContent] = useState("");
  const [selectedSaler, setSelectedSaler] = useState(null);

  useEffect(() => {
    if (visible && productData) {
      form.setFieldsValue({
        productName: productData.productName,
        price: productData.price,
        discount: productData.discount,
        badge: productData.badge,
        stock: productData.stock,
        categoryId: productData.category._id,
        brandId: productData.brand._id,
        sellerId: productData.sellerId._id || null,
        isNewProduct: productData.isNewProduct,
        isSale: productData.isSale,
        isSpecial: productData.isSpecial,
      });
      setContent(productData.description);
      setVariations(productData.variations || []);
    }
  }, [visible, productData, form]);

  const handleFinish = async (values) => {
    if (!content) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập mô tả sản phẩm!",
      });
      return;
    }

    if (
      variations.some(
        (v) => !v.attributeName || !v.attributeValue || !v.price || !v.quantity
      )
    ) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin cho tất cả các biến thể!",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("price", values.price);
      formData.append("description", content);
      formData.append("discount", values.discount ?? "");
      formData.append("badge", values.badge ?? "");
      formData.append("stock", values.stock);
      formData.append("isNewProduct", values.isNewProduct);
      formData.append("isSale", values.isSale);
      formData.append("isSpecial", values.isSpecial);
      formData.append("categoryId", values.categoryId);
      formData.append("brandId", values.brandId);

      if (variations && variations.length > 0) {
        formData.append("variations", JSON.stringify(variations));
      }

      // Thêm sellerId vào formData
      const sellerId =
        values.sellerId || JSON.parse(localStorage.getItem("user")).userId; // Nếu không chọn thì lấy userId từ localStorage
      formData.append("sellerId", sellerId);

      await updateProduct(productData.productId, formData); // Gọi API cập nhật sản phẩm
      refreshProducts();
      form.resetFields();
      setVariations([]);
      setContent("");
      setSelectedSaler(null); // Reset sellerId
      onCancel();
      message.success("Cập nhật sản phẩm thành công");
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Cập nhật sản phẩm thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const addVariation = () => {
    const newVariation = {
      attributeName: "",
      attributeValue: "",
      price: "",
      quantity: "",
    };
    setVariations([...variations, newVariation]);
  };

  const removeVariation = (index) => {
    const updatedVariations = variations.filter((_, i) => i !== index);
    setVariations(updatedVariations);
  };

  const handleVariationChange = (index, field, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = value;
    setVariations(updatedVariations);
  };

  return (
    <Modal
      visible={visible}
      title="Chi Tiết Sản Phẩm"
      onCancel={onCancel}
      onOk={onCancel}
      getPopupContainer={(trigger) => trigger.parentNode}
      width={800}
    >
      <Spin spinning={loading}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông Tin Chung" key="1">
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Form.Item
                name="productName"
                label="Tên Sản Phẩm"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                ]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item label="Mô Tả" required>
                <Editor
                  disabled={true}
                  apiKey="igjpx91ezhzid8fokbcr4lo6ptz5ak4icvy0f9b6auggb44g"
                  value={content}
                  onEditorChange={setContent}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | styleselect | bold italic | link image | bullist numlist",
                  }}
                />
              </Form.Item>
              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
              >
                <Input type="number" disabled />
              </Form.Item>
              <Form.Item name="discount" label="Giảm Giá">
                <Input type="number" disabled />
              </Form.Item>
              <Form.Item
                name="stock"
                label="Số Lượng"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <Input type="number" disabled />
              </Form.Item>
              <Form.Item name="badge" label="Nhãn">
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Mới"
                name="isNewProduct"
                valuePropName="checked"
              >
                <Switch disabled />
              </Form.Item>
              <Form.Item label="Sale" name="isSale" valuePropName="checked">
                <Switch disabled />
              </Form.Item>
              <Form.Item
                label="Đặc Biệt"
                name="isSpecial"
                valuePropName="checked"
              >
                <Switch disabled />
              </Form.Item>
              <Form.Item
                label="Danh Mục"
                name="categoryId"
                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
              >
                <Select disabled placeholder="Chọn danh mục">
                  {categories.map((category) => (
                    <Option
                      key={category._id}
                      value={category._id}
                    >
                      {category.categoryName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Thương Hiệu"
                name="brandId"
                rules={[
                  { required: true, message: "Vui lòng chọn thương hiệu!" },
                ]}
              >
                <Select disabled placeholder="Chọn thương hiệu">
                  {brands.map((brand) => (
                    <Option key={brand._id} value={brand._id}>
                      {brand.brandName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {/* Thêm Select cho Saler */}
              <Form.Item
                label="Người Bán"
                name="sellerId"
                rules={[
                  { required: true, message: "Vui lòng chọn người bán!" },
                ]}
              >
                <Select disabled placeholder="Chọn người bán">
                  {users.map((user) => (
                    <Option key={user._id} value={user._id}>
                      {user.fullName} - {user.phoneNumber} - {user.email} - {user.role}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Lựa chọn" key="2">
            <div>
              {variations.map((variation, index) => (
                <Row key={index} gutter={16} style={{ marginBottom: 8 }}>
                  <Col span={5}>
                    <Input
                      disabled
                      placeholder="Tên thuộc tính"
                      value={variation.attributeName}
                      onChange={(e) =>
                        handleVariationChange(
                          index,
                          "attributeName",
                          e.target.value
                        )
                      }
                      required
                    />
                  </Col>
                  <Col span={5}>
                    <Input
                      disabled
                      placeholder="Giá trị thuộc tính"
                      value={variation.attributeValue}
                      onChange={(e) =>
                        handleVariationChange(
                          index,
                          "attributeValue",
                          e.target.value
                        )
                      }
                      required
                    />
                  </Col>
                  <Col span={5}>
                    <Input
                      placeholder="Giá"
                      type="number"
                      disabled
                      value={variation.price}
                      onChange={(e) =>
                        handleVariationChange(index, "price", e.target.value)
                      }
                      required
                    />
                  </Col>
                  <Col span={5}>
                    <Input
                      placeholder="Số lượng"
                      type="number"
                      disabled
                      value={variation.quantity}
                      onChange={(e) =>
                        handleVariationChange(index, "quantity", e.target.value)
                      }
                      required
                    />
                  </Col>
                </Row>
              ))}
            </div>
          </TabPane>
        </Tabs>
      </Spin>
    </Modal>
  );
};

export default EditProductModal;
