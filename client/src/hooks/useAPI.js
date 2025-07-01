import { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import apiService from "../utils/apiService";
import { schema } from "../redux/schema";

const dispatchAction =
  (dispatch) =>
  ({ type, data, readProps, mergeData, onSuccess, onFailure }) => {
    dispatch({ type, data, readProps, mergeData });

    if (onSuccess) {
      onSuccess(data);
    }

    if (onFailure) {
      onFailure(data);
    }
  };

const useAPI = (type, options) => {
  let apiSchema = schema[type];

  if (typeof apiSchema === "function") {
    apiSchema = apiSchema({});
  }

  const dispatch = useDispatch();

  const readProps = useSelector(
    (state) => state.applicationReducer[apiSchema.props],
    shallowEqual
  );

  const readConfig = (dataOptions) => {
    return { ...options, ...dataOptions };
  };

  const readAPISchema = (dataOptions) => {
    const optionConfig = readConfig(dataOptions);

    let apiSchemaFunction = schema[type];

    if (typeof apiSchemaFunction === "function") {
      apiSchemaFunction = apiSchemaFunction(optionConfig);
    }

    return apiSchemaFunction;
  };

  const requestData = (dataOptions) => {
    const parsedSchema = readAPISchema(dataOptions);
    const optionConfig = readConfig(dataOptions);

    if (optionConfig.clear) {
      dispatchAction(dispatch)({
        type: `${type}_CLEAR`,
        data: null,
        readProps: parsedSchema.props,
      });

      return;
    }

    if (!optionConfig.silent) {
      if (optionConfig.updateResult || optionConfig.refresh) {
        dispatchAction(dispatch)({
          type: `${type}_PENDING`,
          data: readProps?.data,
          readProps: parsedSchema.props,
        });
      } else {
        dispatchAction(dispatch)({
          type: `${type}_PENDING`,
          data: optionConfig.initialData,
          readProps: parsedSchema.props,
        });
      }
    }

    apiService({
      url: parsedSchema.url,
      method: parsedSchema.method,
      data: optionConfig.payload,
      headers: parsedSchema.headers,
      params: parsedSchema.params,
    })
      .then((response) => {
        if (optionConfig.updateResult) {
          const updatedResult = optionConfig.updateResult(
            readProps,
            response.data
          );

          dispatchAction(dispatch)({
            type: `${type}_SUCCESS`,
            data: updatedResult,
            readProps: parsedSchema.props,
            onSuccess: optionConfig.onSuccess,
            mergeData: optionConfig.mergeData,
          });
        } else {
          dispatchAction(dispatch)({
            type: `${type}_SUCCESS`,
            data: response?.data,
            readProps: parsedSchema.props,
            onSuccess: optionConfig.onSuccess,
            mergeData: optionConfig.mergeData,
          });
        }
      })
      .catch((error) => {
        dispatchAction(dispatch)({
          type: `${type}_FAILURE`,
          data: {
            errorStatus: "error",
            errorDescription: error?.response?.data?.error,
          },
          readProps: parsedSchema.props,
          onFailure: optionConfig.onFailure,
        });
      });
  };

  const fetchNext = (fetchNextOptions) => {
    requestData(fetchNextOptions);
  };

  const refresh = (refreshOptions) => {
    requestData({ ...refreshOptions, refresh: true });
  };

  const clear = (clearOptions) => {
    requestData({ ...clearOptions, clear: true });
  };

  useEffect(() => {
    if (!options.lazy) {
      requestData(options);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [readProps, requestData, { fetchNext, refresh, clear }];
};

export default useAPI;
