import { Result, Button } from "antd";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Result
        status="404"
        title="404"
        subTitle="Oops! The page you are looking for does not exist."
        extra={
          <Link to="/">
            <Button size="large">Back Home</Button>
          </Link>
        }
        className="bg-white p-8 rounded-md shadow-md max-w-md w-full"
      />
    </div>
  );
};

export default NotFound;
