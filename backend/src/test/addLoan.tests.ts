// tests/addLoan.test.ts
import * as functions from "firebase-functions-test";
import * as admin from "firebase-admin";

// import your Cloud Function
import {addLoan} from "../functions/transaction";

const testEnv = functions();
const db = admin.firestore();

describe("addLoan", () => {
  afterAll(() => {
    // cleanup
    testEnv.cleanup();
  });

  it("should add a loan to Firestore", async () => {
    // Mock request and response objects
    const req: any = {
      body: {
        borrowerId: "user2",
        lenderId: "user1",
        description: "test loan",
        amount: 500,
        deadline: "2023-07-01T00:00:00.000Z",
      },
    };
    const res: any = {
      send: jest.fn(),
    };

    // Call the function
    await addLoan(req, res);

    // Check that a document was written to Firestore
    const loanSnap = await db.collection("Loans").get();
    expect(loanSnap.size).toBe(1);
  });
});
