import { Card, CardBody, CardHeader } from "react-bootstrap";

const posts = [
  {
    title: "A little inspiration for the week",
    page: "Design Club",
    date: "Sep 28, 2026",
    reach: "12,480",
    engagement: "7.4%",
    interactions: "924",
  },
  {
    title: "Our favorite weekend spots",
    page: "Weekend Eats",
    date: "Sep 25, 2026",
    reach: "8,210",
    engagement: "6.1%",
    interactions: "501",
  },
  {
    title: "The city just after sunrise",
    page: "City Frames",
    date: "Sep 22, 2026",
    reach: "14,690",
    engagement: "8.2%",
    interactions: "1,204",
  },
  {
    title: "What should we make next?",
    page: "Design Club",
    date: "Sep 19, 2026",
    reach: "10,340",
    engagement: "5.8%",
    interactions: "600",
  },
];

const MyPosts = () => (
  <div>
    <div className="mb-4">
      <h2 className="h4 mb-1">My Posts</h2>
      <p className="text-body-secondary mb-0">
        Compare reach and interactions across your recent posts.
      </p>
    </div>
    <div className="row g-3 mb-4">
      <div className="col-sm-4">
        <Card className="h-100">
          <CardBody>
            <div className="small text-body-secondary">Posts published</div>
            <strong className="h3">24</strong>
          </CardBody>
        </Card>
      </div>
      <div className="col-sm-4">
        <Card className="h-100">
          <CardBody>
            <div className="small text-body-secondary">Total reach</div>
            <strong className="h3">86.2k</strong>
          </CardBody>
        </Card>
      </div>
      <div className="col-sm-4">
        <Card className="h-100">
          <CardBody>
            <div className="small text-body-secondary">Average engagement</div>
            <strong className="h3">6.9%</strong>
          </CardBody>
        </Card>
      </div>
    </div>
    <Card>
      <CardHeader className="bg-transparent">
        <h3 className="h6 mb-0">Recent post performance</h3>
      </CardHeader>
      <CardBody className="p-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th className="ps-3">Post</th>
                <th>Page</th>
                <th>Date</th>
                <th>Reach</th>
                <th>Engagement</th>
                <th className="pe-3">Interactions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.title}>
                  <th className="ps-3 fw-semibold">{post.title}</th>
                  <td>{post.page}</td>
                  <td>{post.date}</td>
                  <td>{post.reach}</td>
                  <td>{post.engagement}</td>
                  <td className="pe-3">{post.interactions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  </div>
);

export default MyPosts;
