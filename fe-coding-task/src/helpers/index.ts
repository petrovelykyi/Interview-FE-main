import dayjs, { Dayjs } from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { CONST, DEFAULTS } from '../constants';
import { ChartData, FormValues, HouseTypes } from '../types';

dayjs.extend(quarterOfYear);

const getArrayOfQuarters = (start: Dayjs, end: Dayjs): Array<string> => {
  const result: Array<string> = [];

  const sY = dayjs(start).year();
  const sQ = dayjs(start).quarter();
  const eY = dayjs(end).year();
  const eQ = dayjs(end).quarter();

  for (let y = sY; y <= eY; y++) {
    let q = y === sY ? sQ : 1;
    const t = y === eY ? eQ : 4;

    for (q; q <= t; q++) {
      result.push(`${y}K${q}`);
    }
  }

  return result;
};

const getDateFromSearchParams = (search: URLSearchParams, param: string, restrictDate: string): Dayjs => {
  return search.has(param) && dayjs(search.get(param)).isValid() ? dayjs(search.get(param)) : dayjs(restrictDate);
};

const getValueByParam = <T extends Record<string, T[keyof T]>>(
  search: URLSearchParams,
  obj: T,
  param: string,
): keyof T => {
  return search.has(param) && obj.hasOwnProperty(search.get(param)!)
    ? (search.get(param)! as keyof T)
    : (Object.keys(obj)[0] as keyof T);
};

const getLocalStorageDataByKey = (key: string): Record<string, any> | string | undefined => {
  const localStore = localStorage.getItem(CONST.LOCAL_STORAGE_KEY);
  if (!localStore) {
    return undefined;
  }
  const localStorageData = JSON.parse(localStore);
  if (localStorageData.hasOwnProperty(key)) {
    return localStorageData[key];
  }
};

const getFormValues = (search: URLSearchParams, houseTypes: HouseTypes): FormValues => {
  // Parsing URL
  if (search.toString()) {
    return {
      startDate: getDateFromSearchParams(search, 'startDay', CONST.MIN_DATE),
      endDate: getDateFromSearchParams(search, 'endDay', CONST.MAX_DATE),
      houseType: getValueByParam(search, houseTypes, 'houseType'),
    };
  }

  // Parsing LocalStorage
  const searchParams = getLocalStorageDataByKey('searchParams');
  if (searchParams) {
    const searchParamsObj = Object.fromEntries(new URLSearchParams(searchParams).entries());
    return {
      startDate: dayjs(searchParamsObj.startDay),
      endDate: dayjs(searchParamsObj.endDay),
      houseType: searchParamsObj.houseType as keyof HouseTypes,
    };
  }

  // Initial
  return {
    startDate: dayjs(CONST.MIN_DATE),
    endDate: dayjs(CONST.MAX_DATE),
    houseType: Object.keys(houseTypes)[0] as keyof HouseTypes,
  };
};

const getChartDataValues = (search: URLSearchParams): ChartData => {
  const searchParams = getLocalStorageDataByKey('searchParams');
  const chartData = getLocalStorageDataByKey('chartData');
  if (chartData && search.toString() === searchParams) {
    return chartData as ChartData;
  }

  return DEFAULTS.chartData;
};

const getChartHeight = (chartHeight: number): number => {
  switch (true) {
    case chartHeight > 0 && chartHeight <= 10:
      return 400;
    case chartHeight > 10 && chartHeight <= 20:
      return 600;
    case chartHeight > 20 && chartHeight <= 30:
      return 800;
    case chartHeight > 30 && chartHeight <= 40:
      return 1000;
    case chartHeight > 40 && chartHeight <= 50:
      return 1200;
    case chartHeight > 50 && chartHeight <= 60:
      return 1400;
    case chartHeight > 60 && chartHeight <= 70:
      return 1600;
    default:
      return 300;
  }
};

export {
  getArrayOfQuarters,
  getDateFromSearchParams,
  getValueByParam,
  getFormValues,
  getLocalStorageDataByKey,
  getChartDataValues,
  getChartHeight,
};
