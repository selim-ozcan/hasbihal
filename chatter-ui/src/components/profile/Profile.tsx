import { Avatar, Button, Stack, Typography } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { useGetMe } from "../../hooks/useGetMe";
import { enqueueSnackbar } from "notistack";
import { queryClient } from "../../constants/query-client";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const me = useGetMe();
  const navigate = useNavigate();

  const handleFileUpload = async (event: any) => {
    try {
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      const res = await fetch(`http://localhost:3000/users/image`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Image upload failed.");
      }

      enqueueSnackbar("Image uploaded.", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Error uploading file.", { variant: "error" });
    }
  };

  return (
    <Stack
      spacing={6}
      sx={{
        marginTop: "2.5rem",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5">{me?.username}</Typography>
      <Avatar sx={{ width: 256, height: 256 }} src={me?.imageUrl} />
      <Button
        component="label"
        variant="contained"
        size="large"
        startIcon={<UploadFile />}
      >
        Upload Image
        <input type="file" hidden onChange={handleFileUpload} />
      </Button>
    </Stack>
  );
};

export default Profile;
