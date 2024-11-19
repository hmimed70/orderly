import  { useState } from "react";
import { HiTrash, HiPencilAlt, HiEye } from "react-icons/hi";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "../shared/MyModal";
import EditProduct from "../../pages/Products/EditProduct";
import ViewProduct from "../../pages/Products/ViewProduct";

const ProductTable = ({
  products,
  visibleColumns,
  onDeleteProduct,
}) => {
  const { t } = useTranslation();
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleEditClick = (prodId) => {
    setSelectedProductId(prodId);
    setIsModalEditOpen(true);
  };

  const closeModalEdit = () => {
    setIsModalEditOpen(false);
    setSelectedProductId(null);
  };
  const handleViewClick = (prodId) => {
    setSelectedProductId(prodId);
    setIsModalViewOpen(true);
  };

  const closeModalView = () => {
    setIsModalViewOpen(false);
    setSelectedProductId(null);
  };


  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            {visibleColumns.id && <th className="px-4 py-2">{t("ID")}</th>}
            {visibleColumns.name && <th className="px-4 py-2">{t("Name")}</th>}
            {visibleColumns.quantity && <th className="px-4 py-2">{t("Quantity")}</th>}
            {visibleColumns.quantity_out && <th className="px-4 py-2">{t("quantity_out")}</th>}

            {visibleColumns.selling_price && (
              <th className="px-4 py-2">{t("Selling Price")}</th>
            )}
            {visibleColumns.user && <th className="px-4 py-2">{t("User")}</th>}
            {visibleColumns.facebook_url && (
              <th className="px-4 py-2">{t("Facebook URL")}</th>
            )}
            {visibleColumns.youtube_url && (
              <th className="px-4 py-2">{t("YouTube URL")}</th>
            )}
            {visibleColumns.product_sku && (
              <th className="px-4 py-2">{t("Product SKU")}</th>
            )}
            {visibleColumns.createdAt && (
              <th className="px-4 py-2">{t("Created At")}</th>
            )}
            {visibleColumns.actions && (
              <th className="px-4 py-2">{t("Actions")}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr
                key={product._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {visibleColumns.id && <td className="px-4 py-2">{product.nbr_product}</td>}
                {visibleColumns.name && (
                  <td className="px-4 py-2">{product.name}</td>
                )}
                {visibleColumns.quantity && (
                  <td className="px-4 py-2">{product.quantity}</td>
                )}
                 {visibleColumns.quantity_out && (
                  <td className="px-4 py-2">{product.quantity_out}</td>
                )}
                {visibleColumns.selling_price && (
                  <td className="px-4 py-2">{product.selling_price}</td>
                )}
                {visibleColumns.user && <td className="px-4 py-2">{product.user ? product.user.fullname : 'N/A' }</td>}
                {visibleColumns.facebook_url && (
                  <td className="px-4 py-2">
                    {product.facebook_url ?  (
                    <a
                      href={product.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {t("View")}
                    </a>

                    ): 'N/A'}
                  </td>
                )}
                {visibleColumns.youtube_url && (
                  <td className="px-4 py-2">
                    {product.youtube_url ?  (

                    <a
                      href={product.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {t("View")}
                    </a>
                                        ): 'N/A'}

                  </td>
                )}
                {visibleColumns.product_sku && (
                  <td className="px-4 py-2">{product.product_sku}</td>
                )}
                {visibleColumns.createdAt && (
                  <td className="px-4 py-2">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                )}
                {visibleColumns.actions && (
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleViewClick(product._id)}
                    >
                      <HiEye className="text-2xl" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => onDeleteProduct(product._id)}
                    >
                      <HiTrash  className="text-2xl" />
                    </button>
                    <button
                      className="text-green-600 hover:text-blue-800"
                      onClick={() => handleEditClick(product._id)}
                    >
                      <HiPencilAlt className="text-2xl"/>
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="100%" className="px-4 py-2 text-center">
                {t("No products found")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isModalEditOpen && 
      <Modal isVisible={isModalEditOpen} onClose={closeModalEdit}>
      <EditProduct id={selectedProductId} onClose={closeModalEdit} />
      </Modal>
      }
            {isModalViewOpen && 
      <Modal isVisible={isModalViewOpen} onClose={closeModalView}>
      <ViewProduct id={selectedProductId} onClose={closeModalView} />
      </Modal>
      }
    </div>
  );
};

ProductTable.propTypes = {
  products: PropTypes.array.isRequired,
  visibleColumns: PropTypes.object.isRequired,
  toggleColumnVisibility: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
};

export default ProductTable;
