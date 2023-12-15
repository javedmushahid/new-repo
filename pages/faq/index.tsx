import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { addFaq, deleteFaq, getAllFaq, getFaq, updateFaq } from "apiSetup";

interface FAQ {
  _id: string;
  title: string;
  content: string;
}

const FAQManagement = () => {
  const [open, setOpen] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]); // Use the FAQ interface
  const [newFaq, setNewFaq] = useState<FAQ>({
    _id: "",
    title: "",
    content: "",
  }); // Use the FAQ interface
  const [editedFaq, setEditedFaq] = useState<FAQ>({
    _id: "",
    title: "",
    content: "",
  }); // Use the FAQ interface
  const [editDialogOpen, setEditDialogOpen] = useState(false); //
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewedFaq, setViewedFaq] = useState<FAQ>({
    _id: "",
    title: "",
    content: "",
  }); // Use the FAQ interface
  const handleViewDialogOpen = (faq) => {
    setViewedFaq(faq);
    setViewDialogOpen(true);
  };
  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const response = await addFaq(newFaq);
      if (response.status === 200) {
        // After successfully adding a new FAQ, update the FAQ list
        const updatedFaqs = [...faqs, response.data];
        setFaqs(updatedFaqs);
        handleClose();
      } else {
        console.error("Failed to add FAQ");
        // You can display an error message to the user here
      }
    } catch (error) {
      console.error("Error adding FAQ:", error);
      // You can display an error message to the user here
    }
  };

  const fetchFaqs = async () => {
    try {
      const response = await getAllFaq();
      console.log("API Response:", response); // Add this line
      if (response.status === 200) {
        setFaqs(response.data);
      } else {
        console.error("Failed to fetch FAQs");
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  const handleEdit = (faq) => {
    // Set the edited FAQ data including the _id
    setEditedFaq({ ...faq });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    // Close the edit dialog
    setEditDialogOpen(false);
  };

  const handleSaveEditedFaq = async () => {
    try {
      const response = await updateFaq(editedFaq, editedFaq._id); // Update the FAQ by its ID
      if (response.status === 200) {
        // Update the FAQ data in the list
        const updatedFaqs = faqs.map((faq) =>
          faq._id === editedFaq._id
            ? { ...faq, title: editedFaq.title, content: editedFaq.content }
            : faq
        );
        setFaqs(updatedFaqs);
        handleEditDialogClose(); // Close the edit dialog
      } else {
        console.error("Failed to update FAQ");
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
    }
  };

  const handleDelete = async (faqId) => {
    try {
      const response = await deleteFaq(faqId); // Delete the FAQ by its ID
      console.log("deleted", response);
      if (response.status === 200) {
        const responses = await getAllFaq();
        console.log("faqs", responses);
        // After successfully deleting the FAQ, update the FAQ list
        const updatedFaqs = responses.data.map((faq, index) => ({
          ...faq,
          id: index + 1,
        }));
        console.log("updatedFaqs", updatedFaqs);
        setFaqs(updatedFaqs);
        window.location.reload();
      } else {
        console.error("Failed to delete FAQ");
        // You can display an error message to the user here
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      // You can display an error message to the user here
    }
  };

  const handleView = async (faqId) => {
    try {
      const viewedFaq = await getFaq(faqId); // Fetch the FAQ by its ID
      // Implement logic to open a dialog or view the FAQ using the fetched data
      console.log("View FAQ:", viewedFaq);
    } catch (error) {
      console.error("Error viewing FAQ:", error);
      // You can display an error message to the user here
    }
  };
  console.log("editedFaq", editedFaq);
  useEffect(() => {
    fetchFaqs();
  }, []);
  console.log(faqs);
  return (
    <VendorDashboardLayout>
      <h1>FAQ Management</h1>
      <Button
        sx={{ mb: 4 }}
        variant="contained"
        color="primary"
        onClick={handleOpen}
      >
        Add FAQ
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {faqs.map((faq, index) => (
              <TableRow key={index}>
                <TableCell>{faq.title}</TableCell>
                <TableCell>{faq.content}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(faq)}
                    sx={{ mr: 2 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error" // Use a different color for Delete
                    onClick={() => handleDelete(faq._id)}
                    sx={{ mr: 2 }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="success" // Use a different color for View
                    onClick={() => handleViewDialogOpen(faq)}
                    sx={{ mr: 2 }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New FAQ</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={newFaq.title}
            sx={{ gap: 2, mb: 2 }}
            onChange={(e) => setNewFaq({ ...newFaq, title: e.target.value })}
          />
          <TextField
            label="Content"
            fullWidth
            value={newFaq.content}
            onChange={(e) => setNewFaq({ ...newFaq, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit FAQ</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={editedFaq.title}
            sx={{ gap: 2, mb: 2 }}
            onChange={(e) =>
              setEditedFaq({ ...editedFaq, title: e.target.value })
            }
          />
          <TextField
            label="Content"
            fullWidth
            value={editedFaq.content}
            onChange={(e) =>
              setEditedFaq({ ...editedFaq, content: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditDialogClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveEditedFaq}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewDialogOpen} onClose={handleViewDialogClose}>
        <DialogTitle>View FAQ</DialogTitle>
        <DialogContent sx={{ width: 500 }}>
          <Typography>Title: {viewedFaq.title}</Typography>
          <Typography>Content: {viewedFaq.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleViewDialogClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </VendorDashboardLayout>
  );
};

export default FAQManagement;
