import { Card, CardBody } from "react-bootstrap";
import type { Page } from "../types/page";

type PageCardProps = {
  page: Page;
};

const PageCard = ({ page }: PageCardProps) => {
  return (
    <Card>
      <CardBody>
        <h5>{page.name}</h5>
        <p>{page.followers} followers</p>
      </CardBody>
    </Card>
  );
};

export default PageCard;
