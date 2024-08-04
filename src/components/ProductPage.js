import React from "react";
import { Container, Typography } from "@mui/material";
import ProductTable from "./ProductTable";
import ProductCountDisplay from "./ProductCountDisplay";
const ProductPage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <ProductCountDisplay />
      <ProductTable />
    </Container>
  );
};

export default ProductPage;
