import { Card, CardBody, CardHeader } from "react-bootstrap";

const pages = [
  {
    name: "Design Club",
    category: "Design & creativity",
    followers: "4,210",
    engagement: "5.2%",
    reach: "31,400",
  },
  {
    name: "Weekend Eats",
    category: "Food & dining",
    followers: "2,890",
    engagement: "3.7%",
    reach: "18,100",
  },
  {
    name: "City Frames",
    category: "Photography",
    followers: "5,380",
    engagement: "4.9%",
    reach: "36,700",
  },
];

const MyPages = () => (
  <div>
    <div className="mb-4">
      <h2 className="h4 mb-1">My Pages</h2>
      <p className="text-body-secondary mb-0">
        A snapshot of your page audience and performance.
      </p>
    </div>
    <div className="row g-3 mb-4">
      <div className="col-sm-4">
        <Card className="h-100">
          <CardBody>
            <div className="small text-body-secondary">Pages managed</div>
            <strong className="h3">3</strong>
          </CardBody>
        </Card>
      </div>
      <div className="col-sm-4">
        <Card className="h-100">
          <CardBody>
            <div className="small text-body-secondary">Combined followers</div>
            <strong className="h3">12,480</strong>
          </CardBody>
        </Card>
      </div>
      <div className="col-sm-4">
        <Card className="h-100">
          <CardBody>
            <div className="small text-body-secondary">Average engagement</div>
            <strong className="h3">4.6%</strong>
          </CardBody>
        </Card>
      </div>
    </div>
    <Card>
      <CardHeader className="bg-transparent">
        <h3 className="h6 mb-0">Page performance</h3>
      </CardHeader>
      <CardBody className="p-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th className="ps-3">Page</th>
                <th>Category</th>
                <th>Followers</th>
                <th>Engagement</th>
                <th className="pe-3">Reach</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.name}>
                  <th className="ps-3 fw-semibold">{page.name}</th>
                  <td>{page.category}</td>
                  <td>{page.followers}</td>
                  <td>{page.engagement}</td>
                  <td className="pe-3">{page.reach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  </div>
);

export default MyPages;
