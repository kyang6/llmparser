// @ts-ignore
import dJSON from 'dirty-json';

export const smartParseDirtyJSON = (jsonStr: string): any => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return dJSON.parse(jsonStr);
};
