import { useCallback, useState } from "react";

export type ReactiveApi<
  DataType,
  PropsType extends unknown[] = [],
  TransformedDataType = DataType
> = [
  (...props: [...PropsType]) => Promise<TransformedDataType>,
  Awaited<TransformedDataType> | undefined,
  ApiState<DataType>
];

export type ApiState<DataType> = {
  called: boolean;
  loading: boolean;
  response: DataType;
  error: Error;
};

export type ReactiveApiOptions<
  DataType,
  InterceptedDataType,
  TransformedDataType
> = {
  interceptor?: (rawResponse: DataType) => InterceptedDataType;
  transformer?: (
    rawResponse: Awaited<InterceptedDataType>
  ) => TransformedDataType;
};

/**
 * Transforme un appel api en hook react pour gérer la réactivité (loading, result, errors...)
 */
export default function useFetch<
  DataType,
  PropsType extends unknown[] = [],
  InterceptedDataType = DataType,
  TransformedDataType = DataType
>(
  call: (...props: [...PropsType]) => Promise<DataType>,
  {
    interceptor = (response) => response as unknown as InterceptedDataType,
    transformer = (response) => response as unknown as TransformedDataType,
  }: ReactiveApiOptions<DataType, InterceptedDataType, TransformedDataType> = {}
): ReactiveApi<DataType, PropsType, TransformedDataType> {
  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<Awaited<DataType>>();
  const [data, setData] = useState<Awaited<TransformedDataType>>();
  const [error, setError] = useState<Error>();

  const callback = useCallback(
    (...props: [...PropsType]) => {
      setCalled(true);
      setLoading(true);
      return new Promise<Awaited<TransformedDataType>>((resolve, reject) => {
        call(...props)
          .then(async (response) => {
            setResponse(await response);
            return response;
          })
          .then(interceptor)
          .then(async (response) => {
            const data = await transformer(await response);
            setData(data);
            resolve(data);
          })
          .catch((error) => {
            console.log({ error });
            setError(error);
            reject(error);
          })
          .finally(() => setLoading(false));
      });
    },
    [call, transformer, interceptor]
  );

  return [
    callback,
    data,
    {
      called,
      loading,
      error,
      response,
    } as ApiState<DataType>,
  ] as const;
}
