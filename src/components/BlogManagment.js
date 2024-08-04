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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { supabase } from "../supabaseClient";

const BlogManagementPage = () => {
  const [articles, setArticles] = useState([]);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [currentArticle, setCurrentArticle] = useState({
    id: null,
    title: "",
    content: "",
    img_url: "",
    status: "draft",
  });
  const [statusFilter, setStatusFilter] = useState("published"); // Default filter for published articles

  useEffect(() => {
    getArticles();
  }, [statusFilter]);

  async function getArticles() {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", statusFilter);
      if (error) throw error;
      setArticles(data);
    } catch (error) {
      alert(error.message);
    }
  }

  const handleClickOpen = (article) => {
    setCurrentArticle(article);
    setImage(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImage(null);
    setCurrentArticle({
      id: null,
      title: "",
      content: "",
      img_url: "",
      status: "draft",
    });
  };

  const handleSave = async () => {
    if (image) {
      currentArticle.img_url = await uploadImage(image);
    }

    if (currentArticle.id) {
      // Update existing article
      await updateArticle(currentArticle);
    } else {
      // Create new article
      await createArticle(currentArticle);
    }
    getArticles(); // Refresh the article list
    handleClose();
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
      getArticles(); // Refresh the article list
    } catch (error) {
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentArticle((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  async function uploadImage(file) {
    const fileName = `${Date.now()}_${file.name}`;
    const folderName = "public";
    const path = `${folderName}/${fileName}`;
    const { data1, error } = await supabase.storage
      .from("images")
      .upload(path, file);

    if (error) {
      alert("Error uploading image: " + error.message);
      return null;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(path);

    return data.publicUrl;
  }

  async function createArticle(article) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .insert({
          title: article.title,
          content: article.content,
          img_url: article.img_url,
          status: article.status,
        })
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function updateArticle(article) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .update(article)
        .eq("id", article.id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Blog Management
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            handleClickOpen({
              id: null,
              title: "",
              content: "",
              img_url: "",
              status: "draft",
            })
          }
        >
          Add Article
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>{article.title}</TableCell>
                <TableCell>{article.content}</TableCell>
                <TableCell>
                  {article.img_url && (
                    <img
                      src={article.img_url}
                      alt={article.title}
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                  )}
                </TableCell>
                <TableCell>{article.status}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleClickOpen(article)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(article.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {currentArticle.id ? "Edit Article" : "Add Article"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            value={currentArticle.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Content"
            name="content"
            value={currentArticle.content}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            sx={{ marginTop: 2 }}
          />
          <Button variant="contained" component="label" sx={{ marginTop: 2 }}>
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {image && (
            <Box sx={{ marginTop: 2 }}>
              <Typography>Selected Image: {image.name}</Typography>
            </Box>
          )}
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={currentArticle.status}
              onChange={handleChange}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </FormControl>
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
    </Box>
  );
};

export default BlogManagementPage;
