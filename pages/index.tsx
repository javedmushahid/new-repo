import { useState } from "react";
import { NextPage } from "next";
import Box from "@mui/material/Box";
import Setting from "components/Setting";
import Footer from "pages-sections/landing/Footer";
import Section1 from "pages-sections/landing/Section1";
import Section2 from "pages-sections/landing/Section2";
import Section3 from "pages-sections/landing/Section3";
import Section4 from "pages-sections/landing/Section4";
import Section6 from "pages-sections/landing/Section6";
import Section5 from "pages-sections/landing/Section5";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import WishCard from "pages-sections/dashboard/WishCard";
import Card1 from "pages-sections/dashboard/Card1";
import { GetStaticProps } from "next";
import api from "utils/__api__/dashboard";
import { Grid } from "@mui/material";
import VendorDashboard from "./dashboard";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
type DashboardProps = {
  cardList: any[];
  recentPurchase: any[];
  stockOutProducts: any[];
};

const IndexPage: NextPage = (props: DashboardProps) => {
  const [filterDemo, setFilterDemo] = useState("");
  const { cardList, recentPurchase, stockOutProducts } = props;
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);

  console.log("Cardlist", cardList);
  return (
    <>
      <VendorDashboardLayout>
        <VendorDashboard
          cardList={cardList}
          recentPurchase={recentPurchase}
          stockOutProducts={stockOutProducts}
        />
      </VendorDashboardLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const cardList = await api.getAllCard();
  const recentPurchase = await api.recentPurchase();
  const stockOutProducts = await api.stockOutProducts();
  return { props: { cardList, recentPurchase, stockOutProducts } };
};

export default IndexPage;
