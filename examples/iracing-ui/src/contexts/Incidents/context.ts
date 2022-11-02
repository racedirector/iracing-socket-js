import { getContext, getContextKey } from "../../utils";
import { SimIncidentsState } from "../../features/simIncidentsSlice";

export interface SimIncidentsContextType extends SimIncidentsState {}

const DEFAULT_CONTEXT: SimIncidentsContextType = {
  maxSimIncidentWeight: 2,
  incidents: [],
};

const contextKey = getContextKey("__IRACING_SIM_INCIDENTS_CONTEXT__");

export const getSimIncidentsContext = () => {
  const context = getContext(contextKey, DEFAULT_CONTEXT);
  context.displayName = "SimIncidentsContext";
  return context;
};

export { getSimIncidentsContext as resetSimIncidentsContext };
