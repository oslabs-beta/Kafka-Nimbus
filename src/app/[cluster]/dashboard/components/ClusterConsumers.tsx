
import { trpc } from "../../../../trpc/trpc-provider";

const ClusterTopics = () => {

  return (
      <div className="mt-8 w-full p-8">
        <h1 className="mb-8 text-3xl">Consumer Groups</h1>=

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Group ID</th>
                <th>Status</th>
                <th>Members</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
  );
};

export default ClusterTopics;
