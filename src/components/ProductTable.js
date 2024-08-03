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
  Box,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { supabase } from "../supabaseClient";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // Store the image URL
  const [open, setOpen] = useState(false);
  const [productsChanged, setProductsChanged] = useState(false); // State to trigger re-fetch
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    quantity: "",
    img_url: null,
  });

  useEffect(() => {
    getProducts();
  }, [productsChanged]);

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
    product = {
      id: null,
      name: "",
      description: "",
      price: "",
      quantity: "",
      img_url: "",
    }
  ) => {
    setCurrentProduct(product);
    setImageUrl(product.img_url); // Set the existing image URL
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImage(null); // Clear the image on close
    setImageUrl(""); // Clear the image URL on close
  };

  const handleSave = async () => {
    let img_url = currentProduct.img_url;

    if (image) {
      // Upload image and get the URL
      img_url = await uploadImage(image);
    } else if (img_url === "") {
      img_url = null; // Set to null if no image is selected
    }

    const productToSave = { ...currentProduct, img_url };

    if (currentProduct.id) {
      // Update existing product
      await updateProduct(productToSave);
    } else {
      // Create new product
      await createProduct(productToSave);
    }
    setProductsChanged((prev) => !prev);
    handleClose();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProductsChanged((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  async function uploadImage(file) {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) {
      alert("Error uploading image: " + error.message);
      return null;
    }

    const { publicURL, error: urlError } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    if (urlError) {
      alert("Error getting image URL: " + urlError.message);
      return null;
    }

    return publicURL;
  }

  async function createProduct(product) {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          img_url: product.img_url,
        })
        .single();
      if (error) throw error;
      console.log(data, "this");

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
              <TableCell align="right">Image</TableCell>
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
                  {product.img_url && (
                    <img
                      src={product.img_url}
                      alt={product.name}
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                  )}
                </TableCell>
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
          <Button variant="contained" component="label" sx={{ marginTop: 2 }}>
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
          {image && (
            <Box sx={{ marginTop: 2 }}>
              <Typography>Selected Image: {image.name}</Typography>
            </Box>
          )}
          {imageUrl && !currentProduct.id && (
            <Box sx={{ marginTop: 2 }}>
              <Typography>Uploaded Image URL: {imageUrl}</Typography>
            </Box>
          )}
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
