import { FC } from "react";
import { Button, Card } from "@mui/material";
import { H5 } from "components/Typography";
import { FlexBetween } from "components/flex-box";
import DataListTable from "./table";
import { useRouter } from "next/router";

// table column list
const tableHeading = [
  { id: "SchoolId", label: "School ID", alignRight: false },
  { id: "School", label: "School Name", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "amount", label: "Total", alignCenter: true },
];

// ===================================================
type RecentPurchaseProps = { data: any[] };
// ===================================================

const RecentPurchase: FC<RecentPurchaseProps> = ({ data }) => {
  const router = useRouter();
  return (
    <Card>
      <FlexBetween px={3} py={2.5}>
        <H5>Recent Schools Added</H5>

        <Button
          size="small"
          color="info"
          variant="outlined"
          onClick={() => router.push("/admin/schools")}
        >
          All School
        </Button>
      </FlexBetween>

      <DataListTable
        dataList={data}
        tableHeading={tableHeading}
        type="RECENT_PURCHASE"
      />
    </Card>
  );
};

export default RecentPurchase;
