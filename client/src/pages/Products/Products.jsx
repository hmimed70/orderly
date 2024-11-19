import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";


import { useTranslation } from "react-i18next";

import { HiPlus } from "react-icons/hi";
import { useDeleteProduct, useProducts } from "../../hooks/useProduct";
import SearchBar from "../../components/shared/SearchBar";
import RowsPerPageSelector from "../../components/shared/RowsPage";
import DateFilter from "../../components/shared/DateFilter";
import ProductTable from "../../components/products/ProductTable";
import Pagination from "../../components/shared/Pagination";
import ColumnVisibilityToggle from "../../components/shared/ColumnVisibilty";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import AddProduct from "./AddProduct";
import Modal from "../../components/shared/MyModal";

const Products = () => {
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sendedVal, setSendedVal] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { isLoading, data, error } =  useProducts(currentPage, rowsPerPage, dateRange, sendedVal);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  const { isDeleting, deleteProduct } = useDeleteProduct();


  const [visibleColumns, setVisibleColumns] = useState(() => {
    const savedColumns = localStorage.getItem("visibleColumnsProudct");
    return savedColumns
      ? JSON.parse(savedColumns)
      : {
          id: true,
          name: true,
          quantity: true,
          selling_price: true,
          quantity_out: true,
          user : true,
          facebook_url: true,
          youtube_url: true,
          product_sku: true,
          createdAt: true,
          actions: true,
        };
  });

  const toggleColumnVisibility = useCallback((column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  }, []);


  useEffect(() => {
    localStorage.setItem("visibleColumnsProudct", JSON.stringify(visibleColumns));
  }, [visibleColumns]);


  const handleDateRangeChange = useCallback((dates) => {
    setDateRange(dates);
  }, []);

  const handleDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setIsModalOpen(true);
  };



  const { productsCount, products, filteredProductsCount } = data || {};


  // Debounced function to update the search term after 3 seconds of inactivity
  const debounceSearch = useCallback(
    debounce((value) => {
      setSendedVal(value);
    }, 1000),
    []
  );
  // Trigger the search with debounced value
  const handleSearch = (value) => {
    setSearchTerm(value);
    debounceSearch(value); // Use debounce to delay the search term update
  };
  const closeModalAdd = () => {
    setIsModalAddOpen(false);
  };
  const handleAddClick = () => {
    setIsModalAddOpen(true);
  };
  if (isLoading) return <p>{t("ordersPage.loadingOrders")}</p>;
  if (error) return <p>{t("ordersPage.error")}</p>;

  const totalOrders = filteredProductsCount;
  const totalPages = Math.ceil(totalOrders / rowsPerPage) || 1;

  return (
    <div>
      <h1 className="text-2xl font-bold">{t("ordersPage.title")}</h1>
      <div className=" items-center justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="flex justify-center">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearch} // Using the new debounced search handler
          />
        </div>

        <div className="flex justify-center">
          <DateFilter dateRange={dateRange} handleDateRangeChange={handleDateRangeChange} />
        </div>

        <div className="flex justify-center">
          <RowsPerPageSelector
            rowsPerPage={rowsPerPage}
            handleRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            ordersCount={productsCount}
          />
        </div>
      </div>

      <div className="flex justify-end items-center gap-x-4">
      <button onClick={handleAddClick} className="py-3 px-6 rounded-md bg-orange-600 cursor-pointer text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600">
          <HiPlus />
        </button>
      </div>


      <ProductTable
        products={products} // Using filtered orders for the table
        visibleColumns={visibleColumns}
        toggleColumnVisibility={toggleColumnVisibility}
        onDeleteProduct={handleDeleteProduct}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={setCurrentPage}
        totalOrders={totalOrders}
        ordersCount={productsCount}
      />

<ColumnVisibilityToggle
  visibleColumns={visibleColumns}
  toggleColumnVisibility={toggleColumnVisibility}
/>
      {isModalOpen && (
        <ConfirmationModal
          disable={isDeleting}
          message={t("productsPage.deleteConfirmation")}
          onConfirm={() => {
            deleteProduct(productToDelete);
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
          {isModalAddOpen && 
                <Modal isVisible={isModalAddOpen} onClose={closeModalAdd}>
          <AddProduct onClose={closeModalAdd} />
          </Modal>
          }
    </div>
  );
};

export default Products;
