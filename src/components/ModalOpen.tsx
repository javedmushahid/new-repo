// ErrorModal.jsx
import { Box, Modal, Typography, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

const ErrorModal = ({ open, handleClose, errorMessage }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Error
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2, color: 'red' }}>
          {errorMessage}
        </Typography>
      </Box>
    </Modal>
  );
};

export default ErrorModal;
