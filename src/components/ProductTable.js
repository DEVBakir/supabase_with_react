import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { supabase } from "../supabaseClient";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  useEffect(() => {
    getProducts();
  }, []);
  async function getProducts() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(10);
      if (error) throw error;
      if (data != null) setProducts(data);
    } catch (error) {
      alert(error.message);
    }
  }
  const handleClickOpen = (
    product = { id: null, name: "", description: "", price: "", quantity: "" }
  ) => {
    setCurrentProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (currentProduct.id) {
      // Update existing product
      await updateProduct(currentProduct);
      setProducts(
        products.map((product) =>
          product.id === currentProduct.id ? currentProduct : product
        )
      );
    } else {
      // Create new product
      const newProduct = await createProduct(currentProduct);
      setProducts([...products, newProduct]);
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  async function createProduct(product) {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([product])
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function updateProduct(product) {
    try {
      const { data, error } = await supabase
        .from("products")
        .update(product)
        .eq("id", product.id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function deleteProduct(id) {
    try {
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleClickOpen()}
      >
        Add Product
      </Button>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Price ($)</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell component="th" scope="row">
                  {product.name}
                </TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell align="right">{product.price}</TableCell>
                <TableCell align="right">{product.quantity}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleClickOpen(product)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(product.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {currentProduct.id ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={currentProduct.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={currentProduct.description}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Price"
            name="price"
            value={currentProduct.price}
            onChange={handleChange}
            type="number"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Quantity"
            name="quantity"
            value={currentProduct.quantity}
            onChange={handleChange}
            type="number"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductTable;
