export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (
          subject: string,
          data: string,
          callback: (err: any, guid: number) => void
        ) => {
          callback(undefined, Math.floor(Math.random() * 100) + 1);
        }
      ),
  },
};
