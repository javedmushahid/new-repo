// EditMentor.js

import { getAllMentorbyId } from "apiSetup";
import { H1 } from "components/Typography";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import EditMentorForm from "components/mentor/EditMentorForm";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

const EditMentor = () => {
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();
  const { slug } = router.query;
  const [mentorDetails, setMentorDetails] = useState([]);
  console.log("mentorDetails", mentorDetails);
  useEffect(() => {
    if (!slug) {
      enqueueSnackbar("Oops Mentor Not Found", { variant: "error" });
    } else {
      fetchMentor(slug);
    }
  }, [slug]);
  const fetchMentor = async (slug) => {
    try {
      const resMentor = await getAllMentorbyId(slug);
      setMentorDetails(resMentor.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <VendorDashboardLayout>
      <H1>Edit Mentor Details</H1>
      <EditMentorForm mentorDetails={mentorDetails} />
    </VendorDashboardLayout>
  );
};

export default EditMentor;
