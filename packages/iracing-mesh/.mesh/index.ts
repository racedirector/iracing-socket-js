// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode } from "graphql";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  averageFuelUsage: Scalars["Float"];
  cars: Array<Scalars["String"]>;
  fuelUsage: Array<Scalars["Float"]>;
  isAverageUsageReliable: Scalars["Boolean"];
  lastFuelUsage?: Maybe<Scalars["Float"]>;
  tracksForCar: Array<Scalars["String"]>;
  currentDriver?: Maybe<Driver>;
};

export type QueryaverageFuelUsageArgs = {
  input: FuelUsageInputType;
};

export type QueryfuelUsageArgs = {
  input: FuelUsageInputType;
};

export type QueryisAverageUsageReliableArgs = {
  input: FuelUsageInputType;
};

export type QuerylastFuelUsageArgs = {
  input: FuelUsageInputType;
};

export type QuerytracksForCarArgs = {
  carName: Scalars["String"];
};

export type FuelUsageInputType = {
  carName: Scalars["String"];
  track: Scalars["String"];
};

export type Subscription = {
  legacySubscription?: Maybe<LegacySubscriptionPayload>;
};

export type SubscriptionlegacySubscriptionArgs = {
  input: LegacySubscriptionInput;
};

export type Driver = {
  carIndex: Scalars["Int"];
  carNumber?: Maybe<Scalars["String"]>;
  carNumberRaw?: Maybe<Scalars["Int"]>;
  userId: Scalars["Int"];
  userName: Scalars["String"];
  teamId?: Maybe<Scalars["Int"]>;
  teamName?: Maybe<Scalars["String"]>;
};

export type LegacySubscriptionInput = {
  fps: Scalars["Int"];
  requestParameters: Array<Scalars["String"]>;
  requestParametersOnce?: InputMaybe<Array<Scalars["String"]>>;
  readIBT: Scalars["Boolean"];
};

export type LegacySubscriptionPayload = {
  data: Scalars["String"];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  FuelUsageInputType: FuelUsageInputType;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Subscription: ResolverTypeWrapper<{}>;
  Driver: ResolverTypeWrapper<Driver>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  LegacySubscriptionInput: LegacySubscriptionInput;
  LegacySubscriptionPayload: ResolverTypeWrapper<LegacySubscriptionPayload>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  FuelUsageInputType: FuelUsageInputType;
  String: Scalars["String"];
  Float: Scalars["Float"];
  Boolean: Scalars["Boolean"];
  Subscription: {};
  Driver: Driver;
  Int: Scalars["Int"];
  LegacySubscriptionInput: LegacySubscriptionInput;
  LegacySubscriptionPayload: LegacySubscriptionPayload;
}>;

export type QueryResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = ResolversObject<{
  averageFuelUsage?: Resolver<
    ResolversTypes["Float"],
    ParentType,
    ContextType,
    RequireFields<QueryaverageFuelUsageArgs, "input">
  >;
  cars?: Resolver<Array<ResolversTypes["String"]>, ParentType, ContextType>;
  fuelUsage?: Resolver<
    Array<ResolversTypes["Float"]>,
    ParentType,
    ContextType,
    RequireFields<QueryfuelUsageArgs, "input">
  >;
  isAverageUsageReliable?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<QueryisAverageUsageReliableArgs, "input">
  >;
  lastFuelUsage?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType,
    RequireFields<QuerylastFuelUsageArgs, "input">
  >;
  tracksForCar?: Resolver<
    Array<ResolversTypes["String"]>,
    ParentType,
    ContextType,
    RequireFields<QuerytracksForCarArgs, "carName">
  >;
  currentDriver?: Resolver<
    Maybe<ResolversTypes["Driver"]>,
    ParentType,
    ContextType
  >;
}>;

export type SubscriptionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Subscription"] = ResolversParentTypes["Subscription"],
> = ResolversObject<{
  legacySubscription?: SubscriptionResolver<
    Maybe<ResolversTypes["LegacySubscriptionPayload"]>,
    "legacySubscription",
    ParentType,
    ContextType,
    RequireFields<SubscriptionlegacySubscriptionArgs, "input">
  >;
}>;

