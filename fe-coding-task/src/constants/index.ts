import { ChartData } from '../types';

type DefaultTypes = {
  chartData: ChartData;
};

const CONST = {
  MIN_DATE: '2009-01-01',
  MAX_DATE: '2022-06-01',
  LOCAL_STORAGE_KEY: 'quarterStatistic',
};

const DEFAULTS: DefaultTypes = {
  chartData: {
    options: {
      chart: {
        id: 'apexchart',
      },
      xaxis: {
        categories: [],
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
    },
    series: [
      {
        name: '',
        data: [],
      },
    ],
  },
};

const houseTypes = {
  '00': 'Boliger i alt',
  '02': 'Småhus',
  '03': 'Blokkleiligheter',
};

export { CONST, DEFAULTS, houseTypes };
