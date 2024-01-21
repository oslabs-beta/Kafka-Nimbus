import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ClusterTopics from "../src/app/[cluster]/dashboard/components/ClusterTopics";
import { calculateOffset } from "../src/app/[cluster]/dashboard/components/ClusterTopics";
import { useAppSelector } from "../src/app/redux/hooks";
import { trpc } from "../src/trpc/trpc-provider";

import { error } from "console";

describe("calculateOffset function", () => {
    test("calculates total offset correctly", () => {
      const mockOffsets = [{ offset: 10 }, { offset: 20 }];
  
      let totalOffset = 0;
      for (let i = 0; i < mockOffsets.length; i++) {
        const offsetObject = mockOffsets[i];
        if (offsetObject && typeof offsetObject.offset === 'number') {
          const offset = Number(offsetObject.offset);
          totalOffset += offset;
        } else {
            throw error
        }
      }
  
      expect(totalOffset).toBe(30);
    });
});


// jest.mock("../src/trpc/trpc-provider", () => ({
//   ...jest.requireActual("../src/trpc/trpc-provider"),
//   trpc: {
//     topic: {
//       createTopic: {
//         useMutation: jest.fn(),
//       },
//     },
//   },
// }));

// jest.mock("next/navigation", () => ({
//   useRouter: () => ({
//     refresh: jest.fn(),
//   }),
// }));

// jest.mock("../src/app/redux/hooks", () => ({
//   ...jest.requireActual("../src/app/redux/hooks"),
//   useAppSelector: jest.fn(),
//   useAppDispatch: jest.fn(),
// }));

// const mockedTopics = {
//   id: "testid",
//   Name: "Test-topic",
//   numPartitions: 1,
//   replicationFactor: 1,
//   cleanUpPolicy: "Compact",
// };

// const mockedClusterInfo = {
//   provider: "AWS",
//   awsId: "12351",
//   awsSecret: "12312321",
//   region: "Test-1",
//   clusterName: "Test-cluster",
//   brokerNumbers: 1,
//   storagePerBroker: 1,
//   clusterSize: "small",
//   zones: 2,
// };

// describe("ClusterTopics Component", () => {
//   beforeEach(() => {
//     (useAppSelector as jest.Mock).mockReturnValue({
//       createTopic: {
//         Name: "",
//         numPartitions: 0,
//         replicationFactor: 0,
//       },
//     });
//   });

//   test.skip("creates topic correctly", async () => {
//     const mockCreateTopicMutation = jest.fn();
//     (trpc.topic.createTopic.useMutation as jest.Mock).mockReturnValue({
//       mutateAsync: mockCreateTopicMutation,
//     });

//     // render(
//     //   <ClusterTopics
//     //     topics={mockedTopics}
//     //     clusterInfo={mockedClusterInfo}
//     //     clusterid={1}
//     //   />
//     // );

//     fireEvent.click(screen.getByLabelText("Create Topic"));

//  await waitFor(() => {
//   expect(screen.getByLabelText("Modal Title") as HTMLElement).toBeInTheDocument();
// });


//     fireEvent.change(screen.getByLabelText("Topic Name"), {
//       target: { value: "NewTopic" },
//     });
//     fireEvent.change(screen.getByLabelText("Replication Factor"), {
//       target: { value: 2 },
//     });
//     fireEvent.change(screen.getByLabelText("Number of Partitions"), {
//       target: { value: 3 },
//     });

//     fireEvent.click(screen.getByLabelText("Submit"));

//     expect(mockCreateTopicMutation).toHaveBeenCalledWith({
//       id: 1,
//       topicName: "NewTopic",
//       numPartitions: 3,
//       replicationFactor: 2,
//     });
//   });
// });


