import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Chart from 'react-apexcharts';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { fetchData } from './api';
import { CONST, DEFAULTS, houseTypes } from './constants';
import { getArrayOfQuarters, getChartDataValues, getChartHeight, getFormValues } from './helpers';
import type { ChartData, FormValues, RequestBody } from './types';

// Should be moved to API.
const API_URL = 'https://data.ssb.no/api/v0/en/table/07241';

const App: FC = (): JSX.Element => {
  const [search, setSearch] = useSearchParams();
  const [chartData, setChartData] = useState<ChartData>(getChartDataValues(search));
  const { watch, getValues, handleSubmit, control } = useForm<FormValues>({
    defaultValues: getFormValues(search, houseTypes),
  });

  const onSubmit: SubmitHandler<FormValues> = async ({ startDate, endDate, houseType }): Promise<void> => {
    const body: RequestBody = {
      query: [
        {
          code: 'Boligtype',
          selection: {
            filter: 'item',
            values: [houseType],
          },
        },
        {
          code: 'ContentsCode',
          selection: {
            filter: 'item',
            values: ['KvPris'],
          },
        },
        {
          code: 'Tid',
          selection: {
            filter: 'item',
            values: getArrayOfQuarters(startDate, endDate),
          },
        },
      ],
      response: {
        format: 'json-stat2',
      },
    };

    const res = await fetchData(API_URL, body);
    if (res instanceof AxiosError) {
      console.log(res.response?.data);
    } else {
      setChartData((prevState) => {
        return {
          ...prevState,
          options: {
            ...prevState.options,
            xaxis: {
              categories: Object.keys(res.data.dimension.Tid.category.index),
            },
          },
          series: [
            {
              name: res.data.source,
              data: res.data.value,
            },
          ],
        };
      });
    }
  };

  const handleSearchParams = useCallback(() => {
    const formValues = getValues();
    setSearch({
      startDay: `${formValues.startDate.format('YYYY-MM-DD')}`,
      endDay: `${formValues.endDate.format('YYYY-MM-DD')}`,
      houseType: formValues.houseType,
    });

    setChartData(DEFAULTS.chartData);
  }, [getValues, setSearch]);

  useEffect(() => {
    if (!search.toString()) {
      handleSearchParams();
    }
  }, [handleSearchParams, search]);

  useEffect(() => {
    localStorage.setItem(CONST.LOCAL_STORAGE_KEY, JSON.stringify({ searchParams: search.toString(), chartData }));
  }, [chartData, search]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack direction="column" spacing={3}>
            <Controller
              name={'startDate'}
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Start date"
                  views={['year', 'month']}
                  openTo="year"
                  minDate={dayjs(CONST.MIN_DATE)}
                  maxDate={watch('endDate')}
                  onAccept={handleSearchParams}
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            />
            <Controller
              name={'endDate'}
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="End date"
                  views={['year', 'month']}
                  openTo="year"
                  minDate={watch('startDate')}
                  maxDate={dayjs(CONST.MAX_DATE)}
                  onAccept={handleSearchParams}
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            />
            <Controller
              name={'houseType'}
              control={control}
              render={({ field }) => (
                <FormControl>
                  <InputLabel id="demo-simple-select-label">House type</InputLabel>
                  <Select {...field} id="demo-simple-select" label="house-type" onClick={handleSearchParams}>
                    {Object.entries(houseTypes).map(([k, v]) => {
                      return (
                        <MenuItem key={k} value={k}>
                          {v}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              )}
            />
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Stack>
        </LocalizationProvider>
      </form>
      <Box sx={{ marginTop: 4 }}>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          width={800}
          height={getChartHeight(chartData.series[0].data.length)}
        />
      </Box>
    </>
  );
};

export default App;
