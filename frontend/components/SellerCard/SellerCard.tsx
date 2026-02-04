"use client";
import "./sellercard.css";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/redux/hooks";
import { deleteProductThunk } from "@/app/redux/features/products/productSlice";
import { Alert, Snackbar } from "@mui/material";
import UpdateProductModal from "@/app/dashboard/Modal/UpdateProduct";

interface CardProps {
  id: number | string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  quantity: number;
  rating: number;
  images: string[];
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  price,
  category,
  subcategory,
  quantity,
  rating,
  images,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleClick = () => {
    router.push(`/product/${id}`);
  };

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
  };

  const handleDelete = async (id: number | string) => {
    try {
      await dispatch(deleteProductThunk(id));
      showSnackbar("Product deleted successfully", "success");
    } catch (error) {
      showSnackbar("Failed to delete order ❌", "error");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(null);
  };

  return (
    <div className="card">
      <div className="card_image">
        <img className="card_img" src={images[0]} alt="Loading..." />
      </div>

      <h3 className="property">{title}</h3>

      <p className="description">{description}</p>

      <div className="meta">
        <span className="badge">{category}</span>
        <span className="badge secondary">{subcategory}</span>
      </div>

      <div className="price">
        <p className="amount">${price}</p>
        <p className="rating">{rating}</p>
      </div>

      <p className={`stock ${quantity > 0 ? "in" : "out"}`}>
        {quantity > 0 ? `In Stock (${quantity})` : "Out of Stock"}
      </p>

      <div style={{ display: "flex", gap: "5px" }}>
        <button
          className="product_detail"
          onClick={() => {
            handleDelete(id);
          }}
        >
          Delete Product
        </button>
        <button
          className="product_detail"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Update Product
        </button>
      </div>

      <button className="product_detail" onClick={handleClick}>
        View Details
      </button>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar?.type || "success"}
          sx={{ width: "100%" }}
        >
          {snackbar?.message || ""}
        </Alert>
      </Snackbar>

      {isModalOpen && <UpdateProductModal id={id} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Card;
