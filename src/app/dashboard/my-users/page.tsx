import { Card, CardBody, CardHeader } from "react-bootstrap";

const users = [
  {
    name: "Olivia Martin",
    handle: "@oliviamartin",
    follows: "Design Club",
    activity: "Liked 3 posts",
    lastSeen: "Today",
  },
  {
    name: "Noah Williams",
    handle: "@noahw",
    follows: "City Frames",
    activity: "Commented on a post",
    lastSeen: "Today",
  },
  {
    name: "Ava Johnson",
    handle: "@avaj",
    follows: "Weekend Eats",
    activity: "Shared a post",
    lastSeen: "Yesterday",
  },
  {
    name: "Liam Brown",
    handle: "@liambrown",
    follows: "Design Club",
    activity: "New follower",
    lastSeen: "Yesterday",
  },
  {
    name: "Mia Davis",
    handle: "@miadavis",
    follows: "City Frames",
    activity: "Liked 2 posts",
    lastSeen: "Sep 28",
  },
];

const MyUsers = () => (
  <div>
    <div className="mb-4">
      <h2 className="h4 mb-1">My Users</h2>
      <p className="text-body-secondary mb-0">
        Understand the people who follow and engage with your pages.
      </p>
    </div>
    <div className="row g-3 mb-4">
      <div className="col-sm-4">
        <Card className="h-100">
          <CardBody>
            <div className="small text-body-secondary">Total followers</div>
            <strong className="h3">12,480</strong>
          </CardBody>
        </Card>
      </div>
      <div className="col-sm-4">
        <Card className="h-100">
          <CardBody>
            <div className="small text-body-secondary">New this month</div>
            <strong className="h3">+946</strong>
          </CardBody>
        </Card>
      </div>
      <div className="col-sm-4">
        <Card className="h-100">
          <CardBody>
            <div className="small text-body-secondary">Active users</div>
            <strong className="h3">3,284</strong>
          </CardBody>
        </Card>
      </div>
    </div>
    <Card>
      <CardHeader className="bg-transparent">
        <h3 className="h6 mb-0">Recent audience activity</h3>
      </CardHeader>
      <CardBody className="p-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th className="ps-3">User</th>
                <th>Page</th>
                <th>Recent activity</th>
                <th className="pe-3">Last active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.handle}>
                  <th className="ps-3">
                    <div className="fw-semibold">{user.name}</div>
                    <div className="small text-body-secondary">
                      {user.handle}
                    </div>
                  </th>
                  <td>{user.follows}</td>
                  <td>{user.activity}</td>
                  <td className="pe-3">{user.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  </div>
);

export default MyUsers;