export type DriverResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Driver"] = ResolversParentTypes["Driver"],
> = ResolversObject<{
  carIndex?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  carNumber?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  carNumberRaw?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  userId?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  userName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  teamId?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  teamName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LegacySubscriptionPayloadResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["LegacySubscriptionPayload"] = ResolversParentTypes["LegacySubscriptionPayload"],
> = ResolversObject<{
  data?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Driver?: DriverResolvers<ContextType>;
  LegacySubscriptionPayload?: LegacySubscriptionPayloadResolvers<ContextType>;
}>;

import {
  MeshContext as BaseMeshContext,
  MeshInstance,
} from "@graphql-mesh/runtime";

import { InContextSdkMethod } from "@graphql-mesh/types";

export namespace TelemetryTypes {
  export type Maybe<T> = T | null;
  export type InputMaybe<T> = Maybe<T>;
  export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
  };
  export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
  };
  export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
  };
  /** All built-in and custom scalars, mapped to their actual values */
  export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
  };

  export type FuelUsageInputType = {
    carName: Scalars["String"];
    track: Scalars["String"];
  };

  export type Query = {
    averageFuelUsage: Scalars["Float"];
    cars: Array<Scalars["String"]>;
    fuelUsage: Array<Scalars["Float"]>;
    isAverageUsageReliable: Scalars["Boolean"];
    lastFuelUsage?: Maybe<Scalars["Float"]>;
    tracksForCar: Array<Scalars["String"]>;
  };

  export type QueryaverageFuelUsageArgs = {
    input: FuelUsageInputType;
  };

  export type QueryfuelUsageArgs = {
    input: FuelUsageInputType;
  };

  export type QueryisAverageUsageReliableArgs = {
    input: FuelUsageInputType;
  };

  export type QuerylastFuelUsageArgs = {
    input: FuelUsageInputType;
  };

  export type QuerytracksForCarArgs = {
    carName: Scalars["String"];
  };
}
export type QueryTelemetrySdk = {
  /** null **/
  averageFuelUsage: InContextSdkMethod<
    TelemetryTypes.Query["averageFuelUsage"],
    TelemetryTypes.QueryaverageFuelUsageArgs,
    MeshContext
  >;
  /** null **/
  cars: InContextSdkMethod<TelemetryTypes.Query["cars"], {}, MeshContext>;
  /** null **/
  fuelUsage: InContextSdkMethod<
    TelemetryTypes.Query["fuelUsage"],
    TelemetryTypes.QueryfuelUsageArgs,
    MeshContext
  >;
  /** null **/
  isAverageUsageReliable: InContextSdkMethod<
    TelemetryTypes.Query["isAverageUsageReliable"],
    TelemetryTypes.QueryisAverageUsageReliableArgs,
    MeshContext
  >;
  /** null **/
  lastFuelUsage: InContextSdkMethod<
    TelemetryTypes.Query["lastFuelUsage"],
    TelemetryTypes.QuerylastFuelUsageArgs,
    MeshContext
  >;
  /** null **/
  tracksForCar: InContextSdkMethod<
    TelemetryTypes.Query["tracksForCar"],
    TelemetryTypes.QuerytracksForCarArgs,
    MeshContext
  >;
};

export type MutationTelemetrySdk = {};

export type SubscriptionTelemetrySdk = {};

