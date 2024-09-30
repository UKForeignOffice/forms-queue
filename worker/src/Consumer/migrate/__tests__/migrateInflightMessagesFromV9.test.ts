import { Pool } from "pg";
import { migrateInflightMessagesFromV9 } from "../helpers";

jest.mock("pg", () => {
  const mockPool = {
    connect: jest.fn().mockReturnThis(),
    query: jest.fn(),
    end: jest.fn(),
    on: jest.fn(),
    release: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

let pool;

beforeEach(() => {
  pool = new Pool();
});

afterEach(() => {
  jest.clearAllMocks();
});

test("migrateInflightMessagesFromV9 calls ROLLBACK is called if transaction fails", async () => {
  pool.query
    .mockResolvedValueOnce() // resolve the BEGIN query
    .mockRejectedValue(new Error("DB error"));

  await expect(migrateInflightMessagesFromV9("test", "pgboss")).rejects.toThrow();
  expect(pool.connect).toBeCalled();
  expect(pool.query).toBeCalledTimes(3);
  expect(pool.query.mock.calls[0]).toStrictEqual(["BEGIN"]);
  expect(pool.query.mock.calls[1][0]).toContain("INSERT INTO pgboss_test.job");
  expect(pool.query).toHaveBeenCalledWith("ROLLBACK");
  expect(pool.query).not.toHaveBeenCalledWith("COMMIT");
  expect(pool.release).toHaveBeenCalled();
});

test("migrateInflightMessagesFromV9 calls COMMIT is called if queries succeed", async () => {
  pool.query.mockResolvedValue();

  await migrateInflightMessagesFromV9("test", "pgboss");
  expect(pool.connect).toBeCalled();
  expect(pool.query).toBeCalledTimes(4);
  expect(pool.query.mock.calls[0]).toStrictEqual(["BEGIN"]);
  expect(pool.query.mock.calls[1][0]).toContain("INSERT INTO pgboss_test.job");
  expect(pool.query).toHaveBeenCalledWith("COMMIT");
  expect(pool.query).not.toHaveBeenCalledWith("ROLLBACK");
  expect(pool.release).toHaveBeenCalled();
});
