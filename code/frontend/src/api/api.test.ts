import { callConversationApi, historyDeleteAll } from "./api";

describe("api", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  test("historyDeleteAll requests the rooted delete endpoint", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });

    await historyDeleteAll();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/history/delete_all",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  test("callConversationApi surfaces the server error text", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "An error occurred. Please try again." }),
    });

    await expect(
      callConversationApi(
        { id: "1", messages: [] },
        new AbortController().signal
      )
    ).rejects.toThrow("An error occurred. Please try again.");
  });
});
