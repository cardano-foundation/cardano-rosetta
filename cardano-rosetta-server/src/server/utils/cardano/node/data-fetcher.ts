import { clearIntervalAsync, setIntervalAsync, SetIntervalAsyncTimer } from 'set-interval-async/dynamic';
import { dummyLogger, Logger } from 'ts-log';

type FetchFunction<DataValue> = () => Promise<DataValue>;
const MS_PER_MINUTE = 1000;
const MODULE_NAME = 'DataFetcher';

export class DataFetcher<DataValue> {
  private pollingQueryTimer: SetIntervalAsyncTimer;
  private fetch: () => Promise<void>;
  private isFetching: boolean;
  public value: DataValue;

  constructor(
    public name: string,
    fetchFn: FetchFunction<DataValue>,
    private pollingInterval: number,
    private logger: Logger = dummyLogger
  ) {
    this.isFetching = false;
    this.fetch = async () => {
      if (this.isFetching) return;
      this.isFetching = true;
      this.value = await fetchFn();
      this.isFetching = false;
    };
  }

  public async initialize(): Promise<void> {
    await this.fetch();
    this.logger.debug({ module: MODULE_NAME, instance: this.name, value: this.value }, 'Initial value fetched');
    this.pollingQueryTimer = setIntervalAsync(async () => {
      await this.fetch();
      this.logger.debug(
        { module: MODULE_NAME, instance: this.name, value: this.value },
        `value fetched after ${this.pollingInterval / MS_PER_MINUTE} seconds`
      );
    }, this.pollingInterval);
  }

  public shutdown(): Promise<void> {
    this.logger.debug(`DataFetcher: ${this.name}: shutdown`);
    return clearIntervalAsync(this.pollingQueryTimer);
  }
}
