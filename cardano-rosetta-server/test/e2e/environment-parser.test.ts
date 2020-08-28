import { parseEnvironment } from '../../src/server/utils/environment-parser';

const fakePath = 'fakePath';
const fakeHost = '129.this.412.is-a-super-fake-host12*312/40120|¿';
const fakeNumber = 'thisIsNotANumber';

const environmentParer = () => parseEnvironment();

describe('Environment parser test', () => {
  test('Should throw an error if a field is expected to be a number but its not', () => {
    const previousPort = process.env.PORT;
    process.env.PORT = Number(fakeNumber);
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: number | undefined): never => {
      throw new Error(code?.toString());
    });
    expect(environmentParer).toThrowError();
    expect(mockExit).toHaveBeenCalledWith(1);
    process.env.PORT = previousPort;
  });
  test('Should throw an error if a field is expected to be a valid file path but file does not exists', () => {
    const previousPath = process.env.CARDANOCLI_PATH;
    process.env.CARDANOCLI_PATH = fakePath;
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: number | undefined): never => {
      throw new Error(code?.toString());
    });
    expect(environmentParer).toThrowError();
    expect(mockExit).toHaveBeenCalledWith(1);
    process.env.CARDANOCLI_PATH = previousPath;
  });
  test('Should throw an error if a field is expected to be a valid file path with a valid schema but file has not a valid schema', () => {
    const previousPath = process.env.TOPOLOGY_FILE_PATH;
    process.env.TOPOLOGY_FILE_PATH = process.env.CARDANOCLI_PATH;
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: number | undefined): never => {
      throw new Error(code?.toString());
    });
    expect(environmentParer).toThrowError();
    expect(mockExit).toHaveBeenCalledWith(1);
    process.env.TOPOLOGY_FILE_PATH = previousPath;
  });

  test('Should throw an error if a field is expected to be a valid host but its not', () => {
    const previousAddress = process.env.BIND_ADDRESS;
    process.env.BIND_ADDRESS = fakeHost;
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: number | undefined): never => {
      throw new Error(code?.toString());
    });
    expect(environmentParer).toThrowError();
    expect(mockExit).toHaveBeenCalledWith(1);
    process.env.BIND_ADDRESS = previousAddress;
  });
});