export namespace FuelDataTypes {
  export type Maybe<T> = T | null;
  export type InputMaybe<T> = Maybe<T>;
  export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
  };
  export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
  };
  export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
  };
  /** All built-in and custom scalars, mapped to their actual values */
  export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
  };

  export type Driver = {
    carIndex: Scalars["Int"];
    carNumber?: Maybe<Scalars["String"]>;
    carNumberRaw?: Maybe<Scalars["Int"]>;
    userId: Scalars["Int"];
    userName: Scalars["String"];
    teamId?: Maybe<Scalars["Int"]>;
    teamName?: Maybe<Scalars["String"]>;
  };

  export type Query = {
    currentDriver?: Maybe<Driver>;
  };

  export type LegacySubscriptionInput = {
    fps: Scalars["Int"];
    requestParameters: Array<Scalars["String"]>;
    requestParametersOnce?: InputMaybe<Array<Scalars["String"]>>;
    readIBT: Scalars["Boolean"];
  };

  export type LegacySubscriptionPayload = {
    data: Scalars["String"];
  };

  export type Subscription = {
    legacySubscription?: Maybe<LegacySubscriptionPayload>;
  };

  export type SubscriptionlegacySubscriptionArgs = {
    input: LegacySubscriptionInput;
  };
}
export type QueryFuelDataSdk = {
  /** null **/
  currentDriver: InContextSdkMethod<
    FuelDataTypes.Query["currentDriver"],
    {},
    MeshContext
  >;
};

export type MutationFuelDataSdk = {};

export type SubscriptionFuelDataSdk = {
  /** null **/
  legacySubscription: InContextSdkMethod<
    FuelDataTypes.Subscription["legacySubscription"],
    FuelDataTypes.SubscriptionlegacySubscriptionArgs,
    MeshContext
  >;
};

export type TelemetryContext = {
  ["Telemetry"]: {
    Query: QueryTelemetrySdk;
    Mutation: MutationTelemetrySdk;
    Subscription: SubscriptionTelemetrySdk;
  };
};

export type FuelDataContext = {
  ["Fuel Data"]: {
    Query: QueryFuelDataSdk;
    Mutation: MutationFuelDataSdk;
    Subscription: SubscriptionFuelDataSdk;
  };
};

export type MeshContext = TelemetryContext & FuelDataContext & BaseMeshContext;

import { getMesh } from "@graphql-mesh/runtime";
import { MeshStore, FsStoreStorageAdapter } from "@graphql-mesh/store";
import { path as pathModule } from "@graphql-mesh/cross-helpers";
import { fileURLToPath } from "@graphql-mesh/utils";

const importedModules: Record<string, any> = {};

const baseDir = pathModule.join(__dirname, "..");

const importFn = (moduleId: string) => {
  const relativeModuleId = (
    pathModule.isAbsolute(moduleId)
      ? pathModule.relative(baseDir, moduleId)
      : moduleId
  )
    .split("\\")
    .join("/")
    .replace(baseDir + "/", "");
  if (!(relativeModuleId in importedModules)) {
    throw new Error(`Cannot find module '${relativeModuleId}'.`);
  }
  return Promise.resolve(importedModules[relativeModuleId]);
};

const rootStore = new MeshStore(
  ".mesh",
  new FsStoreStorageAdapter({
    cwd: baseDir,
    importFn,
    fileType: "ts",
  }),
  {
    readonly: true,
    validate: false,
  },
);

import { findAndParseConfig } from "@graphql-mesh/cli";
function getMeshOptions() {
  console.warn(
    'WARNING: These artifacts are built for development mode. Please run "mesh build" to build production artifacts',
  );
  return findAndParseConfig({
    dir: baseDir,
    artifactsDir: ".mesh",
    configName: "mesh",
  });
}

export const documentsInSDL = /*#__PURE__*/ [];

export async function getBuiltMesh(): Promise<MeshInstance<MeshContext>> {
  const meshConfig = await getMeshOptions();
  return getMesh<MeshContext>(meshConfig);
}

export async function getMeshSDK<TGlobalContext = any, TOperationContext = any>(
  globalContext?: TGlobalContext,
) {
  const { sdkRequesterFactory } = await getBuiltMesh();
  return getSdk<TOperationContext>(sdkRequesterFactory(globalContext));
}

export type Requester<C = {}> = <R, V>(
  doc: DocumentNode,
  vars?: V,
  options?: C,
) => Promise<R>;
export function getSdk<C>(requester: Requester<C>) {
  return {};
}
export type Sdk = ReturnType<typeof getSdk>;
