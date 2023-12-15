import { Result, Button } from "antd";
import { Link } from "react-router-dom";

const ServerError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Result
        status="500"
        title="500"
        subTitle="Oops! Something went wrong on our end."
        extra={
          <Link to="/">
            <Button size="large">
              Back Home
            </Button>
          </Link>
        }
        className="bg-white p-8 rounded-md shadow-md max-w-md w-full"
      />
    </div>
  );
};

export default ServerError;
