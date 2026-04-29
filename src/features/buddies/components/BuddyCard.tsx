import { Card, CardBody } from "react-bootstrap";
import type { Buddy } from "../types/buddy";

type BuddyCardProps = {
  buddy: Buddy;
};

const BuddyCard = ({ buddy }: BuddyCardProps) => {
  return (
    <Card>
      <CardBody>
        <h5>{buddy.name}</h5>
        <p>{buddy.followers} followers</p>
      </CardBody>
    </Card>
  );
};

export default BuddyCard;
