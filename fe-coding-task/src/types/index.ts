import { Dayjs } from 'dayjs';
import { houseTypes } from '../constants';

export type HouseTypes = typeof houseTypes;

export type FormValues = {
  startDate: Dayjs;
  endDate: Dayjs;
  houseType: keyof HouseTypes;
};

export type RequestBody = {
  query: [
    {
      code: 'Boligtype';
      selection: {
        filter: 'item';
        values: string[];
      };
    },
    {
      code: 'ContentsCode';
      selection: {
        filter: 'item';
        values: ['KvPris'];
      };
    },
    {
      code: 'Tid';
      selection: {
        filter: 'item';
        values: string[];
      };
    },
  ];
  response: {
    format: 'json-stat2';
  };
};

export type ResponseData = {
  class: 'dataset';
  label: string;
  source: string;
  updated: string;
  id: string[];
  size: number[];
  dimension: {
    Boligtype: {
      label: 'type of building';
      category: {
        index: {
          [key: string]: number;
        };
        label: {
          [key: string]: number;
        };
      };
    };
    ContentsCode: {
      label: 'contents';
      category: {
        index: {
          KvPris: number;
        };
        label: {
          KvPris: 'Freeholder per km² (NOK)';
        };
        unit: {
          KvPris: {
            base: 'NOK';
            decimals: 0;
          };
        };
      };
    };
    Tid: {
      label: 'quarter';
      category: {
        index: {
          [key: string]: number;
        };
        label: {
          [key: string]: string;
        };
      };
    };
  };
  value: number[];
  role: {
    time: ['Tid'];
    metric: ['ContentsCode'];
  };
  version: string;
  extension: {
    px: {
      infofile: string;
      tableid: string;
      decimals: number;
    };
  };
};

export type ChartData = {
  options: {
    chart: {
      id: string;
    };
    plotOptions: {
      bar: {
        borderRadius: number;
        horizontal: boolean;
      };
    };
    dataLabels: {
      enabled: boolean;
    };
    xaxis: {
      categories: Array<number | string>;
    };
  };
  series: Array<{
    name: string;
    data: number[];
  }>;
};
